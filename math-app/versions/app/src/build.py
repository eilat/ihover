"""Build the joined prototype: lessons map (index.html), the lesson and the home, sharing one top bar.
All three pages live side by side so they share the browser's storage.
Usage: python3 -I build.py [out_dir]  (default: ..)"""
import os, sys
SRC=os.path.dirname(os.path.abspath(__file__))
OUT=sys.argv[1] if len(sys.argv)>1 else os.path.join(SRC,'..')
rd=lambda f: open(os.path.join(SRC,f),encoding='utf8').read()
parts={'/*SHELL_CSS*/':rd('shell.css'),'/*SHELL*/':rd('shell.js'),'/*CHARACTERS*/':rd('characters.js'),'/*ROOM*/':rd('room.js'),'/*GIRL*/':rd('girl.js')}
for src,out in [('lessons.html','index.html'),('lesson.html','lesson.html'),('home.html','home.html')]:
    t=rd(src)
    for k,v in parts.items(): t=t.replace(k,v)
    open(os.path.join(OUT,out),'w',encoding='utf8').write(t)
print('built',OUT)
