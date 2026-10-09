'use strict';
const {runtime}=require('../lib/newsletter-reminders/providers.cjs');
module.exports=async function(req,res) {
 const {queue,service}=await runtime();
 return queue.handleNodeCallback(async message=>{const outcome=await service.dispatch(message);console.info('doi_reminder_outcome',outcome);})(req,res);
};
