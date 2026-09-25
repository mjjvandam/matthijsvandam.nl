"""Original, layered SVG scenography. No raster, remote runtime or third-party illustration."""
from html import escape
from pathlib import Path
import json
import base64

def P(d,fill='none',stroke='none',w=1,attrs=''):
    return f'<path d="{d}" fill="{fill}" stroke="{stroke}" stroke-width="{w}" stroke-linecap="round" stroke-linejoin="round" {attrs}/>'
def G(body,x=0,y=0,s=1,attrs=''):
    return f'<g transform="translate({x} {y}) scale({s})" {attrs}>{body}</g>'
def R(x,y,w,h,fill,rx=0,attrs=''):
    return f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{rx}" fill="{fill}" {attrs}/>'
def C(x,y,r,fill,attrs=''):
    return f'<circle cx="{x}" cy="{y}" r="{r}" fill="{fill}" {attrs}/>'
def text(x,y,t,size=14,color='#547875',attrs=''):
    return f'<text x="{x}" y="{y}" text-anchor="middle" font-family="Inter,system-ui,sans-serif" font-size="{size}" fill="{color}" {attrs}>{escape(t)}</text>'

def definitions():
    return '''<defs><linearGradient id="stone" x2=".8" y2="1"><stop stop-color="#f7fbf7"/><stop offset="1" stop-color="#c6ddd5"/></linearGradient><linearGradient id="glass" x2="1" y2="1"><stop stop-color="#204c50"/><stop offset=".5" stop-color="#73a8a2"/><stop offset="1" stop-color="#b4d9cd"/></linearGradient><linearGradient id="jacket" x2="1" y2=".8"><stop stop-color="#ce8563"/><stop offset="1" stop-color="#93503d"/></linearGradient><linearGradient id="land" x2="1" y2="1"><stop stop-color="#d8ebe0"/><stop offset="1" stop-color="#7ea99d"/></linearGradient><radialGradient id="aura"><stop stop-color="#66b7a2" stop-opacity=".17"/><stop offset="1" stop-color="#66b7a2" stop-opacity="0"/></radialGradient><filter id="soft-shadow" x="-30%" y="-30%" width="160%" height="170%"><feDropShadow dx="0" dy="8" stdDeviation="10" flood-color="#193c35" flood-opacity=".13"/></filter></defs>'''

def building(x,y,s=1,kind='home'):
    b='<ellipse cx="10" cy="18" rx="111" ry="32" fill="#234a43" opacity=".09"/>'
    b+=P('M-85 -125 L23 -161 L103 -117 L-4 -81Z','#dce9df')
    b+=P('M-85 -125 L-4 -81 V17 L-85 -25Z','url(#stone)')
    b+=P('M-4 -81 L103 -117 V-20 L-4 17Z','#91b5aa')
    b+=P('M-78 -127 L24 -161 L94 -123 L-8 -88Z','#244d4b')
    b+=P('M-65 -124 L23 -153 L81 -123 L-8 -94Z','#78a79b')
    for i in range(3):
        a=-67+i*20
        b+=P(f'M{a} -94 l14 7 v43 l-14 -7Z','url(#glass)')
    for i in range(3):
        a=10+i*28
        b+=P(f'M{a} -66 l19 -7 v38 l-19 7Z','url(#glass)')
    b+=P('M-35 -16 v-35 l20 10 v35Z','#335e5d')+P('M-92 -22 L-2 24 L112 -16 L112 -8 L-2 33 L-92 -13Z','#bfcec2')
    if kind=='care':
        b+=R(26,-113,34,27,'#f3fbf4',6)+P('M36 -99 h14 M43 -106 v14',stroke='#3c8c7a',w=3)
    else:
        b+=P('M-98 -50 L-41 -22 L-22 -30 L-78 -59Z','#d4a47a')
        for j in range(3):
            b+=G(P('M-40 0 L-13 13 L-30 22 L-57 9Z','#e4e4d5','#b1c5b9',.7)+P('M-57 9 L-30 22 V28 L-57 15Z','#acc4b7'),-j*9,8+j*9)
    return G(b,x,y,s)

