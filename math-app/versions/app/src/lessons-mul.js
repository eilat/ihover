/* ---------- multiplication: the anchors (כ2) and building from them (כ3) ----------
   Spec: math-teacher (SKILLS-MAP.md). n × k = n rows, k in each row; the family number is always the
   columns, so every way is a vertical cut and "each column has n dots". Mistake formulas that collide
   with the answer or with each other are dropped (first one wins) instead of rerolling the fact. */
const clean=(ans,list)=>{ const seen=new Set([ans]); return list.filter(([v])=>v!=null&&!seen.has(v)&&seen.add(v)); };
const mw=(ans,list)=>{ const W=clean(ans,list); return x=>wrongFrom(W,x); };
const arr=(n,k,o={})=>dotArray({rows:n,cols:k,...o});
// a fresh n for this family in this lesson; after many tries a repeat is fine
function pickN(used,key,ns){ for(let t=0;;t++){ const n=pick(ns); if(t>200||!used.has(key(n))){ used.add(key(n)); return n; } } }
const exQ=(a,b)=>`כמה זה ${L(`${a} × ${b}`)}?`;
// one-box exercise "a × b = ?"
const oneBox=(a,b,ans,wrong,vis,hints,level)=>({say:exQ(a,b), eq:[`${a} × ${b} =`,{f:0}], fields:[{ans,wrong}], showVis:'hint', vis, hints, level});

