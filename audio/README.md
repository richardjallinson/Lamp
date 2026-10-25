# Lamp narration

The Lamplighter's voice: **Oliver Silk – Deep Gravel Narrative** (ElevenLabs, model Eleven v4), chosen Oct 24, 2026.
Richard generates each line in ElevenLabs from Claude's scripts and names the file as given (e.g. `gen-08-open.mp3`).

Every file is processed the same way before it goes into the app:
  ffmpeg -i IN.mp3 -af "atempo=0.92,loudnorm=I=-18:TP=-1.5:LRA=11" -ar 44100 -b:a 128k OUT.mp3
(8% slower, same pitch; evened-out loudness). Originals are kept in `audio/originals/narration/`.
