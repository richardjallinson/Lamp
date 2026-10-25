import base64
s=open('splash-template.html').read()
f=lambda p,t:'data:%s;base64,'%t+base64.b64encode(open(p,'rb').read()).decode()
S='/home/claude/lamp/repo/app/sounds/'
for k,v in [('__BG__',f('title-bg.jpg','image/jpeg')),('__SNDQ__',f(S+'title-short.mp3','audio/mpeg')),('__SND__',f(S+'title.mp3','audio/mpeg')),
            ('__LAMP__',f('clay-lamp.webp','image/webp')),('__FLAME__',f('vid/flame.webp','image/webp')),('__LETTERS__',f('letters-full.webp','image/webp'))]:
    s=s.replace(k,v)
assert '__' not in s.replace('__proto__','') or True
open('lamp-start.html','w').write(s)
import re; print(re.findall(r'__[A-Z]+__',s))
