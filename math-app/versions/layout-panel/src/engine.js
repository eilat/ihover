/* Shared prototype engine for the three layout versions. Each version sets window.CFG and its own CSS. */
const CFG = window.CFG;
const COLORS = [
  {id:'blue',   name:'כחול',  c:'#2F5BD3'},
  {id:'purple', name:'סגול',  c:'#7444C9'},
  {id:'pink',   name:'ורוד',  c:'#C2357C'},
  {id:'teal',   name:'טורקיז', c:'#0B7570'},
  {id:'orange', name:'כתום',  c:'#B04B0C'},
  {id:'green',  name:'ירוק',  c:'#2C7A30'}
];
const STAGES = ['בדיקה קצרה','עשרות','גילוי','ביחד','לבד','סיכום'];
const EX = [
  {type:'simple', stage:1, intro:'יש 4 מקלות של עשר, ועוד 3 מקלות. כמה מקלות יש בסך הכול?', a:4, b:3, ans:7, unit:1,
   hints:['ספרי את כל המקלות, למעלה ולמטה.','4 ועוד 3. אפשר לספור מ-4 הלאה: 5, 6, 7.']},
  {type:'simple', stage:1, intro:'כל מקל הוא 10. 4 מקלות הם 40, ו-3 מקלות הם 30. כמה זה ביחד?', a:40, b:30, ans:70, unit:10,
   hints:['4 + 3 = 7. אז 4 עשרות ועוד 3 עשרות הם 7 עשרות.','7 עשרות זה 70.']},
  {type:'sheet', stage:3, a:264, b:182},
  {type:'simple', stage:4, intro:'עכשיו לבד. מאות, עשרות, אחדות, בראש.', a:573, b:340, ans:913, unit:0,
   hints:['קודם המאות: 5 + 3 = 8, כלומר 800.','עשרות: 7 + 4 = 11, כלומר 110. אחדות: 3. עכשיו 800 + 110 + 3.']}
];
const PLACE = {h:'מאות', t:'עשרות', o:'אחדות'};
const digits = n => ({h:Math.floor(n/100), t:Math.floor(n/10)%10, o:n%10});

const S = {
  kids:[{name:'מאיה', color:'purple'},{name:'נועה', color:'teal'}], kid:0,
  i:0, input:'', wrong:0, hint:'', toast:null, locked:false, W:null,
  collapsed:false, open:false, modal:null, code:null, codeIn:'', codeMsg:'', parent:false, finished:false
};
try{ S.code = localStorage.getItem('proto:code'); }catch(e){}

const esc = t => String(t).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const ltr = x => `<span class="ltr">${x}</span>`;
let VOICE=null;
function pickVoice(){ try{ const he=speechSynthesis.getVoices().filter(v=>/^he|^iw/i.test(v.lang)); const sc=v=>(/premium/i.test(v.name)?4:0)+(/enhanced/i.test(v.name)?3:0); VOICE=he.sort((a,b)=>sc(b)-sc(a))[0]||null; }catch(e){} }
try{ pickVoice(); speechSynthesis.addEventListener('voiceschanged', pickVoice); }catch(e){}
function speak(t){ try{ speechSynthesis.cancel(); const u=new SpeechSynthesisUtterance(t); u.lang='he-IL'; if(VOICE) u.voice=VOICE; u.rate=.9; speechSynthesis.speak(u);}catch(e){} }

const ICON = {
  speaker:'<svg viewBox="0 0 24 24"><path d="M4 9v6h4l5 4V5L8 9z"/><path d="M16 9a4 4 0 0 1 0 6"/><path d="M18.5 6.5a7.5 7.5 0 0 1 0 11"/></svg>',
  lock:'<svg viewBox="0 0 24 24"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>',
  collapse:'<svg viewBox="0 0 24 24"><path d="M9 6l6 6-6 6"/></svg>',
  expand:'<svg viewBox="0 0 24 24"><path d="M15 6l-6 6 6 6"/></svg>',
  menu:'<svg viewBox="0 0 24 24"><path d="M4 7h16M4 12h16M4 17h16"/></svg>',
  check:'<svg viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>',
  close:'<svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg>'
};
const kid = () => S.kids[S.kid];
const accent = () => COLORS.find(c=>c.id===kid().color).c;
function applyColor(){ document.documentElement.style.setProperty('--accent', accent()); }

