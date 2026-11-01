/* Room art for the home screen (viewBox 0 0 800 440).
   Wall 0-300, baseboard, wooden floor 306-440. The animal stands in the middle (x 300-500).
   Every room item has its own fixed spot, so owned items all show at once and the room fills up. */

const WALLPAPERS = [
  {id:'wp-plain',  name:'קיר חלק',     price:0,  def:'', fill:'#F6EBDD'},
  {id:'wp-stripes',name:'טפט פסים',    price:6,  def:'<pattern id="pwp-stripes" width="44" height="44" patternUnits="userSpaceOnUse"><rect width="44" height="44" fill="#FCE6EC"/><rect width="22" height="44" fill="#F8D6E0"/></pattern>', fill:'url(#pwp-stripes)'},
  {id:'wp-dots',   name:'טפט נקודות',  price:6,  def:'<pattern id="pwp-dots" width="36" height="36" patternUnits="userSpaceOnUse"><rect width="36" height="36" fill="#E2F0FB"/><circle cx="9" cy="9" r="5" fill="#BBDAF2"/><circle cx="27" cy="27" r="5" fill="#BBDAF2"/></pattern>', fill:'url(#pwp-dots)'},
  {id:'wp-stars',  name:'טפט כוכבים',  price:8,  def:'<pattern id="pwp-stars" width="60" height="60" patternUnits="userSpaceOnUse"><rect width="60" height="60" fill="#ECE5FB"/><path d="M15 6l3 7 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1z" fill="#D3C3F6"/><path d="M45 34l2 5 5 .7-3.6 3.5.8 5-4.2-2.3-4.2 2.3.8-5L38 39.7l5-.7z" fill="#F7D7A0"/></pattern>', fill:'url(#pwp-stars)'},
  {id:'wp-sky',    name:'טפט שמיים',   price:10, def:'<pattern id="pwp-sky" width="160" height="110" patternUnits="userSpaceOnUse"><rect width="160" height="110" fill="#D7EEFF"/><g fill="#fff"><ellipse cx="40" cy="34" rx="26" ry="11"/><ellipse cx="58" cy="28" rx="16" ry="10"/><ellipse cx="120" cy="80" rx="24" ry="10"/><ellipse cx="104" cy="76" rx="14" ry="9"/></g></pattern>', fill:'url(#pwp-sky)'},
  {id:'wp-forest', name:'טפט יער',     price:10, def:'<pattern id="pwp-forest" width="70" height="90" patternUnits="userSpaceOnUse"><rect width="70" height="90" fill="#E3F2E1"/><path d="M18 70 L30 40 L42 70Z" fill="#B8DDB1"/><path d="M48 40 L58 16 L68 40Z" fill="#CBE7C4"/></pattern>', fill:'url(#pwp-forest)'}
];

