/* Lamp — what this App Store version includes.
   FIRST_RELEASE = true: only Genesis and Exodus can be played; every later book shows "coming soon"
   (no purchase is offered). Set it to false when the full Bible and the in-app purchase are ready. */
(function () {
  "use strict";
  const FIRST_RELEASE = true;
  const OPEN_BOOKS = ["Genesis", "Exodus"];
  const Lamp = (window.Lamp = window.Lamp || {});
  Lamp.preview = FIRST_RELEASE;
  Lamp.openBooks = OPEN_BOOKS;
  if (!FIRST_RELEASE || !window.LAMP_DATA) return;
  window.LAMP_DATA.stories.forEach((s) => (s.free = OPEN_BOOKS.includes(s.book)));
  window.LAMP_DATA.daily = window.LAMP_DATA.daily.filter((d) => { const s = window.LAMP_DATA.stories.find((x) => x.id === d.story); return s && s.free; });
})();
