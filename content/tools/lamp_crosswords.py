#!/usr/bin/env python3
"""Make the crossword levels for Lamp (the Wordscapes-style grid filled from the letter wheel).

  python3 content/tools/lamp_crosswords.py          (after lamp_levels.py build)

Reads  content/out/levels.json, content/data/kjv-gutenberg.txt, words.txt, blocklist.txt
Writes content/out/crosswords.json: for each story in CROSS_BOOKS, five crosswords that get harder.

Every word in a grid is a real word that appears in the KJV. The wheel is built from one "seed" word
taken from the story's own verses (or, failing that, from the story's chapters), and the grid prefers
words from those same verses. In crosswords 3–5 the seed is the gold word: its squares are lit gold.
The last crossword of a story can be given a clue word (CLUES) for the puzzle that follows.
"""
import json
import os
import random
import re
from collections import Counter

HERE = os.path.dirname(os.path.abspath(__file__))
DATA = os.path.join(HERE, "..", "data")
OUT = os.path.join(HERE, "..", "out")

CROSS_BOOKS = {"Genesis"}          # the prototype: Genesis first
# five crosswords per story: (wheel letters, words in the grid)
STEPS = [(4, 3), (5, 4), (5, 5), (6, 6), (7, 7)]
GOLD_FROM = 2                      # crosswords 3, 4 and 5 have a gold word
MAX_W, MAX_H = 9, 9
# the clue word on each story's last crossword: it helps with the puzzle that opens the next story
CLUES = {"creation": "SEVENTH", "eden": "RIVERS", "fall": "LIGHT", "noah": "WINDOW", "abram": "ALTAR",
         "provide": "BEHIND", "ladder": "PILLAR", "joseph": "FIFTH"}
COMMON = {"THE", "AND", "THAT", "SHALL", "UNTO", "FOR", "HIS", "HIM", "THEY", "THEM", "WITH", "WAS", "NOT", "THOU", "THEE",
          "THY", "YEA", "WHICH", "FROM", "HATH", "HAD", "WERE", "THIS", "THERE", "THEIR", "ALSO", "INTO", "UPON", "THEN"}


def load():
    words = {w.strip().upper() for w in open(os.path.join(DATA, "words.txt"), encoding="utf-8") if w.strip()}
    block = set()
    for line in open(os.path.join(DATA, "blocklist.txt"), encoding="utf-8"):
        line = line.strip()
        if line and not line.startswith("#"):
            block.add(line.upper())
    kjv = {}
    for line in open(os.path.join(DATA, "kjv-gutenberg.txt"), encoding="utf-8"):
        m = re.match(r"^((?:\d )?[A-Za-z ]+?) (\d+):(\d+) (.*)$", line.strip())
        if m:
            kjv[(m.group(1), int(m.group(2)), int(m.group(3)))] = m.group(4)
    freq = Counter()
    for t in kjv.values():
        freq.update(re.findall(r"[A-Z]+", t.upper()))
    return words, block, kjv, freq


def blocked(w, block):
    if w in block:
        return True
    for suf in ("S", "ES", "ED", "ER", "ING", "Y", "IES", "D"):
        if w.endswith(suf) and w[: -len(suf)] in block:
            return True
    return False


def spellable(word, wheel):
    wc = Counter(wheel)
    return all(wc[k] >= v for k, v in Counter(word).items())


