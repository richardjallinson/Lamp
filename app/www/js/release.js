/* Lamp — what this App Store version includes.
   FIRST_RELEASE = true: only Genesis and Exodus can be played; every later book shows "coming soon"
   (no purchase is offered). Set it to false when the full Bible and the in-app purchase are ready. */
(function () {
  "use strict";
  const FIRST_RELEASE = true;
  const OPEN_BOOKS = ["Genesis", "Exodus"];
  /* Every new build starts from the very first scene (full start screen, Creation level 1), as Richard asked.
     The progress saved by an older build, here and in iCloud, is set aside.
     !! Turn FRESH_EACH_BUILD off before an UPDATE goes to real players, or their progress would be wiped. */
  const BUILD = "v3z";
  const FRESH_EACH_BUILD = true;
  /* The Final Seven Years: false = shown as a preview only, every chapter locked ("Coming soon").
     Set to true when Richard opens chapter 1. */
  const FSY_OPEN = true;   // Episode 1 is the game now (Oct 28): it stays open in the App Store build too
  /* GAME_ONLY = true: the app is "The Final Seven Years" alone. The word game, the books and the Genesis adventure
     are switched off (their code stays, so they can come back). Richard, Oct 28. */
  const GAME_ONLY = true;
  const Lamp = (window.Lamp = window.Lamp || {});
  Lamp.build = BUILD;
  Lamp.freshEachBuild = FRESH_EACH_BUILD;
  Lamp.fsyOpen = FSY_OPEN;
  Lamp.gameOnly = GAME_ONLY;
  Lamp.preview = FIRST_RELEASE;
  Lamp.openBooks = OPEN_BOOKS;
  if (!FIRST_RELEASE || !window.LAMP_DATA) return;
  window.LAMP_DATA.stories.forEach((s) => (s.free = OPEN_BOOKS.includes(s.book)));
  window.LAMP_DATA.daily = window.LAMP_DATA.daily.filter((d) => { const s = window.LAMP_DATA.stories.find((x) => x.id === d.story); return s && s.free; });
})();
