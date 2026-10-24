#!/usr/bin/env python3
"""Build Lamp's family-safe bonus word list (3-7 letters) from a Hunspell en_US dictionary.

Usage: python3 build_wordlist.py /usr/share/hunspell/en_US.dic /usr/share/hunspell/en_US.aff ../data/blocklist.txt ../data/words.txt
"""
import re
import sys


def parse_aff(path):
    rules = {}  # flag -> (kind, cross, [(strip, add, cond_regex)])
    lines = open(path, encoding="utf-8", errors="replace").read().splitlines()
    i = 0
    while i < len(lines):
        parts = lines[i].split()
        if len(parts) == 4 and parts[0] in ("SFX", "PFX") and parts[3].isdigit():
            kind, flag, cross, n = parts[0], parts[1], parts[2] == "Y", int(parts[3])
            entries = []
            for j in range(1, n + 1):
                p = lines[i + j].split()
                strip = "" if p[2] == "0" else p[2]
                add = "" if p[3] == "0" else p[3].split("/")[0]
                cond = p[4] if len(p) > 4 else "."
                rx = re.compile((cond + "$") if kind == "SFX" else ("^" + cond))
                entries.append((strip, add, rx))
            rules[flag] = (kind, cross, entries)
            i += n + 1
        else:
            i += 1
    return rules


def expand(stem, flags, rules):
    out = {stem}
    sfx_forms, pfx = [], []
    for f in flags:
        if f not in rules:
            continue
        kind, cross, entries = rules[f]
        for strip, add, rx in entries:
            if kind == "SFX":
                if rx.search(stem) and (not strip or stem.endswith(strip)):
                    w = (stem[: len(stem) - len(strip)] if strip else stem) + add
                    out.add(w)
                    if cross:
                        sfx_forms.append(w)
            else:
                if rx.search(stem) and (not strip or stem.startswith(strip)):
                    out.add(add + stem[len(strip):])
                    if cross:
                        pfx.append((strip, add))
    for w in sfx_forms:
        for strip, add in pfx:
            if not strip or w.startswith(strip):
                out.add(add + w[len(strip):])
    return out


def main(dic, aff, blockfile, outfile):
    rules = parse_aff(aff)
    block = set()
    for line in open(blockfile, encoding="utf-8"):
        line = line.strip().lower()
        if line and not line.startswith("#"):
            block.add(line)
    words = set()
    for line in open(dic, encoding="utf-8", errors="replace").read().splitlines()[1:]:
        if not line or "/" not in line and not line.isalpha():
            continue
        stem, _, flags = line.partition("/")
        if not re.fullmatch(r"[a-z]+", stem):
            continue  # skip proper nouns, abbreviations, apostrophes
        for w in expand(stem, flags, rules):
            if re.fullmatch(r"[a-z]{3,7}", w) and re.search(r"[aeiouy]", w):
                words.add(w)
    # block exact words and simple inflections of blocked roots (root + s/es/ed/er/ers/ing/y/ie/ies)
    strong = ("fuck", "shit", "cunt", "nigg", "fagg", "whore", "slut", "dildo", "porn", "penis", "vagin", "twat", "wank")
    def blocked(w):
        if w in block or any(s in w for s in strong):
            return True
        for suf in ("s", "es", "ed", "er", "ers", "ing", "y", "ie", "ies", "d"):
            if w.endswith(suf) and w[: -len(suf)] in block:
                return True
        return False
    kept = sorted(w for w in words if not blocked(w))
    with open(outfile, "w", encoding="utf-8") as fh:
        fh.write("\n".join(kept) + "\n")
    print(f"{len(words)} candidate words, {len(words) - len(kept)} blocked, {len(kept)} kept -> {outfile}")


if __name__ == "__main__":
    main(*sys.argv[1:5])