const ROOM_ITEMS = [
  // furniture (floor)
  {cat:'furniture', id:'bed', name:'מיטה', price:12, svg:()=>`<g transform="translate(14 218)">
    <rect x="0" y="0" width="22" height="110" rx="6" fill="#9C6B45"/><rect x="200" y="40" width="18" height="70" rx="5" fill="#9C6B45"/>
    <rect x="10" y="52" width="200" height="40" rx="10" fill="#F7F3EE"/><rect x="62" y="44" width="152" height="52" rx="12" fill="#6FA8DC"/>
    <path d="M62 60 H214 M62 76 H214" stroke="#5B93C7" stroke-width="3"/><rect x="18" y="34" width="52" height="26" rx="12" fill="#fff"/>
    <rect x="6" y="92" width="210" height="14" rx="5" fill="#B5845C"/></g>`},
  {cat:'furniture', id:'desk', name:'שולחן ומנורה', price:10, glow:()=>`<circle cx="664" cy="204" r="80" fill="url(#glow)"/>`, svg:()=>`<g transform="translate(600 210)">
    <rect x="0" y="40" width="170" height="14" rx="4" fill="#C08A5A"/><rect x="10" y="54" width="10" height="70" fill="#A8744A"/><rect x="150" y="54" width="10" height="70" fill="#A8744A"/>
    <rect x="96" y="54" width="54" height="40" rx="4" fill="#B37D50"/><circle cx="123" cy="74" r="3" fill="#7A5232"/>
    <path d="M30 40 L30 8 L54 -6" stroke="#5A6577" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M46 -18 L76 -4 L62 10 Z" fill="#F2B21E"/><ellipse cx="30" cy="40" rx="14" ry="4" fill="#5A6577"/></g>`},
  {cat:'furniture', id:'armchair', name:'כורסה', price:9, svg:()=>`<g transform="translate(150 262)">
    <rect x="0" y="0" width="90" height="80" rx="22" fill="#E8577E"/><rect x="-10" y="34" width="26" height="54" rx="12" fill="#D9446C"/><rect x="74" y="34" width="26" height="54" rx="12" fill="#D9446C"/>
    <rect x="10" y="48" width="70" height="30" rx="10" fill="#F07C9C"/><rect x="2" y="86" width="8" height="12" fill="#7A5232"/><rect x="80" y="86" width="8" height="12" fill="#7A5232"/></g>`},
  {cat:'furniture', id:'rug-round', name:'שטיח עגול', price:5, layer:'under', svg:()=>`<ellipse cx="400" cy="378" rx="190" ry="40" fill="#F2B21E" opacity=".85"/><ellipse cx="400" cy="378" rx="150" ry="28" fill="none" stroke="#fff" stroke-width="5" stroke-dasharray="14 10"/>`},
  // wall
  {cat:'wall', id:'picture', name:'תמונה של הר', price:5, svg:()=>`<g transform="translate(110 60)"><rect width="110" height="80" rx="4" fill="#fff" stroke="#9C6B45" stroke-width="8"/>
    <rect x="8" y="8" width="94" height="64" fill="#CDE8F8"/><path d="M8 72 L40 34 L60 54 L74 40 L102 72Z" fill="#6CC08B"/><path d="M40 34 L48 44 L34 44Z" fill="#fff"/><circle cx="84" cy="22" r="8" fill="#FFD54F"/></g>`},
  {cat:'wall', id:'bookshelf', name:'מדף ספרים', price:7, svg:()=>`<g transform="translate(560 90)"><rect x="0" y="40" width="150" height="10" rx="3" fill="#9C6B45"/>
    <rect x="8" y="6" width="14" height="34" fill="#E8577E"/><rect x="24" y="12" width="12" height="28" fill="#3E7BD8"/><rect x="38" y="2" width="16" height="38" fill="#F2B21E"/><rect x="56" y="14" width="12" height="26" fill="#6CC08B"/>
    <rect x="70" y="8" width="14" height="32" transform="rotate(12 77 24)" fill="#7444C9"/><circle cx="122" cy="28" r="12" fill="#FF8A3D"/></g>`},
  {cat:'wall', id:'clock', name:'שעון קיר', price:4, svg:()=>`<g transform="translate(250 40)"><circle cx="24" cy="24" r="24" fill="#fff" stroke="#5A6577" stroke-width="5"/><path d="M24 24 V10 M24 24 L34 30" stroke="#2A2225" stroke-width="3.5" stroke-linecap="round"/></g>`},
  {cat:'wall', id:'garland', name:'שרשרת דגלים', price:4, svg:()=>`<path d="M20 22 Q200 70 380 22" stroke="#9C6B45" stroke-width="2" fill="none"/>${[0,1,2,3,4,5,6].map(k=>{const x=40+k*48,y=22+Math.sin((k+.5)/7*Math.PI)*34;return `<path d="M${x-12} ${y} L${x+12} ${y} L${x} ${y+24}Z" fill="${['#E8577E','#F2B21E','#3E7BD8','#6CC08B'][k%4]}"/>`}).join('')}`},
  {cat:'furniture', id:'nightlamp', name:'מנורת לילה', price:6, svg:()=>`<g transform="translate(296 286)"><ellipse cx="22" cy="72" rx="20" ry="5" fill="rgba(0,0,0,.12)"/><rect x="18" y="30" width="8" height="40" rx="3" fill="#9C6B45"/><rect x="8" y="66" width="28" height="7" rx="3" fill="#7A5232"/><path d="M4 32 Q22 -6 40 32Z" fill="#FFE29A" stroke="#E0A800" stroke-width="2"/></g>`,
    glow:()=>`<circle cx="318" cy="306" r="70" fill="url(#glow)"/>`},
  // plants
  {cat:'plant', id:'plant', name:'עציץ', price:4, svg:()=>`<g transform="translate(250 250)"><path d="M6 50 L42 50 L36 84 L12 84Z" fill="#C8743A"/><path d="M24 50 Q8 20 22 0 Q30 24 24 50Z M24 50 Q40 18 54 16 Q46 40 24 50Z M24 50 Q2 34 -6 16 Q18 22 24 50Z" fill="#43A047"/></g>`},
  {cat:'plant', id:'cactus', name:'קקטוס', price:3, svg:()=>`<g transform="translate(726 196)"><rect x="0" y="40" width="34" height="18" rx="3" fill="#E8577E"/><rect x="10" y="4" width="14" height="40" rx="7" fill="#4CAF50"/><path d="M10 22 H2 V12" stroke="#4CAF50" stroke-width="8" fill="none" stroke-linecap="round"/><path d="M24 26 H32 V16" stroke="#4CAF50" stroke-width="8" fill="none" stroke-linecap="round"/></g>`},
  {cat:'plant', id:'sunflower', name:'חמנייה', price:5, svg:()=>`<g transform="translate(530 196)"><path d="M18 120 V30" stroke="#43A047" stroke-width="5"/><path d="M18 80 Q4 70 2 58 Q16 62 18 80Z" fill="#43A047"/><g fill="#FFC107">${[0,1,2,3,4,5,6,7].map(k=>`<ellipse cx="18" cy="12" rx="6" ry="13" transform="rotate(${k*45} 18 26)"/>`).join('')}</g><circle cx="18" cy="26" r="9" fill="#795548"/><path d="M4 120 H32 L28 140 H8Z" fill="#9C6B45"/></g>`}
];
const ROOM_CATS = [{id:'wallpaper',name:'טפטים'},{id:'floor',name:'רצפות'},{id:'curtain',name:'וילונות'},{id:'furniture',name:'רהיטים'},{id:'wall',name:'לקיר'},{id:'plant',name:'צמחים'},{id:'object',name:'חפצים'},{id:'pet',name:'חיות מחמד'}];
const WEAR_CATS = [{id:'outfit',name:'בגדים'},{id:'hair',name:'תסרוקות'},{id:'hat',name:'כובעים'},{id:'glasses',name:'משקפיים'}];

