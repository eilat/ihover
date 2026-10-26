/* ---------- one engine for every new lesson ----------
   A lesson = explanation steps (fixed), two "together" exercises (fixed, broken into small boxes),
   and "alone" exercises generated fresh each time from difficulty levels (math teacher's rules).
   An exercise is a picture + a row of small boxes filled in order + an equation line; any box can
   recognise typical wrong answers and say something specific about them. */
const ICON={
  speaker:'<svg viewBox="0 0 24 24"><path d="M4 9v6h4l5 4V5L8 9z"/><path d="M16 9a4 4 0 0 1 0 6"/><path d="M18.5 6.5a7.5 7.5 0 0 1 0 11"/></svg>',
  bulb:'<svg viewBox="0 0 24 24"><path d="M9 18h6"/><path d="M10 21h4"/><path d="M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0 0 12 3z"/></svg>',
  check:'<svg viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>',
  watch:'<svg viewBox="0 0 24 24"><circle cx="12" cy="13" r="8"/><path d="M12 9v4l2.5 2.5M10 2h4M12 2v3"/></svg>',
  pause:'<svg viewBox="0 0 24 24"><path d="M9 6v12M15 6v12"/></svg>',
  rotate:'<svg viewBox="0 0 24 24"><path d="M20 11a8 8 0 1 0-2.3 5.7"/><path d="M20 4v7h-7"/></svg>'
};
/* ---------- the five lessons (spec: math-teacher, SKILLS-MAP.md) ---------- */
const LESSONS={};

/* ח4.2 jumps: keep the first number whole, jump hundreds then tens */
function jumpsWrongs(a,b){ const B=Math.floor(b/100), T=Math.floor(b/10)%10, s=a+b, D=digits(a);
  const carry=D.t+T>=10;
  return [
    [T&&B?a+B*100:null, `הגעת ל-${a+B*100}, זו הקפיצה הראשונה! נשארה עוד קפיצה של ${T*10}.`],
    [B&&T?a+T*10:null, `קפצת ${T*10}. ומה עם ה-${B*100}?`],
    [carry?s-100:null, `כמעט! ${a+B*100} ועוד ${T*10} עובר את ${(Math.floor((a+B*100)/100)+1)*100}. קפצי בעשרות.`],
    [carry?+`${D.h+B}${D.t+T}${D.o}`:null, `יצא מספר ארוך מדי. ${D.t+T} עשרות זה ${(D.t+T)*10}, כלומר עוד מאה.`],
    [B?a+B:null, `הוספת ${B} אחדות. ${B*100} זה ${B} מאות.`],
    [B?a+B*10:null, `הוספת ${B} עשרות. ${B*100} זה ${B} מאות.`],
    [s-10, 'קרוב! ספרי שוב את הקפיצות של 10.'], [s+10, 'קרוב! ספרי שוב את הקפיצות של 10.']
  ]; }
function wrongFrom(list,x,a){ const hit=list.find(([v])=>v===x); if(hit) return hit[1];
  if(a!=null && x%10!==a%10) return `בקפיצות של מאות ועשרות האחדות לא זזות. התשובה חייבת להיגמר ב-${a%10}.`; return null; }
LESSONS['h4.2']={id:'ח4.2', title:'קפיצות', explain:[
  {say:'בשיעור הקודם פירקנו את שני המספרים. היום דרך נוספת: משאירות את 573 שלם, וקופצות.', vis:()=>numberLine({min:540,max:940,points:[{v:573,strong:1}]})+decomp(340,300,40)},
  {say:'קודם 300: שלוש קפיצות של 100. 673, 773, 873.', vis:()=>numberLine({min:540,max:940,points:[{v:573,strong:1},{v:673},{v:773},{v:873,strong:1}],arcs:[{from:573,to:673,label:'+100'},{from:673,to:773,label:'+100'},{from:773,to:873,label:'+100'}]})+decomp(340,300,40)},
  {say:'עכשיו 40: ארבע קפיצות של 10. 883, 893, 903, 913. עברנו את 900!', vis:()=>`<p class="decomp ltr">573 + 300 = 873</p>`+numberLine({min:866,max:920,points:[{v:873,strong:1},{v:883},{v:893},{v:900,label:'900',strong:1},{v:913,strong:1}],arcs:[873,883,893,903].map(v=>({from:v,to:v+10,label:'+10',color:COL.arc2}))})},
  {say:'בדיקה: האחדות לא זזו. התחלנו ב-3 וסיימנו ב-3. אותה תשובה כמו בדרך של העמודות.', vis:()=>numberLine({min:540,max:940,points:[{v:573,strong:1},{v:873},{v:913,strong:1}],arcs:[{from:573,to:873,label:'+300'},{from:873,to:913,label:'+40',color:COL.arc2}]})+`<p class="decomp ltr">57<b class="hl">3</b> + 340 = 91<b class="hl">3</b></p>`}
 ],
 together:[[426,230],[568,250]].map(([a,b])=>()=>{ const B=Math.floor(b/100)*100, T=b-B, W=jumpsWrongs(a,b);
   return {say:`${L(`${a} + ${b}`)}: קופצות.`, eq:[`${a} + ${b} =`,{sum:a+b}],
    fields:[{q:`${b} זה ${B} ועוד כמה?`, label:`${b} = ${B} +`, ans:T},
            {q:`קופצות ${B} מ-${a}. לאן הגעת?`, label:`${a} + ${B} =`, ans:a+B, wrong:x=>x===a+B/100?`הוספת ${B/100} אחדות. ${B} זה ${B/100} מאות.`:null},
            {q:`קופצות ${T}. לאן הגעת?`, label:`${a+B} + ${T} =`, ans:a+b, wrong:x=>wrongFrom(W,x,a)||(T>=50?`בקפיצות של 10: ${[1,2,3,4,5].map(k=>a+B+k*10).join(', ')}.`:null)}],
    vis:st=>{ const s=a+b, arcs=[]; if(st.done>=2||st.f===1) arcs.push({from:a,to:a+B,label:'+'+B,pending:st.done<2}); if(st.done>=3||st.f===2) arcs.push({from:a+B,to:s,label:'+'+T,color:COL.arc2,pending:st.done<3});
      const pts=[{v:a,strong:1}]; if(st.done>=2) pts.push({v:a+B}); if(st.done>=3) pts.push({v:s,strong:1});
      return numberLine({min:a-30,max:s+30,points:pts,arcs})+(st.done>=1?decomp(b,B,T):''); },
    end:'הנחיתה האחרונה היא התשובה.'}; }),
 levels:[1,2,2,4,5,6],
 gen(lv){ let a,b,B,T;
   for(;;){ a=r(121,689); const D=digits(a); if(!D.t||!D.o) continue;
     if(lv===1){ B=r(1,4); T=0; if(D.h+B>9) continue; }
     else { B=lv===4?0:r(1,4); T=r(1,8);
       const tt=D.t+T; if(lv===2&&tt>9) continue; if((lv===4||lv===5)&&(tt<11||tt>15)) continue; if(lv===6&&tt!==10) continue; }
     b=B*100+T*10; if(a+b>999||b<10) continue;
     const W=jumpsWrongs(a,b); if(!distinct(a+b,W.map(w=>w[0]))) continue; break; }
   const s=a+b, W=jumpsWrongs(a,b), Bh=B*100, Tt=T*10;
   return {say:`כמה זה ${L(`${a} + ${b}`)}?`, eq:[`${a} + ${b} =`,{f:0}], fields:[{ans:s, wrong:x=>wrongFrom(W,x,a)}], showVis:'hint',
     vis:st=>{ const arcs=[]; if(Bh) arcs.push({from:a,to:a+Bh,label:'+'+Bh,pending:!st.finished}); if(Tt) arcs.push({from:a+Bh,to:s,label:'+'+Tt,color:COL.arc2,pending:!st.finished});
       return numberLine({min:a-30,max:s+30,points:[{v:a,strong:1},...(st.finished?[{v:s,strong:1}]:[])],arcs})+(Bh&&Tt?decomp(b,Bh,Tt):''); },
     hints:[ Bh&&Tt?`איך מפרקות את ${b}? כמה מאות וכמה עשרות?`:`קופצות ${b} מ-${a}.`, Bh?`קפצי קודם ${Bh} מ-${a}. לאן הגעת?`:`קפצי ${Tt} בקפיצות של 10.`,
       Bh&&Tt?`${a} ← ${a+Bh}. עכשיו ${Tt} בקפיצות של 10.`:`${a} ועוד ${b} זה ${s}.`], level:lv}; },
 star(){ return {star:true, say:`⭐ שאלת אתגר: ${L('468 + 357')} בשלוש קפיצות: 300, 50, 7.`, eq:['468 + 357 =',{f:0}], fields:[{ans:825, wrong:x=>x===815?'כמעט! 818 ועוד 7 עובר את 820.':null}], showVis:'hint',
   vis:st=>numberLine({min:440,max:850,points:[{v:468,strong:1},...(st.finished?[{v:768},{v:818},{v:825,strong:1}]:[])],arcs:[{from:468,to:768,label:'+300',pending:!st.finished},{from:768,to:818,label:'+50',color:COL.arc2,pending:!st.finished},{from:818,to:825,label:'+7',small:1,color:'#23895A',pending:!st.finished}]}),
   hints:['קודם 300. לאן מגיעים?','768. עכשיו עוד 50.','768 ← 818 ← 825.']}; },
 parent:'קפיצות מתאימות כשהמספר השני עגול. שאלי אותה: "מתי קל לך לקפוץ, ומתי עמודות?"'
};

