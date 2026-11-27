/* ==========================================================================
   Visual check of one week, run inside the page (not in Node).
   Serve the site (python3 -m http.server 4173 --bind 127.0.0.1), open index.html,
   then in the page (DevTools console, or Claude in Chrome's javascript tool):

     await new Promise(r => { const s = document.createElement('script');
       s.src = '/tools/visual-check.js?' + Date.now(); s.onload = r; document.head.append(s); });
     await VisualCheck.run(2)          // returns a text report

   It checks, for the week's entries:
   1. Animations: every graph × mode of every mount runs to its last frame (and
      says whether that frame is marked ok or fail), and stepping forward, back
      and forward again from the middle lands on the same frame.
   2. Width: at 390px, in light and dark mode, no element of the week sticks out
      sideways (inside a scrolling box is fine).
   2b. Clipping: no drawing runs outside its own SVG viewBox (for each graph in a dropdown).
   3. Inventory: the exercises mounted, to be tried by hand (a right and a wrong move).
   On midterm/index.html, run(N) checks the entries of week N that the midterm page shows.
   What it cannot judge: console errors at load (read them with the browser's
   console), whether a graph looks like its slide, and smooth motion.
   ========================================================================== */
window.VisualCheck = (function () {
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  const sectionsOf = (doc, week) => {
    const C = doc.defaultView.COURSE;
    /* On the midterm page, C.parts are its sections; C.sourceParts keeps the weeks, so run(N)
       there checks the week N entries the midterm page shows. */
    /* On an exam page (past-exams/), its parts are week 'X': run('X') checks the questions
       (open every solution first, so the visualizations are mounted). */
    const parts = [...(C.sourceParts || []), ...C.parts].filter(p => String(p.week) === String(week));
    const ids = [...new Set(parts.flatMap(p => p.entries.map(e => e.id)))];
    return ids.map(id => doc.getElementById(`e-${id}`)).filter(Boolean);
  };

  /* 1. Animations */
  async function animations(week) {
    const out = [];
    for (const sec of sectionsOf(document, week)) {
      for (const algo of sec.querySelectorAll('.algo')) {
        const q = r => algo.querySelector(`[data-r=${r}]`);
        /* Every view shares the transport (restart, back, next, end, scrub, count, msg). What picks
           the run differs: a dropdown (graph, word), mode buttons, and option switches. Each dropdown
           value × each mode is run; each switch option is run once on its own. */
        const sel = algo.querySelector('.algo-setup select'), modes = [...algo.querySelectorAll('[data-r=modes] button')].filter(b => !b.closest('[hidden]'));
        const state = () => q('msg').textContent + '|' + [...algo.querySelectorAll('.dcell, .cell, .token, .fw-mat td, .code-line.active, .eu-cell, .ana-row')].map(x => x.textContent + x.className).join(',') +
          '|' + [...algo.querySelectorAll('.node, .edge')].map(n => n.dataset.state || '').join(',');
        const runs = [];
        for (const p of sel ? [...sel.options].map(o => o.value) : ['']) for (const m of modes.length ? modes : [null]) runs.push({ p, m, sw: null });
        for (const b of algo.querySelectorAll('button[data-sw]')) runs.push({ p: sel ? sel.options[0].value : '', m: null, sw: b });
        for (const { p, m, sw } of runs) {
          if (sel) { sel.value = p; sel.dispatchEvent(new Event('change')); }
          if (m) m.click();
          if (sw) sw.click();
          await sleep(60);
          q('end').click(); await sleep(350);
          const cls = q('msg').className, count = q('count').textContent.replace(/^Step /, '');
          const end = cls.includes('ok') ? 'ok' : cls.includes('fail') ? 'FAIL' : 'no verdict';
          const sc = q('scrub');
          sc.value = Math.floor(+sc.max / 2); sc.dispatchEvent(new Event('input')); await sleep(250);
          q('next').click(); await sleep(250); const a = state();
          q('back').click(); await sleep(250); q('next').click(); await sleep(250); const b = state();
          out.push({ entry: sec.id.slice(2), preset: p, mode: m ? m.dataset.mode : sw ? `${sw.dataset.sw}=${sw.dataset.val}` : '', frames: count, end, steps: a === b ? 'same' : 'DIFFERENT', msg: q('msg').textContent.slice(0, 70) });
        }
        q('restart').click();
      }
    }
    return out;
  }

  /* 2. Width: the page in a 390px frame, light then dark */
  async function width(week) {
    const f = document.createElement('iframe');
    f.style.cssText = 'position:fixed;left:-2000px;top:0;width:390px;height:844px;border:0';
    f.src = `${location.pathname}?vc=${Date.now()}`;
    document.body.append(f);
    await new Promise(r => { f.onload = r; });
    await sleep(2500);
    const w = f.contentWindow, d = w.document, res = {};
    const scrolls = e => { for (let p = e.parentElement; p && p !== d.body; p = p.parentElement) if (/(auto|scroll|hidden)/.test(w.getComputedStyle(p).overflowX)) return true; return false; };
    for (const theme of ['light', 'dark']) {
      d.documentElement.dataset.theme = theme;
      await sleep(300);
      res[theme] = sectionsOf(d, week).flatMap(sec => {
        const bad = [...sec.querySelectorAll('*')].filter(e => { const r = e.getBoundingClientRect(); return r.width > 0 && r.right > w.innerWidth + 1 && !scrolls(e); });
        const top = bad.filter(e => !bad.includes(e.parentElement));
        return top.slice(0, 3).map(e => `${sec.id.slice(2)}: <${e.tagName.toLowerCase()} class="${String(e.className).slice(0, 30)}"> ends at ${Math.round(e.getBoundingClientRect().right)}px` +
          (e.closest('.katex') ? ` (formula ${(e.closest('.katex').querySelector('annotation') || {}).textContent})` : ''));
      });
    }
    f.remove();
    return res;
  }

  /* 2b. Clipping: a drawing whose content runs outside its own viewBox is cut off (the width check
     cannot see this, since the SVG itself fits). Checks every SVG of the week as it stands, and each
     value of the mount's graph dropdown, if it has one. */
  async function clipping(week) {
    const out = [];
    const test = (sec, svg, label) => {
      const vb = svg.viewBox && svg.viewBox.baseVal;
      if (!vb || !vb.width || svg.getBoundingClientRect().width === 0 || getComputedStyle(svg).overflow === 'visible') return;
      let bb; try { bb = svg.getBBox(); } catch (e) { return; }
      const over = [vb.x - bb.x, vb.y - bb.y, bb.x + bb.width - (vb.x + vb.width), bb.y + bb.height - (vb.y + vb.height)].map(Math.round);
      if (over.some(v => v > 2)) out.push(`${sec.id.slice(2)}${label}: content outside the viewBox by ${over.join('/')} px (left/top/right/bottom)`);
    };
    for (const sec of sectionsOf(document, week)) {
      for (const m of sec.querySelectorAll('.algo, .ex-mount, .fig-mount')) {
        const sel = m.querySelector('select');
        const vals = sel ? [...sel.options].map(o => o.value) : [null];
        for (const v of vals) {
          if (sel) { sel.value = v; sel.dispatchEvent(new Event('change', { bubbles: true })); await sleep(200); }
          m.querySelectorAll('svg').forEach((svg, i) => test(sec, svg, ` ${m.dataset.ex || m.dataset.algo || m.dataset.widget || ''}${v != null ? ' ' + v : ''} #${i}`));
        }
        if (sel) { sel.value = vals[0]; sel.dispatchEvent(new Event('change', { bubbles: true })); await sleep(100); }
      }
    }
    return out;
  }

  /* 3. Exercises mounted */
  const exercises = week => sectionsOf(document, week).flatMap(sec => [...sec.querySelectorAll('.ex-mount')].map(m => `${sec.id.slice(2)}: ${m.dataset.ex || m.dataset.lazyEx}${m.dataset.graphs ? ` (${m.dataset.graphs})` : ''}`));

  async function run(week) {
    const anim = await animations(week);
    const wide = await width(week);
    const lines = [`Visual check, week ${week}: ${sectionsOf(document, week).length} entries`];
    const badAnim = anim.filter(a => a.steps !== 'same' || a.end === 'no verdict');
    lines.push(`\n1. Animations: ${anim.length} runs, ${badAnim.length} with a problem`);
    anim.forEach(a => lines.push(`  ${a.steps === 'same' && a.end !== 'no verdict' ? 'ok  ' : 'BAD '} ${a.entry} ${a.preset}${a.mode ? ' ' + a.mode : ''} [${a.frames}] end ${a.end}, back/forward ${a.steps} :: ${a.msg}`));
    for (const theme of ['light', 'dark']) {
      lines.push(`\n2. Width 390px, ${theme}: ${wide[theme].length ? wide[theme].length + ' overflowing' : 'nothing sticks out'}`);
      wide[theme].forEach(x => lines.push('  ' + x));
    }
    const clip = await clipping(week);
    lines.push(`\n2b. Clipped drawings: ${clip.length ? clip.length : 'none'}`);
    clip.forEach(x => lines.push('  ' + x));
    const ex = exercises(week);
    lines.push(`\n3. Exercises to try by hand (one right and one wrong move each): ${ex.length}`);
    ex.forEach(x => lines.push('  ' + x));
    return lines.join('\n');
  }

  /* Step 2 of the visual review: a sheet of every drawn graph of the week, one copy per value
     of each mount's dropdown, captioned "entry kind value", to screenshot and compare with the
     slides. sheet(N, { from, to, cell }) shows a slice; sheet(null) removes it. */
  async function sheet(week, opts = {}) {
    document.getElementById('vc-sheet')?.remove();
    if (week == null) return 'removed';
    const items = [];
    for (const sec of sectionsOf(document, week)) {
      for (const m of sec.querySelectorAll('.algo, .ex-mount')) {
        const kind = m.classList.contains('algo') ? 'A' : 'X:' + (m.dataset.ex || '');
        const sel = m.querySelector('select');
        const vals = sel ? [...sel.options].map(o => o.value) : [null];
        for (const v of vals) {
          if (sel) { sel.value = v; sel.dispatchEvent(new Event('change', { bubbles: true })); await sleep(250); }
          const svgs = [...m.querySelectorAll('svg')].filter(s => s.getBoundingClientRect().width > 60);
          svgs.forEach((s, i) => items.push({ cap: `${sec.id.slice(2)} ${kind} ${v ?? ''}${svgs.length > 1 ? ' #' + i : ''}`, svg: s.cloneNode(true) }));
        }
        if (sel) { sel.value = vals[0]; sel.dispatchEvent(new Event('change', { bubbles: true })); await sleep(150); }
      }
    }
    const o = document.createElement('div');
    o.id = 'vc-sheet';
    o.style.cssText = 'position:fixed;inset:0;z-index:99999;background:#fff;overflow:auto;display:flex;flex-wrap:wrap;gap:6px;padding:6px;align-content:flex-start';
    items.slice(opts.from || 0, opts.to || items.length).forEach(it => {
      const c = document.createElement('div');
      c.style.cssText = `border:1px solid #999;padding:2px;width:${opts.cell || 300}px`;
      const t = document.createElement('div');
      t.textContent = it.cap; t.style.cssText = 'font:11px monospace;color:#c00';
      it.svg.style.width = '100%'; it.svg.style.height = 'auto';
      c.append(t, it.svg); o.append(c);
    });
    document.body.append(o);
    return `${items.length} drawings: ${items.map(i => i.cap).join(' | ')}`;
  }

  return { run, animations, width, clipping, exercises, sheet };
})();
