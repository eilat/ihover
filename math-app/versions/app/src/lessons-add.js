/* ---------- addition lessons ח1.1-ח3.2, ח4.4, ח4.5 (spec: math-teacher, SKILLS-MAP.md) ----------
   Mistakes are listed in priority order; an entry that equals the answer or an earlier entry becomes null,
   so small-number exercises are never thrown away just because two mistakes give the same number. */
const prio=(ans,list)=>{ const seen=new Set([ans]); return list.map(([v,m])=>{ if(v==null||seen.has(v)) return [null,m]; seen.add(v); return [v,m]; }); };
const pairPic=(a,b,sym='+')=>`<div class="pair">${a}<span class="arrow-r">${sym}</span>${b}</div>`;
const big=t=>`<p class="decomp ltr">${t}</p>`;
const fitPic=svg=>svg.replace(/style="max-width:[^"]*"/,'style="max-width:100%"');
const nd=n=>String(n).split('').every(d=>d!=='0'); // no zero digit
const unitsMsg=(x,s,why)=>x%10!==s%10?why:null;

/* ח1.1 friends of 10 */
function f10Wrongs(a){ const c=10-a; return prio(c,[[10,'10 זה כמה יש כשהמסגרת מלאה. כמה מוסיפים כדי להגיע ל-10?'],[a,'זה המספר שכבר יש. כמה חסר לו עד 10?'],[10+a,'כאן לא מחברות. מחפשות כמה חסר עד 10.'],[c-1,'קרוב! ספרי שוב את המקומות הריקים.'],[c+1,'קרוב! ספרי שוב את המקומות הריקים.']]); }
const friendsRow=()=>`<div style="display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:10px;width:100%">${[1,2,3,4,5].map(i=>`<div>${fitPic(tenFrame({a:i,b:10-i,fill:true}))}<p class="decomp ltr" style="font-size:20px">${i} + ${10-i}</p></div>`).join('')}</div>`;
const chainHtml=(nums,pairs=[])=>`<p class="decomp ltr">${nums.map((n,i)=>{ const k=pairs.findIndex(p=>p.includes(i)); return k<0?`${n}`:`<span style="color:${k?'#E8833A':'var(--accent)'};text-decoration:underline;text-underline-offset:6px">${n}</span>`; }).join(' + ')}</p>`;
LESSONS['h1.1']={id:'ח1.1', title:'חברים של 10', explain:[
  {say:'במסגרת יש 10 מקומות. 7 מלאים, 3 ריקים.', vis:()=>tenFrame({a:7,frames:1})},
  {say:'ממלאות את הריקים: 7 ועוד 3 זה 10. 7 ו-3 הם חברים של 10.', vis:()=>tenFrame({a:7,b:3,fill:true})+big('7 + 3 = 10')},
  {say:'כל החברים של 10. כשמספר אחד גדל, החבר שלו קטן.', vis:friendsRow},
  {say:'7 + 8 + 3 + 2: מחפשות חברים. 7 ו-3, 8 ו-2. 10 ועוד 10 זה 20. מותר לחבר בכל סדר.', vis:()=>chainHtml([7,8,3,2],[[0,2],[1,3]])+big('10 + 10 = 20')}
 ],
 together:[
  ()=>({say:`${L('6 + ? = 10')}`, eq:['6 +',{f:0},'= 10'], fields:[{q:'כמה מקומות ריקים?',ans:4,wrong:x=>wrongFrom(f10Wrongs(6),x)},{q:'ועכשיו הפוך: 4 + ? = 10',label:'4 + ? = 10',ans:6,wrong:x=>x===4?'4 כבר כתוב. מה החבר שלו?':null}],
    vis:st=>tenFrame({a:6,b:st.done>=1?4:0,fill:true,frames:1})}),
  ()=>({say:`${L('4 + 5 + 6 + 5')}: מחפשות חברים.`, eq:['4 + 5 + 6 + 5 =',{f:2}], fields:[{q:'מי החבר של 4 בשרשרת?',label:'החבר של 4',ans:6,wrong:x=>x===5?'5 ועוד 4 זה 9. מי משלים את 4 ל-10?':null},{q:'מי עוד חברים? 5 + 5 =',label:'5 + 5 =',ans:10},{q:'10 + 10 =',ans:20}],
    vis:st=>chainHtml([4,5,6,5],st.done>=1?[[0,2],...(st.done>=2?[[1,3]]:[])]:[])})
 ],
 levels:['frame','frame','miss','miss','chain3','chain4'],
 gen(lv,used){ const key=k=>{ if(used.has(k)) return false; used.add(k); return true; };
   if(lv==='frame'||lv==='miss'){ let a; for(let t=0;;t++){ a=r(lv==='frame'?3:1,lv==='frame'?8:9); if(a===5) continue; if(t<100&&!key(lv+a)) continue; break; }
     const W=f10Wrongs(a), left=lv==='miss'&&Math.random()<.5;
     return {say: left?`איזה מספר ועוד ${a} זה 10?`:`כמה חסר ל-${a} עד 10?`, eq: left?[{f:0},`+ ${a} = 10`]:[`${a} +`,{f:0},'= 10'], fields:[{ans:10-a,wrong:x=>wrongFrom(W,x)}],
       showVis:lv==='frame'?'always':'hint', vis:st=>tenFrame({a,b:st.finished?10-a:0,fill:true,frames:1}),
       hints:['ספרי את המקומות הריקים.',`${a} ועוד כמה ממלא את המסגרת?`,`${a} + ${10-a} = 10`], level:lv}; }
   if(lv==='chain3'){ let p,q,c; for(let t=0;;t++){ p=r(2,8); q=10-p; c=r(2,9); if(p===5||c===p||c===q) continue; if(t<100&&!key('c'+p+'-'+c)) continue; break; }
     const s=10+c, W=prio(s,[[10,`מצאת את החברים ${p} ו-${q}! ומה עם ${c}?`],[p+c,'חיברת רק חלק מהשרשרת.'],[c+q,'חיברת רק חלק מהשרשרת.'],[s-1,'קרוב! 10 ועוד '+c+'?'],[s+1,'קרוב! 10 ועוד '+c+'?']]);
     return {say:'כמה זה? חפשי חברים של 10.', eq:[`${p} + ${c} + ${q} =`,{f:0}], fields:[{ans:s,wrong:x=>wrongFrom(W,x)}], showVis:'hint', vis:()=>chainHtml([p,c,q],[[0,2]]),
       hints:['חפשי שני מספרים שהם חברים של 10.',`${p} ו-${q} הם 10. מה נשאר?`,`10 + ${c} = ${s}`], level:lv}; }
   let p,q; for(let t=0;;t++){ p=r(1,9); q=r(1,9); if(p===5||q===5||q===p||q===10-p) continue; if(t<100&&!key('d'+p+'-'+q)) continue; break; }
   const nums=[p,q,10-p,10-q], W=prio(20,[[10,'זה זוג אחד. יש עוד זוג?'],[19,'קרוב! 10 ועוד 10?'],[21,'קרוב! 10 ועוד 10?']]);
   return {say:'כמה זה? חפשי שני זוגות של חברים.', eq:[`${nums.join(' + ')} =`,{f:0}], fields:[{ans:20,wrong:x=>wrongFrom(W,x)}], showVis:'hint', vis:()=>chainHtml(nums,[[0,2],[1,3]]),
     hints:['חפשי שני מספרים שהם חברים של 10.',`${p} ו-${10-p} הם 10. ומי עוד?`,'10 + 10 = 20'], level:lv}; },
 star(){ return {star:true, say:'⭐ שאלת אתגר: כמה זה?', eq:['7 + 8 + 3 + 2 + 5 + 5 =',{f:0}], fields:[{ans:30,wrong:x=>x===20?'מצאת שני זוגות. יש עוד אחד?':x===25?'5 ועוד 5 הם גם חברים.':null}], showVis:'hint',
   vis:()=>chainHtml([7,8,3,2,5,5],[[0,2],[1,3],[4,5]]), hints:['חפשי זוגות של 10.','7 ו-3, 8 ו-2, ועוד זוג?','10 + 10 + 10 = 30']}; },
 parent:'שאלי: "איך ידעת כל כך מהר?" אם היא סופרת על האצבעות, תרגלו בעל פה "מי החבר של 7?"'
};