/* ח4.3 completing to the hundred */
const missWrong=(x,a)=>{ const t=Math.floor(a/10)%10, o=a%10, need=100-a%100;
  if(o && x===(10-t)*10+(10-o)) return `בואי נבדוק: ${a%100} + ${x} = ${a%100+x}. זה יותר מדי ב-10. קודם עד העשרת (${10-o}), ואז עד המאה (${need-(10-o)}).`;
  if(o && x===10-o) return `נכון, זה עד ${a+10-o}. ומשם עד ${a+need}?`; return null; };
function completeWrongs(a,b){ const up=(Math.floor(a/100)+1)*100, c=up-a, s=a+b;
  return [[up===s?null:up, `הגעת ל-${up}! נשארו עוד ${b-c} מתוך ${b}.`],[up+b, `${c} מתוך ${b} כבר שימשו כדי להגיע ל-${up}. מוסיפות רק מה שנשאר.`],
    [s-100, `${a} ועוד ${b} עובר את ${up}, אז התשובה גדולה מ-${up}.`],[s-10, `${a} ועוד ${b} עובר את ${up}. בדקי שוב מה נשאר אחרי ${up}.`]]; }
LESSONS['h4.3']={id:'ח4.3', title:'השלמה למאה', explain:[
  {say:'את מכירה חברים של 10: 7 ו-3. יש גם חברים של 100. כמה חסר ל-68 עד 100? קודם עד 70: חסרים 2. ומ-70 עד 100: עוד 30. ביחד 32.', vis:()=>numberLine({min:60,max:104,points:[{v:68,strong:1},{v:70}],station:100,arcs:[{from:68,to:70,label:'+2',small:1,color:COL.arc2},{from:70,to:100,label:'+30'}]})+`<p class="decomp">חסרים ${L('32')}</p>`},
  {say:'573 + 27: ל-573 חסרים 27 עד 600. ו-27 הוא בדיוק המספר השני! אז התשובה היא 600.', vis:()=>numberLine({min:560,max:610,points:[{v:573,strong:1}],station:600,arcs:[{from:573,to:600,label:'+27'}]})},
  {say:'468 + 35: ל-468 חסרים 32 עד 500. לוקחות 32 מתוך 35, ונשארים 3. 500 ועוד 3 זה 503.', vis:()=>numberLine({min:455,max:512,points:[{v:468,strong:1},{v:503,strong:1}],station:500,arcs:[{from:468,to:500,label:'+32'},{from:500,to:503,label:'+3',small:1,color:COL.arc2}]})+decomp(35,32,3)},
  {say:'מתי זה עוזר? כשמספר קרוב למאה הבאה, כמו 468. ב-412 + 35 נוח יותר לקפוץ.', vis:()=>numberLine({min:400,max:510,points:[{v:412},{v:468,strong:1}],station:500})}
 ],
 together:[
  ()=>({say:`${L('380 + 45')}: קודם משלימות ל-400.`, eq:['380 + 45 =',{sum:425}],
    fields:[{q:'כמה חסר מ-380 עד 400?', label:'380 → 400', ans:20, wrong:x=>x===30?'ספרי בעשרות: 390, 400. כמה עשרות?':null},{q:'45 זה 20 ועוד כמה?', label:'45 = 20 +', ans:25},{q:'400 + 25 = ?', label:'400 + 25 =', ans:425, wrong:x=>x===445?'את ה-20 כבר הוספנו כדי להגיע ל-400.':null}],
    vis:st=>numberLine({min:370,max:435,points:[{v:380,strong:1},...(st.done>=3?[{v:425,strong:1}]:[])],station:400,arcs:[...(st.done>=1?[{from:380,to:400,label:'+20'}]:[]),...(st.done>=2?[{from:400,to:425,label:'+25',color:COL.arc2,pending:st.done<3}]:[])]})+(st.done>=2?decomp(45,20,25):'')}),
  ()=>({say:`${L('476 + 38')}: קודם משלימות ל-500.`, eq:['476 + 38 =',{sum:514}],
    fields:[{q:'כמה חסר מ-476 עד 480?', label:'476 → 480', ans:4},{q:'ומ-480 עד 500?', label:'480 → 500', ans:20},{q:'חסרים 24. ו-38 זה 24 ועוד כמה?', label:'38 = 24 +', ans:14, wrong:x=>x===24?'24 כבר הלכו להשלמה. ספרי מ-24 עד 38.':null},{q:'500 + 14 = ?', label:'500 + 14 =', ans:514, wrong:x=>x===538?'מוסיפות רק את מה שנשאר: 14.':null}],
    vis:st=>numberLine({min:468,max:522,points:[{v:476,strong:1},...(st.done>=1?[{v:480}]:[]),...(st.done>=4?[{v:514,strong:1}]:[])],station:500,arcs:[...(st.done>=1?[{from:476,to:480,label:'+4',small:1,color:'#23895A'}]:[]),...(st.done>=2?[{from:480,to:500,label:'+20'}]:[]),...(st.done>=3?[{from:500,to:514,label:'+14',color:COL.arc2,pending:st.done<4}]:[])]})+(st.done>=3?decomp(38,24,14):'')})
 ],
 levels:[1,1,3,4,4,6],
 gen(lv){ let a,b;
   for(;;){ const H=r(1,8);
     if(lv===1){ const T=r(7,9); a=H*100+T*10; const c=100-T*10; b=c+r(1,49); if(b>=100||b%10===0) continue; }
     else if(lv===3){ const rr=r(71,98); if(rr%10===0) continue; a=H*100+rr; b=100-rr; }
     else if(lv===4){ const rr=r(71,98); if(rr%10===0) continue; a=H*100+rr; b=100-rr+r(1,40); if(b>=100||b%10===0) continue; }
     else { const rr=r(91,98); a=r(1,6)*100+rr; const c=100-rr; b=r(1,3)*100+r(1,8)*10+r(c,9); }
     if(a+b>999) continue; if(!distinct(a+b,completeWrongs(a,b).map(w=>w[0]))) continue; break; }
   const up=(Math.floor(a/100)+1)*100, c=up-a, s=a+b, W=completeWrongs(a,b);
   return {say:`כמה זה ${L(`${a} + ${b}`)}?`, eq:[`${a} + ${b} =`,{f:0}], fields:[{ans:s, wrong:x=>wrongFrom(W,x)}], showVis:'hint',
     vis:st=>numberLine({min:a-Math.max(8,c*.3),max:s+Math.max(8,(s-up)*.3+6),points:[{v:a,strong:1},...(st.finished?[{v:s,strong:1}]:[])],station:up,arcs:[{from:a,to:up,label:'+'+c},...(s>up?[{from:up,to:s,label:'+'+(s-up),color:COL.arc2,pending:!st.finished}]:[])]})+(s>up?decomp(b,c,b-c):''),
     hints:[`לאיזו מאה ${a} קרוב? כמה חסר לו עד שם?`, a%10?`מ-${a} עד ${a+10-a%10} חסרים ${10-a%10}, ומשם עד ${up} עוד ${c-(10-a%10)}. ביחד ${c}. כמה נשאר מ-${b}?`:`עד ${up} חסרים ${c}. כמה נשאר מ-${b}?`,
       `${a} + ${c} = ${up}, ונשארו ${b-c}. ${up} + ${b-c} = ?`], level:lv}; },
 star(){ return {star:true, say:'⭐ שאלת אתגר: כמה חסר מ-387 עד 1000?', eq:['387 + ? = 1000 →',{f:0}], fields:[{ans:613, wrong:x=>missWrong(x,387)||(x===713?'קודם עד 390, אחר כך עד 400, ואז עד 1000.':null)}], showVis:'hint',
   vis:()=>numberLine({min:370,max:1010,points:[{v:387,strong:1},{v:400}],station:1000,arcs:[{from:387,to:400,label:'+13',small:1,color:COL.arc2},{from:400,to:1000,label:'+?',pending:1}]}),
   hints:['קודם עד 390, אחר כך עד 400, ואז עד 1000.','מ-387 עד 400 חסרים 13. ומ-400 עד 1000?','13 ועוד 600.']}; },
 parent:'הטעות 68 + 42 = 100 נפוצה מאוד. אם היא חוזרת, תרגלו בעל פה "חברים של 100" עם מספרים כמו 70, 75, 68.'
};

