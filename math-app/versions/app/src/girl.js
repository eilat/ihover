/* The girl herself, standing in her home next to her animal, dressed from the shop's "לעצמי" side.
   One geometry for both girls (viewBox 0 0 120 224: head centre 60,56 r34, shoulders y98, feet y214);
   only hair and skin differ, so every item fits both. Items are drawn in fixed layers. */
const GIRLS={lili:{skin:'#F6CFAE'}, nori:{skin:'#E9B98F'}, test:{skin:'#F1C9A5'}};
/* her look: a hairstyle and a hair colour (free), plus happy colours and specials bought in the shop.
   Every style is a back part (behind the head and body) and a front part (over the forehead), drawn for the
   same head (centre 60,56 r34), so hats, ears, the flower and glasses sit on top of any of them. */
const HAIR_STYLES=[
  {id:'long', name:'פזור ארוך', back:`<path d="M24 58 C22 28 40 18 60 18 C80 18 98 28 96 58 L98 106 Q60 114 22 106Z"/>`,
    front:`<path d="M26 56 C28 30 44 21 60 21 C78 21 92 32 94 56 C80 52 70 42 66 33 C60 44 44 52 26 56Z"/>`, ties:[]},
  {id:'buns', name:'שתי בובות', back:`<circle cx="28" cy="30" r="14"/><circle cx="92" cy="30" r="14"/>`,
    front:`<path d="M26 58 C24 32 40 20 60 20 C80 20 96 32 94 58 C90 46 80 40 70 40 C66 46 58 48 50 44 C40 44 30 48 26 58Z"/>`, ties:[[35,38],[85,38]]},
  {id:'pony', name:'קוקו', back:`<path d="M84 34 C114 34 116 72 104 100 C100 82 96 62 82 44Z"/><circle cx="90" cy="33" r="9"/>`,
    front:`<path d="M26 58 C24 32 40 20 60 20 C80 20 96 32 94 58 C88 44 76 36 60 36 C46 36 34 44 26 58Z"/>`, ties:[[92,34]]},
  {id:'braid', name:'צמה', back:`<path d="M26 60 C24 30 42 20 60 20 C78 20 96 30 94 60Z"/>${[[91,64],[94,78],[96,92],[97,106]].map(([x,y],k)=>`<ellipse cx="${x}" cy="${y}" rx="8" ry="8.5" transform="rotate(${k%2?-18:18} ${x} ${y})"/>`).join('')}<path d="M95 116 l4 10 l3-10z"/>`,
    front:`<path d="M26 58 C24 30 42 20 60 20 C78 20 96 30 94 58 C86 46 70 40 62 26 C56 40 38 46 26 58Z"/>`, ties:[[97,114]]},
  {id:'curly', name:'תלתלים', back:[[30,30,13],[44,19,13],[60,15,13],[76,19,13],[90,30,13],[97,46,12],[23,46,12],[98,63,11],[22,63,11],[96,79,10],[24,79,10]].map(([x,y,r])=>`<circle cx="${x}" cy="${y}" r="${r}"/>`).join(''),
    front:[[33,42,8],[45,33,8.5],[60,30,9],[75,33,8.5],[87,42,8]].map(([x,y,r])=>`<circle cx="${x}" cy="${y}" r="${r}"/>`).join(''), ties:[]},
  {id:'short', name:'קצר', back:`<path d="M24 58 C22 28 40 18 60 18 C80 18 98 28 96 58 L97 84 Q91 91 84 83 L36 83 Q29 91 23 84Z"/>`,
    front:`<path d="M26 54 C25 30 42 20 60 20 C78 20 95 30 94 54 C80 46 40 46 26 54Z"/>`, ties:[]},
  {id:'pigtails', name:'קוקיות', back:`<path d="M24 48 C6 58 6 92 16 106 C21 88 26 72 31 58Z"/><path d="M96 48 C114 58 114 92 104 106 C99 88 94 72 89 58Z"/>`,
    front:`<path d="M26 58 C24 30 42 20 60 20 C78 20 96 30 94 58 C86 46 70 40 62 26 C56 40 38 46 26 58Z"/>`, ties:[[27,52],[93,52]]},
  /* bought in the shop (price), the rest are free */
  {id:'ballet', name:'בובה של בלט', price:25, back:`<circle cx="60" cy="14" r="14"/>`,
    front:`<path d="M26 58 C24 30 42 21 60 21 C78 21 96 30 94 58 C88 42 76 34 60 34 C44 34 32 42 26 58Z"/>`, ties:[[60,27]]},
  {id:'fringe', name:'פוני פרוע', price:30, back:`<path d="M24 58 C22 28 40 18 60 18 C80 18 98 28 96 58 L96 76 Q90 80 86 72 L34 72 Q30 80 24 76Z"/>`,
    front:`<path d="M24 56 C22 28 42 17 60 17 C80 17 98 28 96 56 L90 50 L86 58 L80 47 L74 56 L68 45 L62 55 L56 44 L50 55 L44 46 L38 56 L33 47 L28 56Z"/>`, ties:[]},
  {id:'mohawk', name:'מוהוק', price:40, back:'',
    front:`<path d="M30 46 C32 30 44 23 60 23 C76 23 88 30 90 46 C84 36 74 31 60 31 C46 31 36 36 30 46Z" opacity=".35"/><path d="M52 34 L48 18 L55 22 L54 6 L60 16 L64 2 L66 18 L72 10 L70 24 L76 20 L68 36Z"/>`, ties:[]},
  {id:'halfshave', name:'חצי תלתלים חצי מגולח', price:50, back:[[30,30,13],[44,19,13],[23,46,12],[22,63,11],[24,79,10],[27,94,9]].map(([x,y,r])=>`<circle cx="${x}" cy="${y}" r="${r}"/>`).join(''),
    front:[[33,42,8],[45,33,8.5],[57,29,8.5]].map(([x,y,r])=>`<circle cx="${x}" cy="${y}" r="${r}"/>`).join('')+`<path d="M62 22 C80 22 94 32 94 56 C90 42 78 34 62 34Z" opacity=".35"/>`, ties:[]},
  {id:'dreads', name:'ראסטות', price:60, back:[[26,60],[22,72],[25,86],[30,98],[94,60],[98,72],[95,86],[90,98],[36,100],[84,100]].map(([x,y])=>`<rect x="${x-5}" y="${y-40}" width="10" height="${40+ (y%3)*6}" rx="5"/>`).join('')+`<path d="M24 58 C22 28 40 18 60 18 C80 18 98 28 96 58Z"/>`,
    front:`<path d="M26 56 C26 30 42 20 60 20 C78 20 94 30 94 56 C84 44 72 38 60 38 C48 38 36 44 26 56Z"/><rect x="25" y="44" width="9" height="34" rx="4.5"/><rect x="86" y="44" width="9" height="34" rx="4.5"/>`, ties:[]}
];
const HAIR_COLORS=[
  {id:'black', name:'שחור', fill:'#1F1B24', price:0},{id:'dark', name:'כהה', fill:'#2E2A33', price:0},
  {id:'darkbrown', name:'חום כהה', fill:'#4A2C1D', price:0},{id:'brown', name:'חום', fill:'#6B3E26', price:0},
  {id:'lightbrown', name:'חום בהיר', fill:'#A0673A', price:0},{id:'blonde', name:'בלונדיני', fill:'#E2B85C', price:0},
  {id:'ginger', name:'ג׳ינג׳י', fill:'#C2562A', price:0},
  {id:'pink', name:'ורוד', fill:'#F28DB2', price:8},{id:'purple', name:'סגול', fill:'#9B6BD6', price:8},{id:'sky', name:'תכלת', fill:'#7CC6F0', price:8},
  {id:'gold', name:'זהב', fill:'#E9B824', price:25},{id:'turquoise', name:'טורקיז', fill:'#2BB5A8', price:25},{id:'green', name:'ירוק', fill:'#5CB85C', price:25}
];
/* kinds: color (the whole hair), toggle (worn on top, groups can't be worn together), two (two-colour: half-half or one streak), style (a paid hairstyle) */
const HAIR_SPECIALS=[
  {id:'rainbow', name:'שיער בצבע קשת', price:70, kind:'color'},
  {id:'half', name:'חצי־חצי', price:35, kind:'two'},
  {id:'streak', name:'קווצה צבעונית', price:20, kind:'two'},
  {id:'glitter', name:'נצנצים בשיער', price:10, kind:'toggle'},
  {id:'ribbon', name:'קוקו עם סרט', price:8, kind:'toggle'},
  {id:'bow', name:'פפיון ורוד', price:6, kind:'toggle'},
  {id:'clips', name:'סיכות', price:12, kind:'toggle'},
  {id:'beads', name:'חרוזים בשיער', price:15, kind:'toggle'},
  {id:'rstreaks', name:'פסים צבעוניים', price:35, kind:'toggle'},
  {id:'flowercrown', name:'זר פרחים', price:30, kind:'toggle', group:'top'},
  {id:'tiara', name:'טיארה', price:80, kind:'toggle', group:'top'},
  ...HAIR_STYLES.filter(h=>h.price).map(h=>({id:h.id, name:h.name, price:h.price, kind:'style'}))
];
/* price tiers: so there is something to save up for */
const tierOf=p=>p>=150?{id:'legend',name:'אגדי',badge:'👑'}:p>=60?{id:'rare',name:'נדיר',badge:'💎'}:p>=20?{id:'special',name:'מיוחד',badge:''}:{id:'basic',name:'',badge:''};
const DEFAULT_LOOKS={lili:{hair:'buns',color:'brown',owned:[]}, nori:{hair:'long',color:'dark',bow:true,owned:['bow']}, test:{hair:'long',color:'pink',owned:['pink']}};
const lookFor=(face,look)=>({...(DEFAULT_LOOKS[face]||DEFAULT_LOOKS.lili),...(look||{})});
let hairGrad=0;
function hairSvg(look){ // returns {defs, back, front, top}
  const st=HAIR_STYLES.find(h=>h.id===look.hair)||HAIR_STYLES[0];
  let fill=(HAIR_COLORS.find(c=>c.id===look.color)||HAIR_COLORS[3]).fill, defs='';
  if(look.color==='rainbow'){ const id='hrb'+(++hairGrad); fill=`url(#${id})`;
    defs=`<linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1">${['#F25C5C','#F5A142','#F2D24B','#5CC97B','#4FA3E8','#9B6BD6'].map((c,k)=>`<stop offset="${k/5}" stop-color="${c}"/>`).join('')}</linearGradient>`; }
  const ribbon=(x,y)=>`<path d="M${x} ${y} l-13 -9 l1 18z M${x} ${y} l13 -9 l-1 18z" fill="#E8457A"/><circle cx="${x}" cy="${y}" r="4.2" fill="#C72F63"/>`;
  const ties=st.ties.map(([x,y])=>look.ribbon?ribbon(x,y):`<circle cx="${x}" cy="${y}" r="4.5" fill="#F2B21E"/>`).join('');
  const bow=look.bow&&!(look.ribbon&&st.ties.length)?`<path d="M82 24 l9-6 -1 11z M82 24 l11 3 -8 6z" fill="#E8457A"/><circle cx="84" cy="26" r="3" fill="#C72F63"/>`:'';
  const spark=(x,y)=>`<path d="M${x} ${y-4} L${x+1.2} ${y-1.2} L${x+4} ${y} L${x+1.2} ${y+1.2} L${x} ${y+4} L${x-1.2} ${y+1.2} L${x-4} ${y} L${x-1.2} ${y-1.2}Z" fill="#fff"/>`;
  const glitter=look.glitter?[[40,28],[58,23],[78,27],[33,44],[88,42],[50,36],[70,35]].map(([x,y])=>spark(x,y)).join(''):'';
  const colorFill=id=>id==='rainbow'?fill:(HAIR_COLORS.find(c=>c.id===id)||{}).fill;
  let back=`<g fill="${fill}">${st.back}</g>`, front=`<g fill="${fill}">${st.front}</g>`;
  // half-half: the right side of the hair (her left) in the second colour
  if(look.half && look.color2 && colorFill(look.color2)){ const cid='hh'+(++hairGrad), f2=colorFill(look.color2);
    defs+=`<clipPath id="${cid}"><rect x="60" y="-20" width="80" height="260"/></clipPath>`;
    back+=`<g fill="${f2}" clip-path="url(#${cid})">${st.back}</g>`; front+=`<g fill="${f2}" clip-path="url(#${cid})">${st.front}</g>`; }
  // one coloured lock, like a hair extension
  const streak=look.streak && look.streakColor && colorFill(look.streakColor) ? `<path d="M44 22 C38 32 34 44 33 58${['long','braid','pigtails','dreads','pony'].includes(st.id)?' C33 70 31 86 28 100':''}" stroke="${colorFill(look.streakColor)}" stroke-width="7" fill="none" stroke-linecap="round"/>` : '';
  const rstreaks=look.rstreaks?['#F25C5C','#F2D24B','#4FA3E8'].map((c,k)=>`<path d="M${66+k*7} 22 C${72+k*7} 32 ${76+k*6} 44 ${78+k*5} 56" stroke="${c}" stroke-width="4" fill="none" stroke-linecap="round"/>`).join(''):'';
  const clips=look.clips?`<rect x="34" y="40" width="12" height="5" rx="2.5" fill="#4FA3E8" transform="rotate(-30 40 42)"/><rect x="74" y="40" width="12" height="5" rx="2.5" fill="#F28DB2" transform="rotate(30 80 42)"/>`:'';
  const beads=look.beads?[[27,62,'#F25C5C'],[26,72,'#F2D24B'],[93,62,'#4FA3E8'],[94,72,'#5CC97B']].map(([x,y,c])=>`<circle cx="${x}" cy="${y}" r="3.6" fill="${c}" stroke="#fff" stroke-width="1"/>`).join(''):'';
  const flowercrown=look.flowercrown?`<path d="M28 34 Q60 14 92 34" stroke="#4CAF50" stroke-width="3" fill="none"/>${[[30,32,'#FF8AB3'],[42,24,'#FFD54F'],[54,20,'#B39DDB'],[66,20,'#FF8AB3'],[78,24,'#FFD54F'],[90,32,'#B39DDB']].map(([x,y,c])=>`<circle cx="${x}" cy="${y}" r="5" fill="${c}"/><circle cx="${x}" cy="${y}" r="1.8" fill="#fff"/>`).join('')}`:'';
  const tiara=look.tiara?`<path d="M36 28 Q60 16 84 28 L80 22 L72 24 L66 12 L60 20 L54 12 L48 24 L40 22Z" fill="#E6E9F0" stroke="#AAB4C3" stroke-width="1.5" stroke-linejoin="round"/><circle cx="60" cy="18" r="3" fill="#7CC6F0"/><circle cx="48" cy="22" r="2" fill="#F28DB2"/><circle cx="72" cy="22" r="2" fill="#F28DB2"/>`:'';
  return {defs, back, front:`${front}${streak}${rstreaks}${ties}${bow}${clips}${beads}${flowercrown}${tiara}${glitter}`};
}
const GIRL_CATS=[{id:'g-outfit',name:'בגדים'},{id:'g-shoes',name:'נעליים'},{id:'g-head',name:'לראש'},{id:'g-glasses',name:'משקפיים'}];
const sleeves=c=>`<path d="M38 98 L27 118 L35 122 L45 106Z M82 98 L93 118 L85 122 L75 106Z" fill="${c}"/>`;
const longSleeves=c=>`<path d="M40 100 L28 146 M80 100 L92 146" stroke="${c}" stroke-width="12" stroke-linecap="round"/>`;
const GIRL_ITEMS=[
  // clothes: replace the default t-shirt and shorts
  {cat:'g-outfit', id:'g-dress', main:'#F06292', name:'שמלה פרחונית', price:6, svg:()=>`${sleeves('#F06292')}<path d="M40 96 Q60 90 80 96 L84 118 L98 176 Q60 186 22 176 L36 118Z" fill="#F06292"/>
    ${[[46,128],[70,134],[56,156],[36,162],[80,160]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="5" fill="#fff"/><circle cx="${x}" cy="${y}" r="2" fill="#FFD54F"/>`).join('')}`},
  {cat:'g-outfit', id:'g-overalls', main:'#3F6FB5', name:'סרבל ג׳ינס', price:6, svg:()=>`${sleeves('#FFD54F')}<path d="M38 98 Q60 90 82 98 L84 140 L36 140Z" fill="#FFD54F"/>
    <path d="M40 118 H80 L84 172 H63 L60 152 L57 172 H36Z" fill="#3F6FB5"/><path d="M45 99 L46 120 M75 99 L74 120" stroke="#3F6FB5" stroke-width="5"/><rect x="51" y="124" width="18" height="12" rx="3" fill="#335C99"/>`},
  {cat:'g-outfit', id:'g-tutu', main:'#E1BEE7', name:'שמלת נסיכה', price:10, svg:()=>`${sleeves('#B39DDB')}<path d="M42 98 Q60 92 78 98 L80 132 H40Z" fill="#B39DDB"/>
    <path d="M40 128 H80 L106 168 Q60 182 14 168Z" fill="#E1BEE7"/><path d="M40 128 H80 L96 160 Q60 172 24 160Z" fill="#F3E5F5"/>
    <g fill="#fff">${[[30,164],[52,170],[76,168],[94,162],[62,150]].map(([x,y])=>`<path d="M${x} ${y-4} L${x+1.5} ${y-1} L${x+4} ${y} L${x+1.5} ${y+1} L${x} ${y+4} L${x-1.5} ${y+1} L${x-4} ${y} L${x-1.5} ${y-1}Z"/>`).join('')}</g>
    <path d="M52 100 L60 108 L68 100" stroke="#F2C230" stroke-width="3" fill="none"/>`},
  {cat:'g-outfit', id:'g-sport', main:'#26A69A', name:'חליפת ספורט', price:7, svg:()=>`${longSleeves('#26A69A')}<path d="M36 98 Q60 90 84 98 L86 142 H34Z" fill="#26A69A"/>
    <path d="M60 96 V142" stroke="#fff" stroke-width="2.5"/><path d="M36 140 H84 L84 204 H64 L60 160 L56 204 H36Z" fill="#26A69A"/><path d="M38 144 L38 202 M82 144 L82 202" stroke="#fff" stroke-width="3"/>`},
  {cat:'g-outfit', id:'g-hoodie', main:'#FF8A65', name:'קפוצ׳ון', price:7, svg:()=>`${longSleeves('#FF8A65')}<path d="M40 144 H80 L80 204 H64 L60 160 L56 204 H40Z" fill="#455A64"/>
    <path d="M34 98 Q60 88 86 98 L88 148 H32Z" fill="#FF8A65"/><path d="M44 128 H76 L72 144 H48Z" fill="#F4724B"/><path d="M54 98 L54 114 M66 98 L66 114" stroke="#fff" stroke-width="2.5" stroke-linecap="round"/>`},
  {cat:'g-outfit', id:'g-skirt', main:'#7444C9', name:'חולצה וחצאית', price:5, svg:()=>`${sleeves('#fff')}<path d="M38 98 Q60 90 82 98 L84 140 L36 140Z" fill="#fff"/>
    <path d="M37 108 H83 M36 120 H84 M36 132 H84" stroke="#E8577E" stroke-width="5"/><path d="M36 136 H84 L94 170 H26Z" fill="#7444C9"/>`},
  // shoes
  {cat:'g-shoes', id:'g-sneakers', main:'#E8457A', name:'נעלי ספורט', price:4, svg:()=>`<g><path d="M36 214 Q36 202 46 202 Q56 202 58 214Z M62 214 Q64 202 74 202 Q84 202 84 214Z" fill="#fff" stroke="#9AA6B8" stroke-width="1.5"/><path d="M40 208 H54 M66 208 H80" stroke="#E8457A" stroke-width="3"/></g>`},
  {cat:'g-shoes', id:'g-boots', main:'#E05A47', name:'מגפיים', price:5, svg:()=>`<g fill="#E05A47"><rect x="39" y="186" width="16" height="26" rx="4"/><rect x="65" y="186" width="16" height="26" rx="4"/><path d="M37 214 Q37 206 47 206 Q59 206 59 214Z M63 214 Q63 206 73 206 Q85 206 85 214Z"/></g>`},
  {cat:'g-shoes', id:'g-sparkle', main:'#F2C230', name:'נעליים נוצצות', price:6, svg:()=>`<path d="M36 214 Q36 203 46 203 Q57 203 58 214Z M62 214 Q63 203 74 203 Q84 203 84 214Z" fill="#F2C230"/><g fill="#fff"><circle cx="44" cy="208" r="1.6"/><circle cx="51" cy="210" r="1.6"/><circle cx="70" cy="208" r="1.6"/><circle cx="77" cy="210" r="1.6"/></g>`},
  // on the head
  {cat:'g-head', id:'g-crown', main:'#F2C230', name:'כתר', price:8, svg:()=>`<path d="M40 26 L42 6 L52 18 L60 2 L68 18 L78 6 L80 26Z" fill="#F2C230" stroke="#C99A12" stroke-width="2" stroke-linejoin="round"/><circle cx="60" cy="16" r="3" fill="#E8457A"/>`},
  {cat:'g-head', id:'g-headband', main:'#E8457A', name:'קשת', price:3, svg:()=>`<path d="M27 50 Q30 18 60 17 Q90 18 93 50" stroke="#E8457A" stroke-width="6" fill="none" stroke-linecap="round"/><circle cx="34" cy="28" r="5" fill="#FFD54F"/>`},
  {cat:'g-head', id:'g-cap', main:'#3E7BD8', name:'כובע מצחייה', price:4, svg:()=>`<path d="M25 42 Q28 12 60 12 Q92 12 95 42Z" fill="#3E7BD8"/><path d="M25 42 Q8 42 4 48 Q20 50 40 44Z" fill="#2F5BD3"/><circle cx="60" cy="13" r="3" fill="#2F5BD3"/>`},
  {cat:'g-head', id:'g-catears', main:'#2E2A33', name:'אוזני חתול', price:4, svg:()=>`<path d="M28 34 L30 6 L48 22Z M92 34 L90 6 L72 22Z" fill="#2E2A33"/><path d="M33 26 L34 14 L42 21Z M87 26 L86 14 L78 21Z" fill="#F4A9B8"/><path d="M27 40 Q30 18 60 17 Q90 18 93 40" stroke="#2E2A33" stroke-width="4" fill="none"/>`},
  {cat:'g-head', id:'g-flower', main:'#FF8AB3', name:'פרח בשיער', price:3, svg:()=>`<g fill="#FF8AB3"><circle cx="30" cy="30" r="6"/><circle cx="39" cy="26" r="6"/><circle cx="40" cy="36" r="6"/><circle cx="31" cy="40" r="6"/><circle cx="25" cy="35" r="6"/></g><circle cx="33" cy="34" r="4.5" fill="#FFD54F"/>`},
  // glasses (eyes at 47,60 and 73,60)
  {cat:'g-glasses', id:'g-round', main:'#2A2225', name:'משקפיים עגולים', price:4, svg:()=>`<g fill="none" stroke="#2A2225" stroke-width="2.5"><circle cx="47" cy="60" r="9"/><circle cx="73" cy="60" r="9"/><path d="M56 59 Q60 56 64 59"/></g>`},
  {cat:'g-glasses', id:'g-hearts', main:'#F06292', name:'משקפי לב', price:5, svg:()=>`<g fill="#F06292" fill-opacity=".55" stroke="#D81B60" stroke-width="2"><path d="M47 70 L37 60 Q34 51 41 51 Q45 51 47 55 Q49 51 53 51 Q60 51 57 60Z"/><path d="M73 70 L63 60 Q60 51 67 51 Q71 51 73 55 Q75 51 79 51 Q86 51 83 60Z"/></g><path d="M57 57 Q60 55 63 57" stroke="#D81B60" stroke-width="2" fill="none"/>`},
  {cat:'g-glasses', id:'g-shades', main:'#263238', name:'משקפי שמש', price:5, svg:()=>`<g fill="#263238"><rect x="36" y="54" width="21" height="13" rx="5"/><rect x="63" y="54" width="21" height="13" rx="5"/></g><path d="M57 58 H63" stroke="#263238" stroke-width="2.5"/><path d="M40 57 H46" stroke="#fff" stroke-width="2" opacity=".6" stroke-linecap="round"/>`}
];
const girlItem=id=>GIRL_ITEMS.find(i=>i.id===id);
/* an item in its own colour: its main colour swapped for the one she chose (shades and details stay) */
const paintItem=(it,colors={})=>{ const out=it.svg(); const c=colors[it.id]; return c&&it.main?out.split(it.main).join(c):out; };
/* where each category is cropped for shop thumbnails */
const GIRL_CROP={'g-outfit':'4 90 112 126','g-shoes':'22 176 76 44','g-head':'0 -2 120 72','g-glasses':'24 30 72 52'};
/* look: {hair, color, glitter, ribbon, bow, half+color2, streak+streakColor, clips, beads, rstreaks, flowercrown, tiara};
   leave it out to get her default look. colors: {itemId:'#hex'} paints her clothes in the colours she chose. */
function drawGirl(face, worn={}, preview={}, look=null, colors={}){
  const H=hairSvg(lookFor(face,look)), G={...(GIRLS[face]||GIRLS.lili), back:H.defs?`<defs>${H.defs}</defs>${H.back}`:H.back, front:H.front}, w={...worn,...preview}, it=c=>w[c]?girlItem(w[c]):null, sk=G.skin;
  const outfit=it('g-outfit'), shoes=it('g-shoes');
  return `<svg viewBox="0 0 120 224" role="img" aria-label="אני">
    ${G.back}
    <rect x="42" y="160" width="12" height="48" rx="5" fill="${sk}"/><rect x="66" y="160" width="12" height="48" rx="5" fill="${sk}"/>
    ${shoes?paintItem(shoes,colors):`<path d="M36 214 Q36 204 46 204 Q56 204 57 214Z M63 214 Q64 204 74 204 Q84 204 84 214Z" fill="#5A6577"/>`}
    <path d="M40 100 L29 146 M80 100 L91 146" stroke="${sk}" stroke-width="10" stroke-linecap="round"/>
    <circle cx="29" cy="149" r="6" fill="${sk}"/><circle cx="91" cy="149" r="6" fill="${sk}"/>
    ${outfit?paintItem(outfit,colors):`${sleeves('#fff')}<path d="M38 98 Q60 90 82 98 L84 140 L36 140Z" fill="#fff" stroke="#E3E7EE" stroke-width="1.5"/><path d="M36 138 H84 L86 168 H63 L60 152 L57 168 H34Z" fill="#3E7BD8"/>`}
    <rect x="54" y="84" width="12" height="14" rx="4" fill="${sk}"/>
    <circle cx="60" cy="56" r="34" fill="${sk}"/>
    <circle cx="47" cy="60" r="3.4" fill="#2B2B2B"/><circle cx="73" cy="60" r="3.4" fill="#2B2B2B"/><circle cx="48.2" cy="58.8" r="1.1" fill="#fff"/><circle cx="74.2" cy="58.8" r="1.1" fill="#fff"/>
    <ellipse cx="40" cy="70" rx="5" ry="3.2" fill="#F19A9A" opacity=".65"/><ellipse cx="80" cy="70" rx="5" ry="3.2" fill="#F19A9A" opacity=".65"/>
    <path d="M53 73 Q60 79 67 73" stroke="#2B2B2B" stroke-width="2.4" fill="none" stroke-linecap="round"/>
    ${G.front}
    ${it('g-head')?paintItem(it('g-head'),colors):''}${it('g-glasses')?paintItem(it('g-glasses'),colors):''}
  </svg>`;
}
/* her head alone, for the small round faces in menus */
function drawGirlHead(face, look=null){ return drawGirl(face,{},{},look).replace(/viewBox="[^"]*"/,'viewBox="12 2 96 96"'); }