/* ח1.2 going over ten */
function overWrongs(a,b){ const g=Math.max(a,b), sm=Math.min(a,b), c=10-g, s=a+b;
  return prio(s,[[10,`הגעת ל-10! נשארו עוד ${sm-c} מתוך ${sm}.`],[10+sm,`את ה-${c} כבר העברנו כדי להגיע ל-10. מוסיפות רק מה שנשאר: ${sm-c}.`],[s-10,'זה מה שנשאר אחרי ה-10. ואיפה ה-10?'],[s-1,`קרוב! כמה חסר ל-${g} עד 10?`],[s+1,`קרוב! כמה חסר ל-${g} עד 10?`]]); }
LESSONS['h1.2']={id:'ח1.2', title:'עוברות את העשר', explain:[
  {say:'8 + 6. במסגרת אחת 8, בשנייה 6.', vis:()=>tenFrame({a:8,b:6})},
  {say:'למסגרת הראשונה חסרות 2. מעבירות 2 כתומות לשם.', vis:()=>tenFrame({a:8,b:6,fill:true})},
  {say:'עכשיו מסגרת אחת מלאה: 10. בשנייה נשארו 4. 10 ועוד 4 זה 14.', vis:()=>tenFrame({a:8,b:6,fill:true})+big('8 + 6 = 8 + 2 + 4 = 10 + 4 = 14')},
  {say:'תמיד אותו דבר: כמה חסר עד 10? לוקחות את זה מהמספר השני, ומה שנשאר בא אחרי ה-10.', vis:()=>tenFrame({a:9,b:5,fill:true})+big('9 + 5 = 10 + 4 = 14')}
 ],
 together:[[9,4],[7,5]].map(([a,b])=>()=>{ const c=10-a, W=overWrongs(a,b);
   return {say:`${L(`${a} + ${b}`)}: קודם עד 10.`, eq:[`${a} + ${b} =`,{sum:a+b}],
    fields:[{q:`כמה חסר ל-${a} עד 10?`,label:`${a} → 10`,ans:c},{q:`${b} זה ${c} ועוד כמה?`,label:`${b} = ${c} +`,ans:b-c},{q:`10 + ${b-c} = ?`,label:`10 + ${b-c} =`,ans:a+b,wrong:x=>x===a+b+1?`את ה-${c} כבר העברנו.`:wrongFrom(W,x)}],
    vis:st=>tenFrame({a,b,fill:st.done>=1})}; }),
 levels:[9,8,7,'turn','miss','mix'],
 gen(lv,used){ let a,b; for(let t=0;;t++){
     if(lv===9){ a=9; b=r(3,8); } else if(lv===8){ a=8; b=r(3,7); } else if(lv===7){ a=r(6,7); b=r(11-a,9); }
     else if(lv==='turn'){ a=r(3,6); b=r(11-a,9); } else if(lv==='miss'){ a=r(7,9); b=r(12,16)-a; if(b<3||b>9) continue; } else { a=r(6,9); b=r(6,9); }
     if(a===b||a+b<11||a+b>18) continue; if(lv==='turn'&&b<=a) continue;
     if(t<200&&used.has(a+'+'+b)) continue; used.add(a+'+'+b); break; }
   const s=a+b, g=Math.max(a,b), sm=Math.min(a,b), c=10-g;
   const hints=[lv==='turn'?`אפשר להתחיל מהגדול: ${b} + ${a}. כמה חסר ל-${b} עד 10?`:`כמה חסר ל-${g} עד 10?`, `${c}. ו-${sm} זה ${c} ועוד כמה?`, `${g} + ${c} = 10, ועוד ${sm-c} = ${s}`];
   const vis=st=>tenFrame({a:g,b:sm,fill:st.helped||st.finished});
   if(lv==='miss'){ const W=prio(b,[[s,`${s} זה כמה יוצא ביחד. כמה מוסיפים ל-${a}?`],[10-a,`זה עד 10. ומ-10 עד ${s}?`],[s-10,`זה מ-10 עד ${s}. ומ-${a} עד 10?`]]);
     return {say:`כמה צריך להוסיף ל-${a} כדי להגיע ל-${s}?`, eq:[`${a} +`,{f:0},`= ${s}`], fields:[{ans:b,wrong:x=>wrongFrom(W,x)}], showVis:'hint', vis:st=>tenFrame({a,b:st.finished?b:0,fill:true}),
       hints:[`כמה חסר ל-${a} עד 10?`,`${10-a} עד 10, ומ-10 עד ${s} עוד ${s-10}.`,`${10-a} + ${s-10} = ${b}`], level:lv}; }
   const W=overWrongs(a,b);
   return {say:`כמה זה ${L(`${a} + ${b}`)}?`, eq:[`${a} + ${b} =`,{f:0}], fields:[{ans:s,wrong:x=>wrongFrom(W,x)}], showVis:'hint', vis, hints, level:lv}; },
 star(){ return {star:true, say:`⭐ שאלת אתגר: ${L('7 + 7 = 14')}. אז כמה זה ${L('7 + 8')}?`, eq:['7 + 8 =',{f:0}], fields:[{ans:15,wrong:x=>x===14?'8 זה אחד יותר מ-7.':x===16?'8 + 8 = 16, אבל רק אחד מהם 8.':null}], showVis:'never',
   hints:['8 זה 7 ועוד 1.','7 + 7 ועוד 1.','14 + 1 = 15']}; },
 parent:'כפולים וקרובים (7 + 8 = 7 + 7 + 1) הם דרך נוספת. אם היא מגלה אותה לבד, שבחי את הרעיון.'
};

