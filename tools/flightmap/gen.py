import json, math
W,H=1000,600
LON0,LON1,LAT0,LAT1=-92,44,20,64
K=math.cos(math.radians(44))
def proj(lon,lat):
    x=(lon-LON0)*K; y=lat
    sx=W/((LON1-LON0)*K)
    return ((lon-LON0)*K*sx, (LAT1-lat)*sx)
# make height fit
sx=W/((LON1-LON0)*K); H=round((LAT1-LAT0)*sx)
land=json.load(open("ne/geojson/ne_50m_land.geojson"))
paths=[]
def ring(r):
    pts=[proj(*p[:2]) for p in r]
    if all(x<-40 or x>W+40 or y<-40 or y>H+40 for x,y in pts): return ""
    out=[];last=None
    for x,y in pts:
        if last and abs(x-last[0])+abs(y-last[1])<2.2: continue
        out.append((round(x,1),round(y,1))); last=(x,y)
    if len(out)<3: return ""
    return "M"+"L".join(f"{x:g},{y:g}" for x,y in out)+"Z"
for f in land["features"]:
    g=f["geometry"]; polys=g["coordinates"] if g["type"]=="MultiPolygon" else [g["coordinates"]]
    for poly in polys:
        for r in poly: paths.append(ring(r))
d="".join(p for p in paths if p)
def gc(a,b,n=90):
    def v(lat,lon):
        la,lo=math.radians(lat),math.radians(lon); return (math.cos(la)*math.cos(lo),math.cos(la)*math.sin(lo),math.sin(la))
    A,B=v(*a),v(*b); om=math.acos(sum(i*j for i,j in zip(A,B)))
    pts=[]
    for i in range(n+1):
        t=i/n; s1=math.sin((1-t)*om)/math.sin(om); s2=math.sin(t*om)/math.sin(om)
        x,y,z=[s1*A[k]+s2*B[k] for k in range(3)]
        pts.append(proj(math.degrees(math.atan2(y,x)),math.degrees(math.asin(z))))
    return "M"+"L".join(f"{x:.1f},{y:.1f}" for x,y in pts)
YYZ=(43.68,-79.63); ATH=(37.94,23.94); TLV=(32.01,34.89)
out={"w":W,"h":H,"land":d,"leg1":gc(YYZ,ATH),"leg2":gc(ATH,TLV,30),
 "yyz":proj(YYZ[1],YYZ[0]),"ath":proj(ATH[1],ATH[0]),"tlv":proj(TLV[1],TLV[0]),
 "jer":proj(35.23,31.78)}
open("flightmap/flight.json","w").write(json.dumps(out))
print(W,H,len(d), out["yyz"],out["ath"],out["tlv"])