/* ---------- כ2.1 ×2, ×10, ×1, ×0 ---------- */
const x2W=n=>mw(2*n,[[n+2,`חיברת ${n} ו-2. בכל עמודה ${n}, ויש 2 עמודות.`],[n,'זו עמודה אחת. יש עוד אחת.'],[2*n-1,`כפולים: ${n} + ${n}. קודם עד 10, ואז מה שנשאר.`],[2*n+1,`כפולים: ${n} + ${n}. קודם עד 10, ואז מה שנשאר.`]]);
const x10W=n=>mw(10*n,[[n+10,`חיברת. ${n} מקלות של 10: 10, 20...`],[n,`${n} עשרות, לא ${n} אחדות.`],[10*n-10,'ספרי שוב את המקלות.'],[10*n+10,'ספרי שוב את המקלות.']]);
const x0W=(n,zeroFirst)=>mw(0,[[n,zeroFirst?`0 פעמים ${n}: אין אף צלחת. כמה תותים?`:`זה ${n} ועוד 0. ${n} פעמים 0: צלחות ריקות. כמה תותים?`]]);
const x1W=n=>mw(n,[[n+1,`זה ${n} ועוד 1. ${n} פעמים 1: בכל צלחת 1.`],[1,'זו צלחת אחת. כמה צלחות יש?'],[0,'בכל צלחת יש 1, לא 0.']]);
const x2H=n=>['כמה נקודות בכל עמודה?',`בכל עמודה ${n}, ויש 2 עמודות: ${n} + ${n}.`,n>5?`${n} + ${10-n} = 10, ועוד ${2*n-10}: ${2*n}.`:`${n} + ${n} = ${2*n}.`];
const x10H=n=>['כמה מקלות של עשר?',`${n} מקלות: 10, 20, 30...`,`${n} עשרות = ${10*n}.`];
const x0H=n=>['כמה תותים יש בכל צלחת?',`בכל צלחת 0. ${n} פעמים 0...`,'אין תותים בכלל: 0.'];
const x1H=n=>['כמה בכל צלחת?',`${n} צלחות, בכל אחת 1. ספרי את התותים.`,`${n}.`];
LESSONS['k2.1']={id:'כ2.1', title:'כפול 2, 10, 1, 0', explain:[
  {say:'7 × 2 זה 7 פעמים 2: 7 שורות, ובכל שורה 2.', vis:()=>arr(7,2,{lit:6,sums:true})},
  {say:'עכשיו מסתכלות למטה: בכל עמודה יש 7, כמו מספר השורות. שתי עמודות: 7 + 7 = 14. כפול 2 זה כפולים.', vis:()=>arr(7,2,{split:{cols:1}})+`<p class="decomp ltr">7 × 2 = 7 + 7 = 14</p>`},
  {say:'6 × 10: 6 שורות של 10. כל שורה היא מקל של עשר. 6 מקלות הם 6 עשרות: 60.', vis:()=>`<div class="pair">${arr(6,10)}${baseTen({t:6})}</div><p class="decomp ltr">6 × 10 = 60</p>`},
  {say:'5 × 1: 5 צלחות, בכל אחת תות אחד. ו-5 × 0: 5 צלחות ריקות. כמה תותים יש בצלחות הריקות?', vis:()=>plates({ks:[1,1,1,1,1]})+plates({ks:[0,0,0,0,0]}),
   ask:{options:['5','0'], ok:1, then:'נכון. 5 פעמים כלום זה כלום: 5 × 0 = 0.', no:'5 זה מספר הצלחות. כמה תותים יש עליהן?'}}
 ],
 together:[
  ()=>({say:'8 שורות, ובכל שורה 2.', eq:['8 × 2 =',{f:2}], fields:[
      {q:'כמה נקודות בעמודה אחת? (עמודה הולכת למטה)',label:'בעמודה',ans:8,wrong:x=>x===2?'2 זה בשורה, לרוחב. כמה בעמודה, מלמעלה למטה?':null},
      {q:'8 + 8 = ?',label:'8 + 8 =',ans:16,wrong:x=>x===10?'חיברת 8 ו-2. יש שתי עמודות של 8.':x===15||x===17?'8 + 2 = 10, ועוד 6.':null},
      {q:'אז 8 × 2 = ?',ans:16}],
    vis:st=>arr(8,2,st.done>=1?{split:{cols:1}}:{})}),
  ()=>({say:'7, שלוש פעמים.', eq:[], fields:[
      {q:'7 × 10: כמה מקלות של עשר?',label:'מקלות',ans:7},
      {q:'7 עשרות זה?',label:'7 × 10 =',ans:70,wrong:x=>x===17?'חיברת 7 ו-10. 7 מקלות: 10, 20, 30...':x===7?'7 עשרות, לא 7 אחדות.':null},
      {q:'7 × 1 = ? (7 צלחות, בכל אחת תות אחד)',label:'7 × 1 =',ans:7,wrong:x=>x===8?'זה 7 ועוד 1. 7 פעמים 1: בכל צלחת 1.':null},
      {q:'7 × 0 = ? (7 צלחות ריקות)',label:'7 × 0 =',ans:0,wrong:x=>x===7?'7 זה מספר הצלחות. כמה תותים יש?':null}],
    vis:st=>st.f<=1&&st.done<2?baseTen({t:7}):st.f===2&&!st.finished?plates({ks:[1,1,1,1,1,1,1]}):plates({ks:[0,0,0,0,0,0,0]}), end:'אותו 7, ושלוש תשובות שונות.'})
 ],
 levels:['x2','x10','x0','x1','turn','mix'],
 gen(lv,used){
   const kind = lv==='mix' ? pick(['x2','x10','0x','1x']) : lv==='turn' ? pick(['2x','10x']) : lv;
   if(kind==='x2'){ const n=pickN(used,n=>n+'x2',[6,7,8,9]); return oneBox(n,2,2*n,x2W(n),()=>arr(n,2,{split:{cols:1}}),x2H(n),lv); }
   if(kind==='2x'){ const n=pickN(used,n=>'2x'+n,[6,7,8,9]); return oneBox(2,n,2*n,x2W(n),()=>arr(2,n,{split:{rows:1}}),['סובבי: 2 × '+n+' = '+n+' × 2.',`2 שורות של ${n}: ${n} + ${n}.`,`${n} + ${n} = ${2*n}.`],lv); }
   if(kind==='x10'){ const n=pickN(used,n=>n+'x10',[3,4,5,6,7,8,9]); return oneBox(n,10,10*n,x10W(n),()=>baseTen({t:n}),x10H(n),lv); }
   if(kind==='10x'){ const n=pickN(used,n=>'10x'+n,[3,4,5,6,7,8,9]); const W=mw(10*n,[[9*n,`סובבי: ${n} × 10 = ${n} עשרות.`],[11*n,`סובבי: ${n} × 10 = ${n} עשרות.`],[n+10,'חיברת.'],[n,`${n} עשרות, לא ${n} אחדות.`]]);
     return oneBox(10,n,10*n,W,()=>baseTen({t:n}),[`סובבי: 10 × ${n} = ${n} × 10.`,`${n} מקלות של עשר.`,`${n} עשרות = ${10*n}.`],lv); }
   if(kind==='x0'||kind==='0x'){ const n=pickN(used,n=>kind+n,[3,4,5,6,7,8,9]); const zf=kind==='0x';
     return oneBox(zf?0:n,zf?n:0,0,x0W(n,zf),()=>plates({ks:zf?[]:Array(n).fill(0)}),zf?['0 פעמים '+n+': כמה צלחות יש?','אין אף צלחת.','0.']:x0H(n),lv); }
   const n=pickN(used,n=>kind+n,[3,4,5,6,7,8,9]); const of=kind==='1x';
   return oneBox(of?1:n,of?n:1,n,x1W(n),()=>plates({ks:Array(of?1:n).fill(of?n:1)}),of?[`פעם אחת ${n}: צלחת אחת עם ${n}.`,`צלחת אחת, ובה ${n}.`,`${n}.`]:x1H(n),lv); },
 star(){ return {star:true, say:'⭐ שאלת אתגר: כמה זה 13 × 10?', eq:['13 × 10 =',{f:0}], fields:[{ans:130,wrong:mw(130,[[23,'חיברת 13 ו-10.'],[103,'13 עשרות: 10 עשרות הן 100, ועוד 3 עשרות.'],[13,'13 עשרות, לא 13 אחדות.']])}], showVis:'hint',
   vis:()=>baseTen({h:1,t:3}), hints:['כמה עשרות?','13 עשרות = 10 עשרות ועוד 3 עשרות.','100 + 30.']}; },
 parent:'כמה רגליים ל-6 ציפורים? כמה אצבעות ל-4 ילדים? כמה עוגיות ב-5 קופסאות ריקות?'
};

/* ---------- כ2.2 ×5 = half of ×10 ---------- */
function x5W(n){ const odd=n%2===1;
  return mw(5*n,[[n+5,`חיברת. ${n} שורות, בכל שורה 5.`],[10*n,`זה ${n} × 10. כפול 5 זה חצי.`],[odd?null:n/2,odd?'':`חצי מ-${n} עשרות הוא ${n/2} עשרות: ${5*n}.`],
    [odd?5*n-5:null,'שכחת את החצי של ה-10 האחרון: עוד 5.'],[odd?5*n+5:null,'חצי מ-10 הוא 5. בדקי שוב.'],[odd?null:5*n-5,'ספרי בחמישיות.'],[odd?null:5*n+5,'ספרי בחמישיות.']]); }