/* ח2.1 tens and ones */
const twoDigit=(t,o)=>`<p class="decomp ltr"><span style="color:#D9980A">${t}</span><span style="color:#23895A">${o}</span></p>`;
const tensLine=(lo,hi,pts=[])=>{ const P=[]; for(let v=lo;v<=hi;v+=10) P.push({v}); return numberLine({min:lo-4,max:hi+4,points:[...P,...pts]}); };
function readWrongs(t,o){ const s=10*t+o; return prio(s,[[10*o+t,`הספרה הראשונה אומרת כמה מקלות: ${t}.`],[t+o,'כל מקל הוא 10, לא 1.'],[10*t,'ספרת את המקלות. ומה עם הנקודות?'],[s-10,'ספרי שוב את המקלות.'],[s+10,'ספרי שוב את המקלות.']]); }
function closerChoice(N,lo,hi){ const near=N-lo<hi-N?lo:hi; return [{text:String(lo),ok:near===lo},{text:String(hi),ok:near===hi}]; }
LESSONS['h2.1']={id:'ח2.1', title:'עשרות ואחדות', explain:[
  {say:'אורזות 10 נקודות יחד, והן נהיות מקל אחד. מקל = 10.', vis:()=>pairPic(baseTen({o:10,bundleO:true}),baseTen({t:1}),'⟵')},
  {say:'47: 4 מקלות ו-7 נקודות. הספרה 4 אומרת כמה מקלות, הספרה 7 כמה נקודות.', vis:()=>baseTen({t:4,o:7})+twoDigit(4,7)},
  {say:'4 מקלות ו-12 נקודות? 10 נקודות נארזות למקל, ונשארות 2. עכשיו 5 מקלות ו-2 נקודות: 52.', vis:()=>pairPic(baseTen({t:4,o:12,bundleO:true}),baseTen({t:5,o:2}),'⟵')+twoDigit(5,2)},
  {say:'על הציר 47 נמצא בין 40 ל-50, קרוב יותר ל-50.', vis:()=>tensLine(0,100,[{v:47,strong:1}])}
 ],
 together:[
  ()=>({say:'3 מקלות ו-15 נקודות.', eq:[], fields:[{q:'כמה נקודות נארזות למקל?',label:'נארזות',ans:10},{q:'כמה מקלות עכשיו?',label:'מקלות',ans:4,wrong:x=>x===3?'החבילה נהייתה מקל חדש. 3 ועוד 1?':null},{q:'כמה נקודות נשארו?',label:'נקודות',ans:5},{q:'איזה מספר?',label:'המספר',ans:45,wrong:x=>x===315?'יצא מספר של מאות. 15 נקודות: 10 מהן נארזות למקל.':x===35?'ארזת 10 נקודות. הוספת את המקל החדש?':null}],
    vis:st=>st.done>=2?baseTen({t:4,o:5}):baseTen({t:3,o:15,bundleO:st.done>=1})}),
  ()=>({say:'63.', eq:['63 =',{f:0},'+',{f:1}], fields:[{q:'כמה שוות 6 העשרות?',ans:60,wrong:x=>x===6?'6 מקלות, ובכל אחד 10. כמה זה?':null},{q:'ועוד כמה אחדות?',ans:3},{q:'63 נמצא בין 60 ל-?',label:'בין 60 ל-',ans:70},{q:'63 קרוב יותר ל-?',choice:closerChoice(63,60,70),wrongText:()=>'63 רחוק 3 מ-60, ו-7 מ-70.'}],
    vis:st=>st.done>=2?tensLine(50,80,st.done>=4?[{v:63,strong:1}]:[]):baseTen({t:6,o:3})})
 ],
 levels:['read','split','bundle','bundle2','line','line'],
 gen(lv,used){ let t,o; for(let k=0;;k++){
     if(lv==='read'||lv==='split'){ t=r(2,8); o=r(1,9); if(o===t) continue; }
     else if(lv==='line'){ t=r(1,8); o=pick([1,2,3,7,8,9]); }
     else { t=r(2,7); o=r(11,18); if(t+1===o-10) continue; }
     if(k<200&&used.has(lv[0]+t+'-'+o)) continue; used.add(lv[0]+t+'-'+o); break; }
   if(lv==='read'){ const W=readWrongs(t,o); return {say:'איזה מספר בתמונה?', eq:[{f:0}], fields:[{ans:10*t+o,wrong:x=>wrongFrom(W,x)}], showVis:'always', vis:()=>baseTen({t,o}),
     hints:['כמה מקלות? וכמה נקודות?',`${t} מקלות הם ${10*t}, ועוד ${o}.`,`${10*t} + ${o} = ${10*t+o}`], level:lv}; }
   if(lv==='split'){ const N=10*t+o; return {say:`פרקי את ${N} לעשרות ואחדות.`, eq:[`${N} =`,{f:0},'+',{f:1}], fields:[{ans:10*t,wrong:x=>x===t?`${t} מקלות, ובכל אחד 10. כמה זה?`:x===o?'קודם העשרות.':null},{ans:o}], showVis:'hint', vis:()=>baseTen({t,o}),
     hints:[`כמה מקלות יש ב-${N}?`,`${t} מקלות הם ${10*t}.`,`${N} = ${10*t} + ${o}`], level:lv}; }
   if(lv==='line'){ const N=10*t+o; return {say:`בין אילו עשרות נמצא ${N}?`, eq:[], fields:[{label:'בין',ans:10*t,wrong:x=>x===t?`${t} עשרות זה ${10*t}.`:null},{label:'ל-',ans:10*t+10},{q:`${N} קרוב יותר ל-?`,choice:closerChoice(N,10*t,10*t+10),wrongText:()=>`${N} רחוק ${o} מ-${10*t}, ו-${10-o} מ-${10*t+10}.`}],
     showVis:'always', vis:st=>tensLine(10*t-10,10*t+20,st.finished?[{v:N,strong:1}]:[]), hints:[`כמה עשרות יש ב-${N}?`,`${N} בין ${10*t} ל-${10*t+10}.`,`${o<5?'קרוב יותר להתחלה':'קרוב יותר לסוף'}.`], level:lv}; }
   const s=10*t+o, W=prio(s,[[+`${t}${o}`,`יצא מספר של מאות. ${o} נקודות: 10 מהן נארזות למקל.`],[s-10,'ארזת 10 נקודות. הוספת את המקל החדש?'],[10*o+t,'קודם המקלות.']]);
   return {say:`${t} עשרות ו-${o} אחדות. איזה מספר?`, eq:[{f:0}], fields:[{ans:s,wrong:x=>wrongFrom(W,x)}], showVis:lv==='bundle'?'always':'hint', vis:st=>baseTen({t,o,bundleO:st.helped||st.finished}),
     hints:['יש מספיק נקודות לחבילה?','10 נקודות נהיות מקל. כמה מקלות עכשיו, וכמה נקודות נשארו?',`${t+1} עשרות ו-${o-10} אחדות = ${s}`], level:lv}; },
 star(){ return {star:true, say:'⭐ שאלת אתגר: 3 עשרות ו-25 אחדות. איזה מספר?', eq:[{f:0}], fields:[{ans:55,wrong:x=>x===325?'25 נקודות: כמה חבילות אפשר לארוז?':x===45?'ב-25 יש שתי חבילות של 10.':null}], showVis:'hint', vis:()=>baseTen({t:3,o:25}),
   hints:['כמה חבילות של 10 יש ב-25?','שתי חבילות, ונשארות 5.','5 עשרות ו-5 אחדות.']}; },
 parent:'שחקו "בנק": 10 מטבעות של 1 מחליפים במטבע של 10. ככה רואים את האריזה.'
};

