import json,re,subprocess,concurrent.futures
from pathlib import Path
from PIL import Image,ImageOps,ImageDraw
root=Path(__file__).resolve().parents[1]
research=root/'.research'; assets=root/'dist/assets';assets.mkdir(parents=True,exist_ok=True)
old=json.loads((research/'original-content.json').read_text())
home=Path('/tmp/pinenest-original.html').read_text()
cover_paths=list(dict.fromkeys(re.findall(r'/_assets/v11/[a-z0-9]+\.png',home)))
items={}
for route,details in old.items():
 paths=list(dict.fromkeys(re.findall(r'/_assets/v11/[a-z0-9]+\.png',(research/(route+'.html')).read_text())))
 old[route]['photos']=[f'{route}-{i+1:02d}.webp' for i in range(len(paths))]
 for i,path in enumerate(paths):items[f'{route}-{i+1:02d}']=path
for i,path in enumerate(cover_paths):items[f'cover-{i+1:02d}']=path
items['logo']='/_assets/v11/0a04661638e2e42203041b832885fbd6e9b6dbf9.svg'

def fetch(item):
 name,url=item; raw=research/(name+Path(url).suffix)
 if not raw.exists() or raw.stat().st_size < 100: subprocess.run(['curl','-fL','--retry','3','--retry-all-errors','--connect-timeout','15','--max-time','40','-s','https://pinenest.figma.site'+url,'-o',str(raw)],check=True)
 if raw.suffix=='.svg':(assets/(name+'.svg')).write_bytes(raw.read_bytes());return name
 with Image.open(raw) as im:
  im=ImageOps.exif_transpose(im).convert('RGB'); im.thumbnail((2300,2300));im.save(assets/(name+'.webp'),'WEBP',quality=88,method=6)
 return name
with concurrent.futures.ThreadPoolExecutor(max_workers=8) as pool:
 for name in pool.map(fetch,items.items()):print(name,flush=True)
(research/'original-content.json').write_text(json.dumps(old,ensure_ascii=False,indent=2))
files=[p for p in sorted(assets.glob('*.webp')) if p.stem.startswith('cover-') or p.stem.startswith('wanda-') or p.stem.startswith('zhongzhou-')]
w=1080;cellw=270;cellh=205;sheet=Image.new('RGB',(w,((len(files)+3)//4)*cellh),'#eeeeee');d=ImageDraw.Draw(sheet)
for i,p in enumerate(files):
 with Image.open(p) as im:thumb=ImageOps.fit(im,(260,175))
 x=(i%4)*cellw;y=(i//4)*cellh;sheet.paste(thumb,(x,y));d.text((x+4,y+180),p.name,fill='black')
sheet.save(research/'asset-sheet.jpg')
