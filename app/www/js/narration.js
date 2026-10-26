/* Lamp — the Lamplighter's narration (voice: Hank – Deep and Engaging Narrator, ElevenLabs; files in audio/narration/).

   - Story opening: before the first level of a story, its painting fills the screen and the Lamplighter
     sets the scene (text always shown; the voice can be switched off in Settings).
   - The verse read aloud when the story is complete.
   - Story ending: when you move on, what happened next, then "Coming up" with the next story.
   Only stories with recorded narration show these; the rest of the game is unchanged until more is recorded. */
(function () {
  "use strict";
  const Lamp = (window.Lamp = window.Lamp || {});
  const D = window.LAMP_DATA;
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  const LINES = {
    creation: {
      open: ["gen-01-open", "In the beginning, there was only darkness, and the deep… and the Spirit of God moving upon the face of the waters. Then God spoke. And everything began."],
      verse: "gen-01-verse",
      end: ["gen-01-end", "Six days God worked, and everything he made was very good. On the seventh day, he rested. But in a garden eastward in Eden, a new story was about to begin."],
    },
    eden: {
      open: ["gen-02-open", "God formed man from the dust of the ground, and breathed into him the breath of life. Then he planted a garden eastward in Eden, full of every tree that is pleasant to the sight… and he set the man there, to keep it."],
      verse: "gen-02-verse",
      end: ["gen-02-end", "In the midst of the garden stood two trees: the tree of life, and the tree of the knowledge of good and evil. Of that one tree, God said, thou shalt not eat. And somewhere in the garden… a serpent was watching."],
    },
    fall: {
      open: ["gen-03-open", "The serpent was more subtle than any beast of the field. He spoke to the woman, and he twisted the words of God. She took of the fruit, and gave also to her husband… and the eyes of them both were opened."],
      verse: "gen-03-verse",
      end: ["gen-03-end", "God made them coats of skins, and clothed them, and sent them out of the garden. At the east of Eden he placed cherubims, and a flaming sword which turned every way, to keep the way of the tree of life. The way was shut… but not forever."],
    },
  };

  /* ---------- playing a line ---------- */
  const audio = new Audio();
  audio.preload = "auto";
  let onEnd = null;
  audio.addEventListener("ended", () => { Lamp.audioOut && Lamp.audioOut(); Lamp.duck && Lamp.duck(false); const f = onEnd; onEnd = null; f && f(); });
  const voiceOn = () => Lamp.state.settings.narr !== false;
  function play(name, ended) {
    stop();
    if (!voiceOn() || !name) return false;
    try {
      audio.src = "audio/narration/" + name + ".mp3"; audio.currentTime = 0; onEnd = ended || null;
      Lamp.duck && Lamp.duck(true);
      const p = audio.play(); if (p && p.catch) p.catch(() => { Lamp.duck && Lamp.duck(false); });
      return true;
    } catch (e) { return false; }
  }
  function stop() { onEnd = null; try { audio.pause(); } catch (e) {} Lamp.duck && Lamp.duck(false); }

  /* ---------- the full-screen story card ---------- */
  function card(story, html, buttons, line) {
    const el = document.createElement("div");
    el.id = "narr"; el.setAttribute("role", "dialog"); el.setAttribute("aria-label", story.title);
    el.innerHTML = '<div class="nbg" style="' + (story.img ? "background-image:url(img/" + story.img + ")" : "") + '"></div><div class="nshade"></div>' +
      '<div class="nbody">' + html + '<div class="nbtns">' + buttons.map((b, i) => '<button class="ncta' + (i ? " alt" : "") + '" data-i="' + i + '">' + esc(b[0]) + "</button>").join("") +
      (voiceOn() && line ? '<button class="nvoice">↻ Hear it again</button>' : "") + "</div></div>";
    document.body.appendChild(el);
    requestAnimationFrame(() => el.classList.add("on"));
    const close = (fn) => { stop(); el.classList.remove("on"); el.classList.add("off"); setTimeout(() => el.remove(), 450); fn && fn(); };
    el.querySelectorAll(".ncta").forEach((b) => (b.onclick = () => close(buttons[+b.dataset.i][1])));
    const again = el.querySelector(".nvoice"); if (again) again.onclick = () => play(line);
    if (line) setTimeout(() => { if (el.isConnected) play(line); }, 700);
    const f = el.querySelector(".ncta"); f && f.focus({ preventScroll: true });
    return el;
  }
  function bookLabel(st) { const n = D.stories.filter((s) => s.book === st.book).indexOf(st) + 1; return st.book + " · Story " + n; }

  function opening(st, then) {
    const L = LINES[st.id];
    card(st, '<div class="nkick">' + esc(bookLabel(st)) + '</div><h1 class="nttl">' + esc(st.title) + "</h1>" +
      '<p class="ntext">' + esc(L.open[1]) + "</p>", [["Begin", then]], L.open[0]);
  }
  function ending(st, nx, label, then) {
    const L = LINES[st.id];
    const next = nx ? '<div class="nnext"><span class="nthumb" style="' + (nx.img ? "background-image:url(img/" + nx.img + ")" : "") + '"></span><span><small>Coming up</small><b>' +
      esc(nx.title) + "</b><i>" + esc(nx.verses[nx.key].ref) + "</i></span></div>" : "";
    card(st, '<div class="nkick">What happened next</div><h1 class="nttl">' + esc(st.title) + "</h1>" +
      '<p class="ntext">' + esc(L.end[1]) + "</p>" + next, [[label, then]], L.end[0]);
  }

  Lamp.narr = {
    has: (id, part) => !!(LINES[id] && LINES[id][part]),
    play, stop,
    /* the story's verse, read aloud on the story-complete card */
    verse(id) { if (LINES[id] && LINES[id].verse) play(LINES[id].verse); },
    /* moving on from a story: the ending first (if recorded), then carry on */
    ending(st, nx, label, then) { if (LINES[st.id] && LINES[st.id].end) ending(st, nx, label, then); else then(); },
  };

  /* every way into a story goes through Lamp.playStory: show the opening before the first level */
  const playStory = Lamp.playStory;
  Lamp.playStory = function (story, fromStart) {
    const fresh = !(Lamp.state.progress[story.id] > 0) || fromStart;
    if (fresh && LINES[story.id] && LINES[story.id].open) { stop(); opening(story, () => playStory(story, fromStart)); return; }
    playStory(story, fromStart);
  };
  document.addEventListener("visibilitychange", () => { if (document.hidden) stop(); });
})();
