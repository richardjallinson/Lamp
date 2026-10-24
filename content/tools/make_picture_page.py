#!/usr/bin/env python3
"""Build preview/lamp-pictures.html (the picture prompt list page) from out/picture-list.csv."""
import csv, json, sys
import os
rows = list(csv.DictReader(open(sys.argv[1], encoding="utf-8")))
images_dir = sys.argv[4] if len(sys.argv) > 4 else None  # optional: finished pictures count as made
done = set()
if images_dir:
    done = {os.path.splitext(f)[0] for f in os.listdir(images_dir) if f.startswith("lamp-")}
data = [{"n": int(r["n"]), "batch": r["batch"], "file": r["file"], "book": r["book"], "story": r["story"],
         "ref": r["key verse"], "draw": r["what to draw"], "have": r["status"] == "have" or os.path.splitext(r["file"])[0] in done, "prompt": r["full prompt"]} for r in rows]
TEMPLATE = open(sys.argv[3], encoding="utf-8").read()
open(sys.argv[2], "w", encoding="utf-8").write(TEMPLATE.replace("/*DATA*/[]", json.dumps(data, ensure_ascii=False)))
print(len(data), "pictures")