/* ח2.2 hundreds, tens and ones */
const hundredsLine=(lo,hi,pts=[])=>{ const P=[]; for(let v=lo;v<=hi;v+=50) P.push({v,strong:v%100===0}); return numberLine({min:lo-8,max:hi+8,points:[...P,...pts]}); };
LESSONS['h2.2']={id:'ח2.2', title:'מאות, עשרות, אחדות', explain:[
  {say:'אורזות 10 מקלות יחד, והם נהיים ריבוע של מאה. 10 עשרות = 100.', vis:()=>pairPic(baseTen({t:10,bundleT:true}),baseTen({h:1}),'⟵')},
  {say:'13 מקלות: 10 נארזים למאה, ונשארים 3. מאה ו-3 עשרות: 130.', vis:()=>baseTen({t:13,bundleT:true})+big('130')},
  {say:'305: 3 ריבועים, אין מקלות, 5 נקודות. ה-0 שומר את המקום של העשרות. בלי ה-0 זה היה 35.', vis:()=>baseTen({h:3,o:5})+`<p class="decomp ltr">3<span style="color:var(--accent);background:color-mix(in srgb,var(--accent) 15%,transparent);border-radius:6px;padding:0 4px">0</span>5</p>`},
  {say:'573 נמצא בין 500 ל-600. 73 זה יותר מחצי הדרך (550), אז הוא קרוב יותר ל-600.', vis:()=>hundredsLine(500,600,[{v:573,strong:1}])}
 ],
 together:[
  ()=>({say:'14 מקלות.', eq:[], fields:[{q:'כמה נארזים למאה?',label:'נארזים',ans:10},{q:'כמה מקלות נשארו?',label:'מקלות',ans:4},{q:'איזה מספר?',label:'המספר',ans:140,wrong:x=>x===104?'נשארו 4 מקלות, לא 4 נקודות.':x===14?'14 זה כמה מקלות. כל מקל הוא 10.':null}],
    vis:st=>st.done>=2?baseTen({h:1,t:4}):baseTen({t:14,bundleT:st.done>=1})}),
  ()=>({say:'איזה מספר בתמונה?', eq:[], fields:[{q:'כמה ריבועים?',label:'ריבועים',ans:4},{q:'כמה מקלות?',label:'מקלות',ans:0},{q:'כמה נקודות?',label:'נקודות',ans:8},{q:'איזה מספר?',label:'המספר',ans:408,wrong:x=>x===48?'אין מקלות, אבל המקום שלהם נשאר. כותבות 0.':null}],
    vis:()=>baseTen({h:4,o:8})})
 ],
 levels:['read3','tens','zeroRead','zeroDigit','between','between'],
 gen(lv,used){ let h,t,o,N; for(let k=0;;k++){
     h=r(1,8); t=r(1,9); o=r(1,9); N=r(11,19);
     if(lv==='read3'&&(h===t||t===o||h===o)) continue;
     if((lv==='zeroRead'||lv==='zeroDigit')&&o===h) continue;
     if(lv==='between'&&![1,2,3,7,8,9].includes(t)) continue;
     const key=lv+(lv==='tens'?N:`${h}${t}${o}`); if(k<200&&used.has(key)) continue; used.add(key); break; }
   if(lv==='read3'){ const s=100*h+10*t+o, W=prio(s,[[100*o+10*t+h,'קודם הריבועים: הם המאות.'],[h+t+o,'כל ריבוע הוא 100 וכל מקל 10.'],[s-100,'ספרי שוב את הריבועים.'],[s+100,'ספרי שוב את הריבועים.'],[s-10,'ספרי שוב את המקלות.'],[s+10,'ספרי שוב את המקלות.']]);
     return {say:'איזה מספר בתמונה?', eq:[{f:0}], fields:[{ans:s,wrong:x=>wrongFrom(W,x)}], showVis:'always', vis:()=>baseTen({h,t,o}), hints:['כמה ריבועים, כמה מקלות, כמה נקודות?',`${h} מאות, ${t} עשרות, ${o} אחדות.`,`${100*h} + ${10*t} + ${o} = ${s}`], level:lv}; }
   if(lv==='tens'){ const s=10*N, W=prio(s,[[N,`${N} זה כמה מקלות. כל מקל הוא 10.`],[90+N,`נשארו ${N-10} מקלות, לא נקודות.`],[100*N,'אלה מקלות, לא ריבועים.']]);
     return {say:`${N} עשרות. איזה מספר?`, eq:[{f:0}], fields:[{ans:s,wrong:x=>wrongFrom(W,x)}], showVis:'always', vis:st=>baseTen({t:N,bundleT:st.helped||st.finished}), hints:['10 מקלות נארזים למאה.',`מאה, ועוד ${N-10} מקלות.`,`100 + ${10*(N-10)} = ${s}`], level:lv}; }
   if(lv==='zeroRead'){ const s=100*h+o, W=prio(s,[[10*h+o,'אין מקלות, אבל המקום שלהם נשאר. כותבות 0.'],[100*h+10*o,'הנקודות הן אחדות. איפה כותבים אחדות?']]);
     return {say:'איזה מספר בתמונה?', eq:[{f:0}], fields:[{ans:s,wrong:x=>wrongFrom(W,x)}], showVis:'always', vis:()=>baseTen({h,o}), hints:['כמה ריבועים? כמה מקלות? כמה נקודות?','אין מקלות: במקום העשרות כותבות 0.',`${h}0${o}`], level:lv}; }
   if(lv==='zeroDigit'){ const s=100*h+o;
     return {say:`כדי לבנות את ${s} צריך:`, eq:[], fields:[{label:'ריבועים',ans:h},{label:'מקלות',ans:0,wrong:x=>x===10*h?{soft:1,text:`נכון, ב-${s} יש ${10*h} עשרות בסך הכול! כאן שואלות כמה מקלות בודדים, מחוץ לריבועים.`}:x===o?'הספרה האמצעית היא המקלות.':null},{label:'נקודות',ans:o}],
       showVis:'hint', vis:()=>baseTen({h,o}), hints:[`הספרה הראשונה ב-${s} היא הריבועים.`,'הספרה האמצעית היא 0: אין מקלות.',`${h} ריבועים, 0 מקלות, ${o} נקודות.`], level:lv}; }
   const s=100*h+10*t+o;
   return {say:`בין אילו מאות נמצא ${s}?`, eq:[], fields:[{label:'בין',ans:100*h,wrong:x=>x===h?`${h} מאות זה ${100*h}.`:x===s-o?'זו העשרת. כאן מחפשות מאות.':null},{label:'ל-',ans:100*h+100},{q:`${s} קרוב יותר ל-?`,choice:closerChoice(s,100*h,100*h+100),wrongText:()=>`האמצע הוא ${100*h+50}. ${s} ${t>=5?'אחרי':'לפני'} האמצע.`}],
     showVis:'always', vis:st=>hundredsLine(100*h-50,100*h+150,st.finished?[{v:s,strong:1}]:[]), hints:[`כמה מאות יש ב-${s}?`,`${s} בין ${100*h} ל-${100*h+100}.`,`האמצע הוא ${100*h+50}.`], level:lv}; },
 star(){ return {star:true, say:'⭐ שאלת אתגר: כמה עשרות יש בסך הכול ב-573?', eq:[{f:0}], fields:[{ans:57,wrong:x=>x===7?'7 זה המקלות הבודדים. כל ריבוע הוא גם 10 מקלות.':x===50?'5 מאות = 50 עשרות. ועוד?':null}], showVis:'hint',
   vis:()=>baseTen({h:5,t:7,o:3}), hints:['כל ריבוע הוא 10 מקלות.','5 ריבועים הם 50 מקלות. ועוד 7.','50 + 7 = 57']}; },
 parent:'מספרים עם 0 באמצע (305, 408) הם המקום שבו הכי הרבה ילדים מתבלבלים. אם יש טעות, בנו את המספר יחד מחפצים.'
};

