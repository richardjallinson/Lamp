/* Lamp — inline icons (no image files, so they stay sharp and work offline). */
(function () {
  const s = (d, extra) => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"' + (extra || "") + ">" + d + "</svg>";
  window.Lamp = window.Lamp || {};
  window.Lamp.ICON = {
    lamp: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.5c1.7 2.4 2.6 4.1 2.6 5.4A2.6 2.6 0 0 1 12 10.5a2.6 2.6 0 0 1-2.6-2.6c0-1.3.9-3 2.6-5.4z" fill="#F5C451"/><path d="M12 5.2c.7 1 1.1 1.8 1.1 2.4a1.1 1.1 0 0 1-2.2 0c0-.6.4-1.4 1.1-2.4z" fill="#FFF4C9"/><path d="M3 15.5c2.5 0 3.5-2 6-2h6c2.6 0 4.2 1.4 6 1.4-.7 2.6-3.4 4.6-7 4.6H9.5c-3.4 0-5.6-1.6-6.5-4z" fill="#C9A24A"/><rect x="9.5" y="11.5" width="5" height="2" rx="1" fill="#C9A24A"/></svg>',
    oil: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3.5c2.6 3.4 4.2 6 4.2 8.2a4.2 4.2 0 0 1-8.4 0c0-2.2 1.6-4.8 4.2-8.2z" fill="#C9A24A"/><path d="M10.6 12.6a1.6 1.6 0 0 0 1.6 1.6" stroke="#FFF4C9" stroke-width="1.4" stroke-linecap="round" fill="none"/></svg>',
    hint: s('<path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.6 10.8c.6.5 1 1.3 1 2.1V16h5.2v-.1c0-.8.4-1.6 1-2.1A6 6 0 0 0 12 3z"/>'),
    shuffle: s('<path d="M4 7h3.5c2 0 3 1 4.2 3l1.6 3c1.1 2 2.2 3 4.2 3H20M17 13l3 3-3 3M4 17h3.5c1.3 0 2.2-.4 3-1.3M17 4l3 3-3 3M20 7h-2.5c-1.3 0-2.2.4-3 1.3"/>'),
    star: s('<path d="M12 3l2.3 5.6 6 .5-4.6 3.9 1.4 5.9L12 15.8 6.9 18.9l1.4-5.9L3.7 9.1l6-.5z"/>'),
    map: s('<path d="M9 4 3 6v14l6-2 6 2 6-2V4l-6 2-6-2z"/><path d="M9 4v14M15 6v14"/>'),
    sun: s('<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>'),
    book: s('<path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5z"/><path d="M4 20.5A2.5 2.5 0 0 0 6.5 23H20v-5"/><path d="M9 8h7M9 11h5"/>'),
    gear: s('<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>'),
    lock: s('<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>'),
    check: s('<path d="M5 12.5l4.5 4.5L19 7.5"/>', ' stroke-width="2.6"'),
    heart: s('<path d="M12 20s-7-4.4-9-8.6C1.6 8.3 3.5 5 6.7 5c2 0 3.3 1.1 5.3 3 2-1.9 3.3-3 5.3-3 3.2 0 5.1 3.3 3.7 6.4C19 15.6 12 20 12 20z"/>'),
    heartOn: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20s-7-4.4-9-8.6C1.6 8.3 3.5 5 6.7 5c2 0 3.3 1.1 5.3 3 2-1.9 3.3-3 5.3-3 3.2 0 5.1 3.3 3.7 6.4C19 15.6 12 20 12 20z" fill="currentColor"/></svg>',
    share: s('<path d="M12 3v12M7 8l5-5 5 5"/><path d="M5 13v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6"/>'),
  };
})();
