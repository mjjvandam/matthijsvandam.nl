'use strict';
const assert = require('node:assert/strict');
const test = require('node:test');
const {run} = require('./run-newsletter-preflight.cjs');

const response = campaigns => ({ok:true, json:async () => ({count:campaigns.length, campaigns})});
const fetchImpl = async () => response([]);

test('fails closed without provider key', async () => {
  const inputPath = '/private/tmp/mvd-newsletter-preflight-empty.json';
  const fs = require('node:fs/promises');
  await fs.writeFile(inputPath, JSON.stringify({recipients:[]}));
  await assert.rejects(() => run({inputPath,editionId:'2026-01',fetchImpl,env:{}}), /API-sleutel ontbreekt/);
});

test('does not enable sending even with an empty live history', async () => {
  const inputPath = '/private/tmp/mvd-newsletter-preflight-test.json';
  const fs = require('node:fs/promises');
  await fs.writeFile(inputPath, JSON.stringify({distributionApproved:true,quotaRemaining:200,recipients:[{email:'test@example.invalid',confirmed:true,blocklisted:false,matchingArticleIds:['a']}]}));
  const result = await run({inputPath,editionId:'2026-01',fetchImpl,env:{BREVO_API_KEY:'test-key'}});
  assert.equal(result.sendEnabled,false);
  assert.equal(result.eligible.length,1);
});
