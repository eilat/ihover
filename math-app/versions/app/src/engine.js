/* ---------- state ---------- */
const DEF=LESSONS[decodeURIComponent(location.hash.slice(1))]||LESSONS['h4.2'];
const COINS_PER=3;
const S={screen:'lesson', i:0, items:[], it:null, f:0, val:'', wrong:{}, done:0, finished:false, helped:false, showVis:false, note:null, toast:null, locked:false, step:0, asked:null, rot:false,
  starOffered:false, used:new Set(), lastLevel:null, lastHelped:false, reward:null, exT:{ms:0,from:null,frozen:false,running:false}, log:[]};
// the plan: explanation, 2 together, the solo slots (generated when reached)
function plan(){ S.items=[{type:'explain',phase:'הסבר'}, ...DEF.together.map(t=>({type:'task',phase:'שאלות',mode:'ביחד',make:t})), ...DEF.levels.map(lv=>({type:'task',phase:'שאלות',mode:'לבד',level:lv}))]; }
const soloCount=()=>DEF.levels.length, qCount=()=>DEF.together.length+soloCount();
const TRANS=()=>({1:{title:'סיימת את ההסבר!', text:'עכשיו פותרות ביחד, צעד אחרי צעד.', stop:1}, [1+DEF.together.length]:{title:'עכשיו לבד!', text:'אם צריך, הכפתור "רמז" מחזיר את התמונה.', stop:2}});
const STOPS=['הסבר','ביחד','לבד','סיכום'];

function startItem(){
  const P=S.items[S.i]; S.f=0; S.val=''; S.wrong={}; S.done=0; S.picked={}; S.softPick=null; S.finished=false; S.helped=false; S.note=null; S.locked=false; S.step=0; S.asked=null; S.rot=false; S.totalWrong=0;
  S.exT={ms:0,from:null,frozen:false,running:false};
  if(P.type==='explain'){ S.it=null; return; }
  if(P.mode==='ביחד') S.it=P.make();
  else { // stay at the same level after a hard one, so the count "שאלה 3 מתוך 6" stays true
    const lv = S.lastHelped && S.lastLevel!=null ? S.lastLevel : P.level;
    S.it=P.star?DEF.star():DEF.gen(lv,S.used); S.it.level=lv; }
  S.showVis = S.it.showVis==='always' || !S.it.showVis;
  clearScratch();
}
const curField=()=>S.it?.fields[S.f];
function stV(){ return {f:S.f, done:S.done, finished:S.finished, helped:S.helped, rot:S.rot, step:S.step}; }

/* ---------- stopwatch (same as the place-value lesson) ---------- */
const fmt=ms=>{ const s=Math.floor(ms/1000); return `${Math.floor(s/60)}:${String(s%60).padStart(2,'0')}`; };
const exMs=()=>S.exT.ms+(S.exT.from!=null?Date.now()-S.exT.from:0);
function syncTimer(){ const run=S.exT.running && S.screen==='lesson' && !document.hidden && !S.exT.frozen && S.it;
  if(run && S.exT.from==null) S.exT.from=Date.now(); if(!run && S.exT.from!=null){ S.exT.ms+=Date.now()-S.exT.from; S.exT.from=null; } }
function freezeTimer(){ S.exT.frozen=true; syncTimer(); }
const timeTag=()=>exMs()>0?` ⏱ ${fmt(exMs())}`:'';
document.addEventListener('visibilitychange',syncTimer);
setInterval(()=>{ const el=document.getElementById('swt'); if(el && S.exT.running) el.textContent=fmt(exMs()); },500);