const x5H=n=>[`כמה זה ${n} × 10?`, n%2?`${10*n} זה ${10*n-10} ועוד 10. חצי מכל אחד.`:`חצי מ-${n} עשרות?`, `חצי מ-${10*n} = ${5*n}.`];
LESSONS['k2.2']={id:'כ2.2', title:'כפול 5', explain:[
  {say:'6 × 10 = 60: 6 שורות של 10.', vis:()=>arr(6,10,{lit:5,sums:true})},
  {say:'חותכות כל שורה באמצע. עכשיו בכל שורה 5: זה 6 × 5.', vis:()=>arr(6,10,{split:{cols:5},fade:5})},
  {say:'6 × 5 הוא חצי מ-6 × 10. חצי מ-6 עשרות הוא 3 עשרות: 30.', vis:()=>arr(6,10,{split:{cols:5},fade:5})+`<p class="decomp ltr">6 × 10 = 60 → 6 × 5 = 30</p>`},
  {say:'7 × 5: חצי מ-70. 70 זה 60 ועוד 10. חצי מ-60 הוא 30, חצי מ-10 הוא 5. ביחד 35. בדיקה: כפול 5 תמיד נגמר ב-0 או ב-5.', vis:()=>arr(7,10,{split:{cols:5},fade:5})+`<p class="decomp ltr">70 = 60 + 10 → 30 + 5 = 35</p>`}
 ],
 together:[
  ()=>({say:'8 × 5: חצי מ-8 × 10.', eq:['8 × 5 =',{f:2}], fields:[
      {q:'8 × 10 = ?',label:'8 × 10 =',ans:80,wrong:x=>x===18?'חיברת.':null},
      {q:'חצי מ-80 = ?',label:'חצי מ-80 =',ans:40,wrong:x=>x===4?'חצי מ-8 עשרות הוא 4 עשרות: 40.':x===160?'זה פעמיים 80. חצי זה לחלק לשני חלקים שווים.':null},
      {q:'8 × 5 = ?',ans:40}],
    vis:st=>arr(8,10,st.done>=1?{split:{cols:5},fade:5}:{})}),
  ()=>({say:'9 × 5: חצי מ-90.', eq:['9 × 5 =',{f:3}], fields:[
      {q:'9 × 10 = ?',label:'9 × 10 =',ans:90},
      {q:'90 זה 80 ועוד 10. חצי מ-80?',label:'חצי מ-80 =',ans:40},
      {q:'חצי מ-10?',label:'חצי מ-10 =',ans:5},
      {q:'9 × 5 = ?',ans:45,wrong:x=>x===40?'שכחת את החצי של ה-10.':x===50?'חצי מ-10 הוא 5, לא 10.':null}],
    vis:st=>arr(9,10,st.done>=1?{split:{cols:5},fade:5}:{})})
 ],
 levels:['even','even','odd','odd','turn','missing'],
 gen(lv,used){
   if(lv==='even'||lv==='odd'){ const n=pickN(used,n=>n+'x5',lv==='even'?[4,6,8]:[3,5,7,9]); return oneBox(n,5,5*n,x5W(n),()=>arr(n,10,{split:{cols:5},fade:5}),x5H(n),lv); }
   if(lv==='turn'){ const n=pickN(used,n=>'5x'+n,[6,7,8,9]); return oneBox(5,n,5*n,x5W(n),()=>arr(n,10,{split:{cols:5},fade:5}),[`סובבי: 5 × ${n} = ${n} × 5. כמה זה ${n} × 10?`,x5H(n)[1],x5H(n)[2]],lv); }
   const n=pickN(used,n=>'m5x'+n,[6,7,8,9]), P=5*n;
   const W=mw(n,[[5,'5 זה כמה בכל פעם. כמה פעמים?'],[n-1,`בדקי: ${n-1} × 5 = ${5*(n-1)}.`],[n+1,`בדקי: ${n+1} × 5 = ${5*(n+1)}.`],[n%2?Math.floor(P/10):null,`${P} הוא חצי מ-${2*P}.`]]);
   return {say:'איזה מספר חסר?', eq:[{f:0},`× 5 = ${P}`], fields:[{ans:n,wrong:W}], showVis:'hint', vis:()=>arr(n,10,{split:{cols:5},fade:5}),
     hints:[`ספרי בחמישיות עד ${P}.`,`${P} הוא חצי מכמה? מה פעמיים ${P}?`,`${2*P} = ${n} × 10, אז ${n}.`], level:lv}; },
 star(){ return {star:true, say:'⭐ שאלת אתגר: איזה מספר חסר?', eq:['8 × 5 = 4 ×',{f:0}], fields:[{ans:10,wrong:mw(10,[[5,'4 × 5 = 20. צריך 40.'],[40,'40 זה כמה שיוצא. 4 פעמים כמה הוא 40?']])}], showVis:'hint',
   vis:()=>arr(8,5), hints:['כמה זה 8 × 5?','40. 4 פעמים כמה?','4 × 10 = 40.']}; },
 parent:'שעון מחוגים: "המחוג על 7. כמה דקות עברו?"'
};

