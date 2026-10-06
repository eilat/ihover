import sys, os
B = os.path.dirname(os.path.abspath(__file__))
OUT = sys.argv[1]
os.makedirs(OUT, exist_ok=True)
engine = open(os.path.join(B, 'engine.js'), encoding='utf8').read()
base = open(os.path.join(B, 'base.css'), encoding='utf8').read()

# shared semantic tokens: place-value colours stay fixed (they teach), success green, hint
SEM_LIGHT = "--h:#2F5BD3;--h-soft:#DCE5FA;--t:#E0A10E;--t-soft:#FCEFC9;--o:#23895A;--o-soft:#DCF1E5;--good:#1F7A4D;--good-soft:#DDF2E7;--hint-bg:#FFF1C9;"
SEM_DARK = "--h:#7096F4;--h-soft:#24345A;--t:#F2BE3C;--t-soft:#3C3320;--o:#4DC48B;--o-soft:#1E3A2E;--good:#3FB37A;--good-soft:#1C3A2B;--hint-bg:#3D3420;color-scheme:dark;"

V = [
 dict(slug='v1', name='מחברת', concept='פאנל לבן עם שלבים כקו מנוקד, מתקפל לפס צר. המספרים כתובים במשבצות של מחברת חשבון.',
  fonts='family=Rubik:wght@400;500;600&family=Assistant:wght@400;600',
  cfg="{collapse:'rail', math:'grid'}",
  light="--bg:#EEF1F4;--surface:#FFFFFF;--ink:#1E2633;--muted:#5A6577;--line:#D3DAE3;",
  dark="--bg:#12161D;--surface:#1B212B;--ink:#E8EDF4;--muted:#9AA6B8;--line:#2E3746;",
  css="""
:root{--f-display:"Rubik",system-ui,sans-serif;--f-body:"Assistant","Rubik",system-ui,sans-serif;--panel-w:270px;--rail-w:72px;--q-size:clamp(42px,6vw,62px)}
.panel,.rail{background:var(--surface);border-inline-end:1.5px solid var(--line)}
.card{background:var(--surface);border-radius:6px;padding:clamp(20px,4vw,40px);box-shadow:0 1px 2px rgba(0,0,0,.06);
  background-image:linear-gradient(color-mix(in srgb,var(--accent) 10%,transparent) 1px,transparent 1px),linear-gradient(90deg,color-mix(in srgb,var(--accent) 10%,transparent) 1px,transparent 1px);background-size:28px 28px;background-position:-1px -1px}
.intro p{background:var(--surface);padding:2px 6px;border-radius:6px}
.box{border-radius:4px}
.box.big{border-radius:6px}
.nb-row{display:flex;gap:6px;align-items:center;justify-content:center;flex-wrap:wrap;padding:10px}
.nb-stick{width:10px;height:44px;border-radius:2px;background:var(--t)}
.nb-stick.alt{background:color-mix(in srgb,var(--t) 65%,var(--ink))}
.nb-plus{font-family:var(--f-display);font-size:30px;font-weight:600;padding-inline:8px}
.digs{background:var(--surface);border:1.5px solid var(--line);border-radius:4px;padding:4px 14px}
.col{background:color-mix(in srgb,var(--surface) 85%,transparent)!important;border:2px solid var(--line)}
.col.focus{border-color:var(--accent)}
.col.c-h .col-title{color:var(--h)} .col.c-t .col-title{color:var(--t)} .col.c-o .col-title{color:var(--o)}
.col-title{font-weight:600}
"""),
 dict(slug='v2', name='שולחן עבודה', concept='הפאנל צבוע בצבע של הילדה ומתקפל לכפתור צף למעלה. קוביות ומקלות כמו היום, הרבה אוויר.',
  fonts='family=Fredoka:wght@500;600&family=Varela+Round',
  cfg="{collapse:'float', math:'blocks'}",
  light="--bg:#EAF0F6;--surface:#FFFFFF;--ink:#1D2840;--muted:#56657E;--line:#CFD9E6;",
  dark="--bg:#111827;--surface:#1A2336;--ink:#EAF0FA;--muted:#9DABC2;--line:#2D3A54;",
  css="""
:root{--f-display:"Fredoka","Varela Round",system-ui,sans-serif;--f-body:"Varela Round","Fredoka",system-ui,sans-serif;--panel-w:280px;--rail-w:0px;--q-size:clamp(46px,7vw,72px)}
.panel{background:var(--accent);color:#fff;--p-muted:rgba(255,255,255,.82);--p-ink:#fff;--line:rgba(255,255,255,.35)}
.panel .icon-btn{color:#fff}
.panel select{background:rgba(255,255,255,.14);color:#fff;border-color:rgba(255,255,255,.4)}
.panel select option{color:#1D2840}
.panel .sw{border-color:var(--accent);box-shadow:0 0 0 2px rgba(255,255,255,.5)}
.panel .sw[aria-pressed="true"]{box-shadow:0 0 0 3px #fff}
.panel .dot{background:transparent;border-color:rgba(255,255,255,.5)}
.panel .steps li.done .dot{background:#fff;border-color:#fff;color:var(--accent)}
.panel .steps li.done:not(:last-child)::after{background:#fff}
.panel .steps li.now{color:#fff}
.panel .steps li.now .dot{border-color:#fff}
.panel .parent{background:rgba(255,255,255,.14);border-color:rgba(255,255,255,.4);color:#fff}
.card{background:var(--surface);border-radius:28px;padding:clamp(24px,5vw,56px)}
.shell.is-collapsed .stage{padding-top:84px}
.work{gap:30px}
.toast{animation:toast2 1.7s cubic-bezier(.3,1.6,.5,1) both}
@keyframes toast2{0%{opacity:0;transform:translate(-50%,12px) scale(.6)}15%{opacity:1;transform:translate(-50%,0) scale(1)}80%{opacity:1}100%{opacity:0}}
"""),
 dict(slug='v3', name='מסע', concept='השלבים הם תחנות על שביל עם סימן "את כאן". כרטיס בשני טורים: שאלה וישר מספרים מימין, מקלדת משמאל.',
  fonts='family=Secular+One&family=Heebo:wght@400;500;700',
  cfg="{collapse:'rail', math:'line'}",
  light="--bg:#E9F1EE;--surface:#FFFFFF;--ink:#17312B;--muted:#4E6560;--line:#C8D9D3;",
  dark="--bg:#0F1A17;--surface:#172420;--ink:#E3F0EC;--muted:#93ABA4;--line:#2A3E38;",
  css="""
:root{--f-display:"Secular One","Heebo",system-ui,sans-serif;--f-body:"Heebo",system-ui,sans-serif;--panel-w:250px;--rail-w:64px;--q-size:clamp(38px,5vw,56px)}
body{font-size:17px}
.panel,.rail{background:color-mix(in srgb,var(--accent) 8%,var(--surface))}
.logo{font-weight:400}
/* the stepper as a trail: stops zigzag, joined by dashed diagonal paths (44px down, 26px across) */
.steps li{padding-block:10px}
.steps li:nth-child(even){padding-inline-start:26px}
.dot{position:relative;z-index:1}
.steps li:not(:last-child)::after{background:none;width:0;height:51px;top:22px;border-inline-start:3px dashed var(--line);inset-inline-start:11px;transform-origin:top center;transform:rotate(30.6deg)}
.steps li:nth-child(even):not(:last-child)::after{inset-inline-start:37px;transform:rotate(-30.6deg)}
.steps li.done:not(:last-child)::after{border-color:var(--accent);background:none}
.steps li.now .lbl::after{content:"את כאן";display:inline-block;margin-inline-start:8px;font-size:12px;font-weight:700;background:var(--accent);color:#fff;border-radius:999px;padding:1px 8px;vertical-align:2px}
.card{background:var(--surface);border-radius:18px;padding:clamp(18px,3vw,30px);border:1.5px solid var(--line)}
.work{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:28px;align-items:start}
.padwrap{position:sticky;top:24px;background:color-mix(in srgb,var(--accent) 7%,var(--surface));padding:16px;border-radius:16px}
.question{justify-content:flex-start}
.hint{align-self:stretch}
.cols{gap:8px}
.col{padding:10px 6px}
.fld{font-size:20px}
.box{min-width:70px;height:50px;font-size:24px}
@media (max-width:1100px){.work{grid-template-columns:minmax(0,1fr)}.padwrap{position:static;justify-self:center}}
"""),
]

