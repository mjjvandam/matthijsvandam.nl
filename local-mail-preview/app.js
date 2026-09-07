'use strict';
const navToggle=document.querySelector('[data-nav-toggle]');
navToggle.onclick=()=>{const nav=document.querySelector('[data-nav]');nav.hidden=!nav.hidden;navToggle.setAttribute('aria-expanded',String(!nav.hidden));};
const byId=id=>document.getElementById(id);
byId('theme').onclick=()=>{document.documentElement.dataset.theme=document.documentElement.dataset.theme==='dark'?'light':'dark';};
async function post(url,body){const res=await fetch(url,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});const data=await res.json();if(!res.ok)throw new Error(data.message);return data;}
async function init(){
 const config=await (await fetch('/config')).json();
 function showStreams(audience){
  byId('streams').replaceChildren();
  byId('stream-choices').hidden=false;
  for(const s of config.streams.filter(s=>s.audiences.includes(audience))){
   const label=document.createElement('label');label.className='check';
   const input=document.createElement('input');input.type='checkbox';input.name='streams';input.value=s.id;
   label.append(input,document.createTextNode(s.label.split(' · ')[0]));byId('streams').append(label);
  }
  byId('mail-preview').hidden=true;
 }
 for(const radio of document.querySelectorAll('[name=audience]')) radio.addEventListener('change',()=>showStreams(radio.value));
 const selectedAudience=document.querySelector('[name=audience]:checked');
 if(selectedAudience)showStreams(selectedAudience.value);
 const data=await (await fetch('/selection')).json();
 for(const s of data.candidates){const title=document.createElement('h3');title.textContent=s.label;const ul=document.createElement('ul');for(const text of s.articles){const li=document.createElement('li');li.textContent=text;ul.append(li);}byId('selection').append(title,ul);}
 const count=document.createElement('p');count.textContent='Vrijgegeven voor verzending: '+Object.values(data.approved).reduce((a,b)=>a+b,0);byId('selection').prepend(count);
}
for(const form of document.forms){let busy=false, requestId=crypto.randomUUID();form.addEventListener('input',()=>{requestId=crypto.randomUUID();});form.addEventListener('submit',async e=>{e.preventDefault();if(busy)return;const fd=new FormData(form),body=Object.fromEntries(fd);body.requestId=requestId;if(form.id==='contact')body.geen_medische_gegevens=fd.has('geen_medische_gegevens');else{body.consent=fd.has('consent');body.streams=fd.getAll('streams');}const status=form.querySelector('.status');if(form.id==='subscribe'&&!body.streams.length){status.textContent='Kies ten minste één nieuwsbrief.';status.focus();return;}busy=true;const button=form.querySelector('[type=submit]');button.disabled=true;status.textContent='De proef wordt gecontroleerd…';try{const data=await post('/'+form.id,body);status.textContent=data.message;if(data.mailPreviewUrl){byId('open-mail').href=data.mailPreviewUrl;byId('mail-preview').hidden=false;}status.focus();}catch(error){status.textContent=error.message;status.focus();}finally{busy=false;button.disabled=false;}});}
init().catch(()=>{byId('selection').textContent='De lokale configuratie kon niet worden geladen. Start de proefserver opnieuw.';});
