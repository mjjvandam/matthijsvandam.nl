'use strict';
const {createService}=require('./core.cjs');
function createBrevo({apiKey,fetchImpl=fetch}) {
 async function request(path,options={}) {
  try {return await fetchImpl('https://api.brevo.com/v3'+path,{...options,headers:{'api-key':apiKey,'Content-Type':'application/json',...options.headers},signal:AbortSignal.timeout(10000)});}
  catch {throw Error('brevo_unavailable');} // Never expose email-bearing URLs/errors.
 }
 return {
  async contactExists(email) {
   const r=await request('/contacts/'+encodeURIComponent(email));
   if(r.status===404) return false;
   if(!r.ok) throw Error('contact_status_unknown');
   const data=await r.json();
   if(!Number.isInteger(data.id)) throw Error('contact_response_unknown');
   return true;
  },
  async deliveryStatus(record) {
   // Check sender-independent suppressions too: an unsubscribe/complaint may
   // concern a different message from the original DOI email.
   for(let offset=0;;offset+=100) {
    if(offset>=10000) throw Error('suppression_list_incomplete');
    const response=await request('/smtp/blockedContacts?limit=100&offset='+offset);
    if(!response.ok) throw Error('suppression_status_unknown');
    const page=await response.json();
    if(!Array.isArray(page.contacts)||!Number.isInteger(page.count)||page.count<0) throw Error('suppression_response_unknown');
    if(page.contacts.some(c=>c.email?.toLowerCase()===record.email)) return 'blocked';
    if(offset+page.contacts.length>=page.count) break;
    if(page.contacts.length===0) throw Error('suppression_list_incomplete');
   }
   const query=new URLSearchParams({email:record.email,messageId:record.messageId,days:'7',limit:'1000'});
   const r=await request('/smtp/statistics/events?'+query);
   if(!r.ok) throw Error('delivery_status_unknown');
   const data=await r.json();
   if(!Array.isArray(data.events)||data.events.length===1000) throw Error('delivery_events_incomplete');
   const events=data.events.filter(e=>e.email?.toLowerCase()===record.email&&e.messageId===record.messageId&&e.templateId===9);
   if(events.some(e=>['hardBounces','hard_bounce','blocked','invalid','invalid_email','spam','unsubscribed','error','softBounces','soft_bounce'].includes(e.event))) return 'blocked';
   return events.some(e=>e.event==='delivered')?'delivered':'unknown';
  },
  async sendReminder(email,{subject,text}) {
   const r=await request('/smtp/email',{method:'POST',body:JSON.stringify({sender:{name:'Matthijs van Dam',email:'website@mail.matthijsvandam.nl'},to:[{email}],subject,textContent:text,tags:['mvd-doi-reminder']})});
   if(!r.ok) throw Error('reminder_send_failed');
   const data=await r.json();
   if(typeof data.messageId!=='string') throw Error('reminder_send_uncertain');
  }
 };
}
function createBlobStore(blob) {
 const store={
  async read(pathname) {
   const result=await blob.get(pathname,{access:'private',useCache:false});
   if(result===null) return null;
   if(result.statusCode!==200||!result.stream) throw Error('state_read_failed');
   return JSON.parse(await new Response(result.stream).text());
  },
  async create(pathname,value) {
   try {await blob.put(pathname,JSON.stringify(value),{access:'private',addRandomSuffix:false,allowOverwrite:false,contentType:'application/json'});return true;}
   catch {if(await store.read(pathname))return false;throw Error('state_create_failed');}
  },
  async remove(pathname) {await blob.del(pathname);},
  async *scan(prefix) {
   let cursor;
   do {const page=await blob.list({prefix,cursor,limit:1000});for(const item of page.blobs)yield {pathname:item.pathname,uploadedAt:new Date(item.uploadedAt).getTime()};cursor=page.hasMore?page.cursor:undefined;}while(cursor);
  }
 };return store;
}
async function runtime(env=process.env) {
 const [blob,{QueueClient}]=await Promise.all([import('@vercel/blob'),import('@vercel/queue')]);
 const queue=new QueueClient({region:'fra1'});
 const service=createService({env,store:createBlobStore(blob),queue,brevo:createBrevo({apiKey:env.BREVO_API_KEY})});
 return {service,queue};
}
module.exports={createBrevo,createBlobStore,runtime};
