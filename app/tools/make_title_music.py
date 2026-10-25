#!/usr/bin/env python3
"""Lamp start screen score, made from scratch (original, royalty-free).

  python3 app/tools/make_title_music.py      -> app/sounds/title.mp3 (17 s, first launch)
                                               and title-short.mp3 (8.4 s, later launches)

The full cue's opening is held 2 s longer than the timeline below so the verse can be read:
every time from 2.6 s on is 2 s later, and the hit lands at 8.6 s as the lamp enters the gate.
The short cue goes straight from the tap to a two-second rise and the hit at 2.0 s.

Timeline (matches the start screen):
  0.0 s  the tap: timpani boom, low string drone on D, sub rumble
  1.2 s  hushed choir, D minor
  2.6 s  the light spreads: strings swell B-flat major, then C major (4.6 s),
         timpani roll and cymbal swell building
  6.6 s  the New Jerusalem appears: full D major hit (brass, choir, strings, timpani, cymbal)
  then   rings out into a warm held D major chord and fades by 15 s
"""
import os
import subprocess
import wave

import numpy as np
from scipy.signal import butter, lfilter, fftconvolve

SR = 44100
DUR = N = T = None   # set per cue in make()
APP = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
rng = np.random.default_rng(2112)  # Revelation 21:2


def hz(note):
    names = {"C": 0, "C#": 1, "Db": 1, "D": 2, "D#": 3, "Eb": 3, "E": 4, "F": 5, "F#": 6, "Gb": 6, "G": 7,
             "G#": 8, "Ab": 8, "A": 9, "A#": 10, "Bb": 10, "B": 11}
    return 440.0 * 2 ** ((names[note[:-1]] + 12 * (int(note[-1]) + 1) - 69) / 12)


def lp(x, f, order=2):
    b, a = butter(order, min(f, SR / 2 - 100) / (SR / 2), "low"); return lfilter(b, a, x)


def hp(x, f, order=2):
    b, a = butter(order, f / (SR / 2), "high"); return lfilter(b, a, x)


def env(t0, attack, hold, release, curve=2.0):
    """Amplitude envelope: rise from t0 over `attack`, hold, then fall over `release` (seconds)."""
    e = np.zeros(N)
    a = np.clip((T - t0) / max(attack, 1e-3), 0, 1) ** curve
    r = np.clip(1 - (T - (t0 + attack + hold)) / max(release, 1e-3), 0, 1) ** 1.5
    e = np.where(T < t0 + attack + hold, a, r)
    e[T < t0] = 0
    return e


def saw(freq, bright=40, vib=0.0, detune=0.0):
    """Band-limited sawtooth (sum of harmonics), with slow vibrato."""
    f = freq * (1 + detune)
    ph = 2 * np.pi * f * T + (vib * np.sin(2 * np.pi * 5.2 * T + rng.uniform(0, 6)) if vib else 0)
    x = np.zeros(N)
    for k in range(1, bright + 1):
        if f * k > 9000:
            break
        x += np.sin(k * ph) / k
    return x


def strings(notes, e, bright_from=900, bright_to=3500):
    """String section: several detuned saws per note, filter opening as the swell grows."""
    x = np.zeros(N)
    for n in notes:
        for d in (-0.004, 0.0, 0.0045):
            x += saw(hz(n), 30, vib=0.6, detune=d)
    dark, bright = lp(x, bright_from), lp(x, bright_to)
    return (dark * (1 - e) + bright * e) * e


def choir(notes, e):
    """'Aah' choir: harmonic tones shaped by vowel formants, gentle vibrato."""
    x = np.zeros(N)
    formants = [(700, 1.0, 130), (1220, 0.5, 120), (2600, 0.25, 160)]
    for n in notes:
        f0 = hz(n)
        for d in (-0.003, 0.003):
            ph = 2 * np.pi * f0 * (1 + d) * T + 0.9 * np.sin(2 * np.pi * 4.8 * T + rng.uniform(0, 6))
            for k in range(1, 30):
                fk = f0 * k
                if fk > 5000:
                    break
                g = sum(a * np.exp(-((fk - F) / bw) ** 2 / 2) for F, a, bw in formants) + 0.02
                x += g * np.sin(k * ph) / np.sqrt(k)
    return lp(x, 4500) * e