/* ---------- כ3.1 ×4 and ×8: double, double again ---------- */
function x4W(n){ const s=4*n; return mw(s,[[n+4,'חיברת.'],[2*n,`זה ${n} × 2: הכפלת פעם אחת. עוד פעם.`],[2*n+4,`הוספת 4. מכפילות: ${2*n} + ${2*n}.`],[((2*n)%10)*2>=10?s-10:null,'האחדות ועוד האחדות עוברות 10: זו עוד עשרת.'],[s-4,`זו התשובה של ${n-1} × 4.`],[s+4,`זו התשובה של ${n+1} × 4.`]]); }
function x8W(n){ const s=8*n; return mw(s,[[n+8,'חיברת.'],[4*n,`זה ${n} × 4. עוד הכפלה.`],[4*n+8,`הוספת 8. מכפילות: ${4*n} + ${4*n}.`],[2*n,`צריך להכפיל שלוש פעמים: ${n}, ${2*n}, ${4*n}, ${8*n}.`],[((4*n)%10)*2>=10?s-10:null,'האחדות עוברות 10: עוד עשרת.'],[s-8,`זו התשובה של ${n-1} × 8.`],[s+8,`זו התשובה של ${n+1} × 8.`]]); }
const x4H=n=>[`כמה זה ${n} × 2?`,`${2*n}. מכפילות: ${2*n} + ${2*n}.`,`עשרות ועשרות, אחדות ואחדות: ${4*n}.`];
const x8H=n=>[`${n} → ${2*n} → ? → ?`,`${n} × 4 = ${4*n}. מכפילות: ${4*n} + ${4*n}.`,`${4*n} + ${4*n} = ${8*n}.`];
LESSONS['k3.1']={id:'כ3.1', title:'כפול 4 וכפול 8', explain:[
  {say:'6 × 4: 6 שורות של 4. חותכות באמצע: שני חלקים, בכל אחד 6 × 2.', vis:()=>arr(6,4,{split:{cols:2}})},
  {say:'6 × 2 = 12. שני חלקים: 12 + 12 = 24. כפול 4: מכפילות, ומכפילות שוב.', vis:()=>arr(6,4,{split:{cols:2}})+`<p class="decomp ltr">6 → 12 → 24</p>`},
  {say:'6 × 8: 6 שורות של 8. חותכות באמצע: שני חלקים של 6 × 4. 24 + 24 = 48.', vis:()=>arr(6,8,{split:{cols:4}})+`<p class="decomp ltr">6 → 12 → 24 → 48</p>`},
  {say:'7 × 4 = 28. אז 7 × 8 = ?', vis:()=>`<div class="pair">${arr(7,4)}${arr(7,8,{split:{cols:4}})}</div>`,
   ask:{options:['28 + 28','28 + 4','28 + 8'], ok:0, then:'נכון: 8 זה פעמיים 4, אז פעמיים 28.', no:'בואי נסתכל: 7 × 8 הוא שני מערכים של 7 × 4. כמה נקודות בכל חצי?'}}
 ],
 together:[
  ()=>({say:'7 × 4: מכפילות ומכפילות שוב.', eq:['7 × 4 =',{f:2}], fields:[
      {q:'7 × 2 = ?',label:'7 × 2 =',ans:14},
      {q:'14 + 14 = ?',label:'14 + 14 =',ans:28,wrong:x=>x===18?'מכפילות את כל ה-14, לא רק מוסיפות 4.':x===24?'עשרות: 10 + 10. אחדות: 4 + 4.':null},
      {q:'7 × 4 = ?',ans:28}],
    vis:st=>arr(7,4,{split:{cols:2}})}),
  ()=>({say:'7 × 8: עוד הכפלה אחת.', eq:['7 × 8 =',{f:2}], fields:[
      {q:'7 × 4 = ? (פתרנו!)',label:'7 × 4 =',ans:28},
      {q:'28 + 28 = ?',label:'28 + 28 =',ans:56,wrong:x=>x===46?'8 + 8 = 16, וזו עוד עשרת.':x===36?'מכפילות את כל ה-28.':null},
      {q:'7 × 8 = ?',ans:56}],
    vis:st=>arr(7,8,{split:{cols:4},fade:st.done>=1?null:4})})
 ],
 levels:['x4s','x4','x4','x8s','x8','turn'],
 gen(lv,used){
   if(lv==='x4s'||lv==='x4'){ const n=pickN(used,n=>n+'x4',lv==='x4s'?[3,4,5]:[6,7,8,9]); return oneBox(n,4,4*n,x4W(n),()=>arr(n,4,{split:{cols:2}}),x4H(n),lv); }
   if(lv==='x8s'||lv==='x8'){ const n=pickN(used,n=>n+'x8',lv==='x8s'?[3,4,5]:[6,7,8,9]); return oneBox(n,8,8*n,x8W(n),()=>arr(n,8,{split:{cols:4}}),x8H(n),lv); }
   if(Math.random()<.5){ const n=pickN(used,n=>'4x'+n,[6,7,9]); return oneBox(4,n,4*n,x4W(n),()=>arr(4,n,{split:{rows:2}}),[`סובבי: 4 × ${n} = ${n} × 4.`,...x4H(n).slice(1)],lv); }
   const n=pickN(used,n=>'8x'+n,[3,6,7]); return oneBox(8,n,8*n,x8W(n),()=>arr(8,n,{split:{rows:4}}),[`סובבי: 8 × ${n} = ${n} × 8.`,...x8H(n).slice(1)],lv); },
 star(){ return {star:true, say:'⭐ שאלת אתגר: כמה זה 12 × 4?', eq:['12 × 4 =',{f:0}], fields:[{ans:48,wrong:mw(48,[[16,'חיברת.'],[24,'זה 12 × 2. עוד הכפלה.']])}], showVis:'hint',
   vis:()=>arr(12,4,{split:{cols:2}}), hints:['12 × 2 = ?','24. ומכפילות.','24 + 24 = 48.']}; },
 parent:'כמה גלגלים ל-7 מכוניות? 7 אופניים: 14 גלגלים, ולמכונית פי 2.'
};