def tree(x,y,s=1):
    return G('<ellipse cy="7" rx="26" ry="10" fill="#173e38" opacity=".1"/>'+P('M0 0 V-74',stroke='#658379',w=5)+P('M0 -24 L-17 -44 M0 -42 L16 -58',stroke='#658379',w=3)+C(-14,-67,25,'#a6c7b4')+C(9,-89,29,'#779e8a')+C(21,-56,24,'#90b5a0'),x,y,s)

def bench(x,y,s=1):
    return G(P('M-36 -28 L18 -46 L48 -30 L-7 -12Z','#d3a17a')+P('M-36 -28 v7 l29 16 L48 -23 v-7 L-7 -12Z','#a87958')+P('M-27 -20 V6 M35 -20 V6',stroke='#557570',w=4),x,y,s)

def chair(x,y,s=1):
    return G(P('M-24 -53 Q-25 -67 -9 -65 L15 -57 Q24 -54 23 -40 V-19 L-23 -30Z','#8cb0a0')+P('M-23 -30 L23 -19 L42 -25 L-4 -37Z','#c8dccc')+P('M-18 -26 V12 M35 -24 V12',stroke='#5e7871',w=3),x,y,s)

def person_static(x,y,s=1,shirt='#567e76',flip=1,seated=False):
    # Same proportions and visual language as the articulated protagonist.
    b=P('M-7 -52 L-11 -24 L-13 0 M8 -52 L12 -24 L18 0',stroke='#294a59',w=11)
    b+=P('M-15 0 h14 M15 0 h14',stroke='#203c42',w=6)
    b+=P('M-10 -98 Q-25 -96 -21 -73 L-16 -49 L18 -49 L21 -77 Q22 -95 8 -98Z',shirt)
    b+=P('M-18 -86 L-24 -62 L-11 -53 M16 -84 L26 -65 L39 -70',stroke='#ba8d70',w=7)
    b+=R(-5,-108,12,18,'#ba8d70',5)+P('M-13 -124 Q-12 -139 4 -137 Q20 -135 17 -115 Q14 -101 2 -104 Q-13 -105 -13 -124Z','#c99c7e')
    b+=P('M-13 -123 Q-19 -143 4 -143 Q23 -142 18 -122 L9 -132 Q-1 -125 -13 -128Z','#354c46')+C(10,-120,1.1,'#30463f')
    if seated:
        b=b.replace('M-7 -52 L-11 -24 L-13 0 M8 -52 L12 -24 L18 0','M-7 -52 L17 -52 L17 -14 M8 -52 L29 -52 L29 -14').replace('M-15 0 h14 M15 0 h14','M13 -14 h14 M25 -14 h14')
    return G(f'<g transform="scale({flip} 1)">{b}</g>',x,y+(30*s if seated else 0),s)

def pill(x,y,label):
    width=max(92,len(label)*7+26)
    return G(R(-width/2,-16,width,32,'#f5fbf6',16,attrs='stroke="#a1c7b7" stroke-width="1"')+text(0,5,label,13,'#355f57'),x,y,attrs='class="scene-pill"')