/* ---------- lesson progress ---------- */
const curStage = () => S.finished ? 5 : EX[S.i].stage;
const left = () => S.finished ? 0 : EX.length - S.i;

/* ---------- the worksheet (from the real lesson) ---------- */
function makeSheet(a,b){
  const da=digits(a), db=digits(b), hs=da.h+db.h, ts=da.t+db.t, os=da.o+db.o, H=hs*100, T=ts*10, O=os, F=[];
  F.push({k:'h', pre:`${da.h} + ${db.h} =`, ans:hs, ok:`${hs} מאות, כלומר ${H}.`, hint:`ספרי את הריבועים. ${da.h} ועוד ${db.h}.`});
  F.push({k:'t', pre:`${da.t} + ${db.t} =`, ans:ts, ok:`${ts} עשרות.`, hint:`נסי דרך העשר: ${da.t} + ${10-da.t} = 10, ועוד ${db.t-(10-da.t)}.`});
  if(ts>=10) F.push({k:'t', id:'tc', pre:`${ts} עשרות =`, ans:T, ok:`${ts} עשרות זה ${T}.`, hint:`10 עשרות הן 100. ועוד ${ts-10} עשרות הן ${(ts-10)*10}. כמה זה ביחד?`});
  F.push({k:'o', pre:`${da.o} + ${db.o} =`, ans:os, ok:`${os} אחדות.`, hint:`ספרי את הנקודות.`});
  F.push({k:null, pre:`${H} + ${T} + ${O} =`, ans:a+b, ok:`${a} + ${b} = ${a+b}.`, hint:`קודם ${H} + ${T}, ואז עוד ${O}.`});
  return {a,b,H,T,O,ts, f:F.map(x=>({...x, val:'', done:false, wrong:0})), cur:0};
}
const colsDone = W => W.f.every(x=>x.k===null || x.done);
const sheetDone = W => W.f.every(x=>x.done);
function nextField(W){ const i=W.f.findIndex(x=>!x.done && x.k!==null), j=W.f.findIndex(x=>!x.done); W.cur = i>=0 ? i : j>=0 ? j : W.f.length-1; }
function sheetPrompt(W){
  const f=W.f[W.cur];
  if(f.k==='h') return `נתחיל מהמאות. כמה זה ${ltr(f.pre.replace(' =',''))}?`;
  if(f.id==='tc') return `יצאו ${W.ts} עשרות. עשרה מקלות הם מאה. כמה שווים כל ${W.ts} המקלות?`;
  if(f.k==='t') return `עכשיו העשרות. כמה זה ${ltr(f.pre.replace(' =',''))}?`;
  if(f.k==='o') return `והאחדות. כמה זה ${ltr(f.pre.replace(' =',''))}?`;
  return `כל העמודות מוכנות. מחברות את החלקים.`;
}

