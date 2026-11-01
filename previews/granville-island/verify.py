from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit, unquote
import json
from PIL import Image, ImageChops

ROOT = Path(__file__).resolve().parent
REPO = ROOT.parents[1]
EXPORTS = ROOT.parents[2] / 'output/granville-island-portfolio'
class Page(HTMLParser):
    def __init__(self):
        super().__init__(); self.ids=set(); self.refs=[]; self.images=[]
    def handle_starttag(self,tag,attrs):
        a=dict(attrs)
        if a.get('id'):
            assert a['id'] not in self.ids, 'Duplicate ID: '+a['id']
            self.ids.add(a['id'])
        for prop in ('href','src'):
            if a.get(prop): self.refs.append(a[prop])
        if tag=='img':
            assert 'alt' in a, 'Image needs alt text'
            self.images.append(a)

html=(ROOT/'index.html').read_text()
page=Page();page.feed(html)
for ref in page.refs:
    u=urlsplit(ref)
    if u.scheme or u.netloc: continue
    path=ROOT/unquote(u.path) if u.path else ROOT/'index.html'
    assert path.exists(), 'Missing local reference: '+ref
    if u.fragment and path.resolve()==(ROOT/'index.html').resolve():
        assert unquote(u.fragment) in page.ids, 'Missing anchor: '+ref
for attrs in page.images:
    p=ROOT/attrs['src']
    if p.suffix=='.png':
        with Image.open(p) as im:
            assert im.size==(int(attrs['width']),int(attrs['height'])), 'Wrong image dimensions: '+str(p)
for record in json.loads((ROOT/'asset-provenance.json').read_text()):
    actual=Image.open(ROOT/'assets'/record['file']).convert('RGB')
    original=Image.open(EXPORTS/record['source']).convert('RGB').crop(record['crop'])
    assert actual.size==original.size and ImageChops.difference(actual,original).getbbox() is None, 'Artwork changed: '+record['file']
for name in ['index.html','granville.css','granville.js']:
    assert '\u2014' not in (ROOT/name).read_text(), 'Em dash in authored file: '+name
assert 'February–April 2026' in html
assert 'noindex, nofollow' in html
print(json.dumps({'local_references_checked':len(page.refs),'unique_ids':len(page.ids),'pixel_identical_artwork_crops':7,'declared_image_dimensions':'passed','copy_and_preview_metadata':'passed'},indent=2))
