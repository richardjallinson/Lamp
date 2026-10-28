#!/usr/bin/env python3
"""Episode 1 (The Jerusalem Mystery), walking version: prepares Richard's photos for the game.

Originals stay untouched in images/originals/fsy/ (photos, and his films in video/).
The game copies go to app/www/img/fsy/w/: black screenshot bars cropped, resized (1200 px on the long side),
a light matching colour touch (Richard, Oct 27) and JPEG quality 82.

Add a photo: put the original in images/originals/fsy/photos/..., add a line to PHOTOS below
(game name -> original), and run:  python3 app/tools/make_fsy_walk_assets.py
A still from one of his films: add a line to FRAMES (game name -> film, seconds)."""
import os, subprocess, tempfile
from PIL import Image, ImageEnhance, ImageStat

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
SRC = os.path.join(ROOT, "images", "originals", "fsy")
OUT = os.path.join(ROOT, "app", "www", "img", "fsy", "w")

PHOTOS = {
    "airport-1": "photos/israel/ben-gurion-welcome-to-israel.jpg",
    "rail-1": "photos/jerusalem-tram.jpg",
    "rail-2": "photos/old-city/jerusalem-light-rail.jpg",
    "jaffa-1": "photos/old-city/jaffa-gate-tower-of-david.jpg",
    "jaffa-2": "photos/old-city/inside-jaffa-gate-street.jpg",
    "jq-cardo": "photos/old-city/cardo-columns.jpg",
    "wall-menorah": "photos/old-city/western-wall-menorah.jpg",
    "wall-plaza": "photos/temple-mount/mughrabi-bridge-3-western-wall-plaza.png",
    "gtomb-1": "photos/garden-tomb.png",
    "mughrabi-1": "photos/temple-mount/mughrabi-bridge-1-entrance.png",
    "mughrabi-2": "photos/temple-mount/mughrabi-bridge-2-inside.png",
    "mughrabi-3": "photos/temple-mount/mughrabi-bridge-4-ramp.png",
    "olives-top": "photos/mount-of-olives-sunset.jpg",
    "gate-outside-far": "photos/temple-mount/gate-domes-and-mount-of-olives.png",
    # Richard's photos of Oct 27 (crop boxes keep people out of the picture: his wife, and Gabriel)
    "market-street": "photos/oct27/mahane-yehuda-lane.png",
    "rail-3": "photos/oct27/light-rail-two-trams.png",
    "gabriel-street": ("photos/oct27/gabriel-shop-front.png", (612, 470, 1125, 1960)),
    "ramparts-jaffa": "photos/oct27/ramparts-jaffa-gate-from-wall.png",
    "ramparts-tower": "photos/oct27/ramparts-tower-of-david-and-walls.png",
    "ramparts-tower-close": "photos/oct27/ramparts-tower-of-david-close.png",
    "ramparts-arch": ("photos/oct27/ramparts-arch-with-doves.png", (0, 268, 1125, 1340)),
    "ramparts-golgotha": "photos/oct27/golgotha-from-ramparts.png",
    "ramparts-storm": ("photos/oct27/ramparts-storm-clouds.png", (470, 795, 1125, 1635)),
    "jaffa-0": "photos/oct27/jaffa-gate-from-outside.png",
    "jaffa-3": "photos/oct27/inside-jaffa-gate-armenian-quarter.png",
    "jq-cardo-2": "photos/oct27/cardo-columns-2.png",
    "jq-cardo-sign": "photos/oct27/western-cardo-sign.png",
    "gtomb-2": "photos/oct27/garden-tomb-front.png",
}
FRAMES = {   # stills taken from Richard's films (the films themselves are no longer in the game)
    "mughrabi-4": ("video/tm-arrive.mp4", 67.7),
    "robinson-1": ("video/robinson.mp4", 7.1),
    "robinson-2": ("video/robinson.mp4", 49.5),
    "robinson-3": ("video/robinson.mp4", 77.8),
    "tm-north-walk": ("video/tm-spirits.mp4", 11.9),
}


def crop_bars(im, dark=30):
    """Screenshots of photos carry black bars above and below; cut them off."""
    g = im.convert("L")
    w, h = g.size
    rows = [ImageStat.Stat(g.crop((0, y, w, y + 1))).median[0] for y in range(h)]   # median: ignores the white home-bar line
    top = next((y for y in range(h) if rows[y] > dark), 0)
    bot = next((y for y in range(h - 1, -1, -1) if rows[y] > dark), h - 1)
    return im.crop((0, top, w, bot + 1)) if bot - top > h * 0.3 else im


def touch(im):
    """The light colour touch: a little warmth, contrast and colour, the same for every stop."""
    im = ImageEnhance.Contrast(im).enhance(1.05)
    im = ImageEnhance.Color(im).enhance(1.06)
    r, g, b = im.split()
    r = r.point(lambda v: min(255, int(v * 1.025)))
    b = b.point(lambda v: int(v * 0.965))
    return Image.merge("RGB", (r, g, b))


def finish(im, name):
    im = crop_bars(im.convert("RGB"))
    im.thumbnail((1200, 1200), Image.LANCZOS)
    im = touch(im)
    im.save(os.path.join(OUT, name + ".jpg"), quality=82, optimize=True, progressive=True)
    return im.size


def main():
    os.makedirs(OUT, exist_ok=True)
    for name, rel in PHOTOS.items():
        box = None
        if isinstance(rel, tuple): rel, box = rel
        im = Image.open(os.path.join(SRC, rel))
        if box: im = im.convert("RGB").crop(box)
        print(name, finish(im, name))
    with tempfile.TemporaryDirectory() as tmp:
        for name, (film, t) in FRAMES.items():
            f = os.path.join(tmp, name + ".png")
            subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", str(t), "-i", os.path.join(SRC, film), "-frames:v", "1", f], check=True)
            print(name, finish(Image.open(f), name))


if __name__ == "__main__":
    main()
