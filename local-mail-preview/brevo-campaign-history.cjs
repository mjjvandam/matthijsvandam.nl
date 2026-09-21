'use strict';

// Read-only provider adapter. It never creates, schedules or sends a campaign.
// The API key must remain server-side; tests inject fetchImpl and never use a key.

const NEWSLETTER_NAME = /^Matthijs van Dam\b/i;
const ALLOWED_STATUSES = new Set(['sent', 'queued', 'draft', 'scheduled', 'suspended', 'archive']);

function dateOf(campaign) {
  return campaign.sentDate || campaign.sendAt || campaign.scheduledAt || campaign.createdAt;
}

function statusOf(campaign) {
  const status = String(campaign.status || '').toLowerCase();
  if (status === 'sent') return 'sent';
  if (status === 'queued' || status === 'scheduled') return 'pending';
  if (status === 'draft' || status === 'suspended' || status === 'archive') return 'confirmed_not_sent';
  return 'unknown';
}

function isNewsletter(campaign) {
  const name = String(campaign.name || '');
  return NEWSLETTER_NAME.test(name) || String(campaign.tag || '').toLowerCase() === 'mvd-nieuwsbrief';
}

function normalizeCampaign(campaign) {
  if (!campaign || campaign.id == null || !dateOf(campaign)) throw new Error('Onvolledige Brevo-campagnehistorie');
  const status = statusOf(campaign);
  if (!ALLOWED_STATUSES.has(String(campaign.status || '').toLowerCase())) throw new Error('Onbekende Brevo-campagnestatus');
  return {
    campaignId: String(campaign.id),
    // Explicit edition tags can be added later; campaign ID is a safe fallback.
    editionId: String(campaign.tag || '').startsWith('mvd-nieuwsbrief-') ? String(campaign.tag) : `brevo-${campaign.id}`,
    kind: 'newsletter',
    status,
    at: dateOf(campaign),
    name: String(campaign.name || ''),
    recipientsLists: Array.isArray(campaign.recipientsLists) ? campaign.recipientsLists.map(String) : [],
  };
}

async function readBrevoNewsletterHistory({apiKey, baseUrl='https://api.brevo.com/v3', limit=50, fetchImpl=fetch} = {}) {
  if (!apiKey) throw new Error('Brevo API-sleutel ontbreekt');
  if (!Number.isInteger(limit) || limit < 1 || limit > 50) throw new Error('Ongeldige Brevo-limiet');
  let response;
  try {
    response = await fetchImpl(`${baseUrl}/emailCampaigns?limit=${limit}&sort=desc`, {
      method: 'GET',
      headers: {'api-key': apiKey, accept: 'application/json'},
      signal: AbortSignal.timeout(8000),
    });
  } catch {
    throw new Error('Brevo-historie onzeker; geen automatische verzending toestaan');
  }
  if (!response || !response.ok) throw new Error('Brevo-historie kon niet worden gelezen');
  const payload = await response.json();
  if (!payload || !Array.isArray(payload.campaigns)) throw new Error('Brevo-historie heeft een onbekend formaat');
  const campaigns = payload.campaigns.filter(isNewsletter);
  return {
    historyComplete: payload.count == null || campaigns.length < limit || payload.count <= limit,
    historyCheckedAt: new Date().toISOString(),
    history: campaigns.map(normalizeCampaign),
  };
}

module.exports = {readBrevoNewsletterHistory, normalizeCampaign, isNewsletter};
