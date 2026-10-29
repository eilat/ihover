/* Knowledge check (SKILLS-MAP.md §4): an addition line, then a multiplication line.
   No "right" or "wrong" on screen, only "תודה". A line stops after two answers that aren't right
   (or "עוד לא למדתי"), so she is never asked much beyond what she knows. */
const ICON={
  speaker:'<svg viewBox="0 0 24 24"><path d="M4 9v6h4l5 4V5L8 9z"/><path d="M16 9a4 4 0 0 1 0 6"/><path d="M18.5 6.5a7.5 7.5 0 0 1 0 11"/></svg>',
  check:'<svg viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>'
};
/* tens as sticks, ones as dots */
function sticks(t,o){ const W=Math.max(t*22+20,o*20+20,200);
  let s=''; for(let i=0;i<t;i++) s+=`<rect x="${10+i*22}" y="10" width="12" height="70" rx="4" fill="#D9980A"/>`;
  for(let i=0;i<o;i++) s+=`<circle cx="${18+(i%10)*20}" cy="${o?110+Math.floor(i/10)*22:0}" r="7" fill="#23895A"/>`;
  return `<svg class="pic" viewBox="0 0 ${W} ${o?(o>10?150:128):90}" style="max-width:${Math.min(96,W/4)}%" role="img" aria-label="${t} עשרות ו-${o} אחדות">${s}</svg>`; }
const QS=[
  {n:1, line:'add', say:'כמה חסר ל-3 עד 10?', eq:['3 +',0,'= 10'], fields:[{ans:7}]},
  {n:2, line:'add', say:'כמה זה?', eq:['7 + 8 + 3 + 2 =',0], fields:[{ans:20}]},
  {n:3, line:'add', say:'כמה זה?', eq:['8 + 6 =',0], fields:[{ans:14}]},
  {n:4, line:'add', say:'כמה זה?', eq:['9 + 7 =',0], fields:[{ans:16}]},
  {n:5, line:'add', say:'4 עשרות ו-12 אחדות. איזה מספר זה?', vis:()=>sticks(4,12), eq:['=',0], fields:[{ans:52}]},
  {n:6, line:'add', say:'13 עשרות. איזה מספר זה?', vis:()=>sticks(13,0), eq:['=',0], fields:[{ans:130}]},
  {n:7, line:'add', say:'במספר 305: כמה מאות, כמה עשרות וכמה אחדות?', fields:[{label:'מאות',ans:3},{label:'עשרות',ans:0,alt:[30]},{label:'אחדות',ans:5}]},
  {n:8, line:'add', say:'שני תרגילים.', fields:[{label:'70 + 50 =',ans:120},{label:'47 + 30 =',ans:77}]},
  {n:9, line:'add', say:'כמה זה?', eq:['46 + 38 =',0], fields:[{ans:84}]},
  {n:10, line:'add', say:'כמה זה?', eq:['573 + 340 =',0], fields:[{ans:913}]},
  {n:11, line:'mul', say:'4 צלחות, ובכל אחת 5 תותים.', vis:()=>plates({ks:[5,5,5,5]}), fields:[{label:'כמה תותים יש?',ans:20},{label:'איזה תרגיל מתאים?',choice:['4 × 5','4 + 5','5 + 5'],ans:0}]},
  {n:12, line:'mul', say:'שני תרגילים.', fields:[{label:'6 × 5 =',ans:30},{label:'7 × 2 =',ans:14}]}
];
const LINES={add:'חיבור', mul:'כפל'};
const S={screen:'q', q:0, f:0, val:'', vals:[], answers:[], miss:{add:0,mul:0}, toast:false, result:null};
const Q=()=>QS[S.q];

function next(){
  S.q++; S.f=0; S.val=''; S.vals=[];
  while(S.q<QS.length && S.miss[QS[S.q].line]>=2) S.q++; // this line stops after two misses
  if(S.q>=QS.length) finish();
}
function record(given, ok){
  const q=Q(); S.answers.push({q:q.n, given, ok}); if(!ok) S.miss[q.line]++;
  S.toast=true; render(); setTimeout(()=>{ S.toast=false; next(); render(); },900);
}
function submit(v){
  if(S.toast) return; const q=Q(), fd=q.fields[S.f];
  if(v===''||v==null) return;
  S.vals[S.f]=+v; S.val=''; S.f++;
  if(S.f<q.fields.length){ render(); return; }
  const ok=q.fields.every((f,i)=>S.vals[i]===f.ans||f.alt?.includes(S.vals[i])); // 30 tens in 305 is also right
  record(q.fields.map((f,i)=>f.choice?f.choice[S.vals[i]]:S.vals[i]).join(', '), ok);
}
function finish(){
  const right=new Set(S.answers.filter(a=>a.ok).map(a=>a.q));
  const p=Shell.saveDiag(Shell.kid().id, S.answers, right);
  Shell.addCoins(10);
  // a whole topic she knows shows as one chip, otherwise the lessons she knows in it
  const known=Shell.TOPICS.flatMap(t=>{ const k=t.lessons.filter(([l])=>p.known[l]); return k.length===t.lessons.length?[t.name]:k.map(([,n])=>n); });
  const start=['add','mul'].map(s=>{ for(const t of Shell.TOPICS.filter(t=>t.strand===s)) for(let i=0;i<t.lessons.length;i++) if(Shell.lessonState(p,t,i)==='open') return t.lessons[i][1]; return null; }).filter(Boolean);
  S.result={known,start}; S.screen='done';
}