def map_art():
    geo=json.loads((Path(__file__).parent/'assets/netherlands.geojson').read_text())['geometry']['coordinates']
    shapes=''
    for polygon in geo:
        ring=polygon[0]
        if not all(0<lon<10 and 49<lat<55 for lon,lat,*_ in ring):continue
        pts=[((lon-5.3)*108,(52.2-lat)*170) for lon,lat,*_ in ring]
        d='M'+' L'.join(f'{x:.2f} {y:.2f}' for x,y in pts)+'Z'
        shapes+=P(d,'url(#land)','#f1fff5',1.3)
    # Tilburg is the owner's visual anchor, not the article's Beweeghuis example.
    mx,my=(5.0913-5.3)*108,(52.2-51.5555)*170
    dots=''
    for lon,lat in [(4.5,52.0),(5.15,52.15),(6.0,52.5),(6.5,53.15),(5.45,51.45)]:
        px,py=(lon-5.3)*108,(52.2-lat)*170
        dots+=C(px,py,5,'#467f70')+C(px,py,11,'none','stroke="#6ba68f" stroke-width="1"')
    shapes+=f'<g class="map-dots">{dots}</g>'+C(mx,my,8,'#c87655')+C(mx,my,18,'none','stroke="#c87655" stroke-width="1.5"')
    shapes+=text(mx+4,my+43,'Tilburg',13,'#c87655')
    return shapes,[mx,my]

