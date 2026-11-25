import re,sys,os
SRC,OUT=sys.argv[1],sys.argv[2]
s=open(SRC,encoding='utf-8').read()

# 1. drop the old shelf/tab/item/buy rules and the old phone block
drop=('.shelves{','.tabs{','.tab{','.tab[aria-selected','.items{','.item{','.item:hover','.item[aria-pressed','.item img','.item b{','.price{','.price .cur','.item.owned','.item.trying','.buy{','.buy.on','.buy b{','.buy .btn','.buy .need')
lines=[l for l in s.split('\n') if not l.startswith(drop)]
s='\n'.join(lines)
s=re.sub(r"@media \(max-width:900px\)\{\n(?:  .*\n)+\}\n","",s)

# 2. new scene markup
old=s[s.index('  <div class="scene" id="scene">'):s.index('  <div class="actions"><button class="btn" id="undress">')]
new='''  <div class="scene" id="scene">
    <div class="calm"></div><div class="calm b"></div>
    <div class="amb" id="amb"></div>
    <div class="hots" id="hots"></div>
    <div class="me"><div class="fig" id="stage" role="img"></div></div>
    <div class="say" id="say" aria-live="polite"></div>
    <nav class="door" id="tabs" role="tablist" aria-label="סוגי בגדים"></nav>
    <div class="items" id="items"></div>
    <div class="buy" id="buy" aria-live="polite"></div>
  </div>
'''
s=s.replace(old,new)

# 3. tabs with a picture, items with hanger and tag, hang/shelf mode
s=s.replace("""  $('tabs').innerHTML=TABS.map(([k,t])=>`<button class="tab" role="tab" data-tab="${k}" aria-selected="${k===st.tab}">${t}</button>`).join('');""",
"""  $('tabs').innerHTML=TABS.map(([k,t,kinds])=>{ const pic=ITEMS.find(i=>kinds.includes(i.kind)); return `<button class="tab" role="tab" data-tab="${k}" aria-selected="${k===st.tab}"><img src="thumb/${pic.id}.webp" alt=""><span>${t}</span></button>`; }).join('');""")
s=s.replace("""  $('items').innerHTML=ITEMS.filter(i=>kinds.includes(i.kind)).map(i=>{""",
"""  $('items').className='items '+(kinds.some(k=>HANG.has(k))?'hang':'shelf');
  $('items').innerHTML=ITEMS.filter(i=>kinds.includes(i.kind)).map(i=>{""")
s=s.replace("""<button class="item${own?' owned':''}${i.id===trying?' trying':''}" data-item="${i.id}" aria-pressed="${w.worn.includes(i.id)}"><span class="price">${own?'✓ שלי':coin()+i.price}</span><img src="thumb/${i.id}.webp" alt=""><b>${i.en}</b></button>""",
"""<button class="item${own?' owned':''}${i.id===trying?' trying':''}" data-item="${i.id}" aria-pressed="${w.worn.includes(i.id)}">${HANGER}<img src="thumb/${i.id}.webp" alt=""><b>${i.en}</b><span class="price">${own?'✓ שלי':coin()+i.price}</span></button>""")
# buy panel text: friendlier, one question
s=s.replace("""    b.innerHTML=`<b>${it.en}</b> <span>${coin()} ${it.price}</span>`+(need>0""","""    b.innerHTML=`<span class="q">${BUYQ}</span><b>${it.en}</b><span class="cost">${coin()} ${it.price}</span>`+(need>0""")
assert 'HANGER' in s and 'BUYQ' in s and 'class="door"' in s