def brass(notes, t0):
    """Brass stab: bright saws with a fast attack that swells then settles."""
    e = env(t0, 0.06, 0.5, 6.5)
    swell = 1 + 0.35 * np.exp(-np.clip(T - t0, 0, None) / 0.25) * (T >= t0)
    x = np.zeros(N)
    for n in notes:
        for d in (-0.002, 0.002):
            x += saw(hz(n), 25, vib=0.25, detune=d)
    bright = lp(x, 900 + 3600 * np.exp(-np.clip(T - t0, 0, None) / 1.2).mean() * 2.5)
    return bright * e * swell


def timpani(t0, freq=hz("D2"), gain=1.0, decay=2.2):
    t = T - t0
    m = t >= 0
    tt = np.clip(t, 0, None)
    f = freq * (1 + 0.25 * np.exp(-tt / 0.05))
    ph = 2 * np.pi * np.cumsum(f) / SR
    body = (np.sin(ph) + 0.5 * np.sin(1.5 * ph) + 0.3 * np.sin(2 * ph)) * np.exp(-tt / decay)
    stick = lp(rng.normal(0, 1, N), 1800) * np.exp(-tt / 0.03) * np.clip(tt / 0.003, 0, 1) * 0.6
    return (body * np.clip(tt / 0.002, 0, 1) + stick) * m * gain


def roll(t0, t1, freq=hz("A1")):
    x = np.zeros(N)
    t = t0
    while t < t1:
        p = (t - t0) / (t1 - t0)
        x += timpani(t, freq, 0.12 + 0.55 * p ** 2, decay=0.9)
        t += 0.085 - 0.03 * p
    return x


def cymbal_swell(t0, t1):
    x = hp(rng.normal(0, 1, N), 4500)
    e = np.clip((T - t0) / (t1 - t0), 0, 1) ** 3
    e = np.where(T > t1, np.exp(-(T - t1) / 0.06), e)       # tails off under the crash
    return x * e * 0.5


def crash(t0):
    tt = np.clip(T - t0, 0, None)
    return hp(rng.normal(0, 1, N), 3500) * np.exp(-tt / 2.2) * np.clip(tt / 0.004, 0, 1) * (T >= t0) * 0.6


# ---------------------------------------------------------------- the cues
def full_cue(S=2.0):
    """The first-launch cue. S stretches the quiet opening so the verse can be read."""
    hit = 6.6 + S
    mix = np.zeros(N)
    mix += timpani(0.02, hz("D2"), 1.3, 3.0)
    mix += lp(rng.normal(0, 1, N), 90) * env(0.0, 1.5, 5.0 + S, 3.0) * 0.7                    # sub rumble
    mix += strings(["D2", "A2", "D3"], env(0.05, 2.4, 0.4 + S, 0.8), 500, 1400) * 0.32         # low drone
    mix += choir(["D4", "F4", "A4"], env(1.2, 1.8, S, 0.9)) * 0.10                              # hushed choir, D minor
    mix += strings(["Bb2", "F3", "Bb3", "D4", "F4"], env(2.5 + S, 1.6, 1.0, 0.9), 700, 2800) * 0.22   # the light spreads
    mix += choir(["D4", "F4", "Bb4"], env(2.6 + S, 1.5, 1.0, 0.9)) * 0.10
    mix += strings(["C3", "G3", "C4", "E4", "G4"], env(4.6 + S, 1.2, 0.75, 0.3), 900, 3600) * 0.27
    mix += choir(["E4", "G4", "C5"], env(4.6 + S, 1.2, 0.75, 0.3)) * 0.13
    mix += roll(4.9 + S, hit)
    mix += cymbal_swell(5.0 + S, hit + 0.02)
    return mix, hit, 0.6


def short_cue():
    """The quick cue for later launches: tap, a two-second rise, the hit as the lamp enters the gate."""
    hit = 2.0
    mix = np.zeros(N)
    mix += timpani(0.02, hz("D2"), 1.2, 2.5)
    mix += lp(rng.normal(0, 1, N), 90) * env(0.0, 0.6, 1.2, 1.0) * 0.6
    mix += strings(["D2", "A2", "D3"], env(0.05, 0.5, 0.6, 0.8), 500, 1400) * 0.3
    mix += strings(["C3", "G3", "C4", "E4", "G4"], env(0.35, 1.2, 0.4, 0.3), 900, 3600) * 0.27
    mix += choir(["E4", "G4", "C5"], env(0.35, 1.2, 0.4, 0.3)) * 0.13
    mix += roll(0.55, hit)
    mix += cymbal_swell(0.7, hit + 0.02)
    return mix, hit, 0.1


