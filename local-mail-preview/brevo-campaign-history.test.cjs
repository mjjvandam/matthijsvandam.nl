'use strict';
const assert = require('node:assert/strict');
const test = require('node:test');
const {readBrevoNewsletterHistory, normalizeCampaign, isNewsletter} = require('./brevo-campaign-history.cjs');

test('reads only newsletter campaigns and maps sent/scheduled states', async () => {
  let request;
  const result = await readBrevoNewsletterHistory({apiKey:'secret', fetchImpl:async (url, options) => {
    request = {url, options};
    return {ok:true, json:async () => ({count:3, campaigns:[
      {id:11,name:'Matthijs van Dam 2026-01 — nieuwsbrief',status:'sent',sentDate:'2026-01-13T09:00:00Z'},
      {id:12,name:'Matthijs van Dam 2026-02 — nieuwsbrief',status:'scheduled',scheduledAt:'2026-02-10T09:00:00Z'},
      {id:99,name:'Andere campagne',status:'sent',sentDate:'2026-01-01T09:00:00Z'},
    ]})};
  }});
  assert.equal(request.options.method,'GET');
  assert.equal(request.options.headers['api-key'],'secret');
  assert.equal(result.history.length,2);
  assert.deepEqual(result.history.map(item => item.status),['sent','pending']);
  assert.equal(result.history[0].editionId,'brevo-11');
});

test('fails closed on missing key, unknown status and provider errors', async () => {
  await assert.rejects(() => readBrevoNewsletterHistory(), /API-sleutel ontbreekt/);
  assert.throws(() => normalizeCampaign({id:1,name:'Matthijs van Dam nieuwsbrief',status:'mystery',sentDate:'2026-01-01'}), /Onbekende/);
  await assert.rejects(() => readBrevoNewsletterHistory({apiKey:'secret',fetchImpl:async () => ({ok:false})}), /kon niet worden gelezen/);
});

test('recognises explicit newsletter tag without leaking unrelated campaigns', () => {
  assert.equal(isNewsletter({name:'Interne test',tag:'mvd-nieuwsbrief'}),true);
  assert.equal(isNewsletter({name:'Interne test',tag:'other'}),false);
});