COMMON_CSS='''
/* ---- shared layout of the redesigned wardrobe (positions are % of the attic picture, 1672x941) ---- */
.calm{position:absolute;inset:0;pointer-events:none;z-index:1}
.calm.b{display:none}
.amb{position:absolute;inset:0;pointer-events:none;z-index:2}
.hots{position:absolute;inset:0;z-index:2}
.scene .me{z-index:3;pointer-events:none}.scene .me .fig{pointer-events:auto}
.say{z-index:6}
.door{position:absolute;z-index:4;display:flex;flex-direction:column}
.tab{position:relative;display:flex;align-items:center;justify-content:center;gap:6px;border:0;background:none;padding:0;color:var(--ink);isolation:isolate}
.tab img{display:none}
.items{position:absolute;z-index:4;left:48.6%;right:17.6%;top:39.4%;bottom:40.6%;display:flex;gap:1.4%;justify-content:center}
.items.hang{align-items:flex-start}.items.shelf{align-items:flex-end}
.item{position:relative;flex:0 1 23%;max-width:25%;height:100%;display:flex;flex-direction:column;align-items:center;justify-content:flex-end;border:0;background:none;padding:0;color:inherit}
.items.hang .item{justify-content:flex-start}
.item img{width:100%;flex:1;min-height:0;object-fit:contain;transition:transform .15s}
.item:hover img{transform:translateY(-3px)}
.item b{font-family:"Andika",sans-serif;direction:ltr;unicode-bidi:isolate;font-size:clamp(11px,1vw,14px);line-height:1.1}
.hanger{display:none}
.price{position:absolute;white-space:nowrap}
.price .cur{width:1.1em;height:1.1em;vertical-align:-.2em}
.buy{position:absolute;z-index:5;display:none;align-items:center;gap:8px;flex-wrap:wrap}
.buy.on{display:flex}
.buy b{font-family:"Andika",sans-serif;direction:ltr;unicode-bidi:isolate}
.buy .need{font-size:14px;font-weight:600}
.hot{position:absolute;border:0;padding:0;background:transparent;border-radius:45%;cursor:pointer}
.hot:hover,.hot:focus-visible{background:radial-gradient(closest-side,rgba(255,226,150,.38),transparent)}
.flame{position:absolute;width:3.2%;aspect-ratio:1;translate:-50% -50%;border-radius:50%;background:radial-gradient(closest-side,rgba(255,214,120,.75),rgba(255,170,60,.25) 55%,transparent);mix-blend-mode:screen;animation:flick 2.3s infinite}
.flame:nth-child(2n){animation-duration:1.7s;animation-delay:-.6s}
@keyframes flick{0%,100%{opacity:.75;scale:1}20%{opacity:1;scale:1.12}45%{opacity:.6;scale:.92}70%{opacity:.95;scale:1.05}}
.glowup{animation:glowup 1.4s ease-out}
@keyframes glowup{40%{opacity:1;scale:2.2}}
.purr{position:absolute;font:700 clamp(14px,1.6vw,22px) "Andika",sans-serif;color:#fff;text-shadow:0 2px 0 #2B1D2E;pointer-events:none;animation:purr 1.6s ease-out forwards;direction:ltr}
@keyframes purr{from{opacity:0;translate:0 0}20%{opacity:1}to{opacity:0;translate:10px -50px}}
.shine{position:absolute;pointer-events:none;overflow:hidden;border-radius:8px}
.shine::after{content:"";position:absolute;inset:-20% -60%;background:linear-gradient(105deg,transparent 40%,rgba(255,255,255,.55) 50%,transparent 60%);animation:shine 1.2s ease-out forwards}
@keyframes shine{from{translate:-60% 0}to{translate:60% 0}}
.flybat{position:absolute;width:5%;pointer-events:none;animation:flybat 2.6s ease-in forwards}
.flybat svg{width:100%;animation:flutter .18s infinite alternate}
@keyframes flutter{to{transform:scaleY(.45)}}
@keyframes flybat{to{translate:-55vw 6vw;scale:.6;opacity:.2}}
.spider{position:absolute;left:96.4%;top:11%;width:1.6%;aspect-ratio:1;pointer-events:none}
.spider::before{content:"";position:absolute;left:50%;bottom:60%;height:0;border-left:1.5px solid rgba(255,240,210,.8)}
.spider i{position:absolute;inset:0;border-radius:50%;background:#2B1D2E;box-shadow:0 0 0 2px rgba(255,240,210,.6)}
.spider.go{animation:drop 2.8s ease-in-out}
.spider.go::before{animation:thread 2.8s ease-in-out}
@keyframes drop{45%,60%{translate:0 2200%}}
@keyframes thread{45%,60%{height:2200%}}
.still .flame,.still .flybat,.still .spider,.still .purr,.still .shine::after{animation:none!important}
@media (prefers-reduced-motion:reduce){.flame,.flybat,.spider,.purr,.shine::after,.glowup{animation:none!important}}
'''

