# Lamp: Bible Word Puzzle

An iPhone word game where you rebuild Bible verses (KJV) from a letter wheel, level by level, until you can say them from memory. A painting lights up behind each story as you play.

*Thy word is a lamp unto my feet, and a light unto my path.* (Psalm 119:105)

## Folders

| Folder | What's in it |
|---|---|
| `docs/` | Project handoff: concept, market research, 1.0 scope, design, plan |
| `content/` | Story list (master files), level generator, checks and the generated app data (`content/out/levels.json`). See `content/README.md`. |
| `preview/` | `lamp-preview.html`: play all 149 stories · `lamp-pictures.html`: picture prompt list |
| `demo/` | The original playable demo |
| `images/` | Finished paintings, named `lamp-NNN-story` |
| `app/` | **Lamp 1.0**: the game (`app/www`) and the Xcode project (`app/Lamp.xcodeproj`). See `app/README.md`. |

## Status

- 149 stories, all 66 books, 402 verses, 1,181 levels, 402 daily puzzles.
- Verses checked against the Project Gutenberg KJV: 396 exact; 6 small differences to confirm against a second source.
- Pictures: stories 1–20 done (the whole free part, Genesis–Deuteronomy) plus 47. Next: Batch 3 (stories 21–30).
- App 1.0 built: journey map, levels, from memory, daily verse, streak, verses gathered, settings, unlock. Web app fully tested in a browser; the Xcode shell still needs its first build on a Mac.

## Known issues for the 1.0 build

- Fixed in the 1.0 app: long verses now shrink their text and the card scrolls, so the wheel and buttons always fit (checked on every level at iPhone SE and iPhone 15 sizes).

## Rebuild the levels

```
cd content/tools
python3 lamp_levels.py build
python3 lamp_levels.py check --kjv ../data/kjv-gutenberg.txt
```

© Richard J. Allinson. KJV text is public domain in Canada and the US.

## Pictures

Finished paintings go in `images/` as 1080×1920 JPEGs of about 200 KB, named `lamp-NNN-story.jpg`. The full-size originals are kept in `images/originals/`. The level preview picks up every finished picture automatically when it is rebuilt.

| No. | Story | Status |
|---|---|---|
| 1 | Let There Be Light (Creation) | Done (Picture A, the style reference) |
| 2 | A Garden Eastward in Eden | Done Oct 24 |
| 3 | Where Art Thou? (the Fall) | Done Oct 24 (second version; a fake signature was painted out) |
| 4 | A Token of a Covenant (Noah) | Done, style test passed Oct 24 |
| 5 | Get Thee Out of Thy Country (Abram) | Done Oct 24 |
| 6 | Is Any Thing Too Hard? (Mamre) | Done Oct 24 |
| 7 | God Will Provide | Done Oct 24 |
| 8 | Surely the LORD Is in This Place (Jacob's ladder) | Done Oct 24 |
| 9 | God Meant It unto Good (Joseph) | Done Oct 24 |
| 10 | Holy Ground (the burning bush) | Done Oct 24 · **Batch 1 complete** |
| 11 | Let My People Go (Passover) | Done Oct 24 (second version: mark added on the lintel, Exodus 12:7) |
| 12 | The LORD Shall Fight for You (Red Sea) | Done Oct 24 |
| 13 | The Ten Commandments | Done Oct 24 |
| 14 | Love Thy Neighbour | Done Oct 24 |
| 15 | The Feasts of the LORD | Done Oct 24 (a faint fake signature was painted out) |
| 16 | The LORD Bless Thee | Done Oct 24 |
| 17 | A Star out of Jacob | Done Oct 24 |
| 18 | Hear, O Israel | Done Oct 24 |
| 19 | Choose Life (Mount Nebo) | Done Oct 24 |
| 20 | He Will Not Fail Thee | Done Oct 24 · **Batch 2 complete: every free story (Genesis–Deuteronomy) has its painting** |
| 47 | A Lamp unto My Feet (Psalm 119) | Done (Picture B, darker style) |
