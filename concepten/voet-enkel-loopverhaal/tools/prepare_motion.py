"""Create an explicitly retargeted educational rig, not a clinical reconstruction."""
import csv,json,math,hashlib,statistics
from pathlib import Path
P=Path(__file__).resolve().parents[1]
def rows(name):
 return [{k:float(v) for k,v in r.items()} for r in csv.DictReader((P/'data'/name).open(),delimiter='\t')]
m=rows('WBDS01walkO01Cmkr.txt');static=rows('WBDS01static1.txt')
start,end=85/150,247.5/150
# Contact onset agrees with force-plate 5 / 2; release is approximate marker-based,
# as feet cross plate edges. These are illustration events, not clinical outcomes.
events={'R':[(start,1.22),(end,2.31)],'L':[(-.007,.647),(1.103333,1.757)]}
def interp(t,key):
 u=max(0,min(len(m)-1,t*150));i=int(u);f=u-i
 return m[i][key]*(1-f)+m[min(i+1,len(m)-1)][key]*f
cal={s:{'heel':statistics.mean(r[f'{s}.HeelY'] for r in static),'mtp':statistics.mean(r[f'{s}.MT1Y'] for r in static)} for s in 'RL'}
def foot(t,s):
 def raw(t):
  hx,hy=interp(t,f'{s}.HeelX'),interp(t,f'{s}.HeelY')-cal[s]['heel']
  mx,my=interp(t,f'{s}.MT1X'),interp(t,f'{s}.MT1Y')-cal[s]['mtp']
  return [hx,hy],math.atan2(my-hy,mx-hx)
 def stance(t,a):
  _,theta=raw(t);anchor=interp(a+.14,f'{s}.MT1X');length=205
  h=[anchor-length,0] if theta>=0 else [anchor-length*math.cos(theta),-length*math.sin(theta)]
  return h,theta
 contact=next(((a,b) for a,b in events[s] if a<=t<=b),None)
 if contact:h,theta=stance(t,contact[0])
 else:
  h,theta=raw(t)
  prev=next(((a,b) for a,b in reversed(events[s]) if b<t),None)
  nxt=next(((a,b) for a,b in events[s] if a>t),None)
  for event,tt in [(prev,prev[1] if prev else None),(nxt,nxt[0] if nxt else None)]:
   if event and abs(t-tt)<.12:
    w=1-abs(t-tt)/.12;w=w*w*(3-2*w)
    target,angle=stance(tt,event[0]);h=[v*(1-w)+q*w for v,q in zip(h,target)];theta=theta*(1-w)+angle*w
  h[1]=max(h[1],-205*math.sin(theta),0)
 mt=[h[0]+205*math.cos(theta),h[1]+205*math.sin(theta)]
 # Articulated toe stays clear of floor, unlike a rigid foot extension.
 toeAngle=max(theta,0) if contact else max(theta,math.asin(max(-1,min(1,-mt[1]/55))))
 toe=[mt[0]+55*math.cos(toeAngle),mt[1]+55*math.sin(toeAngle)]
 a=[h[0]+52*math.cos(theta)-77*math.sin(theta),h[1]+52*math.sin(theta)+77*math.cos(theta)]
 return {'heel':h,'mtp':mt,'toe':toe,'ankle':a,'contact':bool(contact),'angle':theta}
def knee(h,a):
 x,y=a[0]-h[0],a[1]-h[1];d=math.hypot(x,y);l1,l2=405,415
 along=(l1*l1-l2*l2+d*d)/(2*d);height=math.sqrt(max(0,l1*l1-along*along))
 return [h[0]+along*x/d-height*y/d,h[1]+along*y/d+height*x/d]
frames=[];corrections=[]
for i in range(181):
 t=start+(end-start)*i/180
 f={s:foot(t,s) for s in 'RL'}
 hip=[sum(interp(t,f'{s}.GTRX') for s in 'RL')/2,sum(interp(t,f'{s}.GTRY') for s in 'RL')/2]
 orig=hip[1]
 for s in 'RL':
  a=f[s]['ankle'];hip[1]=min(hip[1],a[1]+math.sqrt(max(0,819.5**2-(a[0]-hip[0])**2)))
 corrections.append(orig-hip[1])
 for s in 'RL':f[s]['hip']=hip;f[s]['knee']=knee(hip,f[s]['ankle'])
 frames.append({'t':round(t,5),'legs':f,'hip':hip})
# Translation is kept: a planted foot stays stationary in world coordinates.
def rounded(x):
 if isinstance(x,float):return round(x,3)
 if isinstance(x,list):return [rounded(a) for a in x]
 if isinstance(x,dict):return {k:rounded(v) for k,v in x.items()}
 return x
result={'frames':rounded(frames),'duration':end-start,'events':{'leftToeOff':(.647-start)/(end-start),'heelRise':(.84-start)/(end-start),'leftContact':(1.103333-start)/(end-start),'rightToeOff':(1.22-start)/(end-start)},'credit':'Bewegingsreferentie: Fukuchi et al., Walking Biomechanics Dataset v6 · CC BY 4.0. Vereenvoudigde, bewerkte illustratie.'}
(P/'motion.json').write_text(json.dumps(result,separators=(',',':'))+'\n')
manifest={'source':'https://doi.org/10.6084/m9.figshare.5722711.v6','license':'CC BY 4.0','subject':'WBDS01','trial':'walkO01C','mode':'barefoot overground, self-selected comfortable speed','frameRange150Hz':[85,247.5],'seconds':[start,end],'axes':'X forward, Y up, Z lateral; input mm','contact':'Initial contacts from force onset >20N (right plates5 and2; left plate1). Releases approximately from heel/MT1 trajectories; plate coverage incomplete. No force values rendered.','calibration':'Static heel and MT1 marker heights subtracted for floor reference; GTR average used as pelvis proxy, NOT anatomical hip center.','retargeting':['Sagittal projection; floor anchors fixed during stance; foot length205mm, toe55mm are design geometry','Thigh405mm/shank415mm, analytic IK, shared pelvis; reach clamp','Toe motion is schematic, absent in source markers','No extra filtering; linear interpolation of supplied trajectories; 120ms smooth transitions around contact locks','Muscles/anatomy are explanatory drawings, no EMG or tissue-force reconstruction'],'maxPelvisCorrectionMm':max(corrections),'estimatedSpeedMps':(frames[-1]['hip'][0]-frames[0]['hip'][0])/(end-start)/1000,'sourceFiles':{n:hashlib.sha256((P/'data'/n).read_bytes()).hexdigest() for n in ['WBDS01static1.txt','WBDS01walkO01Cmkr.txt','WBDS01walkO01Cgrf.txt']},'archiveNote':'v6 archive directory is named 51subjs; original 2018 paper describes42. No assumption that every v6 record belonged to original paper.'}
(P/'motion-manifest.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n')
print('frames',len(frames),'max pelvis correction mm',round(max(corrections),2),'speed',round(manifest['estimatedSpeedMps'],2))