/* ---------- voice ---------- */
let VOICE=null;
function pickVoice(){ try{ const he=speechSynthesis.getVoices().filter(v=>/^he|^iw/i.test(v.lang)); const s=v=>(/premium/i.test(v.name)?4:0)+(/enhanced/i.test(v.name)?3:0); VOICE=he.sort((a,b)=>s(b)-s(a))[0]||null; }catch(e){} }
try{ pickVoice(); speechSynthesis.addEventListener('voiceschanged',pickVoice); }catch(e){}
function speak(t){ try{ speechSynthesis.cancel(); const u=new SpeechSynthesisUtterance(t); u.lang='he-IL'; if(VOICE) u.voice=VOICE; u.rate=.9; speechSynthesis.speak(u);}catch(e){} }

/* ---------- checking ---------- */
function toast(text, then){ const id={}; S.toast={text,id}; render(); setTimeout(()=>{ if(S.toast?.id===id){ S.toast=null; then?.(); render(); } },1500); }
function fieldDone(){
  S.done++; S.val=''; S.f++;
  if(S.f>=S.it.fields.length){ finish(); render(); return; }
  toast('נכון!');
}
function finish(){
  S.finished=true; S.locked=true; S.showVis=S.it.showVis!=='never'; freezeTimer();
  const it=S.it, last=it.fields[it.fields.length-1];
  S.note={ok:true, text:`${it.star?'פתרת את שאלת האתגר! ':'נכון! '}${it.end||''}${timeTag()}`};
  Shell.addCoins(it.star?8:COINS_PER);
  S.lastLevel=it.level; S.lastHelped=S.helped||S.totalWrong>=2;
  S.log.push({lesson:DEF.id, level:it.level, wrong:S.totalWrong, helped:S.helped, tags:S.tags||[]}); S.tags=[];
}
function check(x){
  const fd=curField(); if(!fd || S.locked) return;
  if(fd.any){ // any arrangement of 12 dots in equal rows, except the one we showed
    const a0=S.it.fields[0].ans; S.val='';
    if(S.f===0){ if(x<1||12%x){ S.note={text:`אי אפשר לסדר 12 ב-${x} שורות שוות. נסי מספר אחר.`}; render(); return; } fd.ans=x; S.note=null; fieldDone(); return; }
    if(a0*x!==12){ S.note={text:`${a0} × ${x} זה ${a0*x}, לא 12. נסי שוב.`}; render(); return; }
    if(a0===3&&x===4){ S.note={text:'זה הסידור שכבר יש. מצאי אחר!'}; S.it.fields[0].ans=null; S.f=0; S.done=0; render(); return; }
    if(a0===4&&x===3){ S.note={text:'זה הסיבוב! יש עוד סידור, עם מספר שורות אחר?'}; S.it.fields[0].ans=null; S.f=0; S.done=0; render(); return; }
    fd.ans=x; S.note=null; fieldDone(); return; }
  if(x===fd.ans){ S.note=null; fieldDone(); return; }
  const custom=fd.wrong?.(x);
  if(custom && custom.soft){ S.note={text:custom.text}; S.val=''; render(); return; } // the right idea, different order: not a mistake
  S.wrong[S.f]=(S.wrong[S.f]||0)+1; S.totalWrong=(S.totalWrong||0)+1; S.val=''; const w=S.wrong[S.f];
  if(typeof custom==='string') (S.tags ||= []).push(custom.slice(0,30));
  const H=hintsNow();
  if(w>=2){ S.helped=true; if(S.it.showVis==='hint') S.showVis=true; }
  if(w>=3){ S.note={text:`התשובה היא ${fd.ans}. ${H[2]||''}`}; S.locked=true; setTimeout(()=>{ S.locked=false; S.done++; S.f++; if(S.f>=S.it.fields.length){ finish(); S.note={text:`התשובה היא ${fd.ans}. נמשיך.`}; } render(); },2200); render(); return; }
  S.note={text: custom || (fd.q && w===1 ? 'עוד לא. נסי שוב.' : H[Math.min(w-1,1)] || 'עוד לא. נסי שוב.')};
  render();
}
/* hints can depend on what she chose earlier in the exercise (e.g. the method card) */
const hintsNow=()=>typeof S.it.hints==='function'?S.it.hints(S.picked||{}):(S.it.hints||[]);
/* a choice can be right (ok, maybe with a note), "soft" (a reasonable choice that doesn't fit so well here:
   ask to think again, never counted as a mistake, a second click on it goes on), or not right.
   A choice may also decide the rest of the exercise: then(i) returns the fields (and hints) that follow. */
