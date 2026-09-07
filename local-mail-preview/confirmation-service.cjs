'use strict';
const {randomBytes,createHash,createHmac}=require('node:crypto');
const {validate}=require('./core.cjs');
const {renderConfirmationMail}=require('./mail-layout.cjs');
const CONSENT_VERSION='mvd-newsletter-2026-09-06-v1';
const CONSENT_TEXT='Ik wil de gekozen nieuwsbrieven per e-mail ontvangen.';
const hashToken=token=>typeof token==='string'&&/^[A-Za-z0-9_-]{43}$/.test(token)?createHash('sha256').update(token).digest('hex'):null;
const failure=()=>({ok:false,code:'invalid_link',message:'Deze link is verlopen, al gebruikt of vervangen. Meld je opnieuw aan voor een nieuwe bevestigingsmail.'});
function createConfirmationService({store,provider,streams,identityKey,origin,now=Date.now,ttlMs=1800000,providerTimeoutMs=8000}) {
 if(!Buffer.isBuffer(identityKey)||identityKey.length<32)throw Error('Een aparte sleutel is vereist.');
 const base=new URL(origin);
 if(base.pathname!=='/'||base.search||base.hash||base.username||base.password||!(base.protocol==='https:'||(base.protocol==='http:'&&base.hostname==='127.0.0.1')))throw Error('Ongeldige bevestigingshost.');
 if(!Number.isSafeInteger(ttlMs)||ttlMs<1000||ttlMs>86400000)throw Error('Ongeldige geldigheidsduur.');
 const call=async action=>{
  let timer;
  try{return await Promise.race([Promise.resolve().then(action),new Promise((_,reject)=>{timer=setTimeout(()=>reject(Error('Provider outcome uncertain')),providerTimeoutMs);})]);}
  finally{clearTimeout(timer);}
 };
 const identity=email=>createHmac('sha256',identityKey).update(email).digest('hex');
 return {
  async request(body) {
   const data=validate('subscribe',body,streams),key=identity(data.email);
   const token=randomBytes(32).toString('base64url'),hash=hashToken(token),expires=now()+ttlMs;
   const queued=store.put(hash,{key,data,expires,consentVersion:CONSENT_VERSION,consentText:CONSENT_TEXT});
   if(!queued)return {ok:false,code:'pending_review',message:'Een eerdere aanvraag wordt nog verwerkt. Er is geen nieuwe mail verstuurd.'};
   // Fragment keeps the secret out of GET/access logs and HTTP Referer. The page clears it immediately.
   const url=base.origin+'/bevestigen#token='+token;
   const mail=renderConfirmationMail({url,expires,minutes:Math.ceil(ttlMs/60000),streams:data.streams.map(id=>streams.find(s=>s.id===id).label),consentText:CONSENT_TEXT});
   try {await call(()=>provider.sendConfirmation({to:data.email,...mail}));store.mailResult(hash,true);}
   catch {store.mailResult(hash,false);return {ok:false,code:'delivery_unknown',message:'De verzendstatus is onzeker. Er wordt niet automatisch opnieuw verstuurd.'};}
   return {ok:true,code:'confirmation_requested',message:'Controleer je e-mail en bevestig je inschrijving met de link in de mail.'};
  },
  async confirm(token) {
   const hash=hashToken(token);if(!hash)return failure();
   const claim=store.claim(hash);if(!claim)return failure();
   return store.withLock(claim.key,async()=>{
    if(!store.stillCurrent(hash)) {store.complete(hash,'revoked');return failure();}
    try {
     await call(()=>provider.applyConfirmed({...claim.data,operationId:hash,consentVersion:claim.consentVersion,consentText:claim.consentText,confirmedAt:new Date(now()).toISOString()}));
     if(!store.stillCurrent(hash)) {
      // Withdrawal/expiry wins; the local send gate remains closed until this is resolved.
      store.withdraw(claim.key);
      await call(()=>provider.block(claim.data.email));
      store.complete(hash,'revoked');return failure();
     }
     store.complete(hash,'confirmed');
     const off=randomBytes(32).toString('base64url');
     store.issueOff(hashToken(off),claim.key,claim.data.email,now()+86400000);
     return {ok:true,code:'confirmed',message:'Je inschrijving is bevestigd.',unsubscribeToken:off};
    } catch {
     store.complete(hash,'needs_reconciliation');
     return {ok:false,code:'pending_review',message:'De verwerking is nog niet bevestigd. We verwerken deze aanvraag niet automatisch opnieuw.'};
    }
   });
  },
  async unsubscribe(token) {
   const hash=hashToken(token),record=hash&&store.takeOff(hash);if(!record)return failure();
   // Revoke first, before waiting for an in-flight provider operation.
   store.withdraw(record.key);
   return store.withLock(record.key,async()=>{
    try {await call(()=>provider.block(record.email));if(store.unresolved(record.key))return {ok:false,code:'pending_review',message:'Je afmelding is geregistreerd. Een eerdere onzekere verwerking moet nog worden gecontroleerd.'};return {ok:true,code:'unsubscribed',message:'Je bent uitgeschreven.'};}
    catch {store.uncertain(record.key);return {ok:false,code:'pending_review',message:'Je afmelding is geregistreerd. De verwerking bij de maildienst moet nog worden gecontroleerd.'};}
   });
  },
  // INTERNAL ONLY: a production webhook must authenticate, deduplicate and order its events first.
  async receiveVerifiedWithdrawal(email) {
   const key=identity(email.trim().toLowerCase());store.withdraw(key);
   return store.withLock(key,async()=>{
    try{await call(()=>provider.block(email));return {ok:!store.unresolved(key)};}catch{store.uncertain(key);return {ok:false};}
   });
  },
  isDeliverySuppressed(email) {return store.suppressed(identity(email.trim().toLowerCase()));}
 };
}
module.exports={createConfirmationService,hashToken,CONSENT_VERSION,CONSENT_TEXT};
