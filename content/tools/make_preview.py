#!/usr/bin/env python3
"""Build preview/lamp-preview.html: the original demo, driven by out/levels.json (all stories)."""
import json, re, sys, os
demo_path, levels_path, out_path = sys.argv[1:4]
images_dir = sys.argv[4] if len(sys.argv) > 4 else None  # optional: folder of finished lamp-NNN-id.jpg pictures
html = open(demo_path, encoding="utf-8").read()
data = json.load(open(levels_path, encoding="utf-8"))
imgs = re.findall(r'img:"(data:image[^"]+)"', html)
IMG_A, IMG_B = imgs[0], imgs[1]
start = html.index("const STORIES=[")
end = html.index("];", start) + 2
def extra_images():
    """Finished paintings from images_dir, shrunk to 720 px wide, keyed by story id."""
    out = {}
    if not images_dir:
        return out
    import base64, io
    from PIL import Image
    for f in sorted(os.listdir(images_dir)):
        m = re.match(r"lamp-\d{3}-([a-z]+)\.(jpg|jpeg|png)$", f)
        if not m:
            continue
        im = Image.open(os.path.join(images_dir, f)).convert("RGB").resize((720, 1280))
        buf = io.BytesIO()
        im.save(buf, "JPEG", quality=72, optimize=True)
        out[m.group(1)] = "data:image/jpeg;base64," + base64.b64encode(buf.getvalue()).decode()
    return out


# compact data for the page
stories = []
for s in data["stories"]:
    stories.append({"id": s["id"], "n": s["n"], "title": s["title"], "book": s["book"], "free": s["free"],
                    "key": s["key"], "note": s["note"],
                    "verses": [{"ref": v["display"], "words": v["words"]} for v in s["verses"]],
                    "levels": [{k: v for k, v in lv.items() if k != "id"} for lv in s["levels"]]})
notes = {s["id"]: s["note"] for s in data["stories"]}
daily = [{"ref": d["display"], "words": d["words"], "wheel": d["wheel"], "hide": d["hide"], "bonus": d["bonus"],
          "note": notes[d["story"]]} for d in data["daily"]]
js = ("const IMG_A=" + json.dumps(IMG_A) + ",IMG_B=" + json.dumps(IMG_B) + ";\n"
      "const RAW=" + json.dumps(stories, ensure_ascii=False, separators=(",", ":")) + ";\n"
      "const DAILY=" + json.dumps(daily, ensure_ascii=False, separators=(",", ":")) + ";\n"
      "const PAINT=Object.assign({creation:IMG_A,lamp:IMG_B}," + json.dumps(extra_images()) + ");\n"
      "const STORIES=RAW.map(s=>({...s,img:PAINT[s.id]||'',verse:s.verses[s.key].words,ref:s.verses[s.key].ref}));\n"
      "(function(){const d=new Date(),dn=Math.floor((d-new Date(2026,9,1))/864e5),p=DAILY[((dn%DAILY.length)+DAILY.length)%DAILY.length];\n"
      " STORIES.push({id:'daily',daily:true,title:'Today’s verse',book:'Daily',ref:p.ref,img:IMG_B,verse:p.words,verses:[{ref:p.ref,words:p.words}],key:0,note:p.note,\n"
      "  levels:[{v:0,wheel:p.wheel,hide:p.hide,bonus:p.bonus,tip:'Today’s puzzle. Fewer hints means more lamps on your result.'}]});})();\n"
      "const curV=()=>ST().verses[LEVELS[S.lv].v];")
