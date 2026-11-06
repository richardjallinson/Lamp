/* Episode 1, Act 5: The Seventh Lamp — the adventure layer (Haller at the barrier, Officer Tal, the brass plate at the grate and lamp 7, the shutter,
   the Waqf official's minute and page 13, the fifth candle, Yoel at the gate before sunrise, the last page).
   Script: the Claude Doc "Episode 1, Act 5: The Seventh Lamp — The Script" (third draft, 6 Nov 2026, approved by Gerry). Built on fsy-act1.js's machinery (FW.adv), after fsy-act4.js.
   The Mount itself (the five witnesses and the verdict) lives in fsy.js (the kept chapter) and talks to this file through H.act5. */
(function () {
  const FW = Lamp.fsyWalk; if (!FW || !FW.adv) return;
  const H = FW.H, C = FW.core, W = FW.W, K = Lamp.adv.kit, F = Lamp.fsy.parts, esc = K.esc, $ = (id) => document.getElementById(id);
  const { PEOPLE, ITEMS, PORTRAITS, CLIPS, A, has, done, give, reply, fact, portrait } = FW.adv;
  const save = () => Lamp.save(), IMG = "img/fsy/w/", PZ = "img/fsy/pz/";
  const wrong = (m) => C.wrong(m);
  const clip = (id) => (H.clip && CLIPS.has(id) ? H.clip(id) : "");
  /* portraits and clips to come: add each id here when its file is in */
  ["yoel", "tal"].forEach((p) => PORTRAITS.add(p));
  // ["haller-barrier", "rod-grate", "haller-shutter", "yoel-measure", "gate-sun"].forEach((c) => CLIPS.add(c));
  const q = (t) => '<div class="fq">' + esc(t) + "</div>";
  const ok = () => { F.S("harp", null, 0.6); K.buzz("success"); };
  const said = (who, text) => '<div class="fend-said"><span class="fend-who">' + esc(who) + "</span>" + text + "</div>";
  const img = (f, alt) => '<img class="fphoto1" src="' + PZ + f + '.jpg" onerror="this.style.display=\'none\'" alt="' + esc(alt) + '">';

  Object.assign(ITEMS, {
    page13: ["Page 13", "A fold of oilcloth no bigger than a finger, drawn out of a paving crack by the eastern wall on the tip of the rod. “When the lamps are seven, come down to the Eastern Gate before sunrise. Bring the rod. Come alone.”"],
    rod2: ["Yoel’s own rod", "Left leaning against the wall outside the Eastern Gate at sunrise. The same notches as yours; the same small lamp scratched into the handle. Two rods now."],
  });

  Object.assign(PEOPLE, {
    tal: { name: "Officer Tal", kick: "The Temple Mount", desc: "The police escort: a woman of twenty-five in a pale blue shirt and a radio earpiece, bored and watchful. She walks every group across.", lines: [
      { id: "long", say: "How long do we have?", run: () => { A().q.tal = 1; save(); reply("tal", "“Until I say. Stay with the group, do not pray out loud, do not kneel.” She looks at the rod. “Do not measure anything with that in front of the Waqf. I did not see it.”"); } },
    ] },
    yoel: { name: "Yoel", kick: "Outside the Eastern Gate, before sunrise", desc: "A man of seventy-eight, thin, in a flat cap and an old wool coat, a rod in one hand and a cane in the other, standing very straight. His eyes are the only quick thing about him.", lines: [
      { id: "meet", say: "(Go to him)", when: (a) => !a.q.yoelGone, run: () => yoelTalk() },
    ] },
  });

  /* ------------------------------------------------------------ Scene 1: Haller at the barrier ------------------------------------------------------------ */
  function hallerRamp() {
    const a = A(), p = PEOPLE.hallerpool || { name: "Victor Haller" };
    const card = (h, text, choices, o) => { o = o || {};
      K.card('<div class="ftalk">' + portrait("hallerfront", p) + '<div><div class="kick">Victor Haller</div>' + (h ? "<h2>" + esc(h) + "</h2>" : "") + "</div></div>" + (o.clip ? clip(o.clip) : "") +
        '<div class="fhim">' + text + "</div>" + '<div class="fsay">' + choices.map((c, i) => '<button data-act="c' + i + '">' + esc(c[0]) + "</button>").join("") + "</div>", Object.fromEntries(choices.map((c, i) => ["c" + i, c[1]]))); };
    const s1 = () => card("Before opening", q("The barrier at the foot of the bridge is down, and the plaza is empty but for the sweepers. He is standing at the barrier with his hands in his coat pockets, as if he has been there since before the light.") + "He is early. He is always early.",
      [["“You knew I would come.”", s2]], { clip: "haller-barrier" });
    const s2 = () => card(null, "“The old man sent you. I made certain you reached the Mount.” He says it without triumph, as a man states the time. “Every page you found, I could have taken. I needed you to find them.”",
      [["“You tried to send me to the wrong place.”", s3]]);
    const s3 = () => { fact("hallertest", "Haller, at the barrier: Yoel wrote his trail for one reader and salted it for everyone else. The forged page at the pool was Haller's test of whether you could tell Yoel's false turns from his true one.");
      card(null, "“Yoel wrote his trail for one reader and salted it for everyone else. The first answer under the Wall, the line that said <i>don’t believe it yet</i>: those were his, not mine. I needed the person he chose, to tell his false turns from his true one.” A small nod, almost respect. “At the pool you showed me you could. You struck my page through. Good.”",
        [["“Why me?”", s4]]); };
    const s4 = () => { a.q.ramp = 1; save();
      card(null, "“Because the old man would never give it to us, and you would never know you had.” He steps aside from the barrier. “The Mount closes when the police say it closes. You have ninety minutes. Your old man took four years.”",
        [["He steps aside.", s5]]); };
    const s5 = () => K.card('<div class="kick">The journal</div><h2>He is waiting.</h2>' + F.wnote("He needed me to find it. He is not stopping me. He is waiting.") +
      "<p>He does not threaten. He does not follow close. For the rest of the morning he will be somewhere on the platform, in sight and out of reach, and the police will not seem to see him.</p>" +
      '<button class="cta" data-act="g">Go up anyway</button><button class="cta alt" data-act="w">Stand at the barrier</button>', { g: up, w: () => { F.V("w-mughrabi-goup");
        K.card('<div class="kick">The Lamplighter</div><h2>“Go up anyway.”</h2>' + said("The Lamplighter", "“Go up anyway. A lie accepted is worse than a truth stolen. And I am not certain he is right about what a truth can do.”") + '<button class="cta" data-act="x">Up the bridge</button>', { x: up }); } });
    const up = () => C.pzDone("hallerramp", () => C.finish("mughrabi", () => FW.go("mount")));
    s1();
  }
  C.PUZZLES.hallerramp = { label: "The man at the barrier", run: () => hallerRamp() };
  if (C.PUZZLES.greytop) delete C.PUZZLES.greytop;

  /* ------------------------------------------------------------ the Mount: hooks called from fsy.js ------------------------------------------------------------ */
  const SIGHT = ["A grey coat at the far end of the platform, by the southern arcade. Not looking at the buildings.", "In the shade of the arcade, a grey coat, a telephone, a glance up.", "On the steps of the Dome, among the tourists, a grey coat that is not photographing anything.", "Sitting on the wall above the gate stair, the grey coat, hands in pockets, patient.", "You do not look for him this time. You know where he is."];
  H.act5 = {
    /* Officer Tal, once, when the board first opens */
    tal(then) { const a = A(); if (a.q.talSeen) return then(); a.q.talSeen = 1; save();
      K.card('<div class="ftalk">' + portrait("tal", PEOPLE.tal) + '<div><div class="kick">The escort</div><h2>“Stay with the group.”</h2></div></div><p>' + esc(PEOPLE.tal.desc) + "</p>" +
        '<div class="fsay"><button data-act="t">“How long do we have?”</button></div>', { t: () => { a.q.tal = 1; save();
          K.card('<div class="ftalk">' + portrait("tal", PEOPLE.tal) + '<div><div class="kick">Officer Tal</div></div></div><div class="fhim">“Until I say. Stay with the group, do not pray out loud, do not kneel.” She looks at the rod. “Do not measure anything with that in front of the Waqf. I did not see it.”</div><button class="cta" data-act="x">The platform</button>', { x: then }); } }); },
    /* after each witness: a sighting, and after the third, the Lamplighter */
    sighted(n) { const a = A(); a.q.sightings = n; save(); K.say(SIGHT[Math.min(n, SIGHT.length) - 1], "", 4200); if (n === 3) setTimeout(() => F.V("w-mount-three"), 2600); if (n === 4) fact("sightings", "Four times now on the Mount: a grey coat at a distance. He is not looking at the buildings. He is looking at me."); },
    /* before the overlay opens: he is there */
    beforeVerdict(then) { const a = A(); if (a.q.sawBefore) return then(); a.q.sawBefore = 1; save();
      K.card('<div class="kick">The low wall by the Dome of the Spirits</div><h2>He is there.</h2><p>You are about to sit with the journal and lay the court on the plan. You look up. Fifty metres off across the paving, the grey coat: not coming closer, not looking away.</p>' +
        F.wnote("He is there. He is always there. If I open this, he will see it.") + "<p>There is no other way to finish.</p>" +
        '<button class="cta" data-act="x">Open the journal anyway</button>', { x: then }); },
    /* the lock: the journal writes Yoel's line, the Lamplighter speaks, then the reveal */
    locked(then) { F.V("w-verdict-five");
      K.card('<div class="kick">The journal · in Yoel’s hand</div><h2>Five lines of evidence converge here.</h2>' + F.wnote("The floor. The summit. The line. The court. The open middle. My five lines of evidence converge here.") +
        "<p>Then the twenty-cubit square of the Holy of Holies is drawn on the level outcrop, and it fits. This is Yoel’s reconstruction: the case a man made with a rod over four years, and the case you have now walked. The scholars have not agreed. It shows where his evidence points, and lets you stand on it.</p>" +
        said("The Lamplighter", "“Five witnesses. One place. The scholars argued. Yoel measured.”") + '<button class="cta" data-act="x">Stand on it</button>', { x: then }); },
    /* lamp 7 and the shutter, after the reveal */
    lamp7() { grate(); },
    /* the Waqf official's new line, before he sends you down */
    waqfLine: '“A man came here every Friday for four years and measured with a stick like that. Then he stopped. The police did not ask where he went. I asked.” He does not say what he found.',
    /* after Ezekiel's words: the minute, the crack, page 13, the fifth candle, the night */
    page13(then) { minute(then); },
  };

  /* ------------------------------------------------------------ Scene 4: soot under iron, lamp 7, the shutter ------------------------------------------------------------ */
  function grate() {
    const a = A();
    F.M("m25", "platform");
    const el = F.stage('<div class="fkick">The northern outcrop · by the Dome of the Spirits</div><h1>Low. Where the rock meets the stone.</h1>' +
      q("The police have walked the group on to the next stop; Officer Tal is looking the other way on purpose, for about a minute. Where the bedrock meets the paving, an old iron grate covers a drain. It is fixed. Slide the end of the rod along the edge of the paving until it is under the lip of the grate, then tilt it to the sun.") +
      '<div class="fgrate" id="fgrate"><img draggable="false" src="img/fsy/tm-spirits.jpg" alt="The Dome of the Spirits on the flat bedrock"><div class="frodtip" id="frodtip"></div><div class="fgratemk" id="fgratemk"></div></div>' +
      '<div class="fsmall" id="fgratesay">Drag the rod’s end along the bottom of the picture.</div><button class="fbtn" id="ftilt" style="display:none">Tilt the plate to the sun</button>', "tm-spirits.jpg");
    const box = $("fgrate"), tip = $("frodtip"); let rx = 0.08, drag = false, at = false;
    const place = (cx) => { const r = box.getBoundingClientRect(); rx = Math.max(0.02, Math.min(0.98, (cx - r.left) / r.width)); tip.style.left = rx * 100 + "%"; const near = Math.abs(rx - 0.62) < 0.05; if (near !== at) { at = near; $("ftilt").style.display = near ? "" : "none"; $("fgratesay").textContent = near ? "Under the lip. The brass end is in the dark." : "Drag the rod’s end along the bottom of the picture."; if (near) F.S("rod", "click", 0.5); } };
    tip.style.left = rx * 100 + "%";
    box.addEventListener("pointerdown", (e) => { drag = true; place(e.clientX); try { box.setPointerCapture(e.pointerId); } catch (x) {} });
    box.addEventListener("pointermove", (e) => { if (drag) place(e.clientX); });
    box.addEventListener("pointerup", () => (drag = false)); box.addEventListener("pointercancel", () => (drag = false));
    $("ftilt").onclick = () => {
      if (!at) return; F.S("stone", null, 0.5);
      K.card('<div class="kick">In the brass</div><h2>Soot.</h2>' + clip("rod-grate") + img("brassplate", "The flat brass plate on the end of the rod, under the lip of the grate, catching the sun: a line of soot, a small lamp with its spout to the right, a date, and six scratched words, reversed") +
        "<p>The end of Yoel’s rod is a small flat brass plate, polished by four years of his thumb; you noticed it on the first day and did not know why. In it, mirrored and clear, the underside of the lip: a thin line of soot where someone held a flame, often, for a long time. And scratched into the stone under it, where no one standing would ever look, reversed in the brass and set the right way round by the journal a moment later:</p>" +
        '<div class="fcharcoal"><b>Yoel’s lamp, spout to the right.</b><br>A date, three weeks ago.<br><i>You found the place. Now guard the truth.</i></div>' +
        '<button class="cta" data-act="x">Seven</button>', { x: () => { fact("lamp7", "Under the grate at the northern outcrop: Yoel's lamp, spout right, a date three weeks old, and 'You found the place. Now guard the truth.'");
          FW.lightLamp(7, () => { F.V("w-seven"); K.card('<div class="kick">The Seven Lamps · 7 of 7</div><h2>All seven burn.</h2><p>For the first time, all seven flames on the journal’s page are lit together. Not here; drawn. He is alive, and he was here.</p>' + said("The Lamplighter", "“Seven. He is alive, and he was here.”") + '<button class="cta" data-act="x">Straighten up</button>', { x: shutter }); }); } });
    };
  }
  function shutter() {
    const a = A(), p = PEOPLE.hallerpool || { name: "Victor Haller" };
    F.S("stamp", "click", 0.9);
    const card = (h, text, choices, o) => { o = o || {};
      K.card('<div class="ftalk">' + portrait("hallerfront", p) + '<div><div class="kick">Ten metres off</div>' + (h ? "<h2>" + esc(h) + "</h2>" : "") + "</div></div>" + (o.clip ? clip(o.clip) : "") +
        '<div class="fhim">' + text + "</div>" + '<div class="fsay">' + choices.map((c, i) => '<button data-act="c' + i + '">' + esc(c[0]) + "</button>").join("") + "</div>", Object.fromEntries(choices.map((c, i) => ["c" + i, c[1]]))); };
    const s1 = () => card("A camera shutter.", q("As you straighten up from the grate: a shutter, behind you. Haller, ten metres off, lowering his telephone. He has photographed the journal’s finished overlay, open in your other hand, where it had to be open to read the line.") + "He does not come closer.",
      [["“You let me do this for you.”", s2]], { clip: "haller-shutter" });
    const s2 = () => card(null, "“I told you. The old man would never give it to us.”", [["“The annex.”", s3]]);
    const s3 = () => card(null, "“Cannot remain blank forever.”", [["“Give me the photograph.”", s4], ["Say nothing.", s5]]);
    const s4 = () => card(null, "“It has already arrived.” He puts the telephone away. “I am not taking the book. I do not need it any more. Keep it. It is the only honest copy.”", [["…", s5]]);
    const s5 = () => { a.q.shutter = 1; save(); fact("shutter", "Haller photographed the finished overlay at the northern outcrop. 'The annex cannot remain blank forever.' 'You believe finding the place prevents what is coming. My employers believe it makes what is coming possible. The covenant will tell us which.'");
      card("His last line.", "He means it kindly, which is the worst of it. “You believe finding the place prevents what is coming. My employers believe it makes what is coming possible. The covenant will tell us which.”<br><br>He goes down toward the Mughrabi ramp without looking back. You do not see him again.",
        [["The journal", () => K.card('<div class="kick">The journal</div><h2>He has it.</h2>' + F.wnote("He has it. He always had it, the moment I found it. The annex is not blank now.") + "<p>You walk back to the small dome on the northern rise and stand on the bedrock, in line with the gate. Footsteps behind you on the stone.</p>" + '<button class="cta" data-act="x">Turn round</button>', { x: () => Lamp.fsy.parts.waqf() })]]); };
    s1();
  }

  /* ------------------------------------------------------------ Scene 5: the official's minute, the crack, page 13, the fifth candle ------------------------------------------------------------ */
  function minute(then) {
    K.card('<div class="kick">The platform · by the eastern wall</div><h2>“One minute.”</h2>' +
      "<p>The official looks at the rod, and at the paving by the wall, and then away, across the valley at the Mount of Olives.</p>" +
      '<div class="fhim">“He was a polite man. He never knelt and he never prayed and he never once lied to me about what the stick was for. One minute. I am looking at the mountain.”<small>The official</small></div>' +
      "<p>He gives you the minute. He does not look back until it is over.</p>" +
      '<button class="cta" data-act="x">The paving</button>', { x: () => crack(then) });
  }
  const JOINTS = [[18, 70], [34, 74], [52, 68], [66, 76], [82, 70]], TRUE = 3;
  function crack(then) {
    F.M("gate", "platform");
    const el = F.stage('<div class="fkick">The platform · by the eastern wall</div><h1>The joints in the paving</h1>' +
      q("Five joints between the paving stones along the foot of the wall. One of them is marked. Find the small lamp, then put the rod’s end into the crack beside it.") +
      '<div class="fgrate" id="fcrack"><img draggable="false" src="img/fsy/tm-gate-wide.jpg" alt="The paving by the eastern wall, the sealed gate below">' +
      JOINTS.map((j, i) => '<button class="fhit fjoint" data-j="' + i + '" aria-label="A joint in the paving" style="left:' + (j[0] - 5) + "%;top:" + (j[1] - 5) + '%;width:10%;height:10%"></button>').join("") + "</div>" +
      '<div class="fsmall" id="fcracksay">Tap a joint.</div>', "tm-gate-wide.jpg");
    el.querySelectorAll("[data-j]").forEach((b) => (b.onclick = () => {
      const i = +b.dataset.j;
      if (i !== TRUE) { wrong(["A plain joint. Mortar and dust.", "Nothing. A cigarette end.", "Nothing here.", "", "A weed, and nothing else."][i] || "Nothing."); return; }
      b.classList.add("on"); F.S("rod", "click", 0.6);
      K.card('<div class="kick">The fourth joint</div><h2>The lamp.</h2><p>Scratched small on the edge of the stone, a lamp with its spout to the right. The joint beside it is a shallow crack. The brass end of the rod goes in, and comes out with a fold of oilcloth on its tip no bigger than a finger.</p>' +
        '<button class="cta" data-act="x">Unfold it</button>', { x: () => { give("page13", true); W().flags.page13 = 1; save(); F.S("journal"); setTimeout(() => F.S("harp", null, 0.6), 300); K.buzz("success");
          K.card('<div class="kick">A page of the journal · 13</div><h2>A page that was never in it</h2>' + F.wnote("“When the lamps are seven, come down to the Eastern Gate before sunrise. Bring the rod. Come alone.”") +
            "<p>The journal had twelve torn out. This one was never in it. It is in the same hand. He hid it on the inside of the gate he means to meet you outside. Nothing was lifted; nothing was moved; the official is looking at the mountain, because he chose to.</p>" +
            '<button class="cta" data-act="x">The journal’s last entry of the day</button>', { x: () => K.card('<div class="kick">The journal</div><h2>Before the sun.</h2>' + F.wnote("Tomorrow, the other side of this stone. Before the sun.") + '<button class="cta" data-act="x">Down from the Mount</button>', { x: () => candle5(then) }) }); } });
    }));
  }
  function candle5(then) {
    const w = W(); w.flags.act5end = 1; save(); F.S("harp", null, 0.6); F.V("w-act5-end");
    K.card('<div class="kick">Act 5 · The Seventh Lamp</div><h2>The fifth candle</h2>' + FW.hanukkiahHTML(5) +
      said("The Lamplighter", "“Five candles, and seven lamps. You have done what he asked, and what the other one wanted, and they were the same thing, and I did not know that when I sent you. He wrote you one more page. Go before the sun.”") +
      '<button class="cta" data-act="n">The night</button>', { n: () => { F.S("harp", null, 0.4);
        K.card('<div class="kick">The fifth night · the hotel</div><h2>The seven-lamp page, open under the desk lamp.</h2><p>All seven flames drawn in. The rod across the page. You set the alarm for an hour before the sun.</p>' +
          '<button class="cta" data-act="x">Before sunrise</button>', { x: then }); } });
  }

  /* ------------------------------------------------------------ Scene 6: Yoel ------------------------------------------------------------ */
  function yoelTalk() {
    const a = A(), p = PEOPLE.yoel, Y = (n) => F.V("yoel-" + n);
    const card = (h, text, choices, o) => { o = o || {};
      K.card('<div class="ftalk">' + portrait("yoel", p) + '<div><div class="kick">Yoel</div>' + (h ? "<h2>" + esc(h) + "</h2>" : "") + "</div></div>" + (o.clip ? clip(o.clip) : "") +
        '<div class="fhim">' + text + "</div>" + '<div class="fsay">' + choices.map((c, i) => '<button data-act="c' + i + '">' + esc(c[0]) + "</button>").join("") + "</div>", Object.fromEntries(choices.map((c, i) => ["c" + i, c[1]]))); };
    const s0 = () => card("Before sunrise", q("At the foot of the sealed gate, an old man with a walking cane is measuring the base of the wall, stone by stone, with a rod exactly like yours. No music. No introduction. You know the rod before the man: the notches, the small lamp scratched into the handle."),
      [["“Yoel?”", s1]], { clip: "yoel-measure" });
    const s1 = () => { Y(1); a.q.yoel = 1; save(); card(null, "“You took longer in the tunnel than I expected.” He does not stop measuring until the stone is done. Then he looks at you, all of you, once. “The charcoal held, then.”", [["“Haller has the measurements.”", s2]]); };
    const s2 = () => { Y(2); card(null, "“He was always going to have them.”", [["“Then why send me?”", s3]]); };
    const s3 = () => { Y(3); fact("witness", "Yoel, at the gate: 'He needed a place. I needed a witness. You did not inherit my conclusion. You walked to it.'");
      card(null, "“Because he needed a place. I needed a witness.” He sets the rod against the wall. “A government can bury a report. It can buy an expert. It can print a new map. It cannot do anything about a stranger who walked to every stone himself and wrote down what he saw.” He taps the journal in your hands with one finger. “You did not inherit my conclusion. You walked to it.”", [["…", menu]]); };
    const menu = () => { const ch = [];
      if (!a.q.yoelL) ch.push(["“The Lamplighter told him I was coming.”", () => { a.q.yoelL = 1; save(); Y(4); card(null, "“Your Lamplighter was afraid. He has been afraid for thirty years, and he was right to be, and he sent you anyway. Judge him by the second thing.”", [["…", menu]]); }]);
      if (!a.q.yoelD) ch.push(["“Were you ever in danger?”", () => { a.q.yoelD = 1; save(); Y(5); card(null, "“I am seventy-eight and I live in a tunnel, so, yes, of damp.” The first and only time he smiles. “Not from him. He needs me alive to be wrong.”", [["…", menu]]); }]);
      ch.push(["“Who does Haller serve?”", last]);
      card(null, "He waits. The sky over the Mount of Olives is going grey.", ch); };
    const last = () => { Y(6); fact("whoconfirms", "Yoel's last answer: 'You are asking who. Daniel tells you to watch what he confirms.'");
      card(null, "Yoel looks up at the sealed gate for a long moment. “You are asking who. Daniel tells you to watch what he confirms.”", [["A car door, somewhere behind.", gone]]); };
    const gone = () => { a.q.yoelGone = 1; save(); give("rod2", true);
      K.card('<div class="kick">The road below</div><h2>A car door closes.</h2><p>You turn. When you turn back, the old man is walking away among the graves, up the slope, not fast, not looking round, and the rod is leaning against the wall where he set it.</p><p>You take it. Two rods now.</p>' +
        '<button class="cta" data-act="x">The sun</button>', { x: sun }); };
    const sun = () => { F.M("m25", "olives");
      K.card('<div class="kick">The Mount of Olives</div><h2>The sun strikes the gate.</h2>' + clip("gate-sun") + '<img class="fphoto1" src="' + IMG + 'egate-gate.jpg" alt="The sealed Eastern Gate in the first sun">' +
        "<p>It comes up over the Mount of Olives behind you and moves down the stone of the sealed arches, and the journal’s final page writes itself.</p>" +
        '<button class="cta" data-act="x">The last page</button>', { x: lastPage }); };
    const lastPage = () => { F.S("journal"); F.V("w-final-when");
      K.card('<div class="kick">The journal · the last page</div><h2 class="flast">YOEL’S PLACE — FOUND<br>THE ANNEX — NO LONGER BLANK<br>THE COVENANT — NOT YET CONFIRMED</h2>' +
        said("The Lamplighter", "“You know where. Now learn when.”") +
        "<p>Three nights of the feast remain. You will not be here to see them.</p>" +
        '<button class="cta" data-act="x">End of Episode 1</button>', { x: () => C.pzDone("yoel", () => C.finish("yoelgate", () => Lamp.fsy.parts.ending())) }); };
    s0();
  }
  C.PUZZLES.yoel = { label: "The old man at the wall", run: () => yoelTalk() };

  /* ------------------------------------------------------------ gates, before, lists, tasks, hints ------------------------------------------------------------ */
  const gate4 = H.gate, before4 = H.before, list4 = H.list, task4 = H.task, hint4 = H.hint, dev4 = H.devDone;
  H.gate = (s, from) => {
    if (!from || from.id === s.id) return true;
    if (s.id === "mount" && !A().q.ramp) { K.say("The barrier is down. The man at the foot of the bridge is waiting for you.", "", 3200); return false; }
    return gate4 ? gate4(s, from) : true;
  };
  H.before = (scene, v, prev) => {
    if (scene.id === "mughrabi" && !A().q.ramp && !["below", "under", "entrance"].includes(v.id)) { K.say("The barrier is down. He is standing at it.", "", 2600); return false; }
    return before4 ? before4(scene, v, prev) : true;
  };
  const r = (t, ok, where, opt) => ({ t, ok: !!ok, where, opt: !!opt });
  const L5 = {
    mughrabi: (a, w) => [r("The man at the barrier", a.q.ramp, "The foot of the bridge")],
    yoelgate: (a, w) => [r("The old man at the wall", a.q.yoelGone, "The foot of the sealed gate")],
  };
  H.list = (scene) => (L5[scene.id] ? L5[scene.id](A(), W()) : list4 ? list4(scene) : null);
  H.devDone = (id) => {
    const a = A(), w = W(), q = a.q, it = a.items, pz = (k) => (w.done[k] = 1), P = Lamp.fsy.parts.P && Lamp.fsy.parts.P();
    const D = {
      mughrabi: () => { q.ramp = 1; pz("mughrabi:hallerramp"); },
      mount: () => { q.talSeen = 1; q.tal = 1; q.sawBefore = 1; q.shutter = 1; if (FW.lamps) FW.lamps()[7] = 1; if (P) { ["floor", "summit", "line", "cubits", "middle"].forEach((c) => (P.clues[c] = 1)); P.theory = P.theory || "unsure"; P.done = 1; P.waqf = 1; } },
      gate: () => { it.page13 = 1; w.flags.page13 = 1; w.flags.act5end = 1; if (P) P.gateDone = 1; },
      yoelgate: () => { q.yoel = 1; q.yoelGone = 1; it.rod2 = 1; pz("yoelgate:yoel"); },
    };
    if (D[id]) D[id](); else if (dev4) dev4(id);
  };
  H.task = (scene) => {
    const a = A();
    const WHY = { mughrabi: "The only way up. The barrier is down, and someone is standing at it.", yoelgate: "Before the sun. The other side of the stone. Bring the rod." };
    if (L5[scene.id]) { const left = H.left(scene) || ""; const need = L5[scene.id](a, W()).filter((x) => !x.opt); const fresh = need.filter((x) => !x.ok).length === need.length; return ((fresh && WHY[scene.id]) ? WHY[scene.id] + " " : "") + left || null; }
    return task4 ? task4(scene) : null;
  };
  H.hint = (scene, v, n) => {
    if (scene.id === "mughrabi" && !A().q.ramp) return "Walk up to the barrier and talk to him. He has been waiting since before the light.";
    return hint4 ? hint4(scene, v, n) : null;
  };

  /* the tester's shortcut: Act 5 as if played */
  FW.devAct5 = () => {
    if (FW.devAct4) FW.devAct4();
    ["mughrabi", "mount", "gate", "yoelgate"].forEach((id) => { H.devDone(id); W().done[id] = 1; });
    const w = W(); w.flags.actcard5 = 1; save();
  };
})();
