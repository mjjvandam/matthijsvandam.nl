/* Scroll-derived placing gesture; the link works without animation or JavaScript. */
(() => {
  const root=document.querySelector('.home-story-farewell');
  if(!root)return;
  const sign=root.querySelector('#farewell-sign');
  const upper=root.querySelector('#farewell-traveller-upper');
  const arm=root.querySelector('#farewell-traveller-arm');
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  let pending=false;
  function paint(){
    pending=false;
    const r=root.getBoundingClientRect();
    const still=reduced.matches||innerHeight<600||parseFloat(getComputedStyle(document.documentElement).fontSize)>20;
    const t=still?1:Math.max(0,Math.min(1,(innerHeight*.95-r.top)/(innerHeight*.55)));
    const ease=t*t*(3-2*t),bend=Math.sin(t*Math.PI);
    sign.setAttribute('transform',`translate(${42+30*ease} ${-66+56*ease}) rotate(${-10*(1-ease)})`);
    upper.setAttribute('transform',`translate(0 -15) rotate(${bend*12} 0 -37)`);
    arm.setAttribute('transform',`rotate(${-35*(1-ease)+bend*22} 16 -73)`);
  }
  function request(){if(!pending){pending=true;requestAnimationFrame(paint);}}
  addEventListener('scroll',request,{passive:true});addEventListener('resize',request);reduced.addEventListener('change',request);request();
})();
