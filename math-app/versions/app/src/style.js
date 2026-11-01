/* לעצב את עצמי: hairstyle, hair colour and specials. Free things apply on a click and save at once;
   happy colours and specials are looked at first (eye) and bought once (bag). */
const kidId=Shell.kid()?.id, FACE=Shell.kid()?.face||'lili';
const COIN='<svg class="coin" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="10" fill="#F2C230" stroke="#C99A12" stroke-width="2"/><circle cx="12" cy="12" r="6" fill="none" stroke="#C99A12" stroke-width="1.6"/></svg>';
const IC={
  eye:'<svg class="ic" viewBox="0 0 24 24"><path d="M2 12s3.6-6.5 10-6.5S22 12 22 12s-3.6 6.5-10 6.5S2 12 2 12z"/><circle cx="12" cy="12" r="3"/></svg>',
  bag:'<svg class="ic" viewBox="0 0 24 24"><path d="M5 8h14l-1.2 12.2a1 1 0 0 1-1 .8H7.2a1 1 0 0 1-1-.8z"/><path d="M9 10V7a3 3 0 0 1 6 0v3"/></svg>'
};
const TABS=[{id:'hair',name:'תסרוקת'},{id:'color',name:'צבע שיער'},{id:'special',name:'מיוחדים'}];
let tab='hair', preview=null, note='';
const homeState=()=>{ try{ return JSON.parse(localStorage.getItem('home:'+kidId)||'{}'); }catch(e){ return {}; } };
const styleOf=id=>HAIR_STYLES.find(h=>h.id===id);
// a ribbon needs somewhere to tie it: on a style without a tie it switches to a ponytail
const withRibbon=(L,on)=>({...L, ribbon:on, hair: on && !styleOf(L.hair)?.ties.length ? 'pony' : L.hair});
const effect=(L,id)=>{ const sp=HAIR_SPECIALS.find(s=>s.id===id); if(!sp) return {...L,color:id};
  if(sp.kind==='color') return {...L,color:id}; if(id==='ribbon') return withRibbon(L,true); return {...L,[id]:true}; };

function shopCard(id,name,price,thumb,L){
  const own=price===0||L.owned.includes(id), coins=Shell.coins(), can=coins>=price;
  const on = HAIR_SPECIALS.find(s=>s.id===id&&s.kind==='toggle') ? !!L[id] : L.color===id;
  if(own){ const act=HAIR_SPECIALS.find(s=>s.id===id&&s.kind==='toggle')?'toggle':'color';
    return `<button class="item ${on?'on':''}" data-act="${act}" data-v="${id}"><div class="th">${thumb}</div><b>${name}</b>${on?`<span class="state">${act==='toggle'?'עליי':'הצבע שלי'}</span>`:''}</button>`; }
  return `<div class="item ${preview?.id===id?'pv':''}"><div class="th">${thumb}</div><b>${name}</b>
    <div class="acts"><button class="ib eye" data-act="preview" data-v="${id}" aria-pressed="${preview?.id===id}" aria-label="לראות איך זה נראה" title="לראות איך זה נראה">${IC.eye}</button>
    <button class="ib buy" data-act="buy" data-v="${id}" ${can?'':'disabled'} aria-label="לקנות ב-${price} מטבעות" title="לקנות">${IC.bag}<span class="ltr">${price}</span>${COIN}</button></div>
    ${can?'':`<span class="need">חסרים ${price-coins}</span>`}</div>`;
}
function render(){
  Shell.renderBar({page:'style', title:'לעצב את עצמי', back:'home.html'});
  const L=Shell.lookOf(kidId), view=preview?effect(L,preview.id):L, worn=homeState().girlWorn||{};
  let cards='';
  if(tab==='hair') cards=HAIR_STYLES.map(h=>`<button class="item ${L.hair===h.id?'on':''}" data-act="hair" data-v="${h.id}"><div class="th">${drawGirlHead(FACE,{...L,hair:h.id})}</div><b>${h.name}</b></button>`).join('');
  else if(tab==='color') cards=HAIR_COLORS.map(c=>shopCard(c.id,c.name,c.price,`<span class="sw" style="background:${c.fill}"></span>`,L)).join('');
  else cards=HAIR_SPECIALS.map(s=>shopCard(s.id,s.name,s.price,drawGirlHead(FACE,effect(L,s.id)),L)).join('');
  document.getElementById('app').innerHTML=`
    <section class="stage">${preview?'<span class="tag">מסתכלת</span>':''}${drawGirl(FACE,worn,{},view)}</section>
    <section class="card"><h2>איך אני נראית</h2><p class="meta">תסרוקות וצבעים טבעיים בחינם. צבעים שמחים ומיוחדים קונים פעם אחת, והם שלך.</p>
      <div class="tabs" role="tablist">${TABS.map(t=>`<button class="tab" role="tab" aria-selected="${tab===t.id}" data-act="tab" data-v="${t.id}">${t.name}</button>`).join('')}</div>
      ${note?`<p class="meta" role="status">${note}</p>`:''}
      <div class="grid">${cards}</div></section>`;
}
const A={
  tab(v){ tab=v; preview=null; note=''; },
  hair(v){ const L=Shell.lookOf(kidId); Shell.saveLook({...L,hair:v, ribbon: L.ribbon && styleOf(v).ties.length ? true : false}); },
  color(v){ Shell.saveLook({...Shell.lookOf(kidId),color:v}); },
  toggle(v){ const L=Shell.lookOf(kidId); Shell.saveLook(v==='ribbon'?withRibbon(L,!L.ribbon):{...L,[v]:!L[v]}); },
  preview(v){ preview = preview?.id===v ? null : {id:v}; },
  buy(v){ preview=null; if(!Shell.buyLook(v)){ note='עוד לא מספיק מטבעות. אפשר להרוויח בשיעורים ובתרגול הבונוס.'; return; }
    note=''; Shell.saveLook(effect(Shell.lookOf(kidId),v)); }
};
document.addEventListener('click',e=>{ const t=e.target.closest('[data-act]'); if(!t||t.disabled) return; if(A[t.dataset.act]?.(t.dataset.v)!==false) render(); });
if(Shell.start({page:'style', title:'לעצב את עצמי', back:'home.html'})) render();
