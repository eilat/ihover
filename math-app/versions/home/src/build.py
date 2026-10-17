"""Build the home screen: inline characters.js and room.js into home.html.
Usage: python3 -I build.py [out_file]  (default: ../index.html)"""
import os, sys
SRC=os.path.dirname(os.path.abspath(__file__))
OUT=sys.argv[1] if len(sys.argv)>1 else os.path.join(SRC,'..','index.html')
rd=lambda f: open(os.path.join(SRC,f),encoding='utf8').read()
t=rd('home.html').replace('/*CHARACTERS*/',rd('characters.js')).replace('/*ROOM*/',rd('room.js'))
open(OUT,'w',encoding='utf8').write(t)
print('built',OUT)
