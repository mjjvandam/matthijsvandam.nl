'use strict';
const assert = require('node:assert/strict');
const test = require('node:test');
const createHandler = require('./newsletter-preflight.js').createHandler;

function response() {
  return {headers:{},statusCode:200,setHeader(k,v){this.headers[k]=v;},status(n){this.statusCode=n;return this;},json(value){this.body=value;return this;}};
}
const fetchImpl = async () => ({ok:true,json:async()=>({count:0,campaigns:[]})});

test('requires bearer secret and returns only read-only summary', async () => {
  const handler = createHandler({NEWSLETTER_PREFLIGHT_SECRET:'route-secret',BREVO_API_KEY:'brevo-secret'},fetchImpl);
  const denied = response(); await handler({method:'GET',headers:{}},denied); assert.equal(denied.statusCode,404);
  const accepted = response(); await handler({method:'GET',headers:{authorization:'Bearer route-secret'}},accepted);
  assert.equal(accepted.statusCode,200); assert.equal(accepted.body.ok,true); assert.deepEqual(accepted.body.campaigns,[]);
});

test('never exposes provider key and fails closed on provider error', async () => {
  const handler = createHandler({NEWSLETTER_PREFLIGHT_SECRET:'route-secret',BREVO_API_KEY:'brevo-secret'},async()=>({ok:false}));
  const result = response(); await handler({method:'GET',headers:{authorization:'Bearer route-secret'}},result);
  assert.equal(result.statusCode,503); assert.equal(JSON.stringify(result.body).includes('brevo-secret'),false);
});
