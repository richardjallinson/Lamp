#!/usr/bin/env python3
"""Episode 1 (The Jerusalem Mystery), walking version: prepares Richard's photos for the game.

Originals stay untouched in images/originals/fsy/ (photos, and his films in video/).
The game copies go to app/www/img/fsy/w/: black screenshot bars cropped, resized (1200 px on the long side),
a light matching colour touch (Richard, Oct 27) and JPEG quality 82.

Add a photo: put the original in images/originals/fsy/photos/..., add a line to PHOTOS below
(game name -> original), and run:  python3 app/tools/make_fsy_walk_assets.py
A still from one of his films: add a line to FRAMES (game name -> film, seconds)."""
import os, subprocess, tempfile
from PIL import Image, ImageEnhance, ImageStat, ImageFilter

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
    "market-stall": "photos/oct27/market-ice-cream-stall.png",
    "robinson-wide": "photos/oct27/robinsons-arch-area-wide.png",
    "robinson-above": "photos/oct27/fallen-stones-from-above.png",
    "robinson-wall": ("photos/oct27/robinsons-arch-wall-video-still.png", (0, 463, 1125, 1778)),
    "robinson-springer": "photos/oct27/robinsons-arch-springer.png",
    "mughrabi-0": "photos/oct27/fallen-stones-and-mughrabi-ramp.png",
    "dung-gate": ("photos/oct27/dung-gate.png", (0, 469, 1125, 1960)),
    "mughrabi-security": "photos/oct27/mughrabi-security.png",
    "mughrabi-benches": "photos/oct27/mughrabi-covered-benches.png",
    "mughrabi-down": ("photos/oct27/western-wall-from-mughrabi-video-still.png", (0, 335, 1125, 1814)),
    "mughrabi-open": ("photos/oct27/mughrabi-open-ramp.png", (0, 219, 1125, 2050)),
    "mughrabi-near": ("photos/oct27/mughrabi-ramp-near-gate.png", (0, 219, 1125, 2050)),
    "tunnel-1": "photos/oct27/tunnel-passage-1.png",
    "tunnel-2": "photos/oct27/tunnel-passage-master-course.png",
    "tunnel-great": "photos/oct27/tunnel-great-stone-notes.png",
    "tunnel-warren": "photos/oct27/warrens-gate-sign.png",
    "tunnel-prayer": "photos/oct27/tunnel-woman-praying-opposite-holy-of-holies.png",
    "tunnel-plaque": "photos/oct27/tunnel-plaque-opposite-holy-of-holies.png",
    "tunnel-stairs": "photos/oct27/tunnel-stairs.png",
    "cod-ruins": "photos/oct27/city-of-david-ruins-and-tower.png",
    "cod-tower": "photos/oct27/hasmonean-tower.png",
    "cod-tower-sign": "photos/oct27/hasmonean-tower-sign.png",
    "cod-ark-sign": "photos/oct27/parker-expedition-ark-sign.png",
    "cod-descent": "photos/oct27/stairs-down-to-water-system.png",
    "cod-shaft-sign": "photos/oct27/warrens-shaft-sign.png",
    "cod-shaft": "photos/oct27/warrens-shaft-blue.png",
    "gihon-sign": "photos/oct27/gihon-spring-sign.png",
    "gihon-canaanite": "photos/oct27/canaanite-channel.png",
    "dung-inner": "photos/oct27/dung-gate-from-inside.png",
    "dung-exit": "photos/oct27/western-wall-exit-plaza.png",
    "wall-ramp": "photos/oct27/western-wall-plaza-mughrabi-ramp.png",
    "wall-gold": "photos/oct27/western-wall-golden-menorah.png",
    "wall-mens": "photos/oct27/western-wall-mens-section.png",
    "wall-womens": "photos/oct27/western-wall-womens-section.png",
    "wall-arch": "photos/oct27/western-wall-and-wilsons-arch.png",
    "wilson-door": "photos/oct27/wilsons-arch-entrance-close.png",
    "mughrabi-under": "photos/oct27/mughrabi-bridge-from-below.png",
    "ramparts-minaret": "photos/oct27/tower-of-david-minaret.png",
    "tombs-niche-2": "photos/oct27/tombs-prophets-niche-notes.png",
    "tombs-niche-3": "photos/oct27/tombs-prophets-niche-dark.png",
    "tombs-light": ("photos/oct27/tombs-prophets-stairs-to-light.png", (0, 219, 1125, 2050)),
    "olives-cemetery": "photos/oct27/mount-of-olives-view-cemetery.png",
    "market-deeper": "photos/oct27/market-lane-sweets.png",
    "market-bread": "photos/oct27/market-lane-bread.png",
    "market-coffee": "photos/oct27/market-coffee-beans.png",
    "market-spice": "photos/oct27/market-spice-stall.png",
    "market-kaldron": "photos/oct27/market-lane-bakery.png",
    "market-fish": ("photos/oct27/market-fish-counter.png", (0, 1420, 1125, 1880)),   # the counter only, shopkeeper left out
    "siloam-pool": ("photos/oct27/siloam-pool-steps.png", None, [(395, 1085, 535, 1330)]),   # person in the pool blurred
    "siloam-sign": "photos/oct27/siloam-pool-sign.png",
    "siloam-water": "photos/hezekiah/tunnel-exit-pool-columns.png",
    "synagogue-doors": "photos/oct27/great-synagogue-doors.png",
    "synagogue": "photos/oct27/great-synagogue.png",
    "jewish-hurva": "photos/oct27/hurva-golden-menorah.png",
    "model-temple": ("photos/oct27/second-temple-model-NOT-RICHARDS-check.png", (222, 0, 2176, 1125)),
    # Hebron, the Cave of the Patriarchs
    "hebron-building": "photos/hebron/herodian-building.png",
    "hebron-sign": "photos/hebron/welcome-sign.png",
    "hebron-pit": "photos/hebron/opening-in-the-rock-adam-and-eve.png",
    "hebron-hall": "photos/hebron/jewish-section-hall.png",
    "hebron-abraham": "photos/hebron/tomb-monument-abraham.png",
    "hebron-jacob": "photos/hebron/tomb-monument-jacob.png",
    "hebron-arnon": "photos/hebron/entering-the-cave-sign-noam-arnon.png",
    # the Kidron Valley and the Eastern Gate from outside
    "egate-gate": "photos/kidron/eastern-gate-from-the-valley.png",
    "dung-road": "photos/kidron/path-where-we-met-moses.png",
    "kidron-wide": "photos/kidron/bnei-hezir-and-zechariah-wide.png",
    "kidron-absalom": "photos/kidron/absaloms-pillar.png",
    "kidron-zechariah": ("photos/kidron/zechariah-tomb-with-richard.png", (0, 469, 1125, 1480)),   # Richard cropped out below
    "kidron-sign": "photos/kidron/zechariah-tomb-sign.png",
    "gethsemane-path": "photos/gethsemane/garden-path.png",
    "gethsemane-wide": "photos/gethsemane/garden-wide.png",
    "gethsemane-oldtree": "photos/gethsemane/ancient-olive-caged.png",
    "gethsemane-sign": "photos/gethsemane/hortus-gethsemani-sign.png",
    "gethsemane-trees": "photos/gethsemane/garden-old-trees.png",
    "gethsemane-ancient": "photos/gethsemane/ancient-olive-church-domes.png",
    "gethsemane-gate": "photos/gethsemane/eastern-gate-from-gethsemane.png",
    "gihon-pool": "photos/hezekiah/canaanite-pool.png",
    "gihon-pool-sign": "photos/hezekiah/canaanite-pool-sign.png",
    "hezekiah-tunnel": "photos/hezekiah/tunnel-dark.png",
    "hezekiah-water": "photos/hezekiah/foot-in-the-water.png",
    "zion-door": "photos/oct27b/david-tomb-arch.png",
    "zion-tomb": "photos/oct27b/david-tomb-cenotaph.png",
    "zion-sign": "photos/oct27b/david-tomb-sign.png",
    "cod-entrance": "photos/oct27b/water-systems-sign.png",
    "jewish-spices": ("photos/oct27b/jewish-quarter-spices.png", (0, 1150, 1125, 2000)),   # the bowls only, people left out
    "jewish-bagel": ("photos/oct27b/holy-bagel.png", None, [(785, 1170, 965, 1575)]),   # Richard's wife blurred
    "caiaphas-above": "photos/caiaphas/pit-from-above-crosses.png",
    "caiaphas-mosaic": "photos/caiaphas/mosaic-lowest-pit.png",
    "caiaphas-sign": "photos/caiaphas/sacred-pit-sign.png",
    "caiaphas-pit": "photos/caiaphas/pit-floor.png",
    "caiaphas-up": "photos/caiaphas/pit-looking-up.png",
    "wallagain-road": "photos/garden-tomb/tile-sign.png",
    "gtomb-garden": "photos/garden-tomb/tomb-and-garden.png",
    "gtomb-skullsign": ("photos/garden-tomb/skull-hill-sign.png", None, [(780, 1050, 925, 1500)]),   # passers-by blurred
    "gtomb-skull": "photos/garden-tomb/skull-hill.png",
    "gtomb-john19a": "photos/garden-tomb/plaque-john-19-16.png",
    "gtomb-john19b": "photos/garden-tomb/plaque-john-19-40.png",
    "gtomb-inside": "photos/garden-tomb/inside-burial-place.png",
    "gtomb-cross": "photos/garden-tomb/inside-cross-alpha-omega.png",
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
        box, blurs = None, ()
        if isinstance(rel, tuple): rel, box, *more = rel; blurs = more[0] if more else ()
        im = Image.open(os.path.join(SRC, rel)).convert("RGB")
        for b in blurs:   # hide a person: blur that patch heavily (boxes in original pixels)
            im.paste(im.crop(b).filter(ImageFilter.GaussianBlur(28)), b[:2])
        if box: im = im.crop(box)
        print(name, finish(im, name))
    with tempfile.TemporaryDirectory() as tmp:
        for name, (film, t) in FRAMES.items():
            f = os.path.join(tmp, name + ".png")
            subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", str(t), "-i", os.path.join(SRC, film), "-frames:v", "1", f], check=True)
            print(name, finish(Image.open(f), name))


if __name__ == "__main__":
    main()
