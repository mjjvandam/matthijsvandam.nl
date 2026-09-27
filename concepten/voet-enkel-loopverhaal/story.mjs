import {illustration} from './renderer.mjs';
const data=await fetch('motion.json').then(r=>{if(!r.ok)throw Error('Motion unavailable');return r.json()});
const sections=[...document.querySelectorAll('.chapter')],drawing=document.querySelector('#drawing'),button=document.querySelector('#read-mode');
const reduced=matchMedia('(prefers-reduced-motion: reduce)'),short=matchMedia('(max-height: 620px)');
const specs=[
 {from:.78,to:1,mode:'person',label:'Als lopen pijn doet',keys:[]},
 {from:0,to:.1,focus:'arch',clinical:'heel',zoom:1.8,label:'Pijn onder de hiel',keys:['arch']},
 {from:.1,to:.36,focus:'calf',label:'Enkel en kuit',keys:['calf','soleus','tendon']},
 {from:.36,to:.36,focus:'arch',windlass:true,label:'Van voetboog naar windlass',keys:['arch']},
 {from:.42,to:.53,focus:'arch',clinical:'toe',zoom:2.4,label:'Een stijve grote teen',keys:[]},
 {from:.3,to:.3,focus:'calf',examination:true,label:'Orthopedisch onderzoek',keys:['calf','soleus']},
 {from:0,to:1,lab:true,label:'Wat een loopanalyse toevoegt',keys:[]},
 {from:.6,to:1,mode:'person',outdoors:true,label:'De pijnlijke plek én de stap',keys:[]}
];
const legend={anterior:['#BDB0F5','Voetheffers'],calf:['#ED927C','Gastrocnemius'],soleus:['#EDC46B','Soleus'],tendon:['#EFF6F9','Achillespees'],arch:['#65D6DA','Plantaire fascie']};
const clamp=x=>Math.max(0,Math.min(1,x)),smooth=x=>{x=clamp(x);return x*x*(3-2*x)};
let requested=false,manualRead=false,lastKey='';
function mode(){const forced=reduced.matches||short.matches||parseFloat(getComputedStyle(document.documentElement).fontSize)>=24;button.hidden=forced;lastKey='';document.body.classList.toggle('read-mode',manualRead||forced);button.setAttribute('aria-pressed',String(manualRead||forced));button.textContent=manualRead?'Bekijk met animatie':'Lees zonder animatie';schedule();}
function render(){requested=false;if(document.body.classList.contains('read-mode'))return;
 const mobile=innerWidth<=800,anchor=mobile?60+Math.max(220,innerHeight*.38)+65:innerHeight*.46;
 let index=0;for(let i=0;i<sections.length;i++)if(sections[i].getBoundingClientRect().top<=anchor)index=i;
 const rect=sections[index].getBoundingClientRect(),progress=clamp((anchor-rect.top)/rect.height),s=specs[index];
 // Arrival, slow motion, then a settled reading hold. Scroll is the only clock.
 let u=smooth(progress/.70),phase=s.from+(s.to-s.from)*u;
 let zoom=s.zoom||1;let focus=s.focus;
 const key=[index,phase.toFixed(4),zoom.toFixed(3),focus,progress.toFixed(3),mobile].join(':');if(key===lastKey)return;lastKey=key;
 drawing.innerHTML=illustration(data,phase,{...s,zoom,focus,detail:progress,compact:mobile,uid:'active-scene'});
 document.querySelector('#view-label').textContent=s.windlass||zoom>1.1?'Rechtervoet · binnenzijde':'Zijaanzicht';
 document.querySelector('.stage-top span').innerHTML='<i class="dot"></i>'+s.label;
 const keys=s.keys;
 document.querySelector('#legend').innerHTML=keys.map(k=>`<span style="--key:${legend[k][0]}">${legend[k][1]}</span>`).join('');
 document.querySelector('#phase-progress').style.width=phase*100+'%';
 document.querySelector('#phase-label').textContent=index===3?'Teen · peesplaat · voetboog':index===5?'Bewegingsruimte onderzoeken':phase<data.events.leftToeOff?'Steun overnemen':phase<data.events.heelRise?'Steunen':phase<data.events.leftContact?'Hiel komt omhoog':phase<data.events.rightToeOff?'Andere voet neemt over':phase<.99?'Voet beweegt naar voren':'Volgende contact';
 document.querySelector('.stage').dataset.scene=String(index);document.querySelector('.stage').dataset.phase=phase.toFixed(4);
}
function schedule(){if(!requested){requested=true;requestAnimationFrame(render)}}
button.hidden=false;button.addEventListener('click',()=>{manualRead=!manualRead;mode()});
document.body.classList.add('enhanced');reduced.addEventListener('change',mode);short.addEventListener('change',mode);addEventListener('scroll',schedule,{passive:true});addEventListener('resize',mode);mode();
function openSource(){if(location.hash.startsWith('#bron-'))document.querySelector('#source-details').open=true;}
openSource();addEventListener('hashchange',()=>{openSource();schedule()});document.addEventListener('click',e=>{if(e.target.closest('a[href^="#bron-"]'))document.querySelector('#source-details').open=true;});

// Enhancement changes the layout after the motion file arrives. Restore a deep link once.
if(location.hash){requestAnimationFrame(()=>{const target=document.getElementById(decodeURIComponent(location.hash.slice(1)));if(target){target.scrollIntoView({block:'start'});schedule();}});}
