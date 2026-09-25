'use strict';
const {test} = require('node:test');
const assert = require('node:assert/strict');
const {createHandler} = require('./feedback.js');

const env={FEEDBACK_FORM_ENABLED:'true',FEEDBACK_EDGE_RATE_LIMIT_VERIFIED:'true',BREVO_API_KEY:'test-key'};
const valid={answer:'partly',note:'De navigatie mag duidelijker.',website:'',requestId:'123e4567-e89b-42d3-a456-426614174000'};
const run=async (body=valid,options={}) => {
  const response={headers:{},setHeader(k,v){this.headers[k]=v;},status(code){this.statusCode=code;return this;},json(value){this.jsonBody=value;return this;}};
  let sent;
  const handler=createHandler(options.env||env,async (url,request)=>{sent={url,request};return options.provider||{ok:true};},options.now||(()=>Date.parse('2026-09-24T12:00:00Z')));
  await handler({method:options.method||'POST',headers:{origin:options.origin||'https://www.matthijsvandam.nl','content-type':'application/json'},body},response);
  return {response,sent};
};

test('accepts short anonymous feedback via the existing mail provider',async()=>{
  const {response,sent}=await run();
  assert.equal(response.statusCode,200);
  const mail=JSON.parse(sent.request.body);
  assert.equal(sent.url,'https://api.brevo.com/v3/smtp/email');
  assert.equal(mail.subject,'[Websitefeedback] Gedeeltelijk');
  assert.match(mail.textContent,/De navigatie mag duidelijker/);
  assert.equal(mail.replyTo,undefined);
  assert.ok(mail.headers.idempotencyKey);
});

test('requires campaign gate and a verified edge rule',async()=>{
  const {response,sent}=await run(valid,{env:{BREVO_API_KEY:'test-key'}});
  assert.equal(response.statusCode,503);
  assert.equal(sent,undefined);
});

test('availability endpoint keeps the invitation hidden until the route is enabled',async()=>{
  const open=await run(valid,{method:'GET'});
  const closed=await run(valid,{method:'GET',env:{BREVO_API_KEY:'test-key'}});
  assert.deepEqual(open.response.jsonBody,{enabled:true});
  assert.deepEqual(closed.response.jsonBody,{enabled:false});
  assert.equal(open.sent,undefined);
});

test('rejects other origins, malformed answers and excess text',async()=>{
  assert.equal((await run(valid,{origin:'https://other.example'})).response.statusCode,403);
  assert.equal((await run({...valid,answer:'<script>'})).response.statusCode,400);
  assert.equal((await run({...valid,note:'x'.repeat(501)})).response.statusCode,400);
  assert.equal((await run({...valid,website:'bot'})).response.statusCode,400);
});

test('stops accepting feedback after the announced end',async()=>{
  const {response,sent}=await run(valid,{now:()=>Date.parse('2026-10-24T22:00:00Z')});
  assert.equal(response.statusCode,410);
  assert.equal(sent,undefined);
});