/* ח3.1 whole tens */
LESSONS['h3.1']={id:'ח3.1', title:'עשרות שלמות', explain:[
  {say:'40 + 30: 4 מקלות ועוד 3 מקלות זה 7 מקלות. 7 עשרות זה 70.', vis:()=>pairPic(baseTen({t:4}),baseTen({t:3}))+big('40 + 30 = 70')},
  {say:'4 + 3 = 7, ולכן 4 עשרות + 3 עשרות = 7 עשרות. אותו חשבון, רק עם עשרות.', vis:()=>big('4 + 3 = 7')+big('40 + 30 = 70')},
  {say:'70 + 50: ל-70 חסרות 3 עשרות עד 100. לוקחות 3 מקלות מה-50, ונשארים 2. 100 ועוד 20 = 120. בדיוק כמו 7 + 5.', vis:()=>baseTen({t:12,bundleT:true})+big('70 + 50 = 100 + 20 = 120')},
  {say:'47 + 30: מוסיפות רק מקלות. הנקודות לא זזות: 77.', vis:()=>pairPic(baseTen({t:4,o:7}),baseTen({t:7,o:7}),'⟵')+big('47 + 30 = 77')}
 ],
 together:[
  ()=>({say:`${L('60 + 70')}: קודם עד 100.`, eq:['60 + 70 =',{sum:130}], fields:[{q:'כמה חסר ל-60 עד 100?',label:'60 → 100',ans:40,wrong:x=>x===4?'4 עשרות זה 40.':null},{q:'70 זה 40 ועוד כמה?',label:'70 = 40 +',ans:30},{q:'100 + 30 = ?',label:'100 + 30 =',ans:130}],
    vis:st=>numberLine({min:50,max:140,points:[{v:60,strong:1},...(st.done>=3?[{v:130,strong:1}]:[])],station:100,arcs:[...(st.done>=1?[{from:60,to:100,label:'+40'}]:[]),...(st.done>=2?[{from:100,to:130,label:'+30',color:COL.arc2,pending:st.done<3}]:[])]})}),
  ()=>({say:`${L('38 + 40')}: מוסיפות עשרות.`, eq:['38 + 40 =',{f:1}], fields:[{q:'3 עשרות ועוד 4 עשרות = כמה עשרות?',label:'3 + 4 =',ans:7},{q:'האחדות של 38 לא זזות. 38 + 40 = ?',ans:78,wrong:x=>x===70?'ומה עם ה-8 אחדות?':x===42?'הוספת 4 אחדות. 40 זה 4 עשרות.':null}],
    vis:()=>pairPic(baseTen({t:3,o:8}),baseTen({t:4}))})
 ],
 levels:[1,'f100',2,2,3,4],
 gen(lv,used){ let a,b,A,B; for(let k=0;;k++){
     if(lv===1){ A=r(2,7); B=r(2,7); if(A===B||A+B>9) continue; a=10*A; b=10*B; }
     else if(lv==='f100'){ A=r(1,9); if(A===5) continue; a=10*A; b=100-a; }
     else if(lv===2){ A=r(3,9); B=r(3,9); if(A===B||A+B<11||A+B>17) continue; a=10*A; b=10*B; }
     else if(lv===3){ a=r(21,69); B=r(2,5); const D=digits(a); if(!D.o||D.t+B>9||B===D.t) continue; b=10*B; }
     else { a=r(52,89); B=r(3,7); const D=digits(a); if(!D.o||D.t+B<11||D.t+B>16||B===D.t) continue; b=10*B; }
     if(k<200&&used.has(a+'+'+b)) continue; used.add(a+'+'+b); break; }
   const s=a+b;
   if(lv==='f100'){ const W=prio(b,[[10-A,`${10-A} עשרות זה ${b}.`],[100+a,'כאן מחפשות כמה חסר עד 100.']]);
     return {say:`כמה חסר ל-${a} עד 100?`, eq:[`${a} +`,{f:0},'= 100'], fields:[{ans:b,wrong:x=>wrongFrom(W,x)}], showVis:'hint', vis:st=>numberLine({min:a-10,max:104,points:[{v:a,strong:1}],station:100,arcs:[{from:a,to:100,label:st.finished?'+'+b:'+?',pending:!st.finished}]}),
       hints:['חברים של 10, רק עם עשרות.',`${A} ועוד ${10-A} זה 10. אז ${a} ועוד?`,`${a} + ${b} = 100`], level:lv}; }
   if(lv===1||lv===2){ A=a/10; B=b/10; const W=prio(s,[[A+B,`${A+B} זה כמה עשרות. כמה זה ${A+B} עשרות?`],[100*(A+B),`${A+B} עשרות, לא ${A+B} מאות.`],[s>100?s-100:null,'עברנו את 100! 10 עשרות נארזו למאה.'],[s-10,'ספרי שוב את המקלות.'],[s+10,'ספרי שוב את המקלות.']]);
     const c=100-a;
     return {say:`כמה זה ${L(`${a} + ${b}`)}?`, eq:[`${a} + ${b} =`,{f:0}], fields:[{ans:s,wrong:x=>wrongFrom(W,x)}], showVis:lv===1?'always':'hint',
       vis:st=>lv===1?pairPic(baseTen({t:A}),baseTen({t:B})):numberLine({min:a-10,max:s+10,points:[{v:a,strong:1},...(st.finished?[{v:s,strong:1}]:[])],station:100,arcs:[{from:a,to:100,label:'+'+c},{from:100,to:s,label:'+'+(s-100),color:COL.arc2,pending:!st.finished}]}),
       hints: lv===1?[`${A} + ${B} = ?`,`${A} מקלות ועוד ${B} מקלות זה ${A+B} מקלות. כמה זה?`,`${A+B} עשרות = ${s}`]:[`כמה חסר ל-${a} עד 100?`,`${c}. ו-${b} זה ${c} ועוד כמה?`,`100 + ${s-100} = ${s}`], level:lv}; }
   const D=digits(a), W=prio(s,[[a+B,`הוספת ${B} אחדות. ${b} זה ${B} עשרות.`],[10*(D.t+B),`ומה עם ה-${D.o} אחדות?`],[s>=100?s-100:null,'עברנו את 100!'],[s-10,'ספרי שוב את הקפיצות של 10.'],[s+10,'ספרי שוב את הקפיצות של 10.']]);
   return {say:`כמה זה ${L(`${a} + ${b}`)}?`, eq:[`${a} + ${b} =`,{f:0}], fields:[{ans:s,wrong:x=>wrongFrom(W,x)||unitsMsg(x,s,`כשמוסיפות עשרות, האחדות לא זזות. התשובה נגמרת ב-${D.o}.`)}], showVis:'hint',
     vis:st=>numberLine({min:a-6,max:s+6,points:[{v:a,strong:1},...(st.finished?[{v:s,strong:1}]:[])],arcs:Array(B).fill(0).map((_,i)=>({from:a+10*i,to:a+10*i+10,label:i===B-1?'+10':'',pending:!st.finished}))}),
     hints:[`כמה עשרות ב-${b}?`,`קפצי מ-${a} ${B} קפיצות של 10.`,`${Array(B+1).fill(0).map((_,i)=>a+10*i).join(' ← ')}`], level:lv}; },
 star(){ return {star:true, say:'⭐ שאלת אתגר: חברים של 100.', eq:['80 + 70 + 20 + 30 =',{f:0}], fields:[{ans:200,wrong:x=>x===100?'מצאת זוג אחד. יש עוד?':(x===190||x===210)?'בדקי את הזוגות.':null}], showVis:'never',
   hints:['חפשי שני מספרים שביחד 100.','80 ו-20, 70 ו-30.','100 + 100 = 200']}; },
 parent:'אם 40 + 30 קל לה, שאלי "ו-400 + 300?" זה אותו רעיון.'
};