def make_world(data,*unused):
    stations=[c['station'] for c in data['chapters']]
    actor_stations=[c.get('actor_station',c['station']) for c in data['chapters']]
    route=[actor_stations[0]]
    for i,(a,b) in enumerate(zip(actor_stations,actor_stations[1:])):
        for t in [.18,.36,.64,.82,1]:route.append([round(a[0]+(b[0]-a[0])*t,2),round(a[1]+(b[1]-a[1])*t,2)])
    # Continue the same walking route across the closing landing.
    x,y=stations[-1]
    route.extend([[x-90,y],[x+30,y],[x+140,y]])
    d='M'+' L'.join(f'{x} {y}' for x,y in route)
    # A crisp continuous ribbon with fine inset track and shallow depth.
    world=G(P(d,stroke='#315e53',w=74,attrs='opacity=".12"'),0,10)+P(d,stroke='#b8cfc1',w=68)+P(d,stroke='#e6eee3',w=62)+P(d,stroke='#91b1a1',w=1,attrs='stroke-dasharray="2 13"')
    for i,(x,y) in enumerate(stations):
        base=C(0,-65,290,'url(#aura)')+P('M-190 -35 L25 -142 L207 -51 L-8 56Z','#96b4a5',attrs='opacity=".2"')+P('M-190 -47 L25 -154 L207 -63 L-8 44Z','url(#stone)','#c6dbce',1)
        elements='';details=[]
        if i==0:
            elements=building(-95,-130,.86)+tree(167,-80,.64)+bench(125,8,.7)
            # Schematic rise across the connecting path, not a quantitative chart.
            elements+='<g class="growth-trend">'+P('M-325 345 C-255 315 -230 252 -170 220 S-82 135 -25 105',stroke='#bf704d',w=5,attrs='class="growth-line" pathLength="1"')+P('M-45 108 L-25 105 L-30 126',stroke='#bf704d',w=5,attrs='class="growth-arrow"')+G(pill(0,0,'Meer mensen met artrose'),-60,74,attrs='class="growth-label"')+'</g>'

            details=[P('M-82 -34 L40 27 L126 -15',stroke='#c48965',w=3,attrs='class="draw-detail" pathLength="1"'),pill(65,-250,'Opstaan · lopen · meedoen')]
        elif i==1:
            elements=tree(-180,-65,.8)+person_static(117,-36,.77,flip=-1)
            details=[pill(-92,-207,'Lichaam'),pill(103,-246,'Welzijn'),pill(181,-142,'Verwachtingen')]
        elif i==2:
            elements=chair(-7,-13,.7)+chair(113,-12,.7)+person_static(117,-10,.78,flip=-1,seated=True)
            elements+=P('M39 -53 L71 -68 L100 -53 L69 -38Z','#e5c29f')+P('M43 -52 V-4 M94 -51 V-4',stroke='#738f82',w=3)
            details=[pill(-40,-218,'Wat betekent dit?'),pill(137,-197,'Samen begrijpen')]
        elif i==3:
            elements=bench(-112,10,.8)+person_static(125,-15,.9)+person_static(-125,-80,.65,shirt='#b59460')
            details=[P('M-65 17 Q0 75 99 20',stroke='#6baf9b',w=3,attrs='class="draw-detail" pathLength="1"'),pill(12,-225,'Bewegen met begeleiding')]
        elif i==4:
            elements=bench(-180,-50,.7)+tree(184,-75,.65)
            details=[P('M0 0 Q-150 -150 -190 10 M0 0 Q145 -140 190 10',stroke='#6b9d8a',w=9,attrs='class="draw-detail" pathLength="1"'),pill(-147,-158,'Wat lukt?'),pill(134,-176,'Wat helpt?')]
        elif i==5:
            elements=building(-172,-124,.62,'care')+building(160,-91,.65,'care')+building(9,-259,.5,'care')
            details=[P('M-155 -106 L0 -20 L158 -69 M0 -20 V-225',stroke='#6ea995',w=3,attrs='class="draw-detail" pathLength="1"'),pill(-12,-319,'Afstemmen'),pill(125,90,'Tijd · overleg · financiering')]
        elif i==6:
            base=C(0,-70,310,'url(#aura)')
            elements=''
            country,target=map_art()
            elements+=f'<g class="country-map" transform="translate(0 -120)"><g class="map-zoom" data-focus-x="{target[0]}" data-focus-y="{target[1]}">{country}</g></g>'
            regional=building(-115,-99,.6,'care')+building(145,-84,.6,'care')+etz_mark(32,-180)
            regional+=P('M-106 -68 L0 -5 L141 -55 M0 -5 L32 -166',stroke='#559b87',w=3,attrs='class="draw-detail" pathLength="1"')+pill(0,79,'Samenwerking in de regio')
            elements+=f'<g class="region-network">{regional}</g>'
            details=[pill(0,-387,'Een landelijk voorstel')]
        else:
            # One shared landing, with a reading route rather than a treatment ladder.
            base=C(0,-75,315,'url(#aura)')+P('M-270 -15 L-65 -190 L280 -65 L75 110Z','url(#stone)','#c6dbce',1)
            elements=tree(-235,-120,.55)+bench(235,18,.65)
            elements+=P('M-158 -22 L-180 23 M152 -22 L130 23',stroke='#c48965',w=5)
            elements+=text(-197,45,'START',10,'#657e71')+text(167,48,'SLOT',10,'#657e71')
            elements+=P('M-147 0 H128',stroke='#7ba28e',w=2,attrs='stroke-dasharray="3 9"')
            conversation=person_static(-118,-95,.62,flip=-1)
            conversation+=R(-218,-233,130,48,'#fffdf7',12,attrs='stroke="#93b5a4"')+P('M-127 -186 l12 15 0 -16','#fffdf7','#93b5a4')
            conversation+=P('M-203 -218 h82 M-203 -207 h56',stroke='#608977',w=3)+pill(-159,-267,'Realistische uitleg')
            coaching=person_static(22,-135,.62,shirt='#b59460')+bench(-12,-101,.48)
            coaching+=person_static(-42,-130,.55,shirt='#6f9290',flip=-1)
            coaching+=P('M43 -125 l18 -10 18 10',stroke='#b59460',w=3)+pill(30,-295,'Leefstijlbegeleiding')
            network=P('M140 0 L87 -84 L191 -127 L244 -70 Z M140 0 L191 -127 M87 -84 L244 -70',stroke='#609a83',w=2,attrs='class="finale-network" pathLength="1"')
            network+=person_static(87,-84,.56)+person_static(191,-127,.56,shirt='#b59460',flip=-1)+person_static(244,-70,.56,flip=-1)+pill(169,-235,'Een netwerk om je heen')
            elements+=''.join(f'<g class="finale-step" data-finale-step="{j}">{art}</g>' for j,art in enumerate([conversation,coaching,network]))
        detail_markup=''.join(f'<g class="scene-detail detail-{j}">{b}</g>' for j,b in enumerate(details))
        world+=G(base+elements+detail_markup,x,y,attrs=f'class="world-station station-{i}" data-station="{i}"')
    return world,route

