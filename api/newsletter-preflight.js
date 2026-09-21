'use strict';

const {readBrevoNewsletterHistory} = require('./brevo-newsletter-history.cjs');

function createHandler(env=process.env, fetchImpl=fetch) {
  return async (request, response) => {
    response.setHeader('Cache-Control','no-store');
    response.setHeader('X-Content-Type-Options','nosniff');
    if (request.method !== 'GET') {
      response.setHeader('Allow','GET');
      return response.status(405).json({code:'method'});
    }
    const secret = env.NEWSLETTER_PREFLIGHT_SECRET;
    const authorization = String(request.headers.authorization || '');
    if (!secret || authorization !== `Bearer ${secret}`) return response.status(404).json({code:'not_found'});
    try {
      const provider = await readBrevoNewsletterHistory({apiKey:env.BREVO_API_KEY, fetchImpl});
      return response.status(200).json({
        ok:true,
        historyComplete:provider.historyComplete,
        historyCheckedAt:provider.historyCheckedAt,
        campaigns:provider.history.map(({campaignId,editionId,status,at}) => ({campaignId,editionId,status,at})),
      });
    } catch (error) {
      return response.status(503).json({ok:false,code:'provider_unavailable',message:error.message});
    }
  };
}

module.exports = createHandler();
module.exports.createHandler = createHandler;
