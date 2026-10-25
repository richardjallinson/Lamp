#!/usr/bin/env python3
"""Make the pictures for the six Genesis puzzles (js/puzzles.js) from Richard's paintings.

  python3 app/tools/make_puzzle_assets.py      (run from anywhere)

Reads images/originals/adventure/{noah,bethel-road,moriah,bethel,joseph,relics}/*.png
Writes app/www/img/adv/p/: the scenes as .jpg (portrait 941x1672, as painted) and every item
painted on black as a cut-out .webp with a transparent background.
"""
import os

import numpy as np
from PIL import Image, ImageFilter
from scipy import ndimage

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
SRC = os.path.join(ROOT, "images", "originals", "adventure")
OUT = os.path.join(ROOT, "app", "www", "img", "adv", "p")
os.makedirs(OUT, exist_ok=True)


def src(path):
    return Image.open(os.path.join(SRC, path)).convert("RGB")


def scene(path, out, q=80):
    im = src(path)
    if im.size != (941, 1672):
        im = im.resize((941, 1672), Image.LANCZOS)
    im.save(os.path.join(OUT, out), quality=q, optimize=True, progressive=True)


def square(path, out, size=900, q=82):
    src(path).resize((size, size), Image.LANCZOS).save(os.path.join(OUT, out), quality=q, optimize=True, progressive=True)


def masks(im, thresh=24):
    """Every object on the black ground: the parts not connected to the black border, largest first."""
    a = np.asarray(im).astype(int)
    lab, _ = ndimage.label(a.max(axis=2) < thresh)
    edge = set(np.unique(np.concatenate([lab[0], lab[-1], lab[:, 0], lab[:, -1]]))) - {0}
    fg = ~np.isin(lab, list(edge))
    fg = ndimage.binary_fill_holes(ndimage.binary_opening(fg, iterations=2))
    lab2, n2 = ndimage.label(fg)
    sizes = ndimage.sum(fg, lab2, range(1, n2 + 1))
    order = np.argsort(-sizes)
    return [lab2 == (i + 1) for i in order if sizes[i] > 0.004 * fg.size]


def cutout(im, fg, size, glow=False):
    a = np.asarray(im).astype(np.float32) / 255
    alpha = np.asarray(Image.fromarray((fg * 255).astype(np.uint8)).filter(ImageFilter.MinFilter(3)).filter(ImageFilter.GaussianBlur(1.6))).astype(np.float32) / 255
    rgb = a
    if glow:   # flames and light: brightness becomes opacity outside the solid part
        peak = a.max(axis=2)
        alpha = np.maximum(alpha, np.clip((peak - 0.06) / 0.5, 0, 1))
        rgb = np.clip(np.where(alpha[..., None] > 0, a / np.maximum(alpha[..., None], 1e-3), 0), 0, 1)
    img = Image.fromarray((np.dstack([rgb, alpha]) * 255).astype(np.uint8), "RGBA")
    bbox = img.getchannel("A").point(lambda v: 255 if v > 8 else 0).getbbox()
    pad = 6
    img = img.crop((max(0, bbox[0] - pad), max(0, bbox[1] - pad), min(img.width, bbox[2] + pad), min(img.height, bbox[3] + pad)))
    k = size / max(img.size)
    return img.resize((round(img.width * k), round(img.height * k)), Image.LANCZOS)


def item(path, out, size=420, glow=False, which=0, thresh=24):
    im = src(path)
    m = masks(im, thresh)
    if glow:   # include the whole lit area (flame above the pot)
        fg = np.zeros_like(m[0])
        for x in m:
            fg |= x
    else:
        fg = m[which]
    cutout(im, fg, size, glow).save(os.path.join(OUT, out), quality=86, alpha_quality=88)


# Noah
scene("noah/01-ark-door-shut.png", "ark.jpg")
scene("noah/02-door-wheels.png", "door.jpg")
scene("noah/03-plank.png", "plank.jpg")
scene("noah/04-deck-shut.png", "deck.jpg")
scene("noah/05-deck-open.png", "deck-open.jpg")
g = src("noah/06-gears.png")
gm = sorted(masks(g), key=lambda m: np.where(m)[1].mean())          # left to right: small, medium, large
for m, name, px in zip(gm, ("gear-s", "gear-m", "gear-l"), (200, 280, 360)):
    cutout(g, m, px).save(os.path.join(OUT, name + ".webp"), quality=86, alpha_quality=88)
item("noah/07-raven.png", "raven.webp", 360)
item("noah/08-dove.png", "dove.webp", 360)
# Abram
scene("bethel-road/09-tent-interior.png", "tent.jpg")
scene("bethel-road/10-map.png", "map.jpg", 84)
item("bethel-road/11-compass-rose.png", "compass.webp", 420)
item("bethel-road/12-tent-token.png", "tok-tent.webp", 200)
item("bethel-road/13-altar-token.png", "tok-altar.webp", 200)
# Moriah
scene("moriah/14-looking-ahead.png", "mor-ahead.jpg")
scene("moriah/15-looking-behind.png", "mor-behind.jpg")
scene("moriah/16-ram-thicket.png", "ram.jpg")
item("moriah/17-wood.png", "wood.webp", 300)
item("moriah/18-fire-pot.png", "fire.webp", 300, glow=True)
item("moriah/19-altar-stone.png", "stone.webp", 200)
# Bethel
scene("bethel/20-stony-place-night.png", "bet-night.jpg")
scene("bethel/21-dream.png", "bet-dream.jpg")
scene("bethel/22-sunrise.png", "bet-sun.jpg")
scene("bethel/23-pillar-anointed.png", "bet-pillar.jpg")
item("bethel/24-rubble-stone.png", "rubble.webp", 220)
item("bethel/25-smooth-stone.png", "smooth.webp", 360)
# Joseph
scene("joseph/26-granary-courtyard.png", "granary.jpg")
scene("joseph/27-storehouse-floor.png", "floor.jpg")
square("joseph/28-dream-wall-good.png", "wall-good.jpg", 760)
square("joseph/29-dream-wall-famine.png", "wall-lean.jpg", 760)
# Relics
for f, out in (("30-olive-leaf.png", "relic-olive.webp"), ("31-tent-peg.png", "relic-peg.webp"), ("32-rams-horn.png", "relic-horn.webp"),
               ("33-anointed-stone.png", "relic-anointed.webp"), ("34-coat.png", "relic-colours.webp")):
    item("relics/" + f, out, 420)

for f in sorted(os.listdir(OUT)):
    print(f"{f:20s} {os.path.getsize(os.path.join(OUT, f)) // 1024:5d} KB")
