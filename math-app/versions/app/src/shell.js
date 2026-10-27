/* Shell: what every page shares. Who is learning, her colour, her coins, which lessons are open,
   and the top bar: [her name ▾] [home/lessons] .... title .... [coins].
   The parent area lives inside her name's menu, behind a question in English.
   Everything is kept in this browser (localStorage) for speed, and mirrored to the artifact's database
   so each girl's progress follows her to any computer where the link is opened. */
const Shell = (() => {
  /* ---------- saving: browser first, then the artifact's database ----------
     Synced keys: everything under mk: and home:, except which girl sits at this computer (mk:kid).
     Each key is one document {v: the stored text, t: when it changed}; the newer side wins.
     Pages without the database (or a signed-out view) keep working from the browser alone, and the
     next page that has it catches up in both directions. */
  const SCHEMA='3'; // raising this starts everyone from zero (asked for on 2026-10-26)
  const LOCAL=/^mk:(kid|schema|ts:.*)$/, SYNC=k=>/^(mk:|home:)/.test(k)&&!LOCAL.test(k);
  const rawSet=Storage.prototype.setItem, rawDel=Storage.prototype.removeItem;
  try{ if(localStorage.getItem('mk:schema')!==SCHEMA){ Object.keys(localStorage).filter(k=>/^(mk:|home:)/.test(k)).forEach(k=>rawDel.call(localStorage,k)); rawSet.call(localStorage,'mk:schema',SCHEMA); } }catch(e){}
  let DB=null, cloud='checking', quiet=false, pushT=0; const pending=new Set(), inflight=new Set();
  const tsOf=k=>{ try{ return +(localStorage.getItem('mk:ts:'+k)||0); }catch(e){ return 0; } };
  Storage.prototype.setItem=function(k,v){ rawSet.call(this,k,v); if(this===localStorage&&SYNC(k)&&!quiet){ rawSet.call(this,'mk:ts:'+k,String(Date.now())); pending.add(k); clearTimeout(pushT); pushT=setTimeout(push,700); } };
  async function push(){ if(!DB) return;
    for(const k of [...pending]){ if(inflight.has(k)) continue; pending.delete(k); inflight.add(k); // one write at a time per document
      const v=localStorage.getItem(k); if(v==null){ inflight.delete(k); continue; }
      try{ await DB.collection('store').doc(k).set({v, t:tsOf(k), s:SCHEMA}); } catch(e){ if(e?.code==='unavailable') pending.add(k); }
      inflight.delete(k); }
    if(pending.size){ clearTimeout(pushT); pushT=setTimeout(push,1500); } }
  addEventListener('pagehide',()=>{ clearTimeout(pushT); push(); });
  async function fullSync(){
    let snap; try{ snap=await DB.collection('store').get(); }catch(e){ cloud='off'; return; }
    const remote={}; const stale=[]; snap.docs.forEach(d=>{ const x=d.data(); if(x&&typeof x.v==='string'&&x.s===SCHEMA) remote[d.id]=x; else stale.push(d.id); });
    for(const id of stale){ try{ await DB.collection('store').doc(id).delete(); }catch(e){} } // left from before a fresh start
    let changed=false; quiet=true;
    for(const [k,r] of Object.entries(remote)) if(SYNC(k) && r.t>tsOf(k)){ rawSet.call(localStorage,k,r.v); rawSet.call(localStorage,'mk:ts:'+k,String(r.t)); changed=true; }
    quiet=false; cloud='on';
    Object.keys(localStorage).filter(SYNC).forEach(k=>{ if(!remote[k]||tsOf(k)>remote[k].t) pending.add(k); }); push();
    // newer progress came from another computer: start this page again from it (once; the next sync finds nothing newer)
    if(changed) location.reload();
  }
  async function wipeAll(){ // the parent's "start everything over"
    const keys=Object.keys(localStorage).filter(k=>/^(mk:|home:)/.test(k)&&k!=='mk:schema');
    if(DB){ try{ const snap=await DB.collection('store').get(); for(const d of snap.docs) await DB.collection('store').doc(d.id).delete(); }catch(e){} }
    keys.forEach(k=>rawDel.call(localStorage,k)); location.replace('index.html'); }
  try{ window.claude?.use?.('db').then(db=>{ DB=db; if(db) fullSync(); else cloud='off'; }).catch(()=>{ cloud='off'; }); }catch(e){ cloud='off'; }
  // the animals' art, kept private to the shell so it can draw her animal's head in the bar on every page
  const CH=(()=>{
/*CHARACTERS*/
    return {ANIMALS, drawChar};
  })();
  const COLORS=[{id:'blue',name:'כחול',c:'#2F5BD3'},{id:'purple',name:'סגול',c:'#7444C9'},{id:'pink',name:'ורוד',c:'#C2357C'},{id:'teal',name:'טורקיז',c:'#0B7570'},{id:'orange',name:'כתום',c:'#B04B0C'},{id:'green',name:'ירוק',c:'#2C7A30'}];
  const FACES={
    lili:`<svg viewBox="0 0 64 64" aria-hidden="true"><circle cx="13" cy="24" r="8" fill="#6B3E26"/><circle cx="51" cy="24" r="8" fill="#6B3E26"/><circle cx="13" cy="24" r="3" fill="#F2B21E"/><circle cx="51" cy="24" r="3" fill="#F2B21E"/><ellipse cx="32" cy="38" rx="17" ry="18" fill="#F6CFAE"/><path d="M15 34c0-12 8-19 17-19s17 7 17 19c-4-6-10-9-17-9s-13 3-17 9z" fill="#6B3E26"/><circle cx="25.5" cy="38" r="2.3" fill="#2B2B2B"/><circle cx="38.5" cy="38" r="2.3" fill="#2B2B2B"/><circle cx="22" cy="44" r="2.6" fill="#F19A9A" opacity=".7"/><circle cx="42" cy="44" r="2.6" fill="#F19A9A" opacity=".7"/><path d="M27 46c2.8 2.6 7.2 2.6 10 0" stroke="#2B2B2B" stroke-width="2" fill="none" stroke-linecap="round"/></svg>`,
    test:`<svg viewBox="0 0 64 64" aria-hidden="true"><path d="M32 8l6.5 14 15.2 1.7-11.3 10.3 3.2 15L32 41.4 18.4 49l3.2-15L10.3 23.7 25.5 22z" fill="#FFD54F" stroke="#E0A800" stroke-width="2" stroke-linejoin="round"/><circle cx="27" cy="31" r="2.3" fill="#2B2B2B"/><circle cx="37" cy="31" r="2.3" fill="#2B2B2B"/><path d="M28 37c2.4 2.2 5.6 2.2 8 0" stroke="#2B2B2B" stroke-width="2" fill="none" stroke-linecap="round"/></svg>`,
    nori:`<svg viewBox="0 0 64 64" aria-hidden="true"><path d="M12 40c-1-16 8-27 20-27s21 11 20 27c0 6-2 10-4 12H16c-2-2-4-6-4-12z" fill="#2E2A33"/><ellipse cx="32" cy="38" rx="15.5" ry="17" fill="#E9B98F"/><path d="M16 33c2-10 9-15 16-15s14 5 16 15c-6-2-11-6-14-11-3 6-10 10-18 11z" fill="#2E2A33"/><path d="M42 15l7-4-1 8z M42 15l8 3-6 4z" fill="#E8457A"/><circle cx="43.5" cy="16.5" r="2.4" fill="#C72F63"/><circle cx="26" cy="39" r="2.3" fill="#2B2B2B"/><circle cx="38" cy="39" r="2.3" fill="#2B2B2B"/><circle cx="22.5" cy="45" r="2.6" fill="#F19A9A" opacity=".7"/><circle cx="41.5" cy="45" r="2.6" fill="#F19A9A" opacity=".7"/><path d="M27.5 47c2.6 2.3 6.4 2.3 9 0" stroke="#2B2B2B" stroke-width="2" fill="none" stroke-linecap="round"/></svg>`
  };
  const IC={
    gear:'<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3.2"/><path d="M12 2.5v2.6M12 18.9v2.6M4.6 4.6l1.9 1.9M17.5 17.5l1.9 1.9M2.5 12h2.6M18.9 12h2.6M4.6 19.4l1.9-1.9M17.5 6.5l1.9-1.9"/><circle cx="12" cy="12" r="6.6"/></svg>',
    back:'<svg viewBox="0 0 24 24"><path d="M9 5l7 7-7 7"/></svg>',
    gift:'<svg viewBox="0 0 100 100" aria-hidden="true" style="stroke:none"><rect x="16" y="42" width="68" height="46" rx="6" fill="#E8457A"/><rect x="10" y="30" width="80" height="16" rx="5" fill="#F06292"/><rect x="44" y="30" width="12" height="58" fill="#FFD54F"/><path d="M50 30 C38 10 18 16 30 28 Z M50 30 C62 10 82 16 70 28 Z" fill="#FFD54F"/></svg>',
    down:'<svg viewBox="0 0 24 24"><path d="M6 9l6 6 6-6"/></svg>',
    home:'<svg viewBox="0 0 24 24"><path d="M3 11l9-7 9 7"/><path d="M5 10v10h5v-6h4v6h5V10"/></svg>',
    lessons:'<svg viewBox="0 0 24 24"><path d="M3 5.5C5.5 4 8.5 4 12 6c3.5-2 6.5-2 9-.5V19c-2.5-1.5-5.5-1.5-9 .5-3.5-2-6.5-2-9-.5z"/><path d="M12 6v13.5"/></svg>',
    lock:'<svg viewBox="0 0 24 24"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>',
    check:'<svg viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>',
    close:'<svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg>'
  };
  const COIN='<svg class="sh-coin" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="10" fill="#F2C230" stroke="#C99A12" stroke-width="2"/><circle cx="12" cy="12" r="6" fill="none" stroke="#C99A12" stroke-width="1.6"/></svg>';
  const ANIMALS=['cat','bunny','fox','bear','panda','owl','dino','unicorn','squirrel'];

  /* the skills map (math-app/SKILLS-MAP.md): a topic opens when the topics it needs are done */
  const TOPICS=[
    {id:'ח1',strand:'add',name:'חיבור עד 20',after:[],lessons:[['ח1.1','חברים של 10'],['ח1.2','עוברות את העשר']]},
    {id:'ח2',strand:'add',name:'ערך המקום עד 1000',after:['ח1'],lessons:[['ח2.1','עשרות ואחדות'],['ח2.2','מאות, עשרות, אחדות']]},
    {id:'ח3',strand:'add',name:'חיבור דו־ספרתי בראש',after:['ח2'],lessons:[['ח3.1','עשרות שלמות'],['ח3.2','מקום אחרי מקום'],['ח3.3','קפיצות על הציר']]},
    {id:'ח4',strand:'add',name:'חיבור תלת־ספרתי בראש',after:['ח3'],lessons:[['ח4.1','מקום אחרי מקום'],['ח4.2','קפיצות'],['ח4.3','השלמה למאה'],['ח4.4','מספר כמעט עגול'],['ח4.5','איזו דרך מתאימה כאן?']]},
    {id:'כ1',strand:'mul',name:'מה זה כפל',after:['ח1'],lessons:[['כ1.1','קבוצות שוות'],['כ1.2','קפיצות שוות'],['כ1.3','מערך והחלפה']]},
    {id:'כ2',strand:'mul',name:'לוח הכפל: העוגנים',after:['כ1','ח2'],lessons:[['כ2.1','כפול 2, 10, 1, 0'],['כ2.2','כפול 5']]},
    {id:'כ3',strand:'mul',name:'לוח הכפל: בונות מהעוגנים',after:['כ2','ח3'],lessons:[['כ3.1','כפול 4 וכפול 8'],['כ3.2','כפול 3 וכפול 6'],['כ3.3','כפול 9'],['כ3.4','מה שנשאר, ואיזו דרך?']]}
  ];
  const BUILT={'ח3.3':'play.html#h3.3','ח4.1':'lesson.html','ח4.2':'play.html#h4.2','ח4.3':'play.html#h4.3','כ1.1':'play.html#k1.1','כ1.2':'play.html#k1.2','כ1.3':'play.html#k1.3'};
  /* the diagnostic (SKILLS-MAP.md §4): each answer that is right marks lessons as known, together with the
     lessons before them in the same line. Method lessons (ח3.3, ח4.2 and on, כ1.3) only open in order. */
  const DIAG_LINES={add:['ח1.1','ח1.2','ח2.1','ח2.2','ח3.1','ח3.2','ח4.1'], mul:['כ1.1','כ1.2','כ2.1','כ2.2']};
  function placeFrom(right){ // right: set of question numbers answered right
    const known=new Set(), R=q=>right.has(q);
    const marks={'ח1.1':R(1)&&R(2),'ח1.2':R(3)&&R(4),'ח2.1':R(5),'ח2.2':R(6)&&R(7),'ח3.1':R(8),'ח3.2':R(9),'ח4.1':R(9)&&R(10),'כ1.1':R(11),'כ1.2':R(11),'כ2.1':R(12),'כ2.2':R(12)};
    for(const line of Object.values(DIAG_LINES)) line.forEach((l,i)=>{ if(marks[l]) line.slice(0,i+1).forEach(x=>known.add(x)); });
    return [...known];
  }
  function saveDiag(id,answers,right){ const p=progOf(id); p.known={}; placeFrom(right).forEach(l=>p.known[l]=true); p.diag={date:new Date().toISOString().slice(0,10), answers}; saveProg(id,p); return p; }

  const get=(k,d)=>{ try{ const v=JSON.parse(localStorage.getItem(k)||'null'); return v==null?d:v; }catch(e){ return d; } };
  const put=(k,v)=>{ try{ localStorage.setItem(k,JSON.stringify(v)); }catch(e){} };
  let KIDS=get('mk:kids',[{id:'lili',name:'לילי',color:null,face:'lili'},{id:'nori',name:'נורי',color:null,face:'nori'}]);
  // a trial user for the parent: its own progress, home and coins, so trying things never touches the girls' data
  if(!KIDS.some(k=>k.id==='test')) KIDS.push({id:'test',name:'ניסיון',color:'orange',face:'test',trial:true});
  let kidId=get('mk:kid',null);
  const kid=()=>KIDS.find(k=>k.id===kidId)||null;
  const accentOf=k=>COLORS.find(c=>c.id===k?.color)?.c||'#7444C9';
  const esc=t=>String(t).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
  const avatar=k=>`<span class="sh-av" style="background:${accentOf(k)}">${FACES[k.face]||FACES.lili}</span>`;

  /* coins live in the girl's home, so the home and the lessons share one purse */
  const homeOf=id=>get('home:'+id,{});
  const coins=(id=kidId)=>{ const h=homeOf(id); return h.coins==null?12:h.coins; };
  function addCoins(n,id=kidId){ const h=homeOf(id); h.coins=(h.coins==null?12:h.coins)+n; put('home:'+id,h); renderBar(); }

  const progOf=id=>{ const p={done:{},known:{},opened:[],diag:null,...get('mk:prog:'+id,{})}; delete p.placed; return p; };
  const saveProg=(id,p)=>put('mk:prog:'+id,p);
  const has=(p,l)=>p.done[l]||p.known[l];
  const topicDone=(p,t)=>t.lessons.every(([l])=>has(p,l));
  const topicOpen=(p,t)=>p.opened.includes(t.id)||t.lessons.some(([l])=>has(p,l))||t.after.every(a=>topicDone(p,TOPICS.find(x=>x.id===a)));
  function lessonState(p,t,i){
    const id=t.lessons[i][0];
    if(p.done[id]) return 'done';
    if(p.known[id]) return 'known';
    if(!topicOpen(p,t)) return 'locked';
    return i===0||has(p,t.lessons[i-1][0]) ? 'open' : 'locked';
  }
  function completeLesson(lessonId,id=kidId){
    const p=progOf(id); const first=!p.done[lessonId]; p.done[lessonId]=true; saveProg(id,p);
    const h=homeOf(id); let animal=null;
    if(first){
      if(h.chosen){ animal=ANIMALS.find(a=>!(h.animals||[]).includes(a)); if(animal){ (h.animals ||= []).push(animal); h.newAnimal=animal; } }
      else h.pendingAnimals=(h.pendingAnimals||0)+1;
      put('home:'+id,h);
    }
    return {first, animal, chosen:!!h.chosen};
  }

  /* ---------- top bar ---------- */
  let opts={}, menu=false, gate=null, screen=null, bumpN=0, lastCoins=null, bumpT=0;
  /* her animal's head, gently moving, next to the coins: the way into her home */
  function petHtml(){
    const h=opts.pet||homeOf(kidId), here=opts.page==='home';
    let art, label;
    if(h.chosen && CH.ANIMALS[h.animal]){
      const w=h.worn||{}, head={hat:w.hat, hair:w.hair, glasses:w.glasses};
      art=CH.drawChar(h.animal, head).replace(/viewBox="[^"]*"/,'viewBox="18 -14 164 172"'); label='הבית שלי';
    } else { art=IC.gift; label='הבית שלי: חיה מחכה לך'; }
    return here ? `<span class="sh-pet here" aria-hidden="true">${art}</span>` : `<a class="sh-pet ${bumpN?'happy':''}" href="home.html" aria-label="${label}" title="${label}">${art}</a>`;
  }
  function renderBar(){
    const bar=document.getElementById('bar'); if(!bar) return;
    const k=kid();
    if(!k || screen){ bar.innerHTML=`<span class="sh-title">מתמטיקידס</span>`; return; }
    const c=opts.coins!=null?opts.coins:coins();
    // coins that just arrived float up next to the purse, and her animal hops
    if(lastCoins!=null && c>lastCoins){ bumpN=c-lastCoins; clearTimeout(bumpT); bumpT=setTimeout(()=>{ bumpN=0; renderBar(); },1500); }
    lastCoins=c;
    // the lessons page is the main page: settings live there. Every other page has a way back to it.
    const start = opts.page==='lessons'
      ? `<div class="sh-me"><button class="sh-gear" data-sh="menu" aria-expanded="${menu}" aria-haspopup="true" aria-label="הגדרות">${IC.gear}</button>${menu?menuHtml(k):''}</div>`
      : `<a class="sh-back" href="index.html">${IC.back}<span>חזרה</span></a>`;
    bar.innerHTML=`${start}<h1 class="sh-title">${opts.title||''}</h1>
      ${petHtml()}
      <span class="sh-bank ${bumpN?'bump':''}" aria-label="מטבעות: ${c}">${COIN}<span class="ltr">${c}</span>${bumpN?`<span class="sh-plus" dir="ltr">+${bumpN}</span>`:''}</span>`;
  }
  function menuHtml(k){
    const others=KIDS.filter(x=>x.id!==k.id);
    return `<div class="sh-menu" role="menu">
      <div class="sh-row sh-now">${avatar(k)}<span>${esc(k.name)}</span></div>
      ${others.map(x=>`<button class="sh-row" role="menuitem" data-sh="kid" data-v="${x.id}">${avatar(x)}<span>לעבור ל${esc(x.name)}</span></button>`).join('')}
      <div class="sh-sep"></div>
      <p class="sh-h">הצבע שלי</p>
      <div class="sh-sws">${COLORS.map(c=>`<button class="sh-sw" style="--c:${c.c}" data-sh="color" data-v="${c.id}" aria-label="צבע ${c.name}" aria-pressed="${k.color===c.id}">${k.color===c.id?IC.check:''}</button>`).join('')}</div>
      <div class="sh-sep"></div>
      <button class="sh-row sh-parent" role="menuitem" data-sh="gate"><span class="sh-lock">${IC.lock}</span><span>אזור הורים</span></button>
    </div>`;
  }

  /* ---------- first entry (who / colour), parent gate and parent area ---------- */
  const ONES=['','one','two','three','four','five','six','seven','eight','nine'], TENSW=['','','twenty','thirty','forty','fifty','sixty','seventy','eighty','ninety'];
  function newGate(){ const t=2+Math.floor(Math.random()*8), o=1+Math.floor(Math.random()*9); return {n:t*10+o, words:`${TENSW[t]}-${ONES[o]}`, input:'', msg:'', open:false}; }
  function renderOv(){
    let ov=document.getElementById('sh-ov'); if(!ov){ ov=document.createElement('div'); ov.id='sh-ov'; document.body.appendChild(ov); }
    if(screen==='who'){ ov.innerHTML=`<div class="sh-full"><div class="sh-card"><h1>מי לומדת היום?</h1><div class="sh-who">${KIDS.map(k=>`<button class="sh-whocard" style="--c:${k.color?accentOf(k):'var(--line)'}" data-sh="pick" data-v="${k.id}">${avatar(k)}${esc(k.name)}${k.trial?'<small>לאמא, לניסיון</small>':''}</button>`).join('')}</div></div></div>`; return; }
    if(screen==='color'){ const k=kid(); ov.innerHTML=`<div class="sh-full"><div class="sh-card"><h1>שלום ${esc(k.name)}! איזה צבע את רוצה?</h1><p>אפשר להחליף אותו מתי שרוצים, בלחיצה על השם שלך למעלה.</p><div class="sh-sws big">${COLORS.map(c=>`<button class="sh-sw" style="--c:${c.c}" data-sh="first" data-v="${c.id}" aria-label="צבע ${c.name}"></button>`).join('')}</div></div></div>`; return; }
    if(!gate){ ov.innerHTML=''; return; }
    if(gate.open){ ov.innerHTML=`<div class="sh-scrim"><div class="sh-modal wide" role="dialog" aria-label="אזור הורים"><button class="sh-x" data-sh="gateClose" aria-label="סגירה">${IC.close}</button><h2>אזור הורים</h2>${parentHtml()}</div></div>`; return; }
    ov.innerHTML=`<div class="sh-scrim"><div class="sh-modal" role="dialog" aria-label="שאלה להורים">
      <button class="sh-x" data-sh="gateClose" aria-label="סגירה">${IC.close}</button>
      <h2>שאלה להורים</h2><p>Type the number in digits:</p><p class="sh-en">${gate.words}</p>
      <div class="sh-disp">${gate.input||'&nbsp;'}</div>${gate.msg?`<p>${gate.msg}</p>`:''}
      <div class="sh-pad">${[7,8,9,4,5,6,1,2,3].map(n=>`<button data-sh="gKey" data-v="${n}">${n}</button>`).join('')}<button data-sh="gDel" aria-label="מחיקה">⌫</button><button data-sh="gKey" data-v="0">0</button><button class="ok" data-sh="gOk">אישור</button></div>
    </div></div>`;
  }
  function parentHtml(){
    const cl = cloud==='on' ? 'נשמר בענן: ההתקדמות זמינה בכל מחשב שבו פותחים את הקישור.' : cloud==='checking' ? 'בודק שמירה בענן...' : 'בעמוד הזה ההתקדמות נשמרת בדפדפן, ותעלה לענן כשחוזרים למפת השיעורים.';
    return `<p class="sh-cloud ${cloud}">☁ ${cl}</p><p class="sh-note">"ידוע מהבדיקה" = ענתה נכון בבדיקת הידע. כדאי לשבת לידן בבדיקה: תשובה נכונה יכולה להיות גם ספירה על האצבעות, ואז אפשר לנעול כאן ידנית (בדיקה מחדש). מסך ההורה המלא יחובר בהמשך.</p>
      <div class="sh-pcols">${KIDS.map(k=>{ const p=progOf(k.id);
        const diag = p.diag ? `<p class="sh-diag">בדיקת ידע: ${p.diag.date} · נכונות ${p.diag.answers.filter(a=>a.ok).length} מתוך ${p.diag.answers.length}<br>${p.diag.answers.map(a=>`<span class="${a.ok?'ok':'no'}">${a.q}: ${a.given}</span>`).join(' ')}</p>` : '<p class="sh-diag">עוד לא עשתה בדיקת ידע.</p>';
        return `<section><h3>${avatar(k)}${esc(k.name)} <span class="sh-coins">${COIN}${coins(k.id)}</span></h3>${diag}<ul class="sh-topics">${TOPICS.map(t=>{
          const done=topicDone(p,t), open=topicOpen(p,t), n=t.lessons.filter(([l])=>p.done[l]).length, kn=t.lessons.filter(([l])=>p.known[l]&&!p.done[l]).length;
          const st = done ? (n?'הושלם':'ידוע מהבדיקה') : open ? `פתוח · ${n} מתוך ${t.lessons.length}${kn?` · ${kn} ידועים מהבדיקה`:''}` : 'נעול';
          const btn = done ? '' : p.opened.includes(t.id)
            ? `<button data-sh="unopen" data-v="${k.id}|${t.id}">לבטל פתיחה</button>`
            : open ? '' : `<button data-sh="open" data-v="${k.id}|${t.id}">לפתוח עכשיו</button>`;
          return `<li><b>${t.name}</b><span>${st}</span>${btn}</li>`; }).join('')}</ul>
          <div class="sh-row2"><button class="sh-reset" data-sh="rediag" data-v="${k.id}">בדיקת ידע מחדש</button>${p.diag?'':`<button class="sh-reset" data-sh="skipDiag" data-v="${k.id}">לדלג על הבדיקה</button>`}<button class="sh-reset" data-sh="resetProg" data-v="${k.id}">לאפס התקדמות</button></div></section>`; }).join('')}</div>
      <div class="sh-wipe">${wipeAsk?`<p>למחוק הכל לשתי הבנות? שיעורים, בדיקת ידע, הבית, החיות והמטבעות. אי אפשר לבטל.</p><button class="sh-reset danger" data-sh="wipe">כן, להתחיל הכל מהתחלה</button><button class="sh-reset" data-sh="wipeNo">ביטול</button>`:`<button class="sh-reset" data-sh="wipeAsk">להתחיל הכל מהתחלה (שתי הבנות)</button>`}</div>`;
  }
  let wipeAsk=false;
  const ACT={
    wipeAsk(){ wipeAsk=true; }, wipeNo(){ wipeAsk=false; }, wipe(){ wipeAll(); return 'stop'; },
    menu(){ menu=!menu; },
    kid(v){ put('mk:kid',v); location.reload(); return 'stop'; },
    color(v){ kid().color=v; put('mk:kids',KIDS); applyAccent(); opts.onColor?.(); },
    gate(){ menu=false; gate=newGate(); },
    gateClose(){ gate=null; opts.onParentClose?.(); },
    gKey(v){ if(gate.input.length<3) gate.input+=v; gate.msg=''; },
    gDel(){ gate.input=gate.input.slice(0,-1); },
    gOk(){ if(+gate.input===gate.n) gate.open=true; else { gate=newGate(); gate.msg='לא מתאים. הנה מספר אחר.'; } },
    open(v){ const [id,t]=v.split('|'), p=progOf(id); p.opened.push(t); saveProg(id,p); },
    unopen(v){ const [id,t]=v.split('|'), p=progOf(id); p.opened=p.opened.filter(x=>x!==t); saveProg(id,p); },
    resetProg(v){ saveProg(v,{done:{},known:{},opened:[],diag:null}); },
    rediag(v){ const p=progOf(v); p.diag=null; p.known={}; saveProg(v,p); if(v===kidId){ location.href='diag.html'; return 'stop'; } },
    skipDiag(v){ const p=progOf(v); p.diag={date:new Date().toISOString().slice(0,10), answers:[], skipped:true}; saveProg(v,p); },
    pick(v){ kidId=v; put('mk:kid',v); if(kid().color){ location.reload(); return 'stop'; } screen='color'; },
    first(v){ kid().color=v; put('mk:kids',KIDS); location.reload(); return 'stop'; }
  };
  function applyAccent(){ document.documentElement.style.setProperty('--accent', accentOf(kid())); }
  document.addEventListener('click',e=>{
    const t=e.target.closest('[data-sh]');
    if(!t){ if(menu && !e.target.closest('.sh-menu')){ menu=false; renderBar(); } return; }
    e.preventDefault();
    if(ACT[t.dataset.sh]?.(t.dataset.v)==='stop') return;
    renderBar(); renderOv();
  });
  // the parent gate takes the keyboard while it is open, before the page sees it
  document.addEventListener('keydown',e=>{
    if(e.key==='Escape' && menu){ menu=false; renderBar(); e.stopImmediatePropagation(); return; }
    if(!gate) return;
    if(!gate.open){ if(/^[0-9]$/.test(e.key)) ACT.gKey(e.key); else if(e.key==='Backspace') ACT.gDel(); else if(e.key==='Enter') ACT.gOk(); else if(e.key==='Escape') ACT.gateClose(); else return; }
    else if(e.key==='Escape') ACT.gateClose(); else return;
    e.preventDefault(); e.stopImmediatePropagation(); renderOv();
  },true);

  /* a page calls Shell.start({page, title}) first. Returns false when the page must not run yet
     (nobody chosen: the lessons page asks who is learning, other pages go there). */
  function start(o){
    opts=o||{}; applyAccent();
    if(!kid() || !kid().color){
      if(opts.page!=='lessons'){ location.replace('index.html'); return false; }
      screen = kid() ? 'color' : 'who'; renderBar(); renderOv(); return false;
    }
    renderBar(); renderOv(); return true;
  }
  const isOpen=()=>menu||!!gate;
  return {start, renderBar:o=>{ Object.assign(opts,o||{}); renderBar(); }, kid, accentOf, coins, addCoins, completeLesson,
    TOPICS, BUILT, progOf, topicDone, topicOpen, lessonState, saveDiag, isOpen, esc, COIN, IC};
})();