/* כ1.1 equal groups: "3 × 4" is "3 פעמים 4": the first number says how many times, the second how many each time */
function timesWrongs(n,k){ return [[n+k,`חיברת את מספר הצלחות למספר התותים. בכל צלחת ${k}: כמה בשתי צלחות? ובשלוש?`],[k,'זה בצלחת אחת. וכמה בכל הצלחות?'],[(n-1)*k,'ספרי שוב את הצלחות.'],[(n+1)*k,'ספרי שוב את הצלחות.']]; }
function pickNK(used,ks=[2,3,4,5,10],nmax=5,pmax=30){ for(let t=0;;t++){ const n=r(2,nmax), k=pick(ks); if(n===k||n*k>pmax) continue; if(t<300&&(used.has(n+'x'+k)||!distinct(n*k,timesWrongs(n,k).map(w=>w[0])))) continue; used.add(n+'x'+k); return [n,k]; } }
const swapSoft=(n,k)=>x=>x===k&&n!==k?{soft:1,text:`יוצא אותו מספר, נכון! כאן כותבות קודם כמה פעמים: ${n} צלחות, אז ${n} × ${k}.`}:null;
LESSONS['k1.1']={id:'כ1.1', title:'קבוצות שוות', explain:[
  {say:'יש פה 3 צלחות, ובכל צלחת 4 תותים. בכל הצלחות אותו מספר: אלה קבוצות שוות.', vis:()=>plates({ks:[4,4,4]})},
  {say:'כמה תותים יש? אפשר לחבר: 4 + 4 + 4 = 12.', vis:()=>plates({ks:[4,4,4],lit:2,totals:true})+`<p class="decomp ltr">4 + 4 + 4 = 12</p>`},
  {say:'יש דרך קצרה לכתוב: 3 × 4. קוראים "שלוש כפול ארבע", וזה אומר 3 פעמים 4. הראשון: כמה פעמים. השני: כמה בכל פעם.', vis:()=>plates({ks:[4,4,4]})+`<p class="decomp ltr"><span class="cp">3</span> × <span class="ck">4</span> = 12</p><p class="legend"><span class="cp">3 צלחות</span> · <span class="ck">4 בכל צלחת</span></p>`},
  {say:'ופה? בצלחת אחת 2, בשנייה 5, בשלישית 3. אפשר לכתוב "פעמים"?', vis:()=>plates({ks:[2,5,3]}), ask:{options:['כן','לא'], ok:1, then:'נכון, כדי לכתוב "פעמים" כל הקבוצות צריכות להיות שוות.', no:'בואי נסתכל: בכל צלחת מספר אחר. "פעמים" זה רק כשבכל הקבוצות אותו מספר.'}}
 ],
 together:[
  ()=>({say:'5 צלחות, ובכל אחת 2 תותים.', eq:['5 × 2 =',{f:3}], fields:[{q:'כמה צלחות?',label:'צלחות',ans:5},{q:'כמה בכל צלחת?',label:'בכל צלחת',ans:2},{q:'כמה זה 2 + 2 + 2 + 2 + 2?',label:'2 + 2 + 2 + 2 + 2 =',ans:10,wrong:x=>x===7?'חיברת צלחות ותותים. 2, 4, 6, ...':null},{q:'אז כמה זה 5 × 2?',ans:10}],
    vis:st=>plates({ks:[2,2,2,2,2],lit:st.done>=2?4:-1,totals:st.done>=3})}),
  ()=>({say:'4 צלחות, ובכל אחת 3 תותים.', eq:[{f:3},'×',{f:4},'=',{f:5}], fields:[{q:'כמה צלחות?',label:'צלחות',ans:4},{q:'כמה בכל צלחת?',label:'בכל צלחת',ans:3},{q:'כמה זה 3 + 3 + 3 + 3?',label:'3 + 3 + 3 + 3 =',ans:12},
      {q:'עכשיו כתבי את התרגיל בעצמך: כמה פעמים?',ans:4,wrong:swapSoft(4,3)},{q:'וכמה בכל פעם?',ans:3},{q:'וכמה יוצא?',ans:12}],
    vis:st=>plates({ks:[3,3,3,3],lit:st.done>=2?3:-1,totals:st.done>=3})})
 ],
 levels:['total','write','choice','repeat','write'],
 gen(lv,used){ const [n,k]=pickNK(used); const W=timesWrongs(n,k), wr=x=>wrongFrom(W,x);
   const help=[`כמה צלחות? וכמה בכל צלחת?`,`ספרי בקפיצות: ${k}, ${2*k}, ...`,`${Array(n).fill(k).join(' + ')} = ${n*k}`];
   if(lv==='total') return {say:`${n} צלחות, ובכל צלחת ${k} תותים. כמה תותים יש בסך הכול?`, eq:['סך הכול:',{f:0}], fields:[{ans:n*k,wrong:wr}], showVis:'always', vis:st=>plates({ks:Array(n).fill(k),lit:st.helped||st.finished?n-1:-1,totals:st.helped||st.finished}), hints:help, level:lv};
   if(lv==='write') return {say:'כתבי את התרגיל של התמונה, וכמה יוצא.', eq:[{f:0},'×',{f:1},'=',{f:2}], fields:[{q:'כמה פעמים? (כמה צלחות)',ans:n,wrong:swapSoft(n,k)},{q:'כמה בכל פעם?',ans:k},{q:'כמה יוצא?',ans:n*k,wrong:wr}], showVis:'always', vis:st=>plates({ks:Array(n).fill(k),lit:st.helped||st.finished?n-1:-1,totals:st.helped||st.finished}), hints:help, level:lv};
   if(lv==='choice'){ const odd=[k-1,k+2,k].map(x=>Math.max(1,Math.min(10,x))); const opts=shuffle([{html:plates({ks:Array(n).fill(k)}),ok:1},{html:plates({ks:[n,k]}),ok:0,why:`זו צלחת עם ${n} וצלחת עם ${k}. ${n} × ${k} זה ${n} צלחות, בכל אחת ${k}.`},{html:plates({ks:Array(n).fill(0).map((_,i)=>odd[i%3])}),ok:0,why:'כאן הצלחות לא שוות. "פעמים" זה רק כשבכל הצלחות אותו מספר.'}]);
     return {say:`איזו תמונה היא ${L(`${n} × ${k}`)}?`, eq:[], fields:[{choice:opts, wrongText:i=>opts[i].why}], showVis:'never', hints:[`${n} × ${k}: ${n} פעמים ${k}. כמה צלחות צריכות להיות?`,`מחפשות ${n} צלחות, ובכל אחת בדיוק ${k}.`,'זו התמונה עם הצלחות השוות.'], level:lv}; }
   return {say:'כמה פעמים כתוב '+k+'?', eq:[`${Array(n).fill(k).join(' + ')} =`,{f:0},`× ${k}`], fields:[{ans:n,wrong:x=>x===n*k?`${n*k} זה כמה יוצא. כמה פעמים כתוב ${k}?`:x===k?`${k} זה כמה בכל פעם. כמה פעמים הוא כתוב?`:null}], showVis:'hint', vis:()=>plates({ks:Array(n).fill(k)}), hints:[`ספרי כמה פעמים כתוב ${k}.`,`כל ${k} הוא צלחת אחת. כמה צלחות?`,`${n} פעמים.`], level:lv}; },
 star(){ return {star:true, say:'⭐ שאלת אתגר: יש 12 תותים. רוצות לחלק אותם ל-3 צלחות, בכל צלחת אותו מספר. כמה בכל צלחת?', eq:['בכל צלחת:',{f:0}], fields:[{ans:4,wrong:x=>x===9?'9 זה אם לוקחים 3. צריך שיהיה אותו מספר בכל צלחת, ו-12 ביחד.':x===36?'זה יותר מדי. יש רק 12 תותים.':null}], showVis:'hint',
   vis:st=>plates({ks:st.finished?[4,4,4]:[0,0,0]}), hints:['נסי לשים תות אחד בכל צלחת, ועוד אחד...','3 פעמים כמה זה 12?','3 × 4 = 12.']}; },
 parent:'בבית: "תני לי 4 פעמים 3 כפיות". העיקר שתאמר "פעמים" ותראה קבוצות שוות.'
};

