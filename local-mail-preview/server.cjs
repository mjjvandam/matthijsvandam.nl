'use strict';
// Loopback-only demo. This server never imports the live transport and never sends mail.
const http=require('node:http'), fs=require('node:fs'), path=require('node:path'), crypto=require('node:crypto');
const {validate,loadContent,select,rss,root}=require('./core.cjs');
const config=JSON.parse(fs.readFileSync(path.join(__dirname,'config.json')));
const {createMemoryStore}=require('./confirmation-store.cjs');
const {createConfirmationService}=require('./confirmation-service.cjs');
const {renderNewsletterExample}=require('./mail-layout.cjs');
const store=createMemoryStore();
const outbox=new Map(), lastMail=new Map(), confirmed=new Map();
const requests=new Map();
const port=Number(process.env.MVD_PREVIEW_PORT||8879);
const origin='http://127.0.0.1:'+port;
function reply(res,status,data,type='application/json',emailPreview=false) {res.writeHead(status,{'Content-Type':type+'; charset=utf-8','Cache-Control':'no-store','X-Content-Type-Options':'nosniff','Referrer-Policy':'no-referrer','Content-Security-Policy':(emailPreview?"default-src 'none'; img-src 'self'; style-src 'unsafe-inline'; frame-ancestors 'self'; form-action 'none'; base-uri 'none'":"default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self'; connect-src 'self'; form-action 'self'; frame-ancestors 'none'; base-uri 'none'")});res.end(type==='application/json'?JSON.stringify(data):data);}
// Local fake provider. No credentials or live Brevo adapter are imported here.
const provider={
 async sendConfirmation(mail){const id=crypto.randomUUID();outbox.set(id,{...mail,expires:Date.now()+1800000});lastMail.set(mail.to,id);},
 async applyConfirmed(data){const old=confirmed.get(data.email);confirmed.set(data.email,{...data,streams:[...new Set([...(old?.streams||[]),...data.streams])],blocked:false});},
 async block(email){if(confirmed.has(email))confirmed.get(email).blocked=true;}
};
const flow=createConfirmationService({store,provider,streams:config.streams,identityKey:crypto.randomBytes(32),origin});
const cleanup=setInterval(()=>{
 store.counts();
 for(const [id,mail] of outbox)if(mail.expires<=Date.now()){outbox.delete(id);if(lastMail.get(mail.to)===id)lastMail.delete(mail.to);}
},60000);cleanup.unref();
const server=http.createServer(async(req,res)=>{
  if(req.headers.host!==new URL(origin).host) return reply(res,403,{message:'Gebruik de lokale preview-URL.'});
  const url=new URL(req.url,origin);
  try {
    if(req.method==='GET') {
      const previewImages=['article-footprint-quick-scan-editorial.jpg','project-we-walk-editorial.jpg'];
      if(previewImages.some(name=>url.pathname==='/newsletter-images/'+name))return reply(res,200,fs.readFileSync(path.join(root,'assets',path.basename(url.pathname))),'image/jpeg');
      if(url.pathname==='/nieuwsbriefvoorbeeld')return reply(res,200,renderNewsletterExample({firstName:'Anne'}),'text/html',true);
      if(url.pathname.startsWith('/proefmail/')) {
        const mail=outbox.get(url.pathname.slice('/proefmail/'.length));
        if(!mail||mail.expires<=Date.now())return reply(res,404,{message:'Deze lokale proefmail is verlopen.'});
        return reply(res,200,mail.html,'text/html',true);
      }
      if(url.pathname==='/config') return reply(res,200,{streams:config.streams});
      if(url.pathname==='/selection') {
        const content=loadContent();
        const selected=select(config,content,JSON.parse(fs.readFileSync(path.join(root,'PUBLICATIE_REGISTER.json'))).pages,p=>fs.readFileSync(path.join(root,p)));
        return reply(res,200,{approved:Object.fromEntries(Object.entries(selected).map(([k,v])=>[k,v.length])),candidates:config.streams.map(s=>({label:s.label,articles:content.articles.filter(a=>require('./core.cjs').matches(a,s)).map(a=>a.title)}))});
      }
      if(url.pathname.startsWith('/feeds/')) {
        const stream=config.streams.find(s=>url.pathname==='/feeds/'+s.id+'.xml');
        if(!stream) return reply(res,404,{message:'Niet gevonden.'});
        const selected=select(config,loadContent(),JSON.parse(fs.readFileSync(path.join(root,'PUBLICATIE_REGISTER.json'))).pages,p=>fs.readFileSync(path.join(root,p)));
        return reply(res,200,rss(stream,selected[stream.id]),'application/xml');
      }
      const files={'/bevestigen':'confirmation.html','/confirmation.js':'confirmation.js','/confirmation.css':'confirmation.css','/':'index.html','/app.js':'app.js','/preview.css':'preview.css','/styles.css':path.join(root,'styles.css')};
      if(!files[url.pathname]) return reply(res,404,{message:'Niet gevonden.'});
      const file=path.resolve(__dirname,files[url.pathname]);
      return reply(res,200,fs.readFileSync(file),file.endsWith('.js')?'text/javascript':file.endsWith('.css')?'text/css':'text/html');
    }
    if(req.method!=='POST') return reply(res,405,{message:'Niet toegestaan.'});
    if(req.headers.origin!==origin || !String(req.headers['content-type']).startsWith('application/json')) return reply(res,403,{message:'Ongeldige herkomst of inhoudstype.'});
    let raw=''; for await(const chunk of req) {raw+=chunk;if(Buffer.byteLength(raw)>12000)return reply(res,413,{message:'Bericht te groot.'});}
    const body=JSON.parse(raw);
    if(url.pathname==='/confirm' || url.pathname==='/unsubscribe') {
      const result=url.pathname==='/unsubscribe'?await flow.unsubscribe(body.token):await flow.confirm(body.token);
      return reply(res,result.ok?200:400,result);
    }
    const kind=url.pathname==='/contact'?'contact':url.pathname==='/subscribe'?'subscribe':null;
    if(!kind) return reply(res,404,{message:'Niet gevonden.'});
    const valid=validate(kind,body,config.streams);
    if(!/^[0-9a-f-]{36}$/.test(body.requestId||'')) return reply(res,400,{message:'Ongeldige aanvraag.'});
    const digest=crypto.createHash('sha256').update(JSON.stringify(valid)).digest('hex');
    for(const [k,v] of requests) if(v.expires<Date.now()) requests.delete(k);
    if(requests.has(body.requestId)) {
      const prev=requests.get(body.requestId);
      return reply(res,prev.digest===digest?200:409,prev.digest===digest?prev.result:{message:'Aanvraagnummer al gebruikt.'});
    }
    if(requests.size>=100) return reply(res,429,{message:'Proeflimiet bereikt; probeer over tien minuten opnieuw.'});
    const result={message:kind==='contact'?'Proef geslaagd: het bericht is gecontroleerd. Er is geen e-mail verzonden.':'Proef geslaagd: de bevestigingsmail wordt hieronder nagebootst.'};
    if(kind==='subscribe') {
      const outcome=await flow.request(body);
      if(!outcome.ok)return reply(res,400,outcome);
      result.message='De lokale proefmail staat klaar. Open de mail en bevestig op de volgende pagina.';
      result.mailPreviewUrl='/proefmail/'+lastMail.get(valid.email);
    }
    requests.set(body.requestId,{digest,result,expires:Date.now()+600000});
    reply(res,200,result);
  } catch { reply(res,400,{message:'Controleer je invoer. Het verzoek kon niet worden verwerkt.'}); }
});
server.listen(port,'127.0.0.1',()=>console.log('Lokale mailpreview: '+origin+' (geen echte verzending)'));
