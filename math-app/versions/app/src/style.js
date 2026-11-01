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
const spec=id=>HAIR_SPECIALS.find(s=>s.id===id);
// a ribbon needs somewhere to tie it: on a style without a tie it switches to a ponytail
const withRibbon=(L,on)=>({...L, ribbon:on, hair: on && !styleOf(L.hair)?.ties.length ? 'pony' : L.hair});
// colours she may use for a second colour or a streak: the free ones and the ones she bought
const myColors=L=>HAIR_COLORS.filter(c=>!c.price||L.owned.includes(c.id));
const effect=(L,id)=>{ const sp=spec(id); if(!sp) return {...L,color:id};
  if(sp.kind==='color') return {...L,color:id};
  if(sp.kind==='style') return {...L,hair:id};
  if(id==='half') return {...L,half:true,color2:L.color2||(L.color==='pink'?'sky':'pink')};
  if(id==='streak') return {...L,streak:true,streakColor:L.streakColor||(L.color==='pink'?'purple':'pink')};
  if(id==='ribbon') return withRibbon(L,true);
  const off=sp.group?Object.fromEntries(HAIR_SPECIALS.filter(x=>x.group===sp.group&&x.id!==id).map(x=>[x.id,false])):{};
  return {...L,...off,[id]:true}; };
const isOn=(L,id)=>{ const sp=spec(id); if(!sp) return L.color===id; if(sp.kind==='style') return L.hair===id; if(sp.kind==='color') return L.color===id; return !!L[id]; };
const badge=p=>{ const t=tierOf(p); return t.badge?`<span class="tier ${t.id}" title="${t.name}">${t.badge} ${t.name}</span>`:''; };

function shopCard(id,name,price,thumb,L){
  const own=price===0||L.owned.includes(id), coins=Shell.coins(), can=coins>=price, sp=spec(id), on=isOn(L,id);
  if(own){ const act=sp&&(sp.kind==='toggle'||sp.kind==='two')?'toggle':sp?.kind==='style'?'hair':'color';
    return `<button class="item ${on?'on':''}" data-act="${act}" data-v="${id}"><div class="th">${thumb}</div><b>${name}</b>${on?`<span class="state">${act==='color'?'הצבע שלי':act==='hair'?'התסרוקת שלי':'עליי'}</span>`:''}</button>`; }
  return `<div class="item ${preview?.id===id?'pv':''}">${badge(price)}<div class="th">${thumb}</div><b>${name}</b>
    <div class="acts"><button class="ib eye" data-act="preview" data-v="${id}" aria-pressed="${preview?.id===id}" aria-label="לראות איך זה נראה" title="לראות איך זה נראה">${IC.eye}</button>
    <button class="ib buy" data-act="buy" data-v="${id}" ${can?'':'disabled'} aria-label="לקנות ב-${price} מטבעות" title="לקנות">${IC.bag}<span class="ltr">${price}</span>${COIN}</button></div>
    ${can?'':`<span class="need">חסרים ${price-coins}</span>`}</div>`;
}
// a row of colour dots, to choose the second colour of the half-half or the colour of the streak
const picker=(L,field,title)=>`<div class="pick"><b>${title}</b><div class="dots">${myColors(L).filter(c=>field!=='color2'||c.id!==L.color).map(c=>`<button class="dot ${L[field]===c.id?'on':''}" data-act="pickc" data-v="${field}|${c.id}" style="background:${c.fill}" aria-label="${c.name}" title="${c.name}"></button>`).join('')}</div></div>`;
function render(){
  Shell.renderBar({page:'style', title:'לעצב את עצמי', back:'home.html'});
  const L=Shell.lookOf(kidId), view=preview?effect(L,preview.id):L, worn=homeState().girlWorn||{}, colors=homeState().girlColors||{};
  let cards='', extra='';
  if(tab==='hair') cards=HAIR_STYLES.map(h=>h.price ? shopCard(h.id,h.name,h.price,drawGirlHead(FACE,{...L,hair:h.id}),L)
      : `<button class="item ${L.hair===h.id?'on':''}" data-act="hair" data-v="${h.id}"><div class="th">${drawGirlHead(FACE,{...L,hair:h.id})}</div><b>${h.name}</b></button>`).join('');
  else if(tab==='color'){ cards=HAIR_COLORS.map(c=>shopCard(c.id,c.name,c.price,`<span class="sw" style="background:${c.fill}"></span>`,L)).join('')
      + ['half','streak'].map(id=>shopCard(id,spec(id).name,spec(id).price,drawGirlHead(FACE,effect(L,id)),L)).join('');
    if(L.half) extra+=picker(L,'color2','הצבע של הצד השני');
    if(L.streak) extra+=picker(L,'streakColor','הצבע של הקווצה'); }
  else cards=HAIR_SPECIALS.filter(s=>s.kind==='toggle'||s.kind==='color').map(s=>shopCard(s.id,s.name,s.price,drawGirlHead(FACE,effect(L,s.id)),L)).join('');
  document.getElementById('app').innerHTML=`
    <section class="stage">${preview?'<span class="tag">מסתכלת</span>':''}${drawGirl(FACE,worn,{},view,colors)}</section>
    <section class="card"><h2>איך אני נראית</h2><p class="meta">תסרוקות וצבעים טבעיים בחינם. מה שקונים פעם אחת שלך לתמיד. 💎 נדיר, 👑 אגדי.</p>
      <div class="tabs" role="tablist">${TABS.map(t=>`<button class="tab" role="tab" aria-selected="${tab===t.id}" data-act="tab" data-v="${t.id}">${t.name}</button>`).join('')}</div>
      ${note?`<p class="meta" role="status">${note}</p>`:''}${extra}
      <div class="grid">${cards}</div></section>`;
}
const A={
  tab(v){ tab=v; preview=null; note=''; },
  hair(v){ const L=Shell.lookOf(kidId); Shell.saveLook({...L,hair:v, ribbon: L.ribbon && styleOf(v).ties.length ? true : false}); },
  color(v){ const L=Shell.lookOf(kidId); Shell.saveLook({...L,color:v, color2: L.color2===v ? null : L.color2}); },
  toggle(v){ const L=Shell.lookOf(kidId); Shell.saveLook(L[v] ? (v==='ribbon'?withRibbon(L,false):{...L,[v]:false}) : effect(L,v)); },
  pickc(v){ const [f,c]=v.split('|'); Shell.saveLook({...Shell.lookOf(kidId),[f]:c}); },
  preview(v){ preview = preview?.id===v ? null : {id:v}; },
  buy(v){ preview=null; if(!Shell.buyLook(v)){ note='עוד לא מספיק מטבעות. אפשר להרוויח בשיעורים ובתרגול הבונוס.'; return; }
    note=''; Shell.saveLook(effect(Shell.lookOf(kidId),v)); }
};
document.addEventListener('click',e=>{ const t=e.target.closest('[data-act]'); if(!t||t.disabled) return; if(A[t.dataset.act]?.(t.dataset.v)!==false) render(); });
if(Shell.start({page:'style', title:'לעצב את עצמי', back:'home.html'})) render();
