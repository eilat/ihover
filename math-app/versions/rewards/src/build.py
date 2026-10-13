"""Build the reward prototypes: inline common.js into each version, and write the gallery.
Usage: python3 -I build.py <out_dir>"""
import os, sys
SRC=os.path.dirname(os.path.abspath(__file__)); OUT=sys.argv[1]; os.makedirs(OUT, exist_ok=True)
common=open(os.path.join(SRC,'common.js'),encoding='utf8').read()
V=[('v1','ארון בגדים','חנות עם לשוניות לפי סוג. אפשר "למדוד" כל פריט על הדמות לפני שקונים.'),
   ('v2','תיבת הפתעה','הכוכבים ממלאים צנצנת. צנצנת מלאה פותחת תיבה, ובוחרים פריט אחד משלושה. אלבום עם צלליות של מה שעוד לא נמצא.'),
   ('v3','הבית של החיה','החיה גרה בחדר. במטבעות קונים חיות מחמד וחפצים שממלאים את החדר, ובגדים לחיה. חיות חדשות עוברות לגור בחדר.')]
for slug,_,_ in V:
    t=open(os.path.join(SRC,slug+'.html'),encoding='utf8').read().replace('/*COMMON*/',common)
    open(os.path.join(OUT,slug+'.html'),'w',encoding='utf8').write(t)
PICK=os.environ.get('PICK','')
cards=''.join(f'''<article class="vc {'pick' if s==PICK else ''}" data-v="{s}"><div class="frame"><iframe src="{s}.html" title="{n}" loading="lazy" tabindex="-1"></iframe></div>
<div class="vc-body"><p class="num">גרסה {k+1}</p>{'<span class="badge">הבחירה שלי</span>' if s==PICK else ''}<h2>{n}</h2><p>{c}</p><button class="open" data-open="{s}">לפתוח בגודל מלא</button></div></article>''' for k,(s,n,c) in enumerate(V))
why=open(os.path.join(SRC,'why.html'),encoding='utf8').read() if os.path.exists(os.path.join(SRC,'why.html')) else ''
g=f'''<title>תגמולים ודמויות</title>
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Rubik:wght@400;600&display=swap">
<style>
/* Gallery: three live reward prototypes, open full size inside the page */
:root{{--bg:#F1F3F6;--surface:#FFFFFF;--ink:#1E2633;--muted:#5A6577;--line:#D3DAE3;--pick:#1F7A4D;--pick-soft:#DDF2E7}}
@media (prefers-color-scheme: dark){{:root:not([data-theme="light"]){{--bg:#12161D;--surface:#1B212B;--ink:#E8EDF4;--muted:#9AA6B8;--line:#2E3746;--pick:#3FB37A;--pick-soft:#1C3A2B;color-scheme:dark}}}}
:root[data-theme="dark"]{{--bg:#12161D;--surface:#1B212B;--ink:#E8EDF4;--muted:#9AA6B8;--line:#2E3746;--pick:#3FB37A;--pick-soft:#1C3A2B;color-scheme:dark}}
body{{background:var(--bg);color:var(--ink);font-family:"Rubik",system-ui,sans-serif;padding-block:28px 48px;padding-inline:16px}}
.wrap{{max-width:1240px;margin-inline:auto;display:flex;flex-direction:column;gap:22px}}
h1{{margin:0;font-size:clamp(26px,4vw,36px);text-wrap:balance}}
.lead{{margin:0;color:var(--muted);max-width:62ch;font-size:17px;line-height:1.6}}
.grid{{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,360px),1fr));gap:18px}}
.vc{{background:var(--surface);border-radius:16px;overflow:hidden;border:2px solid var(--line);display:flex;flex-direction:column}}
.vc.pick{{border-color:var(--pick)}}
.frame{{position:relative;aspect-ratio:1280/860;overflow:hidden;background:var(--bg);cursor:pointer}}
.frame iframe{{position:absolute;top:0;right:0;width:1280px;height:860px;border:0;transform-origin:top right;pointer-events:none}}
.vc-body{{padding:16px 18px 20px;display:flex;flex-direction:column;gap:6px;min-width:0}}
.vc-body h2{{margin:0;font-size:22px}} .vc-body p{{margin:0;color:var(--muted);line-height:1.5}}
.num{{font-size:13px}} .badge{{align-self:flex-start;background:var(--pick-soft);color:var(--pick);font-weight:600;font-size:14px;padding:2px 10px;border-radius:999px}}
.open{{margin-top:8px;align-self:flex-start;font:inherit;font-weight:600;color:var(--ink);background:var(--bg);border:2px solid var(--line);border-radius:999px;padding:8px 18px;cursor:pointer}}
.why{{background:var(--surface);border-radius:16px;padding:20px 22px;border:2px solid var(--pick);line-height:1.6}}
.why h2{{margin:0 0 8px;font-size:20px}} .why ul{{margin:0;padding-inline-start:1.2em}}
.full{{position:fixed;inset:0;z-index:10;background:var(--bg);display:flex;flex-direction:column}}
.full[hidden]{{display:none}}
.full-bar{{display:flex;align-items:center;gap:10px;flex-wrap:wrap;padding:10px 16px;background:var(--surface);border-bottom:2px solid var(--line)}}
.full-bar button{{font:inherit;font-size:15px;color:var(--ink);background:var(--surface);border:2px solid var(--line);border-radius:999px;padding:6px 14px;cursor:pointer}}
.full-bar button[aria-pressed="true"]{{background:var(--ink);color:var(--surface);border-color:var(--ink)}}
.full-bar .back{{margin-inline-end:auto;font-weight:600}}
.full iframe{{flex:1;width:100%;border:0;background:var(--surface)}}
</style>
<div class="wrap">
<h1>תגמולים ודמויות: שלוש גרסאות</h1>
<p class="lead">בכל גרסה: ארבע חיות, 24 פריטים, ו"שיעור קטן" של 5 תרגילים שמרוויחים בו. כל תרגיל שנפתר נותן 3, גם עם רמז. מתחילים עם 10 במתנה כדי לנסות מיד. שיעור שמסתיים פותח חיה חדשה.</p>
<div class="grid">{cards}</div>
{why}
</div>
<div class="full" id="full" hidden><div class="full-bar"><button class="back" data-close>חזרה לגלריה</button>{''.join(f'<button data-open="{s}">{k+1} · {n}</button>' for k,(s,n,_) in enumerate(V))}</div><iframe id="ff" title="גרסה בגודל מלא"></iframe></div>
<script>
function fit(){{ document.querySelectorAll('.frame').forEach(f=>{{ f.querySelector('iframe').style.transform='scale('+(f.clientWidth/1280)+')'; }}); }}
addEventListener('resize',fit); fit();
const full=document.getElementById('full'), ff=document.getElementById('ff');
function openV(v){{ if(ff.getAttribute('src')!==v+'.html') ff.src=v+'.html'; full.hidden=false; document.querySelectorAll('.full-bar [data-open]').forEach(b=>b.setAttribute('aria-pressed', b.dataset.open===v)); }}
document.addEventListener('click',e=>{{ const o=e.target.closest('[data-open]'); if(o){{ openV(o.dataset.open); return; }}
  if(e.target.closest('[data-close]')){{ full.hidden=true; return; }} const f=e.target.closest('.vc .frame'); if(f) openV(f.closest('.vc').dataset.v); }});
addEventListener('keydown',e=>{{ if(e.key==='Escape') full.hidden=true; }});
</script>'''
open(os.path.join(OUT,'index.html'),'w',encoding='utf8').write(g)
print('built',OUT)
