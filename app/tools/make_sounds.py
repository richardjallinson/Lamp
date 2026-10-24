#!/usr/bin/env python3
"""Make Lamp's sounds from scratch (original, royalty-free) and pack them for the web app.

  python3 app/tools/make_sounds.py

Writes app/sounds/*.wav (masters, not shipped), app/sounds/*.mp3 and app/www/js/sounds.js.
The sounds are embedded in sounds.js as base64 because a web view inside an iPhone app may
refuse to fetch() local files.

Palette: D major pentatonic (D E F# A B), harp plucks, soft bells, a warm hall reverb.
"""
import base64
import os
import subprocess
import wave

import numpy as np
from scipy.signal import fftconvolve, butter, lfilter

SR = 44100
APP = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(APP, "sounds")
rng = np.random.default_rng(119105)  # Psalm 119:105


def hz(note):
    names = {"C": 0, "C#": 1, "D": 2, "D#": 3, "E": 4, "F": 5, "F#": 6, "G": 7, "G#": 8, "A": 9, "A#": 10, "B": 11}
    name, octave = note[:-1], int(note[-1])
    return 440.0 * 2 ** ((names[name] + 12 * (octave + 1) - 69) / 12)


def silence(sec):
    return np.zeros(int(SR * sec))


def lowpass(x, cutoff, order=2):
    b, a = butter(order, cutoff / (SR / 2), "low")
    return lfilter(b, a, x)


def highpass(x, cutoff, order=2):
    b, a = butter(order, cutoff / (SR / 2), "high")
    return lfilter(b, a, x)


def pluck(freq, sec=1.6, bright=0.5, decay=0.996):
    """Harp-like plucked note built from exact harmonics (so the pitch is exact).
    Higher harmonics fade faster; a tiny noise click gives the pluck its attack.
    `decay` near 1 rings longer."""
    t = np.arange(int(SR * sec)) / SR
    ring = 0.35 + 6.0 * (decay - 0.98)            # seconds of ring for the fundamental
    x = np.zeros_like(t)
    for n in range(1, 11):
        if freq * n > 12000:
            break
        amp = (1.0 / n ** (1.6 - bright)) * (1 if n % 2 else 0.8)
        x += amp * np.sin(2 * np.pi * freq * n * t + rng.uniform(0, 6.28)) * np.exp(-t * n ** 0.7 / ring)
    click = rng.normal(0, 1, len(t)) * np.exp(-t / 0.004) * 0.15 * (0.5 + bright)
    x = x + lowpass(click, 4000)
    return x * np.minimum(1, t / 0.002)


def bell(freq, sec=2.5, bright=1.0):
    """Soft bell from inharmonic partials, each with its own decay."""
    t = np.arange(int(SR * sec)) / SR
    parts = [(1.0, 1.0, 1.6), (2.0, 0.55, 1.2), (2.76, 0.35, 0.9), (5.4, 0.18 * bright, 0.5), (8.93, 0.08 * bright, 0.3)]
    x = sum(a * np.sin(2 * np.pi * freq * r * t + rng.uniform(0, 6.28)) * np.exp(-t / d) for r, a, d in parts)
    return x * np.minimum(1, t / 0.004)


def noise_swell(sec, lo, hi, attack=0.3):
    n = int(SR * sec)
    t = np.arange(n) / SR
    x = highpass(lowpass(rng.normal(0, 1, n), hi), lo)
    env = np.minimum(t / attack, 1) * np.exp(-np.maximum(t - attack, 0) / (sec * 0.35))
    return x * env


def place(track, sound, at, gain=1.0):
    i = int(at * SR)
    need = i + len(sound)
    if need > len(track):
        track = np.concatenate([track, np.zeros(need - len(track))])
    track[i:need] += sound * gain
    return track


