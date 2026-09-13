'use strict';
// Read-only rehearsal. No network, persistence, scheduling or mail transport.
const normalize=email=>String(email).trim().toLowerCase();
const stamp=value=>{const t=Date.parse(value);if(!Number.isFinite(t))throw Error('Ongeldige datum');return t;};
function yearAgo(now){const d=new Date(now),month=d.getUTCMonth();d.setUTCFullYear(d.getUTCFullYear()-1);if(d.getUTCMonth()!==month)d.setUTCDate(0);return d.getTime();}
function preflight({now,editionId,recipients,history,historyComplete,historyCheckedAt,distributionApproved,quotaRemaining}){
 const current=stamp(now),cutoff=yearAgo(current);
 if(historyComplete!==true)throw Error('Volledige verzendhistorie ontbreekt');
 if(stamp(historyCheckedAt)>current||current-stamp(historyCheckedAt)>300000)throw Error('Providercontrole moet actueel zijn');
 if(!Number.isInteger(quotaRemaining)||quotaRemaining<0)throw Error('Dagquota onbekend');
 if(!editionId||!Array.isArray(history)||!Array.isArray(recipients))throw Error('Onvolledige invoer');
 const events=history.map(e=>{if(!['sent','delivered','pending','unknown','failed','confirmed_not_sent'].includes(e.status)||!['newsletter','confirmation','contact'].includes(e.kind)||!e.campaignId||!e.editionId||!e.email)throw Error('Onbekende historische status');return {...e,email:normalize(e.email),time:stamp(e.at)};});
 if(events.some(e=>e.time>current))throw Error('Historie ligt in de toekomst');
 const contacts=new Map();for(const c of recipients){const key=normalize(c.email);if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(key))throw Error('Ongeldig adres');const old=contacts.get(key);if(old&&JSON.stringify({...old,email:key})!==JSON.stringify({...c,email:key}))throw Error('Tegenstrijdige contactgegevens');contacts.set(key,{...c,email:key});}
 const eligible=[],excluded=[];
 for(const [email,c] of contacts){
  let reason='';
  const seen=events.filter(e=>e.email===email&&e.kind==='newsletter'&&!['failed','confirmed_not_sent'].includes(e.status));
  const count=new Set(seen.filter(e=>e.time>=cutoff).map(e=>e.campaignId)).size;
  if(distributionApproved!==true)reason='distributievrijgave ontbreekt';
  else if(c.confirmed!==true||c.blocklisted!==false)reason='geen actuele bevestigde toestemming';
  else if(!Array.isArray(c.matchingArticleIds)||!c.matchingArticleIds.length)reason='geen passende nieuwe artikelen';
  else if(seen.some(e=>e.editionId===editionId))reason='editie al verstuurd of verzendstatus onzeker';
  else if(count>=12)reason='jaargrens bereikt';
  if(reason)excluded.push({email,reason});else eligible.push({email,articleIds:[...new Set(c.matchingArticleIds)]});
 }
 if(eligible.length>Math.min(200,quotaRemaining))throw Error('Dagquota overschreden; niet stilzwijgend afkappen');
 return {mode:'dry-run',sendEnabled:false,eligible,excluded};
}
module.exports={preflight,yearAgo};
