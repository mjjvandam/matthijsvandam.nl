'use strict';
const {equal}=require('../lib/newsletter-reminders/core.cjs');
const {runtime}=require('../lib/newsletter-reminders/providers.cjs');
module.exports=async function(req,res) {
 res.setHeader('Cache-Control','no-store');
 if(req.method!=='GET') return res.status(405).end();
 if(!process.env.CRON_SECRET||!equal(req.headers.authorization,`Bearer ${process.env.CRON_SECRET}`)) return res.status(401).end();
 try {const {service}=await runtime();return res.status(200).json({removed:await service.cleanup()});}
 catch {return res.status(503).end();}
};