# A soft hall: exponentially decaying filtered noise used as an impulse response.
def make_ir(sec=2.2):
    n = int(SR * sec)
    t = np.arange(n) / SR
    ir = rng.normal(0, 1, n) * np.exp(-t / (sec / 5))
    ir = lowpass(ir, 6000)
    ir[: int(SR * 0.012)] = 0  # pre-delay
    return ir / np.sqrt(np.sum(ir ** 2))


IR = make_ir()


def finish(x, wet=0.22, tail=1.2, peak=0.8):
    x = np.concatenate([x, silence(tail)])
    rev = fftconvolve(x, IR)[: len(x)]
    y = (1 - wet) * x + wet * rev
    y = y / (np.max(np.abs(y)) + 1e-9) * peak
    fade = int(SR * 0.05)
    y[-fade:] *= np.linspace(1, 0, fade)
    return y


# ---------------------------------------------------------------- sound design
SCALE = ["D4", "E4", "F#4", "A4", "B4", "D5", "E5", "F#5"]
sounds = {}

# Letters: each letter added to a word plays the next note up.
for i, note in enumerate(SCALE[:7]):
    sounds[f"tap{i + 1}"] = finish(pluck(hz(note), 0.9, bright=0.35) * 0.9, wet=0.18, tail=0.5, peak=0.55)

# Word found: a quick upward strum (D F# A D).
s = silence(0.1)
for k, n in enumerate(["D4", "F#4", "A4", "D5"]):
    s = place(s, pluck(hz(n), 1.8, bright=0.5), 0.045 * k, 0.8)
s = place(s, bell(hz("D6"), 1.6, 0.6), 0.14, 0.12)
sounds["word"] = finish(s, wet=0.25, tail=0.9, peak=0.7)

# Bonus word: bright twin bell.
s = place(silence(0.1), bell(hz("A5"), 2.0), 0, 0.6)
s = place(s, bell(hz("E6"), 1.6, 0.7), 0.07, 0.35)
sounds["bonus"] = finish(s, wet=0.3, tail=0.8, peak=0.55)

# Wrong word: soft, low, muted two-note fall.
s = place(silence(0.1), lowpass(pluck(hz("A2"), 0.5, bright=0.1, decay=0.985), 600), 0, 1.0)
s = place(s, lowpass(pluck(hz("F#2"), 0.6, bright=0.1, decay=0.985), 600), 0.09, 0.9)
sounds["bad"] = finish(s, wet=0.12, tail=0.3, peak=0.45)

# Hint: airy sparkle.
s = noise_swell(0.7, 3000, 9000, 0.25) * 0.25
for k, n in enumerate(["B5", "D6", "F#6"]):
    s = place(s, bell(hz(n), 0.9, 0.5), 0.12 + 0.06 * k, 0.18)
sounds["hint"] = finish(s, wet=0.3, tail=0.6, peak=0.45)

# Shuffle: a soft whoosh.
sounds["shuffle"] = finish(noise_swell(0.45, 300, 2500, 0.18) * 0.8, wet=0.15, tail=0.3, peak=0.35)

# Level complete: harp chord bloom with a bell.
s = silence(0.1)
for k, n in enumerate(["D3", "A3", "D4", "F#4", "A4", "D5"]):
    s = place(s, pluck(hz(n), 2.6, bright=0.45, decay=0.998), 0.06 * k, 0.65)
s = place(s, bell(hz("A5"), 2.4, 0.6), 0.36, 0.22)
s = place(s, bell(hz("D6"), 2.4, 0.5), 0.5, 0.16)
sounds["level"] = finish(s, wet=0.3, tail=1.4, peak=0.75)

# Story complete: the lamp lights. Rising shimmer, harp glissando, bell chord.
s = noise_swell(1.6, 1500, 7000, 1.1) * 0.12
gl = ["D3", "F#3", "A3", "B3", "D4", "E4", "F#4", "A4", "B4", "D5", "E5", "F#5", "A5"]
for k, n in enumerate(gl):
    s = place(s, pluck(hz(n), 2.4, bright=0.5, decay=0.998), 0.25 + 0.055 * k, 0.5)
