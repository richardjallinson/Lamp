#!/usr/bin/env python3
"""Make the adventure pictures in app/www/img/adv/ from Richard's paintings.

  python3 app/tools/make_adventure_assets.py      (run from the repository root)

Reads images/originals/adventure/garden-gate/*.png and writes:
  gate.jpg, gate-open.jpg, panel.jpg          the scenes (portrait 941x1672, as painted)
  sword.webp                                  the flaming sword, cut from black (flames stay soft)
  dial.webp                                   the dial of the seven days, cut out as a circle
  day-1.webp .. day-7.webp                    each day's segment alone, in place on the dial (same size as dial.webp)
  card-1.webp .. card-7.webp                  each day's segment turned upright, for the Light the Days cards
  relic-days.webp, relic-onyx.webp, relic-coat.webp   the relics, cut from black
"""
import math
import os

import numpy as np
from PIL import Image, ImageFilter
from scipy import ndimage

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
SRC = os.path.join(ROOT, "images", "originals", "adventure", "garden-gate")
OUT = os.path.join(ROOT, "app", "www", "img", "adv")
os.makedirs(OUT, exist_ok=True)


def src(name):
    return Image.open(os.path.join(SRC, name)).convert("RGB")


def scene(name, out):
    src(name).save(os.path.join(OUT, out), quality=84, optimize=True, progressive=True)


def solid_mask(im, thresh=22):
    """The object: everything not connected to the black border."""
    a = np.asarray(im).astype(int)
    lab, _ = ndimage.label(a.max(axis=2) < thresh)
    edge = set(np.unique(np.concatenate([lab[0], lab[-1], lab[:, 0], lab[:, -1]]))) - {0}
    fg = ~np.isin(lab, list(edge))
    fg = ndimage.binary_fill_holes(ndimage.binary_opening(fg, iterations=2))
    lab2, n2 = ndimage.label(fg)
    return lab2 == (np.argmax(ndimage.sum(fg, lab2, range(1, n2 + 1))) + 1)


def cutout(im, fg, size, glow=False, crop_bottom=None):
    a = np.asarray(im).astype(np.float32) / 255
    alpha = np.asarray(Image.fromarray((fg * 255).astype(np.uint8)).filter(ImageFilter.MinFilter(3)).filter(ImageFilter.GaussianBlur(1.6))).astype(np.float32) / 255
    rgb = a
    if glow:   # flames: brightness becomes transparency outside the solid part
        peak = a.max(axis=2)
        la = np.clip((peak - 0.05) / 0.6, 0, 1)
        alpha = np.maximum(alpha, la)
        rgb = np.where(alpha[..., None] > 0, a / np.maximum(alpha[..., None], 1e-3), 0)
        rgb = np.clip(rgb, 0, 1)
    rgba = np.dstack([rgb, alpha])
    img = Image.fromarray((rgba * 255).astype(np.uint8), "RGBA")
    if crop_bottom:
        img = img.crop((0, 0, img.width, crop_bottom))
    bbox = img.getchannel("A").point(lambda v: 255 if v > 8 else 0).getbbox()
    pad = 8
    img = img.crop((max(0, bbox[0] - pad), max(0, bbox[1] - pad), min(img.width, bbox[2] + pad), min(img.height, bbox[3] + pad)))
    k = size / max(img.size)
    return img.resize((round(img.width * k), round(img.height * k)), Image.LANCZOS)


def dial():
    im = src("dial-of-days.png")
    fg = solid_mask(im)
    ys, xs = np.where(fg)
    cx, cy = xs.mean(), ys.mean()
    r = (xs.max() - xs.min() + ys.max() - ys.min()) / 4
    x0, y0 = int(cx - r - 6), int(cy - r - 6)
    side = int(2 * r + 12)
    a = np.asarray(im).astype(np.float32) / 255
    yy, xx = np.mgrid[0: im.height, 0: im.width]
    d = np.hypot(xx - cx, yy - cy)
    circle = np.clip((r - d) / 2.5, 0, 1)
    full = Image.fromarray((np.dstack([a, circle]) * 255).astype(np.uint8), "RGBA").crop((x0, y0, x0 + side, y0 + side))
    S = 640
    full = full.resize((S, S), Image.LANCZOS)
    full.save(os.path.join(OUT, "dial.webp"), quality=86)
    # the seven segments: day k is centred at k*360/7 degrees clockwise from the top (day 1 at the top)
    c = S / 2
    yy, xx = np.mgrid[0:S, 0:S]
    ang = (np.degrees(np.arctan2(xx - c, -(yy - c))) + 360) % 360
    rad = np.hypot(xx - c, yy - c)
    hub = 0.205 * S / 2 * 2 * 0.5 + 0.13 * S       # leave the centre boss out of the segments
    arr = np.asarray(full).astype(np.float32)
    step = 360 / 7
    for k in range(7):
        lo = (k * step - step / 2) % 360
        dist = np.minimum(np.abs(ang - k * step), 360 - np.abs(ang - k * step))
        m = np.clip((step / 2 - dist) / 1.2, 0, 1) * np.clip((rad - hub) / 2, 0, 1)
        seg = arr.copy()
        seg[..., 3] = seg[..., 3] * m
        segimg = Image.fromarray(seg.astype(np.uint8), "RGBA")
        segimg.save(os.path.join(OUT, f"day-{k + 1}.webp"), quality=86)
        up = segimg.rotate(k * step, resample=Image.BICUBIC, center=(c, c))   # turn it so it points up
        bb = up.getchannel("A").point(lambda v: 255 if v > 10 else 0).getbbox()
        up.crop(bb).save(os.path.join(OUT, f"card-{k + 1}.webp"), quality=86)
        _ = lo


scene("gate-closed-c.png", "gate.jpg")
scene("gate-open-view.png", "gate-open.jpg")
scene("stone-panel.png", "panel.jpg")
sw = src("flaming-sword.png")
cutout(sw, solid_mask(sw, 40), 900, glow=True).save(os.path.join(OUT, "sword.webp"), quality=84, alpha_quality=80)
dial()
for f, out, kw in (("relic-stone-of-days.png", "relic-days.webp", {}), ("relic-onyx-stone.png", "relic-onyx.webp", {"crop_bottom": 1105}),
                   ("relic-coat-of-skins.png", "relic-coat.webp", {})):
    im = src(f)
    fg = solid_mask(im)
    if "crop_bottom" in kw:   # the onyx sits on a reflection: keep only a smooth egg outline above it
        cb = kw["crop_bottom"]
        ys, xs = np.where(fg[:cb])
        top, x0, x1 = ys.min(), xs.min(), xs.max()
        cy_, cx_ = (top + cb) / 2, (x0 + x1) / 2
        yy, xx = np.mgrid[0: fg.shape[0], 0: fg.shape[1]]
        egg = ((xx - cx_) / ((x1 - x0) / 2)) ** 2 + ((yy - cy_) / ((cb - top) / 2)) ** 2 <= 1
        fg = np.where(yy > cy_, egg, fg & egg)
    cutout(im, fg, 420, **kw).save(os.path.join(OUT, out), quality=86)
for f in sorted(os.listdir(OUT)):
    print(f"{f:18s} {os.path.getsize(os.path.join(OUT, f)) // 1024:5d} KB")
_ = math