/* כ1.2 equal jumps from 0 on a scaled line */
function jumpWrongs(n,k){ return [[(n-1)*k,'ספרי את הקשתות, לא את הנקודות. ה-0 הוא ההתחלה.'],[(n+1)*k,'ספרי את הקשתות, לא את הנקודות. ה-0 הוא ההתחלה.'],[n+k,`זה ${n} ועוד ${k}. אבל יש ${n} קפיצות, ובכל אחת ${k}.`],[n*k-1,`קפיצה של ${k}: מ-${(n-1)*k} סופרות ${k} שנתות.`],[n*k+1,`קפיצה של ${k}: מ-${(n-1)*k} סופרות ${k} שנתות.`],[k,'זו קפיצה אחת. כמה קפיצות צריך?']]; }
const maxFor=p=>p<=30?30:50;
LESSONS['k1.2']={id:'כ1.2', title:'קפיצות שוות', explain:[
  {say:'זוכרת 4 צלחות עם 5 תותים? עכשיו כל צלחת הופכת לקפיצה של 5.', vis:()=>plates({ks:[5,5,5,5]})+jumpLine({max:30,k:5,count:4,landings:false})},
  {say:'מתחילות ב-0. קפיצה ראשונה: 5. שנייה: 10. שלישית: 15. רביעית: 20.', vis:()=>jumpLine({max:30,k:5,count:4})+`<p class="decomp ltr">5, 10, 15, 20</p>`},
  {say:'4 קפיצות של 5, כלומר 4 פעמים 5: 4 × 5 = 20. סופרות קפיצות, לא שנתות. ה-0 הוא ההתחלה, לא קפיצה.', vis:()=>jumpLine({max:30,k:5,count:4,numbered:true})+`<p class="decomp ltr">4 × 5 = 20</p>`},
  {say:'3 × 10: קפיצות של 10. 10, 20, 30.', vis:()=>jumpLine({max:50,k:10,count:3})+`<p class="decomp ltr">3 × 10 = 30</p>`}
 ],
 together:[[6,2],[3,4]].map(([n,k])=>()=>({say:`${L(`${n} × ${k}`)}: ${n} קפיצות של ${k}. לאן נוחתות בכל קפיצה?`, eq:[`${n} × ${k} =`,{f:n}],
   fields:[...Array(n).fill(0).map((_,i)=>({q:`קפיצה ${i+1}: לאן הגעת?`,label:`קפיצה ${i+1}`,ans:(i+1)*k,wrong:x=>x===i*k+1||x===(i+1)*k-1?`קפיצה של ${k}: מ-${i*k} סופרות ${k} שנתות.`:null})),{q:`אז כמה זה ${n} × ${k}?`,ans:n*k,wrong:x=>wrongFrom(jumpWrongs(n,k),x)}],
   vis:st=>jumpLine({max:maxFor(n*k),k,count:Math.min(st.done,n),pendingNext:st.done<n})})),
 levels:[2,10,5,'write','34'],
 gen(lv,used){ let n,k; const ks=lv==='write'||lv==='34'?[3,4]:[lv];
   for(let t=0;;t++){ n=r(2,6); k=pick(ks); const p=n*k; if(n===k||p>(k>=5?50:30)) continue; if(t<300&&(used.has(n+'x'+k)||!distinct(p,jumpWrongs(n,k).map(w=>w[0])))) continue; used.add(n+'x'+k); break; }
   const W=jumpWrongs(n,k), help=[`כמה קפיצות? וכמה כל קפיצה?`,`הראשונה מגיעה ל-${k}. לאן השנייה?`,Array(n).fill(0).map((_,i)=>(i+1)*k).join(', ')], max=maxFor(n*k);
   if(lv==='write') return {say:'כתבי את התרגיל של הקפיצות, וכמה יוצא.', eq:[{f:0},'×',{f:1},'=',{f:2}], fields:[{q:'כמה קפיצות?',ans:n,wrong:x=>x===k?{soft:1,text:`יוצא אותו מספר! כאן כותבות קודם כמה קפיצות: ${n}.`}:x===n+1?'ספרי את הקשתות, לא את הנקודות.':null},{q:'כמה כל קפיצה?',ans:k},{q:'לאן נחתו בסוף?',ans:n*k,wrong:x=>wrongFrom(W,x)}],
     showVis:'always', vis:st=>jumpLine({max,k,count:n,landings:st.finished,numbered:!st.finished}), hints:help, level:lv};
   return {say:`כמה זה ${L(`${n} × ${k}`)}? ${n} קפיצות של ${k}.`, eq:[`${n} × ${k} =`,{f:0}], fields:[{ans:n*k,wrong:x=>wrongFrom(W,x)}], showVis:'hint',
     vis:st=>jumpLine({max,k,count:st.finished?n:1,pendingNext:!st.finished}), hints:help, level:lv}; },
 star(){ return {star:true, say:'⭐ שאלת אתגר: קפצו קפיצות של 5 והגיעו ל-25. כמה קפיצות?', eq:['קפיצות:',{f:0}], fields:[{ans:5,wrong:x=>x===20?'20 זה לאן מגיעים לפני הקפיצה האחרונה. כמה קשתות?':x===6?'ה-0 הוא ההתחלה, לא קפיצה.':null}], showVis:'hint',
   vis:st=>jumpLine({max:30,k:5,count:5,numbered:st.finished}), hints:['ספרי בחמישיות עד 25: 5, 10, ...','5, 10, 15, 20, 25: כמה מספרים אמרת?','5 קפיצות.']}; },
 parent:'ספירה בקפיצות (5, 10, 15) היא הבסיס ללוח הכפל. אפשר לתרגל אותה בקול בהליכה.'
};

