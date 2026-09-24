/* A short, reversible walk driven only by homepage scroll, using the story person. */
(() => {
  const root=document.querySelector('.artrose-teaser');
  if(!root)return;
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const actor=root.querySelector('#traveller');
  const arm=root.querySelector('#traveller-arm');
  const clamp=n=>Math.max(0,Math.min(1,n));
  let pending=false;
  function paint(){
    pending=false;
    const r=root.querySelector('.teaser-art').getBoundingClientRect();
    const staticMode=reduced.matches||parseFloat(getComputedStyle(document.documentElement).fontSize)>20;
    const t=staticMode?0:clamp((innerHeight*.78-r.top)/(innerHeight*.65+r.height*.25));
    const distance=t*120;
    const gait=Math.min(1,t*12,(1-t)*12);
    actor.setAttribute('transform',`translate(${distance} ${-distance*.48})`);
    for(const [id,offset,side] of [['back',0,-1],['front',28,1]]){
      const cycle=(distance+offset)/56,k=Math.floor(cycle),phase=cycle-k;
      const swing=phase<.5?0:(phase-.5)*2;
      const eased=swing*swing*(3-2*swing);
      const x=k*56-offset+14+eased*56-distance;
      const lift=phase<.5?0:Math.sin(swing*Math.PI)*9;
      const foot=[side*9*(1-gait)+(x+side*4)*gait,(-x*.48-lift)*gait];
      const hip=[side*7,-54];
      const dx=foot[0]-hip[0],dy=foot[1]-hip[1],length=Math.hypot(dx,dy);
      const bend=Math.sqrt(Math.max(0,28**2-Math.min(length,56)**2/4));
      const knee=[(hip[0]+foot[0])/2+dy/length*bend,(hip[1]+foot[1])/2-dx/length*bend];
      root.querySelector(`#${id}-leg`).setAttribute('d',`M${hip} L${knee} L${foot}`);
      root.querySelector(`#${id}-shoe`).setAttribute('d',`M${foot[0]-4} ${foot[1]} h13`);
    }
    arm.setAttribute('transform',`rotate(${Math.sin(distance/56*Math.PI*2)*18*gait} 16 -73)`);
    root.dataset.progress=t.toFixed(3);
  }
  function request(){if(!pending){pending=true;requestAnimationFrame(paint);}}
  addEventListener('scroll',request,{passive:true});
  addEventListener('resize',request);
  reduced.addEventListener('change',request);
  request();
})();
