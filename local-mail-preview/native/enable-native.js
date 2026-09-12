(function () {
'use strict';
// Register directly on the deferred provider script, before it executes.
// Script load events do not reach the old window-level listener reliably.
const runtime=document.getElementById('brevo-runtime');
const button=document.querySelector('#sib-form button[type=submit]');
const status=document.getElementById('load-status');
window.mvdBrevoLoaded=false;
status.setAttribute('role','status');
function failed(){
 button.disabled=true;
 status.textContent='Het inschrijfformulier kon niet worden geladen. Vernieuw de pagina om het opnieuw te proberen.';
}
const timer=setTimeout(failed,15000);
if(!runtime){clearTimeout(timer);failed();return;}
runtime.addEventListener('load',()=>{
 clearTimeout(timer);
 window.mvdBrevoLoaded=true;
 button.disabled=false;
 status.textContent='';
},{once:true});
runtime.addEventListener('error',()=>{
 clearTimeout(timer);
 failed();
},{once:true});
})();
