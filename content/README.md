# Lamp content build

The story list, level generator and automatic checks for **Lamp: Bible Word Puzzle 1.0** (KJV, pricing option A).

## What's here

| Path | What it is |
|---|---|
| `data/stories-ot.txt`, `data/stories-nt.txt` | **The master list.** 149 stories with KJV verses, key verse (`*`), picture description and "Why it matters" note. Edit these, not the JSON. |
| `data/words.txt` | Family-safe bonus word list (36,775 words of 3–7 letters), built from the Hunspell en_US dictionary. |
| `data/blocklist.txt` | Words never accepted as hidden or bonus words. Add to it at any time and rebuild. |
| `tools/lamp_levels.py` | `build` generates the levels; `check` runs every automatic check. Standard Python 3, no installs. |
| `tools/build_wordlist.py` | Rebuilds `words.txt` from the dictionary and blocklist. |
| `tools/make_preview.py`, `tools/make_picture_page.py` | Build the two review pages in `../preview/`. |
| `out/levels.json` | **The app data**: stories, levels and 402 daily puzzles. |
| `out/story-list.md` | Readable list of all stories and verses. |
| `out/picture-list.csv` | One row per painting: file name, batch, what to draw, full prompt. |
| `out/check-report.md` | Result of the last check. |
| `../preview/lamp-preview.html` | The demo, running all 149 stories. Open it in Safari to play any level. |
| `../preview/lamp-pictures.html` | Picture list with copy-prompt buttons. |

## Numbers

149 stories · 402 verses · 1,181 levels · all 66 books · 402 daily puzzles.
Free part (Genesis–Deuteronomy): 20 stories, 166 levels.

## Commands

```
cd tools
python3 lamp_levels.py build                      # regenerate out/ from data/
python3 lamp_levels.py check                      # automatic checks
python3 lamp_levels.py check --kjv en_kjv.json pg10.txt   # also verify every verse against KJV files
python3 make_preview.py ../../demo/lamp-demo.html ../out/levels.json ../../preview/lamp-preview.html ../../images
python3 make_picture_page.py ../out/picture-list.csv ../../preview/lamp-pictures.html picture-page-template.html ../../images
```

## How a level is made

- Each verse gets 1–3 wheel levels (by length), then the story ends with **from memory** on the key verse. Long key verses are rebuilt from a natural break (a colon or semicolon), at most 24 words.
- Hidden words get harder by stage: stories 1–5 use wheels of 4–5 letters and 1–2 words; stories 6–25 up to 5 letters and 2 words; 26–75 up to 6 letters and 3 words; 76–149 up to 7 letters and 2–3 words.
- The generator prefers meaningful words, avoids hiding the same word twice in a story, and makes very common words (GOD, LORD, THE) less likely each time they are used.
- A `must:` line forces words to be hidden (Psalm 119 uses `must: LAMP, WORD, LIGHT`).
- The wheel is shuffled so it never spells a hidden word in order.
- `bonus` lists every real word on the wheel, so any real word a player finds earns oil.

## Crossword levels (prototype: Genesis)

`tools/lamp_crosswords.py` (run after `build`) writes `out/crosswords.json`: five Wordscapes-style crosswords per Genesis story, getting harder (wheels of 4, 5, 5, 6, 7 letters; 3 to 7 words). Every grid word is a dictionary word that appears in the KJV, preferring words from the story's own verses and chapters. Crosswords 3–5 have a gold word (the seed word); the last one uses the story's clue word for the puzzle that follows (`CLUES`). `app/tools/build_www.py` mixes them in: crossword, verse, crossword, verse… then "from memory", 10 levels per story.

## Automatic checks

Every hidden word is in its verse and spellable from the wheel · every bonus word is spellable, in the word list and not blocked · wheel sizes fit the stage · stories are in Bible order, one book each · every verse has a level and every story ends with one from-memory level · from-memory spans are within limits · no odd characters (curly quotes, stray spaces) in verse text · notes and picture descriptions present · total level count within 1,000–1,200 · all 66 books covered · with `--kjv`: every reference exists and every verse matches the source word for word (wording differences are errors; capitals and punctuation are warnings).

The checker was tested by planting 8 kinds of mistakes; it caught all 8.

## Still to do

- **KJV verification.** The verse text was typed from memory, because this workspace had no internet access. Run `check --kjv` with two independent KJV files before release (see the main instructions).
- **Common-word list for 1.2.** `bonus` accepts every dictionary word, including rare ones. The planned "find all bonus words" flame needs a shorter list of common words.
- **Format change from the demo.** A story now has `verses[]`, and each level has `v`, the index of its verse. A from-memory level also has `from`, the word where rebuilding starts. `make_preview.py` shows the small changes the demo code needs.
