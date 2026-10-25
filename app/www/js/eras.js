/* Lamp — the ten eras of the Bible. Each era has its own instrument for the letters (made by
   tools/make_sounds.py) and, later, its own background music theme. Stories belong to an era by book. */
(function () {
  "use strict";
  const Lamp = (window.Lamp = window.Lamp || {});
  const ERAS = [
    { id: "beginnings", name: "Beginnings", inst: "harp", stories: ["creation", "eden", "fall", "noah"] },
    { id: "patriarchs", name: "The Patriarchs", inst: "pipe", stories: ["abram", "mamre", "provide", "ladder", "joseph"] },
    { id: "exodus", name: "Exodus and the Wilderness", inst: "horn", books: ["Exodus", "Leviticus", "Numbers", "Deuteronomy"] },
    { id: "land", name: "Into the Land", inst: "oud", books: ["Joshua", "Judges", "Ruth"] },
    { id: "kings", name: "The Kings", inst: "lyre", books: ["1 Samuel", "2 Samuel", "1 Kings", "2 Kings", "1 Chronicles", "2 Chronicles", "Ezra", "Nehemiah", "Esther"] },
    { id: "wisdom", name: "Psalms and Wisdom", inst: "dulcimer", books: ["Job", "Psalms", "Proverbs", "Ecclesiastes", "Song of Solomon"] },
    { id: "prophets", name: "The Prophets", inst: "strings", books: ["Isaiah", "Jeremiah", "Lamentations", "Ezekiel", "Daniel", "Hosea", "Joel", "Amos", "Obadiah", "Jonah", "Micah", "Nahum", "Habakkuk", "Zephaniah", "Haggai", "Zechariah", "Malachi"] },
    { id: "gospels", name: "The Gospels", inst: "flute", books: ["Matthew", "Mark", "Luke", "John"] },
    { id: "church", name: "The Early Church", inst: "wood", books: ["Acts", "Romans", "1 Corinthians", "2 Corinthians", "Galatians", "Ephesians", "Philippians", "Colossians", "1 Thessalonians", "2 Thessalonians", "1 Timothy", "2 Timothy", "Titus", "Philemon", "Hebrews", "James", "1 Peter", "2 Peter", "1 John", "2 John", "3 John", "Jude"] },
    { id: "revelation", name: "Revelation", inst: "bells", books: ["Revelation"] },
  ];
  Lamp.ERAS = ERAS;
  Lamp.eraOf = function (story) {
    if (!story) return ERAS[0];
    return ERAS.find((e) => (e.stories && e.stories.includes(story.id)) || (e.books && e.books.includes(story.book))) || ERAS[0];
  };
})();
