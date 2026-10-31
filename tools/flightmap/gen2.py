import json
c=json.load(open("ne/geojson/ne_110m_admin_0_countries.geojson"))
rings=[]
for f in c["features"]:
    g=f["geometry"]; polys=g["coordinates"] if g["type"]=="MultiPolygon" else [g["coordinates"]]
    for poly in polys:
        r=poly[0]; out=[]; last=None
        for lon,lat in r:
            p=(round(lon*10),round(lat*10))
            if last and abs(p[0]-last[0])+abs(p[1]-last[1])<3: continue
            out+= [p[0],p[1]]; last=p
        if len(out)>=6: rings.append(out)
s=json.dumps(rings,separators=(",",":"))
open("flightmap/world.json","w").write(s); print(len(rings),len(s))
