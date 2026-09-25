import {readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import assert from 'node:assert/strict';
import {illustration,sample} from '../renderer.mjs';
const root=fileURLToPath(new URL('../',import.meta.url)),data=JSON.parse(readFileSync(root+'motion.json'));
const distance=(a,b)=>Math.hypot(a[0]-b[0],a[1]-b[1]);
let maxError=0,maxJump=0,minGround=Infinity;
for(let i=0;i<data.frames.length;i++){
 const f=data.frames[i];assert(f.legs.R.contact||f.legs.L.contact,'Airborne frame '+i);
 for(const side of ['R','L']){
  const q=f.legs[side];
  for(const [a,b,length] of [['hip','knee',405],['knee','ankle',415],['heel','mtp',205],['mtp','toe',55]]){
   const error=Math.abs(distance(q[a],q[b])-length);maxError=Math.max(maxError,error);assert(error<.002,`${side} ${a} length changes`);
  }
  for(const key of ['heel','mtp','toe']){minGround=Math.min(minGround,q[key][1]);assert(q[key][1]>=-.001,'Ground penetration');}
  if(q.contact)assert(Math.min(q.heel[1],q.mtp[1])<.001,'Contact off ground');
  if(i){const prev=data.frames[i-1].legs[side];for(const key of ['hip','knee','ankle','heel','mtp','toe'])maxJump=Math.max(maxJump,distance(q[key],prev[key]));
   if(q.contact&&prev.contact){const anchor=q.angle>=0&&prev.angle>=0?'heel':q.angle<0&&prev.angle<0?'mtp':null;if(anchor)assert(Math.abs(q[anchor][0]-prev[anchor][0])<.002,'Planted foot sliding');}
  }
 }
}
// Every scroll phase must produce finite, deterministic markup, including reverse sampling.
for(let i=0;i<=1000;i++){
 const phase=i/1000;const opts={focus:i%2?'arch':'calf',zoom:i%2?2.7:1,detail:phase,lab:i%3===0,examination:i%7===0};
 const a=illustration(data,phase,opts);assert(!/NaN|Infinity|undefined/.test(a));assert.equal(a,illustration(data,phase,opts));
 const f=sample(data,phase);assert(f.legs.R.contact||f.legs.L.contact);
}
assert(maxJump<40,'Discontinuous frame movement');
console.log(JSON.stringify({frames:data.frames.length,maxSegmentLengthErrorMm:maxError,maxFrameDisplacementMm:maxJump,minFootHeightMm:minGround,renderedPhases:1001,checks:'fixed lengths, ground, contacts, stance anchors, deterministic rendering'},null,2));
