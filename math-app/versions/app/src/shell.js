/* Shell: what every page shares. Who is learning, her colour, her coins, which lessons are open,
   and the top bar: [her name ▾] [home/lessons] .... title .... [coins].
   The parent area lives inside her name's menu, behind a question in English.
   Everything is kept in this browser (localStorage), so all pages of the prototype see the same girl. */
const Shell = (() => {
  const COLORS=[{id:'blue',name:'כחול',c:'#2F5BD3'},{id:'purple',name:'סגול',c:'#7444C9'},{id:'pink',name:'ורוד',c:'#C2357C'},{id:'teal',name:'טורקיז',c:'#0B7570'},{id:'orange',name:'כתום',c:'#B04B0C'},{id:'green',name:'ירוק',c:'#2C7A30'}];
  const FACES={
    lili:`<svg viewBox="0 0 64 64" aria-hidden="true"><circle cx="13" cy="24" r="8" fill="#6B3E26"/><circle cx="51" cy="24" r="8" fill="#6B3E26"/><circle cx="13" cy="24" r="3" fill="#F2B21E"/><circle cx="51" cy="24" r="3" fill="#F2B21E"/><ellipse cx="32" cy="38" rx="17" ry="18" fill="#F6CFAE"/><path d="M15 34c0-12 8-19 17-19s17 7 17 19c-4-6-10-9-17-9s-13 3-17 9z" fill="#6B3E26"/><circle cx="25.5" cy="38" r="2.3" fill="#2B2B2B"/><circle cx="38.5" cy="38" r="2.3" fill="#2B2B2B"/><circle cx="22" cy="44" r="2.6" fill="#F19A9A" opacity=".7"/><circle cx="42" cy="44" r="2.6" fill="#F19A9A" opacity=".7"/><path d="M27 46c2.8 2.6 7.2 2.6 10 0" stroke="#2B2B2B" stroke-width="2" fill="none" stroke-linecap="round"/></svg>`,
    nori:`<svg viewBox="0 0 64 64" aria-hidden="true"><path d="M12 40c-1-16 8-27 20-27s21 11 20 27c0 6-2 10-4 12H16c-2-2-4-6-4-12z" fill="#2E2A33"/><ellipse cx="32" cy="38" rx="15.5" ry="17" fill="#E9B98F"/><path d="M16 33c2-10 9-15 16-15s14 5 16 15c-6-2-11-6-14-11-3 6-10 10-18 11z" fill="#2E2A33"/><path d="M42 15l7-4-1 8z M42 15l8 3-6 4z" fill="#E8457A"/><circle cx="43.5" cy="16.5" r="2.4" fill="#C72F63"/><circle cx="26" cy="39" r="2.3" fill="#2B2B2B"/><circle cx="38" cy="39" r="2.3" fill="#2B2B2B"/><circle cx="22.5" cy="45" r="2.6" fill="#F19A9A" opacity=".7"/><circle cx="41.5" cy="45" r="2.6" fill="#F19A9A" opacity=".7"/><path d="M27.5 47c2.6 2.3 6.4 2.3 9 0" stroke="#2B2B2B" stroke-width="2" fill="none" stroke-linecap="round"/></svg>`
  };
  const IC={
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
    {id:'ח4',strand:'add',name:'חיבור תלת־ספרתי בראש',after:['ח3'],lessons:[['ח4.1','מקום אחרי מקום'],['ח4.2','קפיצות'],['ח4.3','השלמה לעשרת או למאה'],['ח4.4','מספר כמעט עגול'],['ח4.5','איזו דרך מתאימה כאן?']]},
    {id:'כ1',strand:'mul',name:'מה זה כפל',after:['ח1'],lessons:[['כ1.1','קבוצות שוות'],['כ1.2','קפיצות שוות'],['כ1.3','מערך והחלפה']]},
    {id:'כ2',strand:'mul',name:'לוח הכפל: העוגנים',after:['כ1','ח2'],lessons:[['כ2.1','כפול 2, 10, 1, 0'],['כ2.2','כפול 5']]},
    {id:'כ3',strand:'mul',name:'לוח הכפל: בונות מהעוגנים',after:['כ2','ח3'],lessons:[['כ3.1','כפול 4 וכפול 8'],['כ3.2','כפול 3 וכפול 6'],['כ3.3','כפול 9'],['כ3.4','מה שנשאר, ואיזו דרך?']]}
  ];
  const BUILT={'ח4.1':'lesson.html'};
  // until the diagnostic exists, the prototype acts as if it placed both girls after ח3
  const PLACED=['ח1','ח2','ח3'];

  const get=(k,d)=>{ try{ const v=JSON.parse(localStorage.getItem(k)||'null'); return v==null?d:v; }catch(e){ return d; } };
  const put=(k,v)=>{ try{ localStorage.setItem(k,JSON.stringify(v)); }catch(e){} };
  let KIDS=get('mk:kids',[{id:'lili',name:'לילי',color:null,face:'lili'},{id:'nori',name:'נורי',color:null,face:'nori'}]);
  let kidId=get('mk:kid',null);
  const kid=()=>KIDS.find(k=>k.id===kidId)||null;
  const accentOf=k=>COLORS.find(c=>c.id===k?.color)?.c||'#7444C9';
  const esc=t=>String(t).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
  const avatar=k=>`<span class="sh-av" style="background:${accentOf(k)}">${FACES[k.face]||FACES.lili}</span>`;

  /* coins live in the girl's home, so the home and the lessons share one purse */
  const homeOf=id=>get('home:'+id,{});
  const coins=(id=kidId)=>{ const h=homeOf(id); return h.coins==null?12:h.coins; };
  function addCoins(n,id=kidId){ const h=homeOf(id); h.coins=(h.coins==null?12:h.coins)+n; put('home:'+id,h); renderBar(); }

  const progOf=id=>({done:{},placed:PLACED.slice(),opened:[],...get('mk:prog:'+id,{})});
  const saveProg=(id,p)=>put('mk:prog:'+id,p);
  const topicDone=(p,t)=>p.placed.includes(t.id)||t.lessons.every(([l])=>p.done[l]);
  const topicOpen=(p,t)=>p.placed.includes(t.id)||p.opened.includes(t.id)||t.after.every(a=>topicDone(p,TOPICS.find(x=>x.id===a)));
  function lessonState(p,t,i){
    const id=t.lessons[i][0];
    if(p.done[id]) return 'done';
    if(p.placed.includes(t.id)) return 'known';
    if(!topicOpen(p,t)) return 'locked';
    return i===0||p.done[t.lessons[i-1][0]] ? 'open' : 'locked';
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
  function renderBar(){
    const bar=document.getElementById('bar'); if(!bar) return;
    const k=kid();
    if(!k || screen){ bar.innerHTML=`<span class="sh-title" style="text-align:start">מתמטיקידס</span>`; return; }
    const c=opts.coins!=null?opts.coins:coins();
    // coins that just arrived float up next to the purse
    if(lastCoins!=null && c>lastCoins){ bumpN=c-lastCoins; clearTimeout(bumpT); bumpT=setTimeout(()=>{ bumpN=0; renderBar(); },1500); }
    lastCoins=c;
    const nav = opts.page==='home'
      ? `<a class="sh-nav" href="index.html">${IC.lessons}<span>שיעורים</span></a>`
      : `<a class="sh-nav" href="home.html">${IC.home}<span>הבית</span></a>`;
    bar.innerHTML=`<div class="sh-me">
        <button class="sh-chip" data-sh="menu" aria-expanded="${menu}" aria-haspopup="true">${avatar(k)}${esc(k.name)}<span class="sh-down">${IC.down}</span></button>
        ${menu?menuHtml(k):''}
      </div>${nav}
      <span class="sh-title">${opts.title||''}</span>
      <span class="sh-bank ${bumpN?'bump':''}" aria-label="מטבעות: ${c}">${COIN}<span class="ltr">${c}</span>${bumpN?`<span class="sh-plus" dir="ltr">+${bumpN}</span>`:''}</span>`;
  }
  function menuHtml(k){
    const others=KIDS.filter(x=>x.id!==k.id);
    return `<div class="sh-menu" role="menu">
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
    if(screen==='who'){ ov.innerHTML=`<div class="sh-full"><div class="sh-card"><h1>מי לומדת היום?</h1><div class="sh-who">${KIDS.map(k=>`<button class="sh-whocard" style="--c:${k.color?accentOf(k):'var(--line)'}" data-sh="pick" data-v="${k.id}">${avatar(k)}${esc(k.name)}</button>`).join('')}</div></div></div>`; return; }
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
    return `<p class="sh-note">בגרסת הניסיון: כאילו האבחון מיקם את שתיהן אחרי "חיבור דו־ספרתי בראש". מסך ההורה המלא (סיכומים, הגדרות) יחובר בהמשך.</p>
      <div class="sh-pcols">${KIDS.map(k=>{ const p=progOf(k.id);
        return `<section><h3>${avatar(k)}${esc(k.name)} <span class="sh-coins">${COIN}${coins(k.id)}</span></h3><ul class="sh-topics">${TOPICS.map(t=>{
          const done=topicDone(p,t), open=topicOpen(p,t), n=t.lessons.filter(([l])=>p.done[l]).length;
          const st = p.placed.includes(t.id) ? 'ידוע מהאבחון' : done ? 'הושלם' : open ? `פתוח · ${n} מתוך ${t.lessons.length}` : 'נעול';
          const btn = p.placed.includes(t.id) || done ? '' : p.opened.includes(t.id)
            ? `<button data-sh="unopen" data-v="${k.id}|${t.id}">לבטל פתיחה</button>`
            : open ? '' : `<button data-sh="open" data-v="${k.id}|${t.id}">לפתוח עכשיו</button>`;
          return `<li><b>${t.name}</b><span>${st}</span>${btn}</li>`; }).join('')}</ul>
          <button class="sh-reset" data-sh="resetProg" data-v="${k.id}">לאפס התקדמות בשיעורים</button></section>`; }).join('')}</div>`;
  }
  const ACT={
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
    resetProg(v){ saveProg(v,{done:{},placed:PLACED.slice(),opened:[]}); },
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
    TOPICS, BUILT, progOf, topicDone, topicOpen, lessonState, isOpen, esc, COIN, IC};
})();