def finish(mix, hit, build_from):
    """The D major arrival, dynamics, hall reverb and fade (shared by both cues)."""
    mix += timpani(hit, hz("D2"), 1.6, 3.2) + timpani(hit, hz("A1"), 0.8, 3.0)
    mix += crash(hit)
    mix += brass(["D3", "A3", "D4", "F#4", "A4"], hit) * 0.20
    mix += strings(["D2", "A2", "D3", "F#3", "A3", "D4", "F#4", "A4", "D5"], env(hit - 0.05, 0.12, 2.5, 5.5), 2000, 5000) * 0.18
    mix += choir(["A3", "D4", "F#4", "A4", "D5"], env(hit, 0.3, 2.5, 5.5)) * 0.16
    mix += lp(rng.normal(0, 1, N), 70) * env(hit, 0.05, 0.6, 2.5) * 2.0                       # sub drop
    # dynamics: hold the opening back so the arrival at the gate lands hard
    build = np.where(T < hit - 0.05, 0.42 + 0.58 * np.clip((T - build_from) / (hit - 0.05 - build_from), 0, 1) ** 1.8, 1.0)
    boom_zone = np.exp(-np.clip(T, 0, None) / 0.9)                 # but keep the first boom strong
    mix = mix * np.maximum(build, boom_zone * 0.9)
    n_ir = int(SR * 3.6)
    t_ir = np.arange(n_ir) / SR
    ir = lp(rng.normal(0, 1, n_ir) * np.exp(-t_ir / 0.75), 5000)
    ir[: int(SR * 0.02)] = 0
    ir /= np.sqrt(np.sum(ir ** 2))
    wet = fftconvolve(mix, ir)[:N]
    out = 0.7 * mix + 0.45 * wet
    out = hp(out, 28)
    out = np.tanh(out / (np.percentile(np.abs(out), 99.9) * 0.9))     # gentle glue, no hard clipping
    out *= 0.89 / np.max(np.abs(out))
    fade = int(SR * 1.5)
    out[-fade:] *= np.linspace(1, 0, fade) ** 2
    out[: int(SR * 0.003)] *= np.linspace(0, 1, int(SR * 0.003))
    return out


def make(name, dur, cue):
    global DUR, N, T
    DUR, N = dur, int(SR * dur)
    T = np.arange(N) / SR
    out = finish(*cue())
    os.makedirs(os.path.join(APP, "sounds"), exist_ok=True)
    wav, mp3 = os.path.join(APP, "sounds", name + ".wav"), os.path.join(APP, "sounds", name + ".mp3")
    with wave.open(wav, "wb") as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes(np.int16(out * 32767).tobytes())
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", wav, "-ac", "1", "-b:a", "128k", mp3], check=True)
    print(name, DUR, "s", os.path.getsize(mp3) // 1024, "KB")


make("title", 17.0, full_cue)          # first launch: hit at 8.6 s
make("title-short", 8.4, short_cue)    # later launches: hit at 2.0 s

# The start screen loads these from js/intro-sounds.js (base64, like sounds.js, because a web view
# inside an iPhone app may refuse to fetch local files).
import base64  # noqa: E402
packed = {k: "data:audio/mpeg;base64," + base64.b64encode(open(os.path.join(APP, "sounds", f + ".mp3"), "rb").read()).decode()
          for k, f in (("full", "title"), ("quick", "title-short"))}
js = ("/* generated by app/tools/make_title_music.py: the start screen music, mp3 as base64 */\n"
      "window.LAMP_INTRO_SOUNDS=" + "{" + ",".join(f'"{k}":"{v}"' for k, v in packed.items()) + "};\n")
open(os.path.join(APP, "www", "js", "intro-sounds.js"), "w").write(js)
print(f"intro-sounds.js {len(js) // 1024} KB")
