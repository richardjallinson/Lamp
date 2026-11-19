"""Facebook trailer for Lamp: The Final Seven Years. 1080x1350 (4:5), 30 fps, 42 s.
One encoded file per scene, joined with the concat demuxer; sound added last. Run: python3 build.py [scene numbers to redo]"""
import os, subprocess, sys
from PIL import Image, ImageDraw, ImageFont, ImageFilter
R = "/home/claude/lamp/repo/"; T = "/home/claude/lamp/trailer/"; W, H, FPS = 1080, 1350, 30
V = R + "images/originals/fsy/video/"; IW = R + "app/www/img/fsy/w/"; PZ = R + "images/originals/fsy/"
ENC = ["-c:v", "libx264", "-crf", "18", "-preset", "veryfast", "-pix_fmt", "yuv420p", "-r", str(FPS), "-an"]
SERIF = "/usr/share/fonts/opentype/noto/NotoSerifCJK-%s.ttc"
def font(sz, wt="Regular"): return ImageFont.truetype(SERIF % wt, sz)
GOLD, CREAM = (245, 196, 81), (246, 238, 216)

def spaced(d, xy, text, f, fill, sp):
    x, y = xy
    for ch in text: d.text((x, y), ch, font=f, fill=fill); x += d.textlength(ch, font=f) + sp
def swidth(d, text, f, sp): return sum(d.textlength(c, font=f) + sp for c in text) - sp

def caption(name, lines, size=58, y=None, small=None, scrim=True):
    """A caption in the lower third over a dark gradient."""
    im = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    if scrim:
        g = Image.new("L", (1, H), 0)
        for yy in range(H): g.putpixel((0, yy), int(215 * max(0, (yy - H * 0.52) / (H * 0.48)) ** 1.2))
        im.paste(Image.new("RGBA", (W, H), (6, 8, 18, 255)), (0, 0), g.resize((W, H)))
    d = ImageDraw.Draw(im); f = font(size, "SemiBold"); lh = int(size * 1.32)
    y0 = y if y is not None else H - 150 - lh * len(lines) - (50 if small else 0)
    for i, ln in enumerate(lines):
        w = d.textlength(ln, font=f)
        d.text(((W - w) / 2 + 2, y0 + i * lh + 3), ln, font=f, fill=(0, 0, 0, 170)); d.text(((W - w) / 2, y0 + i * lh), ln, font=f, fill=CREAM)
    if small:
        fs = font(30, "Medium"); w = swidth(d, small, fs, 5); spaced(d, ((W - w) / 2, y0 + lh * len(lines) + 18), small, fs, GOLD, 5)
    im.save(T + "txt/" + name + ".png"); return T + "txt/" + name + ".png"

def run(args):
    r = subprocess.run(["ffmpeg", "-v", "error", "-y"] + args, capture_output=True, text=True)
    if r.returncode: print(r.stderr[-800:]); sys.exit(1)

def finish(tmp, out): os.replace(tmp, out)

def overlay_chain(dur, fade_txt=True, fin=0, fout=0, dark=0):
    """filter tail: [v] base + [1] text png -> [o]"""
    f = "[v]" + ("eq=brightness=-%.2f," % dark if dark else "") + "format=yuv420p[b];"
    if fade_txt: f += "[1:v]format=rgba,loop=-1:1,trim=duration=%.3f,fade=in:st=0.15:d=0.35:alpha=1,fade=out:st=%.3f:d=0.3:alpha=1[t];" % (dur, dur - 0.35)
    else: f += "[1:v]format=rgba,loop=-1:1,trim=duration=%.3f[t];" % dur
    f += "[b][t]overlay=0:0:shortest=1"
    if fin: f += ",fade=in:st=0:d=%.2f" % fin
    if fout: f += ",fade=out:st=%.2f:d=%.2f" % (dur - fout, fout)
    return f + "[o]"

def clip(n, src, ss, dur, x, txt, **kw):
    out = T + "sc/%02d.mp4" % n; tmp = T + "sc/tmp%02d.mp4" % n
    vf = "[0:v]crop=576:720:%d:0,scale=%d:%d:flags=lanczos,fps=%d,trim=duration=%.3f,setpts=PTS-STARTPTS[v];" % (x, W, H, FPS, dur)
    run(["-ss", str(ss), "-i", V + src + ".mp4", "-i", txt, "-filter_complex", vf + overlay_chain(dur, **kw), "-map", "[o]", "-t", "%.3f" % dur] + ENC + [tmp]); finish(tmp, out)

