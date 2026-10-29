/* Shared by the lessons and the diagnostic: small helpers and the pictures (number lines, plates, arrays). */
const esc=t=>String(t).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const L=x=>`<span class="ltr">${x}</span>`;
const r=(a,b)=>a+Math.floor(Math.random()*(b-a+1));
const pick=a=>a[r(0,a.length-1)];
const shuffle=a=>a.map(x=>[Math.random(),x]).sort((p,q)=>p[0]-q[0]).map(p=>p[1]);
const digits=n=>({h:Math.floor(n/100),t:Math.floor(n/10)%10,o:n%10});
// typical wrong answers must not collide with each other or with the answer, or we can't tell what happened
const distinct=(ans,ws)=>{ const v=ws.filter(x=>x!=null); return new Set([ans,...v]).size===v.length+1; };

/* ---------- pictures ---------- */
const COL={plate:'#5B8DEF', berry:'#E5484D', arc:'var(--accent)', arc2:'#D9980A', line:'var(--ink)'};
/* an empty number line: only the numbers that matter, arcs sized by the jump */
function numberLine({min,max,points=[],arcs=[],station=null}){
  const X=v=>34+(v-min)/(max-min)*692, Y=118;
  const arcSvg=arcs.map(a=>{ const x1=X(a.from), x2=X(a.to), h=Math.max(24,Math.min(84,(x2-x1)*.45)), mx=(x1+x2)/2;
    return `<path d="M${x1} ${Y} Q${mx} ${Y-h*1.9} ${x2} ${Y}" fill="none" stroke="${a.color||COL.arc}" stroke-width="${a.small?2.5:3.5}" ${a.pending?'stroke-dasharray="7 6"':''} marker-end="url(#ah)"/>
      <text x="${mx}" y="${Y-h-8}" text-anchor="middle" class="nl-j" fill="${a.color||COL.arc}">${a.label}</text>`; }).join('');
  const pts=points.map(p=>`<path d="M${X(p.v)} ${Y-9} V${Y+9}" stroke="var(--ink)" stroke-width="${p.strong?4:2.5}"/>
      <text x="${X(p.v)}" y="${Y+34}" text-anchor="middle" class="nl-n ${p.strong?'strong':''}">${p.label??p.v}</text>`).join('');
  const st=station!=null?`<circle cx="${X(station)}" cy="${Y}" r="13" fill="var(--surface)" stroke="#D9980A" stroke-width="4"/><text x="${X(station)}" y="${Y+34}" text-anchor="middle" class="nl-n strong" fill="#B07A00">${station}</text>`:'';
  return `<svg class="pic nl" viewBox="0 0 760 160" role="img" aria-label="ציר מספרים"><defs><marker id="ah" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10z" fill="context-stroke"/></marker></defs>
    <path d="M14 ${Y} H746" stroke="var(--line)" stroke-width="4" stroke-linecap="round"/>${arcSvg}${st}${pts}</svg>`;
}
/* plates with strawberries laid out like dice, so she sees the number at once instead of counting */
const DICE={1:[[0,0]],2:[[-1,-1],[1,1]],3:[[-1,-1],[0,0],[1,1]],4:[[-1,-1],[1,-1],[-1,1],[1,1]],5:[[-1,-1],[1,-1],[0,0],[-1,1],[1,1]],
  6:[[-1,-1],[1,-1],[-1,0],[1,0],[-1,1],[1,1]],7:[[-1,-1],[1,-1],[-1,0],[0,0],[1,0],[-1,1],[1,1]],8:[[-1,-1],[0,-1],[1,-1],[-1,0],[1,0],[-1,1],[0,1],[1,1]],
  9:[[-1,-1],[0,-1],[1,-1],[-1,0],[0,0],[1,0],[-1,1],[0,1],[1,1]],10:[[-2,-.6],[-1,-.6],[0,-.6],[1,-.6],[2,-.6],[-2,.6],[-1,.6],[0,.6],[1,.6],[2,.6]]};
