'use strict';
const {createHmac} = require('node:crypto');
const ORIGINS = new Set(['https://matthijsvandam.nl', 'https://www.matthijsvandam.nl']);
const TYPES = new Set(['Samenwerking', 'Onderwijs of scholing', 'Onderzoek', 'Media of publicatie', 'Tip voor de website', 'Anders']);
const LIMITS = {naam:120,email:180,type:40,onderwerp:160,bericht:4000};
const MAX_BYTES = 24576;
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const EMAIL = /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/;

function createHandler(env=process.env, fetchImpl=fetch) {
  return async (request,response) => {
    response.setHeader('Cache-Control','no-store');
    const reply=(status,message,code)=>response.status(status).json({message,code});
    if(request.method!=='POST') {response.setHeader('Allow','POST');return reply(405,'Alleen POST is toegestaan.','method');}
    // These flags are release gates, not a rate limiter. Verify the edge rule on
    // every public domain before enabling. No per-instance Map is used as protection.
    if(env.CONTACT_FORM_ENABLED!=='true'||env.CONTACT_EDGE_RATE_LIMIT_VERIFIED!=='true'||!env.BREVO_API_KEY)
      return reply(503,'Het contactformulier is nog niet beschikbaar.','disabled');
    if(!ORIGINS.has(request.headers.origin))return reply(403,'Dit verzoek is niet toegestaan.','origin');
    if(!/^application\/json(?:\s*;|$)/i.test(request.headers['content-type']||''))return reply(415,'Ongeldig berichtformaat.','content_type');
    let body=request.body;
    try {
      const raw=typeof body==='string'?body:JSON.stringify(body);
      if(!raw||Buffer.byteLength(raw)>MAX_BYTES)return reply(413,'Het bericht is te groot.','size');
      body=JSON.parse(raw);
    } catch{return reply(400,'Ongeldig berichtformaat.','invalid');}
    if(!body||typeof body!=='object'||Array.isArray(body))return reply(400,'Ongeldig berichtformaat.','invalid');
    if(body.website!==''||body.geen_medische_gegevens!==true||!UUID.test(body.requestId||''))
      return reply(400,'Controleer het formulier en de bevestiging.','invalid');
    const fields={};
    for(const [key,max] of Object.entries(LIMITS)) {
      if(typeof body[key]!=='string'||!body[key].trim()||body[key].length>max)return reply(400,'Controleer de verplichte velden en maximale lengte.','invalid');
      fields[key]=body[key].trim();
    }
    if(!EMAIL.test(fields.email)||!TYPES.has(fields.type)||/[\r\n\x00-\x1f\x7f]/.test(fields.naam+fields.email+fields.onderwerp))
      return reply(400,'Controleer naam, e-mailadres, onderwerp en type vraag.','invalid');
    // Provider-side deduplication survives separate function instances. The key
    // binds the request ID AND content, and contains no readable personal data.
    const hex=createHmac('sha256',env.BREVO_API_KEY).update(JSON.stringify([body.requestId,fields])).digest('hex');
    const idempotencyKey=hex.slice(0,8)+'-'+hex.slice(8,12)+'-4'+hex.slice(13,16)+'-8'+hex.slice(17,20)+'-'+hex.slice(20,32);
    let result;
    try {
      result=await fetchImpl('https://api.brevo.com/v3/smtp/email',{
        method:'POST',headers:{'api-key':env.BREVO_API_KEY,'Content-Type':'application/json'},signal:AbortSignal.timeout(8000),
        body:JSON.stringify({sender:{name:'Matthijs van Dam',email:'website@mail.matthijsvandam.nl'},to:[{email:'mjjvandam@gmail.com'}],replyTo:{name:fields.naam,email:fields.email},
          subject:'Websitecontact: '+fields.onderwerp,headers:{idempotencyKey},
          textContent:['Professioneel contact via matthijsvandam.nl','Naam: '+fields.naam,'E-mail: '+fields.email,'Type: '+fields.type,'Geen medische gegevens bevestigd: ja','',fields.bericht].join('\n')})
      });
    } catch{return reply(502,'De verzendstatus is onzeker. Verstuur dit bericht niet opnieuw; controleer eerst of het is aangekomen.','uncertain');}
    if(result.ok)return reply(200,'Je bericht is aangeboden aan de maildienst.','accepted');
    let error={};try{error=await result.json();}catch{}
    if(error.code==='duplicate_parameter')return reply(409,'Dit verzoek is al eerder verwerkt. Verstuur het niet opnieuw.','duplicate');
    if(result.status===429)return reply(429,'De verzendlimiet is bereikt. Je bericht is niet verstuurd.','quota');
    // Some upstream failures can happen after acceptance: never promise safe retry.
    return reply(502,'De maildienst kon de verzending niet bevestigen. Verstuur het bericht niet direct opnieuw.','uncertain');
  };
}
module.exports=createHandler();
module.exports.createHandler=createHandler;
