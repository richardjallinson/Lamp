#!/usr/bin/env python3
"""Portraits for the people of Episode 1, from Richard's drawings in images/originals/fsy/people/<id>.png.
Each becomes a square head-and-shoulders JPEG (the game shows it in a round medallion and on the talk card).
Run: python3 app/tools/make_fsy_people.py   Add a person: drop <id>.png in the folder and run again."""
import os, glob
from PIL import Image
ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
SRC = os.path.join(ROOT, "images", "originals", "fsy", "people"); OUT = os.path.join(ROOT, "app", "www", "img", "fsy", "people")
os.makedirs(OUT, exist_ok=True)
# where the face sits (fraction from the top of the picture) when it is not in the middle
FACE = {"grandma2": "grandma"}
ids = []
for f in sorted(glob.glob(os.path.join(SRC, "*.png"))):
    pid = os.path.basename(f)[:-4]; im = Image.open(f).convert("RGB"); W, H = im.size
    side = int(W * 0.92); top = int(H * 0.04)       # square crop from near the top: head and shoulders
    box = ((W - side) // 2, top, (W + side) // 2, min(H, top + side))
    sq = im.crop(box).resize((480, 480), Image.LANCZOS); sq.save(os.path.join(OUT, pid + ".jpg"), quality=84); ids.append(pid)
for alias, src in FACE.items():
    if src in ids: Image.open(os.path.join(OUT, src + ".jpg")).save(os.path.join(OUT, alias + ".jpg"), quality=84); ids.append(alias)
print("portraits:", ", ".join(sorted(ids)))
