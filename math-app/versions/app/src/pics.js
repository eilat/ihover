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
function dotArray({rows,cols,lit=-1,sums=false,spin=false}){
  const g=26, gap=c=>c>=5?10:0, W=cols*g+(cols>5?10:0)+(sums?70:20), H=rows*g+16;
  let d=''; for(let i=0;i<rows;i++){ const on=i<=lit;
    if(on) d+=`<rect x="4" y="${8+i*g}" width="${cols*g+(cols>5?10:0)+4}" height="${g-2}" rx="11" fill="color-mix(in srgb,var(--accent) 18%,transparent)"/>`;
    for(let j=0;j<cols;j++) d+=`<circle cx="${18+j*g+(j>=5?gap(cols):0)}" cy="${20+i*g}" r="9" fill="${on?'var(--accent)':'#5B8DEF'}"/>`;
    if(sums&&on) d+=`<text x="${cols*g+(cols>5?10:0)+30}" y="${27+i*g}" class="nl-n strong">${(i+1)*cols}</text>`; }
  return `<svg class="pic arr ${spin?'spin':''}" viewBox="0 0 ${W} ${H}" style="max-width:${Math.min(96,W/4.2)}%" role="img" aria-label="${rows} שורות, ${cols} בכל שורה">${d}</svg>`;
}
const decomp=(n,a,b,ca='var(--accent)',cb='#D9980A')=>`<p class="decomp ltr">${n} = <span style="color:${ca}">${a}</span> + <span style="color:${cb}">${b}</span></p>`;

