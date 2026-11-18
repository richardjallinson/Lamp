/* Writes tools/e2_act3_views.json: the Act 3 views and their tap spots, read from the game itself, for make_e2_act3_standins.py. Run: node app/tools/dump_e2_act3_views.js */
const { chromium } = require("playwright"); const path = require("path"), fs = require("fs");
(async () => { const b = await chromium.launch(); const p = await b.newPage();
  await p.goto("file://" + path.resolve(__dirname, "../www/index.html")); await p.waitForTimeout(800);
  const v = await p.evaluate(() => Lamp.ep2.scenes.filter((s) => /^c\d/.test(s.id)).flatMap((s) => s.views.map((v) => ({ scene: s.title, img: v.img, cap: v.cap, hots: (v.hots || []).map((h) => ({ box: h.box, label: h.label })), who: (v.who || []).map((w) => w.name) }))));
  fs.writeFileSync(path.resolve(__dirname, "e2_act3_views.json"), JSON.stringify(v, null, 1)); console.log(v.length, "views"); await b.close(); })();