/* where things stand by default: a box (x, y, w, h) in room coordinates for each item.
   Anything can be dragged later; its offset is kept per item in the home's state (pos[id] = {dx, dy, flip}). */
const ITEM_BOX={bed:[8,210,230,120],desk:[590,180,190,160],armchair:[136,256,120,110],'rug-round':[200,330,400,100],picture:[100,50,130,100],bookshelf:[550,80,170,70],clock:[244,34,60,60],garland:[10,10,380,70],plant:[236,244,80,96],cactus:[720,190,46,70],sunflower:[520,180,60,160],nightlamp:[296,280,48,84]};
const PET_SPOTS=[[96,330],[560,346],[236,356],[660,350]];
const OBJ_SPOTS={balloon:[200,40,70,150,'140 20 70 160'], ball:[470,350,60,60,'150 196 50 44'], wand:[650,150,46,110,'150 100 56 100'], flower:[580,190,50,110,'150 100 50 100']};
const FRIEND_SPOTS=[[660,236,76],[248,236,78],[600,262,70],[170,270,70],[440,282,58],[680,286,60],[60,290,60],[360,296,52]];
const MAIN_BOX=[378,200,122,146], GIRL_BOX=[506,66,150,280];

/* curtains and floors: one free of each kind, the special ones in the shop */
const CURTAINS=[
  {id:'cu-pink',name:'וילון ורוד',price:0,color:'#F4A9B8'},
  {id:'cu-blue',name:'וילון תכלת',price:0,color:'#9CC9F0'},
  {id:'cu-yellow',name:'וילון צהוב',price:0,color:'#FFD873'},
  {id:'cu-stars',name:'וילון כוכבים',price:6,color:'#7E6BC4',def:'<pattern id="pcu-stars" width="26" height="26" patternUnits="userSpaceOnUse"><rect width="26" height="26" fill="#7E6BC4"/><path d="M8 3l1.6 3.4 3.7.4-2.8 2.5.8 3.6L8 11.1l-3.3 1.8.8-3.6L2.7 6.8l3.7-.4z" fill="#FFE082"/><circle cx="20" cy="19" r="1.8" fill="#fff"/></pattern>'},
  {id:'cu-flowers',name:'וילון פרחים',price:6,color:'#B7E4C7',def:'<pattern id="pcu-flowers" width="28" height="28" patternUnits="userSpaceOnUse"><rect width="28" height="28" fill="#B7E4C7"/><g fill="#F48FB1"><circle cx="9" cy="6" r="3"/><circle cx="13" cy="10" r="3"/><circle cx="9" cy="14" r="3"/><circle cx="5" cy="10" r="3"/></g><circle cx="9" cy="10" r="2.4" fill="#FFD54F"/><circle cx="22" cy="22" r="2.4" fill="#fff"/></pattern>'},
  {id:'cu-rainbow',name:'וילון קשת',price:9,color:'#F4A9B8',def:'<pattern id="pcu-rainbow" width="12" height="60" patternUnits="userSpaceOnUse"><rect width="2" height="60" fill="#EF5350"/><rect x="2" width="2" height="60" fill="#FFA726"/><rect x="4" width="2" height="60" fill="#FFEE58"/><rect x="6" width="2" height="60" fill="#66BB6A"/><rect x="8" width="2" height="60" fill="#42A5F5"/><rect x="10" width="2" height="60" fill="#AB47BC"/></pattern>'}];