/* ---------- כ3.2 ×3 and ×6: cut into parts you know ---------- */
function x3W(n){ const s=3*n; return mw(s,[[n+3,'חיברת.'],[2*n,`זה ${n} × 2. נשארה עוד עמודה של ${n}.`],[2*n+3,`הוספת 3. בעמודה שנשארה יש ${n} נקודות.`],[(2*n)%10+n>=10?s-10:null,'החיבור עובר עשרת.'],[s-3,`זו התשובה של ${n-1} × 3.`],[s+3,`זו התשובה של ${n+1} × 3.`]]); }
function x6W(n){ const s=6*n; return mw(s,[[n+6,'חיברת.'],[5*n,`זה ${n} × 5. עוד עמודה של ${n}.`],[5*n+6,`הוספת 6. בעמודה שנשארה יש ${n} נקודות.`],[n%2?s-10:null,`5 + ${n} עובר את 10.`],[s-6,`זו התשובה של ${n-1} × 6.`],[s+6,`זו התשובה של ${n+1} × 6.`]]); }
const x3H=n=>[`כמה זה ${n} × 2?`,`${2*n}, ועוד עמודה אחת: ${n}.`,`${2*n} + ${n} = ${3*n}.`];
const x6H=n=>[`כמה זה ${n} × 5?`,`${5*n}, ועוד עמודה: ${n}.`,`${5*n} + ${n} = ${6*n}.`];
LESSONS['k3.2']={id:'כ3.2', title:'כפול 3 וכפול 6', explain:[
  {say:'7 × 3: 7 שורות של 3. את 7 × 3 עוד לא יודעות, אבל את 7 × 2 כן. חותכות: 2 עמודות, ועוד עמודה אחת.', vis:()=>arr(7,3,{split:{cols:2}})},
  {say:'7 × 2 = 14. בעמודה שנשארה יש 7 נקודות. 14 + 7 = 21.', vis:()=>arr(7,3,{split:{cols:2}})+`<p class="decomp ltr">7 × 3 = 14 + 7 = 21</p>`},
  {say:'6 × 6: חותכות אחרי 5. 6 × 5 = 30, ועוד עמודה של 6: 36.', vis:()=>arr(6,6,{split:{cols:5}})+`<p class="decomp ltr">6 × 6 = 30 + 6 = 36</p>`},
  {say:'אפשר לחתוך גם במקום אחר: 6 × 6 = 18 + 18. כל חיתוך טוב, אם יודעות כל חלק.', vis:()=>`<div class="pair">${arr(6,6,{split:{cols:5}})}${arr(6,6,{split:{cols:3}})}</div><p class="decomp ltr">30 + 6 = 18 + 18 = 36</p>`}
 ],
 together:[
  ()=>({say:'8 × 3: 8 × 2, ועוד עמודה.', eq:['8 × 3 =',{f:3}], fields:[
      {q:'8 × 2 = ?',label:'8 × 2 =',ans:16},
      {q:'בעמודה שנשארה, כמה נקודות?',label:'בעמודה',ans:8,wrong:x=>x===3?'עמודה הולכת למטה. כמה שורות יש?':null},
      {q:'16 + 8 = ?',label:'16 + 8 =',ans:24,wrong:x=>x===14?'16 + 4 = 20, ועוד 4.':x===19?'הוספת 3. בעמודה יש 8.':null},
      {q:'8 × 3 = ?',ans:24}],
    vis:()=>arr(8,3,{split:{cols:2}})}),
  ()=>({say:'7 × 6: 7 × 5, ועוד עמודה.', eq:['7 × 6 =',{f:3}], fields:[
      {q:'7 × 5 = ?',label:'7 × 5 =',ans:35,wrong:x=>x===70?'זה 7 × 10. חצי.':null},
      {q:'בעמודה שנשארה?',label:'בעמודה',ans:7},
      {q:'35 + 7 = ?',label:'35 + 7 =',ans:42,wrong:x=>x===32?'5 + 7 עובר את 10.':null},
      {q:'7 × 6 = ?',ans:42}],
    vis:()=>arr(7,6,{split:{cols:5}})})
 ],
 levels:['x3s','x3','x6s','x6','x6','turn'],
 gen(lv,used){
   if(lv==='x3s'||lv==='x3'){ const n=pickN(used,n=>n+'x3',lv==='x3s'?[4,5]:[6,7,8,9]); return oneBox(n,3,3*n,x3W(n),()=>arr(n,3,{split:{cols:2}}),x3H(n),lv); }
   if(lv==='x6s'||lv==='x6'){ const n=pickN(used,n=>n+'x6',lv==='x6s'?[3,4]:[6,7,8,9]); return oneBox(n,6,6*n,x6W(n),()=>arr(n,6,{split:{cols:5}}),x6H(n),lv); }
   if(Math.random()<.5){ const n=pickN(used,n=>'3x'+n,[6,7,8,9]); return oneBox(3,n,3*n,x3W(n),()=>arr(3,n,{split:{rows:2}}),[`סובבי: 3 × ${n} = ${n} × 3.`,...x3H(n).slice(1)],lv); }
   const n=pickN(used,n=>'6x'+n,[7,8,9]); return oneBox(6,n,6*n,x6W(n),()=>arr(6,n,{split:{rows:5}}),[`סובבי: 6 × ${n} = ${n} × 6.`,...x6H(n).slice(1)],lv); },
 star(){ return {star:true, say:`⭐ שאלת אתגר: ${L('6 × 7 = 42')}. כמה זה ${L('6 × 8')}?`, eq:['6 × 8 =',{f:0}], fields:[{ans:48,wrong:mw(48,[[49,'הוספת 7. ב-6 × 8 יש עוד עמודה: 6 נקודות.'],[43,'הוספת נקודה אחת. העמודה היא 6 נקודות.']])}], showVis:'hint',
   vis:()=>arr(6,8,{split:{cols:7}}), hints:['6 × 8 זה 6 × 7 ועוד עמודה.','כמה נקודות בעמודה? 6.','42 + 6 = 48.']}; },
 parent:'שאלי "איפה חתכת?". אין חיתוך אחד נכון.'
};

