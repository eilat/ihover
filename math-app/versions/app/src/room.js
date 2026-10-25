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
  {cat:'furniture', id:'desk', name:'שולחן ומנורה', price:10, svg:()=>`<g transform="translate(600 210)">
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
  // plants
  {cat:'plant', id:'plant', name:'עציץ', price:4, svg:()=>`<g transform="translate(250 250)"><path d="M6 50 L42 50 L36 84 L12 84Z" fill="#C8743A"/><path d="M24 50 Q8 20 22 0 Q30 24 24 50Z M24 50 Q40 18 54 16 Q46 40 24 50Z M24 50 Q2 34 -6 16 Q18 22 24 50Z" fill="#43A047"/></g>`},
  {cat:'plant', id:'cactus', name:'קקטוס', price:3, svg:()=>`<g transform="translate(726 196)"><rect x="0" y="40" width="34" height="18" rx="3" fill="#E8577E"/><rect x="10" y="4" width="14" height="40" rx="7" fill="#4CAF50"/><path d="M10 22 H2 V12" stroke="#4CAF50" stroke-width="8" fill="none" stroke-linecap="round"/><path d="M24 26 H32 V16" stroke="#4CAF50" stroke-width="8" fill="none" stroke-linecap="round"/></g>`},
  {cat:'plant', id:'sunflower', name:'חמנייה', price:5, svg:()=>`<g transform="translate(530 196)"><path d="M18 120 V30" stroke="#43A047" stroke-width="5"/><path d="M18 80 Q4 70 2 58 Q16 62 18 80Z" fill="#43A047"/><g fill="#FFC107">${[0,1,2,3,4,5,6,7].map(k=>`<ellipse cx="18" cy="12" rx="6" ry="13" transform="rotate(${k*45} 18 26)"/>`).join('')}</g><circle cx="18" cy="26" r="9" fill="#795548"/><path d="M4 120 H32 L28 140 H8Z" fill="#9C6B45"/></g>`}
];
const ROOM_CATS = [{id:'wallpaper',name:'טפטים'},{id:'furniture',name:'רהיטים'},{id:'wall',name:'לקיר'},{id:'plant',name:'צמחים'},{id:'object',name:'חפצים'},{id:'pet',name:'חיות מחמד'}];
const WEAR_CATS = [{id:'outfit',name:'בגדים'},{id:'hair',name:'תסרוקות'},{id:'hat',name:'כובעים'},{id:'glasses',name:'משקפיים'}];

/* where pets and held objects go in the room (they're drawn in the character frame, so we crop and place them) */
const PET_SPOTS=[[96,330],[560,346],[236,356],[660,350]];
const OBJ_SPOTS={balloon:[200,40,70,150,'140 20 70 160'], ball:[470,350,60,60,'150 196 50 44'], wand:[650,150,46,110,'150 100 56 100'], flower:[580,190,50,110,'150 100 50 100']};
const FRIEND_SPOTS=[[660,236,76],[248,236,78],[600,262,70],[170,270,70],[440,282,58],[680,286,60],[60,290,60],[360,296,52]];

function roomSvg({animal, worn, wallpaper, items, friends, preview, girl}){
  const A = ANIMALS[animal];
  const wp = WALLPAPERS.find(w=>w.id===wallpaper) || WALLPAPERS[0];
  const show = new Set(items); if(preview && !WALLPAPERS.some(w=>w.id===preview)) show.add(preview);
  const wpShow = preview && WALLPAPERS.some(w=>w.id===preview) ? WALLPAPERS.find(w=>w.id===preview) : wp;
  const has = id => show.has(id);
  const roomItem = id => ROOM_ITEMS.find(r=>r.id===id);
  const under = ROOM_ITEMS.filter(r=>r.layer==='under' && has(r.id)).map(r=>r.svg()).join('');
  const back  = ROOM_ITEMS.filter(r=>r.layer!=='under' && has(r.id)).map(r=>r.svg()).join('');
  const objs = Object.entries(OBJ_SPOTS).filter(([id])=>has(id)).map(([id,[x,y,w,h,vb]])=>`<svg x="${x}" y="${y}" width="${w}" height="${h}" viewBox="${vb}">${itemById(id).svg(A)}</svg>`).join('');
  const pets = ITEMS.filter(i=>i.cat==='pet' && has(i.id)).map((i,k)=>{ const [x,y]=PET_SPOTS[k%4];
    return `<ellipse cx="${x+45}" cy="${y+74}" rx="38" ry="7" fill="rgba(0,0,0,.13)"/><svg x="${x}" y="${y}" width="90" height="78" viewBox="0 180 72 62">${i.svg(A)}</svg>`; }).join('');
  const strip = s => s.replace(/^<svg[^>]*>|<\/svg>$/g,'');
  const fr = (friends||[]).slice(0,8).map((a,k)=>{ const [x,y,w]=FRIEND_SPOTS[k];
    return `<g class="friend" data-act="animal" data-v="${a}" role="button" aria-label="לעבור ל${ANIMALS[a].name}"><svg x="${x}" y="${y}" width="${w}" height="${w*1.2}" viewBox="-6 -18 216 260">${strip(drawChar(a,{}))}</svg></g>`; }).join('');
  const wearOnly = Object.fromEntries(Object.entries(worn).filter(([c])=>['outfit','hair','hat','glasses'].includes(c)));
  return `<svg class="scene" viewBox="0 0 800 440" role="img" aria-label="החדר של ה${A.name}">
    <defs>${WALLPAPERS.map(w=>w.def).join('')}</defs>
    <rect width="800" height="300" fill="${wpShow.fill}"/>
    <rect x="320" y="34" width="160" height="124" rx="8" fill="#CDEBFB" stroke="#fff" stroke-width="10"/>
    <path d="M400 34 V158 M320 96 H480" stroke="#fff" stroke-width="6"/><circle cx="452" cy="66" r="13" fill="#FFE082"/>
    <path d="M308 28 Q330 90 316 166 L300 166 L300 28Z M492 28 Q470 90 484 166 L500 166 L500 28Z" fill="#F4A9B8"/>
    <rect x="290" y="22" width="220" height="10" rx="5" fill="#9C6B45"/>
    <rect y="292" width="800" height="14" fill="#fff"/>
    <rect y="306" width="800" height="134" fill="#DDBB91"/>
    <path d="M0 340 H800 M0 378 H800 M0 416 H800 M120 306 V340 M420 306 V340 M720 306 V340 M260 340 V378 M560 340 V378 M80 378 V416 M380 378 V416 M680 378 V416" stroke="#C9A378" stroke-width="3"/>
    ${under}${back}${objs}
    <svg x="300" y="104" width="200" height="240" viewBox="-6 -18 216 260">${strip(drawChar(animal, wearOnly, preview && itemById(preview) && ['outfit','hair','hat','glasses'].includes(itemById(preview).cat) ? {[itemById(preview).cat]:preview} : {}))}</svg>
    ${girl?`<ellipse cx="580" cy="342" rx="48" ry="7" fill="rgba(0,0,0,.13)"/><svg x="506" y="66" width="150" height="280" viewBox="0 0 120 224">${strip(drawGirl(girl.face, girl.worn, preview && girlItem(preview) ? {[girlItem(preview).cat]:preview} : {}))}</svg>`:''}
    ${fr}${pets}
  </svg>`;
}
