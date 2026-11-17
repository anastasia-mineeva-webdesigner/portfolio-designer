"""Build responsive WebP derivatives and lossless WOFF2 fonts; retain originals."""
from pathlib import Path
from PIL import Image
from fontTools.ttLib import TTFont
import json
root=Path(__file__).resolve().parents[1]
output=root/'public/assets/optimized';output.mkdir(exist_ok=True)
images={}
saved=[]
for name in ['volta.png','finly-preview.jpg','northern-bread.png','aura.png','studio9.png','all-projects.png']:
 source=root/'public/assets'/name
 im=Image.open(source).convert('RGB')
 widths=sorted(set([w for w in [360,560,840,1049] if w<=im.width]+[im.width]))
 variants=[]
 for width in widths:
  resized=im.resize((width,round(im.height*width/im.width)),Image.Resampling.LANCZOS)
  target=output/f'{source.stem}-{width}.webp'
  resized.save(target,'WEBP',quality=90,method=6)
  variants.append((width,'/assets/optimized/'+target.name))
 default=next((url for width,url in variants if width==560),variants[-1][1])
 images[name]={'src':default,'srcSet':', '.join(f'{url} {width}w' for width,url in variants)}
 saved.append({'source':name,'originalBytes':source.stat().st_size,'webp560Bytes':(root/'public'/default.lstrip('/')).stat().st_size,'maxWidth':im.width})
poster=Image.open(root/'public/media/hero-transparent-poster.png').convert('RGBA')
for width in [640,960,1280]:
 resized=poster.resize((width,round(poster.height*width/poster.width)),Image.Resampling.LANCZOS)
 resized.save(root/f'public/media/hero-poster-{width}.webp','WEBP',quality=92,method=6,exact=True)
for source in (root/'public/fonts').glob('*.ttf'):
 font=TTFont(source);font.flavor='woff2';font.save(source.with_suffix('.woff2'))
(root/'src/data/optimized-images.ts').write_text('export const optimizedImages:Record<string,{src:string;srcSet:string}> = '+json.dumps(images,indent=2)+';\n')
print(json.dumps(saved,indent=2))
print('Poster full-width bytes:',(root/'public/media/hero-poster-1280.webp').stat().st_size)
print('WOFF2 total bytes:',sum(p.stat().st_size for p in (root/'public/fonts').glob('*.woff2')))