/* ---------- כ3.3 ×9 = ×10 minus a column ---------- */
function x9W(n){ const s=9*n; return mw(s,[[n+9,'חיברת.'],[10*n,`זה ${n} × 10. מכסות עמודה.`],[n===9?null:10*n-9,`הורדת 9. העמודה היא ${n} נקודות.`],[10*n-1,`הורדת נקודה אחת. העמודה היא ${n} נקודות.`],[11*n,'מורידות, לא מוסיפות.'],[n===5?null:10*(n-1)+n,`מעשרת אחת לוקחות ${n}: 10 − ${n} = ${10-n}.`]]); }
const x9H=n=>[`כמה זה ${n} × 10?`,`מכסות עמודה אחת. כמה נקודות יש בה? ${n}.`,`${10*n} − ${n}: לוקחות ${n} מעשרת אחת. נשארים ${(n-1)*10} ועוד ${10-n}.`];
LESSONS['k3.3']={id:'כ3.3', title:'כפול 9', explain:[
  {say:'7 × 10 = 70: 7 שורות של 10.', vis:()=>arr(7,10,{lit:6,sums:true})},
  {say:'מכסות עמודה אחת. עכשיו בכל שורה 9: זה 7 × 9. כמה נקודות כיסינו? עמודה אחת, ובה 7.', vis:()=>arr(7,10,{cover:1})},
  {say:'7 × 9 = 70 − 7. איך מורידות 7 מ-70? לוקחות את 7 מעשרת אחת: 10 − 7 = 3. נשארו 60 ועוד 3: 63.', vis:()=>baseTen({t:6,o:3})+`<p class="decomp ltr">70 − 7 = 60 + 3 = 63</p>`},
  {say:'8 × 9: מכסות עמודה אחת. כמה נקודות יש בה?', vis:()=>arr(8,10,{cover:1}),
   ask:{options:['8','9','1'], ok:0, then:'נכון: 8, כמו מספר השורות. 80 − 8 = 72.', no:'ספרי את הנקודות בעמודה המכוסה, מלמעלה למטה.'}}
 ],
 together:[
  ()=>({say:'6 × 9: 6 × 10, ומכסות עמודה.', eq:['6 × 9 =',{f:3}], fields:[
      {q:'6 × 10 = ?',label:'6 × 10 =',ans:60},
      {q:'כמה נקודות בעמודה שכיסינו?',label:'בעמודה',ans:6,wrong:x=>x===9?'9 זה בשורה אחרי הכיסוי. כמה בעמודה?':x===1?'זו עמודה אחת. כמה נקודות יש בה?':null},
      {q:'60 − 6 = ?',label:'60 − 6 =',ans:54,wrong:x=>x===56?'זה 50 + 6. מעשרת אחת לוקחות 6: נשארים 4.':x===66?'מורידות, לא מוסיפות.':null},
      {q:'6 × 9 = ?',ans:54}],
    vis:st=>arr(6,10,st.done>=1?{cover:1}:{})}),
  ()=>({say:'8 × 9.', eq:['8 × 9 =',{f:3}], fields:[
      {q:'8 × 10 = ?',label:'8 × 10 =',ans:80},
      {q:'בעמודה?',label:'בעמודה',ans:8},
      {q:'80 − 8 = ?',label:'80 − 8 =',ans:72,wrong:x=>x===71?'הורדת 9. בעמודה יש 8.':x===79?'הורדת נקודה אחת. העמודה היא 8 נקודות.':null},
      {q:'8 × 9 = ?',ans:72}],
    vis:st=>arr(8,10,st.done>=1?{cover:1}:{})})
 ],
 levels:['x9s','x9','turn','x9','x9','mix'],
 gen(lv,used){
   if(lv==='x9s'||lv==='x9'){ const n=pickN(used,n=>n+'x9',lv==='x9s'?[3,4,5]:[6,7,8,9]); return oneBox(n,9,9*n,x9W(n),()=>arr(n,10,{cover:1}),x9H(n),lv); }
   if(lv==='turn'){ const n=pickN(used,n=>'9x'+n,[6,7,8]); return oneBox(9,n,9*n,x9W(n),()=>arr(n,10,{cover:1}),[`סובבי: 9 × ${n} = ${n} × 9. כמה זה ${n} × 10?`,...x9H(n).slice(1)],lv); }
   const k=pick([4,6,8]); const n=pickN(used,n=>n+'x'+k,[6,7,8,9].filter(x=>x!==k));
   return k===4?oneBox(n,4,4*n,x4W(n),()=>arr(n,4,{split:{cols:2}}),x4H(n),lv):k===8?oneBox(n,8,8*n,x8W(n),()=>arr(n,8,{split:{cols:4}}),x8H(n),lv):oneBox(n,6,6*n,x6W(n),()=>arr(n,6,{split:{cols:5}}),x6H(n),lv); },
 star(){ return {star:true, say:`⭐ שאלת אתגר: ${L('7 × 8 = 56')}. כמה זה ${L('7 × 9')}?`, eq:['7 × 9 =',{f:0}], fields:[{ans:63,wrong:mw(63,[[64,'7 × 9 זה עוד עמודה, ובה 7.'],[65,'7 × 9 זה עוד עמודה, ובה 7.'],[57,'עוד עמודה, לא עוד נקודה.']])}], showVis:'hint',
   vis:()=>arr(7,9,{split:{cols:8}}), hints:['7 × 9 זה 7 × 8 ועוד עמודה.','כמה בעמודה? 7.','56 + 7 = 63.']}; },
 parent:'אם היא מכירה את טריק האצבעות ל-×9, שאלי למה הוא עובד. עיקר השיעור הוא 70 − 7.'
};

