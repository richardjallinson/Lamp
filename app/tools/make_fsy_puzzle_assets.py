#!/usr/bin/env python3
"""Puzzle pieces for Episode 1, from Richard's drawings in images/originals/fsy/puzzles/.
Pieces drawn on black become transparent PNGs (the black that touches the edge is removed);
backgrounds become JPEGs. Output: app/www/img/fsy/pz/.   Run: python3 app/tools/make_fsy_puzzle_assets.py"""
import os
import numpy as np
from PIL import Image, ImageFilter
from scipy import ndimage

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
SRC = os.path.join(ROOT, "images", "originals", "fsy", "puzzles")
OUT = os.path.join(ROOT, "app", "www", "img", "fsy", "pz")
os.makedirs(OUT, exist_ok=True)

def cutout(im, thresh=22):
    """alpha = everything except the dark background connected to the picture's edge"""
    a = np.asarray(im.convert("RGB")).astype(np.int16)
    dark = a.max(axis=2) < thresh
    lab, _ = ndimage.label(dark)
    edge = set(np.unique(np.concatenate([lab[0], lab[-1], lab[:, 0], lab[:, -1]]))) - {0}
    bg = np.isin(lab, list(edge))
    sizes = ndimage.sum(dark, lab, range(1, lab.max() + 1))   # big enclosed black holes too (between chains, inside handles)
    big = [i + 1 for i, n in enumerate(sizes) if n > dark.size * 0.004]
    bg |= np.isin(lab, big)
    alpha = Image.fromarray(((~bg) * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(1.2))
    out = im.convert("RGBA"); out.putalpha(alpha)
    return out.crop(out.getbbox())

def save_png(im, name, maxw):
    if im.width > maxw: im = im.resize((maxw, round(im.height * maxw / im.width)), Image.LANCZOS)
    im.save(os.path.join(OUT, name + ".png"), optimize=True); print(name, im.size)

def save_jpg(name, src, maxlong=1200):
    im = Image.open(os.path.join(SRC, src)).convert("RGB"); im.thumbnail((maxlong, maxlong), Image.LANCZOS)
    im.save(os.path.join(OUT, name + ".jpg"), quality=84); print(name, im.size)

o = lambda f: Image.open(os.path.join(SRC, f))
save_png(cutout(o("balance-stand.png")), "bal-stand", 360)
save_png(cutout(o("balance-beam.png")), "bal-beam", 900)
save_png(cutout(o("balance-pan.png")), "bal-pan", 420)
save_png(cutout(o("lock-wheel.png")), "lock-wheel", 160)
save_png(cutout(o("oil-jar.png")), "oil-jar", 420)
# the five weights: split the row at the dark gaps between them
w = cutout(o("weights-five.png"))
a = np.asarray(w)[:, :, 3].max(axis=0) > 40
runs, start = [], None
for x, on in enumerate(list(a) + [False]):
    if on and start is None: start = x
    if not on and start is not None:
        if x - start > 30: runs.append((start, x))
        start = None
k = 300 / (runs[0][1] - runs[0][0])   # one scale for all five, so the sizes stay true
for i, (x0, x1) in enumerate(runs[:5]):
    piece = w.crop((x0, 0, x1, w.height)); piece = piece.crop(piece.getbbox())
    save_png(piece.resize((round(piece.width * k), round(piece.height * k)), Image.LANCZOS), "weight-%d" % (i + 1), 300)
save_jpg("spice-stall", "spice-stall.png")
im = Image.open(os.path.join(SRC, "lock-case.png")).convert("RGB"); W, H = im.size   # the lock plate, close
im.crop((int(W * 0.22), int(H * 0.12), int(W * 0.78), int(H * 0.88))).save(os.path.join(OUT, "lock-case.jpg"), quality=84)
save_jpg("gihon-wall", "gihon-wall-lamp-mark.png")
save_jpg("tunnel-meet", "tunnel-meeting-place.png")
im = Image.open(os.path.join(SRC, "route-map.png")).convert("RGB")   # the painted map only, not the floor
im.crop((0, 270, im.width, 1090)).save(os.path.join(OUT, "route-map.jpg"), quality=84)