function choose(i){ const fd=curField(); if(!fd?.choice||S.locked) return; const o=fd.choice[i];
  if(o.soft && S.softPick!==`${S.f}:${i}`){ S.softPick=`${S.f}:${i}`; S.note={text:o.soft}; render(); return; }
  if(o.ok||o.soft){ (S.picked ||= {})[S.f]=o.key??i; S.softPick=null;
    if(fd.then){ const nx=fd.then(o.key??i); S.it.fields=[...S.it.fields.slice(0,S.f+1),...nx.fields]; if(nx.hints) S.it.hints=nx.hints; if(nx.vis) S.it.vis=nx.vis; if(nx.eq) S.it.eq=nx.eq; if(nx.end) S.it.end=nx.end; }
    if(o.note){ S.done++; S.val=''; S.f++; S.note={ok:true,text:o.note}; if(S.f>=S.it.fields.length) finish(); render(); return; } // the note says it, no extra toast
    fieldDone(); return; }
  S.totalWrong=(S.totalWrong||0)+1; S.wrong[S.f]=(S.wrong[S.f]||0)+1; S.note={text:fd.wrongText?fd.wrongText(i):'עוד לא. נסי שוב.'}; render(); }

/* ---------- rendering ---------- */
function strip(){
  const P=S.items[S.i]; let lbl, dots, ph;
  if(P.type==='explain'){ const n=DEF.explain.length; lbl=`הסבר ${S.step+1} מתוך ${n}`; dots=Array(n).fill(0).map((_,i)=>`<i class="${i<S.step?'done':i===S.step?'now':''}"></i>`).join(''); ph='לומדות משהו חדש'; }
  else { const q=S.i, n=qCount(); lbl=S.it?.star?'⭐ שאלת אתגר':`שאלה ${q} מתוך ${n}`; dots=Array(n).fill(0).map((_,i)=>`<i class="${i<q-1?'done':i===q-1?'now':''}"></i>`).join(''); ph=P.mode==='ביחד'?'פותרות ביחד':'לבד'; }
  return `<div class="strip"><div class="strip-l"><span class="dots" aria-hidden="true">${dots}</span><span class="lbl">${lbl}</span><span class="ph">${ph}</span></div>${P.type==='explain'?'':swBtn()}</div>`;
}
function swBtn(){ const T=S.exT, ms=exMs();
  if(T.frozen) return ms>0?`<span class="sw-btn stopped">${ICON.watch}<span>${fmt(ms)}</span></span>`:'';
  if(T.running) return `<button class="sw-btn run" data-act="sw" aria-label="לעצור את הסטופר">${ICON.pause}<span id="swt">${fmt(ms)}</span></button>`;
  return `<button class="sw-btn" data-act="sw" aria-label="להפעיל סטופר">${ICON.watch}<span id="swt">${ms?fmt(ms):'סטופר'}</span></button>`; }
