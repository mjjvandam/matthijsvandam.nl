'use strict';
// Secret only in fragment and memory. Remove it before any network request/user navigation.
let token=new URLSearchParams(location.hash.slice(1)).get('token'),offToken;
history.replaceState(null,'',location.pathname);
const status=document.getElementById('status'),confirm=document.getElementById('confirm'),off=document.getElementById('unsubscribe');
const show=message=>{status.textContent=message;status.focus();};
if(!token||!/^[A-Za-z0-9_-]{43}$/.test(token)){confirm.disabled=true;show('Deze link ontbreekt of is ongeldig. Vraag via het formulier een nieuwe bevestigingsmail aan.');}
async function post(path,secret){
 const response=await fetch(path,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({token:secret}),signal:AbortSignal.timeout(12000)});
 const result=await response.json();if(typeof result.message!=='string')throw Error('Ongeldig antwoord.');return result;
}
confirm.addEventListener('click',async()=>{
 if(confirm.disabled)return;confirm.disabled=true;show('Je inschrijving wordt gecontroleerd…');
 try{const result=await post('/confirm',token);token=null;show(result.message);
 if(result.ok){document.getElementById('title').textContent='Je inschrijving is bevestigd';document.getElementById('intro').textContent='Je hebt de proef afgerond. Er worden geen echte nieuwsbrieven verstuurd.';offToken=result.unsubscribeToken;off.hidden=false;confirm.hidden=true;}}
 catch{token=null;show('De uitkomst is nog niet bekend. Sluit deze pagina; we herhalen de aanvraag niet automatisch.');}
});
off.addEventListener('click',async()=>{
 if(off.disabled)return;off.disabled=true;
 try{const result=await post('/unsubscribe',offToken);offToken=null;show(result.message);if(result.ok){document.getElementById('title').textContent='Je bent uitgeschreven';off.hidden=true;}}
 catch{offToken=null;show('De uitkomst van je afmelding is nog niet bekend. Er wordt niet automatisch opnieuw geprobeerd.');}
});