# ---------------------------------------------------------------- grid layout
def layout(words, rnd, tries=500):
    """Place as many words as possible in a crossword (first word across). Returns (placed, w, h)."""
    best = None
    for _ in range(tries):
        order = [words[0]] + rnd.sample(words[1:], len(words) - 1)
        grid, dirs, placed = {}, {}, []

        def put(w, r, c, d):
            for i, ch in enumerate(w):
                p = (r + (i if d else 0), c + (0 if d else i))
                grid[p] = ch
                dirs.setdefault(p, set()).add(d)
            placed.append((w, r, c, d))

        def ok(w, r, c, d):
            dr, dc = (1, 0) if d else (0, 1)
            if grid.get((r - dr, c - dc)) or grid.get((r + dr * len(w), c + dc * len(w))):
                return False
            cross = 0
            for i, ch in enumerate(w):
                p = (r + dr * i, c + dc * i)
                g = grid.get(p)
                if g:
                    if g != ch or d in dirs[p]:   # a word may only cross another, never lie along it
                        return False
                    cross += 1
                else:   # a new square must not touch a neighbour alongside it
                    if grid.get((p[0] + dc, p[1] + dr)) or grid.get((p[0] - dc, p[1] - dr)):
                        return False
            return cross > 0

        put(order[0], 0, 0, 0)
        for w in order[1:]:
            opts = []
            for (pr, pc), g in list(grid.items()):
                for i, ch in enumerate(w):
                    if ch != g:
                        continue
                    for d in (0, 1):
                        r, c = (pr - i, pc) if d else (pr, pc - i)
                        if ok(w, r, c, d):
                            cells = list(grid) + [(r + (k if d else 0), c + (0 if d else k)) for k in range(len(w))]
                            rs, cs = [x[0] for x in cells], [x[1] for x in cells]
                            hh, ww = max(rs) - min(rs) + 1, max(cs) - min(cs) + 1
                            if ww <= MAX_W and hh <= MAX_H:
                                opts.append((ww * hh + abs(ww - hh) * 2 + rnd.random(), r, c, d))
            if opts:
                opts.sort()
                _, r, c, d = opts[0] if rnd.random() < 0.7 else rnd.choice(opts[: 3])
                put(w, r, c, d)
        rs, cs = [x[0] for x in grid], [x[1] for x in grid]
        h, w = max(rs) - min(rs) + 1, max(cs) - min(cs) + 1
        score = len(placed) * 100 - w * h - abs(w - h) * 3
        if not best or score > best[0]:
            best = (score, [(x[0], x[1] - min(rs), x[2] - min(cs), x[3]) for x in placed], w, h)
    return best[1], best[2], best[3]


# ---------------------------------------------------------------- one story
def story_words(st):
    return [re.sub(r"[^A-Za-z]", "", t).upper() for v in st["verses"] for t in v["words"]]


def chapter_words(st, kjv):
    out = []
    for v in st["verses"]:
        m = re.match(r"^((?:\d )?[A-Za-z ]+?) (\d+):", v["ref"])
        if not m:
            continue
        book, ch = m.group(1), int(m.group(2))
        for (b, c, _), t in kjv.items():
            if b == book and c == ch:
                out += re.findall(r"[A-Z]+", t.upper())
    return out


def candidates(wheel, dic, block, freq):
    """Every grid-worthy word on this wheel: a dictionary word of 3+ letters that appears in the KJV."""
    letters = set(wheel)
    out = []
    for w in dic:
        if 3 <= len(w) <= len(wheel) and set(w) <= letters and spellable(w, wheel) and freq[w] >= 2 and not blocked(w, block):
            out.append(w)
    return out


