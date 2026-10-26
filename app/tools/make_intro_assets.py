#!/usr/bin/env python3
"""Make the start screen pictures in app/www/img/start/ from Richard's originals.

  python3 app/tools/make_intro_assets.py      (run from the repository root)

  images/lamp-000-title.jpg                  -> title.jpg     the New Jerusalem title painting
                                             -> letters.webp  just the painted LAMP letters (transparent
                                                              elsewhere), laid over the flying lamp
  images/originals/lamp-clay-unlit.png       -> clay-lamp.webp the clay oil lamp, cut from its black background
                                             -> clay-lamp-warm.webp  the same, lit warmly from the flame
  images/originals/video/flame-original.mp4  -> flame.webp    the flame as a seamless 9 s animated loop
                                                              with real transparency
Needs Pillow, numpy, scipy and ffmpeg.
"""
import os
import shutil
import subprocess
import tempfile

import numpy as np
from PIL import Image, ImageDraw, ImageFilter
from scipy import ndimage

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
IMG = os.path.join(ROOT, "images")
OUT = os.path.join(ROOT, "app", "www", "img", "start")
os.makedirs(OUT, exist_ok=True)


def title():
    """The painting as is, and its LAMP letters on their own."""
    src = os.path.join(IMG, "lamp-000-title.jpg")
    shutil.copy(src, os.path.join(OUT, "title.jpg"))
    im = Image.open(src).convert("RGB")
    k = im.width / 720                                   # the letter positions below were measured on a 720-wide copy
    y0, y1 = int(270 * k), int(470 * k)
    band = im.crop((0, y0, im.width, y1))
    a = np.asarray(band).astype(float)
    r, b = a[..., 0], a[..., 2]
    m = (r > 140) & ((r - b) > 95)                       # bright, saturated gold
    m[: int(45 * k)] = 0
    m[int(155 * k):] = 0
    yy, xx = np.mgrid[0: m.shape[0], 0: m.shape[1]]
    a_right = 290 * k + (yy - 52 * k) * (45 / 93)        # the A's right leg; the beam of light between A and M is not a letter
    m[(xx > a_right + 3 * k) & (xx < 369 * k)] = 0
    m = ndimage.binary_closing(m, iterations=2)
    m = ndimage.binary_fill_holes(m)
    lab, n = ndimage.label(m)
    sizes = ndimage.sum(m, lab, range(1, n + 1))
    m = np.isin(lab, [i + 1 for i, s in enumerate(sizes) if s > 400 * k * k])
    alpha = Image.fromarray((ndimage.binary_dilation(m, iterations=1) * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(1.2 * k))
    band = band.convert("RGBA")
    band.putalpha(alpha)
    full = Image.new("RGBA", im.size, (0, 0, 0, 0))
    full.paste(band, (0, y0))
    full.save(os.path.join(OUT, "letters.webp"), quality=88, alpha_quality=90)


def clay_lamp():
    """Cut the lamp from its black background; the flame sits at the wick hole (19.5% across, 66-68% down)."""
    im = Image.open(os.path.join(IMG, "originals", "lamp-clay-unlit.png")).convert("RGB")
    a = np.asarray(im).astype(int)
    lab, _ = ndimage.label(a.max(axis=2) < 22)
    edge = set(np.unique(np.concatenate([lab[0], lab[-1], lab[:, 0], lab[:, -1]]))) - {0}
    fg = ~np.isin(lab, list(edge))
    fg = ndimage.binary_fill_holes(ndimage.binary_opening(fg, iterations=2))
    lab2, n2 = ndimage.label(fg)
    fg = lab2 == (np.argmax(ndimage.sum(fg, lab2, range(1, n2 + 1))) + 1)
    alpha = Image.fromarray((fg * 255).astype(np.uint8)).filter(ImageFilter.MinFilter(3)).filter(ImageFilter.GaussianBlur(1.6))
    rgba = im.copy()
    rgba.putalpha(alpha)
    ys, xs = np.where(fg)
    pad = 12
    crop = rgba.crop((max(0, xs.min() - pad), max(0, ys.min() - pad), min(im.width, xs.max() + pad), min(im.height, ys.max() + pad)))
    crop = crop.resize((700, round(700 * crop.height / crop.width)), Image.LANCZOS)
    crop.save(os.path.join(OUT, "clay-lamp.webp"), quality=86, method=6)
    # the same lamp lit warmly from the flame (faded in when the lamp is lit; a CSS mask can't be used
    # because the web view treats local mask images as cross-origin)
    arr = np.asarray(crop).astype(np.float32) / 255
    h, w = arr.shape[:2]
    yy, xx = np.mgrid[0:h, 0:w]
    d = np.hypot((xx - 0.195 * w) / w, (yy - 0.40 * h) / w)
    glow = np.clip(np.interp(d, [0, 0.12, 0.33, 0.55], [0.95, 0.45, 0.12, 0]), 0, 1)[..., None] * np.array([1.0, 0.72, 0.38])
    rgb = 1 - (1 - arr[..., :3]) * (1 - glow * 0.6)          # screen
    warm = np.dstack([rgb, arr[..., 3]])
    Image.fromarray((warm * 255).astype(np.uint8), "RGBA").save(os.path.join(OUT, "clay-lamp-warm.webp"), quality=86, method=6)


def flame():
    """Crop the flame video, blend its end into its start, and turn black into transparency."""
    src = os.path.join(IMG, "originals", "video", "flame-original.mp4")
    with tempfile.TemporaryDirectory() as tmp:
        w, h = 320, 660
        mask = Image.new("L", (w, h), 0)
        ImageDraw.Draw(mask).ellipse((20, -60, 300, h - 18), fill=255)
        mask.filter(ImageFilter.GaussianBlur(22)).convert("RGB").save(os.path.join(tmp, "mask.png"))
        loop = os.path.join(tmp, "loop.mp4")
        subprocess.run([
            "ffmpeg", "-v", "error", "-y", "-i", src, "-i", src, "-loop", "1", "-i", os.path.join(tmp, "mask.png"),
            "-filter_complex",
            "[0:v]trim=1:10,setpts=PTS-STARTPTS,crop=320:660:480:60[b];"
            "[1:v]trim=0:1.05,setpts=PTS-STARTPTS,crop=320:660:480:60[a];"
            "[b][a]xfade=transition=fade:duration=1:offset=8,format=rgb24,curves=all='0/0 0.06/0 0.2/0.17 1/1'[f];"
            "[2:v]format=rgb24,trim=0:9[m];[f][m]blend=all_mode=multiply,scale=240:-2,format=yuv420p[o]",
            "-map", "[o]", "-an", "-t", "9", "-c:v", "libx264", "-preset", "slow", "-crf", "20", "-profile:v", "main", loop], check=True)
        W, H = 200, 412
        raw = subprocess.run(["ffmpeg", "-v", "error", "-i", loop, "-vf", f"fps=20,scale={W}:{H}", "-f", "rawvideo", "-pix_fmt", "rgb24", "-"],
                             capture_output=True, check=True).stdout
    frames = np.frombuffer(raw, np.uint8).reshape(-1, H, W, 3).astype(np.float32) / 255
    out = []
    for f in frames:
        peak = f.max(axis=2)
        a = np.clip((peak - 0.03) / 0.97, 0, 1)
        rgb = f / np.maximum(peak[..., None], 1e-4)
        out.append(Image.fromarray((np.dstack([np.clip(rgb, 0, 1), a]) * 255).astype(np.uint8), "RGBA"))
    out[0].save(os.path.join(OUT, "flame.webp"), save_all=True, append_images=out[1:], duration=50, loop=0,
                quality=78, alpha_quality=70, method=5)


def jerusalem():
    """The start screen painting: night Jerusalem and the Eastern Gate, shut (title.jpg) and open (title-open.jpg).
    The paintings are wide, so they are cut to a portrait 9:16 around the gate, with extra night sky added above
    (a softened mirror of the painted sky) to make room for the LAMP title."""
    src = os.path.join(IMG, "originals", "start")
    extra, gate_x = 230, 715                       # rows of sky added (in the 1024-high original); the gate's centre
    for name, out in (("jerusalem-night-a.png", "title.jpg"), ("jerusalem-night-open.png", "title-open.jpg")):
        im = Image.open(os.path.join(src, name)).convert("RGB")
        W, H = im.size
        sky = im.crop((0, 0, W, extra)).transpose(Image.FLIP_TOP_BOTTOM).filter(ImageFilter.GaussianBlur(1.5))
        tall = Image.new("RGB", (W, H + extra))
        tall.paste(sky, (0, 0))
        tall.paste(im, (0, extra))
        a = np.asarray(tall).astype(np.float32)
        seam = 40                                    # blend the join
        for i in range(seam):
            t = i / seam
            a[extra - seam + i] = a[extra - seam + i] * (1 - t) + a[extra + (seam - i) % seam] * t * 0 + a[extra - seam + i] * t
        yy = np.arange(H + extra)[:, None, None]
        a = a * np.where(yy < extra, 0.78 + 0.22 * (yy / extra), 1.0)   # the high sky a little darker
        tall = Image.fromarray(np.clip(a, 0, 255).astype(np.uint8))
        h = H + extra
        w = round(h * 9 / 16)
        x0 = max(0, min(W - w, gate_x - w // 2))
        tall.crop((x0, 0, x0 + w, h)).resize((1080, 1920), Image.LANCZOS).save(os.path.join(OUT, out), quality=86, optimize=True, progressive=True)
    print("gate at", round((gate_x - x0) / w, 3), round((400 + extra) / h, 3))


jerusalem()
clay_lamp()
flame()
for f in sorted(os.listdir(OUT)):
    print(f"{f:16s} {os.path.getsize(os.path.join(OUT, f)) // 1024:5d} KB")