const taskLine=html=>`<div class="task"><button class="say" data-act="say" aria-label="להקריא">${ICON.speaker}</button><p>${html}</p></div>`;
const noteBlock=()=>S.note?`<div class="note ${S.note.ok?'ok':''}" role="status">${S.note.text}</div>`:'';
function boxHtml(i,big){
  const it=S.it, fd=it.fields[i]; const state = i<S.done ? 'done' : i===S.f && !S.finished ? 'on' : 'wait';
  const v = i<S.done ? (fd.ans??'') : i===S.f ? S.val : '';
  return `<span class="slot"><span class="box ${big?'big':''} ${state}">${state==='wait'&&!v?'':v}</span>${S.toast&&i===S.f-1?`<span class="toast" role="status">${S.toast.text}</span>`:''}</span>`;
}
function vExplain(){
  const st=DEF.explain[S.step], ask=st.ask, answered=S.asked!=null;
  const canNext=!ask || (ask.rotate ? S.rot : answered && S.asked===ask.ok);
  return `${strip()}${taskLine(st.say)}<div class="vis">${st.vis(stV())}</div>
    ${ask&&ask.options?`<div class="choices">${ask.options.map((o,i)=>`<button class="btn ${S.asked===i?(i===ask.ok?'good':'meh'):''}" data-act="ask" data-v="${i}">${o}</button>`).join('')}</div>`:''}
    ${ask&&ask.rotate&&!S.rot?`<div class="choices"><button class="btn primary" data-act="rotate">${ICON.rotate}לסובב</button></div>`:''}
    ${ask&&(answered||S.rot)?`<div class="note ${canNext?'ok':''}">${canNext?ask.then:ask.no}</div>`:''}
    <div class="actions">${S.step>0?'<button class="btn" data-act="exBack">אחורה</button>':''}<button class="btn primary" data-act="exNext" ${canNext?'':'disabled'}>${S.step<DEF.explain.length-1?'הלאה':'הבנתי, ממשיכות'}</button></div>`;
}
function vTask(){
  const it=S.it, fd=curField();
  const inEq=new Set(it.eq.filter(p=>p&&p.f!=null).map(p=>p.f));
  const q = !S.finished && fd?.q ? fd.q : it.say;
  const eq = it.eq.length ? `<div class="anchor ltr ${it.eq.length>3?'sm':''}">${it.eq.map(p=>typeof p==='string'?`<span>${p}</span>`:p.sum!=null?`<span class="slot"><span class="box big ${S.finished?'done':'wait'}">${S.finished?p.sum:'?'}</span></span>`:boxHtml(p.f,true)).join('')}</div>` : '';
  const rows = it.fields.map((fd,i)=>({fd,i})).filter(({fd,i})=>!inEq.has(i)&&!fd.choice&&!fd.rotate&&fd.label);
  const steps = rows.length ? `<div class="steps ltr">${rows.map(({fd,i})=>`<div class="stepf ${i===S.f&&!S.finished?'on':''}"><span class="${/[א-ת]/.test(fd.label)?'heb':''}">${fd.label}</span>${boxHtml(i)}</div>`).join('')}</div>` : '';
  const choice = fd?.choice && !S.finished ? (fd.choice.some(o=>o.html) ? `<div class="pics">${fd.choice.map((o,i)=>`<button class="picbtn" data-act="choose" data-v="${i}" aria-label="תמונה ${i+1}">${o.html}</button>`).join('')}</div>`
    : `<div class="cards">${fd.choice.map((o,i)=>`<button class="cardbtn ${S.softPick===`${S.f}:${i}`?'soft':''}" data-act="choose" data-v="${i}">${o.text}${o.sub?`<small class="ltr">${o.sub}</small>`:''}</button>`).join('')}</div>`) : '';
  const rot = fd?.rotate && !S.finished ? `<div class="choices"><button class="btn primary" data-act="rotateF">${ICON.rotate}לסובב</button></div>` : '';
  const vis = it.vis && S.showVis ? `<div class="vis">${it.vis(stV())}</div>` : '';
  const hint = S.items[S.i].mode==='לבד' && !S.helped && !S.finished && it.hints ? `<div class="hintrow"><button class="hintbtn" data-act="hint">${ICON.bulb}רמז</button></div>` : '';
  return `${strip()}${taskLine(q)}${vis}${choice}${rot}${steps}${eq}${hint}${noteBlock()}
    ${S.finished?`<div class="actions"><button class="btn primary" data-act="next">${S.i>=S.items.length-1?'לסיום':'לתרגיל הבא'}</button></div>`:''}`;
}
function keypad(){
  const fd=curField();
  if(S.screen!=='lesson' || !S.it || !fd || fd.choice || fd.rotate || S.finished) return `<p class="kbd">כאן תופיע המקלדת כשיש מה לכתוב.</p>`;
  const d=[7,8,9,4,5,6,1,2,3].map(n=>`<button class="key" data-act="key" data-v="${n}">${n}</button>`).join('');
  return `<div class="pad">${d}<button class="key" data-act="del" aria-label="מחיקה">⌫</button><button class="key" data-act="key" data-v="0">0</button><button class="key ok" data-act="check">בדיקה</button></div><p class="kbd">אפשר גם להקליד במקלדת וללחוץ Enter</p>`;
}
function mapHtml(now){ return `<ol class="map" aria-label="מפת השיעור">${STOPS.map((s,i)=>`<li class="${i<now?'done':i===now?'now':''}"><span class="dot">${i<now?ICON.check:''}</span><span>${s}</span>${i===now?'<span class="here">את כאן</span>':''}</li>`).join('')}</ol>`; }
function vScreen(){
  if(S.screen==='trans'){ const t=TRANS()[S.i]; return `<div class="card"><h1>${t.title}</h1>${mapHtml(t.stop)}<p>${t.text}</p><button class="btn primary" data-act="go">ממשיכות</button></div>`; }
  if(S.screen==='star') return `<div class="card"><h1>⭐ רוצה שאלת אתגר?</h1><p>שאלה קשה במיוחד. מי שפותרת מקבלת 8 מטבעות. אפשר גם לסיים עכשיו.</p><div class="row"><button class="btn primary" data-act="takeStar">לנסות!</button><button class="btn" data-act="skipStar">לסיים את השיעור</button></div></div>`;
  if(S.screen==='done'){ const r=S.reward||{}; return `<div class="card"><h1>סיימנו את השיעור!</h1>${mapHtml(3)}<p>סיימת את השיעור "${DEF.title}". כל הכבוד על ההתמדה!</p>
    ${r.first?`<p class="gift">${r.chosen?(r.animal?'מישהי חדשה עברה לגור אצלך בבית! בואי לפגוש אותה.':'בבית מחכים לך 10 מטבעות בונוס.'):'בבית מחכה לך חיה ראשונה לבחור, ו-10 מטבעות בונוס.'}</p>`:''}
    <div class="row"><a class="btn primary" href="home.html">לבית שלי</a><a class="btn" href="index.html">לשיעורים</a><button class="btn" data-act="again">עוד פעם, עם תרגילים חדשים</button></div></div>`; }
  return '';
}
function render(){
  Shell.renderBar({page:'lesson', title:DEF.title});
  const lesson=S.screen==='lesson';
  document.getElementById('layout').hidden=!lesson; document.getElementById('screen').hidden=lesson; document.getElementById('screen').className='screen';
  if(!lesson){ document.getElementById('screen').innerHTML=vScreen(); syncTimer(); return; }
  document.getElementById('main').innerHTML = S.items[S.i].type==='explain' ? vExplain() : vTask();
  document.getElementById('kp').innerHTML=keypad(); syncTimer();
}