html = html[:start] + js + html[end:]
rep = [
 # board and flow use the current level's verse and reference
 ("$(\"board\").innerHTML='<div class=\"verse built\">'+words+(S.built?\" \":\"\")+'<span class=\"ghost\">'+rest+'</span></div><div class=\"ref\">'+ST().ref+' · from memory</div>';return}",
  "$(\"board\").innerHTML='<div class=\"verse built\">'+words+(S.built?\" \":\"\")+'<span class=\"ghost\">'+rest+'</span></div><div class=\"ref\">'+curV().ref+' · from memory</div>';return}"),
 ("$(\"board\").innerHTML='<div class=\"verse\">'+boardHTML(L)+'</div><div class=\"ref\">'+ST().ref+'</div>';",
  "$(\"board\").innerHTML='<div class=\"verse\">'+boardHTML(L)+'</div><div class=\"ref\">'+curV().ref+'</div>';"),
 ("<div class=\"r\">'+ST().ref+' · KJV</div>'+(first?", "<div class=\"r\">'+curV().ref+' · KJV</div>'+(first?"),
 ("$(\"play\").innerHTML='<div class=\"howto\" id=\"howto\">'+L.tip+'</div>",
  "$(\"play\").innerHTML='<div class=\"howto\" id=\"howto\">'+(L.tip||(L.hide.length>1?L.hide.length+' words are missing. Find them all.':'One word is missing.'))+'</div>"),
 ("$(\"howto\").textContent=LEVELS[S.lv].tip}}", "$(\"howto\").textContent=LEVELS[S.lv].tip||''}}"),
 # recall: start part-way through long verses
 ("if(!S.order.length){S.order=VERSE.map((w,i)=>i);", "if(!S.order.length){const L=LEVELS[S.lv];S.built=L.from||0;S.order=VERSE.map((w,i)=>i).filter(i=>i>=S.built);"),
 ("$(\"play\").innerHTML='<div class=\"howto\">Now say it from memory. Tap the words in order.</div>",
  "$(\"play\").innerHTML='<div class=\"howto\">'+(LEVELS[S.lv].tip||'Now say it from memory. Tap the words in order.')+'</div>"),
 ("function start(fresh){VERSE=ST().verse;LEVELS=ST().levels;", "function start(fresh){VERSE=ST().verses[ST().levels[S.lv].v].words;LEVELS=ST().levels;if(LEVELS[S.lv].recall&&!S.order.length)S.built=LEVELS[S.lv].from||0;"),
 # chooser: numbered list with book, free tag and a test search box
 ("<h2 style=\"margin-top:14px\">Choose a story</h2>'+STORIES.map((st,i)=>'<button class=\"pick'+(st.daily?\" daily\":\"\")+'\" data-i=\"'+i+'\"><span style=\"background-image:url('+st.img+')\"></span><div><b>'+(st.daily?\"Today’s verse\":st.title)+'</b><small>'+(st.daily?\"One puzzle a day, the same for everyone · share your result\":st.ref+' · '+st.levels.length+' levels')+'</small></div></button>').join(\"\")",
  "<h2 style=\"margin-top:14px\">Choose a story</h2><input id=\"q\" placeholder=\"Find a story, book or verse\" style=\"width:100%;padding:10px 12px;border-radius:12px;border:1px solid #d9cfb4;font:inherit;margin:4px 0 8px;background:#fff\">'+[STORIES.length-1,...STORIES.keys()].filter((i,k)=>k===0||i<STORIES.length-1).map(i=>{const st=STORIES[i];return '<button class=\"pick'+(st.daily?\" daily\":\"\")+'\" data-i=\"'+i+'\" data-s=\"'+(st.title+' '+st.book+' '+st.verses.map(v=>v.ref).join(' ')).toLowerCase()+'\"><span style=\"background-image:url('+st.img+');background-color:#141A33\"></span><div><b>'+(st.daily?\"Today’s verse\":st.n+'. '+st.title)+'</b><small>'+(st.daily?\"One puzzle a day · \"+st.ref:st.verses.map(v=>v.ref).join(', ')+' · '+st.levels.length+' levels'+(st.free?' · free':''))+'</small></div></button>'}).join(\"\")"),
 ("document.querySelectorAll(\".pick\").forEach(b=>b.onclick=()=>{b.closest(\".sheet\").remove();go(+b.dataset.i)});",
  "document.querySelectorAll(\".pick\").forEach(b=>b.onclick=()=>{b.closest(\".sheet\").remove();go(+b.dataset.i)});$(\"q\").oninput=e=>{const q=e.target.value.toLowerCase().trim();document.querySelectorAll(\".pick\").forEach(b=>b.style.display=!q||(b.dataset.s||'').includes(q)?'':'none')};"),
 ("Lamp · test</div>", "Lamp · level preview · all 149 stories</div>"),
]
for a, b in rep:
    if a not in html:
        sys.exit("patch not found: " + a[:90])
    html = html.replace(a, b)
html = re.sub(r"<title>.*?</title>", "<title>Lamp Level Preview</title>", html, count=1, flags=re.S)
open(out_path, "w", encoding="utf-8").write(html)
print(f"{out_path}: {os.path.getsize(out_path)//1024} KB")