COMMON_JS='''
/* ---- clickable surprises in the room: each one says its English word ---- */
const HANG=new Set(['dress','top','skirt','wings']);
function sparkleAt(x,y,n=6){
  if(st.still||matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const sc=$('scene');
  for(let i=0;i<n;i++){ const sp=document.createElement('span'); sp.className='spark'; sp.textContent=i%2?'✨':'⭐';
    sp.style.left=`calc(${x}% + ${Math.random()*40-20}px)`; sp.style.top=`calc(${y}% + ${Math.random()*30-15}px)`; sp.style.zIndex=6;
    sp.style.setProperty('--dx',(Math.random()*90-45)+'px'); sp.style.setProperty('--dy',(-30-Math.random()*60)+'px'); sp.style.animationDelay=(i*70)+'ms';
    sc.appendChild(sp); setTimeout(()=>sp.remove(),1600); }
}
const FX={
  purr:h=>{ const p=document.createElement('span'); p.className='purr'; p.textContent='purr...'; p.style.left=(h.x+h.w*.5)+'%'; p.style.top=(h.y)+'%'; $('scene').appendChild(p); setTimeout(()=>p.remove(),1700); },
  glow:h=>{ document.querySelectorAll(`.flame[data-of="${h.id}"]`).forEach(f=>{ f.classList.remove('glowup'); void f.offsetWidth; f.classList.add('glowup'); }); },
  shine:h=>{ const d=document.createElement('div'); d.className='shine'; Object.assign(d.style,{left:h.x+'%',top:h.y+'%',width:h.w+'%',height:h.h+'%',zIndex:2}); $('scene').appendChild(d); setTimeout(()=>d.remove(),1300); },
  sparkle:h=>sparkleAt(h.x+h.w/2,h.y+h.h/3,8),
  bat:h=>flyBat(h.x+h.w/2,h.y+h.h/2),
  spider:()=>{ const s=document.querySelector('.spider'); if(!s) return; s.classList.remove('go'); void s.offsetWidth; s.classList.add('go'); },
  note:h=>{ sparkleAt(h.x+h.w/2,h.y+h.h/3,8); $('say').textContent=h.word+' ✨'; },
};
const BAT='<svg viewBox="0 0 64 30" aria-hidden="true"><path d="M32 10c-1.5-3-5-3.5-7-1.5C21 3 13 1 2 3c6 3 9 8 9 14 4-3 9-3 12 1 2-3 5-4 9-4s7 1 9 4c3-4 8-4 12-1 0-6 3-11 9-14-11-2-19 0-23 5.5-2-2-5.5-1.5-7 1.5z" fill="#2B1D2E"/><circle cx="29.5" cy="11" r="1" fill="#F6D27A"/><circle cx="34.5" cy="11" r="1" fill="#F6D27A"/></svg>';
function flyBat(x,y){
  if(st.still||matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const b=document.createElement('div'); b.className='flybat'; b.innerHTML=BAT; b.style.left=x+'%'; b.style.top=y+'%'; b.style.zIndex=6;
  $('scene').appendChild(b); setTimeout(()=>b.remove(),2700);
}
function buildRoom(){
  $('hots').innerHTML=HOTS.map(h=>`<button class="hot" data-hot="${h.id}" aria-label="${h.he}" title="${h.he}" style="left:${h.x}%;top:${h.y}%;width:${h.w}%;height:${h.h}%"></button>`).join('');
  $('amb').innerHTML=FLAMES.map(([x,y,of])=>`<div class="flame" data-of="${of}" style="left:${x}%;top:${y}%"></div>`).join('')+(HOTS.some(h=>h.fx==='spider')?'<div class="spider"><i></i></div>':'');
}
document.addEventListener('click',e=>{
  const t=e.target.closest('[data-hot]'); if(!t) return;
  const h=HOTS.find(x=>x.id===t.dataset.hot); $('say').textContent=h.word; speak(h.word); (FX[h.fx]||(()=>{}))(h);
});
/* a small twinkle now and then on one surprise, so the girls discover there is something to tap */
setInterval(()=>{ if(document.hidden||!st.me) return; const h=HOTS[Math.floor(Math.random()*HOTS.length)]; sparkleAt(h.x+h.w/2,h.y+h.h/2,1); if(AMBIENT_BAT&&Math.random()<.35) flyBat(78,10); },HINT_EVERY);
'''

HOTSPOTS={
 'cat':"{id:'cat',word:'a black cat',he:'החתול',x:7,y:61,w:10.5,h:12,fx:'purr'}",
 'candles':"{id:'candles',word:'candles',he:'הנרות',x:0.5,y:65,w:6.5,h:12,fx:'glow'}",
 'mirror':"{id:'mirror',word:'a mirror',he:'המראה',x:1,y:30,w:11.5,h:30,fx:'shine'}",
 'chest':"{id:'chest',word:'a treasure chest',he:'תיבת האוצר',x:0.5,y:84,w:12,h:15,fx:'sparkle'}",
 'chestnote':"{id:'chest',word:'a treasure chest',he:'תיבת האוצר',x:0.5,y:84,w:12,h:15,fx:'note'}",
 'lantern':"{id:'lantern',word:'a lantern',he:'הפנס',x:74.6,y:5,w:5,h:17,fx:'glow'}",
 'bat':"{id:'bat',word:'a bat',he:'העטלף',x:66,y:3.5,w:9,h:10,fx:'bat'}",
 'web':"{id:'web',word:'a spider',he:'קורי העכביש',x:93.5,y:1,w:6.2,h:18,fx:'spider'}",
 'moon':"{id:'moon',word:'the moon',he:'הירח',x:47.5,y:0,w:6,h:8,fx:'sparkle'}",
}
FL_CANDLES="[2.4,71,'candles'],[4.4,68.6,'candles'],[16.5,57.6,'cat'],[18.4,62.4,'cat']"
FL_LANTERN="[77.2,15.5,'lantern']"

