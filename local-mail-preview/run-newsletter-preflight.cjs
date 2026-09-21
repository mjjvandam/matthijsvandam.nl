'use strict';

// Production-facing read-only guard. It deliberately requires the caller to
// provide the recipient snapshot; it never reads or writes contact data itself.
const fs = require('node:fs/promises');
const path = require('node:path');
const {readBrevoNewsletterHistory} = require('./brevo-campaign-history.cjs');
const {preflight} = require('./edition-preflight.cjs');

async function run({inputPath, now, editionId, fetchImpl=fetch, env=process.env} = {}) {
  if (!inputPath || !editionId) throw new Error('Ontvangersbestand en editie-ID zijn verplicht');
  const raw = await fs.readFile(path.resolve(inputPath), 'utf8');
  const input = JSON.parse(raw);
  if (!Array.isArray(input.recipients)) throw new Error('Ontvangersbestand bevat geen recipients-array');
  const provider = await readBrevoNewsletterHistory({apiKey:env.BREVO_API_KEY, fetchImpl});
  const effectiveNow = now || provider.historyCheckedAt;
  const result = preflight({
    now:effectiveNow,
    editionId,
    recipients: input.recipients,
    history: provider.history,
    historyComplete: provider.historyComplete,
    historyCheckedAt: provider.historyCheckedAt,
    distributionApproved: input.distributionApproved === true,
    quotaRemaining: Number.isInteger(input.quotaRemaining) ? input.quotaRemaining : 0,
  });
  return {...result, providerCheckedAt:provider.historyCheckedAt, editionId};
}

if (require.main === module) {
  const [, , inputPath, editionId] = process.argv;
  run({inputPath, editionId}).then(result => {
    process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
  }).catch(error => {
    process.stderr.write(`Nieuwsbrief-preflight geblokkeerd: ${error.message}\n`);
    process.exitCode = 1;
  });
}

module.exports = {run};