/* כ1.3 arrays and turning them around */
LESSONS['k1.3']={id:'כ1.3', title:'מערך והחלפה', explain:[
  {say:'3 צלחות עם 5 תותים. נסדר כל צלחת בשורה, ונוריד את הצלחות. זה נקרא מערך: 3 שורות, בכל שורה 5.', vis:()=>plates({ks:[5,5,5]})+dotArray({rows:3,cols:5})},
  {say:'3 שורות של 5: 3 × 5. סופרות לפי שורות: 5, 10, 15.', vis:()=>dotArray({rows:3,cols:5,lit:2,sums:true})+`<p class="decomp ltr">3 × 5 = 15</p>`},
  {say:'עכשיו נסובב.', vis:st=>st.rot?dotArray({rows:5,cols:3,spin:true})+`<p class="decomp ltr">5 × 3 = 15 &nbsp;&nbsp; 3 × 5 = 15</p>`:dotArray({rows:3,cols:5}), ask:{rotate:1, then:'עכשיו 5 שורות, בכל שורה 3: 5 × 3. לא הוספנו אף נקודה ולא הורדנו. אז 5 × 3 = 15, כמו 3 × 5.'}},
  {say:'זה עוזר! 8 × 2 זה 8 קפיצות קטנות. מסובבות: 2 × 8 = 8 + 8 = 16. בוחרות את הסדר הנוח.', vis:()=>`<div class="pair">${dotArray({rows:8,cols:2})}<span class="arrow-r">⟵</span>${dotArray({rows:2,cols:8,spin:true})}</div><p class="decomp ltr">8 × 2 = 2 × 8 = 16</p>`}
 ],
 together:[
  ()=>({say:'מערך של נקודות.', eq:[], fields:[{q:'כמה שורות? (שורה הולכת לרוחב)',label:'שורות',ans:2,wrong:x=>x===7?'זה כמה נקודות יש בשורה אחת. שורה הולכת לרוחב, כמו שורה במחברת. כמה שורות כאלה?':null},{q:'כמה בכל שורה?',label:'בכל שורה',ans:7},{q:'2 × 7 = ?',label:'2 × 7 =',ans:14,wrong:x=>x===9?'חיברת שורות ונקודות. 7, 14...':null},
      {q:'עכשיו לחצי על "לסובב".',rotate:1},{q:'כמה שורות עכשיו?',label:'שורות',ans:7},{q:'כמה בכל שורה?',label:'בכל שורה',ans:2},{q:'7 × 2 = ?',label:'7 × 2 =',ans:14}],
    vis:st=>st.done>=4?dotArray({rows:7,cols:2,spin:st.done===4}):dotArray({rows:2,cols:7,lit:st.done>=2?1:-1,sums:st.done>=2}), end:'אותו מספר!'}),
  ()=>({say:'מערך של נקודות.', eq:[], fields:[{q:'כמה שורות?',label:'שורות',ans:4,wrong:x=>x===6?'זה כמה נקודות בשורה אחת. כמה שורות?':null},{q:'כמה בכל שורה?',label:'בכל שורה',ans:6},{q:'4 × 6 = ?',label:'4 × 6 =',ans:24,wrong:x=>x===10?'חיברת שורות ונקודות. 6, 12, ...':null},{q:'ובלי לספור שוב: 6 × 4 = ?',label:'6 × 4 =',ans:24,wrong:x=>x!==24?'כשמסובבים, מוסיפים נקודות?':null}],
    vis:st=>dotArray({rows:4,cols:6,lit:st.done>=2?3:-1,sums:st.done>=2})})
 ],
 levels:['count','write','swap','missing','turn'],
 gen(lv,used){ const pair=()=>{ for(let t=0;;t++){ const a=r(2,5), b=r(2,7); if(a===b||a*b>30||(t<300&&used.has(a+'x'+b))) continue; used.add(a+'x'+b); return [a,b]; } };
   if(lv==='count'||lv==='write'){ const [R,C]=pair(); const help=['כמה שורות? וכמה בכל שורה?',`סופרות לפי שורות: ${C}, ${2*C}, ...`,`${Array(R).fill(0).map((_,i)=>(i+1)*C).join(', ')}`];
     const wr=x=>x===R+C?`חיברת שורות ונקודות. בכל שורה ${C}, ויש ${R} שורות: ${C}, ${2*C}, ...`:x===(R-1)*C||x===(R+1)*C?'ספרי שוב את השורות.':null;
     if(lv==='count') return {say:'כמה נקודות יש במערך?', eq:['סך הכול:',{f:0}], fields:[{ans:R*C,wrong:wr}], showVis:'always', vis:st=>dotArray({rows:R,cols:C,lit:st.helped||st.finished?R-1:-1,sums:st.helped||st.finished}), hints:help, level:lv};
     return {say:'כתבי את התרגיל של המערך: שורות × בכל שורה.', eq:[{f:0},'×',{f:1},'=',{f:2}], fields:[{q:'כמה שורות?',ans:R,wrong:x=>x===C?'זה כמה נקודות בשורה אחת. שורה הולכת לרוחב. כמה שורות?':null},{q:'כמה בכל שורה?',ans:C},{q:'כמה יוצא?',ans:R*C,wrong:wr}], showVis:'always', vis:st=>dotArray({rows:R,cols:C,lit:st.helped||st.finished?R-1:-1,sums:st.helped||st.finished}), hints:help, level:lv}; }
   if(lv==='swap'){ const a=r(3,5), b=r(6,7); return {say:`${L(`${a} × ${b} = ${a*b}`)}. אז כמה זה ${L(`${b} × ${a}`)}?`, eq:[`${b} × ${a} =`,{f:0}], fields:[{ans:a*b,wrong:x=>'כשסובבנו, הוספנו נקודות?'}], showVis:'hint', vis:st=>`<div class="pair">${dotArray({rows:a,cols:b})}<span class="arrow-r">⟵</span>${dotArray({rows:b,cols:a,spin:1})}</div>`, hints:['כשסובבנו, הוספנו נקודות?','זה אותו מערך, רק מסובב.',`${b} × ${a} = ${a} × ${b} = ${a*b}`], level:lv}; }
   if(lv==='missing'){ const m=r(3,9), two=pick([2,10]); return {say:'איזה מספר חסר?', eq:[`${two} × ${m} = ${m} ×`,{f:0}], fields:[{ans:two,wrong:x=>x===two*m?`${two*m} זה כמה יוצא. כאן שואלות איזה מספר חסר: ${m} × ?`:x===m?`${m} כבר כתוב. מה המספר השני בצד השמאלי?`:null}], showVis:'hint', vis:()=>`<div class="pair">${dotArray({rows:two===10?2:two,cols:m})}</div>`, hints:['מסובבות: מה מתחלף עם מה?',`${two} × ${m} ו-${m} × ${two} הם אותו מערך.`,`${m} × ${two}`], level:lv}; }
   const m=r(6,9); return {say:`כמה זה ${L(`${m} × 2`)}?`, eq:[`${m} × 2 =`,{f:0}], fields:[{ans:m*2,wrong:x=>x===m+2?`זה ${m} ועוד 2. סובבי: 2 × ${m} = ${m} + ${m}.`:null}], showVis:'hint', vis:()=>dotArray({rows:2,cols:m,lit:1,sums:1}), hints:[`סובבי: 2 × ${m} = ${m} + ${m}.`,`${m} + ${m} = ?`,`${m} + ${m} = ${2*m}`], level:lv}; },
 star(){ return {star:true, say:'⭐ שאלת אתגר: 12 נקודות בשורות שוות: 3 × 4. מצאי סידור אחר.', eq:[{f:0},'×',{f:1},'= 12'], fields:[{q:'כמה שורות?',ans:null,any:1},{q:'כמה בכל שורה?',ans:null,any:1}], showVis:'never', hints:['נסי 2 שורות. כמה בכל שורה?','2 × 6 = 12','גם 6 × 2, 1 × 12.']}; },
 parent:'ההחלפה חוסכת חצי מלוח הכפל. שאלי: "האם זה עובד גם בחיסור? 5 − 3 ו-3 − 5?" כדי שלא תכליל.'
};

/* ח3.3 jumps on an empty line, two-digit: keep the first number whole, jump the tens, then the ones */
function jumps2Wrongs(a,b){ const T=Math.floor(b/10)*10, U=b%10, s=a+b, oc=a%10+U>=10;
  return [[U&&T?a+T:null,`הגעת ל-${a+T}, זו הקפיצה של העשרות! נשארה עוד קפיצה של ${U}.`],[T&&U?a+U:null,`קפצת ${U}. ומה עם ה-${T}?`],
    [oc?s-10:null,`כמעט! ${a+T} ועוד ${U} עובר את ${(Math.floor((a+T)/10)+1)*10}.`],[oc?null:s+10,'קרוב! ספרי שוב את הקפיצות.'],[a+T/10,`הוספת ${T/10} אחדות. ${T} זה ${T/10} עשרות.`]]; }