/* ח3.2 place by place, two-digit */
function pvWrongs(a,b){ const A=digits(a), B=digits(b), T=10*(A.t+B.t), U=A.o+B.o, s=a+b, oc=U>=10;
  return prio(s,[[oc?s-10:null,`ה-10 שבתוך ${U} נשאר בחוץ. ${T} + ${U} = ?`],[oc?+`${T/10}${U}`:null,`יצא מספר של מאות! ${T} ועוד ${U} זה פחות מ-100.`],[A.t+B.t+A.o+B.o,`חיברת את כל הספרות כאילו הן אחדות. ה-${A.t} ב-${a} הוא ${10*A.t}.`],[oc?null:s-10,'בדקי שוב את העשרות.'],[oc?null:s+10,'בדקי שוב את העשרות.']]); }
LESSONS['h3.2']={id:'ח3.2', title:'מקום אחרי מקום', explain:[
  {say:'34 + 25. מפרקות: 30 ו-4, 20 ו-5.', vis:()=>pairPic(baseTen({t:3,o:4}),baseTen({t:2,o:5}))+big('34 = 30 + 4 &nbsp;&nbsp; 25 = 20 + 5')},
  {say:'עשרות עם עשרות: 30 + 20 = 50. אחדות עם אחדות: 4 + 5 = 9. 50 ועוד 9 = 59.', vis:()=>baseTen({t:5,o:9})+big('50 + 9 = 59')},
  {say:'46 + 38: עשרות 70, אחדות 6 + 8 = 14. 14 נקודות זה מספיק לחבילה!', vis:()=>baseTen({t:7,o:14,bundleO:true})+big('70 + 14')},
  {say:'70 + 14 = 84. בדיקה: בערך 50 + 40 = 90, אז 84 הגיוני. 6 + 8 נגמר ב-4, וגם 84.', vis:()=>baseTen({t:8,o:4})+`<p class="decomp ltr">70 + 14 = 8<span class="hl">4</span></p>`}
 ],
 together:[
  ()=>({say:`${L('43 + 25')}: מקום אחרי מקום.`, eq:['43 + 25 =',{sum:68}], fields:[{q:'40 + 20 = ?',label:'40 + 20 =',ans:60,wrong:x=>x===6?'4 עשרות ועוד 2 עשרות זה 6 עשרות. כמה זה?':null},{q:'3 + 5 = ?',label:'3 + 5 =',ans:8},{q:'60 + 8 = ?',label:'60 + 8 =',ans:68}],
    vis:()=>pairPic(baseTen({t:4,o:3}),baseTen({t:2,o:5}))}),
  ()=>({say:`${L('37 + 45')}: קודם בערך.`, eq:['37 + 45 =',{sum:82}], fields:[{q:'בערך כמה יצא?',choice:[{text:'60'},{text:'80',ok:1},{text:'100'}],wrongText:()=>'37 זה בערך 40, ו-45 בערך 40-50. ביחד?'},{q:'30 + 40 = ?',label:'30 + 40 =',ans:70},{q:'7 + 5 = ?',label:'7 + 5 =',ans:12},{q:'70 + 12 = ?',label:'70 + 12 =',ans:82,wrong:x=>x===72?'ה-10 שבתוך 12 נשכח.':x===712?'70 ועוד 12 זה פחות מ-100.':null}],
    vis:st=>st.done>=3?baseTen({t:7,o:12,bundleO:true}):pairPic(baseTen({t:3,o:7}),baseTen({t:4,o:5}))})
 ],
 levels:['1b','1','2b','3','4','5'],
 gen(lv,used){ let a,b; for(let k=0;;k++){ a=r(12,79); b=r(12,79); const A=digits(a), B=digits(b), U=A.o+B.o;
     if(!A.o||!B.o||A.t===B.t||A.o===B.o||a+b>99) continue;
     if((lv==='1b'||lv==='1')&&U>9) continue; if(lv==='2b'&&(U<11||U>13)) continue; if(lv==='3'&&(U<14||U>17)) continue; if(lv==='4'&&U!==10) continue;
     if(lv==='5'&&(U<11||U>17||a+b<81)) continue;
     if(k<300&&(used.has(a+'+'+b)||!distinct(a+b,pvWrongs(a,b).map(w=>w[0])))) continue; used.add(a+'+'+b); break; }
   const A=digits(a), B=digits(b), T=10*(A.t+B.t), U=A.o+B.o, s=a+b, W=pvWrongs(a,b);
   const wr=x=>wrongFrom(W,x)||unitsMsg(x,s,`${A.o} + ${B.o} נגמר ב-${s%10}. גם התשובה צריכה.`);
   const vis=st=>st.finished||st.helped?baseTen({t:T/10,o:U,bundleO:U>=10}):pairPic(baseTen({t:A.t,o:A.o}),baseTen({t:B.t,o:B.o}));
   const hints=[`פרקי: ${a} = ${10*A.t} + ${A.o}, ${b} = ${10*B.t} + ${B.o}. כמה עשרות ביחד?`,`עשרות: ${T}. אחדות: ${A.o} + ${B.o} = ?`,`${T} + ${U} = ${s}`];
   if(lv.endsWith('b')) return {say:`${L(`${a} + ${b}`)}: מקום אחרי מקום.`, eq:[`${a} + ${b} =`,{sum:s}],
     fields:[{q:'כמה העשרות ביחד?',label:`${10*A.t} + ${10*B.t} =`,ans:T,wrong:x=>x===A.t+B.t?`${A.t} עשרות ועוד ${B.t} עשרות זה ${A.t+B.t} עשרות. כמה זה?`:null},{q:'כמה האחדות ביחד?',label:`${A.o} + ${B.o} =`,ans:U},{q:'וביחד?',label:`${T} + ${U} =`,ans:s,wrong:wr}],
     showVis:'always', vis, hints, level:lv};
   return {say:`כמה זה ${L(`${a} + ${b}`)}?`, eq:[`${a} + ${b} =`,{f:0}], fields:[{ans:s,wrong:wr}], showVis:'hint', vis, hints, level:lv}; },
 star(){ return {star:true, say:'⭐ שאלת אתגר: כמה זה?', eq:['68 + 57 =',{f:0}], fields:[{ans:125,wrong:x=>x===115?'ה-10 שבתוך 15 נשכח.':x===1115?'110 + 15: יצא מספר ארוך מדי.':x===25?'60 + 50 עובר את 100.':null}], showVis:'hint',
   vis:()=>baseTen({t:11,o:15,bundleT:true,bundleO:true}), hints:['60 + 50 = ?','110. ו-8 + 7 = 15.','110 + 15 = 125']}; },
 parent:'שאלי לפני החישוב: "בערך כמה ייצא?" ההערכה עוזרת לתפוס טעויות כמו 712.'
};

/* ח4.4 the almost-round number: move from one number to the other */
function nearParts(a,b){ // x = the almost-round number, y = the other one, c = what x needs to be round
  const near=n=>{ const o=n%10, t2=n%100; if(t2>=97) return 100-t2; if(o===9) return 1; if(o===8&&t2>=90) return 2; return null; };
  const ca=near(a), cb=near(b); const useA = ca!=null && (cb==null || ca<=cb);
  const x=useA?a:b, y=useA?b:a, c=useA?ca:cb; return {x,y,c,R:x+c,s:a+b}; }
function nearWrongs(a,b){ const {x,y,c,R,s}=nearParts(a,b);
  return prio(s,[[R+y,`את ה-${c} לקחנו מ-${y}. נשארו ${y-c}.`],[x+y-c,`${y} נתן ${c}, אבל ${x} עוד לא קיבל אותם. ${R} + ${y-c}.`],[R+y+c,`הפוך: ${y} נותן, אז הוא קטן ב-${c}.`],[s+100,`בדקי את המאות: בערך ${R} + ${y}.`],[s-100,`בדקי את המאות: בערך ${R} + ${y}.`]]); }
