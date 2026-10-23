import re,urllib.request,pathlib,json,hashlib
root=pathlib.Path(__file__).resolve().parent.parent;out=pathlib.Path('/tmp/player-audit-fonts');out.mkdir(exist_ok=True);manifest={}
def get(url):
 req=urllib.request.Request(url,headers={'User-Agent':'Mozilla/5.0'})
 with urllib.request.urlopen(req,timeout=20) as r: data=r.read();typ=r.headers.get('Content-Type')
 file=out/hashlib.sha256(url.encode()).hexdigest();file.write_bytes(data);manifest[url]={'file':str(file),'contentType':typ};return data
for p in ['src/index.css','src/natural-sereno.css']:
 for url in re.findall(r"@import url\('([^']+)'\)", (root/p).read_text()):
  try:
   css=get(url).decode()
   for font in re.findall(r'url\((https://[^)]+)\)',css):get(font)
  except Exception as e:print(type(e).__name__,str(e))
(out/'manifest.json').write_text(json.dumps(manifest));print('Verified font resources',len(manifest))