LESSONS['h3.3']={id:'ח3.3', title:'קפיצות על הציר', explain:[
  {say:'46 + 38. משאירות את 46 שלם, ומפרקות רק את 38: 30 ועוד 8.', vis:()=>numberLine({min:40,max:90,points:[{v:46,strong:1}]})+decomp(38,30,8)},
  {say:'קודם קופצות 30: שלוש קפיצות של 10. 56, 66, 76.', vis:()=>numberLine({min:40,max:90,points:[{v:46,strong:1},{v:56},{v:66},{v:76,strong:1}],arcs:[{from:46,to:56,label:'+10'},{from:56,to:66,label:'+10'},{from:66,to:76,label:'+10'}]})},
  {say:'עכשיו 8. מ-76 עד 80 זה 4, ועוד 4 זה 84.', vis:()=>numberLine({min:40,max:90,points:[{v:46,strong:1},{v:76},{v:80},{v:84,strong:1}],arcs:[{from:46,to:76,label:'+30'},{from:76,to:80,label:'+4',small:1,color:COL.arc2},{from:80,to:84,label:'+4',small:1,color:COL.arc2}]})+`<p class="decomp ltr">46 + 38 = 84</p>`}
 ],
 together:[[34,25],[57,26]].map(([a,b])=>()=>{ const T=Math.floor(b/10)*10, U=b%10, W=jumps2Wrongs(a,b);
   return {say:`${L(`${a} + ${b}`)}: קופצות.`, eq:[`${a} + ${b} =`,{sum:a+b}],
    fields:[{q:`${b} זה ${T} ועוד כמה?`, label:`${b} = ${T} +`, ans:U},{q:`קופצות ${T} מ-${a}. לאן הגעת?`, label:`${a} + ${T} =`, ans:a+T},{q:`קופצות ${U}. לאן הגעת?`, label:`${a+T} + ${U} =`, ans:a+b, wrong:x=>wrongFrom(W,x)}],
    vis:st=>{ const s=a+b, arcs=[]; if(st.done>=2||st.f===1) arcs.push({from:a,to:a+T,label:'+'+T,pending:st.done<2}); if(st.done>=3||st.f===2) arcs.push({from:a+T,to:s,label:'+'+U,color:COL.arc2,pending:st.done<3});
      return numberLine({min:a-6,max:s+6,points:[{v:a,strong:1},...(st.done>=2?[{v:a+T}]:[]),...(st.done>=3?[{v:s,strong:1}]:[])],arcs})+(st.done>=1?decomp(b,T,U):''); },
    end:'הנחיתה האחרונה היא התשובה.'}; }),
 levels:[1,2,3,3,4],
 gen(lv){ let a,b;
   for(let t=0;;t++){ a=r(13,68); b=r(12,39); const ao=a%10, bo=b%10; if(!ao) continue;
     if(lv===1){ b=r(2,4)*10; } else if(!bo) continue;
     const oc=ao+b%10>=10; if(lv===2&&oc) continue; if(lv>=3&&!oc) continue; if(lv===4&&b<25) continue;
     if(a+b>99) continue; if(t<300&&!distinct(a+b,jumps2Wrongs(a,b).map(w=>w[0]))) continue; break; }
   const T=Math.floor(b/10)*10, U=b%10, s=a+b, W=jumps2Wrongs(a,b);
   return {say:`כמה זה ${L(`${a} + ${b}`)}?`, eq:[`${a} + ${b} =`,{f:0}], fields:[{ans:s, wrong:x=>wrongFrom(W,x)}], showVis:'hint',
     vis:st=>numberLine({min:a-6,max:s+6,points:[{v:a,strong:1},...(st.finished?[{v:s,strong:1}]:[])],arcs:[...(T?[{from:a,to:a+T,label:'+'+T,pending:!st.finished}]:[]),...(U?[{from:a+T,to:s,label:'+'+U,color:COL.arc2,pending:!st.finished}]:[])]})+(T&&U?decomp(b,T,U):''),
     hints:[U?`איך מפרקות את ${b}? כמה עשרות וכמה אחדות?`:`קופצות ${b} בקפיצות של 10.`, `קפצי קודם ${T} מ-${a}. לאן הגעת?`, `${a} ← ${a+T} ← ${s}.`], level:lv}; },
 star(){ return {star:true, say:'⭐ שאלת אתגר: כמה חסר מ-38 עד 100?', eq:['38 + ? = 100 →',{f:0}], fields:[{ans:62, wrong:x=>missWrong(x,38)}], showVis:'hint',
   vis:()=>numberLine({min:30,max:104,points:[{v:38,strong:1},{v:40}],station:100,arcs:[{from:38,to:40,label:'+2',small:1,color:COL.arc2},{from:40,to:100,label:'+?',pending:1}]}),
   hints:['קודם עד 40, ואז עד 100.','מ-38 עד 40 חסרים 2. ומ-40 עד 100?','2 ועוד 60.']}; },
 parent:'קפיצות על ציר ריק הן הדרך שהכי עוזרת לחשב בראש. אפשר לשאול: "מאיפה קפצת, ולאן?"'
};

/* ---------- state ---------- */
const DEF=LESSONS[decodeURIComponent(location.hash.slice(1))]||LESSONS['h4.2'];
const COINS_PER=3;
const S={screen:'lesson', i:0, items:[], it:null, f:0, val:'', wrong:{}, done:0, finished:false, helped:false, showVis:false, note:null, toast:null, locked:false, step:0, asked:null, rot:false,
  starOffered:false, used:new Set(), lastLevel:null, lastHelped:false, reward:null, exT:{ms:0,from:null,frozen:false,running:false}, log:[]};
// the plan: explanation, 2 together, the solo slots (generated when reached)
function plan(){ S.items=[{type:'explain',phase:'הסבר'}, ...DEF.together.map(t=>({type:'task',phase:'שאלות',mode:'ביחד',make:t})), ...DEF.levels.map(lv=>({type:'task',phase:'שאלות',mode:'לבד',level:lv}))]; }
const soloCount=()=>DEF.levels.length, qCount=()=>DEF.together.length+soloCount();
const TRANS=()=>({1:{title:'סיימת את ההסבר!', text:'עכשיו פותרות ביחד, צעד אחרי צעד.', stop:1}, [1+DEF.together.length]:{title:'עכשיו לבד!', text:'אם צריך, הכפתור "רמז" מחזיר את התמונה.', stop:2}});
const STOPS=['הסבר','ביחד','לבד','סיכום'];

function startItem(){
  const P=S.items[S.i]; S.f=0; S.val=''; S.wrong={}; S.done=0; S.finished=false; S.helped=false; S.note=null; S.locked=false; S.step=0; S.asked=null; S.rot=false; S.totalWrong=0;
  S.exT={ms:0,from:null,frozen:false,running:false};
  if(P.type==='explain'){ S.it=null; return; }
  if(P.mode==='ביחד') S.it=P.make();
  else { // stay at the same level after a hard one, so the count "שאלה 3 מתוך 6" stays true
    const lv = S.lastHelped && S.lastLevel!=null ? S.lastLevel : P.level;
    S.it=P.star?DEF.star():DEF.gen(lv,S.used); S.it.level=lv; }
  S.showVis = S.it.showVis==='always' || !S.it.showVis;
  clearScratch();
}
const curField=()=>S.it?.fields[S.f];
function stV(){ return {f:S.f, done:S.done, finished:S.finished, helped:S.helped, rot:S.rot, step:S.step}; }

/* ---------- stopwatch (same as the place-value lesson) ---------- */
const fmt=ms=>{ const s=Math.floor(ms/1000); return `${Math.floor(s/60)}:${String(s%60).padStart(2,'0')}`; };
const exMs=()=>S.exT.ms+(S.exT.from!=null?Date.now()-S.exT.from:0);
function syncTimer(){ const run=S.exT.running && S.screen==='lesson' && !document.hidden && !S.exT.frozen && S.it;
  if(run && S.exT.from==null) S.exT.from=Date.now(); if(!run && S.exT.from!=null){ S.exT.ms+=Date.now()-S.exT.from; S.exT.from=null; } }
function freezeTimer(){ S.exT.frozen=true; syncTimer(); }
const timeTag=()=>exMs()>0?` ⏱ ${fmt(exMs())}`:'';
document.addEventListener('visibilitychange',syncTimer);
setInterval(()=>{ const el=document.getElementById('swt'); if(el && S.exT.running) el.textContent=fmt(exMs()); },500);

/* ---------- voice ---------- */
let VOICE=null;
function pickVoice(){ try{ const he=speechSynthesis.getVoices().filter(v=>/^he|^iw/i.test(v.lang)); const s=v=>(/premium/i.test(v.name)?4:0)+(/enhanced/i.test(v.name)?3:0); VOICE=he.sort((a,b)=>s(b)-s(a))[0]||null; }catch(e){} }
try{ pickVoice(); speechSynthesis.addEventListener('voiceschanged',pickVoice); }catch(e){}
function speak(t){ try{ speechSynthesis.cancel(); const u=new SpeechSynthesisUtterance(t); u.lang='he-IL'; if(VOICE) u.voice=VOICE; u.rate=.9; speechSynthesis.speak(u);}catch(e){} }

