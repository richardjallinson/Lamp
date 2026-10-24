#!/usr/bin/env python3
"""Build preview/lamp-pictures.html (the picture prompt list page) from out/picture-list.csv."""
import csv, json, sys
rows = list(csv.DictReader(open(sys.argv[1], encoding="utf-8")))
data = [{"n": int(r["n"]), "batch": r["batch"], "file": r["file"], "book": r["book"], "story": r["story"],
         "ref": r["key verse"], "draw": r["what to draw"], "have": r["status"] == "have", "prompt": r["full prompt"]} for r in rows]
TEMPLATE = open(sys.argv[3], encoding="utf-8").read()
open(sys.argv[2], "w", encoding="utf-8").write(TEMPLATE.replace("/*DATA*/[]", json.dumps(data, ensure_ascii=False)))
print(len(data), "pictures")