V={}
V[1]=dict(name='שלטי עץ על הדלת',concept='שלטים מגולפים על הדלת, בגדים תלויים על המוט, פתק קלף לקנייה במדף התחתון, החדר מעומעם בצד.',
 hots=['cat','candles','mirror','chest'],flames=FL_CANDLES,bat='false',hint=20000,
 hanger='<svg class="hanger" viewBox="0 0 60 26" aria-hidden="true"><path d="M30 13V9a4 4 0 1 0-4-4" fill="none" stroke="#2B1D2E" stroke-width="2.4" stroke-linecap="round"/><path d="M30 13 4 23h52z" fill="none" stroke="#7A4A22" stroke-width="3.2" stroke-linejoin="round"/><path d="M30 13 4 23h52z" fill="none" stroke="#2B1D2E" stroke-width="1" stroke-linejoin="round"/></svg>',
 buyq='לקנות את זה?',
 css='''
/* V1: carved wooden plaques on the open door; clothes hang from the rail; parchment note on the bottom cubbies */
.calm{backdrop-filter:saturate(.5) brightness(.8);-webkit-mask-image:linear-gradient(90deg,#000 0 10%,rgba(0,0,0,.7) 28%,transparent 46%);mask-image:linear-gradient(90deg,#000 0 10%,rgba(0,0,0,.7) 28%,transparent 46%)}
.door{left:87.2%;right:2.6%;top:16%;bottom:8%;gap:2.2%;justify-content:flex-start}
@media (max-width:1120px){.buy .q{display:none}}
.tab{flex:0 0 auto;min-height:max(40px,8.6%);padding:0 6%;background:#2B1D2E;clip-path:polygon(10% 0,90% 0,100% 25%,100% 75%,90% 100%,10% 100%,0 75%,0 25%);font:700 clamp(15px,1.55vw,23px)/1 "Karantina",system-ui,sans-serif;transition:transform .15s}
.tab::before{content:"";position:absolute;inset:3px;z-index:-1;background:linear-gradient(#F2B577,#C8743C 70%,#A9592C);clip-path:inherit}
.tab::after{content:"";position:absolute;inset:0;pointer-events:none;background:radial-gradient(circle at 9% 50%,#FBE3A0 0 2.5px,#6B4A1A 3.5px,transparent 4.5px),radial-gradient(circle at 91% 50%,#FBE3A0 0 2.5px,#6B4A1A 3.5px,transparent 4.5px)}
.tab:hover{transform:translateX(-4px)}
.tab[aria-selected="true"]{color:#5A1830;transform:translateX(-8px) scale(1.04)}
.tab[aria-selected="true"]::before{background:linear-gradient(#FFE9A6,#E6B53A 70%,#C28F22)}
.items.hang .hanger{display:block;width:62%;flex:0 0 auto;margin-top:-3%;margin-bottom:-6%;position:relative;z-index:1}
.items.hang .item{padding-top:0}
.item img{filter:drop-shadow(0 4px 2px rgba(20,8,20,.45))}
.item[aria-pressed="true"] img{filter:drop-shadow(0 0 5px #FFE08A) drop-shadow(0 0 2px #FFE08A)}
.item.trying img{filter:drop-shadow(0 0 6px #F6A6C0) drop-shadow(0 0 2px #fff)}
.item b{color:#FBEFD5;text-shadow:0 1px 0 #2B1D2E,0 0 4px #2B1D2E}
.price{top:16%;left:-6%;transform:rotate(-10deg);background:#F4E7C8;border:2px solid #2B1D2E;border-radius:3px 12px 12px 3px;padding:0 7px 0 12px;font:600 12px/20px "Rubik",sans-serif}
.price::before{content:"";position:absolute;left:4px;top:50%;width:5px;height:5px;margin-top:-2.5px;border-radius:50%;background:#2B1D2E}
.item.owned .price{background:#D8E9BF}
.buy{left:48.8%;right:17.8%;top:70.6%;bottom:18.4%;justify-content:center;gap:6px;padding:2px 10px;flex-wrap:nowrap;background:#F4E7C8;border:2.5px solid #2B1D2E;border-radius:6px;transform:rotate(-.8deg);box-shadow:0 6px 0 rgba(30,10,20,.35)}
.buy::before{content:"";position:absolute;top:-7px;left:50%;width:13px;height:13px;margin-left:-6px;border-radius:50%;background:radial-gradient(circle at 35% 35%,#F7A1B5,#8C3550);border:2px solid #2B1D2E}
.buy .q{font:700 clamp(18px,1.8vw,24px)/1 "Karantina",sans-serif}
.buy b{font-size:clamp(14px,1.3vw,18px)}
.buy .cost{font-weight:600}
.buy .btn{min-height:36px;white-space:nowrap;border-radius:6px;border:2.5px solid #2B1D2E;background:linear-gradient(#F2B577,#C8743C);font-weight:600;padding:2px 14px}
.buy .btn.primary{background:linear-gradient(#FFE9A6,#E6B53A);color:#2B1D2E}
.buy .need{color:#8C3550}
'''),
V[2]=dict(name='תוויות פליז עם תמונה',concept='על הדלת לוחיות פליז עם ציור קטן ומילה, כל בגד בתא עץ משלו, וכפתור קנייה גדול על המגירות. החדר מטושטש והארון חד.',
 hots=['chestnote','mirror','lantern','cat'],flames=FL_CANDLES+","+FL_LANTERN,bat='false',hint=24000,hanger='',buyq='',
 css='''
/* V2: brass label plates with a picture; every item in its own wooden cubby; a brass buy plate on the drawers */
.calm{backdrop-filter:blur(2.4px) saturate(.7);-webkit-mask-image:linear-gradient(90deg,#000 0 44%,transparent 46.5%);mask-image:linear-gradient(90deg,#000 0 44%,transparent 46.5%)}
.calm.b{display:block;left:44%;right:13%;bottom:auto;height:22%;backdrop-filter:blur(2.4px) saturate(.7);-webkit-mask-image:linear-gradient(#000 60%,transparent);mask-image:linear-gradient(#000 60%,transparent)}
.door{left:87%;right:2.4%;top:18%;bottom:18%;gap:2.6%;justify-content:flex-start}
.tab{flex:0 0 auto;min-height:max(46px,9.4%);justify-content:flex-start;padding:3px 5px;background:linear-gradient(#F8DE95,#C9952F);border:2.5px solid #2B1D2E;border-radius:4px;box-shadow:inset 0 0 0 2px rgba(255,248,220,.65),0 3px 0 #2B1D2E;font:600 clamp(11px,1vw,14px)/1.1 "Rubik",sans-serif;text-align:right;transition:transform .15s}
.tab img{display:block;width:clamp(26px,2.6vw,38px);height:clamp(26px,2.6vw,38px);flex:0 0 auto;object-fit:contain;background:#F4E7C8;border:1.5px solid #6B4A1A;border-radius:3px;padding:1px}
.tab:hover{transform:translateX(-4px)}
.tab[aria-selected="true"]{transform:translateX(-10px);background:linear-gradient(#FFF1C4,#E6B53A);box-shadow:inset 0 0 0 2px #fff,0 0 0 3px #8C3550,0 3px 0 #2B1D2E;color:#5A1830}
.items{top:39%;bottom:41%;gap:1.6%}
.items.hang,.items.shelf{align-items:stretch}
.item{background:linear-gradient(#6A3A30,#3E2025);border:3px solid #2B1D2E;border-radius:6px;box-shadow:inset 0 8px 12px rgba(0,0,0,.55);padding:8px 4px 16px;justify-content:space-between}
.item:hover{box-shadow:inset 0 8px 12px rgba(0,0,0,.55),0 0 0 3px #F8DE95}
.item[aria-pressed="true"]{box-shadow:inset 0 8px 12px rgba(0,0,0,.4),0 0 0 3px #E6B53A,0 0 14px #E6B53A}
.item.trying{box-shadow:inset 0 8px 12px rgba(0,0,0,.4),0 0 0 3px #F6A6C0}
.item img{flex:none;width:100%;height:clamp(44px,5vw,70px)}\n.item b{font-size:clamp(11px,.95vw,13px)}
.item b{color:#FBEFD5}
.price{bottom:-11px;left:50%;translate:-50% 0;background:radial-gradient(circle at 35% 30%,#FFF1C4,#E6B53A 60%,#B9861E);border:2px solid #2B1D2E;border-radius:999px;padding:0 8px;font:700 12px/20px "Rubik",sans-serif}
.item.owned .price{background:#D8E9BF}
.buy{left:50.5%;right:19.6%;top:83%;bottom:9.4%;justify-content:center;flex-wrap:nowrap;white-space:nowrap;padding:2px 10px;background:linear-gradient(#F8DE95,#C9952F);border:2.5px solid #2B1D2E;border-radius:6px;box-shadow:inset 0 0 0 2px rgba(255,248,220,.6),0 4px 0 #2B1D2E}
.buy .q{display:none}
.buy b{font-size:clamp(13px,1.2vw,16px)}
.buy .cost{font-weight:700}
.buy .btn{min-height:36px;border-radius:5px;border:2.5px solid #2B1D2E;background:#F4E7C8;font-weight:600;padding:0 12px}
.buy .btn.primary{background:#8C3550;color:#fff;font-size:17px}
.buy .need{color:#5A1830}
'''),
V[3]=dict(name='תגיות קלף בלילה',concept='תגיות קלף בכתב יד תלויות בחוטים על הדלת, הבגדים מרחפים במדף, הדמות שואלת בבועה אם לקנות. החדר בחושך עם פנס על הדמות ועל הארון.',
 hots=['bat','web','moon','lantern','cat'],flames=FL_CANDLES+","+FL_LANTERN,bat='true',hint=18000,hanger='',buyq='רוצה את זה?',
 css='''
/* V3: night. Parchment tags on strings; floating items; the character asks in a speech bubble */
@import url("https://fonts.googleapis.com/css2?family=Amatic+SC:wght@700&display=swap");
.calm{background:radial-gradient(ellipse 22% 48% at 29% 56%,rgba(255,220,150,.10),transparent 70%),radial-gradient(ellipse 58% 70% at 50% 56%,transparent 42%,rgba(12,4,24,.72) 100%),linear-gradient(rgba(14,5,26,.22),rgba(14,5,26,.22))}
.flame{width:4.4%}
.door{left:87.4%;right:2.8%;top:15%;bottom:15%;gap:3.2%;justify-content:flex-start;align-items:center;padding-top:2%;border-top:2px solid rgba(43,29,46,.9)}
.tab{flex:0 0 auto;min-height:max(42px,8%);width:86%;padding:2px 6px 0;background:#F4E7C8;border:2px solid #2B1D2E;border-radius:3px 3px 14px 14px;font:700 clamp(19px,1.9vw,27px)/1 "Amatic SC","Karantina",sans-serif;transform:rotate(var(--r,2deg));transform-origin:50% -12px;box-shadow:0 3px 0 rgba(20,8,20,.4)}
.tab:nth-child(2n){--r:-2.5deg}
.tab::before{content:"";position:absolute;top:-12px;left:50%;height:12px;border-left:1.5px solid #2B1D2E}
.tab::after{content:"";position:absolute;top:4px;left:50%;width:6px;height:6px;margin-left:-3px;border-radius:50%;background:#2B1D2E}
.tab span{margin-top:6px}
.tab:hover{animation:swing .9s ease-in-out}
@keyframes swing{30%{transform:rotate(-6deg)}65%{transform:rotate(4deg)}}
.tab[aria-selected="true"]{background:#8C3550;color:#FBEFD5}
.tab[aria-selected="true"]::after{background:#FBEFD5}
.items.hang,.items.shelf{align-items:flex-end}
.item img{animation:bobble 3.4s ease-in-out infinite;filter:drop-shadow(0 0 8px rgba(255,236,190,.45))}
.item:nth-child(2n) img{animation-delay:-1.7s}
@keyframes bobble{50%{translate:0 -5px}}
.item::after{content:"";width:70%;height:7px;margin-top:2px;border-radius:50%;background:radial-gradient(closest-side,rgba(255,226,150,.55),transparent)}
.item[aria-pressed="true"] img{filter:drop-shadow(0 0 6px #FFE08A) drop-shadow(0 0 12px #FFE08A)}
.item.trying img{filter:drop-shadow(0 0 8px #F6A6C0)}
.item b{color:#FBEFD5;font:700 clamp(15px,1.5vw,20px)/1 "Amatic SC",sans-serif;text-shadow:0 0 6px #2B1D2E}
.price{position:static;margin-top:2px;font:700 clamp(16px,1.5vw,21px)/1 "Amatic SC",sans-serif;color:#FFE08A;text-shadow:0 0 4px #2B1D2E,0 1px 0 #2B1D2E}
.item.owned .price{color:#CFE7A8}
.buy{left:.8%;width:15.6%;top:30%;flex-direction:column;align-items:stretch;gap:6px;padding:10px 12px;background:#F4E7C8;border:2.5px solid #2B1D2E;border-radius:18px;text-align:center;box-shadow:0 6px 0 rgba(10,4,16,.5)}
.buy::after{content:"";position:absolute;right:-16px;top:38%;border:9px solid transparent;border-left:16px solid #2B1D2E}
.buy .q{font:700 clamp(22px,2.1vw,30px)/1 "Amatic SC",sans-serif}
.buy b{font-size:clamp(14px,1.25vw,17px)}
.buy .cost{font-weight:700;font-size:18px}
.buy .btn{min-height:40px;border-radius:12px;border:2.5px solid #2B1D2E;background:transparent;font-weight:600}
.buy .btn.primary{background:#8C3550;color:#fff}
.buy .need{color:#8C3550}
.still .item img{animation:none}
@media (prefers-reduced-motion:reduce){.item img,.tab:hover{animation:none}}
'''),
os.makedirs(OUT,exist_ok=True)
for k,v in V.items():
  v=v[0] if isinstance(v,tuple) else v
  t=s
  hots=',\n  '.join(HOTSPOTS[h] for h in v['hots'])
  js=(f"const HOTS=[\n  {hots}\n];\nconst FLAMES=[{v['flames']}];\nconst AMBIENT_BAT={v['bat']}, HINT_EVERY={v['hint']};\nconst HANGER='{v['hanger']}';\nconst BUYQ='{v['buyq']}';\n")+COMMON_JS
  t=t.replace("const SWITCH_PRICE=5, START=40;",js+"const SWITCH_PRICE=5, START=40;")
  t=t.replace("draw();\n}\n</script>","buildRoom();\ndraw();\n}\n</script>")
  css=COMMON_CSS+v['css']
  imp=re.findall(r'@import url\("[^"]+"\);',css)
  for i in imp: css=css.replace(i,'')
  t=t.replace("</style>",css+"</style>")
  for i in imp: t=t.replace("<style>","<style>\n"+i,1)
  t=t.replace("<title>ארון הבגדים</title>",f"<title>ארון הבגדים · גרסה {k}: {v['name']}</title>")
  # assets live two folders up in the published artifact
  t=re.sub(r'(["\'`(])(img|thumb)/',r'\1../../\2/',t).replace('url("attic.webp")','url("../../attic.webp")')
  open(f"{OUT}/v{k}.html",'w',encoding='utf-8').write(t)
  print('v',k,len(t))
