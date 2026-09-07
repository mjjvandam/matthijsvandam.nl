'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const {createPreviewFlow}=require('./preview-flow.cjs');
const person={email:'test@example.com',voornaam:'Test',achternaam:'Persoon',streams:['algemeen']};
test('new signup stores names and preferences only after confirmation; link single use',()=>{
 const f=createPreviewFlow(),token=f.request(person);
 assert.equal(f.snapshot(person.email),undefined);
 f.confirm(token);
 assert.deepEqual(f.snapshot(person.email),person);
 assert.throws(()=>f.confirm(token));
});
test('existing signup changes nothing before confirmation, then adds only requested choices',()=>{
 const f=createPreviewFlow();f.confirm(f.request(person));
 const token=f.request({...person,voornaam:'Nieuwe naam',streams:['patienten-voet-enkel']});
 assert.deepEqual(f.snapshot(person.email),person);
 f.confirm(token);
 assert.deepEqual(f.snapshot(person.email),{...person,voornaam:'Nieuwe naam',streams:['algemeen','patienten-voet-enkel']});
});
test('wrong-purpose links cannot confirm or unsubscribe',()=>{
 const f=createPreviewFlow(),token=f.request(person);
 assert.throws(()=>f.unsubscribe(token));
 const unsubscribe=f.confirm(token);
 assert.throws(()=>f.confirm(unsubscribe));
 assert.deepEqual(f.snapshot(person.email),person);
});
test('unsubscribe invalidates pending confirmation; fresh verified signup needed',()=>{
 const f=createPreviewFlow(),unsubscribe=f.confirm(f.request(person));
 const old=f.request({...person,streams:['patienten-voet-enkel']});
 f.unsubscribe(unsubscribe);
 assert.equal(f.snapshot(person.email),undefined);
 assert.throws(()=>f.confirm(old));assert.throws(()=>f.unsubscribe(unsubscribe));
 const fresh=f.request(person);
 assert.equal(f.snapshot(person.email),undefined);
 f.confirm(fresh);assert.deepEqual(f.snapshot(person.email),person);
});
test('expired and superseded confirmations cannot change preferences',()=>{
 let clock=0;const f=createPreviewFlow(()=>clock),expired=f.request(person);
 clock=900000;assert.throws(()=>f.confirm(expired));
 const older=f.request(person),newer=f.request({...person,streams:['patienten-voet-enkel']});
 f.confirm(newer);assert.throws(()=>f.confirm(older));
 assert.deepEqual(f.snapshot(person.email).streams,['patienten-voet-enkel']);
});

test('unsubscribe link from an earlier confirmed signup remains usable',()=>{
 const f=createPreviewFlow(),oldUnsubscribe=f.confirm(f.request(person));
 f.confirm(f.request({...person,streams:['patienten-voet-enkel']}));
 f.unsubscribe(oldUnsubscribe);assert.equal(f.snapshot(person.email),undefined);
});