/* ---------- math pictures: blocks, number line, or notebook digits ---------- */
const blocks = (n,cls) => Array.from({length:n},()=>`<span class="${cls}"></span>`).join('');
function lineSvg(a,b,unit){
  const max = unit===10 ? 100 : 10, step = unit===10 ? 10 : 1, A=a, B=b, W=560, x=v=>20+v/max*(W-40), y=70;
  let t=''; for(let v=0; v<=max; v+=step){ t+=`<line x1="${x(v)}" y1="${y-7}" x2="${x(v)}" y2="${y+7}" stroke="var(--ink)" stroke-width="1.5"/><text x="${x(v)}" y="${y+26}" text-anchor="middle" font-size="14" fill="var(--muted)">${v}</text>`; }
  const arc=(p,q,lab,col)=>{const m=(x(p)+x(q))/2, h=Math.min(46,10+(x(q)-x(p))/5); return `<path d="M${x(p)} ${y-4} Q${m} ${y-4-h*2} ${x(q)} ${y-4}" fill="none" stroke="${col}" stroke-width="3"/><text x="${m}" y="${y-10-h}" text-anchor="middle" font-size="15" font-weight="700" fill="${col}">+${lab}</text>`;};
  return `<div class="nl"><svg viewBox="0 0 ${W} 104" role="img" aria-label="ישר מספרים: מ-0 קופצים ${A} ואז עוד ${B}"><line x1="${x(0)}" y1="${y}" x2="${x(max)}" y2="${y}" stroke="var(--ink)" stroke-width="2"/>${t}${arc(0,A,A,'var(--h)')}${arc(A,A+B,B,'var(--accent)')}</svg></div>`;
}
function simplePic(e){
  if(CFG.math==='line') return e.unit ? lineSvg(e.a,e.b,e.unit) : '';
  if(!e.unit) return '';
  const n1=e.a/e.unit, n2=e.b/e.unit;
  if(CFG.math==='grid') return `<div class="nb-row ltr">${blocks(n1,'nb-stick')}<span class="nb-plus">+</span>${blocks(n2,'nb-stick alt')}</div>`;
  return `<div class="tray"><div class="row-b">${blocks(n1,'tb')}</div><div class="row-b">${blocks(n2,'tb')}</div></div>`;
}