import json
json.dump({k:{'name':(v[0] if isinstance(v,tuple) else v)['name'],'concept':(v[0] if isinstance(v,tuple) else v)['concept']} for k,v in V.items()},open(f"{OUT}/meta.json",'w'),ensure_ascii=False)

# ---- version 3b (V4): night + hangers + worms; also written as the real wardrobe page when argv[3]=='main' ----
FL=FL_CANDLES+","+FL_LANTERN
V4=dict(name='לילה עם קולבים',concept='החדר והתגיות מגרסה 3, הבגדים על קולבים ופתק הקנייה במדף התחתון כמו בגרסה 1, במסגרת קלף של הלילה. בלי עטלף ועכביש. הכסף: ערמת תולעים.',
 hots=['cat','candles','mirror','chest','lantern','moon'],flames=FL,bat='false',hint=20000,hanger=V[1][0]['hanger'],buyq='רוצה את זה?',
 css=open(os.path.join(os.path.dirname(os.path.abspath(__file__)),'v4.css'),encoding='utf-8').read())
def W(cls,d,hx,hy):
  return (f'<g class="w {cls}"><path d="{d}" fill="none" stroke="#2B1D2E" stroke-width="7" stroke-linecap="round"/>'
   f'<path d="{d}" fill="none" stroke="#EE93AE" stroke-width="4.4" stroke-linecap="round"/>'
   f'<path d="{d}" fill="none" stroke="#B8506F" stroke-width="4.4" stroke-dasharray=".7 3.3" opacity=".7"/>'
   f'<circle cx="{hx}" cy="{hy}" r="1.2" fill="#2B1D2E"/><circle cx="{hx+.45}" cy="{hy-.45}" r=".45" fill="#fff"/></g>')
