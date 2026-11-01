"""Create faithful crops of existing project exports for the portfolio page."""
from pathlib import Path
import hashlib
import json
from PIL import Image

ROOT = Path(__file__).resolve().parent
SOURCE = ROOT.parents[2] / "output/granville-island-portfolio"
ASSETS = ROOT / "assets"
ASSETS.mkdir(exist_ok=True)
records = []
specs = [
    ("homepage-opening.png", "assets/home.png", (0, 0, 1440, 744)),
    ("homepage-earlier.png", "assets/early-home.png", (0, 744, 1440, 1514)),
    ("homepage-final.png", "assets/home.png", (0, 744, 1440, 1514)),
    ("information-hierarchy.png", "assets/ia-highres.png", (112, 900, 1525, 2388)),
    ("vendor-profile.png", "assets/vendor.png", (40, 145, 1450, 1303)),
    ("vendor-menu-detail.png", "assets/vendor.png", (40, 650, 760, 940)),
    ("recommendation-details.png", "assets/quick-bites.png", (112, 810, 745, 950)),
]
for name, original, crop in specs:
    source = SOURCE / original
    image = Image.open(source).convert("RGB")
    out = image.crop(crop)
    path = ASSETS / name
    out.save(path, optimize=True)
    records.append({"file": name, "source": original, "crop": crop, "dimensions": list(out.size),
        "source_sha256": hashlib.sha256(source.read_bytes()).hexdigest(),
        "sha256": hashlib.sha256(path.read_bytes()).hexdigest()})
(ROOT / "asset-provenance.json").write_text(json.dumps(records, indent=2)+"\n")
print(json.dumps({"assets":len(records),"bytes":sum((ASSETS/r['file']).stat().st_size for r in records)}))
