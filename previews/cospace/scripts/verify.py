"""Audit the isolated case study's references and PNG assets, without dependencies."""
from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit, unquote
import json
import struct

page = Path(__file__).resolve().parents[1]
repository = page.parents[1]


class Source(HTMLParser):
    def __init__(self):
        super().__init__()
        self.ids = []
        self.references = []
        self.h1_count = 0
        self.images = []

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if "id" in attrs:
            self.ids.append(attrs["id"])
        if tag == "h1":
            self.h1_count += 1
        if tag == "img":
            self.images.append(attrs)
        for attribute in ("src", "href"):
            if attribute in attrs:
                self.references.append(attrs[attribute])
        if "aria-controls" in attrs:
            self.references += ["#" + item for item in attrs["aria-controls"].split()]


source = Source()
source.feed((page / "index.html").read_text())
assert len(source.ids) == len(set(source.ids)), "Duplicate element IDs"
assert source.h1_count == 1, "The case study must have one h1"
assert all("alt" in image for image in source.images), "Image missing alt attribute"

local_references = []
for reference in source.references:
    url = urlsplit(reference)
    if url.scheme or url.netloc:
        continue
    target = (page / unquote(url.path)).resolve() if url.path else page / "index.html"
    assert target.is_relative_to(repository), f"Reference leaves repository: {reference}"
    assert target.exists(), f"Missing file: {reference}"
    if not url.path and url.fragment:
        assert url.fragment in source.ids, f"Missing anchor: {reference}"
    local_references.append(reference)

pngs = []
for path in sorted((page / "assets").rglob("*.png")):
    with path.open("rb") as handle:
        header = handle.read(26)
    assert header[:8] == b"\x89PNG\r\n\x1a\n", f"Not PNG: {path}"
    width, height = struct.unpack(">II", header[16:24])
    assert width > 0 and height > 0, f"Empty image: {path}"
    if path.name == "graphite-device.png":
        assert header[25] in (4, 6), "Device frame must retain alpha transparency"
    pngs.append({"file": str(path.relative_to(page)), "width": width, "height": height})

for path in sorted((page / "assets").rglob("*.jpg")):
    with path.open("rb") as handle:
        assert handle.read(3) == b"\xff\xd8\xff", f"Not JPEG: {path}"

for path in [page / "index.html", page / "cospace.css", page / "cospace.js"]:
    content = path.read_text()
    assert "www.figma.com/api/mcp/asset/" not in content, "Temporary Figma URL in runtime source"
    assert "\u2014" not in content, f"Em dash in {path.name}"

print(json.dumps({"status": "passed", "local_references": len(local_references), "unique_ids": len(source.ids), "images": pngs}, indent=2))