/* ---------- flow ---------- */
function advance(){
  if(S.items[S.i].star || S.i>=S.items.length-1){
    if(!S.starOffered && DEF.star){ S.starOffered=true; S.screen='star'; return; }
    return endLesson(); }
  S.i++; startItem(); if(TRANS()[S.i]) S.screen='trans';
}
function endLesson(){ S.screen='done'; S.reward=Shell.completeLesson(DEF.id); if(S.reward.first) Shell.addCoins(10);
  try{ const k='mk:log:'+Shell.kid().id, l=JSON.parse(localStorage.getItem(k)||'[]'); localStorage.setItem(k,JSON.stringify([...l,...S.log].slice(-300))); }catch(e){} S.log=[]; }
const A={
  say(){ const p=document.querySelector('.task p'); if(p) speak(p.textContent); return false; },
  sw(){ const T=S.exT; if(T.frozen) return; T.running=!T.running; },
  exNext(){ if(S.step<DEF.explain.length-1){ S.step++; S.asked=null; S.rot=false; } else advance(); },
  exBack(){ if(S.step>0){ S.step--; S.asked=null; S.rot=false; } },
  ask(v){ S.asked=+v; },
  rotate(){ S.rot=true; },
  rotateF(){ S.rot=true; S.note=null; fieldDone(); return false; },
  choose(v){ choose(+v); return false; },
  hint(){ S.showVis=true; S.helped=true; S.note={text:hintsNow()[0]||''}; },
  key(v){ if(S.locked||S.toast) return; if(S.val.length<4) S.val+=v; },
  del(){ S.val=S.val.slice(0,-1); },
  check(){ if(S.locked||S.toast||!S.val) return false; check(+S.val); return false; },
  next(){ advance(); },
  go(){ S.screen='lesson'; },
  takeStar(){ S.items.push({type:'task',phase:'שאלות',mode:'לבד',star:true}); S.i=S.items.length-1; S.screen='lesson'; startItem(); },
  skipStar(){ endLesson(); },
  again(){ S.used=new Set(); S.starOffered=false; S.lastHelped=false; S.i=0; plan(); startItem(); S.screen='lesson'; }
};
document.addEventListener('click',e=>{ const t=e.target.closest('[data-act]'); if(!t||t.disabled) return; if(A[t.dataset.act]?.(t.dataset.v)!==false) render(); });
document.addEventListener('keydown',e=>{
  if(Shell.isOpen()||S.screen!=='lesson') return;
  if(e.key==='Enter'){ e.preventDefault();
    if(S.items[S.i].type==='explain'){ const b=document.querySelector('[data-act=exNext]'); if(b&&!b.disabled){ A.exNext(); render(); } return; }
    if(S.finished){ A.next(); render(); return; } A.check(); return; }
  if(S.items[S.i].type==='explain') return;
  if(/^[0-9]$/.test(e.key)) A.key(e.key); else if(e.key==='Backspace') A.del(); else return;
  e.preventDefault(); render();
});