const curtainFill=c=>c.def?`url(#pcu-${c.id.slice(3)})`:c.color;
const FLOORS=[
  {id:'fl-wood',name:'פרקט עץ',type:'wood',price:0,base:'#DDBB91',line:'#C9A378'},
  {id:'fl-carpet',name:'שטיח בז׳',type:'carpet',price:0,base:'#E9DCC8',line:'#D3C2A8'},
  {id:'fl-tiles',name:'אריחים לבנים',type:'tiles',price:0,base:'#F4F4F0',line:'#D2D5CF'},
  {id:'fl-grass',name:'דשא',type:'grass',price:0,base:'#9ED27F',line:'#77B257'},
  {id:'fl-wood-dark',name:'פרקט כהה',type:'wood',price:6,base:'#9B6B47',line:'#7E5536'},
  {id:'fl-wood-white',name:'פרקט לבן',type:'wood',price:6,base:'#EFE6DA',line:'#D6C7B2'},
  {id:'fl-carpet-pink',name:'שטיח ורוד',type:'carpet',price:7,base:'#F6C1D1',line:'#E79DB4'},
  {id:'fl-carpet-blue',name:'שטיח כחול',type:'carpet',price:7,base:'#A9C8F0',line:'#86AFE2'},
  {id:'fl-tiles-mint',name:'אריחי מנטה',type:'tiles',price:7,base:'#CDEFE0',line:'#A5D9C2'},
  {id:'fl-tiles-check',name:'משבצות',type:'tiles',price:9,base:'#FFFFFF',line:'#D2D5CF',check:'#3B4556'},
  {id:'fl-grass-flowers',name:'דשא עם פרחים',type:'grass',price:9,base:'#9ED27F',line:'#77B257',flowers:true}];
