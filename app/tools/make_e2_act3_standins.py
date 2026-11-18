"""Temporary pictures for Episode 2, Act 3 (img/fsy/w/v3-*.jpg) and a stand-in face for the vinedresser.
Each picture is a plain backdrop with a labelled panel exactly where the game's tap spot is, so a tester can play the act before the real art exists.
Run: node app/tools/dump_e2_act3_views.js && python3 app/tools/make_e2_act3_standins.py"""
import json, os, textwrap
from PIL import Image, ImageDraw, ImageFont
HERE = os.path.dirname(os.path.abspath(__file__)); W, H = 900, 1200
OUT = os.path.join(HERE, "..", "www", "img", "fsy", "w")
def font(sz):
    for f in ("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", "/System/Library/Fonts/Helvetica.ttc"):
        if os.path.exists(f): return ImageFont.truetype(f, sz)
    return ImageFont.load_default()
SKY = {"v3-dance": ((70, 50, 90), (230, 150, 90)), "v3-hutin": ((40, 36, 30), (70, 62, 50)), "v3-institute": ((90, 80, 66), (150, 136, 110)), "v3-steps": ((170, 190, 215), (226, 212, 180))}
GROUND = {"v3-dance": (70, 80, 50), "v3-hutin": (96, 86, 70), "v3-institute": (120, 104, 84), "v3-steps": (200, 186, 150)}
views = json.load(open(os.path.join(HERE, "e2_act3_views.json"))); seen = set()
for v in views:
    n = v["img"]
    if not n.startswith("v3-") or n in seen: continue
    if os.path.exists(os.path.join(HERE, "..", "..", "images", "originals", "fsy", "e2-act3", n + ".png")): continue   # Richard's real picture is in; never overwrite it
    seen.add(n)
    hots = [h for x in views if x["img"] == n for h in x["hots"]]
    top, bot = SKY.get(n, ((150, 195, 230), (232, 226, 200))); g = GROUND.get(n, (150, 165, 100))
    im = Image.new("RGB", (W, H)); d = ImageDraw.Draw(im)
    for y in range(H):
        t = y / H; d.line([(0, y), (W, y)], fill=tuple(int(top[i] + (bot[i] - top[i]) * min(1, t / 0.45)) for i in range(3)) if t < 0.45 else g)
    for i in range(6): d.line([(0, 560 + i * 110), (W, 540 + i * 110)], fill=tuple(max(0, c - 22) for c in g), width=5)
    done = set()
    for h in hots:
        key = tuple(h["box"])
        if key in done: continue
        done.add(key); x, y, w, hh = h["box"]; box = [x * W / 100, y * H / 100, (x + w) * W / 100, (y + hh) * H / 100]
        d.rounded_rectangle(box, 14, fill=(244, 236, 214), outline=(90, 70, 30), width=4)
        lab = "A stone" if h["label"] == "A stone" else h["label"]
        lines = textwrap.wrap(lab, max(8, int(w * W / 100 / 15))); f = font(24)
        ty = (box[1] + box[3]) / 2 - len(lines) * 15
        for ln in lines: tw = d.textlength(ln, font=f); d.text(((box[0] + box[2] - tw) / 2, ty), ln, fill=(50, 40, 20), font=f); ty += 30
    d.rectangle([0, H - 96, W, H], fill=(20, 24, 44)); f = font(26)
    d.text((24, H - 84), "TEMPORARY PICTURE", fill=(232, 190, 90), font=f)
    d.text((24, H - 48), textwrap.shorten(v["cap"], 60), fill=(240, 232, 210), font=font(22))
    im.save(os.path.join(OUT, n + ".jpg"), quality=82); print(n)
# a plain medallion for the vinedresser until his portrait is made
im = Image.new("RGB", (400, 400), (96, 110, 70)); d = ImageDraw.Draw(im); d.ellipse([40, 40, 360, 360], fill=(214, 196, 150), outline=(60, 44, 20), width=8)
f = font(170); tw = d.textlength("V", font=f); d.text(((400 - tw) / 2, 95), "V", fill=(60, 44, 20), font=f)
p = os.path.join(HERE, "..", "www", "img", "fsy", "people", "vinedresser.jpg")
if not os.path.exists(p): im.save(p, quality=85); print("vinedresser")
