// Original SVG illustration. Motion data are retargeted, never a diagnostic model.
export const lerp=(a,b,t)=>a+(b-a)*t;
export function sample(data,phase){
 const u=Math.max(0,Math.min(1,phase))*(data.frames.length-1),i=Math.floor(u),f=u-i;
 function mix(a,b){if(typeof a==='number')return lerp(a,b,f);if(typeof a==='boolean')return f<.5?a:b;if(Array.isArray(a))return a.map((v,j)=>mix(v,b[j]));return Object.fromEntries(Object.keys(a).map(k=>[k,mix(a[k],b[k])]));}
 return mix(data.frames[i],data.frames[Math.min(i+1,data.frames.length-1)]);
}
const fmt=n=>Number(n.toFixed(2));
const pt=p=>p.map(fmt).join(',');
const line=(a,b,c,w,extra='')=>`<path d="M${pt(a)}L${pt(b)}" stroke="${c}" stroke-width="${w}" stroke-linecap="round" fill="none" ${extra}/>`;
const circle=(p,r,c)=>`<circle cx="${fmt(p[0])}" cy="${fmt(p[1])}" r="${r}" fill="${c}"/>`;
function muscle(a,b,width,color){const dx=b[0]-a[0],dy=b[1]-a[1],d=Math.hypot(dx,dy),nx=-dy/d*width,ny=dx/d*width;return `<path d="M${pt(a)} C${pt([a[0]+nx,a[1]+ny])} ${pt([b[0]+nx,b[1]+ny])} ${pt(b)} C${pt([b[0]-nx,b[1]-ny])} ${pt([a[0]-nx,a[1]-ny])} ${pt(a)}" fill="${color}" stroke="#102330" stroke-width="1.2"/>`;}
export function illustration(data,phase=0,{mode='anatomy',focus='all',zoom=1,debug=false,lab=false,examination=false,detail=1,compact=false,outdoors=false,windlass=false,clinical='',uid='gait'}={}){
 const frame=sample(data,phase),scale=.32,ground=520,center=355;
 const xy=p=>[center+(p[0]-frame.hip[0])*scale,ground-p[1]*scale];
 const p=xy(frame.hip),r=frame.legs.R,l=frame.legs.L;
 function leg(q,side){
  const h=xy(q.hip),k=xy(q.knee),a=xy(q.ankle),heel=xy(q.heel),m=xy(q.mtp),toe=xy(q.toe);
  if(debug)return line(h,k,'#e4ebef',3)+line(k,a,'#e4ebef',3)+line(a,heel,'#65d6da',2)+line(heel,m,'#65d6da',3)+line(m,toe,'#edc46b',3)+[h,k,a,heel,m,toe].map(p=>circle(p,4,'#ed927c')).join('');
  const skin=side==='R'?'#BDCDDA':'#637B8C';
  let out=line(h,k,skin,36)+line(k,a,skin,23)+`<path d="M${pt([a[0]-10,a[1]-5])} Q${pt([heel[0]-12,heel[1]-16])} ${pt([heel[0]-8,heel[1]+1])} Q${pt([heel[0],heel[1]+3])} ${pt([toe[0],toe[1]+3])} Q${pt([toe[0]+6,toe[1]-6])} ${pt([m[0],m[1]-13])} L${pt([a[0]+10,a[1]-5])}Z" fill="${skin}"/>`;
  if(mode==='person'||side==='L')return out;
  // Silhouette becomes a quiet context layer, not a competing opaque leg.
  out=`<g opacity=".16">${out}</g>`;
  out+=line(h,k,'#D9E3E9',12)+circle(h,12,'#E4EBEF')+circle(k,9,'#E4EBEF');
  out+=line(k,a,'#E4EBEF',10)+line([k[0]-6,k[1]+13],[a[0]-7,a[1]+2],'#6E8797',3);
  out+=`<ellipse cx="${k[0]+10}" cy="${k[1]}" rx="4" ry="8" fill="#B6CAD5"/>`;
  const mid=(a,b,t)=>a.map((v,i)=>lerp(v,b[i],t));
  const back=(p,n)=>[p[0]-n,p[1]];
  const ach=[heel[0]-2,heel[1]-9],junction=back(mid(k,a,.75),7);
  const opacity=key=>(focus==='all'||focus===key)?1:.22;
  out+=`<g opacity="${opacity('calf')}">`+muscle(back(mid(k,a,.15),1),junction,14,'#EDC46B')+muscle(back(mid(h,k,.92),7),back(mid(k,a,.62),13),20,'#ED927C')+line(back(mid(k,a,.62),13),junction,'#DCB4A2',4)+line(junction,ach,'#EFF6F9',5)+`</g>`;
  out+=`<g opacity="${opacity('anterior')}">`+muscle([k[0]+8,k[1]+15],[a[0]+6,a[1]-17],10,'#BDB0F5')+line([a[0]+6,a[1]-17],[m[0]-22,m[1]-9],'#BDB0F5',3)+`</g>`;
  const angle=-q.angle*180/Math.PI;
  // Distinct medial bones, drawn originally in local foot coordinates (mm).
  out+=`<g transform="translate(${pt(heel)}) rotate(${angle}) scale(.32)">
   <path d="M-19,-12 Q-25,-43 -3,-52 L48,-48 Q74,-37 61,-13 L33,1 -9,1Z" fill="#D8E6EA" stroke="#49616F" stroke-width="2"/>
   <path d="M28,-58 Q26,-89 49,-91 Q74,-86 82,-63 L62,-48 39,-47Z" fill="#EDF3F5" stroke="#49616F" stroke-width="2"/>
   <path d="M78,-61 Q92,-75 108,-57 L110,-34 87,-30 72,-42Z" fill="#D8E6EA" stroke="#49616F" stroke-width="2"/>
   <path d="M110,-55 L134,-43 142,-24 119,-19 108,-33Z" fill="#E4EBEF" stroke="#49616F" stroke-width="2"/>
   <path d="M138,-37 Q157,-30 178,-26 L205,-20 Q217,-10 204,-2 L180,-8 139,-18Z" fill="#EDF3F5" stroke="#49616F" stroke-width="2"/>
   <path d="M6,-9 Q91,-35 201,-7" fill="none" stroke="#65D6DA" stroke-width="6" opacity="${opacity('arch')}"/>
   </g>`;
  const toeMid=mid(m,toe,.6);out+=line([m[0]+1,m[1]-3],[toeMid[0],toeMid[1]-3],'#DAE7EC',7)+line([toeMid[0]+2,toeMid[1]-3],[toe[0],toe[1]-3],'#DAE7EC',5);
  if(lab)out+=[h,k,a,heel,m].map(v=>circle(v,3,'#65D6DA')).join('');
  return out;
 }
 const chest=[p[0]-3,p[1]-120],shoulder=[p[0]-5,p[1]-164],head=[p[0]+3,p[1]-207];
 const armSwing=Math.sin(phase*Math.PI*2)*24;
 let person=`<g opacity="${mode==='person'?1:.28}">`+line(p,chest,'#526D82',67)+line(chest,shoulder,'#526D82',52)+line(shoulder,[shoulder[0]+armSwing,shoulder[1]+75],'#AEC3CD',17)+line([shoulder[0]+armSwing,shoulder[1]+75],[shoulder[0]+25+armSwing,shoulder[1]+140],'#AEC3CD',13)+line([chest[0],chest[1]-20],[head[0],head[1]+13],'#AEC3CD',19)+circle(head,24,'#BDCDD6')+`<path d="M${head[0]-24},${head[1]-1} Q${head[0]-31},${head[1]-31} ${head[0]+9},${head[1]-28} Q${head[0]+23},${head[1]-22} ${head[0]+24},${head[1]-9} Q${head[0]+4},${head[1]-20} ${head[0]-24},${head[1]-1}" fill="#365367"/>`+circle([head[0]+16,head[1]-3],1.8,'#142A3A')+`</g>`;
 person+=leg(r,'R')+`<g opacity="${mode==='person'?1:.2}">${leg(l,'L')}</g>`;
 // Anatomical medial right view: left limb is foreground, transparent in anatomy mode.
 const focusPoint=xy([(r.heel[0]+r.mtp[0])/2,75]);
 const fullPerson=person; if(zoom>1.1)person=leg(r,'R');
 const transform=zoom>1?`translate(365 350) scale(${zoom}) translate(${-focusPoint[0]} ${-focusPoint[1]})`:'';
 const lines=Array.from({length:15},(_,i)=>{let x=i*80-(frame.hip[0]*scale%80);return `<path d="M${x},${ground+7}v5" stroke="#537080"/>`;}).join('');
 let scene=`<g transform="${transform}"><path d="M-1600,${ground+3}H2200" stroke="#648396" stroke-width="1"/>${lines}${person}</g>`;
 if(zoom>1.1)scene+=`<g transform="translate(520 12) scale(.24)" opacity=".7">${fullPerson}</g>`;
 if(lab){
  const reveal=(from)=>Math.max(0,Math.min(1,(detail-from)/.16));
  scene+=`<g stroke="#65D6DA" fill="none" stroke-width="1.5"><g opacity="${reveal(0)}"><path d="M82,350V220h40v28H82m20,0V350 M610,350V220h40v28h-40m20,0V350"/><path d="M120,248L220,420 M611,248L510,420" stroke-dasharray="3 8" opacity=".4"/></g><rect opacity="${reveal(.22)}" x="102" y="523" width="470" height="8" rx="4"/></g>`;
  const calf=xy(r.knee),ankle=xy(r.ankle),e=[lerp(calf[0],ankle[0],.4)-11,lerp(calf[1],ankle[1],.4)];
  scene+=`<g opacity="${reveal(.44)}">${circle(e,5,'#EDC46B')}${circle([e[0]+3,e[1]+17],5,'#EDC46B')}<path d="M${pt(e)}Q${e[0]-75},${e[1]-20} 140,410" stroke="#EDC46B" fill="none"/><text x="75" y="440" fill="#EDC46B" font-size="13">Elektroden</text></g>`;
  scene+=`<text x="360" y="575" text-anchor="middle" fill="#B8CDD8" font-size="15">Beweging · grondreactiekracht · spieractiviteit</text>`;
 }

 if(examination){
  const example=(x,bent)=>{
   const hip=[x+55,195],knee=[x+65,302],angle=bent?-.65:Math.atan2(10,107),down=[Math.sin(angle),Math.cos(angle)],forward=[down[1],-down[0]],ankle=knee.map((v,i)=>v+119*down[i]),heel=ankle.map((v,i)=>v+26*down[i]-13*forward[i]),toe=heel.map((v,i)=>v+62*forward[i]);
   const junction=[lerp(knee[0],ankle[0],.8)-9,lerp(knee[1],ankle[1],.8)];
   return `<g><text x="${x+95}" y="150" text-anchor="middle" fill="#E4EBEF" font-size="${compact?30:20}">Knie ${bent?'gebogen':'gestrekt'}</text>`+line(hip,knee,'#D5E3EA',14)+line(knee,ankle,'#D5E3EA',12)+line(heel,toe,'#D5E3EA',11)+line(ankle,heel,'#D5E3EA',10)+muscle([knee[0]-5,knee[1]+15],junction,12,'#EDC46B')+muscle([knee[0]-11,knee[1]-18],junction,17,'#ED927C')+line(junction,heel,'#EFF6F9',4)+circle(knee,9,'#E4EBEF')+`<path d="M${heel[0]-24},${heel[1]+20}q-2,-20 14,-19 M${toe[0]+8},${toe[1]+20}q15,-18 -1,-27" stroke="#AFC5D0" stroke-width="7" stroke-linecap="round" fill="none"/></g>`;
  };
  scene=example(80,false)+example(410,true)+(compact?'':`<text x="360" y="515" text-anchor="middle" fill="#B8CDD8" font-size="16">Bewegingsruimte · kracht en belasting · jouw verhaal</text><text x="360" y="545" text-anchor="middle" fill="#B8CDD8" font-size="13">Schematische onderzoekshoudingen · geen zelftest</text>`);
 }
 if(outdoors)scene=`<g opacity=".65"><path d="M90 510V403" stroke="#6D9BA3" stroke-width="6"/><circle cx="90" cy="370" r="47" fill="#294B59"/><circle cx="68" cy="400" r="33" fill="#345D67"/><path d="M535 457h100m-85 0v62m70-62v62" stroke="#6D9BA3" stroke-width="7" stroke-linecap="round"/></g>`+scene;


 if(clinical){
  const q=clinical==='toe'?xy(r.mtp):xy(r.heel);
  const marker=zoom>1?[365+(q[0]-focusPoint[0])*zoom,350+(q[1]-focusPoint[1])*zoom]:q;
  scene+=`<circle cx="${marker[0]}" cy="${marker[1]-7}" r="20" fill="none" stroke="#EDC46B" stroke-width="2"/><path d="M${marker[0]},${marker[1]-28}v-60" stroke="#EDC46B"/><text x="${marker[0]}" y="${marker[1]-100}" text-anchor="middle" fill="#EDC46B" font-size="${compact?25:18}">${clinical==='toe'?'Grote-teengewricht':'Aanhechting peesplaat'}</text>`;
 }
 if(windlass){
  const clamp=x=>Math.max(0,Math.min(1,x)),ease=x=>{x=clamp(x);return x*x*(3-2*x)};
  const isolate=ease(detail/.12),trace=ease((detail-.12)/.15),move=ease((detail-.30)/.20),turn=ease((detail-.57)/.27);
  const heel=xy(r.heel),footAngle=-r.angle*180/Math.PI;
  // A single right limb becomes the anatomical source of the schematic copy.
  const mag=lerp(1,2.8,isolate),tx=lerp(heel[0],445,isolate),ty=lerp(heel[1],430,isolate);
  const angle=turn*1.02,rad=10,shift=rad*angle,d=205-shift,L1=Math.hypot(90,60),L2=Math.hypot(115,60);
  const x=(L1*L1-L2*L2+d*d)/(2*d),y=-Math.sqrt(L1*L1-x*x);
  const h=[shift,10],peak=[shift+x,y],m=[205,0],toe=[205+55*Math.cos(angle),-55*Math.sin(angle)];
  const bandEnd=[205+rad*Math.sin(angle)+30*Math.cos(angle),rad*Math.cos(angle)-30*Math.sin(angle)];
  const band=`M${pt(h)}L205,10 A10,10 0 0 0 ${pt([205+rad*Math.sin(angle),rad*Math.cos(angle)])} L${pt(bandEnd)}`;
  const model=(opacity=1)=>`<g opacity="${opacity}" transform="translate(0 -13)">${line([shift,0],peak,'#E4EBEF',5)}${line(peak,m,'#E4EBEF',5)}${circle(m,10,'#49616F')}${line(m,toe,'#E4EBEF',7)}<path d="${band}" stroke="#65D6DA" stroke-width="4" fill="none"/>${circle([shift,0],4,'#65D6DA')}${circle(peak,4,'#E4EBEF')}</g>`;
  scene=`<g opacity="${1-isolate}">${fullPerson}</g><defs><clipPath id="${uid}-crop"><rect x="0" y="30" width="720" height="535"/></clipPath></defs><g opacity="${isolate}" clip-path="url(#${uid}-crop)"><g transform="translate(${tx} ${ty}) scale(${mag}) translate(${-heel[0]} ${-heel[1]})">${leg(r,'R')}</g></g>`;
  const initialScale=mag*.32;
  scene+=`<g opacity="${trace*.35*(1-turn)}" transform="translate(${tx} ${ty}) rotate(${footAngle}) scale(${initialScale})">${model()}</g>`;
  // Copy originates on that very foot, then travels left before it starts moving.
  const mx=lerp(tx,42,move),my=lerp(ty,385,move),ms=lerp(initialScale,1.12,move),rotation=lerp(footAngle,0,move);
  scene+=`<g opacity="${trace}" transform="translate(${mx} ${my}) rotate(${rotation}) scale(${ms})">${model()}</g>`;
  if(move>.98)scene+=`<g fill="#B8CDD8" font-size="${compact?25:18}"><text x="42" y="270">${turn>.05?(compact?'Teen omhoog':'Teen omhoog → boog komt mee'):(compact?'Van voet naar model':'Dezelfde voet, vereenvoudigd')}</text>${compact?'':`<text x="245" y="302" font-size="15">Grote teen</text>`}<text x="42" y="435" fill="#65D6DA">Peesplaat</text>${compact?'':`<text x="240" y="435" font-size="15">Kopje</text>`}<text x="42" y="470" font-size="${compact?23:15}">${compact?'Schematisch':'Windlassprincipe · geen meetmodel'}</text></g>`;
  if(!compact)scene+=`<text x="445" y="515" fill="#B8CDD8" font-size="16">Rechtervoet · binnenzijde</text>`;
 }
 return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${compact&&examination?'60 115 600 380':compact&&windlass?'0 170 720 370':compact&&zoom>2?'30 55 650 480':'0 0 720 620'}" role="img" aria-labelledby="${uid}-title"><desc id="${uid}-title">${debug?'Controlebeeld van het vereenvoudigde skelet':windlass?'Van rechtervoet naar schematisch windlassprincipe':examination?'Onderzoek met gestrekte en correct gebogen knie':'Schematische wandelaar; voet, enkel en kuit tijdens lopen'}</desc>${scene}</svg>`;
}