for k, n in enumerate(["D5", "F#5", "A5", "D6"]):
    s = place(s, bell(hz(n), 3.0, 0.6), 1.05 + 0.03 * k, 0.16)
sounds["story"] = finish(s, wet=0.35, tail=2.0, peak=0.8)

# Daily solved: three bells, like a small chime.
s = silence(0.1)
for k, n in enumerate(["A5", "F#5", "D6"]):
    s = place(s, bell(hz(n), 2.2, 0.7), 0.16 * k, 0.4)
sounds["daily"] = finish(s, wet=0.32, tail=1.2, peak=0.65)


# ---------------------------------------------------------------- ambient music (exactly periodic loop)
def music(loop=32.0, total=None):
    """Slow pad chords D - Bm - G - A, 8 s each. Every frequency (including the chorus wobble) is a
    whole number of cycles per loop, every envelope wraps around, and the soft noise bed is tiled,
    so the music repeats exactly: the loop is seamless from any starting point."""
    total = total or loop + 0.6
    n = int(SR * total)
    t = np.arange(n) / SR
    snap = lambda f: round(f * loop) / loop
    chords = [["D3", "A3", "D4", "F#4"], ["B2", "F#3", "B3", "D4"], ["G2", "D3", "G3", "B3"], ["A2", "E3", "A3", "C#4"]]
    seg = loop / len(chords)
    out = np.zeros(n)
    for ci, chord in enumerate(chords):
        centre = ci * seg + seg / 2
        d = (t - centre + loop / 2) % loop - loop / 2              # cyclic distance to the chord's centre
        env = np.clip(1 - (np.abs(d) - seg / 2 + 1.5) / 3.0, 0, 1)  # 3 s crossfades, wraps around
        env = env * env * (3 - 2 * env)
        for j, note in enumerate(chord):
            f = snap(hz(note))
            fm = snap(0.125 + 0.03 * j)
            ph = 2 * np.pi * f * t + 0.9 * np.sin(2 * np.pi * fm * t)   # gentle, periodic pitch wobble
            tone = np.sin(ph) + 0.25 * np.sin(2 * ph) + 0.08 * np.sin(3 * ph)
            out += tone * env * (0.9 - 0.12 * j)
    out = lowpass(np.tile(out[: int(SR * loop)], 3), 2200)[int(SR * loop): int(SR * loop) + n]  # filter cyclically
    bed = lowpass(rng.normal(0, 1, int(SR * loop)), 900)
    air = np.tile(bed, 2)[:n] * 0.02
    out = out + air
    out = out / np.max(np.abs(out)) * 0.5
    return out


def write_wav(path, x):
    y = np.int16(np.clip(x, -1, 1) * 32767)
    with wave.open(path, "wb") as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes(y.tobytes())


os.makedirs(OUT, exist_ok=True)
packed = {}
for name, x in list(sounds.items()) + [("music", music())]:
    wav, mp3 = os.path.join(OUT, name + ".wav"), os.path.join(OUT, name + ".mp3")
    write_wav(wav, x)
    rate = "80k" if name == "music" else "96k"
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", wav, "-ac", "1", "-b:a", rate, mp3], check=True)
    packed[name] = "data:audio/mpeg;base64," + base64.b64encode(open(mp3, "rb").read()).decode()
    print(f"{name:8s} {len(x) / SR:5.2f}s  {os.path.getsize(mp3) // 1024:4d} KB")

js = ("/* generated by app/tools/make_sounds.py: original Lamp sounds, mp3 as base64 */\n"
      "window.LAMP_SOUNDS=" + "{" + ",".join(f'"{k}":"{v}"' for k, v in packed.items()) + "};\n"
      "window.LAMP_MUSIC_LOOP={start:0.2,length:32.0};\n")
open(os.path.join(APP, "www", "js", "sounds.js"), "w").write(js)
print(f"sounds.js {len(js) // 1024} KB")