/* ---------- rendering ---------- */
function box(val, state, act, i, big){
  const cls = `box ${big?'big':''} ${state}`;
  if(state==='done') return `<span class="${cls}">${val}</span>`;
  return `<button class="${cls}" data-act="${act}" ${i!=null?`data-v="${i}"`:''} aria-label="קופסת תשובה">${val||''}</button>`;
}
function toastFor(where){ return S.toast && S.toast.where===where ? `<span class="toast" role="status">${S.toast.text}</span>` : ''; }
function hintBlock(){ return S.hint ? `<div class="hint" role="status">${S.hint}</div>` : ''; }
function keypad(){
  const d=[1,2,3,4,5,6,7,8,9].map(n=>`<button class="key" data-act="key" data-v="${n}">${n}</button>`).join('');
  return `<div class="pad">${d}<button class="key" data-act="del" aria-label="מחיקה">⌫</button><button class="key" data-act="key" data-v="0">0</button><button class="key ok" data-act="check">בדיקה</button></div>`;
}
function vSimple(e){
  const state = S.locked ? 'done' : 'on';
  return `<div class="work">
    <div class="qa">
      <div class="intro"><p>${e.intro}</p><button class="say" data-act="say" aria-label="להקריא">${ICON.speaker}</button></div>
      ${simplePic(e)}
      <div class="question ltr"><span>${e.a} + ${e.b} =</span><span class="anchor">${box(S.locked?e.ans:S.input, state, 'noop', null, true)}${toastFor('main')}</span></div>
      ${hintBlock()}
    </div>
    <div class="padwrap">${keypad()}</div>
  </div>`;
}
function vSheet(){
  const W=S.W, da=digits(W.a), db=digits(W.b);
  const col=(k)=>{
    let pic='';
    if(CFG.math==='blocks'){
      const kind={h:'hb',t:'tb',o:'ob'}[k];
      pic = `<div class="row-b">${blocks(da[k],kind)}</div><div class="row-b">${blocks(db[k],kind)}</div>`;
    } else pic = `<div class="digs ltr"><span>${da[k]}</span><span>${db[k]}</span></div>`;
    const fl = W.f.map((f,i)=>f.k===k?`<div class="fld ltr"><span>${f.pre}</span><span class="anchor">${box(f.val, f.done?'done':(i===W.cur?'on':''), 'pick', i)}${toastFor(i)}</span></div>`:'').join('');
    return `<div class="col c-${k} ${!sheetDone(W)&&W.f[W.cur].k===k?'focus':''}"><span class="col-title">${PLACE[k]}</span>${pic}${fl}</div>`;
  };
  const last=W.f.length-1, s=W.f[last];
  const sum = colsDone(W) ? `<div class="question ltr"><span>${s.pre}</span><span class="anchor">${box(s.val, s.done?'done':'on', 'pick', last, true)}${toastFor(last)}</span></div>`
                          : `<div class="question ltr muted-q"><span>${W.a} + ${W.b} = ?</span></div>`;
  return `<div class="work">
    <div class="qa">
      <div class="intro"><p>${sheetPrompt(W)}</p><button class="say" data-act="say" aria-label="להקריא">${ICON.speaker}</button></div>
      <div class="cols ltr">${col('h')}${col('t')}${col('o')}</div>
      ${sum}
      ${hintBlock()}
    </div>
    <div class="padwrap">${keypad()}</div>
  </div>`;
}
function vDone(){
  return `<div class="finish"><h2>סיימנו את השיעור!</h2><p>במקום תרגיל אחד גדול, שלושה תרגילים קטנים: מאות, עשרות, אחדות.</p>
    <div class="question ltr"><span>573 + 340 = 800 + 110 + 3 = 913</span></div>
    <button class="btn primary" data-act="again">עוד פעם מההתחלה</button></div>`;
}
function vStepper(){
  const cur=curStage();
  return `<ol class="steps" aria-label="שלבי השיעור">${STAGES.map((s,i)=>{
    const st = i<cur?'done':i===cur?'now':'next';
    return `<li class="${st}" ${i===cur?'aria-current="step"':''}><span class="dot">${st==='done'?ICON.check:''}</span><span class="lbl">${s}</span></li>`;}).join('')}</ol>
    <p class="left">${S.finished?'סיימת את כל התרגילים':`נשארו <b>${left()}</b> תרגילים`}</p>`;
}
function vPanel(){
  const k=kid();
  const swatches = COLORS.map(c=>`<button class="sw" style="--c:${c.c}" data-act="color" data-v="${c.id}" aria-label="צבע ${c.name}" aria-pressed="${k.color===c.id}">${k.color===c.id?ICON.check:''}</button>`).join('');
  const opts = S.kids.map((x,i)=>`<option value="${i}" ${i===S.kid?'selected':''}>${esc(x.name)}</option>`).join('');
  return `<aside class="panel" aria-label="ניווט">
    <div class="p-head"><span class="logo">מתמטיקידס</span><button class="icon-btn fold" data-act="fold" aria-label="לקפל את הפאנל">${ICON.collapse}</button></div>
    <label class="p-sec"><span class="p-lbl">מי לומדת היום?</span><select id="kid">${opts}</select></label>
    <div class="p-sec"><span class="p-lbl">הצבע שלי</span><div class="sws">${swatches}</div></div>
    <div class="p-sec grow"><span class="p-lbl">השיעור: חיבור בראש</span>${vStepper()}</div>
    <button class="parent" data-act="parent">${ICON.lock}<span>הורה</span></button>
  </aside>`;
}
function vRail(){
  const cur=curStage();
  return `<aside class="rail" aria-label="ניווט מקופל">
    <button class="icon-btn" data-act="unfold" aria-label="לפתוח את הפאנל">${ICON.expand}</button>
    <span class="avatar" title="${esc(kid().name)}">${esc(kid().name[0])}</span>
    <ol class="rail-steps" aria-label="שלבי השיעור">${STAGES.map((s,i)=>`<li class="${i<cur?'done':i===cur?'now':'next'}" title="${s}"></li>`).join('')}</ol>
    <span class="rail-left" title="תרגילים שנשארו">${left()}</span>
    <button class="icon-btn" data-act="parent" aria-label="הורה">${ICON.lock}</button>
  </aside>`;
}
function vModal(){
  if(!S.modal) return '';
  if(S.parent) return `<div class="scrim"><div class="modal" role="dialog" aria-label="מסך הורה"><h2>מסך הורה</h2><p>כאן ייפתח מסך ההורה (במבנה הקיים: מספרים גדולים, דוחות, ניהול הילדות).</p>
    <div class="m-row"><button class="btn primary" data-act="closeModal">חזרה לשיעור</button><button class="btn" data-act="resetCode">שינוי קוד</button></div></div></div>`;
  const setting=!S.code;
  const dots=[0,1,2,3].map(i=>`<span class="cd ${i<S.codeIn.length?'on':''}"></span>`).join('');
  return `<div class="scrim"><div class="modal" role="dialog" aria-label="קוד הורה">
    <button class="icon-btn m-x" data-act="closeModal" aria-label="סגירה">${ICON.close}</button>
    <h2>${setting?'בחירת קוד הורה':'קוד הורה'}</h2>
    <p>${setting?'בחרי 4 ספרות. הן יידרשו בכל כניסה למסך ההורה.':'הקלידי את הקוד כדי להיכנס.'}</p>
    <div class="codes ltr">${dots}</div>
    ${S.codeMsg?`<p class="m-msg">${S.codeMsg}</p>`:''}
    <div class="pad small">${[1,2,3,4,5,6,7,8,9].map(n=>`<button class="key" data-act="codeKey" data-v="${n}">${n}</button>`).join('')}<button class="key" data-act="codeDel" aria-label="מחיקה">⌫</button><button class="key" data-act="codeKey" data-v="0">0</button><span></span></div>
  </div></div>`;
}
function render(){
  applyColor();
  const nav = S.collapsed ? (CFG.collapse==='rail' ? vRail() : (S.open ? vPanel() : `<button class="fab" data-act="openFloat" aria-label="פתיחת התפריט">${ICON.menu}<span class="avatar sm">${esc(kid().name[0])}</span></button>`)) : vPanel();
  const e=EX[S.i];
  const body = S.finished ? vDone() : e.type==='sheet' ? vSheet() : vSimple(e);
  document.getElementById('app').className = `shell ${S.collapsed?'is-collapsed':''} ${S.open?'is-open':''}`;
  document.getElementById('app').innerHTML = `${nav}<main class="stage"><section class="card">${body}</section></main>${vModal()}`;
}

