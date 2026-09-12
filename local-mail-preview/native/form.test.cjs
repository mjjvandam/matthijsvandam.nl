'use strict';
// Isolated browser tests of our presentation/validation only. All network is aborted.
// Brevo's runtime and delivery are not simulated or certified by this test.
const {test,before,after}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {chromium}=require('/Users/matthijsvandam/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
let browser;
before(async()=>{browser=await chromium.launch({headless:true,...(process.env.MVD_TEST_BROWSER?{executablePath:process.env.MVD_TEST_BROWSER}:{})});});
after(async()=>{await browser?.close();});
async function setup(){
 const page=await browser.newPage();
 await page.route('**/*',r=>r.abort());
 let html=fs.readFileSync(path.join(__dirname,'integration.html'),'utf8').replace(/<meta http-equiv="Content-Security-Policy"[^>]*>/,'').replace(/<script\b[^>]*>[\s\S]*?<\/script>/g,'');
 await page.setContent(html);
 await page.addScriptTag({content:fs.readFileSync(path.join(__dirname,'form.js'),'utf8')});
 await page.evaluate(()=>{
  window.mvdBrevoLoaded=true; // Only open our load guard to exercise local validation.
  const form=document.querySelector('form');
  form.elements.FIRSTNAME.value='Voorbeeld';form.elements.LASTNAME.value='Test';form.elements.EMAIL.value='test@example.invalid';form.elements.OPT_IN.checked=true;
 });
 return page;
}
async function submit(page){return page.evaluate(()=>{
 const event=new Event('submit',{bubbles:true,cancelable:true});
 document.querySelector('form').dispatchEvent(event);
 return {blocked:event.defaultPrevented,error:document.querySelector('#local-error').textContent};
});}
test('missing audience is blocked even with a topic',async()=>{const p=await setup();try{
 await p.evaluate(()=>document.querySelector('[value="6"]').checked=true);assert.equal((await submit(p)).blocked,true);
}finally{await p.close();}});
test('topic selection is mandatory',async()=>{const p=await setup();try{
 await p.locator('[value="patienten"]').check();assert.match((await submit(p)).error,/minstens één/);
}finally{await p.close();}});
test('switching audience clears and excludes incompatible selected list',async()=>{const p=await setup();try{
 await p.locator('[value="patienten"]').check();await p.locator('[value="5"]').check();await p.locator('[value="6"]').check();await p.locator('[value="zorgprofessionals"]').check();
 assert.deepEqual(await p.evaluate(()=>({checked:document.querySelector('[value="5"]').checked,disabled:document.querySelector('[value="5"]').disabled,lists:new FormData(document.querySelector('form')).getAll('lists_27[]')})),{checked:false,disabled:true,lists:['6']});
}finally{await p.close();}});
test('whitespace names are rejected with focused message',async()=>{const p=await setup();try{
 await p.locator('[value="patienten"]').check();await p.locator('[value="6"]').check();await p.locator('#FIRSTNAME').fill('  ');
 assert.match((await submit(p)).error,/voornaam/);assert.equal(await p.evaluate(()=>document.activeElement.id),'local-error');
}finally{await p.close();}});
test('valid presentation input reaches next handler with correct native lists',async()=>{const p=await setup();try{
 await p.locator('[value="patienten"]').check();await p.locator('[value="8"]').check();
 assert.equal((await submit(p)).blocked,false);
 assert.deepEqual(await p.evaluate(()=>new FormData(document.querySelector('form')).getAll('lists_27[]')),['8']);
}finally{await p.close();}});
test('missing provider load blocks submission',async()=>{const p=await setup();try{
 await p.evaluate(()=>window.mvdBrevoLoaded=false);assert.match((await submit(p)).error,/niet beschikbaar/);
}finally{await p.close();}});

async function setupLoader(fail=false){
 const page=await browser.newPage();
 // Serve only local fixture bytes. Never contact or simulate Brevo's API.
 await page.route('**/*',async route=>{
  const url=new URL(route.request().url());
  if(url.hostname!=='fixture.invalid')return route.abort();
  if(url.pathname==='/runtime.js')return fail?route.abort():route.fulfill({contentType:'application/javascript',body:'/* local script-load fixture only */'});
  const name=url.pathname.slice(1)||'integration.html';
  if(!['integration.html','style.css','form.js','brevo-settings.js','enable-native.js'].includes(name))return route.abort();
  let body=fs.readFileSync(path.join(__dirname,name),'utf8');
  if(name==='integration.html')body=body.replace('https://sibforms.com/forms/end-form/build/main.js','/runtime.js');
  return route.fulfill({contentType:name.endsWith('.js')?'application/javascript':name.endsWith('.css')?'text/css':'text/html',body});
 });
 await page.goto('http://fixture.invalid/integration.html');
 return page;
}
test('successful script load enables the actual generated form',async()=>{const p=await setupLoader();try{
 assert.equal(await p.locator('button[type=submit]').isEnabled(),true);
 assert.equal(await p.locator('#load-status').textContent(),'');
}finally{await p.close();}});
test('failed script load gives an error instead of indefinite loading',async()=>{const p=await setupLoader(true);try{
 assert.equal(await p.locator('button[type=submit]').isDisabled(),true);
 assert.match(await p.locator('#load-status').textContent(),/niet worden geladen/);
}finally{await p.close();}});
