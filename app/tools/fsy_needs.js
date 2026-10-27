#!/usr/bin/env node
/* Writes docs/fsy/EPISODE1-NEEDS.md: every photo, narration line and music track Episode 1 (walking version) needs,
   read straight from app/www/js/fsy-route.js, so the list always matches the game.
   Run:  node app/tools/fsy_needs.js */
const fs = require("fs"), path = require("path");
const ROOT = path.join(__dirname, "..", "..");
const src = fs.readFileSync(path.join(ROOT, "app/www/js/fsy-route.js"), "utf8");
/* run the route file with a stub Lamp so it registers its data */
const R = [], Lamp = { fsy: { parts: { P: () => ({}), keptDone: () => false } }, adv: { kit: { esc: (s) => s } } };
const sandbox = { window: { Lamp }, document: { getElementById: () => null } };
new Function("window", "document", src)(sandbox.window, sandbox.document);
const route = Lamp.fsyWalk.route, ACTS = Lamp.fsyWalk.acts;
const have = new Set(fs.readdirSync(path.join(ROOT, "app/www/img/fsy/w")).map((f) => f.replace(/\.jpg$/, "")));
const haveN = new Set(fs.readdirSync(path.join(ROOT, "app/www/audio/narration")).map((f) => f.replace(/^fsy-|\.mp3$/g, "")));

let md = "# Episode 1, The Jerusalem Mystery: what the walking version needs\n\nMade by `node app/tools/fsy_needs.js` from the game's own route (`app/www/js/fsy-route.js`). Updated " + new Date().toISOString().slice(0, 10) + ".\n\n";
md += "Photos: upright (portrait) is best; one photo per viewpoint, taken from where you stood, plus close-ups of anything a puzzle uses. Send them un-renamed, one place at a time; the name in the **File** column is what the game will call it.\n\n";
let need = 0, got = 0;
ACTS.forEach((a) => {
  md += "## Act " + a.n + ": " + a.title + "\n\n";
  route.filter((s) => s.act === a.n).forEach((s) => {
    md += "### " + s.n + ". " + s.title + " (" + s.kick + ")\n\n";
    if (s.kept) { md += "_Built earlier, with its own photos already in the game" + (s.kept === "institute" ? " (the Temple Institute hall and exhibits)" : s.kept === "mount" ? " (the Temple Mount clues)" : "") + "._\n\n"; }
    const rows = s.views.filter((v) => v.cap).map((v) => { const ok = v.img && have.has(v.img); if (!s.kept) { need++; if (ok) got++; } return "| " + (ok ? "✓" : "☐") + " | `" + (v.img || s.id + "-" + v.id) + "` | " + v.cap + " |"; });
    if (rows.length && !s.kept) md += "| Have | File | The picture |\n| --- | --- | --- |\n" + rows.join("\n") + "\n\n";
    const lines = s.views.filter((v) => v.hank).map((v) => "- `w-" + s.id + "-" + v.id + "`" + (haveN.has("w-" + s.id + "-" + v.id) ? " ✓" : "") + ": “" + v.hank + "”");
    if (lines.length) md += "**Hank says:**\n\n" + lines.join("\n") + "\n\n";
  });
});
md = md.replace("Updated ", "Photos in hand: " + got + " of " + need + " viewpoints. Updated ");
fs.mkdirSync(path.join(ROOT, "docs/fsy"), { recursive: true });
fs.writeFileSync(path.join(ROOT, "docs/fsy/EPISODE1-NEEDS.md"), md);
/* Hank's paste script: one line per narration, in order, for ElevenLabs */
let script = "HANK, EPISODE 1 WALKING VERSION. Paste each line as one generation, in this order, and send the files un-renamed.\n\n";
route.forEach((s) => s.views.filter((v) => v.hank).forEach((v) => { script += "[" + "w-" + s.id + "-" + v.id + "]\n" + v.hank + "\n\n"; }));
fs.writeFileSync(path.join(ROOT, "docs/fsy/EPISODE1-HANK-WALK-SCRIPT.txt"), script);
console.log("photos " + got + "/" + need + ", lines " + (script.match(/^\[w-/gm) || []).length);
