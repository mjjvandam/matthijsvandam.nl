(function () {
'use strict';
const form=document.querySelector('#sib-form');
const review=document.documentElement.dataset.review==='true';
function filterTopics(){
 const audience=form.querySelector('[name=audience]:checked')?.value;
 document.querySelector('#topics').hidden=!audience;
 for(const choice of form.querySelectorAll('[data-audience]')){
  const applicable=choice.dataset.audience===audience;
  choice.hidden=!applicable;
  const input=choice.querySelector('input');
  input.disabled=!applicable;
  if(!applicable)input.checked=false;
 }
 document.querySelector('#audience-note').textContent=!audience?'':audience==='patienten'?'Je kiest de artikelen voor patiënten.':'Je kiest de artikelen voor zorgprofessionals.';
}
form.addEventListener('change',event=>{
 if(event.target.name==='audience')filterTopics();
 document.querySelector('#local-error').textContent='';
});
// Capture before the native Brevo handler. This checks presentation choices only;
// Brevo remains responsible for all subscriber storage and confirmation.
form.addEventListener('submit',event=>{
 filterTopics();
 let error='';
 if(review||!window.mvdBrevoLoaded)error='Inschrijven is hier nog niet beschikbaar.';
 else if(!form.reportValidity())error='Controleer de ingevulde gegevens.';
 else if(!form.querySelector('[name="lists_27[]"]:checked:not(:disabled)'))error='Kies minstens één onderwerp.';
 else if(!form.elements.namedItem('FIRSTNAME').value.trim()||!form.elements.namedItem('LASTNAME').value.trim())error='Vul je voornaam en achternaam in.';
 if(error){event.preventDefault();event.stopImmediatePropagation();const message=document.querySelector('#local-error');message.focus();message.textContent=error;}
},true);
form.addEventListener('reset',()=>setTimeout(filterTopics,0));
filterTopics();

})();