PILE=(W('w3','M22 35c-3-8 1-16 8-18 4-1 7 1 7 4',37,21)+W('w2','M34 38c2-7-2-12-7-12',27,26.2)+W('w1','M9 38c-1-6 4-9 8-6s7 4 9 0',26,32.2)
 +'<path d="M2 46c2-8 10-11 22-11s20 3 22 11z" fill="#6A442F" stroke="#2B1D2E" stroke-width="1.7" stroke-linejoin="round"/><path d="M9 41q4-2 8 0M28 40q4-1.5 8 .5" fill="none" stroke="#8E6246" stroke-width="1.2" stroke-linecap="round"/><circle cx="21" cy="43" r="1.1" fill="#4A2E20"/><circle cx="38" cy="43.5" r=".9" fill="#4A2E20"/>')
ONE=W('w1','M3 18c2-7 6-7 8-2s6 5 8 0c1-2.4 2.2-3.6 4-3.4',22.6,14.4)
def worms(t):
  t=t.replace("  worm:{he:'תולעים',svg:","  worm:{he:'תולעים',pile:true,svg:")
  # the wallet and buy note show the pile, tags a single worm
  t=t.replace("const coin=k=>`<svg class=\"cur\" viewBox=\"0 0 24 24\" aria-hidden=\"true\">${CUR[k||st.cur].svg}</svg>`;",
   "const PILE='"+PILE+"', ONEWORM='"+ONE+"';\nconst coin=(k,big)=>{ k=k||st.cur; if(k==='worm') return big?`<svg class=\"cur pile\" viewBox=\"0 4 48 44\" aria-hidden=\"true\">${PILE}</svg>`:`<svg class=\"cur\" viewBox=\"0 4 26 20\" aria-hidden=\"true\">${ONEWORM}</svg>`; return `<svg class=\"cur\" viewBox=\"0 0 24 24\" aria-hidden=\"true\">${CUR[k].svg}</svg>`; };")
  t=t.replace("$('wallet').innerHTML=`${coin()} <span>${st.wallet}</span>`;","$('wallet').innerHTML=`${coin(null,true)} <span>${st.wallet}</span>`;")
  t=t.replace('<span class="cost">${coin()} ${it.price}</span>','<span class="cost">${coin(null,true)} ${it.price}</span>')
  # the girls chose worms: no currency picker
  t=t.replace("if(!CUR[st.cur]) st.cur='ruby';","st.cur='worm';")
  t=t.replace("  $('curpick').innerHTML='איזה כסף? (שהבנות יבחרו) '+Object.entries(CUR).map(([k,v])=>`<button data-cur=\"${k}\" aria-pressed=\"${k===st.cur}\">${coin(k)}${v.he}</button>`).join('');","  $('curpick').innerHTML='';")
  t=t.replace('<button class="btn" data-act="cancel">לא עכשיו</button>','<button class="x" data-act="cancel" aria-label="לא עכשיו" title="לא עכשיו">✕</button>')
  t=t.replace('<button class="btn" data-act="cancel">להוריד</button>','<button class="x" data-act="cancel" aria-label="להוריד" title="להוריד">✕</button>')
  assert 'ONEWORM' in t and "st.cur='worm';" in t and "$('curpick').innerHTML='';" in t, 'worm patch'
  return t