const berry=(x,y,s=1)=>`<g transform="translate(${x} ${y}) scale(${s})"><path d="M0 9 C-9 4 -8 -6 0 -5 C8 -6 9 4 0 9Z" fill="${COL.berry}"/><path d="M-4 -6 L0 -3 L4 -6 L0 -8Z" fill="#3E9C4E"/></g>`;
function plates({ks,lit=-1,totals=false,size=1}){
  const n=ks.length, W=Math.max(1,n)*118, sp=118;
  const ps=ks.map((k,i)=>{ const cx=W-59-i*sp, cy=62, /* counted from the right, like reading */ d=k>=10?13:15;
    return `<g class="${i===lit?'lit':''}"><ellipse cx="${cx}" cy="${cy+4}" rx="54" ry="46" fill="rgba(0,0,0,.08)"/><ellipse cx="${cx}" cy="${cy}" rx="54" ry="46" fill="#fff" stroke="${i<=lit?'var(--accent)':COL.plate}" stroke-width="${i<=lit?5:4}"/>
      <ellipse cx="${cx}" cy="${cy}" rx="38" ry="31" fill="none" stroke="#DCE6FB" stroke-width="2"/>${(DICE[k]||[]).map(([dx,dy])=>berry(cx+dx*d,cy+dy*d,k>=10?.85:1)).join('')}
      ${totals&&i<=(lit<0?n-1:lit)?`<text x="${cx}" y="${cy+82}" text-anchor="middle" class="nl-n strong">${ks.slice(0,i+1).reduce((a,b)=>a+b,0)}</text>`:''}</g>`; }).join('');
  return `<svg class="pic" viewBox="0 0 ${W} ${totals?160:124}" style="max-width:${Math.min(100,n*20)}%" role="img" aria-label="${n} צלחות">${ps}</svg>`;
}
/* a number line with a scale (a tick for every 1), for equal jumps from 0 */
function jumpLine({max,k,count,landings=true,pendingNext=false,numbered=false}){
  const X=v=>30+v/max*700, Y=118;
  let t=''; for(let v=0;v<=max;v++){ const big=v%5===0; t+=`<path d="M${X(v)} ${Y-(big?10:5)} V${Y+(big?10:5)}" stroke="var(--ink)" stroke-width="${v%10===0?3:1.6}" opacity="${big?1:.55}"/>`;
    if(v%10===0||(max<=30&&v%5===0)) t+=`<text x="${X(v)}" y="${Y+34}" text-anchor="middle" class="nl-n">${v}</text>`; }
  let a=''; for(let i=0;i<count+(pendingNext?1:0);i++){ const x1=X(i*k), x2=X((i+1)*k), mx=(x1+x2)/2, h=Math.min(70,Math.max(26,(x2-x1)*.5)), pend=i>=count;
    a+=`<path d="M${x1} ${Y} Q${mx} ${Y-h*1.9} ${x2} ${Y}" fill="none" stroke="${COL.arc}" stroke-width="3.2" ${pend?'stroke-dasharray="7 6"':''} marker-end="url(#ah2)"/>
      <text x="${mx}" y="${Y-h-8}" text-anchor="middle" class="nl-j" fill="${COL.arc}">${numbered?`${i+1}`:`+${k}`}</text>
      ${landings&&!pend?`<circle cx="${x2}" cy="${Y}" r="6" fill="${COL.arc}"/>`:''}`; }
  return `<svg class="pic nl" viewBox="0 0 760 160" role="img" aria-label="ציר עם קפיצות"><defs><marker id="ah2" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10z" fill="context-stroke"/></marker></defs>
    <path d="M14 ${Y} H746" stroke="var(--line)" stroke-width="4"/><text x="${X(0)}" y="${Y-18}" text-anchor="middle" class="nl-s">התחלה</text>${t}${a}</svg>`;
}
/* an array of dots: rows go across, like lines in a notebook */
/* an array of dots: rows go across, like lines in a notebook.
   split: {rows:k} or {cols:k} cuts it in two parts (second part orange) — for building a hard fact from two easy ones.
   cover: n hides the last n columns under a card — for ×9 as ×10 minus one column. */
