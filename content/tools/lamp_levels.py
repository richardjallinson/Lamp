#!/usr/bin/env python3
"""Lamp level generator and checker.

  python3 lamp_levels.py build                 # stories -> out/levels.json, out/picture-list.csv, out/story-list.md
  python3 lamp_levels.py check                 # automatic checks on out/levels.json
  python3 lamp_levels.py check --kjv FILE ...  # also verify every verse word-for-word against KJV source file(s)

Inputs (in ../data): stories-ot.txt, stories-nt.txt, words.txt, blocklist.txt
Only the Python standard library is used.
"""
import csv
import itertools
import json
import os
import random
import re
import sys
from collections import Counter

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
DATA = os.path.join(ROOT, "data")
OUT = os.path.join(ROOT, "out")

BOOKS = [
    "Genesis", "Exodus", "Leviticus", "Numbers", "Deuteronomy", "Joshua", "Judges", "Ruth",
    "1 Samuel", "2 Samuel", "1 Kings", "2 Kings", "1 Chronicles", "2 Chronicles", "Ezra",
    "Nehemiah", "Esther", "Job", "Psalms", "Proverbs", "Ecclesiastes", "Song of Solomon",
    "Isaiah", "Jeremiah", "Lamentations", "Ezekiel", "Daniel", "Hosea", "Joel", "Amos",
    "Obadiah", "Jonah", "Micah", "Nahum", "Habakkuk", "Zephaniah", "Haggai", "Zechariah",
    "Malachi", "Matthew", "Mark", "Luke", "John", "Acts", "Romans", "1 Corinthians",
    "2 Corinthians", "Galatians", "Ephesians", "Philippians", "Colossians", "1 Thessalonians",
    "2 Thessalonians", "1 Timothy", "2 Timothy", "Titus", "Philemon", "Hebrews", "James",
    "1 Peter", "2 Peter", "1 John", "2 John", "3 John", "Jude", "Revelation",
]
BOOK_INDEX = {b: i for i, b in enumerate(BOOKS)}
FREE_BOOKS = set(BOOKS[:5])  # pricing option A: Genesis-Deuteronomy free
SINGLE_CHAPTER = {"Obadiah", "Philemon", "2 John", "3 John", "Jude"}

STOP = set("""a an and are art as at be but by for from had hath have he her him his i if in is it
me my no nor not o of on or our shall shalt she so that the thee their them then there they thine
this thou thy to unto upon us was we were which who whom will with ye yet you your all also any
did do doth hast let may might own saith said say than these those what when whither""".split())

MAX_KEY_WORDS = 24     # longest stretch rebuilt "from memory"
LEVEL_TARGET = (1000, 1200)

# Difficulty by story position: (last story index in tier, max wheel, min wheel, hidden words per level 1/2/3)
TIERS = [
    (4, 5, 4, [1, 1, 2]),      # stories 1-5: tutorial pace
    (24, 5, 4, [1, 2, 2]),     # rest of the free Torah
    (74, 6, 5, [1, 2, 3]),
    (10_000, 7, 5, [2, 2, 3]),
]
TUTORIAL_TIPS = [
    "Tap the letters in order, then ✓. Or slide your finger across them.",
    "Real words that aren’t in the verse are bonus words. Each one earns a drop of lamp oil.",
    "Stuck? A hint reveals one letter and costs 1 oil.",
]
RECALL_TIP = "From memory: tap the words in the right order."


# ---------------------------------------------------------------- parsing
REF_RX = re.compile(r"^(.+?) (\d+):(\d+)$")
ALLOWED_TEXT = re.compile(r"^[A-Za-z ,;:.?!'()\-]+$")


def parse_ref(ref):
    m = REF_RX.match(ref.strip())
    if not m:
        raise ValueError(f"bad reference: {ref!r}")
    book, ch, vs = m.group(1), int(m.group(2)), int(m.group(3))
    if book not in BOOK_INDEX:
        raise ValueError(f"unknown book in {ref!r}")
    return book, ch, vs


