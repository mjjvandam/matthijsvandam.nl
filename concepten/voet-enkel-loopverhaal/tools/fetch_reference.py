"""Read selected files from the CC BY 4.0 WBDS archive using HTTP ranges.
Full archive is not stored. Source version and attribution: ../dataset-verkenning.json.
"""
import io, json, urllib.request, zipfile, sys
from pathlib import Path
ROOT = Path(__file__).resolve().parents[1]
class RemoteZip(io.RawIOBase):
    def __init__(self):
        self.size = 686716664
        self.pos = 0
    def seek(self, offset, whence=0):
        self.pos = offset if whence == 0 else self.pos + offset if whence == 1 else self.size + offset
        return self.pos
    def tell(self): return self.pos
    def seekable(self): return True
    def read(self, size=-1):
        size = self.size-self.pos if size < 0 else min(size,self.size-self.pos)
        if not size: return b''
        lo,hi=self.pos,self.pos+size-1
        req=urllib.request.Request('https://ndownloader.figshare.com/files/68194516',headers={'Range':f'bytes={lo}-{hi}'})
        with urllib.request.urlopen(req, timeout=45) as r:
            assert r.status==206 and r.headers.get('Content-Range','').startswith(f'bytes {lo}-{hi}/'), r.headers
            data=r.read()
        assert len(data)==size
        self.pos+=size
        return data
with zipfile.ZipFile(RemoteZip()) as z:
    if len(sys.argv)==1:
        for name in z.namelist():
            if 'WBDS01' in name: print(name,z.getinfo(name).file_size)
    else:
        for name in sys.argv[1:]:
            data=z.read(name)
            path=ROOT/'data'/Path(name).name
            path.write_bytes(data)
            print(path.name,len(data))