/* ---------- scratchpad ---------- */
const cv=document.getElementById('cv'), cx=cv.getContext('2d'); let drawing=false, erasing=false;
function clearScratch(){ cx.clearRect(0,0,cv.width,cv.height); }
function pos(e){ const b=cv.getBoundingClientRect(); return [(e.clientX-b.left)*cv.width/b.width,(e.clientY-b.top)*cv.height/b.height]; }
cv.addEventListener('pointerdown',e=>{ drawing=true; cv.setPointerCapture(e.pointerId); const [x,y]=pos(e); cx.beginPath(); cx.moveTo(x,y); });
cv.addEventListener('pointermove',e=>{ if(!drawing) return; const [x,y]=pos(e); cx.globalCompositeOperation=erasing?'destination-out':'source-over'; cx.strokeStyle=getComputedStyle(document.documentElement).getPropertyValue('--accent'); cx.lineWidth=erasing?28:5; cx.lineCap='round'; cx.lineJoin='round'; cx.lineTo(x,y); cx.stroke(); });
cv.addEventListener('pointerup',()=>{ drawing=false; });
document.getElementById('scrToggle').addEventListener('click',e=>{ const s=document.getElementById('scr'), open=s.hidden; s.hidden=!open; e.currentTarget.setAttribute('aria-expanded',open); });
document.getElementById('pen').addEventListener('click',()=>{ erasing=false; document.getElementById('pen').setAttribute('aria-pressed','true'); document.getElementById('eraser').setAttribute('aria-pressed','false'); });
document.getElementById('eraser').addEventListener('click',()=>{ erasing=true; document.getElementById('pen').setAttribute('aria-pressed','false'); document.getElementById('eraser').setAttribute('aria-pressed','true'); });
document.getElementById('clear').addEventListener('click',clearScratch);

if(Shell.start({page:'lesson', title:DEF.title})){ document.title='מתמטיקידס · '+DEF.title; plan(); startItem(); render(); }
