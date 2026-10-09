'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const {createBrevo,createBlobStore}=require('../lib/newsletter-reminders/providers.cjs');
const record={email:'example@example.invalid',messageId:'<original>'};
const ok=data=>new Response(JSON.stringify(data),{status:200});
test('contact absent requires explicit 404; auth errors fail closed',async()=>{
 for(const status of [401,403,429,500]) await assert.rejects(createBrevo({apiKey:'test',fetchImpl:async()=>new Response('',{status})}).contactExists(record.email));
 assert.equal(await createBrevo({apiKey:'test',fetchImpl:async()=>new Response('',{status:404})}).contactExists(record.email),false);
 await assert.rejects(createBrevo({apiKey:'test',fetchImpl:async()=>ok({})}).contactExists(record.email));
});
test('suppression on a different message blocks reminder',async()=>{
 const provider=createBrevo({apiKey:'test',fetchImpl:async url=>{assert.match(url,/blockedContacts/);return ok({count:1,contacts:[{email:record.email}]});}});
 assert.equal(await provider.deliveryStatus(record),'blocked');
});
test('all suppression pages checked before original delivery evidence',async()=>{
 let calls=0;
 const provider=createBrevo({apiKey:'test',fetchImpl:async url=>{
  calls++;if(url.includes('blockedContacts'))return ok(calls===1?{count:101,contacts:Array.from({length:100},()=>({email:'other@example.invalid'}))}:{count:101,contacts:[{email:'last@example.invalid'}]});
  return ok({events:[{email:record.email,messageId:record.messageId,templateId:9,event:'delivered'}]});
 }});
 assert.equal(await provider.deliveryStatus(record),'delivered');assert.equal(calls,3);
});
test('wrong message/template cannot establish delivery',async()=>{
 for(const changed of [{messageId:'<different>'},{templateId:8}]) {
  const provider=createBrevo({apiKey:'test',fetchImpl:async url=>ok(url.includes('blockedContacts')?{count:0,contacts:[]}:{events:[{email:record.email,messageId:record.messageId,templateId:9,event:'delivered',...changed}]})});
  assert.equal(await provider.deliveryStatus(record),'unknown');
 }
});
test('incomplete suppression data fails closed',async()=>{
 const provider=createBrevo({apiKey:'test',fetchImpl:async()=>ok({count:1,contacts:[]})});
 await assert.rejects(provider.deliveryStatus(record),/incomplete/);
});
test('Blob existing object is preserved; storage failure never means success',async()=>{
 const existing={v:1};let value=existing;
 const store=createBlobStore({put:async()=>{throw Error('exists');},get:async()=>value?{statusCode:200,stream:new Blob([JSON.stringify(value)]).stream()}:null});
 assert.equal(await store.create('path',{v:2}),false);assert.deepEqual(await store.read('path'),existing);
 value=null;await assert.rejects(store.create('path',{}),/state_create_failed/);
});
