'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const {createHandler}=require('../api/contact.js');
const fs=require('node:fs'),vm=require('node:vm');
const enabled={CONTACT_FORM_ENABLED:'true',CONTACT_EDGE_RATE_LIMIT_VERIFIED:'true',BREVO_API_KEY:'test-key'};
const data={naam:'Test',email:'test@example.com',type:'Anders',onderwerp:'Test',bericht:'Fictief bericht',website:'',contactgrenzen_begrepen:true,requestId:'12345678-1234-4234-8234-123456789012'};
async function run({body=data,headers={},env=enabled,method='POST',fetchImpl=async()=>({ok:true})}={}){
 const res={setHeader(){},status(n){this.code=n;return this;},json(body){this.body=body;return this;}};
 await createHandler(env,fetchImpl)({method,headers:{origin:'https://matthijsvandam.nl','content-type':'application/json',...headers},body},res);return res;
}
test('disabled or unverified edge protection never calls Brevo',async()=>{
 for(const env of [{},{...enabled,CONTACT_FORM_ENABLED:'false'},{...enabled,CONTACT_EDGE_RATE_LIMIT_VERIFIED:'false'}])assert.equal((await run({env,fetchImpl:()=>assert.fail()})).code,503);
});
test('rejects other origins, missing origin, methods and content types',async()=>{
 for(const origin of [undefined,'https://attacker.example','https://matthijsvandam.nl.attacker.example'])assert.equal((await run({headers:{origin},fetchImpl:()=>assert.fail()})).code,403);
 assert.equal((await run({method:'GET'})).code,405);assert.equal((await run({headers:{'content-type':'text/plain'}})).code,415);
});
test('strict booleans, input shapes, sizes and header injection rejected before provider',async()=>{
 for(const body of [null,[],{},'{', {...data,contactgrenzen_begrepen:'false'},{...data,contactgrenzen_begrepen:false},{...data,contactgrenzen_begrepen:undefined,geen_medische_gegevens:true},{...data,naam:'Test\r\nBcc: injected'}, {...data,email:[]},{...data,requestId:'wrong'}, {...data,bericht:'a'.repeat(4001)},{...data,website:'spam'},{...data,type:'Zorgontwikkeling'}])assert.equal((await run({body,fetchImpl:()=>assert.fail()})).code,400);
 assert.equal((await run({body:' '.repeat(24577),fetchImpl:()=>assert.fail()})).code,413);
});
test('only fixed recipient and sender; HTML and text alternatives; no subscription',async()=>{
 let payload;const res=await run({body:{...data,to:'attacker@example.com',sender:'attacker@example.com'},fetchImpl:async(url,options)=>{assert.equal(url,'https://api.brevo.com/v3/smtp/email');payload=JSON.parse(options.body);return {ok:true};}});
 assert.equal(res.code,200);assert.equal(payload.to[0].email,'mjjvandam@gmail.com');assert.equal(payload.sender.email,'website@mail.matthijsvandam.nl');assert.equal(payload.replyTo.email,data.email);assert.match(payload.htmlContent, /Nieuw contactbericht/);assert.match(payload.textContent, /Fictief bericht/);assert.equal(payload.subject,'[Website · Anders] Test');
});
test('idempotency survives separate instances; binds content and ID without personal data',async()=>{
 const keys=[];const fetchImpl=async(url,options)=>{keys.push(JSON.parse(options.body).headers.idempotencyKey);return {ok:true};};
 await run({fetchImpl});await run({fetchImpl});await run({fetchImpl,body:{...data,bericht:'Other content'}});
 assert.equal(keys[0],keys[1]);assert.notEqual(keys[0],keys[2]);assert.match(keys[0],/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-8[0-9a-f]{3}-[0-9a-f]{12}$/);
});
test('quota, duplicate, provider and network errors never claim success or retry',async()=>{
 for(const [status,code,expected] of [[429,'',429],[400,'duplicate_parameter',409],[500,'',502]]){
 let calls=0;const r=await run({fetchImpl:async()=>{calls++;return {ok:false,status,json:async()=>({code})};}});assert.equal(r.code,expected);assert.equal(calls,1);
 }
 let calls=0;const r=await run({fetchImpl:async()=>{calls++;throw Error('private secret');}});assert.equal(r.code,502);assert.equal(calls,1);assert.ok(!JSON.stringify(r.body).includes('private secret'));
});
test('browser submit sends boolean consent, blocks repeat submission and preserves text on uncertainty',async()=>{
 const source=fs.readFileSync(require('node:path').join(__dirname,'../script.js'),'utf8').split('contactForm?.addEventListener("submit", async (event) => {')[1];
 let listener,calls=0,resets=0;const button={disabled:false},status={textContent:'',focus(){}};
 const form={dataset:{},reportValidity:()=>true,querySelector:()=>button,reset:()=>resets++,addEventListener:(name,fn)=>listener=fn};
 const fields=new Map(Object.entries({...data,contactgrenzen_begrepen:'on'}));
 vm.runInNewContext('contactForm?.addEventListener("submit", async (event) => {'+source,{contactForm:form,contactStatus:status,showStatus:message=>{status.textContent=message;},FormData:function(){return fields;},crypto:{randomUUID:()=>data.requestId},AbortSignal,fetch:async(url,opts)=>{calls++;assert.equal(JSON.parse(opts.body).contactgrenzen_begrepen,true);throw Error('timeout');}});
 await listener({preventDefault(){}});await listener({preventDefault(){}});
 assert.equal(calls,1);assert.equal(resets,0);assert.equal(button.disabled,true);assert.match(status.textContent,/onzeker/);
});

test('HTML email escapes visitor markup and preserves line breaks and plain text',()=>{
 const {renderContactMail}=require('../api/contact.js');
 const fields={...data,naam:'Naam <img src=x onerror=alert(1)>',onderwerp:'Vraag & antwoord',bericht:'Eerste regel\n<script>alert(1)</script>\nLaatste regel'};
 const mail=renderContactMail(fields);
 assert.ok(!mail.htmlContent.includes('<script>'));
 assert.ok(!mail.htmlContent.includes('<img'));
 assert.ok(mail.htmlContent.includes('&lt;script&gt;'));
 assert.ok(mail.htmlContent.includes('Eerste regel<br>'));
 assert.ok(mail.htmlContent.includes('Vraag &amp; antwoord'));
 assert.ok(mail.textContent.includes(fields.bericht));
 assert.equal(mail.subject,'[Website · Anders] Vraag & antwoord');
});
