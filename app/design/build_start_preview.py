import base64
s=open('splash-template.html').read()
f=lambda p,t:'data:%s;base64,'%t+base64.b64encode(open(p,'rb').read()).decode()
open('lamp-start.html','w').write(s.replace('__BG__',f('title-bg.jpg','image/jpeg')).replace('__SND__',f('/home/claude/lamp/repo/app/sounds/title.mp3','audio/mpeg')).replace('__LAMP__',f('clay-lamp.webp','image/webp')).replace('__FLAME__',f('vid/flame.webp','image/webp')))
