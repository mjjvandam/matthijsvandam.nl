'use strict';
const {createHmac} = require('node:crypto');
const ORIGINS = new Set(['https://matthijsvandam.nl', 'https://www.matthijsvandam.nl']);
const TYPES = new Set(['Samenwerking', 'Onderwijs of scholing', 'Onderzoek', 'Media of publicatie', 'Tip voor de website', 'Anders']);
const LIMITS = {naam:120,email:180,type:40,onderwerp:160,bericht:4000};
const MAX_BYTES = 24576;
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const EMAIL = /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/;


// All visitor text is escaped before inclusion in the HTML email.
function renderContactMail(fields) {
  const escape = value => String(value).replace(/[&<>"']/g, character => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[character]));
  const safe = Object.fromEntries(Object.entries(fields).map(([key,value]) => [key,escape(value)]));
  const subject = '[Website · '+fields.type+'] '+fields.onderwerp;
  const draft = ['Beste '+fields.naam+',','','Dank voor je bericht over “'+fields.onderwerp+'”.','','[Vul hier je inhoudelijke reactie en eventuele vervolgstap aan.]','','Met vriendelijke groet,','Matthijs van Dam'].join('\n');
  const disclaimer = 'Voor persoonlijk medisch advies, afspraken of spoed gebruik je de officiële zorgkanalen.';
  const textContent = ['Nieuw contactbericht · MatthijsvanDam.nl','',
    'Categorie: '+fields.type,'Onderwerp: '+fields.onderwerp,'Naam: '+fields.naam,'E-mailadres: '+fields.email,
    '',fields.bericht,'','---','Conceptantwoord — eerst controleren','Basisopzet: vul aan voordat je deze verstuurt.','',draft,'',disclaimer].join('\n');
  const htmlContent = `<!doctype html>
<html lang="nl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Nieuw contactbericht</title></head>
<body style="margin:0;padding:0;background-color:#f3f2ed;color:#233c32;font-family:Arial,Helvetica,sans-serif;">
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#f3f2ed;"><tr><td align="center" style="padding:24px 12px;">
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:620px;table-layout:fixed;background-color:#ffffff;border:1px solid #d6ded8;border-radius:12px;">
<tr><td style="padding:24px;background-color:#233c32;color:#ffffff;border-radius:12px 12px 0 0;">
<p style="margin:0 0 8px;font-size:14px;letter-spacing:0.3px;">MatthijsvanDam.nl</p>
<h1 style="margin:0;font-size:25px;line-height:1.3;font-weight:600;">Nieuw contactbericht</h1></td></tr>
<tr><td style="padding:24px;overflow-wrap:anywhere;word-break:break-word;">
<p style="margin:0 0 12px;color:#42634f;font-size:14px;font-weight:bold;">${safe.type}</p>
<h2 style="margin:0 0 24px;color:#233c32;font-size:22px;line-height:1.4;">${safe.onderwerp}</h2>
<p style="margin:0 0 4px;color:#53645b;font-size:13px;">Van</p>
<p style="margin:0 0 4px;font-size:17px;line-height:1.5;font-weight:bold;">${safe.naam}</p>
<p style="margin:0 0 24px;color:#233c32;font-size:15px;line-height:1.5;">${safe.email}</p>
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="table-layout:fixed;"><tr><td style="border-top:1px solid #d6ded8;padding-top:24px;">
<p style="margin:0 0 12px;color:#53645b;font-size:13px;">Bericht</p>
<div style="color:#233c32;font-size:16px;line-height:1.75;overflow-wrap:anywhere;word-break:break-word;">${safe.bericht.replace(/\r\n|\r|\n/g,'<br>')}</div>
</td></tr></table></td></tr>
<tr><td style="padding:24px;background-color:#edf3ee;border-top:1px solid #d6ded8;border-radius:0 0 12px 12px;overflow-wrap:anywhere;word-break:break-word;">
<h2 style="margin:0 0 8px;color:#233c32;font-size:18px;line-height:1.4;">Conceptantwoord — eerst controleren</h2>
<p style="margin:0 0 20px;color:#53645b;font-size:14px;line-height:1.5;">Basisopzet: vul aan voordat je deze verstuurt.</p>
<div style="color:#233c32;font-size:16px;line-height:1.75;">${escape(draft).replace(/\n/g,'<br>')}</div>
<p style="margin:18px 0 0;color:#53645b;font-size:12px;line-height:1.6;">${escape(disclaimer)}</p>
</td></tr>
</table></td></tr></table></body></html>`;
  return {subject,textContent,htmlContent};
}

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
    if(body.website!==''||body.contactgrenzen_begrepen!==true||!UUID.test(body.requestId||''))
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
          ...renderContactMail(fields),headers:{idempotencyKey}})
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

module.exports.renderContactMail=renderContactMail;