def display_ref(ref):
    book, ch, vs = parse_ref(ref)
    if book == "Psalms":
        return f"Psalm {ch}:{vs}"
    if book in SINGLE_CHAPTER:
        return f"{book} {vs}" if False else f"{book} {ch}:{vs}"  # keep C:V for KJV consistency
    return ref


def load_stories():
    stories, cur = [], None
    for fname in ("stories-ot.txt", "stories-nt.txt"):
        for lineno, raw in enumerate(open(os.path.join(DATA, fname), encoding="utf-8"), 1):
            line = raw.rstrip("\n")
            where = f"{fname}:{lineno}"
            if not line.strip() or line.startswith("#"):
                continue
            if line.startswith("== "):
                sid, _, title = line[3:].partition("|")
                cur = {"id": sid.strip(), "title": title.strip(), "verses": [], "key": None,
                       "draw": "", "note": "", "recall": None, "must": [], "where": where}
                stories.append(cur)
            elif line.startswith("draw:"):
                cur["draw"] = line[5:].strip()
            elif line.startswith("note:"):
                cur["note"] = line[5:].strip()
            elif line.startswith("must:"):
                cur["must"] = [w.strip().upper() for w in line[5:].split(",") if w.strip()]
            elif line.startswith("recall:"):
                cur["recall"] = line[7:].strip()
            else:
                key = line.startswith("* ")
                body = line[2:] if key else line
                ref, sep, text = body.partition(" | ")
                if not sep:
                    raise SystemExit(f"{where}: cannot read line: {line!r}")
                parse_ref(ref)
                if key:
                    if cur["key"] is not None:
                        raise SystemExit(f"{where}: two key verses in story {cur['id']}")
                    cur["key"] = len(cur["verses"])
                cur["verses"].append({"ref": ref.strip(), "text": text.strip()})
    return stories


def tokens(text):
    return text.split()


def norm(tok):
    return re.sub(r"[^A-Za-z]", "", tok).upper()


def plain_word(tok):
    """The token's word if it is purely alphabetic once outer punctuation is removed, else None."""
    core = tok.strip(",;:.?!()")
    return core.upper() if re.fullmatch(r"[A-Za-z]+", core) else None


# ---------------------------------------------------------------- dictionary
def load_words():
    words = [w.strip().upper() for w in open(os.path.join(DATA, "words.txt"), encoding="utf-8") if w.strip()]
    block = set()
    for line in open(os.path.join(DATA, "blocklist.txt"), encoding="utf-8"):
        line = line.strip()
        if line and not line.startswith("#"):
            block.add(line.upper())
    return words, block


class Dictionary:
    def __init__(self, words):
        self.words = set(words)
        self.by_mask = {}
        for w in words:
            m = 0
            for ch in set(w):
                m |= 1 << (ord(ch) - 65)
            self.by_mask.setdefault(m, []).append((w, Counter(w)))

    def spellable_from(self, wheel):
        letters = sorted(set(wheel))
        wc = Counter(wheel)
        bits = [1 << (ord(c) - 65) for c in letters]
        found = []
        for r in range(1, len(bits) + 1):
            for combo in itertools.combinations(bits, r):
                m = sum(combo)
                for w, c in self.by_mask.get(m, ()):
                    if all(wc[k] >= v for k, v in c.items()):
                        found.append(w)
        return found


def can_spell(word, wheel):
    wc = Counter(wheel)
    return all(wc[k] >= v for k, v in Counter(word).items())


def union_letters(words):
    total = Counter()
    for w in words:
        for k, v in Counter(w).items():
            total[k] = max(total[k], v)
    return total


# ---------------------------------------------------------------- generation
def tier_for(index):
    for last, mx, mn, hides in TIERS:
        if index <= last:
            return mx, mn, hides
    return TIERS[-1][1:]


def levels_for_verse(n_words):
    if n_words <= 6:
        return 1
    if n_words <= 20:
        return 2
    return 3


