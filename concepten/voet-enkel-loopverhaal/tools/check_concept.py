from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit,unquote
import re,json
P=Path(__file__).resolve().parents[1]
class Page(HTMLParser):
 def __init__(self): super().__init__(); self.ids=[];self.links=[];self.images=[];self.robots=None
 def handle_starttag(self,tag,attrs):
  a=dict(attrs)
  if 'id' in a:self.ids.append(a['id'])
  if tag in ('a','link','script'):
   url=a.get('href',a.get('src'))
   if url:self.links.append(url)
  if tag=='img':self.images.append(a);self.links.append(a['src'])
  if tag=='meta' and a.get('name')=='robots':self.robots=a.get('content')
for name in ('index.html','rig.html'):
 p=Page();p.feed((P/name).read_text());assert p.robots=='noindex, nofollow';assert len(p.ids)==len(set(p.ids))
 for url in p.links:
  u=urlsplit(url)
  if u.scheme or u.netloc:continue
  if not u.path:assert unquote(u.fragment) in p.ids,(name,url)
  else:assert (P/unquote(u.path)).exists(),(name,url)
 for a in p.images:assert a.get('alt'),a
 if name=='index.html':assert len(p.images)==8;assert all('bron-B'+str(n).zfill(2) in p.ids for n in range(1,31))
assert 'concepten/' in (P.parents[1]/'.vercelignore').read_text()
assert not re.search(r'voet-enkel-loopverhaal', (P.parents[1]/'sitemap.xml').read_text())
print('Concept: links, unique IDs, 30 references, eight static figures, noindex and deployment exclusion OK')
