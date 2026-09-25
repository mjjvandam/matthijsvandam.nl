/* Progressive enhancement. Every state is derived from current document geometry. */
(() => {
  'use strict';
  const body = document.querySelector('[data-story-root]') || document.body;
  const toggle = document.querySelector('#motion-toggle');
  const chapters=[...document.querySelectorAll('.journey-moment')];
  const config=JSON.parse(document.querySelector('#journey-data').textContent);
  const camera=document.querySelector('#world-camera');
  const traveller=document.querySelector('#traveller');
  const facing=document.querySelector('#traveller-facing');
  const stageSvg=document.querySelector('#journey-svg');
  const stageCanvas=document.querySelector('.journey-canvas');
  const stations=[...document.querySelectorAll('#world-camera .world-station')];
  const upper=document.querySelector('#traveller-upper');
  const arm=document.querySelector('#traveller-arm');
  const head=document.querySelector('#traveller-head');
  const route=config.route;
  const lengths=[0];
  for(let i=1;i<route.length;i++)lengths.push(lengths[i-1]+Math.hypot(route[i][0]-route[i-1][0],route[i][1]-route[i-1][1]));
  const stops=config.scenes.map(scene=>lengths[route.findIndex(p=>p[0]===scene.actor_station[0]&&p[1]===scene.actor_station[1])]);
  const clamp=v=>Math.max(0,Math.min(1,v));
  const ease=v=>{v=clamp(v);return v*v*(3-2*v);};
  const mix=(a,b,t)=>a+(b-a)*t;
  function pointAt(distance){
    distance=Math.max(0,Math.min(lengths.at(-1),distance));
    let i=1;while(i<lengths.length-1&&lengths[i]<distance)i++;
    const t=(distance-lengths[i-1])/(lengths[i]-lengths[i-1]);
    return [mix(route[i-1][0],route[i][0],t),mix(route[i-1][1],route[i][1],t)];
  }
  function leg(id,hip,foot,seat){
    // Two equal segments; the bend is computed from hip/foot geometry.
    const dx=foot[0]-hip[0],dy=foot[1]-hip[1],distance=Math.hypot(dx,dy)||1;
    const bend=Math.sqrt(Math.max(0,28*28-Math.min(distance,56)**2/4));
    const knee=[(hip[0]+foot[0])/2+dy/distance*bend,(hip[1]+foot[1])/2-dx/distance*bend];
    knee[0]=mix(knee[0],foot[0],seat);knee[1]=mix(knee[1],hip[1],seat);
    document.querySelector(`#${id}-leg`).setAttribute('d',`M${hip} L${knee} L${foot}`);
    document.querySelector(`#${id}-shoe`).setAttribute('d',`M${foot[0]-4} ${foot[1]} h13`);
  }
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let readingMode = reduced.matches;
  let scheduled = false;
  let modeInitialized=false;
  let readingAnchor=null;
  function captureReadingAnchor(){
    const inset=body.classList.contains('has-motion')&&innerWidth<850?innerHeight*.4:0;
    const el=[...document.querySelectorAll('.journey-copy h2,.journey-copy p:not(.eyebrow)')].find(el=>{
      const r=el.getBoundingClientRect();return r.bottom>inset&&r.top<innerHeight;
    });
    return el?{el,top:el.getBoundingClientRect().top,inset}:null;
  }
  function paint() {
    scheduled=false;
    readingAnchor=captureReadingAnchor();
    if(!body.classList.contains('has-motion'))return;
    const mobile=innerWidth<850;
    const focus=innerHeight*(mobile?.08:.3);
    const positions=chapters.map(c=>c.getBoundingClientRect().top-focus);
    let current=0;while(current<chapters.length-1&&positions[current+1]<=0)current++;
    const next=Math.min(current+1,chapters.length-1);
    const span=current===next?chapters[current].getBoundingClientRect().height:positions[next]-positions[current];
    const local=span>0?clamp(-positions[current]/span):1;
    // Most of each moment is a quiet reading hold. The last third is travel.
    const travel=ease((local-.64)/.36);
    const startsSeated=config.scenes[current].pose==='seated';
    const endsSeated=config.scenes[next].pose==='seated';
    // Stand up before travelling; sit down only after arriving at the chair.
    const move=startsSeated?ease((travel-.18)/.82):endsSeated?ease(travel/.82):travel;
    const seat=startsSeated?1-ease(travel/.18):endsSeated?ease((travel-.82)/.18):0;
    // Three short walks with reading pauses; the last line ends the story, not care.
    const finale=current===7;
    const closingWalk=finale?(80*ease((local-.08)/.12)+120*ease((local-.25)/.13)+110*ease((local-.43)/.13)):0;
    const walkingFinale=finale?[[.08,.20],[.25,.38],[.43,.56]].reduce((v,[a,b])=>Math.max(v,Math.sin(clamp((local-a)/(b-a))*Math.PI)),0):0;
    const distance=finale?stops[current]+closingWalk:mix(stops[current],stops[next],move);
    const pos=pointAt(distance);
    const before=pointAt(Math.max(0,distance-3)),after=pointAt(distance+3);
    const pathFacing=after[0]>=before[0]?1:-1;
    const direction=finale?1:move>0&&move<1?pathFacing:1;
    facing.setAttribute('transform',`scale(${direction} 1)`);
    traveller.dataset.facing=String(direction);
    traveller.dataset.pathFacing=String(pathFacing);
    const gait=finale?walkingFinale:(current!==next?Math.min(1,move*10,(1-move)*10):0)*(1-seat);
    traveller.setAttribute('transform',`translate(${pos[0]} ${pos[1]})`);
    upper.setAttribute('transform',`translate(0 ${-15+seat*38})`);
    for(const [id,offset,side] of [['back',0,-1],['front',28,1]]){
      const cycle=(distance+offset)/56,k=Math.floor(cycle),phase=cycle-k;
      const planted=k*56-offset+14;
      const swing=phase<.5?0:ease((phase-.5)*2);
      const footPoint=pointAt(planted+swing*56);
      const lift=phase<.5?0:Math.sin((phase-.5)*Math.PI*2)*9;
      const foot=[mix(side*9,(footPoint[0]-pos[0])*direction+side*4,gait)+seat*22,mix(0,footPoint[1]-pos[1]-lift,gait)+seat*14];
      leg(id,[side*7,-54+seat*38],foot,seat);
    }
    const wave=Math.sin(travel*Math.PI*4)*gait*18;
    arm.setAttribute('transform',`rotate(${wave+seat*-12} 16 -73)`);
    head.setAttribute('transform',`rotate(${seat*4} 0 -85)`);
    // Each moment develops while its paragraphs pass through the reading area.
    const beat=clamp(local/.64);
    stations.forEach((station,i)=>{
      const phase=i<current?1:i===current?beat:0;
      station.dataset.phase=phase.toFixed(3);
      [...station.querySelectorAll('.scene-detail')].forEach((detail,j)=>{
        const reveal=ease((phase-.05-j*.18)/.26);
        detail.style.opacity=String(reveal);
        detail.setAttribute('transform',`translate(0 ${(1-reveal)*12})`);
      });
      station.querySelectorAll('.draw-detail').forEach(line=>{
        line.style.strokeDasharray='1';line.style.strokeDashoffset=String(1-ease(phase/.65));
      });
    });
    document.querySelectorAll('.finale-step').forEach((group,j)=>{
      const reveal=current===7?ease((local-[.10,.27,.45][j])/.10):0;
      group.style.opacity=String(reveal);
      group.setAttribute('transform',`translate(0 ${(1-reveal)*14})`);
      const network=group.querySelector('.finale-network');
      if(network){network.style.strokeDasharray='1';network.style.strokeDashoffset=String(1-reveal);}
    });
    // Draw the rising line while reading, before travel begins at local .64.
    const growth=stations[0].querySelector('.growth-trend');
    if(growth){
      const reveal=current===0?ease((local-.20)/.29):1;
      const fade=current===0?1-ease((local-.57)/.07):0;
      growth.style.opacity=String(fade);
      growth.querySelector('.growth-line').style.strokeDasharray='1';
      growth.querySelector('.growth-line').style.strokeDashoffset=String(1-reveal);
      growth.querySelector('.growth-arrow').style.opacity=String(ease((reveal-.88)/.12));
      growth.querySelector('.growth-label').style.opacity=String(ease((reveal-.6)/.4));
    }
    // A whole-person orbit, a shared conversation and movement are distinct acts.
    if(current===1){arm.setAttribute('transform',`rotate(${-10*Math.sin(beat*Math.PI)} 16 -73)`);}
    if(current===2&&move===0){arm.setAttribute('transform',`rotate(${-12-14*Math.sin(beat*Math.PI)} 16 -73)`);}
    if(current===3&&move===0){
      const practice=Math.sin(beat*Math.PI*2);
      leg('front',[7,-54],[9+practice*8,-Math.max(0,practice)*8],0);
      arm.setAttribute('transform',`rotate(${-practice*16} 16 -73)`);
    }
    const mapBeat=current===6?beat:current>6?1:0;
    if(stations[6]) {
    const mapStation=stations[6];

    const zoom=ease((mapBeat-.22)/.40);
    const region=ease((mapBeat-.64)/.28);
    const mapZoom=mapStation.querySelector('.map-zoom');
    mapZoom.setAttribute('transform',`scale(${1+zoom*1.6}) translate(${-Number(mapZoom.dataset.focusX)*zoom} ${-Number(mapZoom.dataset.focusY)*zoom})`);
    mapStation.querySelector('.country-map').style.opacity=String(1-region*.94);
    mapStation.querySelector('.region-network').style.opacity=String(region);
    mapStation.querySelector('.region-network').setAttribute('transform',`translate(0 ${(1-region)*24})`);
    }
    const cx=mix(config.scenes[current].station[0],config.scenes[next].station[0],move);
    const cy=mix(config.scenes[current].station[1],config.scenes[next].station[1],move);
    const rect=stageCanvas.getBoundingClientRect();
    const width=rect.width,height=rect.height;
    stageSvg.setAttribute('viewBox',`0 0 ${width} ${height}`);
    const focusX=mobile?.5:mix(config.scenes[current].focus_x,config.scenes[next].focus_x,move);
    const fit=mobile?Math.min(width/630,height/475):Math.min(width/1280,height/800);
    const detailZoom=current===1?1+.07*Math.sin(beat*Math.PI):current===5?1-.10*beat*(1-move):1;
    const scale=mix(config.scenes[current].camera_scale,config.scenes[next].camera_scale,move)*fit*detailZoom;
    // Keep the opening illustration alongside the text, then ease into later framing.
    const desktopY=current===0?mix(.42,.52,move):current===1?mix(.52,.64,move):.64;
    camera.setAttribute('transform',`translate(${width*focusX} ${height*(mobile?.68:desktopY)}) scale(${scale}) translate(${-cx} ${-cy})`);
    document.querySelector('.stage-label').textContent=current===6?(mapBeat<.44?'Landelijk voorstel · schematische spreiding':mapBeat<.78?'Tilburg · lokaal aanknopingspunt bij het landelijke voorstel':'Tilburg · lokaal aanknopingspunt; netwerk schematisch'):['Dagelijkse activiteiten als vertrekpunt','Lichaam, welzijn en verwachtingen','Uitleg en ondersteuning, samen besproken','Bewegen met begeleiding · geen oefeninstructie','Afstemmen op wat iemand nodig heeft','Een regionaal netwerk · schematisch','','Uitleg, leefstijlbegeleiding en een netwerk rond de persoon'][current];
    document.querySelector('.stage-label').style.left=mobile?'0':`${(focusX-.24)*100}%`;
    document.querySelector('.stage-label').style.width=mobile?'100%':'48%';

    const sign=document.querySelector('#journey-sign');
    if(sign){
      // Pull a folded board from the trouser pocket, unfold below the chest,
      // then lower it. All phases reverse with scroll and start at zero size.
      const progress=current===1?local:0;
      const pull=ease((progress-.12)/.18);
      const unfold=ease((progress-.27)/.22);
      const lower=ease((progress-.46)/.22);
      const size=.16*pull+.84*unfold;
      const sx=18+27*pull+55*unfold;
      const sy=-49+18*pull+23*unfold+28*lower;
      sign.setAttribute('visibility',size>0?'visible':'hidden');
      sign.setAttribute('transform',`translate(${pos[0]+sx} ${pos[1]+sy}) rotate(${-8*pull*(1-unfold)}) scale(${size})`);
      sign.querySelector('a').style.pointerEvents=lower>.9?'all':'none';
      sign.querySelector('a').setAttribute('tabindex',lower>.9?'0':'-1');
      if(current===1){
        const bend=Math.sin(lower*Math.PI);
        upper.setAttribute('transform',`translate(0 -15) rotate(${bend*14} 0 -37)`);
        arm.removeAttribute('transform');
        const reach=Math.sin(Math.PI*Math.min(1,(progress-.10)/.62));
        const handX=18+Math.max(0,reach)*37;
        const handY=-34+Math.max(0,reach)*16;
        arm.querySelector('path').setAttribute('d',`M16 -73 L${21+Math.max(0,reach)*12} -49 L${handX} ${handY}`);
        arm.querySelector('path:last-child').setAttribute('d',`M${handX} ${handY} l4 -3`);
      }else{
        arm.querySelector('path').setAttribute('d','M16 -73 L24 -54 L37 -59');
        arm.querySelector('path:last-child').setAttribute('d','M36 -59 l4 -3');
      }
    }
    body.dataset.journeyPhase=beat.toFixed(3);
    body.dataset.journeyScene=String(current);
  }
  function requestPaint() { if (!scheduled) { scheduled=true; requestAnimationFrame(paint); } }
  function applyMode() {
    // Capture before resize changes layout; paint keeps the last reading position.
    const anchor=modeInitialized?readingAnchor:null;
    const largeText=parseFloat(getComputedStyle(document.documentElement).fontSize)>20;
    const shortScreen=innerHeight<600;
    const staticRequired=reduced.matches||largeText||shortScreen;
    body.classList.toggle('has-motion',!readingMode&&!staticRequired);
    if(toggle) {
    toggle.setAttribute('aria-pressed',String(readingMode||staticRequired));
    toggle.disabled=staticRequired;
    toggle.textContent=staticRequired?(reduced.matches?'Zonder animatie (systeemvoorkeur)':largeText?'Leesmodus (vergrote tekst)':'Leesmodus (laag venster)'):readingMode?'Lees met scrollbeelden':'Lees zonder animatie';
    }
    const isMotion=body.classList.contains('has-motion');
    if(anchor){
      const newInset=isMotion&&innerWidth<850?innerHeight*.4:0;
      scrollBy(0,anchor.el.getBoundingClientRect().top-anchor.top-newInset+anchor.inset);
    }
    modeInitialized=true;
    requestPaint();
  }
  body.classList.add('has-js');
  if(toggle) toggle.hidden=false;
  toggle?.addEventListener('click',() => { readingMode=!readingMode; applyMode(); });
  reduced.addEventListener('change',() => {readingMode=reduced.matches; applyMode();});
  addEventListener('scroll',requestPaint,{passive:true});
  addEventListener('resize',applyMode);
  addEventListener('hashchange',requestPaint);
  addEventListener('pageshow',requestPaint);
  document.querySelectorAll('.chapter-menu a').forEach(link=>link.addEventListener('click',()=>{
    document.querySelector('.chapter-menu').open=false;
  }));
  document.querySelector('#color-mode')?.addEventListener('change',event=>{
    const value=event.target.value;
    if(value==='auto') document.documentElement.removeAttribute('data-theme');
    else document.documentElement.dataset.theme=value;
  });
  applyMode();
  // Resolve an incoming station link after enhancement changes document height.
  const initialTarget=chapters.find(c=>`#${c.id}`===location.hash);
  if(initialTarget)requestAnimationFrame(()=>{initialTarget.scrollIntoView({block:'start'});requestPaint();});
})();
