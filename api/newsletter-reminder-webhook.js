'use strict';
const {runtime}=require('../lib/newsletter-reminders/providers.cjs');
module.exports=async function(req,res) {
 res.setHeader('Cache-Control','no-store');
 if(req.method!=='POST') return res.status(405).end();
 if(process.env.DOI_REMINDER_ENABLED!=='true') return res.status(503).end();
 try {
  const {service}=await runtime();
  const result=await service.register(req.body,req.headers.authorization);
  return res.status(result.status).end();
 } catch {return res.status(503).end();}
};