function dotArray({rows,cols,lit=-1,sums=false,spin=false,split=null,cover=0}){
  const g=26, gx=j=>18+j*g+(j>=5&&cols>5?10:0)+(split?.cols!=null&&j>=split.cols?12:0), gy=i=>20+i*g+(split?.rows!=null&&i>=split.rows?12:0);
  const W=gx(cols-1)+(sums?82:22), H=gy(rows-1)+22;
  let d=''; for(let i=0;i<rows;i++){ const on=i<=lit;
    if(on) d+=`<rect x="4" y="${gy(i)-12}" width="${gx(cols-1)+10}" height="${g-2}" rx="11" fill="color-mix(in srgb,var(--accent) 18%,transparent)"/>`;
    for(let j=0;j<cols;j++){ const second=(split?.rows!=null&&i>=split.rows)||(split?.cols!=null&&j>=split.cols);
      d+=`<circle cx="${gx(j)}" cy="${gy(i)}" r="9" fill="${on?'var(--accent)':second?'#E8833A':'#5B8DEF'}"/>`; }
    if(sums&&on) d+=`<text x="${gx(cols-1)+28}" y="${gy(i)+7}" class="nl-n strong">${(i+1)*cols}</text>`; }
  if(split?.rows!=null) d+=`<path d="M4 ${gy(split.rows)-19} H${gx(cols-1)+14}" stroke="var(--ink)" stroke-width="2.5" stroke-dasharray="6 5"/>`;
  if(split?.cols!=null) d+=`<path d="M${gx(split.cols)-19} 4 V${gy(rows-1)+16}" stroke="var(--ink)" stroke-width="2.5" stroke-dasharray="6 5"/>`;
  if(cover) d+=`<rect x="${gx(cols-cover)-14}" y="4" width="${gx(cols-1)-gx(cols-cover)+28}" height="${gy(rows-1)+12}" rx="8" fill="#FFD54F" opacity=".92"/>`;
  return `<svg class="pic arr ${spin?'spin':''}" viewBox="0 0 ${W} ${H}" style="max-width:${Math.min(96,W/4.2)}%" role="img" aria-label="${rows} שורות, ${cols} בכל שורה">${d}</svg>`;
}
/* ten frames: the first number in blue, the second in orange. fill:true moves orange dots up to complete the first frame. */
function tenFrame({a,b=0,fill=false,frames=null,mark=-1}){
  const cells=[]; // colours, frame after frame
  if(fill){ for(let i=0;i<a;i++) cells.push('a'); for(let i=0;i<b;i++) cells.push('b'); }
  else { for(let i=0;i<a;i++) cells.push('a'); while(b&&cells.length%10) cells.push(null); for(let i=0;i<b;i++) cells.push('b'); }
  const n=frames||Math.max(1,Math.ceil(cells.length/10)), cw=42, fw=5*cw+12, W=n*fw+(n-1)*24+8;
  let s=''; for(let f=0;f<n;f++){ const x0=4+f*(fw+24);
    s+=`<rect x="${x0}" y="4" width="${fw}" height="${2*cw+12}" rx="8" fill="#fff" stroke="var(--ink)" stroke-width="3"/>`;
    for(let k=0;k<10;k++){ const cx=x0+6+(k%5)*cw+cw/2, cy=10+Math.floor(k/5)*cw+cw/2, c=cells[f*10+k];
      s+=`<rect x="${cx-cw/2}" y="${cy-cw/2}" width="${cw}" height="${cw}" fill="none" stroke="#C9D2DE" stroke-width="1.5"/>`;
      if(c) s+=`<circle cx="${cx}" cy="${cy}" r="15" fill="${c==='a'?'#3A6FD8':'#E8833A'}" ${f*10+k===mark?'stroke="var(--ink)" stroke-width="3"':''}/>`; } }
  return `<svg class="pic" viewBox="0 0 ${W} ${2*cw+20}" style="max-width:${Math.min(96,n*44)}%" role="img" aria-label="מסגרת עשר">${s}</svg>`;
}
/* base ten: hundred squares, ten sticks, one dots. bundleT / bundleO draw a frame around 10 of them (10 tens = a hundred, 10 ones = a ten). */
function baseTen({h=0,t=0,o=0,bundleT=false,bundleO=false,label=true}){
  let x=6, s='';
  for(let i=0;i<h;i++){ s+=`<rect x="${x}" y="8" width="70" height="70" fill="#2F5BD3"/><path d="${Array(9).fill(0).map((_,k)=>`M${x+7*(k+1)} 8 V78 M${x} ${8+7*(k+1)} H${x+70}`).join(' ')}" stroke="rgba(255,255,255,.4)" stroke-width="1"/>`; x+=80; }
  if(h) x+=10;
  const tx=x; for(let i=0;i<t;i++){ s+=`<rect x="${x}" y="8" width="11" height="70" rx="3" fill="#D9980A"/>`; x+=15; }
  if(bundleT&&t>=10) s+=`<rect x="${tx-5}" y="2" width="${10*15+5}" height="82" rx="8" fill="none" stroke="var(--ink)" stroke-width="3"/><text x="${tx+72}" y="100" text-anchor="middle" class="nl-s" style="font-weight:600">100</text>`;
  if(t) x+=12;
  const ox=x; for(let i=0;i<o;i++){ s+=`<circle cx="${x+9+(i%5)*20}" cy="${22+Math.floor(i/5)*20}" r="7.5" fill="#23895A"/>`; if(i%5===4) x+=0; }
  const oc=Math.min(o,5)*20; x+=oc+(bundleO&&o>=10?36:8);
  if(bundleO&&o>=10) s+=`<rect x="${ox-2}" y="10" width="104" height="44" rx="8" fill="none" stroke="var(--ink)" stroke-width="3"/><text x="${ox+112}" y="38" class="nl-s" style="font-weight:600">10</text>`;
  const W=Math.max(120,x+4), H=o>10?Math.max(104,22+Math.ceil(o/5)*20+10):104;
  return `<svg class="pic" viewBox="0 0 ${W} ${H}" style="max-width:${Math.min(96,W/4)}%" role="img" aria-label="${h} מאות, ${t} עשרות, ${o} אחדות">${s}</svg>`;
}
const decomp=(n,a,b,ca='var(--accent)',cb='#D9980A')=>`<p class="decomp ltr">${n} = <span style="color:${ca}">${a}</span> + <span style="color:${cb}">${b}</span></p>`;