/* ---------- rendering ---------- */
const boxH=(i,big)=>{ const st=i<S.f?'done':i===S.f?'on':'wait'; const v=i<S.f?S.vals[i]:i===S.f?S.val:'';
  return `<span class="slot"><span class="box ${big?'big':''} ${st==='done'?'given':st}">${v}</span></span>`; };
function render(){
  Shell.renderBar({page:'diag', title:'בדיקה קצרה'});
  const main=document.getElementById('main'), lay=document.getElementById('layout'), scr=document.getElementById('screen');
  if(S.screen==='done'){ lay.hidden=true; scr.hidden=false; scr.className='screen'; const r=S.result;
    scr.innerHTML=`<div class="card"><h1>סיימת! תודה רבה.</h1><p>עכשיו אנחנו יודעות מאיפה להתחיל. קיבלת 10 מטבעות על הבדיקה.</p>
      ${r.known.length?`<div><p class="kh">כבר יודעת:</p><div class="chips">${r.known.map(n=>`<span>${ICON.check}${n}</span>`).join('')}</div></div>`:''}
      ${r.start.length?`<div><p class="kh">מתחילות מ:</p><div class="chips start">${r.start.map(n=>`<span>${n}</span>`).join('')}</div></div>`:''}
      <a class="btn primary" href="index.html">לשיעורים</a></div>`; return; }
  lay.hidden=false; scr.hidden=true;
  const q=Q(), fd=q.fields[S.f], line=q.line, inLine=QS.filter(x=>x.line===line), k=inLine.indexOf(q)+1;
  const dots=inLine.map((_,i)=>`<i class="${i<k-1?'done':i===k-1?'now':''}"></i>`).join('');
  const single=q.eq && q.fields.length===1;
  const eq = single ? `<div class="anchor ltr">${q.eq.map(p=>typeof p==='number'?boxH(p,true):`<span>${p}</span>`).join('')}</div>` : '';
  const rows = !single ? `<div class="steps">${q.fields.map((f,i)=>`<div class="stepf ${i===S.f&&!S.toast?'on':''}"><span class="${/[א-ת]/.test(f.label)?'heb':''}">${f.label}</span>${f.choice?
      `<div class="opts ltr">${f.choice.map((c,j)=>`<button class="btn ${i<S.f&&S.vals[i]===j?'given':''}" data-act="pick" data-v="${j}" ${i===S.f&&!S.toast?'':'disabled'}>${c}</button>`).join('')}</div>`:boxH(i)}</div>`).join('')}</div>` : '';
  main.innerHTML=`<div class="strip"><div class="strip-l"><span class="dots" aria-hidden="true">${dots}</span><span class="lbl">חלק ${line==='add'?1:2}: ${LINES[line]}</span><span class="ph">שאלה ${k}</span></div></div>
    <div class="task"><button class="say" data-act="say" aria-label="להקריא">${ICON.speaker}</button><p>${q.say}</p></div>
    ${q.vis?`<div class="vis">${q.vis()}</div>`:''}${rows}${eq}
    ${S.toast?'<div class="note ok thanks" role="status">תודה!</div>':`<div class="actions"><button class="btn" data-act="skip">עוד לא למדתי את זה</button></div>`}`;
  document.getElementById('kp').innerHTML = !fd || fd.choice || S.toast ? `<p class="kbd">בשאלה הזאת בוחרים בלחיצה.</p>` :
    `<div class="pad">${[7,8,9,4,5,6,1,2,3].map(n=>`<button class="key" data-act="key" data-v="${n}">${n}</button>`).join('')}<button class="key" data-act="del" aria-label="מחיקה">⌫</button><button class="key" data-act="key" data-v="0">0</button><button class="key ok" data-act="ok">אישור</button></div><p class="kbd">אפשר גם להקליד במקלדת וללחוץ Enter</p>`;
}
let VOICE=null;
function pickVoice(){ try{ const he=speechSynthesis.getVoices().filter(v=>/^he|^iw/i.test(v.lang)); VOICE=he[0]||null; }catch(e){} }
try{ pickVoice(); speechSynthesis.addEventListener('voiceschanged',pickVoice); }catch(e){}
function speak(t){ try{ speechSynthesis.cancel(); const u=new SpeechSynthesisUtterance(t); u.lang='he-IL'; if(VOICE) u.voice=VOICE; u.rate=.9; speechSynthesis.speak(u);}catch(e){} }
const A={
  key(v){ if(S.val.length<4) S.val+=v; }, del(){ S.val=S.val.slice(0,-1); },
  ok(){ submit(S.val); return false; }, pick(v){ submit(+v); return false; },
  skip(){ if(S.toast) return false; record('עוד לא למדתי', false); return false; },
  say(){ speak(document.querySelector('.task p')?.textContent||''); return false; }
};
document.addEventListener('click',e=>{ const t=e.target.closest('[data-act]'); if(!t||t.disabled) return; if(A[t.dataset.act]?.(t.dataset.v)!==false) render(); });
document.addEventListener('keydown',e=>{ if(Shell.isOpen()||S.screen!=='q'||S.toast) return;
  if(e.key==='Enter'){ e.preventDefault(); submit(S.val); return; }
  if(/^[0-9]$/.test(e.key)) A.key(e.key); else if(e.key==='Backspace') A.del(); else return; e.preventDefault(); render(); });
if(Shell.start({page:'diag', title:'בדיקה קצרה'})) render();