/* ---------- כ3.4 the facts left, and which way ---------- */
// the steps after a method card. n rows × k columns.
function methodFields(n,k,key){
  const P=n*k, last=(label,extra)=>({q:'וכמה ביחד?',label,ans:P,wrong:mw(P,[[n+k,'חיברת.'],[P-n,`זו התשובה של ${n} × ${k-1}. חסרה עמודה.`],[P+n,'יש עמודה מיותרת.'],[P-k,'חסרה שורה.'],...extra,[P-10,'בדקי את החיבור: עשרות ואחדות.'],[P+10,'בדקי את החיבור: עשרות ואחדות.']])});
  if(key==='five') return {fields:[{q:`${n} × 5 = ?`,label:`${n} × 5 =`,ans:5*n},{q:`ומה שנשאר: ${n} × ${k-5} = ?`,label:`${n} × ${k-5} =`,ans:n*(k-5)},last(`${5*n} + ${n*(k-5)} =`,[[5*n+(k-5),`הוספת ${k-5} נקודות. החלק השני הוא ${n} × ${k-5}.`]])],
    vis:()=>arr(n,k,{split:{cols:5}}), hints:[`כמה זה ${n} × 5? חצי מ-${n} × 10.`,`${5*n}, ועוד ${n} × ${k-5}.`,`${5*n} + ${n*(k-5)} = ${P}.`]};
  if(key==='ten') return {fields:[{q:`${n} × 10 = ?`,label:`${n} × 10 =`,ans:10*n},{q:`כמה עודף? ${n} × ${10-k} = ?`,label:`${n} × ${10-k} =`,ans:n*(10-k)},last(`${10*n} − ${n*(10-k)} =`,[[10*n-(10-k),`הורדת ${10-k} נקודות. מורידות ${10-k} עמודות.`]])],
    vis:()=>arr(n,10,{cover:10-k}), hints:[`כמה זה ${n} × 10?`,`מכסות ${10-k} עמודות: ${n*(10-k)} נקודות.`,`${10*n} − ${n*(10-k)} = ${P}.`],
    end: 10-k>=3 ? `יצא! זו הייתה עבודה. אפשר לנסות גם ×5 ועוד: ${5*n} + ${n*(k-5)}.` : ''};
  if(key==='dbl'&&n%2&&k%2){ // she insisted on doubles with two odd numbers: no equal halves, so go on with ×5 and more
    const m=methodFields(n,k,'five'); m.fields[0]={...m.fields[0],q:`בכפולים צריך מספר זוגי, אז נעשה ×5 ועוד: ${n} × 5 = ?`}; return m; }
  if(key==='dbl'){ // halve the even number, then double. If only n is even, turn the array first.
    const kEven=k%2===0, a=kEven?n:k, h=kEven?k/2:n/2, half=a*h;
    return {fields:[{q:kEven?`${n} × ${h} = ?`:`מסובבות: ${k} × ${n}. כמה זה ${k} × ${h}?`,label:`${a} × ${h} =`,ans:half},last(`${half} + ${half} =`,[[half,'זה החצי. עכשיו מכפילות.']])],
      vis:()=>kEven?arr(n,k,{split:{cols:h}}):arr(n,k,{split:{rows:h}}), hints:[`חצי מ-${kEven?k:n} הוא ${h}. כמה זה ${a} × ${h}?`,`${half}, ועכשיו מכפילות.`,`${half} + ${half} = ${P}.`]};
  }
  // cut into two parts she knows: she picks where
  const cuts=k===8?[[5,3],[4,4],[6,2]]:k===7?[[5,2],[4,3],[6,1]]:k===6?[[5,1],[3,3],[4,2]]:[[5,k-5],[k-1,1]];
  return {fields:[{q:'איפה חותכות?', choice:cuts.map(([a,b])=>({text:`${a} + ${b}`,ok:1,key:a})),
      then:a=>{ const b=k-a; return {fields:[{q:`${n} × ${a} = ?`,label:`${n} × ${a} =`,ans:n*a},{q:`${n} × ${b} = ?`,label:`${n} × ${b} =`,ans:n*b},last(`${n*a} + ${n*b} =`,[])],
        vis:()=>arr(n,k,{split:{cols:a}}), hints:[`כמה זה ${n} × ${a}?`,`ועוד ${n} × ${b}.`,`${n*a} + ${n*b} = ${P}.`]}; }}],
    vis:()=>arr(n,k), hints:['חתכי איפה שנוח: לחלקים שאת יודעת.','למשל אחרי 5.','כל חיתוך טוב.']};
}
const CARDS=[{key:'dbl',text:'כפולים',sub:'חצי, ואז מכפילה'},{key:'five',text:'×5 ועוד',sub:'חצי מ-×10, ועוד מה שנשאר'},{key:'ten',text:'×10 פחות',sub:'×10, ומורידה מה שעודף'},{key:'split',text:'פירוק',sub:'חותכת לשני חלקים שאני יודעת'}];
function cardField(n,k){ const odd=n%2&&k%2;
  return {q:'באיזו דרך?', choice:CARDS.map(c=>({...c, ok:!(odd&&c.key==='dbl'), soft:odd&&c.key==='dbl'?`בואי נבדוק: אפשר לחתוך ${k} לשני חצאים שווים? לא בנקודות שלמות. איזו דרך אחרת?`:null})),
    then:key=>methodFields(n,k,key)}; }
