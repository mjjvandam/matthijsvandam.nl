'use strict';
const {createHmac,timingSafeEqual}=require('node:crypto');
const HOUR=3600000, MAX_AGE=7*24*HOUR;
const TOPIC='mvd-doi-reminders';
const SUBJECT='Bevestig je inschrijving voor mijn nieuwsbrief';
const TEXT=`Je hebt je twee dagen geleden aangemeld voor mijn nieuwsbrief. Je inschrijving is nog niet bevestigd.

Wil je de nieuwsbrief ontvangen? Open dan de eerdere bevestigingsmail en klik op ‘Bevestig mijn inschrijving’. Kijk ook in je spammap. Vind je het bericht daar, markeer het dan als ‘Geen spam’ en verplaats het naar je inbox. Je kunt website@mail.matthijsvandam.nl toevoegen aan je contacten of veilige afzenders.

Wil je de nieuwsbrief toch niet ontvangen of heb je je niet zelf aangemeld? Dan hoef je niets te doen. Dit is de enige herinnering.

Hartelijke groet,
Matthijs van Dam`;
function equal(a,b) {const x=Buffer.from(String(a||'')),y=Buffer.from(String(b||''));return x.length===y.length&&timingSafeEqual(x,y);}
function settings(env) {
 const activatedAt=Date.parse(env.DOI_REMINDER_START_AT||'');
 if(env.DOI_REMINDER_ENABLED!=='true'||!Number.isFinite(activatedAt)) throw Error('reminders_disabled');
 for(const key of ['DOI_REMINDER_WEBHOOK_SECRET','DOI_REMINDER_HASH_SECRET','BREVO_API_KEY']) if(!env[key]||env[key].length<24) throw Error('reminder_configuration_missing');
 return {activatedAt,templateId:9};
}
function emailKey(email,secret) {return createHmac('sha256',secret).update(email).digest('hex');}
function pendingPath(key) {return `doi-reminders/pending/${key}.json`;}
function receiptPath(key) {return `doi-reminders/receipts/${key}.json`;}
function createService({env,store,queue,brevo,now=Date.now}) {
 async function register(event,authorization) {
  const cfg=settings(env);
  if(!equal(authorization,`Bearer ${env.DOI_REMINDER_WEBHOOK_SECRET}`)) return {status:401};
  if(!event||event.event!=='request'||event.template_id!==cfg.templateId) return {status:204};
  const email=String(event.email||'').trim().toLowerCase();
  const at=Number(event.ts_event)*1000;
  if(!/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(email)||email.length>254||typeof event['message-id']!=='string'||event['message-id'].length>300||!Number.isFinite(at)) return {status:400};
  // Do not import old logs or resurrect an old request via webhook replay.
  if(at<cfg.activatedAt||at>now()+60000||now()-at>24*HOUR) return {status:204};
  const key=emailKey(email,env.DOI_REMINDER_HASH_SECRET);
  const receipt=await store.read(receiptPath(key));
  if(receipt) return {status:204};
  const record={v:1,key,email,messageId:event['message-id'],at,dueAt:at+48*HOUR};
  // Atomic create: the first submission owns this 30-day reminder window.
  await store.create(pendingPath(key),record);
  const pending=await store.read(pendingPath(key));
  if(!pending||pending.v!==1) throw Error('pending_state_missing');
  // Queue idempotency is supplemented by the durable receipt at dispatch.
  await queue.send(TOPIC,{key},{delaySeconds:Math.max(0,Math.ceil((pending.dueAt-now())/1000)),retentionSeconds:604800,idempotencyKey:key});
  return {status:204};
 }
 async function dispatch(message) {
  settings(env);
  if(!message||! /^[a-f0-9]{64}$/.test(message.key)) throw Error('invalid_queue_message');
  const key=message.key;
  if(await store.read(receiptPath(key))) return 'already_handled';
  const record=await store.read(pendingPath(key));
  if(!record) return 'missing_or_expired';
  if(record.key!==key||emailKey(record.email,env.DOI_REMINDER_HASH_SECRET)!==key) throw Error('invalid_pending_state');
  if(now()<record.dueAt) throw Error('not_due');
  if(now()-record.at>MAX_AGE) {await store.remove(pendingPath(key));return 'expired';}
  // Any existing contact is suppressed, including unsubscribed/blocklisted contacts.
  // Unknown/error responses throw; only an explicit Brevo 404 counts as absent.
  const exists=await brevo.contactExists(record.email);
  const status=await brevo.deliveryStatus(record);
  if(exists||status!=='delivered') {
   await store.create(receiptPath(key),{v:1,at:now(),outcome:'suppressed'});
   await store.remove(pendingPath(key));
   return 'suppressed';
  }
  // Recheck as close as possible to the send. A provider-side confirmation in
  // the remaining network interval cannot be made atomic with SMTP submission.
  if(await brevo.contactExists(record.email)) {
   await store.create(receiptPath(key),{v:1,at:now(),outcome:'suppressed'});
   await store.remove(pendingPath(key));return 'suppressed';
  }
  // Persist before SMTP. A crash/timeout sacrifices a reminder rather than
  // risking a duplicate. The receipt is deliberately never released on error.
  if(!await store.create(receiptPath(key),{v:1,at:now(),outcome:'attempted'})) return 'already_handled';
  try {await brevo.sendReminder(record.email,{subject:SUBJECT,text:TEXT});}
  finally {await store.remove(pendingPath(key));}
  return 'sent';
 }
 async function cleanup() {
  const timestamp=now(); let removed=0;
  for await(const item of store.scan('doi-reminders/')) {
   const age=timestamp-item.uploadedAt;
   const limit=item.pathname.startsWith('doi-reminders/pending/')?MAX_AGE:30*24*HOUR;
   if(age>limit) {await store.remove(item.pathname);removed++;}
  }
  return removed;
 }
 return {register,dispatch,cleanup};
}
module.exports={createService,emailKey,equal,TEXT,SUBJECT,TOPIC};