/* ---------- checking ---------- */
function toast(text, then){ const id={}; S.toast={text,id}; render(); setTimeout(()=>{ if(S.toast?.id===id){ S.toast=null; then?.(); render(); } },1500); }
function fieldDone(){
  S.done++; S.val=''; S.f++;
  if(S.f>=S.it.fields.length){ finish(); render(); return; }
  toast('נכון!');
}
function finish(){
  S.finished=true; S.locked=true; S.showVis=S.it.showVis!=='never'; freezeTimer();
  const it=S.it, last=it.fields[it.fields.length-1];
  S.note={ok:true, text:`${it.star?'פתרת את שאלת האתגר! ':'נכון! '}${it.end||''}${timeTag()}`};
  Shell.addCoins(it.star?8:COINS_PER);
  S.lastLevel=it.level; S.lastHelped=S.helped||S.totalWrong>=2;
  S.log.push({lesson:DEF.id, level:it.level, wrong:S.totalWrong, helped:S.helped, tags:S.tags||[]}); S.tags=[];
}
function check(x){
  const fd=curField(); if(!fd || S.locked) return;
  if(fd.any){ // any arrangement of 12 dots in equal rows, except the one we showed
    const a0=S.it.fields[0].ans; S.val='';
    if(S.f===0){ if(x<1||12%x){ S.note={text:`אי אפשר לסדר 12 ב-${x} שורות שוות. נסי מספר אחר.`}; render(); return; } fd.ans=x; S.note=null; fieldDone(); return; }
    if(a0*x!==12){ S.note={text:`${a0} × ${x} זה ${a0*x}, לא 12. נסי שוב.`}; render(); return; }
    if(a0===3&&x===4){ S.note={text:'זה הסידור שכבר יש. מצאי אחר!'}; S.it.fields[0].ans=null; S.f=0; S.done=0; render(); return; }
    if(a0===4&&x===3){ S.note={text:'זה הסיבוב! יש עוד סידור, עם מספר שורות אחר?'}; S.it.fields[0].ans=null; S.f=0; S.done=0; render(); return; }
    fd.ans=x; S.note=null; fieldDone(); return; }
  if(x===fd.ans){ S.note=null; fieldDone(); return; }
  const custom=fd.wrong?.(x);
  if(custom && custom.soft){ S.note={text:custom.text}; S.val=''; render(); return; } // the right idea, different order: not a mistake
  S.wrong[S.f]=(S.wrong[S.f]||0)+1; S.totalWrong=(S.totalWrong||0)+1; S.val=''; const w=S.wrong[S.f];
  if(typeof custom==='string') (S.tags ||= []).push(custom.slice(0,30));
  const H=S.it.hints||[];
  if(w>=2){ S.helped=true; if(S.it.showVis==='hint') S.showVis=true; }
  if(w>=3){ S.note={text:`התשובה היא ${fd.ans}. ${H[2]||''}`}; S.locked=true; setTimeout(()=>{ S.locked=false; S.done++; S.f++; if(S.f>=S.it.fields.length){ finish(); S.note={text:`התשובה היא ${fd.ans}. נמשיך.`}; } render(); },2200); render(); return; }
  S.note={text: custom || (fd.q && w===1 ? 'עוד לא. נסי שוב.' : H[Math.min(w-1,1)] || 'עוד לא. נסי שוב.')};
  render();
}
function choose(i){ const fd=curField(); if(!fd?.choice||S.locked) return;
  if(fd.choice[i].ok){ S.note=null; fieldDone(); return; }
  S.totalWrong=(S.totalWrong||0)+1; S.wrong[S.f]=(S.wrong[S.f]||0)+1; S.note={text:fd.wrongText?fd.wrongText(i):'עוד לא. נסי שוב.'}; render(); }

/* ---------- rendering ---------- */
function strip(){
  const P=S.items[S.i]; let lbl, dots, ph;
  if(P.type==='explain'){ const n=DEF.explain.length; lbl=`הסבר ${S.step+1} מתוך ${n}`; dots=Array(n).fill(0).map((_,i)=>`<i class="${i<S.step?'done':i===S.step?'now':''}"></i>`).join(''); ph='לומדות משהו חדש'; }
  else { const q=S.i, n=qCount(); lbl=S.it?.star?'⭐ שאלת אתגר':`שאלה ${q} מתוך ${n}`; dots=Array(n).fill(0).map((_,i)=>`<i class="${i<q-1?'done':i===q-1?'now':''}"></i>`).join(''); ph=P.mode==='ביחד'?'פותרות ביחד':'לבד'; }
  return `<div class="strip"><div class="strip-l"><span class="dots" aria-hidden="true">${dots}</span><span class="lbl">${lbl}</span><span class="ph">${ph}</span></div>${P.type==='explain'?'':swBtn()}</div>`;
}
function swBtn(){ const T=S.exT, ms=exMs();
  if(T.frozen) return ms>0?`<span class="sw-btn stopped">${ICON.watch}<span>${fmt(ms)}</span></span>`:'';
  if(T.running) return `<button class="sw-btn run" data-act="sw" aria-label="לעצור את הסטופר">${ICON.pause}<span id="swt">${fmt(ms)}</span></button>`;
  return `<button class="sw-btn" data-act="sw" aria-label="להפעיל סטופר">${ICON.watch}<span id="swt">${ms?fmt(ms):'סטופר'}</span></button>`; }
const taskLine=html=>`<div class="task"><button class="say" data-act="say" aria-label="להקריא">${ICON.speaker}</button><p>${html}</p></div>`;
const noteBlock=()=>S.note?`<div class="note ${S.note.ok?'ok':''}" role="status">${S.note.text}</div>`:'';
function boxHtml(i,big){
  const it=S.it, fd=it.fields[i]; const state = i<S.done ? 'done' : i===S.f && !S.finished ? 'on' : 'wait';
  const v = i<S.done ? (fd.ans??'') : i===S.f ? S.val : '';
  return `<span class="slot"><span class="box ${big?'big':''} ${state}">${state==='wait'&&!v?'':v}</span>${S.toast&&i===S.f-1?`<span class="toast" role="status">${S.toast.text}</span>`:''}</span>`;
}
function vExplain(){
  const st=DEF.explain[S.step], ask=st.ask, answered=S.asked!=null;
  const canNext=!ask || (ask.rotate ? S.rot : answered && S.asked===ask.ok);
  return `${strip()}${taskLine(st.say)}<div class="vis">${st.vis(stV())}</div>
    ${ask&&ask.options?`<div class="choices">${ask.options.map((o,i)=>`<button class="btn ${S.asked===i?(i===ask.ok?'good':'meh'):''}" data-act="ask" data-v="${i}">${o}</button>`).join('')}</div>`:''}
    ${ask&&ask.rotate&&!S.rot?`<div class="choices"><button class="btn primary" data-act="rotate">${ICON.rotate}לסובב</button></div>`:''}
    ${ask&&(answered||S.rot)?`<div class="note ${canNext?'ok':''}">${canNext?ask.then:ask.no}</div>`:''}
    <div class="actions">${S.step>0?'<button class="btn" data-act="exBack">אחורה</button>':''}<button class="btn primary" data-act="exNext" ${canNext?'':'disabled'}>${S.step<DEF.explain.length-1?'הלאה':'הבנתי, ממשיכות'}</button></div>`;
}
function vTask(){
  const it=S.it, fd=curField();
  const inEq=new Set(it.eq.filter(p=>p&&p.f!=null).map(p=>p.f));
  const q = !S.finished && fd?.q ? fd.q : it.say;
  const eq = it.eq.length ? `<div class="anchor ltr ${it.eq.length>3?'sm':''}">${it.eq.map(p=>typeof p==='string'?`<span>${p}</span>`:p.sum!=null?`<span class="slot"><span class="box big ${S.finished?'done':'wait'}">${S.finished?p.sum:'?'}</span></span>`:boxHtml(p.f,true)).join('')}</div>` : '';
  const rows = it.fields.map((fd,i)=>({fd,i})).filter(({fd,i})=>!inEq.has(i)&&!fd.choice&&!fd.rotate&&fd.label);
  const steps = rows.length ? `<div class="steps ltr">${rows.map(({fd,i})=>`<div class="stepf ${i===S.f&&!S.finished?'on':''}"><span>${fd.label}</span>${boxHtml(i)}</div>`).join('')}</div>` : '';
  const choice = fd?.choice && !S.finished ? `<div class="pics">${fd.choice.map((o,i)=>`<button class="picbtn" data-act="choose" data-v="${i}" aria-label="תמונה ${i+1}">${o.html}</button>`).join('')}</div>` : '';
  const rot = fd?.rotate && !S.finished ? `<div class="choices"><button class="btn primary" data-act="rotateF">${ICON.rotate}לסובב</button></div>` : '';
  const vis = it.vis && S.showVis ? `<div class="vis">${it.vis(stV())}</div>` : '';
  const hint = S.items[S.i].mode==='לבד' && !S.helped && !S.finished && it.hints ? `<div class="hintrow"><button class="hintbtn" data-act="hint">${ICON.bulb}רמז</button></div>` : '';
  return `${strip()}${taskLine(q)}${vis}${choice}${rot}${steps}${eq}${hint}${noteBlock()}
    ${S.finished?`<div class="actions"><button class="btn primary" data-act="next">${S.i>=S.items.length-1?'לסיום':'לתרגיל הבא'}</button></div>`:''}`;
}
function keypad(){
  const fd=curField();
  if(S.screen!=='lesson' || !S.it || !fd || fd.choice || fd.rotate || S.finished) return `<p class="kbd">כאן תופיע המקלדת כשיש מה לכתוב.</p>`;
  const d=[7,8,9,4,5,6,1,2,3].map(n=>`<button class="key" data-act="key" data-v="${n}">${n}</button>`).join('');
  return `<div class="pad">${d}<button class="key" data-act="del" aria-label="מחיקה">⌫</button><button class="key" data-act="key" data-v="0">0</button><button class="key ok" data-act="check">בדיקה</button></div><p class="kbd">אפשר גם להקליד במקלדת וללחוץ Enter</p>`;
}
function mapHtml(now){ return `<ol class="map" aria-label="מפת השיעור">${STOPS.map((s,i)=>`<li class="${i<now?'done':i===now?'now':''}"><span class="dot">${i<now?ICON.check:''}</span><span>${s}</span>${i===now?'<span class="here">את כאן</span>':''}</li>`).join('')}</ol>`; }
function vScreen(){
  if(S.screen==='trans'){ const t=TRANS()[S.i]; return `<div class="card"><h1>${t.title}</h1>${mapHtml(t.stop)}<p>${t.text}</p><button class="btn primary" data-act="go">ממשיכות</button></div>`; }
  if(S.screen==='star') return `<div class="card"><h1>⭐ רוצה שאלת אתגר?</h1><p>שאלה קשה במיוחד. מי שפותרת מקבלת 8 מטבעות. אפשר גם לסיים עכשיו.</p><div class="row"><button class="btn primary" data-act="takeStar">לנסות!</button><button class="btn" data-act="skipStar">לסיים את השיעור</button></div></div>`;
  if(S.screen==='done'){ const r=S.reward||{}; return `<div class="card"><h1>סיימנו את השיעור!</h1>${mapHtml(3)}<p>סיימת את השיעור "${DEF.title}". כל הכבוד על ההתמדה!</p>
    ${r.first?`<p class="gift">${r.chosen?(r.animal?'מישהי חדשה עברה לגור אצלך בבית! בואי לפגוש אותה.':'בבית מחכים לך 10 מטבעות בונוס.'):'בבית מחכה לך חיה ראשונה לבחור, ו-10 מטבעות בונוס.'}</p>`:''}
    <div class="row"><a class="btn primary" href="home.html">לבית שלי</a><a class="btn" href="index.html">לשיעורים</a><button class="btn" data-act="again">עוד פעם, עם תרגילים חדשים</button></div></div>`; }
  return '';
}
function render(){
  Shell.renderBar({page:'lesson', title:DEF.title});
  const lesson=S.screen==='lesson';
  document.getElementById('layout').hidden=!lesson; document.getElementById('screen').hidden=lesson; document.getElementById('screen').className='screen';
  if(!lesson){ document.getElementById('screen').innerHTML=vScreen(); syncTimer(); return; }
  document.getElementById('main').innerHTML = S.items[S.i].type==='explain' ? vExplain() : vTask();
  document.getElementById('kp').innerHTML=keypad(); syncTimer();
}

