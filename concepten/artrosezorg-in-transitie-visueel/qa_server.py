"""Lokale QA-server; geen onderdeel van de pagina of deployment.

?qa=nojs blokkeert scripts met CSP; ?qa=reduce simuleert matchMedia;
?qa=text vergroot alleen tekst tot 200%. Deze routes zijn testfixtures.
"""
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import urlsplit, parse_qs
import os

REPO = Path(__file__).resolve().parents[2]
os.chdir(REPO)
class Handler(SimpleHTTPRequestHandler):
    def do_GET(self):
        url=urlsplit(self.path)
        mode=parse_qs(url.query).get('qa',[''])[0]
        if url.path.rstrip('/') in ('/concepten/artrosezorg-in-transitie-visueel', '/concepten/artrosezorg-in-transitie-visueel/integratie/index.html', '/concepten/artrosezorg-in-transitie-visueel/integratie/artikelen.html') and mode:
            target=url.path.lstrip('/') if url.path.endswith('.html') else 'concepten/artrosezorg-in-transitie-visueel/index.html'
            html=(REPO/target).read_text()
            if mode=='reduce':
                shim='<script>const nativeMatch=window.matchMedia.bind(window);window.matchMedia=q=>q.includes("prefers-reduced-motion")?{matches:true,addEventListener(){},removeEventListener(){}}:nativeMatch(q);</script>'
                html=html.replace('</head>',shim+'</head>')
            if mode=='text':html=html.replace('</head>','<style>html{font-size:200%}</style></head>')
            payload=html.encode()
            self.send_response(200)
            self.send_header('Content-Type','text/html; charset=utf-8')
            if mode=='nojs':self.send_header('Content-Security-Policy',"script-src 'none'")
            self.send_header('Content-Length',str(len(payload)))
            self.end_headers();self.wfile.write(payload)
        else:super().do_GET()

if __name__=='__main__':
    import sys
    ThreadingHTTPServer(('127.0.0.1',int(sys.argv[1]) if len(sys.argv)>1 else 8875),Handler).serve_forever()