def still(n, path, dur, txt, z0=1.0, z1=1.08, focus=(0.5, 0.5), **kw):
    """A slow push on a picture. The picture is first fitted to a 2x canvas so the zoom is smooth."""
    out = T + "sc/%02d.mp4" % n; tmp = T + "sc/tmp%02d.mp4" % n
    im = Image.open(path).convert("RGB"); r = max(2 * W / im.width, 2 * H / im.height)
    im = im.resize((round(im.width * r), round(im.height * r)), Image.LANCZOS)
    l = int((im.width - 2 * W) * focus[0]); t = int((im.height - 2 * H) * focus[1]); im = im.crop((l, t, l + 2 * W, t + 2 * H))
    p = T + "sc/still%02d.jpg" % n; im.save(p, quality=93); fr = round(dur * FPS)
    vf = "[0:v]zoompan=z='%f+(%f-%f)*on/%d':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=%d:s=%dx%d:fps=%d,trim=duration=%.3f,setpts=PTS-STARTPTS[v];" % (z0, z1, z0, fr, fr, W, H, FPS, dur)
    run(["-i", p, "-i", txt, "-filter_complex", vf + overlay_chain(dur, **kw), "-map", "[o]", "-t", "%.3f" % dur] + ENC + [tmp]); finish(tmp, out)

os.makedirs(T + "txt", exist_ok=True); os.makedirs(T + "sc", exist_ok=True)
only = set(int(a) for a in sys.argv[1:])
def want(n): return not only or n in only

# ---- text cards ----
c1 = caption("c1", ["An old brass clock.", "Almost out of time."])
c2 = caption("c2", ["A journal.", "The last pages torn out."])
c3 = caption("c3", ["A man in a grey coat", "who already knows your name."])
c4 = caption("c4", ["Go up to Jerusalem."])
c5 = caption("c5", ["Walk the real city."])
c6 = caption("c6", ["Find what the", "old watchman hid."])
c7 = caption("c7", ["Measure. Count.", "Test every page."])
c8 = caption("c8", ["“You know where.", "This is when.”"], size=66)
c10 = caption("c10", ["Five questions.", "Seventeen days.", "One signature."], size=60)
c11 = caption("c11", ["“And he shall confirm", "the covenant with many", "for one week.”"], size=58, small="DANIEL 9:27")

def title_card():
    im = Image.new("RGBA", (W, H), (0, 0, 0, 0)); d = ImageDraw.Draw(im)
    g = Image.new("L", (1, H), 0)
    for yy in range(H): g.putpixel((0, yy), int(235 * max(0, (yy - H * 0.48) / (H * 0.40)) ** 1.0) if yy < H * 0.88 else 235)
    im.paste(Image.new("RGBA", (W, H), (4, 6, 14, 255)), (0, 0), g.resize((W, H)))
    f0 = font(40, "Medium"); w = swidth(d, "LAMP", f0, 22); spaced(d, ((W - w) / 2, 900), "LAMP", f0, GOLD, 22)
    f1 = font(98, "Bold")
    for i, ln in enumerate(["THE FINAL", "SEVEN YEARS"]):
        w = swidth(d, ln, f1, 4); spaced(d, ((W - w) / 2 + 3, 968 + i * 118 + 4), ln, f1, (0, 0, 0, 180), 4); spaced(d, ((W - w) / 2, 968 + i * 118), ln, f1, CREAM, 4)
    f2 = font(38, "Medium"); t = "A prophecy mystery in Jerusalem"; w = d.textlength(t, font=f2); d.text(((W - w) / 2, 1226), t, font=f2, fill=GOLD)
    im.save(T + "txt/title.png"); return T + "txt/title.png"
ct = title_card()

def end_card():
    im = Image.new("RGB", (W, H), (7, 10, 22)); d = ImageDraw.Draw(im)
    glow = Image.new("RGB", (W, H), (7, 10, 22)); gd = ImageDraw.Draw(glow); gd.ellipse([190, 110, 890, 810], fill=(70, 48, 14)); glow = glow.filter(ImageFilter.GaussianBlur(150)); im = glow; d = ImageDraw.Draw(im)
    ic = Image.open(R + "app/Lamp/Assets.xcassets/AppIcon.appiconset/AppIcon-1024.png").convert("RGB").resize((420, 420), Image.LANCZOS)
    m = Image.new("L", (420, 420), 0); ImageDraw.Draw(m).rounded_rectangle([0, 0, 419, 419], 94, fill=255); im.paste(ic, (330, 210), m)
    f0 = font(42, "Medium"); w = swidth(d, "LAMP", f0, 24); spaced(d, ((W - w) / 2, 700), "LAMP", f0, GOLD, 24)
    f1 = font(84, "Bold")
    for i, ln in enumerate(["THE FINAL", "SEVEN YEARS"]): w = swidth(d, ln, f1, 4); spaced(d, ((W - w) / 2, 770 + i * 104), ln, f1, CREAM, 4)
    f2 = font(36, "Medium"); t = "A prophecy mystery in Jerusalem"; w = d.textlength(t, font=f2); d.text(((W - w) / 2, 1000), t, font=f2, fill=(214, 204, 178))
    d.line([(390, 1085), (690, 1085)], fill=(140, 110, 50), width=2)
    f3 = font(50, "SemiBold"); t = "Coming soon to the App Store"; w = d.textlength(t, font=f3); d.text(((W - w) / 2, 1118), t, font=f3, fill=GOLD)
    f4 = font(34, "Regular"); t = "Are you watching?"; w = d.textlength(t, font=f4); d.text(((W - w) / 2, 1206), t, font=f4, fill=(214, 204, 178))
    im.save(T + "txt/end.png"); return T + "txt/end.png"
