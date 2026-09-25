'use strict';
const {createHmac} = require('node:crypto');

const ORIGINS = new Set(['https://matthijsvandam.nl', 'https://www.matthijsvandam.nl']);
const ANSWERS = {yes:'Ja',partly:'Gedeeltelijk',no:'Nee'};
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const MAX_BYTES = 4096;
const END = Date.parse('2026-10-24T22:00:00Z');

function createHandler(env=process.env, fetchImpl=fetch, now=()=>Date.now()) {
  return async (request,response) => {
    response.setHeader('Cache-Control','no-store');
    const reply=(status,message,code)=>response.status(status).json({message,code});
    const enabled=now()<END&&env.FEEDBACK_FORM_ENABLED==='true'&&env.FEEDBACK_EDGE_RATE_LIMIT_VERIFIED==='true'&&!!env.BREVO_API_KEY;
    if(request.method==='GET')return response.status(200).json({enabled});
    if(request.method!=='POST') {response.setHeader('Allow','GET, POST');return reply(405,'Alleen GET en POST zijn toegestaan.','method');}
    if(now()>=END)return reply(410,'Deze feedbackronde is afgelopen.','ended');
    // A verified edge rate limit must cover this route before public activation.
    if(!enabled)
      return reply(503,'Feedback versturen is nog niet beschikbaar.','disabled');
    if(!ORIGINS.has(request.headers.origin))return reply(403,'Dit verzoek is niet toegestaan.','origin');
    if(!/^application\/json(?:\s*;|$)/i.test(request.headers['content-type']||''))return reply(415,'Ongeldig berichtformaat.','content_type');
    let body;
    try {
      const raw=typeof request.body==='string'?request.body:JSON.stringify(request.body);
      if(!raw||Buffer.byteLength(raw)>MAX_BYTES)return reply(413,'Het bericht is te groot.','size');
      body=JSON.parse(raw);
    } catch {return reply(400,'Ongeldig berichtformaat.','invalid');}
    if(!body||typeof body!=='object'||Array.isArray(body)||body.website!==''||!UUID.test(body.requestId||''))
      return reply(400,'Controleer je antwoord.','invalid');
    if(!Object.hasOwn(ANSWERS,body.answer)||typeof body.note!=='string'||body.note.length>500||/[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]/.test(body.note))
      return reply(400,'Controleer je antwoord.','invalid');
    const note=body.note.trim();
    const textContent=['Websitefeedback · MatthijsvanDam.nl','',
      'Heeft de content de bezoeker verder geholpen? '+ANSWERS[body.answer],
      '',note||'(geen toelichting)','',
      'Vrijwillige anonieme websitefeedback. Niet beantwoorden; er is geen afzenderadres.'].join('\n');
    const hex=createHmac('sha256',env.BREVO_API_KEY).update(JSON.stringify([body.requestId,body.answer,note])).digest('hex');
    const idempotencyKey=hex.slice(0,8)+'-'+hex.slice(8,12)+'-4'+hex.slice(13,16)+'-8'+hex.slice(17,20)+'-'+hex.slice(20,32);
    let result;
    try {
      result=await fetchImpl('https://api.brevo.com/v3/smtp/email',{
        method:'POST',headers:{'api-key':env.BREVO_API_KEY,'Content-Type':'application/json'},signal:AbortSignal.timeout(8000),
        body:JSON.stringify({sender:{name:'Matthijs van Dam',email:'website@mail.matthijsvandam.nl'},
          to:[{email:'mjjvandam@gmail.com'}],subject:'[Websitefeedback] '+ANSWERS[body.answer],textContent,
          headers:{idempotencyKey}}),
      });
    } catch {return reply(502,'De verzendstatus is onzeker. Verstuur je antwoord niet opnieuw.','uncertain');}
    if(result.ok)return reply(200,'Dank je wel. Je feedback is verzonden.','accepted');
    let error={};try{error=await result.json();}catch{}
    if(error.code==='duplicate_parameter')return reply(409,'Dit antwoord is al verwerkt.','duplicate');
    if(result.status===429)return reply(429,'Er zijn tijdelijk te veel reacties. Probeer het later opnieuw.','quota');
    return reply(502,'De verzendstatus is onzeker. Verstuur je antwoord niet opnieuw.','uncertain');
  };
}

module.exports=createHandler();
module.exports.createHandler=createHandler;
