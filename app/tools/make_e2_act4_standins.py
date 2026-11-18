"""Temporary picture for Episode 2, Act 4: the café terrace above the Cardo (img/fsy/w/v4-cafe.jpg).
A plain backdrop with a labelled panel where the game's tap spot is, so the act can be played before the real art exists.
Run: python3 app/tools/make_e2_act4_standins.py   (never overwrites a picture whose original is in images/originals/fsy/e2-act4)"""
import os, textwrap
from PIL import Image, ImageDraw, ImageFont
HERE = os.path.dirname(os.path.abspath(__file__)); W, H = 900, 1200
OUT = os.path.join(HERE, "..", "www", "img", "fsy", "w")
def font(sz):
    for f in ("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", "/System/Library/Fonts/Helvetica.ttc"):
        if os.path.exists(f): return ImageFont.truetype(f, sz)
    return ImageFont.load_default()
PICS = {"v4-cafe": ("A café terrace above the Cardo", [([30, 58, 40, 16], "Two coffees")])}
for n, (cap, hots) in PICS.items():
    if os.path.exists(os.path.join(HERE, "..", "..", "images", "originals", "fsy", "e2-act4", n + ".png")): continue
    im = Image.new("RGB", (W, H)); d = ImageDraw.Draw(im)
    for y in range(H):
        t = y / H; d.line([(0, y), (W, y)], fill=tuple(int(a + (b - a) * min(1, t / 0.5)) for a, b in zip((150, 190, 225), (232, 214, 176))) if t < 0.5 else (176, 150, 112))
    for i in range(5): d.line([(0, 640 + i * 110), (W, 620 + i * 110)], fill=(150, 126, 92), width=5)
    for (x, y, w, hh), lab in hots:
        box = [x * W / 100, y * H / 100, (x + w) * W / 100, (y + hh) * H / 100]
        d.rounded_rectangle(box, 14, fill=(244, 236, 214), outline=(90, 70, 30), width=4); f = font(26)
        tw = d.textlength(lab, font=f); d.text(((box[0] + box[2] - tw) / 2, (box[1] + box[3]) / 2 - 15), lab, fill=(50, 40, 20), font=f)
    d.rectangle([0, H - 96, W, H], fill=(20, 24, 44))
    d.text((24, H - 84), "TEMPORARY PICTURE", fill=(232, 190, 90), font=font(26)); d.text((24, H - 48), textwrap.shorten(cap, 60), fill=(240, 232, 210), font=font(22))
    im.save(os.path.join(OUT, n + ".jpg"), quality=82); print(n)