ce = end_card()
blank = T + "txt/blank.png"; Image.new("RGBA", (W, H), (0, 0, 0, 0)).save(blank)

# ---- scenes: (start times) 0 3 6 9 12 15 18 21 | 24 29 33.2 37.5 -> 42 ----
if want(1): still(1, PZ + "e2-clock.png", 3.0, c1, 1.0, 1.10, fin=0.6)
if want(2): still(2, IW + "intro-desk.jpg", 3.0, c2, 1.08, 1.0, focus=(0.5, 0.7))
if want(3): clip(3, "haller-coffee", 2.5, 3.0, 352, c3)
if want(4): clip(4, "takeoff", 2.0, 3.0, 420, c4)
if want(5):
    still(51, IW + "jaffa-1.jpg", 1.0, c5, 1.0, 1.04, focus=(0.35, 0.5), fade_txt=False)
    still(52, IW + "chain-street.jpg", 1.0, c5, 1.04, 1.0, fade_txt=False)
    still(53, IW + "wall-plaza.jpg", 1.0, c5, 1.0, 1.04, focus=(0.5, 0.3), fade_txt=False)
if want(6): clip(6, "yoel-measure", 3.0, 3.0, 400, c6)
if want(7): clip(7, "watchmaker-loupe", 2.0, 3.0, 220, c7)
if want(8): clip(8, "gate-sun", 3.0, 3.0, 20, c8, dark=0.10, fout=0.5)
if want(9): clip(9, "lamp-1", 1.0, 5.0, 352, ct, fin=0.25)
if want(10):
    clip(101, "e2-act3/haller-grapes", 4.0, 0.7, 400, c10, fade_txt=False)
    clip(102, "e2-act3/dance", 3.0, 0.7, 352, c10, fade_txt=False)
    clip(103, "plate-drops", 3.5, 0.7, 330, c10, fade_txt=False)
    still(104, PZ + "e2-act4/benamiparcel.png", 0.7, c10, 1.0, 1.03, fade_txt=False)
    still(105, PZ + "e2-act4/e2-coin-back.png", 0.7, c10, 1.0, 1.05, fade_txt=False)
    still(106, PZ + "e2-act4/hallerlaugh.png", 0.7, c10, 1.0, 1.03, fade_txt=False)
if want(11): clip(11, "roof-sunset", 2.0, 4.3, 704, c11, dark=0.06)
if want(12):
    out = T + "sc/12.mp4"; tmp = T + "sc/tmp12.mp4"
    run(["-framerate", str(FPS), "-i", ce, "-vf", "format=yuv420p,loop=-1:1,trim=duration=4.5,fade=in:st=0:d=0.5,fade=out:st=3.9:d=0.6"] + ENC + [tmp]); finish(tmp, out)

order = ["01", "02", "03", "04", "51", "52", "53", "06", "07", "08", "09", "101", "102", "103", "104", "105", "106", "11", "12"]
open(T + "list.txt", "w").write("".join("file 'sc/%s.mp4'\n" % o for o in order))
run(["-f", "concat", "-safe", "0", "-i", T + "list.txt", "-c", "copy", T + "silent.mp4"])
# ---- sound: the song from 32.15 s, so its big entry (56.15 s) lands on the title at 24.0 s; Yoel's line in the breath before it ----
MUS = R + "audio/music/fsy-song.mp3"; VO = R + "app/www/audio/narration/fsy-e2-pro-1.mp3"
af = ("[1:a]atrim=32.15:74.15,asetpts=PTS-STARTPTS,afade=in:st=0:d=1.2,volume='if(between(t,20.6,24.0),0.5,1)':eval=frame,volume=0.9,afade=out:st=39.3:d=2.7[m];"
      "[2:a]atrim=0:3.3,asetpts=PTS-STARTPTS,afade=out:st=3.1:d=0.2,volume=1.25,adelay=20800|20800[v];[m][v]amix=inputs=2:duration=first:normalize=0,alimiter=limit=0.89[a]")   # no loudnorm: it flattens the build before the title
run(["-i", T + "silent.mp4", "-i", MUS, "-i", VO, "-filter_complex", af, "-map", "0:v", "-map", "[a]", "-c:v", "copy", "-c:a", "aac", "-b:a", "192k", "-ar", "48000", "-movflags", "+faststart", "-t", "42", T + "tmp-out.mp4"])
finish(T + "tmp-out.mp4", T + "Lamp-Trailer.mp4"); print("done")
