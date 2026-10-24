#!/usr/bin/env python3
"""Convert the Project Gutenberg KJV e-book (pg10 .epub) to 'Book C:V text' lines for lamp_levels.py check --kjv."""
import html, re, sys, zipfile
sys.path.insert(0, __import__("os").path.dirname(__file__))
from lamp_levels import BOOKS
z = zipfile.ZipFile(sys.argv[1])
opf_name = next(n for n in z.namelist() if n.endswith(".opf"))
opf = z.read(opf_name).decode()
base = opf_name.rsplit("/", 1)[0] + "/" if "/" in opf_name else ""
manifest = dict(re.findall(r'<item[^>]*?id="([^"]+)"[^>]*?href="([^"]+)"', opf))
manifest.update({i: h for h, i in re.findall(r'<item[^>]*?href="([^"]+)"[^>]*?id="([^"]+)"', opf)})
spine = re.findall(r'<itemref[^>]*idref="([^"]+)"', opf)
book = -1
out = []
for idref in spine:  # one book per file: anything before its first "1:1" is the title
    href = manifest.get(idref)
    if not href or not href.endswith(("htm", "html", "xhtml")):
        continue
    raw = z.read(base + href).decode("utf-8")
    raw = re.sub(r"<h[1-6][^>]*>.*?</h[1-6]>", " ", raw, flags=re.S)
    raw = re.sub(r"\s+", " ", html.unescape(re.sub(r"<[^>]+>", " ", raw)))
    if not re.search(r"(?:^|\s)1:1 ", raw):
        continue
    raw = raw[re.search(r"(?:^|\s)1:1 ", raw).start():]
    cut = raw.find("*** END OF")
    if cut > 0:
        raw = raw[:cut]
    cut = raw.find("The New Testament of the King James Bible")
    if cut > 0:
        raw = raw[:cut]
    parts = re.split(r"(?:(?<=\s)|^)(\d{1,3}):(\d{1,3}) ", raw.strip())
    first = True
    for i in range(1, len(parts) - 2, 3):
        c, v, t = int(parts[i]), int(parts[i + 1]), parts[i + 2].strip()
        if c == 1 and v == 1 and first:
            book += 1
            first = False
        out.append(f"{BOOKS[book]} {c}:{v} {t}")
open(sys.argv[2], "w", encoding="utf-8").write("\n".join(out) + "\n")
print(f"{len(out)} verses, {book + 1} books; last: {out[-1][:80]}")