/* ---------- actions ---------- */
function showToast(text, where, then){
  S.toast={text, where}; const id=Symbol(); S.toast.id=id; render();
  setTimeout(()=>{ if(S.toast?.id===id){ S.toast=null; then?.(); render(); } }, 1700);
}
function advance(){ S.locked=false; S.input=''; S.wrong=0; S.hint=''; if(S.i<EX.length-1){ S.i++; if(EX[S.i].type==='sheet') S.W=makeSheet(EX[S.i].a,EX[S.i].b); } else S.finished=true; }
function check(){
  if(S.finished||S.locked||S.toast?.where==='main') return;
  const e=EX[S.i];
  if(e.type==='sheet'){
    const W=S.W, f=W.f[W.cur]; if(!f.val) return; const x=+f.val, idx=W.cur;
    if(x===f.ans){ f.done=true; f.val=String(x); S.hint=''; nextField(W);
      if(sheetDone(W)){ S.locked=true; showToast(`נכון! ${ltr(f.ok)}`, idx, advance); }
      else showToast('נכון!', idx); return; }
    f.wrong++; f.val='';
    if(f.wrong>=3){ f.done=true; f.val=String(f.ans); S.hint=`התשובה היא ${f.ans}. ${f.ok}`; nextField(W); if(sheetDone(W)){ S.locked=true; setTimeout(()=>{advance(); render();},2500);} }
    else S.hint=f.hint;
    render(); return;
  }
  if(!S.input) return; const x=+S.input;
  if(x===e.ans){ S.locked=true; S.hint=''; showToast(`נכון! ${ltr(`${e.a} + ${e.b} = ${e.ans}`)}`, 'main', advance); return; }
  S.input=''; S.wrong++;
  S.hint = S.wrong>=3 ? `התשובה היא ${e.ans}. ${e.hints[1]}` : e.hints[Math.min(S.wrong-1,1)];
  if(S.wrong>=3){ S.locked=true; render(); setTimeout(()=>{ advance(); render(); }, 3000); return; }
  render();
}
const A = {
  key(v){ if(S.locked) return; if(EX[S.i].type==='sheet'){ const f=S.W.f[S.W.cur]; if(f.val.length<4) f.val+=v; } else if(S.input.length<4) S.input+=v; },
  del(){ if(EX[S.i].type==='sheet'){ const f=S.W.f[S.W.cur]; f.val=f.val.slice(0,-1); } else S.input=S.input.slice(0,-1); },
  check(){ check(); return false; },
  pick(v){ const W=S.W, i=+v; if(!W||W.f[i].done) return; if(W.f[i].k===null && !colsDone(W)) return; W.cur=i; },
  noop(){},
  say(){ const p=document.querySelector('.intro p'); if(p) speak(p.textContent); return false; },
  color(v){ kid().color=v; },
  fold(){ S.collapsed=true; S.open=false; },
  unfold(){ S.collapsed=false; },
  openFloat(){ S.open=true; },
  parent(){ S.modal='code'; S.codeIn=''; S.codeMsg=''; S.parent=false; },
  closeModal(){ S.modal=null; S.parent=false; },
  resetCode(){ S.code=null; try{ localStorage.removeItem('proto:code'); }catch(e){} S.parent=false; S.codeIn=''; },
  codeKey(v){ if(S.codeIn.length>=4) return; S.codeIn+=v; S.codeMsg='';
    if(S.codeIn.length===4){
      if(!S.code){ S.code=S.codeIn; try{ localStorage.setItem('proto:code',S.code); }catch(e){} S.parent=true; }
      else if(S.codeIn===S.code) S.parent=true;
      else { S.codeMsg='הקוד לא מתאים. נסי שוב.'; S.codeIn=''; }
    } },
  codeDel(){ S.codeIn=S.codeIn.slice(0,-1); },
  again(){ S.i=0; S.finished=false; S.input=''; S.hint=''; S.wrong=0; S.locked=false; S.W=null; }
};
document.addEventListener('click', e=>{
  const t=e.target.closest('[data-act]'); if(!t) return;
  // clicking outside an open floating panel closes it
  const r=A[t.dataset.act]?.(t.dataset.v);
  if(r!==false) render();
});
document.addEventListener('click', e=>{ if(CFG.collapse==='float' && S.collapsed && S.open && !e.target.closest('.panel,.fab')){ S.open=false; render(); } });
document.addEventListener('change', e=>{ if(e.target.id==='kid'){ S.kid=+e.target.value; render(); } });
document.addEventListener('keydown', e=>{
  if(e.target.tagName==='SELECT') return;
  if(S.modal && !S.parent){ if(/^[0-9]$/.test(e.key)) A.codeKey(e.key); else if(e.key==='Backspace') A.codeDel(); else if(e.key==='Escape') A.closeModal(); else return; e.preventDefault(); render(); return; }
  if(S.modal){ if(e.key==='Escape'){ A.closeModal(); render(); } return; }
  if(/^[0-9]$/.test(e.key)) A.key(e.key); else if(e.key==='Backspace') A.del(); else if(e.key==='Enter'){ e.preventDefault(); check(); return; } else return;
  e.preventDefault(); render();
});
render();
