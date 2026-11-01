"""QA contact sheets only. These do not alter any presentation artwork."""
from pathlib import Path
import json
from PIL import Image, ImageOps, ImageDraw

ROOT=Path(__file__).resolve().parent
QA=ROOT/'evidence'
REF=ROOT.parents[2]/'review-captures/granville-reference'
files=[('CoSpace',REF/'cospace-full.jpg'),('Lynn Valley Link',REF/'lynn-full.jpg'),('SharedStandard',REF/'sharedstandard-full.jpg'),('Granville Island',QA/'desktop-full.jpg')]
for mode in ['full','opening']:
    columns=[]
    for label,path in files:
        im=Image.open(path).convert('RGB')
        if mode=='opening': im=im.crop((0,0,im.width,min(im.height,2000)))
        im=ImageOps.grayscale(im).convert('RGB')
        im=im.resize((330,round(im.height*330/im.width)),Image.Resampling.LANCZOS)
        columns.append((label,im))
    sheet=Image.new('RGB',(4*350+20,max(im.height for _,im in columns)+65),'#e7e7e7')
    draw=ImageDraw.Draw(sheet)
    for i,(label,im) in enumerate(columns):
        x=20+i*350;draw.text((x,18),label,fill='#222222');sheet.paste(im,(x,45))
    sheet.save(QA/f'comparison-{mode}.jpg',quality=92)

# Pair the native IA crop with its browser-rendered counterpart at display scale.
layout=json.loads((QA/'artwork-layout.json').read_text())
r=next(r for r in layout['rects'] if 'information-hierarchy' in r['src'])
whole=Image.open(QA/'desktop-full.jpg').convert('RGB')
actual=whole.crop(tuple(round(v) for v in (r['x'],r['y'],r['x']+r['width'],r['y']+r['height'])))
original=Image.open(ROOT/'assets/information-hierarchy.png').convert('RGB').resize(actual.size,Image.Resampling.LANCZOS)
sheet=Image.new('RGB',(actual.width*2+60,actual.height+60),'#eeeeee');draw=ImageDraw.Draw(sheet)
draw.text((20,15),'Original IA export at display scale',fill='#222222');draw.text((actual.width+40,15),'Browser-rendered artwork',fill='#222222')
sheet.paste(original,(20,40));sheet.paste(actual,(actual.width+40,40));sheet.save(QA/'artwork-fidelity.jpg',quality=95)
print('Created full-page, opening and artwork-fidelity comparisons.')