HIDDEN_SO_FAR = Counter()  # how often each word has already been hidden across the game


MUST = set()        # words the current story insists on hiding (from "must:" lines)
STORY_USED = set()  # words already hidden earlier in the current story


def word_value(w):
    """Prefer longer, meaningful words, and words the player has not had to spell many times already."""
    if w in STORY_USED:
        return len(w) - 12
    if w in MUST:
        return 40
    return len(w) + (0 if w.lower() in STOP else 4) - 1.5 * min(HIDDEN_SO_FAR[w], 6)


def pick_hidden(cands, k, cap, dic, block):
    """Best set of k candidate words whose combined letters fit on a wheel of <= cap letters."""
    pool = sorted(cands, key=lambda w: -word_value(w))[:12]
    best = None
    for size in range(k, 0, -1):
        for combo in itertools.combinations(pool, size):
            wheel = union_letters(combo)
            n = sum(wheel.values())
            if n > cap:
                continue
            bonus = len([w for w in dic.spellable_from("".join(wheel.elements()))
                         if w not in combo and w not in block and len(w) >= 3])
            score = sum(word_value(w) for w in combo) - 0.8 * n + 0.15 * min(bonus, 15)
            if best is None or score > best[0]:
                best = (score, list(combo), wheel)
        if best:
            return best[1], best[2]
    return None, None


PAD_ORDER = "EAIORSTNLDUHGMPBCYW"


def pad_wheel(wheel, min_size, dic):
    wheel = Counter(wheel)
    while sum(wheel.values()) < min_size:
        best = None
        for ch in PAD_ORDER:
            trial = wheel + Counter(ch)
            n = len(dic.spellable_from("".join(trial.elements())))
            if best is None or n > best[0]:
                best = (n, ch)
        wheel[best[1]] += 1
    return wheel


def shuffle_wheel(wheel, hidden, seed):
    letters = list(wheel.elements())
    rng = random.Random(seed)
    for _ in range(200):
        rng.shuffle(letters)
        s = "".join(letters)
        if not any(h in s or h in s[::-1] for h in hidden if len(h) >= 3) and s != "".join(sorted(s)):
            return s
    return "".join(letters)


def pick_recall_start(toks, override=None):
    """Index of the first word to rebuild in the from-memory level."""
    if override:
        o = tokens(override)
        for s in range(len(toks) - len(o) + 1):
            if toks[s:s + len(o)] == o:
                return s
        raise ValueError(f"recall clause not found in key verse: {override!r}")
    if len(toks) <= MAX_KEY_WORDS:
        return 0
    starts = []
    for i, t in enumerate(toks[:-1]):
        if t[-1] in ",;:.?!":
            strength = {":": 3, ";": 3, ".": 4, "?": 4, "!": 4}.get(t[-1], 1)
            span = len(toks) - (i + 1)
            if 6 <= span <= MAX_KEY_WORDS:
                starts.append((strength, span, i + 1))
    if starts:
        starts.sort(key=lambda x: (-x[0], -x[1]))
        return starts[0][2]
    return len(toks) - MAX_KEY_WORDS


def build_level(verse_toks, used, k, cap, min_size, dic, block, seed):
    cands = []
    for t in verse_toks:
        w = plain_word(t)
        if w and 2 <= len(w) <= cap and w not in used and w not in block and w not in cands:
            cands.append(w)
    hidden, wheel = pick_hidden(cands, k, cap, dic, block)
    if not hidden:
        return None
    wheel = pad_wheel(wheel, min_size, dic)
    wheel_s = shuffle_wheel(wheel, hidden, seed)
    bonus = sorted({w for w in dic.spellable_from(wheel_s)
                    if len(w) >= 3 and w not in hidden and w not in block},
                   key=lambda w: (-len(w), w))
    return {"wheel": wheel_s, "hide": hidden, "bonus": bonus}