def protagonist():
    return '''<g id="traveller" aria-hidden="true"><ellipse cy="4" rx="21" ry="7" fill="#204c43" opacity=".13"/><g id="traveller-facing">
    <path id="back-leg" d="M-7 -54 L-9 -27 L-9 0" fill="none" stroke="#284554" stroke-width="11" stroke-linecap="round" stroke-linejoin="round"/>
    <path id="front-leg" d="M7 -54 L11 -27 L9 0" fill="none" stroke="#3e6070" stroke-width="11" stroke-linecap="round" stroke-linejoin="round"/>
    <path id="back-shoe" d="M-13 0 h14" stroke="#233c43" stroke-width="6" stroke-linecap="round"/><path id="front-shoe" d="M5 0 h14" stroke="#233c43" stroke-width="6" stroke-linecap="round"/>
    <g id="traveller-upper" transform="translate(0 -15)"><path d="M-10 -85 Q-24 -83 -22 -67 L-17 -37 H18 L21 -68 Q21 -82 8 -85Z" fill="url(#jacket)"/>
    <path d="M-13 -83 L-5 -77 L7 -82 M-16 -42 H14" fill="none" stroke="#e0a285" stroke-width="1.2"/><rect x="-4" y="-96" width="12" height="15" rx="4" fill="#c69a7b"/>
    <path d="M-17 -74 L-24 -54 L-11 -41" fill="none" stroke="#c99d7c" stroke-width="7" stroke-linecap="round"/>
    <g id="traveller-arm"><path d="M16 -73 L24 -54 L37 -59" fill="none" stroke="#d4ad8b" stroke-width="7" stroke-linecap="round"/><path d="M36 -59 l4 -3" stroke="#d4ad8b" stroke-width="4" stroke-linecap="round"/></g>
    <g id="traveller-head"><path d="M-13 -104 Q-14 -119 2 -121 Q18 -120 18 -105 L16 -95 Q12 -84 1 -87 Q-12 -89 -13 -104Z" fill="#d4ad8b"/><path d="M-13 -103 Q-21 -125 0 -128 Q22 -130 19 -106 L11 -118 Q-1 -110 -13 -114Z" fill="#8c9b8d"/><path d="M-11 -117 Q0 -127 12 -121" fill="none" stroke="#cad0be" stroke-width="3" stroke-linecap="round"/><circle cx="10" cy="-104" r="1.2" fill="#30463f"/><path d="M12 -100 l3 4 -4 0 M6 -91 q4 2 7 -1" stroke="#936b51" fill="none" stroke-width="1"/></g></g></g></g>'''


def protagonist_still(x,y,s=1,seated=False):
    """Use the identical person in enhanced, static and opening compositions."""
    body=protagonist().replace('id="','id="still-')
    if seated:
        body=body.replace('translate(0 -15)','translate(0 23)')
        body=body.replace('M-7 -54 L-9 -27 L-9 0','M-7 -16 L13 -16 L13 14')
        body=body.replace('M7 -54 L11 -27 L9 0','M7 -16 L31 -16 L31 14')
        body=body.replace('M-13 0 h14','M9 14 h14').replace('M5 0 h14','M27 14 h14')
    return G(body,x,y,s)


def etz_mark(x,y):
    logo=Path(__file__).resolve().parents[2]/'assets/orthopedisch-centrum-etz-logo.png'
    uri='data:image/png;base64,'+base64.b64encode(logo.read_bytes()).decode('ascii')
    card=R(-77,-132,154,146,'#ffffff',12,attrs='stroke="#abc9bc" stroke-width="1"')
    card+=f'<image href="{uri}" x="-48" y="-128" width="96" height="96"/>'
    card+=text(0,-17,'Orthopedisch Centrum',11,'#244c3d')+text(0,0,'ETZ · Tilburg',13,'#244c3d')
    return G(card,x,y,attrs='class="etz-mark"')