LESSONS['h4.4']={id:'ח4.4', title:'מספר כמעט עגול', explain:[
  {say:'זוכרת את 9 + 6? העברנו נקודה אחת והיה 10 + 5. אף נקודה לא נעלמה.', vis:()=>pairPic(tenFrame({a:9,b:6}),tenFrame({a:9,b:6,fill:true}),'⟵')+big('9 + 6 = 10 + 5')},
  {say:'597 + 346: ל-597 חסרים 3 עד 600. לוקחות 3 מ-346.', vis:()=>numberLine({min:590,max:606,points:[{v:597,strong:1}],station:600,arcs:[{from:597,to:600,label:'+3'}]})+decomp(346,3,343)},
  {say:'עכשיו 600 + 343 = 943. קל!', vis:()=>big('597 + 346 = 600 + 343 = 943')+`<p class="legend ltr" style="justify-content:center">597 <b style="color:var(--accent)">+3</b> &nbsp;·&nbsp; 346 <b style="color:#D9980A">−3</b></p>`},
  {say:'מתי? כשמספר נגמר ב-9, ב-98 או ב-99: הוא כמעט עגול.', vis:()=>`<p class="decomp ltr"><span class="hl">49</span> · <span class="hl">198</span> · <span class="hl">597</span> · <span style="opacity:.4">573</span></p>`}
 ],
 together:[[39,25,40],[298,145,300]].map(([a,b,R])=>()=>{ const c=R-a, W=nearWrongs(a,b);
   return {say:`${L(`${a} + ${b}`)}: ${a} כמעט עגול.`, eq:[`${a} + ${b} =`,{sum:a+b}],
    fields:[{q:`כמה חסר ל-${a} עד ${R}?`,label:`${a} → ${R}`,ans:c},{q:`${b} זה ${c} ועוד כמה?`,label:`${b} = ${c} +`,ans:b-c},{q:`${R} + ${b-c} = ?`,label:`${R} + ${b-c} =`,ans:a+b,wrong:x=>x===a+b+c?`את ה-${c} כבר העברנו.`:wrongFrom(W,x)}],
    vis:st=>numberLine({min:a-4,max:R+4,points:[{v:a,strong:1}],station:R,arcs:st.done>=1?[{from:a,to:R,label:'+'+c}]:[]})+(st.done>=2?decomp(b,c,b-c):'')}; }),
 levels:['2d','99','98','near','swap','ten'],
 gen(lv,used){ let a,b; const three=()=>{ for(;;){ const v=r(111,699); if(nd(v)) return v; } };
   for(let k=0;;k++){
     if(lv==='2d'){ a=10*r(1,7)+9; b=r(12,59); const B=digits(b); if(B.o<2||B.t===Math.floor(a/10)%10||a+b>99) continue; }
     else if(lv==='99'){ a=100*r(1,6)+99; b=three(); }
     else if(lv==='98'){ a=100*r(1,6)+98; b=three(); }
     else if(lv==='near'){ a=100*r(1,6)+r(97,99); b=three(); }
     else if(lv==='swap'){ a=three(); b=100*r(1,6)+r(97,99); }
     else { a=100*r(1,6)+10*r(1,8)+9; b=three(); }
     if(a+b>999) continue; const P=nearParts(a,b); if(P.c==null) continue;
     if(P.y%10<=P.c) continue; // no borrowing: the ones of the other number are bigger than what is moved
     if(lv!=='2d'&&Math.floor(a/100)===Math.floor(b/100)) continue;
     if(k<300&&used.has(a+'+'+b)) continue; used.add(a+'+'+b); break; }
   const {x,y,c,R,s}=nearParts(a,b), W=nearWrongs(a,b), wr=x2=>wrongFrom(W,x2)||unitsMsg(x2,s,`${a%10} + ${b%10} נגמר ב-${s%10}.`);
   const hints=['איזה מספר כמעט עגול? כמה חסר לו?',`לוקחות ${c} מ-${y}: ${y} = ${c} + ${y-c}.`,`${R} + ${y-c} = ${s}`];
   const vis=st=>numberLine({min:x-Math.max(3,c*2),max:R+Math.max(3,c*2),points:[{v:x,strong:1}],station:R,arcs:[{from:x,to:R,label:'+'+c}]})+decomp(y,c,y-c);
   if(['2d','99','98'].includes(lv)) return {say:`${L(`${a} + ${b}`)}: מעבירות.`, eq:[`${a} + ${b} =`,{f:2}],
     fields:[{q:'לאיזה מספר עגול משלימות?',label:`${x} משלים ל-`,ans:R,wrong:x2=>x2===x+10?`חסרים רק ${c}.`:null},{q:`כמה נשאר מ-${y}?`,label:`נשאר מ-${y}`,ans:y-c,wrong:x2=>x2===y+c?`${y} נותן ${c}, אז הוא קטן.`:null},{q:'וכמה ביחד?',ans:s,wrong:wr}],
     showVis:'hint', vis, hints, level:lv};
   return {say:`כמה זה ${L(`${a} + ${b}`)}?`, eq:[`${a} + ${b} =`,{f:0}], fields:[{ans:s,wrong:wr}], showVis:'hint', vis, hints, level:lv}; },
 star(){ return {star:true, say:`⭐ שאלת אתגר: ${L('573 + 298')}. מוסיפות 300 ומתקנות.`, eq:['573 + 298 =',{f:0}], fields:[{ans:871,wrong:x=>x===873?'הוספנו 300 במקום 298. כמה יותר מדי?':x===875?'הוספנו 2 יותר מדי, אז מורידות 2.':null}], showVis:'hint',
   vis:()=>numberLine({min:560,max:880,points:[{v:573,strong:1},{v:873}],arcs:[{from:573,to:873,label:'+300'}]}), hints:['573 + 300 = ?','873. אבל הוספנו 300 ולא 298.','873 − 2 = 871']}; },
 parent:'"אף נקודה לא נעלמה": אם היא מתבלבלת לאן להוסיף ומאיפה להוריד, חזרו למסגרת העשר.'
};

/* ח4.5 which way fits here? */
const METHODS=[{key:'col',text:'עמודות',sub:'מאות, עשרות, אחדות'},{key:'jump',text:'קפיצות',sub:'קודם מאות, אחר כך עשרות'},{key:'comp',text:'השלמה',sub:'קודם עד המאה'},{key:'near',text:'כמעט עגול',sub:'מעבירות ממספר למספר'}];
const FIT={col:{col:'fit',jump:'also',comp:'soft',near:'soft'}, clean:{col:'also',jump:'fit',comp:'soft',near:'soft'}, comp:{col:'also',jump:'also',comp:'fit',near:'also'}, almost:{col:'also',jump:'also',comp:'fit',near:'fit'}};
function methodHints(key,a,b){ const s=a+b, A=digits(a), B=digits(b), up=(Math.floor(a/100)+1)*100;
  if(key==='col') return ['מאות, עשרות, אחדות.',`מאות: ${100*(A.h+B.h)}. עשרות: ${10*(A.t+B.t)}. אחדות: ${A.o+B.o}.`,`${100*(A.h+B.h)} + ${10*(A.t+B.t)} + ${A.o+B.o} = ${s}`];
  if(key==='jump'){ const parts=[100*B.h,10*B.t,B.o].filter(v=>v); return [`משאירות את ${a} שלם, ומפרקות את ${b}: ${parts.join(' + ')}.`,`קפצי קודם ${parts[0]} מ-${a}: ${a+parts[0]}.`,parts.reduce((acc,p)=>{ const last=acc.at(-1); acc.push(last+p); return acc; },[a]).join(' ← ')]; }
  const P=nearParts(a,b);
  if(key==='near'&&P.c!=null) return ['איזה מספר כמעט עגול? כמה חסר לו?',`לוקחות ${P.c} מ-${P.y}.`,`${P.R} + ${P.y-P.c} = ${s}`];
  const c=up-a; if(b>c) return [`כמה חסר ל-${a} עד ${up}?`,`${c}. כמה נשאר מ-${b}?`,`${up} + ${b-c} = ${s}`];
  return methodHints('col',a,b); }