def build(args):
    stories = load_stories()
    words, block = load_words()
    dic = Dictionary(words)
    out_stories, total, daily = [], 0, []
    for si, st in enumerate(stories):
        cap, min_size, hides = tier_for(si)
        num = si + 1
        MUST.clear()
        MUST.update(st["must"])
        STORY_USED.clear()
        verses = []
        for v in st["verses"]:
            verses.append({"ref": v["ref"], "display": display_ref(v["ref"]), "text": v["text"],
                           "words": tokens(v["text"])})
        levels = []
        for vi, v in enumerate(verses):
            used = set()
            for j in range(levels_for_verse(len(v["words"]))):
                k = hides[min(j, len(hides) - 1)]
                lv = build_level(v["words"], used, k, cap, min_size, dic, block, f"{st['id']}-{vi}-{j}")
                if not lv:
                    break
                used.update(lv["hide"])
                HIDDEN_SO_FAR.update(lv["hide"])
                STORY_USED.update(lv["hide"])
                lv = {"v": vi, **lv}
                levels.append(lv)
        key = st["key"] if st["key"] is not None else 0
        start = pick_recall_start(verses[key]["words"], st["recall"])
        levels.append({"v": key, "recall": True, "from": start})
        for li, lv in enumerate(levels):
            lv["id"] = f"{st['id']}-{li + 1}"
        if si == 0:
            for li, tip in enumerate(TUTORIAL_TIPS):
                if li < len(levels) and not levels[li].get("recall"):
                    levels[li]["tip"] = tip
        hidden_all = {h for lv in levels for h in lv.get("hide", [])}
        for m in st["must"]:
            if m not in hidden_all:
                raise SystemExit(f"{st['id']}: must-hide word {m} could not be placed")
        first_recall = next(lv for lv in levels if lv.get("recall"))
        if si < 3:
            first_recall["tip"] = RECALL_TIP
        book = parse_ref(verses[0]["ref"])[0]
        out_stories.append({
            "n": num, "id": st["id"], "title": st["title"], "book": book,
            "free": book in FREE_BOOKS,
            "picture": f"lamp-{num:03d}-{st['id']}",
            "key": key, "verses": verses, "levels": levels, "note": st["note"], "draw": st["draw"],
        })
        total += len(levels)
        # one daily puzzle per verse: two hidden words, six-letter wheel
        for vi, v in enumerate(verses):
            lv = build_level(v["words"], set(), 2, 6, 5, dic, block, f"daily-{st['id']}-{vi}")
            if lv:
                daily.append({"ref": v["ref"], "display": v["display"], "text": v["text"],
                              "words": v["words"], "story": st["id"], **lv})
    random.Random(105).shuffle(daily)  # Psalm 119:105
    for i, d in enumerate(daily):
        d["id"] = f"daily-{i + 1:03d}"
    os.makedirs(OUT, exist_ok=True)
    data = {"format": 2, "translation": "KJV", "stories": out_stories, "daily": daily,
            "counts": {"stories": len(out_stories), "levels": total,
                       "verses": sum(len(s["verses"]) for s in out_stories), "daily": len(daily)}}
    with open(os.path.join(OUT, "levels.json"), "w", encoding="utf-8") as fh:
        json.dump(data, fh, ensure_ascii=False, indent=1)
    write_story_list(out_stories)
    write_picture_list(out_stories)
    print(json.dumps(data["counts"]))


# ---------------------------------------------------------------- outputs for people
PROMPT_STYLE = ("Style: classical oil painting with visible brushwork, in the tradition of 19th-century "
                "biblical landscape art; warm lamplight glow; limited palette of deep navy, midnight blue, "
                "warm gold and soft cream; gentle film grain; rich but not cluttered. Match the style of the "
                "attached reference image.")
PROMPT_COMPOSITION = ("Composition: tall vertical 9:16 phone format. Main light and detail in the upper "
                      "two-thirds. The bottom third is calm, dark and simple with low detail, so text and "
                      "buttons can sit on top of it.")
PROMPT_PEOPLE = ("People, if any, are small and seen from behind or as silhouettes; no visible faces. "
                 "Never show the face of Jesus or God.")
