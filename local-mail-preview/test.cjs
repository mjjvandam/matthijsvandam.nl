'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {validate,loadContent,fingerprint,matches,select,rss,root}=require('./core.cjs');
const {createBrevo}=require('./brevo.cjs');
const config=JSON.parse(fs.readFileSync(path.join(__dirname,'config.json'))), content=loadContent();
const contact={naam:'Test',email:'test@example.com',type:'Onderzoek',onderwerp:'Samenwerking',bericht:'Fictief testbericht',geen_medische_gegevens:true,website:''};
const sub={audience:'zorgprofessionals',voornaam:'Test',achternaam:'Persoon',email:'test@example.com',consent:true,streams:[config.streams[0].id],website:''};
test('strict consent, fields, and injected headers rejected',()=>{for(const value of ['false','true',false,[],1])assert.throws(()=>validate('contact',{...contact,geen_medische_gegevens:value},[]));assert.throws(()=>validate('contact',{...contact,onderwerp:'hello\r\nBcc: bad@example.com'},[]));assert.throws(()=>validate('contact',{...contact,bericht:'a'.repeat(4001)},[]));assert.throws(()=>validate('contact',[],[]));assert.equal(validate('contact',contact,[]).email,'test@example.com');});
test('only known explicitly chosen streams; consent required',()=>{assert.throws(()=>validate('subscribe',{...sub,streams:['injected']},config.streams));assert.throws(()=>validate('subscribe',{...sub,streams:[]},config.streams));assert.throws(()=>validate('subscribe',{...sub,consent:'true'},config.streams));assert.throws(()=>validate('subscribe',{...sub,website:'spam'},config.streams));assert.equal(validate('subscribe',sub,config.streams).streams.length,1);});
test('unapproved real catalogue produces empty feeds',()=>{const out=select(config,content,[],()=>{throw Error('No articles should be read');});assert.ok(Object.values(out).every(x=>x.length===0));});
function fixture(){const a=content.articles.find(a=>matches(a,config.streams[0])),bytes=Buffer.from('approved article');return{a,bytes,c:{...config,startAt:'2026-09-06T00:00:00Z',releases:[{articleId:a.id,approvedBy:'Matthijs van Dam',fingerprint:fingerprint(a,bytes),releasedAt:'2026-09-06T10:00:00Z',streams:[config.streams[0].id]}]},pages:[{path:a.url,verification_status:'geverifieerd'}]};}
test('fingerprint and verification gate distribution',()=>{const f=fixture();assert.equal(select(f.c,content,f.pages,()=>f.bytes)[config.streams[0].id].length,1);assert.throws(()=>select(f.c,content,f.pages,()=>Buffer.from('changed')));assert.throws(()=>select(f.c,content,[],()=>f.bytes));const changed=structuredClone(content);changed.articles.find(a=>a.id===f.a.id).summary+=' changed';assert.throws(()=>select(f.c,changed,f.pages,()=>f.bytes));});
test('audience remains mandatory even when topic/project matches',()=>{const a={audience:['patienten'],topics:['onderzoek'],project:'transmuraal-tilburg-cohort'};assert.equal(matches(a,config.streams.find(s=>s.id==='tilburg-cohort')),false);assert.equal(matches(a,config.streams[0]),false);});
test('unknown filter, duplicate approval and old release fail closed',()=>{const f=fixture();assert.throws(()=>select({...config,streams:[{...config.streams[0],topics:['nonexistent']}]},content,[],()=>f.bytes));assert.throws(()=>select({...f.c,releases:[...f.c.releases,...f.c.releases]},content,f.pages,()=>f.bytes));assert.throws(()=>select({...f.c,startAt:'2027-01-01'},content,f.pages,()=>f.bytes));});
test('RSS escapes text, stable ID and refuses truncation',()=>{const a={...fixture().a,title:'A & <B>',releasedAt:'2026-09-06T10:00:00Z'};const feed=rss(config.streams[0],[a]);assert.ok(feed.includes('A &amp; &lt;B&gt;'));assert.ok(feed.includes('mvd:'+a.id));assert.throws(()=>rss(config.streams[0],Array(6).fill(a)));});
test('disabled transport never calls provider',async()=>{let calls=0;const api=createBrevo({sender:'sender@example.com',recipient:'owner@example.com'},async()=>{calls++;});await assert.rejects(api.contact(contact));assert.equal(calls,0);});
test('contact recipient fixed; visitor only Reply-To; no subscriber operation',async()=>{let call;const api=createBrevo({enabled:true,apiKey:'test-only',sender:'sender@example.com',recipient:'owner@example.com'},async(url,opts)=>{call={url,data:JSON.parse(opts.body)};return{ok:true};});await api.contact({...contact,to:'attacker@example.com'});assert.ok(call.url.endsWith('/smtp/email'));assert.equal(call.data.to[0].email,'owner@example.com');assert.equal(call.data.replyTo.email,contact.email);assert.equal(call.data.htmlContent,undefined);});
test('retired Brevo DOI cannot be enabled even with old flags and valid config',async()=>{
 let calls=0;const api=createBrevo({enabled:true,apiKey:'test-only',doiVerified:true,listIds:{[sub.streams[0]]:12},templateId:3,redirectUrl:'https://matthijsvandam.nl/nieuwsbrief.html'},async()=>{calls++;return{ok:true};});
 await assert.rejects(api.subscribe(sub,config.streams),/afgekeurd/);assert.equal(calls,0);
});
test('timeout and quota failure not retried',async()=>{let count=0;const opts={enabled:true,apiKey:'test-only',sender:'sender@example.com',recipient:'owner@example.com'};await assert.rejects(createBrevo(opts,async()=>{count++;throw Error('private upstream error');}).contact(contact),/onzeker/);assert.equal(count,1);await assert.rejects(createBrevo(opts,async()=>({ok:false,status:429})).contact(contact),/limiet/);});

test('newsletter requires both non-blank names',()=>{for(const key of ['voornaam','achternaam'])for(const value of [undefined,'','   ',[], 'a'.repeat(121)])assert.throws(()=>validate('subscribe',{...sub,[key]:value},config.streams));});

test('server rejects forged cross-audience preferences before provider call',async()=>{
  let calls=0;
  const api=createBrevo({enabled:true,apiKey:'test-only'},async()=>{calls++;return{ok:true};});
  for(const audience of [undefined,'',[], 'unknown','patienten']) {
    await assert.rejects(api.subscribe({...sub,audience},config.streams));
  }
  assert.equal(calls,0);
  for(const audience of ['patienten','zorgprofessionals']) {
    assert.deepEqual(validate('subscribe',{...sub,audience,streams:['algemeen']},config.streams).streams,['algemeen']);
  }
  assert.equal(validate('subscribe',{...sub,audience:'patienten',streams:['patienten-voet-enkel','tilburg-cohort-patienten']},config.streams).audience,'patienten');
});

test('unverified DOI stays off even with valid credentials and template',async()=>{
 let calls=0;
 const api=createBrevo({enabled:true,apiKey:'test-only',listIds:{[sub.streams[0]]:12},templateId:3,redirectUrl:'https://matthijsvandam.nl/nieuwsbrief.html'},async()=>{calls++;return {ok:true};});
 await assert.rejects(api.subscribe(sub,config.streams),/niet vrijgegeven/);
 assert.equal(calls,0);
});
