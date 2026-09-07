'use strict';
// Local rehearsal only: this models requirements, not verified Brevo behavior.
const {randomUUID}=require('node:crypto');
function createPreviewFlow(now=Date.now) {
 const tokens=new Map(), subscribers=new Map(), revisions=new Map();
 function issue(kind,record) {
  const token=randomUUID();
  tokens.set(token,{kind,...structuredClone(record),revision:revisions.get(record.email)||0,expires:now()+900000});
  return token;
 }
 function consume(kind,token) {
  const record=tokens.get(token);
  if(!record || record.kind!==kind || record.expires<=now() || (kind==='confirm' && record.revision!==(revisions.get(record.email)||0))) throw Error('De proeflink is verlopen of al gebruikt.');
  tokens.delete(token);
  return record;
 }
 return {
  request(record) {
   for(const [token,r] of tokens) if(r.expires<=now())tokens.delete(token);
   return issue('confirm',record);
  },
  confirm(token) {
   const record=consume('confirm',token), previous=subscribers.get(record.email);
   subscribers.set(record.email,{email:record.email,voornaam:record.voornaam,achternaam:record.achternaam,streams:[...new Set([...(previous?.streams||[]),...record.streams])]});
   revisions.set(record.email,(revisions.get(record.email)||0)+1);
   return issue('unsubscribe',{email:record.email});
  },
  unsubscribe(token) {
   const record=consume('unsubscribe',token);
   subscribers.delete(record.email);
   revisions.set(record.email,(revisions.get(record.email)||0)+1);
  },
  snapshot(email) { return structuredClone(subscribers.get(email)); }
 };
}
module.exports={createPreviewFlow};