PROMPT_AVOID = ("Do not include: any text, letters, words, numbers, signatures, watermarks, borders, "
                "frames, modern objects, gore.")


def full_prompt(st):
    first = (f"A dramatic, reverent painting for the Bible story “{st['title']}” "
             f"({display_ref(st['verses'][st['key']]['ref'])}): {st['draw']}. Majestic, peaceful, awe-inspiring.")
    return "\n\n".join([first, PROMPT_STYLE, PROMPT_COMPOSITION, PROMPT_PEOPLE, PROMPT_AVOID])


def batch_of(st):
    if st["id"] == "noah":
        return "0 (test)"
    return str((st["n"] - 1) // 10 + 1)


def write_picture_list(stories):
    path = os.path.join(OUT, "picture-list.csv")
    with open(path, "w", newline="", encoding="utf-8") as fh:
        w = csv.writer(fh)
        w.writerow(["n", "batch", "file", "book", "story", "key verse", "what to draw", "status", "full prompt"])
        for st in stories:
            existing = st["draw"].startswith("EXISTING")
            w.writerow([st["n"], batch_of(st), st["picture"] + (".jpg" if st["id"] == "lamp" else ".png"),
                        st["book"], st["title"], display_ref(st["verses"][st["key"]]["ref"]),
                        st["draw"], "have" if existing else "to make", "" if existing else full_prompt(st)])


def write_story_list(stories):
    lines = ["# Lamp 1.0 — story and verse list (KJV)", ""]
    book = None
    for st in stories:
        if st["book"] != book:
            book = st["book"]
            lines += ["", f"## {book}" + ("  · free" if st["free"] else ""), ""]
        refs = ", ".join(("**" + v["display"] + "**") if i == st["key"] else v["display"]
                         for i, v in enumerate(st["verses"]))
        lines.append(f"{st['n']}. **{st['title']}** — {refs} · {len(st['levels'])} levels")
    with open(os.path.join(OUT, "story-list.md"), "w", encoding="utf-8") as fh:
        fh.write("\n".join(lines) + "\n")


# ---------------------------------------------------------------- KJV source loading
def canon_book(name):
    n = re.sub(r"[^a-z0-9]", "", name.lower())
    aliases = {"psalm": "psalms", "songofsongs": "songofsolomon", "canticles": "songofsolomon",
               "revelationofjohn": "revelation", "revelations": "revelation", "song": "songofsolomon"}
    n = aliases.get(n, n)
    roman = {"i": "1", "ii": "2", "iii": "3"}
    m = re.match(r"^(iii|ii|i)(samuel|kings|chronicles|corinthians|thessalonians|timothy|peter|john)$", n)
    if m:
        n = roman[m.group(1)] + m.group(2)
    for b in BOOKS:
        if re.sub(r"[^a-z0-9]", "", b.lower()) == n:
            return b
    return None


def load_kjv(path):
    """Return {(book, ch, vs): text}. Accepts: JSON as an array of 66 books with "chapters"
    (thiagobodruk), JSON {"books":[{"name","chapters":[{"chapter","verses":[{"verse","text"}]}]}]}
    (scrollmapper), JSON {Book:{ch:{vs:text}}}, CSV/TSV with book,chapter,verse,text columns,
    plain text lines "Book C:V text", or Project Gutenberg #10 (pg10.txt)."""
    raw = open(path, encoding="utf-8-sig", errors="replace").read()
    verses = {}
    if path.lower().endswith(".json"):
        data = json.loads(raw)
        if isinstance(data, list) and len(data) == 66 and "chapters" in data[0]:
            for bi, b in enumerate(data):
                for ci, ch in enumerate(b["chapters"]):
                    for vi, t in enumerate(ch):
                        verses[(BOOKS[bi], ci + 1, vi + 1)] = t
        elif isinstance(data, dict) and "books" in data:
            for b in data["books"]:
                book = canon_book(b["name"])
                for ch in b["chapters"]:
                    for v in ch["verses"]:
                        verses[(book, int(ch["chapter"]), int(v["verse"]))] = v["text"]
        elif isinstance(data, dict):
            for bname, chs in data.items():
                book = canon_book(bname)
                for c, vs in chs.items():
                    for v, t in vs.items():
                        verses[(book, int(c), int(v))] = t
        return verses
    if path.lower().endswith((".csv", ".tsv")):
        delim = "\t" if path.lower().endswith(".tsv") else ","
        rows = list(csv.reader(raw.splitlines(), delimiter=delim))
        head = [h.strip().lower() for h in rows[0]]
        def col(*names):
            for nm in names:
                if nm in head:
                    return head.index(nm)
            return None
        bi, ci, vi, ti = col("book", "b", "book_name"), col("chapter", "c"), col("verse", "v"), col("text", "t", "scripture")
        for r in rows[1:]:
            if len(r) <= max(bi, ci, vi, ti):
                continue
            b = r[bi].strip()
            book = BOOKS[int(b) - 1] if b.isdigit() else canon_book(b)
            verses[(book, int(r[ci]), int(r[vi]))] = r[ti]
        return verses
    if "Project Gutenberg" in raw[:3000] and "1:1 In the beginning" in raw:
        body = raw[raw.index("1:1 In the beginning"):]
        end = body.find("*** END OF")
        body = body[:end if end > 0 else None]
        book_i = -1
        for m in re.finditer(r"(?:^|\s)(\d+):(\d+)\s+(.*?)(?=\s\d+:\d+\s|\Z)", body, re.S):
            c, v = int(m.group(1)), int(m.group(2))
            if c == 1 and v == 1:
                book_i += 1
            text = re.sub(r"\s+", " ", m.group(3)).strip()
            text = re.split(r"\n\s*\n|\s{2,}(?:The|THE) (?:First|Second|Third|Fourth|Fifth|Book|Gospel|Epistle|Acts|Revelation|Lamentations|Proverbs|Ecclesiastes|Song)\b", m.group(3))[0]
            verses[(BOOKS[book_i], c, v)] = re.sub(r"\s+", " ", text).strip()
        return verses
    for line in raw.splitlines():
        m = re.match(r"^\s*(.+?)\s+(\d+):(\d+)\s+(.*)$", line)
        if m:
            book = canon_book(m.group(1))
            if book:
                verses[(book, int(m.group(2)), int(m.group(3)))] = m.group(4)
    return verses


def clean_source(t):
    t = re.sub(r"<[^>]+>", "", t)          # html/markup tags
    t = re.sub(r"[\[\]{}¶#]", "", t)   # italics brackets, pilcrows
    t = t.replace("’", "'").replace("‘", "'")
    return re.sub(r"\s+", " ", t).strip()


def compare(mine, theirs):
    if mine == theirs:
        return "exact", ""
    if mine.lower() == theirs.lower():
        return "case", ""
    strip = lambda s: re.sub(r"[^a-z ]", "", s.lower()).split()
    a, b = strip(mine), strip(theirs)
    if a == b:
        return "punctuation", f"source: {theirs}"
    import difflib
    diff = [d for d in difflib.ndiff(a, b) if d[0] in "+-"]
    return "WORDS", " ".join(diff)[:200] + f"  | source: {theirs}"


# ---------------------------------------------------------------- checks
def check(args):
    sources = []
    if "--kjv" in args:
        for p in args[args.index("--kjv") + 1:]:
            if p.startswith("--"):
                break
            sources.append((os.path.basename(p), load_kjv(p)))
    data = json.load(open(os.path.join(OUT, "levels.json"), encoding="utf-8"))
    words, block = load_words()
    dict_set = set(words)
    errors, warns, report = [], [], []
    E = lambda msg: errors.append(msg)
    W = lambda msg: warns.append(msg)
    stories = data["stories"]

    # story-level checks
    ids, pics, last = set(), set(), (-1, 0, 0)
    seen_refs = {}
    for st in stories:
        sid = st["id"]
        if sid in ids:
            E(f"{sid}: duplicate story id")
        ids.add(sid)
        if st["picture"] in pics:
            E(f"{sid}: duplicate picture name")
        pics.add(st["picture"])
        if not st["note"]:
            E(f"{sid}: missing 'Why it matters' note")
        if not st["draw"]:
            E(f"{sid}: missing picture description")
        if not (0 <= st["key"] < len(st["verses"])):
            E(f"{sid}: key verse index out of range")
        first = parse_ref(st["verses"][0]["ref"])
        pos = (BOOK_INDEX[first[0]], first[1], first[2])
        if pos < last:
            E(f"{sid}: story is out of Bible order")
        last = pos
        books = {parse_ref(v["ref"])[0] for v in st["verses"]}
        if len(books) > 1:
            E(f"{sid}: verses from more than one book")
        if st["free"] != (st["book"] in FREE_BOOKS):
            E(f"{sid}: free flag wrong")
        for v in st["verses"]:
            if v["ref"] in seen_refs:
                W(f"{sid}: {v['ref']} is also used in {seen_refs[v['ref']]}")
            seen_refs[v["ref"]] = sid
            if not ALLOWED_TEXT.match(v["text"]):
                bad = sorted(set(re.sub(r"[A-Za-z ,;:.?!'()\-]", "", v["text"])))
                E(f"{sid} {v['ref']}: unexpected characters {bad}")
            if v["words"] != tokens(v["text"]):
                E(f"{sid} {v['ref']}: word list does not match text")
            if "  " in v["text"] or v["text"] != v["text"].strip():
                E(f"{sid} {v['ref']}: stray spaces")
            if not re.search(r"[.,;:?!)]$", v["text"]):
                W(f"{sid} {v['ref']}: verse does not end with punctuation")
        covered = {lv["v"] for lv in st["levels"] if not lv.get("recall")}
        for vi, v in enumerate(st["verses"]):
            if vi not in covered:
                E(f"{sid} {v['ref']}: verse has no wheel level")
        recalls = [lv for lv in st["levels"] if lv.get("recall")]
        if len(recalls) != 1 or not st["levels"][-1].get("recall"):
            E(f"{sid}: story must end with exactly one from-memory level")

    # level checks
    def check_wheel_level(tag, lv, verse_words, cap):
        wheel = lv["wheel"]
        if not re.fullmatch(r"[A-Z]{3,7}", wheel):
            E(f"{tag}: wheel {wheel!r} must be 3-7 capital letters")
        if len(wheel) > cap:
            E(f"{tag}: wheel {wheel} longer than this stage allows ({cap})")
        verse_norm = {norm(t) for t in verse_words}
        if not lv["hide"]:
            E(f"{tag}: no hidden words")
        for h in lv["hide"]:
            if h not in verse_norm:
                E(f"{tag}: hidden word {h} is not in the verse")
            if not any(plain_word(t) == h for t in verse_words):
                E(f"{tag}: hidden word {h} only appears joined to an apostrophe or hyphen")
            if not can_spell(h, wheel):
                E(f"{tag}: hidden word {h} cannot be spelled from {wheel}")
            if h in block:
                E(f"{tag}: hidden word {h} is on the blocklist")
            if len(h) >= 3 and (h in wheel or h in wheel[::-1]):
                W(f"{tag}: wheel {wheel} spells {h} in order")
        if len(set(lv["hide"])) != len(lv["hide"]):
            E(f"{tag}: a hidden word is listed twice")
        for b in lv["bonus"]:
            if not can_spell(b, wheel):
                E(f"{tag}: bonus word {b} cannot be spelled from {wheel}")
            if b not in dict_set:
                E(f"{tag}: bonus word {b} is not in the word list")
            if b in block:
                E(f"{tag}: bonus word {b} is blocked")
            if b in lv["hide"]:
                E(f"{tag}: bonus word {b} is also a hidden word")

    n_levels = 0
    for si, st in enumerate(stories):
        cap = tier_for(si)[0]
        used_by_verse = {}
        for lv in st["levels"]:
            n_levels += 1
            tag = lv["id"]
            if not (0 <= lv["v"] < len(st["verses"])):
                E(f"{tag}: verse index out of range")
                continue
            vw = st["verses"][lv["v"]]["words"]
            if lv.get("recall"):
                span = len(vw) - lv["from"]
                if not (0 <= lv["from"] < len(vw)):
                    E(f"{tag}: from-memory start out of range")
                if span > MAX_KEY_WORDS + 4:
                    E(f"{tag}: from-memory part is {span} words (limit {MAX_KEY_WORDS + 4})")
                if span < 3:
                    W(f"{tag}: from-memory part is only {span} words")
                if lv["v"] != st["key"]:
                    E(f"{tag}: from-memory level is not on the key verse")
                continue
            check_wheel_level(tag, lv, vw, cap)
            prev = used_by_verse.setdefault(lv["v"], set())
            dup = prev & set(lv["hide"])
            if dup:
                E(f"{tag}: {sorted(dup)} already hidden in an earlier level of this verse")
            prev.update(lv["hide"])
    for d in data["daily"]:
        check_wheel_level(d["id"], d, d["words"], 6)
    lo, hi = LEVEL_TARGET
    if not lo <= n_levels <= hi:
        W(f"total levels {n_levels} is outside the 1.0 target {lo}-{hi}")
    missing = [b for b in BOOKS if b not in {s["book"] for s in stories}]
    if missing:
        W(f"books with no story: {', '.join(missing)}")

    # KJV verification
    verified = Counter()
    if sources:
        for st in stories:
            for v in st["verses"]:
                key = parse_ref(v["ref"])
                results = []
                for name, src in sources:
                    if key not in src:
                        E(f"{st['id']} {v['ref']}: reference not found in {name}")
                        results.append("missing")
                        continue
                    kind, detail = compare(v["text"], clean_source(src[key]))
                    results.append(kind)
                    if kind == "WORDS":
                        E(f"{st['id']} {v['ref']}: wording differs from {name}: {detail}")
                    elif kind in ("case", "punctuation"):
                        W(f"{st['id']} {v['ref']}: {kind} differs from {name} {detail}")
                verified[" / ".join(results)] += 1

    counts = data["counts"]
    report.append("# Lamp level check report\n")
    report.append(f"- Stories: {counts['stories']} · verses: {counts['verses']} · levels: {n_levels} "
                  f"· daily puzzles: {len(data['daily'])}")
    report.append(f"- Free (Genesis–Deuteronomy): {sum(1 for s in stories if s['free'])} stories, "
                  f"{sum(len(s['levels']) for s in stories if s['free'])} levels")
    report.append(f"- Books covered: {66 - len(missing)} of 66")
    if sources:
        report.append(f"- KJV verification against {', '.join(n for n, _ in sources)}: "
                      + ", ".join(f"{k}: {v}" for k, v in verified.most_common()))
    else:
        report.append("- **KJV text NOT yet verified** — run again with --kjv <file> (see README)")
    report.append(f"\n## Errors ({len(errors)})\n")
    report += [f"- {e}" for e in errors] or ["None."]
    report.append(f"\n## Warnings ({len(warns)})\n")
    report += [f"- {w}" for w in warns] or ["None."]
    with open(os.path.join(OUT, "check-report.md"), "w", encoding="utf-8") as fh:
        fh.write("\n".join(report) + "\n")
    print("\n".join(report[:6]))
    print(f"errors: {len(errors)}  warnings: {len(warns)}  (details in out/check-report.md)")
    return 1 if errors else 0


if __name__ == "__main__":
    cmd = sys.argv[1] if len(sys.argv) > 1 else "build"
    if cmd == "build":
        build(sys.argv[2:])
    elif cmd == "check":
        sys.exit(check(sys.argv[2:]))
    else:
        print(__doc__)