function methodField(type,a,b,reason,answer){ return {q:'באיזו דרך תפתרי?', choice:METHODS.map(m=>{ const f=FIT[type][m.key];
  return {text:m.text,sub:m.sub,key:m.key, ok:f!=='soft', note:f==='fit'?`בחירה טובה! ${reason}`:f==='also'?'גם זו דרך טובה.':null,
    soft:f==='soft'?'איזה מספר כאן קרוב למאה? אם מצאת, אפשר. אם לא, אולי דרך אחרת?':null}; }),
  then:key=>({fields:[answer], hints:methodHints(key,a,b)})}; }
function wayWrongs(type,a,b,x){ const s=a+b;
  const list = type==='clean'?jumpsWrongs(a,b) : type==='comp'?completeWrongs(a,b) : type==='almost'?nearWrongs(a,b) : prio(s,[[s-100,'בדקי את המאות.'],[s+100,'בדקי את המאות.'],[s-10,'בדקי את העשרות.'],[s+10,'בדקי את העשרות.']]);
  return wrongFrom(list,x)||(x>999?'יצא מספר ארוך מדי. בדקי את המאות.':null)||unitsMsg(x,s,`${a%10} + ${b%10} נגמר ב-${s%10}.`); }
let lastWay=null;
LESSONS['h4.5']={id:'ח4.5', title:'איזו דרך מתאימה כאן?', explain:[
  {say:'את מכירה כבר ארבע דרכים.', vis:()=>`<div class="cards">${METHODS.map((m,i)=>`<div class="cardbtn" style="cursor:default">${m.text}<small class="ltr">${['432 + 251 = 600 + 80 + 3','573 + 300 → 873','573 + 27 → 600','597 + 346 = 600 + 343'][i]}</small></div>`).join('')}</div>`},
  {say:'לפני שמחשבות, מסתכלות על המספרים. יש מספר עגול? קפיצות.', vis:()=>`<p class="decomp ltr">384 + <span class="hl">300</span></p>`},
  {say:'יש מספר קרוב למאה? השלמה, או כמעט עגול.', vis:()=>`<p class="decomp ltr"><span class="hl">468</span> + 35 &nbsp;·&nbsp; 437 + <span class="hl">298</span></p>`},
  {say:'אין משהו מיוחד? עמודות תמיד עובדות. אין דרך אחת נכונה, בוחרות מה שנוח לך.', vis:()=>big('432 + 251')}
 ],
 together:[
  ()=>({say:`${L('384 + 300')}: קודם מסתכלות.`, eq:['384 + 300 =',{f:2}], fields:[{q:'מה את רואה?',choice:[{text:'300 הוא מספר עגול',ok:1},{text:'384 כמעט 400'}],wrongText:()=>'384 רחוק 16 מ-400. זה לא כל כך קרוב.'},...(f=>[methodField('clean',384,300,'300 עגול, אז קופצות מהר.',f),f])({ans:684,wrong:x=>wayWrongs('clean',384,300,x)})],
    hints:p=>methodHints(p[1]||'jump',384,300)}),
  ()=>({say:`${L('437 + 298')}: קודם מסתכלות.`, eq:['437 + 298 =',{f:2}], fields:[{q:'מה את רואה?',choice:[{text:'298 כמעט 300',ok:1},{text:'אין כאן מספר קרוב לעגול'}],wrongText:()=>'בדקי את 298: כמה חסר לו עד 300?'},...(f=>[methodField('almost',437,298,'298 קרוב ל-300.',f),f])({ans:735,wrong:x=>wayWrongs('almost',437,298,x)})],
    hints:p=>methodHints(p[1]||'near',437,298)})
 ],
 levels:['clean','comp','col','almost','mix','mix'],
 gen(lv,used){ let type=lv; if(lv==='mix'){ type=pick(['col','clean','comp','almost'].filter(t=>t!==lastWay)); } lastWay=type;
   let a,b; for(let k=0;;k++){
     if(type==='col'){ a=r(111,688); b=r(111,688); const A=digits(a), B=digits(b); if(!nd(a)||!nd(b)||A.o+B.o>9||A.t+B.t>9||A.h+B.h>9||A.h===B.h||A.t===B.t||A.o===B.o||a%100>60||b%100>60) continue; }
     else if(type==='clean'){ a=r(111,699); b=100*r(1,4)+10*r(0,8); if(!nd(a)||a%100>60||a+b>999) continue; }
     else if(type==='comp'){ a=100*r(1,8)+r(71,95); if(!(a%10)) continue; const c=(Math.floor(a/100)+1)*100-a; b=r(c+2,Math.min(99,c+40)); if(!(b%10)) continue; }
     else { const x=100*r(1,6)+r(97,99), y=r(111,699); if(!nd(y)||y%10<=100-x%100||Math.floor(x/100)===Math.floor(y/100)) continue; [a,b]=Math.random()<.5?[x,y]:[y,x]; }
     if(a+b>999) continue; if(k<300&&used.has(a+'+'+b)) continue; used.add(a+'+'+b); break; }
   const s=a+b, reason={col:'אין כאן מעבר, אז העמודות קלות.',clean:`${b} עגול, אז קופצות מהר.`,comp:`${a} קרוב ל-${(Math.floor(a/100)+1)*100}.`,almost:`${Math.max(a%100,b%100)>=97?(a%100>=97?a:b):a} כמעט עגול.`}[type];
   return {say:`${L(`${a} + ${b}`)}: באיזו דרך?`, eq:[`${a} + ${b} =`,{f:1}], fields:(f=>[methodField(type,a,b,reason,f),f])({ans:s,wrong:x=>wayWrongs(type,a,b,x)}), showVis:'never',
     hints:p=>p[0]?methodHints(p[0],a,b):['יש כאן מספר עגול? מספר קרוב למאה? אם לא, עמודות תמיד עובדות.','הסתכלי על כל מספר: במה הוא נגמר?','בחרי דרך, ואז פתרי.'], level:type}; },
 star(){ return {star:true, say:`⭐ שאלת אתגר: ${L('250 + 260')}. רמז: זה כמעט כפול.`, eq:['250 + 260 =',{f:0}], fields:[{ans:510,wrong:x=>x===500?'זה 250 + 250. ו-260 גדול ב-10.':x===520?'זה 260 + 260.':null}], showVis:'never',
   hints:['250 + 250 = ?','500. ו-260 זה 250 ועוד 10.','500 + 10 = 510']}; },
 parent:'שאלי: "מה ראית במספרים?" אם היא תמיד בוחרת עמודות ויודעת להסביר למה, זה לגיטימי.'
};
