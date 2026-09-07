'use strict';
// TEST ADAPTER ONLY. Atomic within this process; share the instance in concurrency tests.
// No production durability or cross-process lock is implied by this implementation.
function createMemoryStore({now=Date.now, retentionMs=86400000, maxRecords=500}={}) {
 const records=new Map(), current=new Map(), denied=new Map(), locks=new Map(), offLinks=new Map();
 function sweep() {
  for(const [hash,r] of records) if(r.deleteAt<=now() && r.state!=='processing') {
   records.delete(hash);if(current.get(r.key)===hash)current.delete(r.key);
  }
  for(const [hash,r] of offLinks) if(r.expires<=now())offLinks.delete(hash);
  // Denials/reconciliation fences deliberately survive record expiry for this demo session.
  // A production retention policy must keep withdrawal precedence without retaining pending PII.
 }
 function find(hash) {sweep();return records.get(hash);}
 return {
  kind:'memory-test-only',
  put(hash,record) {
   sweep();const previous=records.get(current.get(record.key));
   if(locks.has(record.key)||previous?.state==='processing'||denied.get(record.key)==='uncertain')return false;
   if(records.size>=maxRecords)throw Error('Proeflimiet bereikt.');
   if(previous) {previous.state='superseded';delete previous.data;}
   records.set(hash,{...structuredClone(record),state:'mailing',deleteAt:now()+retentionMs});
   current.set(record.key,hash);return true;
  },
  mailResult(hash,ok) {
   const r=find(hash);if(r?.state==='mailing')r.state=ok?'pending':'delivery_unknown';
  },
  claim(hash) {
   const r=find(hash);
   if(!r || r.state!=='pending' || r.expires<=now() || current.get(r.key)!==hash || denied.get(r.key)==='uncertain')return null;
   r.state='processing';return structuredClone(r);
  },
  stillCurrent(hash) {
   const r=find(hash);return !!r && r.state==='processing' && current.get(r.key)===hash && r.expires>now();
  },
  complete(hash,state) {
   const r=records.get(hash);if(!r)return;
   r.state=state;delete r.data;
   if(state==='confirmed')denied.delete(r.key);
   if(state==='needs_reconciliation')denied.set(r.key,'uncertain');
  },
  withdraw(key) {
   if(denied.get(key)!=='uncertain')denied.set(key,'withdrawn');const hash=current.get(key);current.delete(key);
   const r=records.get(hash);
   if(r && r.state!=='processing') {r.state='revoked';delete r.data;}
  },
  uncertain(key) {denied.set(key,'uncertain');},
  suppressed(key) {return denied.has(key);},
  unresolved(key) {return denied.get(key)==='uncertain';},
  issueOff(hash,key,email,expires) {offLinks.set(hash,{key,email,expires});},
  takeOff(hash) {
   sweep();const r=offLinks.get(hash);if(!r)return null;
   offLinks.delete(hash);return {...r};
  },
  async withLock(key,action) {
   const previous=locks.get(key)||Promise.resolve();let release;
   const next=new Promise(resolve=>{release=resolve;});locks.set(key,next);
   await previous;
   try{return await action();}finally {release();if(locks.get(key)===next)locks.delete(key);}
  },
  // Tests/admin diagnostics: only state/counts; no token, URL, e-mail or pending payload output.
  status(hash) {const r=find(hash);return r?{state:r.state,expires:r.expires,hasData:!!r.data}:null;},
  counts() {sweep();return {requests:records.size,offLinks:offLinks.size};}
 };
}
module.exports={createMemoryStore};