def make_story(st, dic, block, kjv, freq, rnd):
    own = story_words(st)
    ownset = set(own)
    chap = Counter(chapter_words(st, kjv))
    used_seeds, used_words, out = set(), Counter(), []
    for k, (n, want) in enumerate(STEPS):
        clue = CLUES.get(st["id"]) if k == len(STEPS) - 1 else None
        if clue:
            seeds = [clue]
        else:
            pool = [w for w in dict.fromkeys(own) if len(w) == n] + [w for w, _ in chap.most_common() if len(w) == n]
            seeds = [w for w in dict.fromkeys(pool) if w in dic and w not in used_seeds and w not in COMMON and not blocked(w, block) and freq[w] >= 2]
        best = None
        for seed in seeds[:40]:
            wheel = seed
            cands = candidates(wheel, dic, block, freq)
            if len(cands) < want and clue:   # a short clue word: add the letter that gives the most words
                extra = max("AEIORSTNLDH", key=lambda ch: len(candidates(wheel + ch, dic, block, freq)))
                wheel += extra
                cands = candidates(wheel, dic, block, freq)
            if len(cands) < want:
                continue
            def value(w):
                return (60 if w in ownset else 0) + (25 if chap[w] else 0) + min(freq[w], 400) / 40 + len(w) * 3 - used_words[w] * 40 - (30 if w in COMMON else 0)
            pick = [seed] + sorted([w for w in cands if w != seed], key=value, reverse=True)[: want + 4]
            placed, gw, gh = layout(pick[: want + 3] if len(pick) > want + 3 else pick, rnd)
            if len(placed) > want:   # keep the seed and the best words, drop the weakest extras
                keep = [p for p in placed if p[0] == seed] + sorted([p for p in placed if p[0] != seed], key=lambda p: value(p[0]), reverse=True)[: want - 1]
                placed, gw, gh = relayout([p[0] for p in keep], rnd)
            score = len(placed) * 10 + (8 if seed in ownset else 0) - (0 if len(placed) >= want else 50)
            if not best or score > best[0]:
                best = (score, seed, wheel, placed, gw, gh, cands)
            if len(placed) >= want and seed in ownset:
                break
        if not best:
            raise SystemExit(f"{st['id']}: no crossword for step {k + 1}")
        _, seed, wheel, placed, gw, gh, cands = best
        check_grid(st["id"], placed)
        used_seeds.add(seed)
        grid_words = [p[0] for p in placed]
        used_words.update(grid_words)
        letters = list(wheel)
        for _ in range(20):
            rnd.shuffle(letters)
            if not any("".join(letters).find(w) >= 0 for w in grid_words):
                break
        bonus = sorted({w for w in dic if 3 <= len(w) <= len(wheel) and spellable(w, wheel) and not blocked(w, block)} - set(grid_words), key=lambda w: (-len(w), w))
        out.append({"wheel": "".join(letters), "w": gw, "h": gh,
                    "words": [{"w": p[0], "r": p[1], "c": p[2], "d": p[3]} for p in placed],
                    "gold": seed if k >= GOLD_FROM else None, "clue": bool(clue), "bonus": bonus})
    return out


def check_grid(sid, placed):
    """Every word must be visible on its own: no word lies inside another, and every square is in a word."""
    seen = {}
    for w, r, c, d in placed:
        for i in range(len(w)):
            p = (r + (i if d else 0), c + (0 if d else i))
            if d in seen.get(p, set()):
                raise SystemExit(f"{sid}: {w} runs along another word")
            seen.setdefault(p, set()).add(d)
    # every row and column: each run of 2+ letters must be exactly one of the grid's words
    grid = {}
    for w, r, c, d in placed:
        for i, ch in enumerate(w):
            grid[(r + (i if d else 0), c + (0 if d else i))] = ch
    words = {(w, r, c, d) for w, r, c, d in placed}
    rows = max(p[0] for p in grid) + 1
    cols = max(p[1] for p in grid) + 1
    for d in (0, 1):
        for a in range(rows if d == 0 else cols):
            run, start = "", None
            for b in range((cols if d == 0 else rows) + 1):
                p = (a, b) if d == 0 else (b, a)
                ch = grid.get(p)
                if ch:
                    if not run:
                        start = p
                    run += ch
                    continue
                if len(run) >= 2 and (run, start[0], start[1], d) not in words:
                    raise SystemExit(f"{sid}: the grid shows {run}, which is not one of its words")
                run = ""


def relayout(words, rnd):
    return layout(words, rnd, 600)


def main():
    dic, block, kjv, freq = load()
    data = json.load(open(os.path.join(OUT, "levels.json"), encoding="utf-8"))
    rnd = random.Random(119105)
    result = {}
    for st in data["stories"]:
        if st["book"] not in CROSS_BOOKS:
            continue
        result[st["id"]] = make_story(st, dic, block, kjv, freq, rnd)
        print(st["id"], " · ".join(f"{len(x['wheel'])}:{len(x['words'])}w {x['w']}x{x['h']}{' gold ' + x['gold'] if x['gold'] else ''}" for x in result[st["id"]]))
        for x in result[st["id"]]:
            print("    ", x["wheel"], [y["w"] for y in x["words"]])
    json.dump(result, open(os.path.join(OUT, "crosswords.json"), "w", encoding="utf-8"), ensure_ascii=False, indent=0)


if __name__ == "__main__":
    main()