mode=sys.argv[3] if len(sys.argv)>3 else 'v4'
v=V4; t=s
hots=',\n  '.join(HOTSPOTS[h] for h in v['hots'])
js=(f"const HOTS=[\n  {hots}\n];\nconst FLAMES=[{v['flames']}];\nconst AMBIENT_BAT={v['bat']}, HINT_EVERY={v['hint']};\nconst HANGER='{v['hanger']}';\nconst BUYQ='{v['buyq']}';\n")+COMMON_JS
t=t.replace("const SWITCH_PRICE=5, START=40;",js+"const SWITCH_PRICE=5, START=40;")
t=t.replace("draw();\n}\n</script>","buildRoom();\ndraw();\n}\n</script>")
t=t.replace("</style>",COMMON_CSS+v['css']+"</style>")
t=t.replace('<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Karantina','<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Amatic+SC:wght@700&family=Karantina')
t=worms(t)
if mode=='main':
  t=t.replace('<p style="margin:0 0 8px"><a href="versions/wardrobe-room/index.html"','<p style="margin:0 0 8px" hidden><a href="versions/wardrobe-room/index.html"')
  open(sys.argv[4],'w',encoding='utf-8').write(t); print('main',len(t))
else:
  t=t.replace("<title>ארון הבגדים</title>","<title>ארון הבגדים · גרסה 3b: "+v['name']+"</title>")
  t=re.sub(r'(["\'`(])(img|thumb)/',r'\1../../\2/',t).replace('url("attic.webp")','url("../../attic.webp")')
  open(f"{OUT}/v4.html",'w',encoding='utf-8').write(t); print('v4',len(t))
