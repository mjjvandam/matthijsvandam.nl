'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const {createMemoryStore}=require('./confirmation-store.cjs');
const {createConfirmationService,hashToken,CONSENT_VERSION}=require('./confirmation-service.cjs');
const {renderConfirmationMail,renderNewsletterExample}=require('./mail-layout.cjs');
const streams=require('./config.json').streams;
const person={voornaam:'Proef',achternaam:'Persoon',email:'test@example.com',audience:'patienten',streams:['algemeen'],consent:true,website:''};
function deferred(){let resolve;return {promise:new Promise(r=>{resolve=r;}),resolve:(...a)=>resolve(...a)};}
function fixture(options={}) {
 let clock=1000;const store=createMemoryStore({now:()=>clock});const outbox=[],rows=new Map(),calls=[];
 const provider={
  async sendConfirmation(mail){outbox.push(mail);},
  async applyConfirmed(data){calls.push('apply');const old=rows.get(data.email);rows.set(data.email,{...data,streams:[...new Set([...(old?.streams||[]),...data.streams])],blocked:false});},
  async block(email){calls.push('block');if(rows.has(email))rows.get(email).blocked=true;}
 };
 const settings={store,provider,streams,origin:'http://127.0.0.1:8879',identityKey:Buffer.alloc(32,1),now:()=>clock,...options};
 const service=createConfirmationService(settings);
 const token=()=>new URLSearchParams(new URL(outbox.at(-1).text.split('\n').find(s=>s.startsWith('http'))).hash.slice(1)).get('token');
 return {service,settings,store,provider,outbox,rows,calls,token,advance:ms=>{clock+=ms;}};
}
test('request sends only confirmation; token bound to original payload and consent version',async()=>{
 const f=fixture();assert.equal((await f.service.request({...person,consentVersion:'forged',listIds:[999]})).ok,true);
 assert.equal(f.rows.size,0);const token=f.token();assert.equal(token.length,43);
 assert.equal(f.store.status(token),null);assert.equal(f.store.status(hashToken(token)).state,'pending');
 assert.equal((await f.service.confirm(token)).ok,true);
 const saved=f.rows.get(person.email);assert.equal(saved.voornaam,'Proef');assert.deepEqual(saved.streams,['algemeen']);assert.equal(saved.consentVersion,CONSENT_VERSION);assert.equal(saved.listIds,undefined);assert.equal(saved.operationId,hashToken(token));
 assert.equal(f.store.status(hashToken(token)).hasData,false);
 assert.equal((await f.service.confirm(token)).ok,false);assert.equal(f.calls.length,1);
});
test('old link cannot activate newest request or alter existing data',async()=>{
 const f=fixture();await f.service.request(person);const first=f.token();await f.service.confirm(first);
 await f.service.request({...person,voornaam:'Nieuw',streams:['patienten-voet-enkel']});const second=f.token();
 assert.equal((await f.service.confirm(first)).ok,false);assert.equal(f.rows.get(person.email).voornaam,'Proef');
 await f.service.confirm(second);assert.equal(f.rows.get(person.email).voornaam,'Nieuw');assert.deepEqual(f.rows.get(person.email).streams,['algemeen','patienten-voet-enkel']);
});
test('new request replaces unclicked older request',async()=>{
 const f=fixture();await f.service.request(person);const old=f.token();await f.service.request({...person,voornaam:'Anders'});
 assert.equal((await f.service.confirm(old)).ok,false);assert.equal(f.rows.size,0);
 assert.equal((await f.service.confirm(f.token())).ok,true);assert.equal(f.rows.get(person.email).voornaam,'Anders');
});
test('tampered and expired tokens do not call the provider; pending PII expires',async()=>{
 const f=fixture({ttlMs:1000});await f.service.request(person);const token=f.token();
 for(const bad of [undefined,[],token+'x','x'.repeat(43)])assert.equal((await f.service.confirm(bad)).ok,false);
 f.advance(1000);assert.equal((await f.service.confirm(token)).ok,false);assert.equal(f.calls.length,0);
 f.advance(86400000);assert.equal(f.store.status(hashToken(token)),null);
});
test('two service instances share atomic claim; provider called once',async()=>{
 const f=fixture();const other=createConfirmationService(f.settings);await f.service.request(person);const gate=deferred(),started=deferred();
 f.provider.applyConfirmed=async()=>{f.calls.push('apply');started.resolve();await gate.promise;};
 const first=f.service.confirm(f.token());await started.promise;
 assert.equal((await other.confirm(f.token())).ok,false);gate.resolve();assert.equal((await first).ok,true);assert.equal(f.calls.length,1);
});
test('withdrawal invalidates pending token; fresh signup still needs fresh confirmation',async()=>{
 const f=fixture();await f.service.request(person);const first=f.token();const confirmed=await f.service.confirm(first);
 await f.service.request({...person,voornaam:'Anders'});const pending=f.token();
 await f.service.unsubscribe(confirmed.unsubscribeToken);assert.equal(f.rows.get(person.email).blocked,true);
 assert.equal((await f.service.confirm(pending)).ok,false);assert.equal((await f.service.confirm(first)).ok,false);
 await f.service.request(person);assert.equal(f.rows.get(person.email).blocked,true);
 assert.equal((await f.service.confirm(f.token())).ok,true);assert.equal(f.rows.get(person.email).blocked,false);
});
test('confirmation token cannot unsubscribe, unsubscribe token cannot confirm',async()=>{
 const f=fixture();await f.service.request(person);const token=f.token();assert.equal((await f.service.unsubscribe(token)).ok,false);
 const done=await f.service.confirm(token);assert.equal((await f.service.confirm(done.unsubscribeToken)).ok,false);
 assert.equal((await f.service.unsubscribe(done.unsubscribeToken)).ok,true);assert.equal((await f.service.unsubscribe(done.unsubscribeToken)).ok,false);
});
test('withdrawal during provider update wins and blocks delivery immediately',async()=>{
 const f=fixture();await f.service.request(person);const first=await f.service.confirm(f.token());await f.service.request({...person,voornaam:'Nieuw'});
 const gate=deferred(),started=deferred(),apply=f.provider.applyConfirmed;
 f.provider.applyConfirmed=async d=>{started.resolve();await gate.promise;await apply(d);};
 const confirming=f.service.confirm(f.token());await started.promise;
 const withdrawing=f.service.unsubscribe(first.unsubscribeToken);assert.equal(f.service.isDeliverySuppressed(person.email),true);
 assert.equal((await f.service.request(person)).ok,false);
 gate.resolve();assert.equal((await confirming).ok,false);assert.equal((await withdrawing).ok,true);assert.equal(f.rows.get(person.email).blocked,true);
});
test('provider error is not retried or reported as success',async()=>{
 const f=fixture();await f.service.request(person);const token=f.token();f.provider.applyConfirmed=async()=>{f.calls.push('apply');throw Error('private provider detail');};
 const result=await f.service.confirm(token);assert.equal(result.code,'pending_review');assert.ok(!JSON.stringify(result).includes('private'));
 assert.equal(f.service.isDeliverySuppressed(person.email),true);assert.equal((await f.service.confirm(token)).ok,false);assert.equal((await f.service.request(person)).ok,false);assert.equal(f.calls.length,1);
});
test('late provider completion after timeout remains suppressed and needs reconciliation',async()=>{
 const f=fixture({providerTimeoutMs:20});await f.service.request(person);const gate=deferred(),apply=f.provider.applyConfirmed;
 f.provider.applyConfirmed=async d=>{await gate.promise;await apply(d);};
 assert.equal((await f.service.confirm(f.token())).code,'pending_review');
 await f.service.receiveVerifiedWithdrawal(person.email);gate.resolve();await new Promise(r=>setImmediate(r));
 assert.equal(f.service.isDeliverySuppressed(person.email),true);assert.equal((await f.service.request(person)).ok,false);
});
test('uncertain confirmation-mail delivery makes token unusable without auto retry',async()=>{
 const f=fixture();f.provider.sendConfirmation=async mail=>{f.outbox.push(mail);throw Error('timeout');};
 assert.equal((await f.service.request(person)).code,'delivery_unknown');assert.equal((await f.service.confirm(f.token())).ok,false);assert.equal(f.outbox.length,1);
});
test('email markup escapes choices and puts token only in URL fragment',()=>{
 const mail=renderConfirmationMail({url:'https://matthijsvandam.nl/bevestigen#token=example',streams:['<script>bad</script>'],minutes:30,consentText:'Consent & more'});
 assert.ok(!mail.html.includes('<script>'));assert.ok(mail.html.includes('&lt;script&gt;'));assert.ok(mail.html.includes('#token=example'));assert.ok(!mail.html.includes('<img'));assert.ok(!mail.html.includes('DOIurl'));
 assert.ok(renderNewsletterExample().includes('plaatsaanduidingen'));assert.ok(mail.html.includes('#244c3d'));assert.ok(mail.html.includes('#f7f4ed'));
});
