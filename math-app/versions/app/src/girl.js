/* The girl herself, standing in her home next to her animal, dressed from the shop's "לעצמי" side.
   One geometry for both girls (viewBox 0 0 120 224: head centre 60,56 r34, shoulders y98, feet y214);
   only hair and skin differ, so every item fits both. Items are drawn in fixed layers. */
const GIRLS={
  lili:{skin:'#F6CFAE',
    back:`<circle cx="28" cy="30" r="14" fill="#6B3E26"/><circle cx="92" cy="30" r="14" fill="#6B3E26"/><circle cx="35" cy="38" r="4.5" fill="#F2B21E"/><circle cx="85" cy="38" r="4.5" fill="#F2B21E"/>`,
    front:`<path d="M26 58 C24 32 40 20 60 20 C80 20 96 32 94 58 C90 46 80 40 70 40 C66 46 58 48 50 44 C40 44 30 48 26 58Z" fill="#6B3E26"/>`},
  nori:{skin:'#E9B98F',
    back:`<path d="M24 58 C22 28 40 18 60 18 C80 18 98 28 96 58 L98 106 Q60 114 22 106Z" fill="#2E2A33"/>`,
    front:`<path d="M26 56 C28 30 44 21 60 21 C78 21 92 32 94 56 C80 52 70 42 66 33 C60 44 44 52 26 56Z" fill="#2E2A33"/><path d="M82 24 l9-6 -1 11z M82 24 l11 3 -8 6z" fill="#E8457A"/><circle cx="84" cy="26" r="3" fill="#C72F63"/>`}
};
const GIRL_CATS=[{id:'g-outfit',name:'בגדים'},{id:'g-shoes',name:'נעליים'},{id:'g-head',name:'לראש'},{id:'g-glasses',name:'משקפיים'}];
const sleeves=c=>`<path d="M38 98 L27 118 L35 122 L45 106Z M82 98 L93 118 L85 122 L75 106Z" fill="${c}"/>`;
const longSleeves=c=>`<path d="M40 100 L28 146 M80 100 L92 146" stroke="${c}" stroke-width="12" stroke-linecap="round"/>`;
const GIRL_ITEMS=[
  // clothes: replace the default t-shirt and shorts
  {cat:'g-outfit', id:'g-dress', name:'שמלה פרחונית', price:6, svg:()=>`${sleeves('#F06292')}<path d="M40 96 Q60 90 80 96 L84 118 L98 176 Q60 186 22 176 L36 118Z" fill="#F06292"/>
    ${[[46,128],[70,134],[56,156],[36,162],[80,160]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="5" fill="#fff"/><circle cx="${x}" cy="${y}" r="2" fill="#FFD54F"/>`).join('')}`},
  {cat:'g-outfit', id:'g-overalls', name:'סרבל ג׳ינס', price:6, svg:()=>`${sleeves('#FFD54F')}<path d="M38 98 Q60 90 82 98 L84 140 L36 140Z" fill="#FFD54F"/>
    <path d="M40 118 H80 L84 172 H63 L60 152 L57 172 H36Z" fill="#3F6FB5"/><path d="M45 99 L46 120 M75 99 L74 120" stroke="#3F6FB5" stroke-width="5"/><rect x="51" y="124" width="18" height="12" rx="3" fill="#335C99"/>`},
  {cat:'g-outfit', id:'g-tutu', name:'שמלת נסיכה', price:10, svg:()=>`${sleeves('#B39DDB')}<path d="M42 98 Q60 92 78 98 L80 132 H40Z" fill="#B39DDB"/>
    <path d="M40 128 H80 L106 168 Q60 182 14 168Z" fill="#E1BEE7"/><path d="M40 128 H80 L96 160 Q60 172 24 160Z" fill="#F3E5F5"/>
    <g fill="#fff">${[[30,164],[52,170],[76,168],[94,162],[62,150]].map(([x,y])=>`<path d="M${x} ${y-4} L${x+1.5} ${y-1} L${x+4} ${y} L${x+1.5} ${y+1} L${x} ${y+4} L${x-1.5} ${y+1} L${x-4} ${y} L${x-1.5} ${y-1}Z"/>`).join('')}</g>
    <path d="M52 100 L60 108 L68 100" stroke="#F2C230" stroke-width="3" fill="none"/>`},
  {cat:'g-outfit', id:'g-sport', name:'חליפת ספורט', price:7, svg:()=>`${longSleeves('#26A69A')}<path d="M36 98 Q60 90 84 98 L86 142 H34Z" fill="#26A69A"/>
    <path d="M60 96 V142" stroke="#fff" stroke-width="2.5"/><path d="M36 140 H84 L84 204 H64 L60 160 L56 204 H36Z" fill="#26A69A"/><path d="M38 144 L38 202 M82 144 L82 202" stroke="#fff" stroke-width="3"/>`},
  {cat:'g-outfit', id:'g-hoodie', name:'קפוצ׳ון', price:7, svg:()=>`${longSleeves('#FF8A65')}<path d="M40 144 H80 L80 204 H64 L60 160 L56 204 H40Z" fill="#455A64"/>
    <path d="M34 98 Q60 88 86 98 L88 148 H32Z" fill="#FF8A65"/><path d="M44 128 H76 L72 144 H48Z" fill="#F4724B"/><path d="M54 98 L54 114 M66 98 L66 114" stroke="#fff" stroke-width="2.5" stroke-linecap="round"/>`},
  {cat:'g-outfit', id:'g-skirt', name:'חולצה וחצאית', price:5, svg:()=>`${sleeves('#fff')}<path d="M38 98 Q60 90 82 98 L84 140 L36 140Z" fill="#fff"/>
    <path d="M37 108 H83 M36 120 H84 M36 132 H84" stroke="#E8577E" stroke-width="5"/><path d="M36 136 H84 L94 170 H26Z" fill="#7444C9"/>`},
  // shoes
  {cat:'g-shoes', id:'g-sneakers', name:'נעלי ספורט', price:4, svg:()=>`<g><path d="M36 214 Q36 202 46 202 Q56 202 58 214Z M62 214 Q64 202 74 202 Q84 202 84 214Z" fill="#fff" stroke="#9AA6B8" stroke-width="1.5"/><path d="M40 208 H54 M66 208 H80" stroke="#E8457A" stroke-width="3"/></g>`},
  {cat:'g-shoes', id:'g-boots', name:'מגפיים', price:5, svg:()=>`<g fill="#E05A47"><rect x="39" y="186" width="16" height="26" rx="4"/><rect x="65" y="186" width="16" height="26" rx="4"/><path d="M37 214 Q37 206 47 206 Q59 206 59 214Z M63 214 Q63 206 73 206 Q85 206 85 214Z"/></g>`},
  {cat:'g-shoes', id:'g-sparkle', name:'נעליים נוצצות', price:6, svg:()=>`<path d="M36 214 Q36 203 46 203 Q57 203 58 214Z M62 214 Q63 203 74 203 Q84 203 84 214Z" fill="#F2C230"/><g fill="#fff"><circle cx="44" cy="208" r="1.6"/><circle cx="51" cy="210" r="1.6"/><circle cx="70" cy="208" r="1.6"/><circle cx="77" cy="210" r="1.6"/></g>`},
  // on the head
  {cat:'g-head', id:'g-crown', name:'כתר', price:8, svg:()=>`<path d="M40 26 L42 6 L52 18 L60 2 L68 18 L78 6 L80 26Z" fill="#F2C230" stroke="#C99A12" stroke-width="2" stroke-linejoin="round"/><circle cx="60" cy="16" r="3" fill="#E8457A"/>`},
  {cat:'g-head', id:'g-headband', name:'קשת', price:3, svg:()=>`<path d="M27 50 Q30 18 60 17 Q90 18 93 50" stroke="#E8457A" stroke-width="6" fill="none" stroke-linecap="round"/><circle cx="34" cy="28" r="5" fill="#FFD54F"/>`},
  {cat:'g-head', id:'g-cap', name:'כובע מצחייה', price:4, svg:()=>`<path d="M25 42 Q28 12 60 12 Q92 12 95 42Z" fill="#3E7BD8"/><path d="M25 42 Q8 42 4 48 Q20 50 40 44Z" fill="#2F5BD3"/><circle cx="60" cy="13" r="3" fill="#2F5BD3"/>`},
  {cat:'g-head', id:'g-catears', name:'אוזני חתול', price:4, svg:()=>`<path d="M28 34 L30 6 L48 22Z M92 34 L90 6 L72 22Z" fill="#2E2A33"/><path d="M33 26 L34 14 L42 21Z M87 26 L86 14 L78 21Z" fill="#F4A9B8"/><path d="M27 40 Q30 18 60 17 Q90 18 93 40" stroke="#2E2A33" stroke-width="4" fill="none"/>`},
  {cat:'g-head', id:'g-flower', name:'פרח בשיער', price:3, svg:()=>`<g fill="#FF8AB3"><circle cx="30" cy="30" r="6"/><circle cx="39" cy="26" r="6"/><circle cx="40" cy="36" r="6"/><circle cx="31" cy="40" r="6"/><circle cx="25" cy="35" r="6"/></g><circle cx="33" cy="34" r="4.5" fill="#FFD54F"/>`},
  // glasses (eyes at 47,60 and 73,60)
  {cat:'g-glasses', id:'g-round', name:'משקפיים עגולים', price:4, svg:()=>`<g fill="none" stroke="#2A2225" stroke-width="2.5"><circle cx="47" cy="60" r="9"/><circle cx="73" cy="60" r="9"/><path d="M56 59 Q60 56 64 59"/></g>`},
  {cat:'g-glasses', id:'g-hearts', name:'משקפי לב', price:5, svg:()=>`<g fill="#F06292" fill-opacity=".55" stroke="#D81B60" stroke-width="2"><path d="M47 70 L37 60 Q34 51 41 51 Q45 51 47 55 Q49 51 53 51 Q60 51 57 60Z"/><path d="M73 70 L63 60 Q60 51 67 51 Q71 51 73 55 Q75 51 79 51 Q86 51 83 60Z"/></g><path d="M57 57 Q60 55 63 57" stroke="#D81B60" stroke-width="2" fill="none"/>`},
  {cat:'g-glasses', id:'g-shades', name:'משקפי שמש', price:5, svg:()=>`<g fill="#263238"><rect x="36" y="54" width="21" height="13" rx="5"/><rect x="63" y="54" width="21" height="13" rx="5"/></g><path d="M57 58 H63" stroke="#263238" stroke-width="2.5"/><path d="M40 57 H46" stroke="#fff" stroke-width="2" opacity=".6" stroke-linecap="round"/>`}
];
const girlItem=id=>GIRL_ITEMS.find(i=>i.id===id);
/* where each category is cropped for shop thumbnails */
const GIRL_CROP={'g-outfit':'4 90 112 126','g-shoes':'22 176 76 44','g-head':'0 -2 120 72','g-glasses':'24 30 72 52'};
function drawGirl(face, worn={}, preview={}){
  const G=GIRLS[face]||GIRLS.lili, w={...worn,...preview}, it=c=>w[c]?girlItem(w[c]):null, sk=G.skin;
  const outfit=it('g-outfit'), shoes=it('g-shoes');
  return `<svg viewBox="0 0 120 224" role="img" aria-label="אני">
    ${G.back}
    <rect x="42" y="160" width="12" height="48" rx="5" fill="${sk}"/><rect x="66" y="160" width="12" height="48" rx="5" fill="${sk}"/>
    ${shoes?shoes.svg():`<path d="M36 214 Q36 204 46 204 Q56 204 57 214Z M63 214 Q64 204 74 204 Q84 204 84 214Z" fill="#5A6577"/>`}
    <path d="M40 100 L29 146 M80 100 L91 146" stroke="${sk}" stroke-width="10" stroke-linecap="round"/>
    <circle cx="29" cy="149" r="6" fill="${sk}"/><circle cx="91" cy="149" r="6" fill="${sk}"/>
    ${outfit?outfit.svg():`${sleeves('#fff')}<path d="M38 98 Q60 90 82 98 L84 140 L36 140Z" fill="#fff" stroke="#E3E7EE" stroke-width="1.5"/><path d="M36 138 H84 L86 168 H63 L60 152 L57 168 H34Z" fill="#3E7BD8"/>`}
    <rect x="54" y="84" width="12" height="14" rx="4" fill="${sk}"/>
    <circle cx="60" cy="56" r="34" fill="${sk}"/>
    <circle cx="47" cy="60" r="3.4" fill="#2B2B2B"/><circle cx="73" cy="60" r="3.4" fill="#2B2B2B"/><circle cx="48.2" cy="58.8" r="1.1" fill="#fff"/><circle cx="74.2" cy="58.8" r="1.1" fill="#fff"/>
    <ellipse cx="40" cy="70" rx="5" ry="3.2" fill="#F19A9A" opacity=".65"/><ellipse cx="80" cy="70" rx="5" ry="3.2" fill="#F19A9A" opacity=".65"/>
    <path d="M53 73 Q60 79 67 73" stroke="#2B2B2B" stroke-width="2.4" fill="none" stroke-linecap="round"/>
    ${G.front}
    ${it('g-head')?it('g-head').svg():''}${it('g-glasses')?it('g-glasses').svg():''}
  </svg>`;
}
