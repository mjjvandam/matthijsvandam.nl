'use strict';
const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(__dirname, '..');
const TYPES = ['Samenwerking', 'Onderwijs of scholing', 'Onderzoek', 'Media of publicatie', 'Anders'];
const emailOK = s => typeof s === 'string' && s.length <= 180 && /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(s);
const fail = message => { throw new Error(message); };
function validate(kind, body, streams) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) fail('Ongeldig berichtformaat.');
  if (typeof body.website !== 'string' || body.website) fail('Het formulier kon niet worden verwerkt.');
  if (!emailOK(body.email)) fail('Vul een geldig e-mailadres in.');
  if (kind === 'contact') {
    for (const [key, max] of Object.entries({naam:120, onderwerp:160, bericht:4000, type:40})) {
      if (typeof body[key] !== 'string' || !body[key].trim() || body[key].length > max) fail('Controleer de verplichte velden en de maximale lengte.');
    }
    if (/[\r\n]/.test(body.onderwerp) || !TYPES.includes(body.type) || body.geen_medische_gegevens !== true) fail('Controleer het type vraag en de bevestiging.');
    return Object.fromEntries(['naam','email','type','onderwerp','bericht'].map(k => [k, body[k].trim()]));
  }
  if (kind !== 'subscribe' || body.consent !== true || !Array.isArray(body.streams) || !body.streams.length || body.streams.length > streams.length) fail('Kies een nieuwsbrief en geef toestemming.');
  const allowed = new Set(streams.map(s => s.id));
  if (!body.streams.every(s => typeof s === 'string' && allowed.has(s))) fail('Onbekende nieuwsbriefkeuze.');
  if (!['patienten','zorgprofessionals'].includes(body.audience)) fail('Kies voor wie je de nieuwsbrief wilt lezen.');
  if (!body.streams.every(id => streams.find(s => s.id === id).audiences.includes(body.audience))) fail('Kies onderwerpen die passen bij je doelgroepkeuze.');
  const names={};
  for (const key of ['voornaam','achternaam']) {
    if (typeof body[key] !== 'string' || !body[key].trim() || body[key].length > 120) fail('Vul je voornaam en achternaam in (maximaal 120 tekens per veld).');
    names[key]=(body[key]||'').trim();
  }
  return {email:body.email.trim().toLowerCase(), audience:body.audience, streams:[...new Set(body.streams)], ...names};
}
function loadContent() {
  const ctx = {window:{location:{pathname:'/',search:''}}, document:{querySelectorAll:()=>[]}};
  vm.runInNewContext(fs.readFileSync(path.join(root,'content.js'),'utf8'),ctx,{timeout:2000});
  return JSON.parse(JSON.stringify(ctx.window.siteContent));
}
function fingerprint(article, bytes) {
  const metadata = {id:article.id,title:article.title,summary:article.summary,url:article.url,date:article.date,audience:article.audience,topics:article.topics,project:article.project||null};
  return crypto.createHash('sha256').update(JSON.stringify(metadata)).update(bytes).digest('hex');
}
const matches = (a,s) => a.audience.some(x=>s.audiences.includes(x)) && (!(s.topics.length+s.projects.length) || a.topics.some(x=>s.topics.includes(x)) || s.projects.includes(a.project));
function select(config, content, pages, readFile) {
  const audiences=new Set(content.articles.flatMap(a=>a.audience)), topics=new Set(content.articles.flatMap(a=>a.topics)), projects=new Set(content.projects.map(p=>p.id));
  const ids=new Set();
  for (const s of config.streams) {
    if (!/^[a-z0-9-]+$/.test(s.id) || ids.has(s.id) || !s.audiences.length || !s.audiences.every(x=>audiences.has(x)) || !s.topics.every(x=>topics.has(x)) || !s.projects.every(x=>projects.has(x))) fail('Ongeldige stroomconfiguratie.');
    ids.add(s.id);
  }
  if (config.releases.length && (!config.startAt || !Number.isFinite(Date.parse(config.startAt)))) fail('Startgrens ontbreekt.');
  const result=Object.fromEntries(config.streams.map(s=>[s.id,[]]));
  const seen=new Set();
  for (const r of config.releases) {
    const a=content.articles.find(a=>a.id===r.articleId);
    if (!a || seen.has(r.articleId)) fail('Onbekende of dubbele artikelvrijgave.');
    seen.add(r.articleId);
    if (!/^artikelen\/[a-z0-9-]+\.html$/.test(a.url)) fail('Ongeldig artikelpad.');
    const bytes=readFile(a.url);
    if (r.approvedBy!=='Matthijs van Dam' || r.fingerprint!==fingerprint(a,bytes)) fail('Artikelversie heeft geen geldige distributievrijgave.');
    if (!pages.some(p=>p.path===a.url && p.verification_status==='geverifieerd')) fail('Artikel niet geverifieerd.');
    if (!Number.isFinite(Date.parse(r.releasedAt)) || Date.parse(r.releasedAt)<Date.parse(config.startAt)) fail('Vrijgave vóór startgrens of ongeldige datum.');
    if (!Array.isArray(r.streams) || !r.streams.length || new Set(r.streams).size!==r.streams.length) fail('Ongeldige vrijgavestromen.');
    for (const id of r.streams) {
      const stream=config.streams.find(s=>s.id===id);
      if (!stream || !matches(a,stream)) fail('Vrijgave past niet bij doelgroep/thema/project.');
      result[id].push({...a,releasedAt:r.releasedAt});
    }
  }
  return result;
}
const xml = s => String(s).replace(/[<>&"']/g,c=>({'<':'&lt;','>':'&gt;','&':'&amp;','"':'&quot;',"'":'&apos;'}[c]));
function rss(stream, articles) {
  if (articles.length>5) fail('Meer dan vijf items: redactionele selectie nodig; niets afkappen.');
  return '<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0"><channel><title>'+xml(stream.label)+'</title><link>https://matthijsvandam.nl/artikelen.html</link><description>Nieuwe artikelen van Matthijs van Dam</description><language>nl-nl</language>'+articles.map(a=>'<item><guid isPermaLink="false">mvd:'+xml(a.id)+'</guid><title>'+xml(a.title)+'</title><link>https://matthijsvandam.nl/'+xml(a.url)+'</link><description>'+xml(a.summary)+'</description><pubDate>'+new Date(a.releasedAt).toUTCString()+'</pubDate></item>').join('')+'</channel></rss>';
}
module.exports={TYPES,validate,loadContent,fingerprint,matches,select,rss,root};