def page(v):
    return f"""<!doctype html>
<html lang="he" dir="rtl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>מתמטיקידס · {v['name']}</title>
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?{v['fonts']}&display=swap">
<style>
/* {v['name']}: {v['concept']} */
:root{{{v['light']}{SEM_LIGHT}--accent:#7444C9}}
@media (prefers-color-scheme: dark){{:root:not([data-theme="light"]){{{v['dark']}{SEM_DARK}}}}}
:root[data-theme="dark"]{{{v['dark']}{SEM_DARK}}}
{base}
{v['css']}
</style></head>
<body><div id="app" class="shell"></div>
<script>window.CFG={v['cfg']};</script>
<script>
{engine}
</script></body></html>
"""

for v in V:
    open(os.path.join(OUT, v['slug'] + '.html'), 'w', encoding='utf8').write(page(v))

cards = ''.join(f"""<article class="vc" data-v="{v['slug']}">
  <div class="frame"><iframe src="{v['slug']}.html" title="{v['name']}" loading="lazy" tabindex="-1"></iframe></div>
  <div class="vc-body"><p class="num">גרסה {i+1}</p><h2>{v['name']}</h2><p>{v['concept']}</p>
  <a class="open" href="{v['slug']}.html" target="_blank" rel="noopener">לפתוח בגודל מלא</a></div></article>""" for i, v in enumerate(V))