/* ---------- flow ---------- */
function advance(){
  if(S.items[S.i].star || S.i>=S.items.length-1){
    if(!S.starOffered && DEF.star){ S.starOffered=true; S.screen='star'; return; }
    return endLesson(); }
  S.i++; startItem(); if(TRANS()[S.i]) S.screen='trans';
}
function endLesson(){ S.screen='done'; S.reward=Shell.completeLesson(DEF.id); if(S.reward.first) Shell.addCoins(10);
  try{ const k='mk:log:'+Shell.kid().id, l=JSON.parse(localStorage.getItem(k)||'[]'); localStorage.setItem(k,JSON.stringify([...l,...S.log].slice(-300))); }catch(e){} S.log=[]; }
const A={
  say(){ const p=document.querySelector('.task p'); if(p) speak(p.textContent); return false; },
  sw(){ const T=S.exT; if(T.frozen) return; T.running=!T.running; },
  exNext(){ if(S.step<DEF.explain.length-1){ S.step++; S.asked=null; S.rot=false; } else advance(); },
  exBack(){ if(S.step>0){ S.step--; S.asked=null; S.rot=false; } },
  ask(v){ S.asked=+v; },
  rotate(){ S.rot=true; },
  rotateF(){ S.rot=true; S.note=null; fieldDone(); return false; },
  choose(v){ choose(+v); return false; },
  hint(){ S.showVis=true; S.helped=true; S.note={text:S.it.hints?.[0]||''}; },
  key(v){ if(S.locked||S.toast) return; if(S.val.length<4) S.val+=v; },
  del(){ S.val=S.val.slice(0,-1); },
  check(){ if(S.locked||S.toast||!S.val) return false; check(+S.val); return false; },
  next(){ advance(); },
  go(){ S.screen='lesson'; },
  takeStar(){ S.items.push({type:'task',phase:'שאלות',mode:'לבד',star:true}); S.i=S.items.length-1; S.screen='lesson'; startItem(); },
  skipStar(){ endLesson(); },
  again(){ S.used=new Set(); S.starOffered=false; S.lastHelped=false; S.i=0; plan(); startItem(); S.screen='lesson'; }
};
document.addEventListener('click',e=>{ const t=e.target.closest('[data-act]'); if(!t||t.disabled) return; if(A[t.dataset.act]?.(t.dataset.v)!==false) render(); });
document.addEventListener('keydown',e=>{
  if(Shell.isOpen()||S.screen!=='lesson') return;
  if(e.key==='Enter'){ e.preventDefault();
    if(S.items[S.i].type==='explain'){ const b=document.querySelector('[data-act=exNext]'); if(b&&!b.disabled){ A.exNext(); render(); } return; }
    if(S.finished){ A.next(); render(); return; } A.check(); return; }
  if(S.items[S.i].type==='explain') return;
  if(/^[0-9]$/.test(e.key)) A.key(e.key); else if(e.key==='Backspace') A.del(); else return;
  e.preventDefault(); render();
});

/* ---------- scratchpad ---------- */
const cv=document.getElementById('cv'), cx=cv.getContext('2d'); let drawing=false, erasing=false;
function clearScratch(){ cx.clearRect(0,0,cv.width,cv.height); }
function pos(e){ const b=cv.getBoundingClientRect(); return [(e.clientX-b.left)*cv.width/b.width,(e.clientY-b.top)*cv.height/b.height]; }
cv.addEventListener('pointerdown',e=>{ drawing=true; cv.setPointerCapture(e.pointerId); const [x,y]=pos(e); cx.beginPath(); cx.moveTo(x,y); });
cv.addEventListener('pointermove',e=>{ if(!drawing) return; const [x,y]=pos(e); cx.globalCompositeOperation=erasing?'destination-out':'source-over'; cx.strokeStyle=getComputedStyle(document.documentElement).getPropertyValue('--accent'); cx.lineWidth=erasing?28:5; cx.lineCap='round'; cx.lineJoin='round'; cx.lineTo(x,y); cx.stroke(); });
cv.addEventListener('pointerup',()=>{ drawing=false; });
document.getElementById('scrToggle').addEventListener('click',e=>{ const s=document.getElementById('scr'), open=s.hidden; s.hidden=!open; e.currentTarget.setAttribute('aria-expanded',open); });
document.getElementById('pen').addEventListener('click',()=>{ erasing=false; document.getElementById('pen').setAttribute('aria-pressed','true'); document.getElementById('eraser').setAttribute('aria-pressed','false'); });
document.getElementById('eraser').addEventListener('click',()=>{ erasing=true; document.getElementById('pen').setAttribute('aria-pressed','false'); document.getElementById('eraser').setAttribute('aria-pressed','true'); });
document.getElementById('clear').addEventListener('click',clearScratch);

if(Shell.start({page:'lesson', title:DEF.title})){ document.title='מתמטיקידס · '+DEF.title; plan(); startItem(); render(); }