function methodItem(n,k,key,lv){
  const base={say:`כמה זה ${L(`${n} × ${k}`)}?`, eq:[`${n} × ${k} =`,{sum:n*k}], showVis:'always', level:lv};
  if(key){ const m=methodFields(n,k,key); return {...base, say:`${L(`${n} × ${k}`)} בדרך "${CARDS.find(c=>c.key===key).text}".`, fields:m.fields, vis:m.vis, hints:m.hints, end:m.end}; }
  return {...base, fields:[cardField(n,k)], vis:()=>arr(n,k), hints:['יש כאן מספר זוגי? יש 9? תמיד אפשר ×5 ועוד.','כפולים: חצי מהמספר הזוגי. ×5 ועוד: חותכות אחרי 5.','בחרי את מה שקל לך.']};
}
const POOL=[[7,8],[8,7],[7,6],[8,6],[7,7],[9,7],[6,6]];
LESSONS['k3.4']={id:'כ3.4', title:'מה שנשאר, ואיזו דרך?', explain:[
  {say:'נשארו מעט עובדות, כמו 7 × 7. אבל כבר יש לך הרבה דרכים.', vis:()=>`<div class="cards">${CARDS.map(c=>`<span class="cardbtn">${c.text}<small>${c.sub}</small></span>`).join('')}</div>`},
  {say:'7 × 7 בדרך ×5 ועוד: חותכות אחרי 5. 7 × 5 = 35, 7 × 2 = 14. ביחד 49.', vis:()=>arr(7,7,{split:{cols:5}})+`<p class="decomp ltr">35 + 14 = 49</p>`},
  {say:'6 × 8 בכפולים: 6 × 4 = 24, 24 + 24 = 48. וגם ×5 ועוד: 30 + 18 = 48. אותה תשובה בשתי דרכים.', vis:()=>`<div class="pair">${arr(6,8,{split:{cols:4}})}${arr(6,8,{split:{cols:5}})}</div><p class="decomp ltr">24 + 24 = 30 + 18 = 48</p>`},
  {say:'איך בוחרות? יש מספר זוגי? אפשר כפולים. יש 9? ×10 פחות. תמיד אפשר ×5 ועוד. כל דרך שעובדת טובה. בחרי את מה שקל לך.', vis:()=>`<div class="cards">${CARDS.map(c=>`<span class="cardbtn">${c.text}<small>${c.key==='dbl'?'יש מספר זוגי':c.key==='ten'?'יש 9':c.key==='five'?'תמיד':'תמיד'}</small></span>`).join('')}</div>`}
 ],
 together:[
  ()=>({say:'6 × 7 בשתי דרכים.', eq:['6 × 7 =',{sum:42}], fields:[
      {q:'×5 ועוד: 6 × 5 = ?',label:'6 × 5 =',ans:30},{q:'6 × 2 = ?',label:'6 × 2 =',ans:12},{q:'30 + 12 = ?',label:'30 + 12 =',ans:42},
      {q:'ועכשיו בכפולים, חותכות את השורות: 3 × 7 = ?',label:'3 × 7 =',ans:21},{q:'21 + 21 = ?',label:'21 + 21 =',ans:42}],
    vis:st=>st.done<3?arr(6,7,{split:{cols:5}}):arr(6,7,{split:{rows:3}}), end:'שתי דרכים, אותה תשובה.'}),
  ()=>({...methodItem(8,8,null,'t'), say:'8 × 8: בחרי דרך.', fields:[{q:'באיזו דרך?', choice:CARDS.map(c=>({...c,ok:1})), then:key=>methodFields(8,8,key)}]})
 ],
 levels:['given','given','choose','choose','choose','alone'],
 gen(lv,used){
   let n,k; for(let t=0;;t++){ [n,k]=pick(POOL); if(lv==='given'&&used.has('g1')&&n%2&&k%2) continue; if(t>200||!used.has(n+'x'+k)) break; } used.add(n+'x'+k);
   if(lv==='given'){ const second=used.has('g1'); used.add('g1'); return methodItem(n,k,second&&(n%2===0||k%2===0)?'dbl':'five',lv); }
   if(lv==='choose') return methodItem(n,k,null,lv);
   const P=n*k; return {say:`כמה זה ${L(`${n} × ${k}`)}? בדרך שלך.`, eq:[`${n} × ${k} =`,{f:0}], fields:[{ans:P,wrong:mw(P,[[n+k,'חיברת.'],[P-n,`זו התשובה של ${n} × ${k-1}. חסרה עמודה.`],[P+n,'יש עמודה מיותרת.'],[P-k,'חסרה שורה.'],[P-10,'בדקי את החיבור: עשרות ואחדות.'],[P+10,'בדקי את החיבור: עשרות ואחדות.']])}],
     showVis:'hint', vis:()=>arr(n,k,{split:{cols:5}}), hints:['כפולים, ×5 ועוד, ×10 פחות, או פירוק: מה קל לך כאן?',`למשל ×5 ועוד: ${n} × 5 = ${5*n}, ועוד ${n} × ${k-5}.`,`${5*n} + ${n*(k-5)} = ${P}.`], level:lv}; },
 star(){ return {star:true, say:`⭐ שאלת אתגר: מישהי פתרה: ${L('7 × 8 = 7 × 5 + 3 = 38')}. מה היא הייתה צריכה להוסיף ל-35?`, eq:['35 +',{f:0},'= 7 × 8'], fields:[{ans:21,wrong:mw(21,[[3,'3 זה מספר העמודות. כמה נקודות יש ב-3 עמודות של 7?'],[56,'זו התשובה הסופית. כמה להוסיף ל-35?']])}], showVis:'hint',
   vis:()=>arr(7,8,{split:{cols:5}}), hints:['7 × 8 = 7 × 5 ועוד 7 × ?','7 × 3 = ?','21. 35 + 21 = 56.']}; },
 parent:'בכל פעם שאלי "איך עשית?". אם היא תמיד בוחרת אותו כרטיס ויודעת להסביר אותו, זה בסדר.'
};