// wooden planks: rows every 38, joints staggered row by row
const FLOOR=(()=>{ let d=''; for(let k=0,y=306;y<1200;k++,y+=38){ d+=`M-800 ${y+34} H1600 `; for(let x=-780+(k%3)*140;x<1600;x+=300) d+=`M${x} ${y} V${y+34} `; } return d; })();
const TILES=(()=>{ let d=''; for(let y=306;y<1200;y+=64) d+=`M-800 ${y} H1600 `; for(let x=-800;x<1600;x+=64) d+=`M${x} 306 V1200 `; return d; })();
function floorSvg(f, x0=-800, y0=306, w=2400, h=900){
  const pid='pfl-'+f.id;
  if(f.type==='wood') return `<rect x="${x0}" y="${y0}" width="${w}" height="${h}" fill="${f.base}"/><path d="${FLOOR}" stroke="${f.line}" stroke-width="3"/>`;
  if(f.type==='tiles') return `${f.check?`<defs><pattern id="${pid}" width="128" height="128" patternUnits="userSpaceOnUse" y="306"><rect width="128" height="128" fill="${f.base}"/><rect width="64" height="64" fill="${f.check}"/><rect x="64" y="64" width="64" height="64" fill="${f.check}"/></pattern></defs>`:''}
    <rect x="${x0}" y="${y0}" width="${w}" height="${h}" fill="${f.check?`url(#${pid})`:f.base}"/><path d="${TILES}" stroke="${f.line}" stroke-width="2.5"/>`;
  if(f.type==='carpet') return `<defs><pattern id="${pid}" width="22" height="22" patternUnits="userSpaceOnUse"><rect width="22" height="22" fill="${f.base}"/><circle cx="5" cy="6" r="1.6" fill="${f.line}"/><circle cx="16" cy="17" r="1.6" fill="${f.line}"/></pattern></defs><rect x="${x0}" y="${y0}" width="${w}" height="${h}" fill="url(#${pid})"/>`;
  return `<defs><pattern id="${pid}" width="34" height="30" patternUnits="userSpaceOnUse"><rect width="34" height="30" fill="${f.base}"/><path d="M6 24 l2 -9 M10 24 l-1 -8 M24 12 l2 -8 M28 12 l-1 -7" stroke="${f.line}" stroke-width="2" stroke-linecap="round"/>${f.flowers?'<circle cx="18" cy="22" r="2.6" fill="#fff"/><circle cx="18" cy="22" r="1.2" fill="#FFD54F"/><circle cx="4" cy="8" r="2.4" fill="#F48FB1"/>':''}</pattern></defs><rect x="${x0}" y="${y0}" width="${w}" height="${h}" fill="url(#${pid})"/>`;
}
const floorThumb=f=>`<svg viewBox="0 306 120 90">${floorSvg(f,0,306,120,90)}</svg>`;
function windowSvg({night, curtain, open, act=true}){
  const c=CURTAINS.find(x=>x.id===curtain)||CURTAINS[0], fill=curtainFill(c);
  const sky = night ? `<rect x="320" y="34" width="160" height="124" rx="8" fill="#1E2A5A"/><circle cx="452" cy="64" r="13" fill="#FFF3C4"/><circle cx="458" cy="60" r="11" fill="#1E2A5A"/><g fill="#fff"><circle cx="346" cy="58" r="1.8"/><circle cx="372" cy="120" r="1.6"/><circle cx="428" cy="112" r="2"/><circle cx="362" cy="84" r="1.3"/><circle cx="470" cy="130" r="1.5"/></g>`
                    : `<rect x="320" y="34" width="160" height="124" rx="8" fill="#CDEBFB"/><circle cx="452" cy="66" r="13" fill="#FFE082"/>`;
  const panels = open ? `<path d="M308 28 Q330 90 316 166 L300 166 L300 28Z M492 28 Q470 90 484 166 L500 166 L500 28Z" fill="${fill}"/>`
    : `<path d="M300 28 H402 V166 H300Z M398 28 H500 V166 H398Z" fill="${fill}"/><path d="M325 30 V164 M352 30 V164 M378 30 V164 M424 30 V164 M450 30 V164 M476 30 V164" stroke="rgba(0,0,0,.08)" stroke-width="3"/><path d="M400 28 V166" stroke="rgba(0,0,0,.18)" stroke-width="2"/>`;
  // the whole window is the button: a click anywhere on it opens or closes the curtain
  return `<g ${act?'data-act="curtain" class="curtain" role="button" aria-label="לפתוח או לסגור את הווילון"':''}>${sky}<rect x="320" y="34" width="160" height="124" rx="8" fill="none" stroke="#fff" stroke-width="10"/><path d="M400 34 V158 M320 96 H480" stroke="#fff" stroke-width="6"/>
    ${panels}<rect x="290" y="22" width="220" height="10" rx="5" fill="#9C6B45"/></g>`;
}
const curtainThumb=c=>`<svg viewBox="290 18 220 152"><defs>${c.def||''}</defs>${windowSvg({curtain:c.id, open:true, act:false})}</svg>`;

/* asleep: closed eyes drawn over a character (character coordinates, eyes at 78,100 and 122,100) */
function sleepEyes(a){ const A=ANIMALS[a]; const cover=a==='owl'?A.light:a==='panda'?A.dark:A.fur, r=a==='owl'?19:a==='panda'?12:10;
  return `<circle cx="78" cy="100" r="${r}" fill="${cover}"/><circle cx="122" cy="100" r="${r}" fill="${cover}"/><path d="M69 99 Q78 107 87 99 M113 99 Q122 107 131 99" stroke="${a==='panda'?'#fff':'#2A2225'}" stroke-width="3" fill="none" stroke-linecap="round"/>`; }

/* zones: wall things stay on the wall, everything else on the floor (objects such as a balloon may go anywhere) */
function clampMove(e,dx,dy){ const [x,y,w,h]=e.box, cx=x+w/2;
  dx=Math.max(-cx+20,Math.min(780-cx,dx));
  if(e.zone==='wall') dy=Math.max(-120-y,Math.min(290-(y+h),dy));
  else if(e.zone==='floor'){ const foot=y+h, lo=Math.min(foot,312); dy=Math.max(lo-foot,Math.min(470-foot,dy)); }
  else dy=Math.max(-120-y,Math.min(470-(y+h),dy));
  return [Math.round(dx),Math.round(dy)]; }
const entTransform=(e,p={})=>{ const [x,,w]=e.box, cx=x+w/2; return `translate(${p.dx||0} ${p.dy||0})${p.flip?` translate(${cx} 0) scale(-1 1) translate(${-cx} 0)`:''}`; };

/* everything that stands in the room, with its box and zone (used to draw and to drag) */
function roomEntities({animal, worn, wornBy={}, items, friends, preview, girl, stored=[], night}){
  const A=ANIMALS[animal], show=new Set(items); if(preview && (ROOM_ITEMS.some(r=>r.id===preview)||itemById(preview))) show.add(preview);
  const has=id=>show.has(id)&&!stored.includes(id), strip=s=>s.replace(/^<svg[^>]*>|<\/svg>$/g,''), wearOnly=w=>Object.fromEntries(Object.entries(w||{}).filter(([c])=>['outfit','hair','hat','glasses'].includes(c)));
  const ents=[];
  ROOM_ITEMS.filter(r=>has(r.id)).forEach(r=>ents.push({id:r.id, box:ITEM_BOX[r.id], zone:r.cat==='wall'?'wall':'floor', under:r.layer==='under', svg:r.svg(), glow:night&&r.glow?r.glow():''}));
  Object.entries(OBJ_SPOTS).filter(([id])=>has(id)).forEach(([id,[x,y,w,h,vb]])=>ents.push({id, box:[x,y,w,h], zone:'any', svg:`<svg x="${x}" y="${y}" width="${w}" height="${h}" viewBox="${vb}">${itemById(id).svg(A)}</svg>`}));
  ITEMS.filter(i=>i.cat==='pet' && show.has(i.id)).forEach((i,k)=>{ if(!has(i.id)) return; const [x,y]=PET_SPOTS[k%4];
    ents.push({id:i.id, box:[x,y,90,80], zone:'floor', svg:`<ellipse cx="${x+45}" cy="${y+74}" rx="38" ry="7" fill="rgba(0,0,0,.13)"/><svg x="${x}" y="${y}" width="90" height="78" viewBox="0 180 72 62">${i.svg(A)}</svg>`}); });
  const charSvg=(a,w,[x,y,wd,ht],prev={})=>`<svg x="${x}" y="${y}" width="${wd}" height="${ht}" viewBox="-6 -18 216 260">${strip(drawChar(a,wearOnly(w),prev))}${night?sleepEyes(a):''}</svg>`;
  (friends||[]).slice(0,8).forEach((a,k)=>{ const id='a:'+a; if(stored.includes(id)) return; const [x,y,w]=FRIEND_SPOTS[k];
    ents.push({id, box:[x,y,w,w*1.2], zone:'floor', friend:a, svg:charSvg(a,wornBy[a],[x,y,w,w*1.2])}); });
  const pv=preview && itemById(preview) && ['outfit','hair','hat','glasses'].includes(itemById(preview).cat) ? {[itemById(preview).cat]:preview} : {};
  ents.push({id:'main', box:MAIN_BOX, zone:'floor', svg:charSvg(animal,worn,MAIN_BOX,pv)});
  if(girl){ const [x,y,w,h]=GIRL_BOX; ents.push({id:'girl', box:GIRL_BOX, zone:'floor', svg:`<ellipse cx="${x+74}" cy="${y+276}" rx="48" ry="7" fill="rgba(0,0,0,.13)"/><svg x="${x}" y="${y}" width="${w}" height="${h}" viewBox="0 0 120 224">${strip(drawGirl(girl.face, girl.worn, preview && girlItem(preview) ? {[girlItem(preview).cat]:preview} : {}, girl.look))}</svg>`}); }
  return ents;
}

function roomSvg(o){
  const {animal, wallpaper, preview, pos={}, arrange=false, sel=null, night=false, curtain='cu-pink', curtainOpen=true, floor='fl-wood'}=o;
  const A = ANIMALS[animal];
  const isWp=id=>WALLPAPERS.some(w=>w.id===id), isFl=id=>FLOORS.some(f=>f.id===id), isCu=id=>CURTAINS.some(c=>c.id===id);
  const wpShow = WALLPAPERS.find(w=>w.id===(preview&&isWp(preview)?preview:wallpaper)) || WALLPAPERS[0];
  const flShow = FLOORS.find(f=>f.id===(preview&&isFl(preview)?preview:floor)) || FLOORS[0];
  const cuShow = preview&&isCu(preview) ? preview : curtain;
  const ents=roomEntities(o);
  const foot=e=>e.box[1]+e.box[3]+(pos[e.id]?.dy||0);
  const order=[...ents.filter(e=>e.under), ...ents.filter(e=>!e.under&&e.zone==='wall'), ...ents.filter(e=>!e.under&&e.zone!=='wall').sort((a,b)=>foot(a)-foot(b))];
  const g=e=>`<g class="ent ${arrange?'drag':''} ${e.friend&&!arrange?'friend':''}" data-ent="${e.id}" data-box="${e.box.join(',')}" data-zone="${e.zone}" transform="${entTransform(e,pos[e.id])}" ${e.friend&&!arrange?`data-act="animal" data-v="${e.friend}" role="button" aria-label="לעבור ל${ANIMALS[e.friend].name}"`:''}>${e.svg}</g>`;
  const glows=night?ents.filter(e=>e.glow).map(e=>`<g transform="${entTransform(e,pos[e.id])}">${e.glow}</g>`).join(''):'';
  const se=arrange&&sel?ents.find(e=>e.id===sel):null;
  const selBox=se?`<g transform="${entTransform(se,pos[se.id])}" pointer-events="none"><rect x="${se.box[0]-6}" y="${se.box[1]-6}" width="${se.box[2]+12}" height="${se.box[3]+12}" rx="10" fill="none" stroke="var(--accent)" stroke-width="3" stroke-dasharray="8 6"/></g>`:'';
  return `<svg class="scene ${arrange?'arranging':''}" viewBox="0 0 800 440" preserveAspectRatio="xMidYMax meet" role="img" aria-label="החדר של ה${A.name}">
    <defs>${WALLPAPERS.map(w=>w.def).join('')}${CURTAINS.map(c=>c.def||'').join('')}<radialGradient id="glow"><stop offset="0" stop-color="#FFE9A8" stop-opacity=".75"/><stop offset="1" stop-color="#FFE9A8" stop-opacity="0"/></radialGradient></defs>
    <rect x="-800" y="-700" width="2400" height="1000" fill="${wpShow.fill}"/>
    ${windowSvg({night, curtain:cuShow, open:curtainOpen})}
    <rect x="-800" y="292" width="2400" height="14" fill="#fff"/>
    ${floorSvg(flShow)}
    ${order.map(g).join('')}
    ${night?'<rect x="-800" y="-700" width="2400" height="1900" fill="#0B1640" opacity=".38" pointer-events="none"/>':''}
    ${glows}${selBox}
  </svg>`;
}