gallery = f"""<title>פאנל ניווט ושיעור</title>
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Rubik:wght@400;600&display=swap">
<style>
/* Gallery: three live versions side by side, the pick marked */
:root{{--bg:#F1F3F6;--surface:#FFFFFF;--ink:#1E2633;--muted:#5A6577;--line:#D3DAE3;--pick:#1F7A4D;--pick-soft:#DDF2E7}}
@media (prefers-color-scheme: dark){{:root:not([data-theme="light"]){{--bg:#12161D;--surface:#1B212B;--ink:#E8EDF4;--muted:#9AA6B8;--line:#2E3746;--pick:#3FB37A;--pick-soft:#1C3A2B;color-scheme:dark}}}}
:root[data-theme="dark"]{{--bg:#12161D;--surface:#1B212B;--ink:#E8EDF4;--muted:#9AA6B8;--line:#2E3746;--pick:#3FB37A;--pick-soft:#1C3A2B;color-scheme:dark}}
body{{background:var(--bg);color:var(--ink);font-family:"Rubik",system-ui,sans-serif;padding-block:28px 48px;padding-inline:16px}}
.wrap{{max-width:1240px;margin-inline:auto;display:flex;flex-direction:column;gap:22px}}
h1{{margin:0;font-size:clamp(26px,4vw,36px);text-wrap:balance}}
.lead{{margin:0;color:var(--muted);max-width:60ch;font-size:17px;line-height:1.6}}
.grid{{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,360px),1fr));gap:18px}}
.vc{{background:var(--surface);border-radius:16px;overflow:hidden;border:2px solid var(--line);display:flex;flex-direction:column}}
.vc.pick{{border-color:var(--pick)}}
.frame{{position:relative;aspect-ratio:1280/860;overflow:hidden;background:var(--bg);max-width:100%}}
.frame iframe{{position:absolute;top:0;right:0;width:1280px;height:860px;border:0;transform-origin:top right;pointer-events:none}}
.vc-body{{padding:16px 18px 20px;display:flex;flex-direction:column;gap:6px;min-width:0}}
.vc-body h2{{margin:0;font-size:22px}}
.vc-body p{{margin:0;color:var(--muted);line-height:1.5}}
.num{{font-size:13px;letter-spacing:.04em}}
.badge{{align-self:flex-start;background:var(--pick-soft);color:var(--pick);font-weight:600;font-size:14px;padding:2px 10px;border-radius:999px}}
.open{{margin-top:6px;color:var(--ink);font-weight:600}}
.why{{background:var(--surface);border-radius:16px;padding:20px 22px;border:2px solid var(--pick);line-height:1.6}}
.why h2{{margin:0 0 8px;font-size:20px}}
.why ul{{margin:0;padding-inline-start:1.2em}}
</style>
<div class="wrap">
<h1>פאנל ניווט ושיעור: שלוש גרסאות</h1>
<p class="lead">כל גרסה היא דף אמיתי שעובד: פתרי תרגילים, טעי בכוונה, החליפי צבע, קפלי את הפאנל ונסי את כפתור ההורה. התוכן זהה בשלושתן: 4 + 3, אחר כך 40 + 30, אחר כך 264 + 182 עם הקופסאות, ובסוף 573 + 340 לבד.</p>
<div class="grid">{cards}</div>
<section class="why" id="why"></section>
</div>
<script>
function fit(){{ document.querySelectorAll('.frame').forEach(f=>{{ const i=f.querySelector('iframe'); i.style.transform='scale('+(f.clientWidth/1280)+')'; }}); }}
addEventListener('resize',fit); fit();
</script>
"""
open(os.path.join(OUT, 'index.html'), 'w', encoding='utf8').write(gallery)
print('built', OUT)
