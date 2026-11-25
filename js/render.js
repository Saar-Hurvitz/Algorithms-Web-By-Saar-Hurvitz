/* ==========================================================================
   render.js — turns COURSE (course.js + js/weeks/) into the page and wires up behavior:
   table of contents, shorthand → HTML, term hover cards, jump + back,
   search, slide viewer, theme, and the term-link checks (see console).
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
  const C = window.COURSE;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const ready = C.parts.flatMap(p => p.entries);
  const weekName = w => w.label || `Week ${w.n}`;   // a digest page (midterm/) groups entries under its own label
  ready.forEach((e, i) => { e.num = i + 1; });

  /* ---------- Theme ---------- */
  const themeSel = $('#theme-select');
  const store = {
    get(k) { try { return localStorage.getItem(k); } catch { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch { /* private mode */ } },
  };
  const applyTheme = t => {
    if (t === 'light' || t === 'dark') document.documentElement.dataset.theme = t;
    else delete document.documentElement.dataset.theme;
  };
  const savedTheme = store.get('theme') || 'auto';
  themeSel.value = savedTheme; applyTheme(savedTheme);
  themeSel.addEventListener('change', () => { store.set('theme', themeSel.value); applyTheme(themeSel.value); });

  /* ---------- Slide helpers ---------- */
  const parseSlide = ref => {
    const [, deck, n] = ref.match(/^(\d*[A-Z])(\d+)$/);   // "L34", or "2L34" from week 2 on
    return { ref, deck, n: parseInt(n, 10), info: C.decks[deck] };
  };
  // pdftoppm pads file numbers to the number of digits in the page count
  const slideSrc = s => `${s.info.path}${String(s.n).padStart(String(s.info.count).length, '0')}.png`;
  const slideName = s => `${s.info.name}, slide ${s.n}`;

  /* ---------- Shorthand → HTML ---------- */
  const transform = html => html
    .replace(/==(.+?)==/gs, '<mark class="hl">$1</mark>')   // first: term links below add "=" signs
    .replace(/\[\[([a-z0-9-]+)(?:\|([^\]]+))?\]\]/g, (m, id, text) =>
      `<a class="term-ref" href="#t-${id}" data-term="${id}">${text || id.replace(/-/g, ' ')}</a>`)
    .replace(/!!([^!]+)!!/g, '<strong class="crucial">$1</strong>')
    .replace(/\{\{(\d*[A-Z]\d+)\}\}/g, (m, ref) => {
      const s = parseSlide(ref);
      return `<button type="button" class="slide-link" data-slide="${ref}" title="${s.info.name}">${s.info.kind} slide ${s.n}</button>`;
    })
    .replace(/\{\{added\}\}/g, '<span class="added-tag" title="An explanation added for this site. The slides do not state this.">not on the slides</span>');

  /* ---------- Table of contents ---------- */
  const tocList = $('#toc-list');
  const tocGroups = {};
  for (const week of C.weeks) {
    const group = document.createElement('details');
    group.className = 'toc-week-group';
    group.open = true;
    group.innerHTML = `<summary>${weekName(week)}: ${week.title}</summary>`;
    tocList.appendChild(group);
    tocGroups[week.n] = group;
  }
  for (const part of C.parts) {
    const group = tocGroups[part.week];
    const h = document.createElement('p');
    h.className = 'toc-part';
    h.innerHTML = `${part.title}<small>${part.sub}</small>`;
    group.appendChild(h);
    const ol = document.createElement('ol');
    for (const e of part.entries) {
      const li = document.createElement('li');
      const tag = (e.algo ? '<span class="algo-badge">Algorithm</span>' : '') + (e.exercise ? '<span class="algo-tag tag-ex">exercise</span>' : '');
      li.innerHTML = `<a href="#e-${e.id}"><span class="num">${e.num}</span><span>${e.title}${tag}</span></a>`;
      ol.appendChild(li);
    }
    group.appendChild(ol);
  }

  /* ---------- Entries ---------- */
  const entriesRoot = $('#entries');
  let headedWeek = null;
  for (const part of C.parts) {
    if (part.week !== headedWeek) {
      headedWeek = part.week;
      const week = C.weeks.find(w => w.n === part.week);
      const wh = document.createElement('h2');
      wh.className = 'week-heading';
      wh.id = `week-${week.n}`;
      wh.innerHTML = `<small>${weekName(week)}</small>${week.title}`;
      entriesRoot.appendChild(wh);
    }
    const ph = document.createElement('h2');
    ph.className = 'part-heading';
    ph.innerHTML = `<strong>${part.title}</strong>${part.sub}`;
    entriesRoot.appendChild(ph);

    for (const e of part.entries) {
      const sec = document.createElement('section');
      sec.className = `entry${e.algo ? ' has-algo' : ''}${e.recap ? ' recap' : ''}`; sec.id = `e-${e.id}`;

      const slides = e.slides.map(parseSlide);
      const chips = [];
      for (const deck of Object.keys(C.decks)) {
        const nums = slides.filter(s => s.deck === deck).map(s => s.n);
        if (nums.length) chips.push(`<span class="meta-chip">${C.decks[deck].kind} ${nums.length > 1 ? 'slides' : 'slide'} ${nums.join(', ')}</span>`);
      }
      for (const c of e.checklist || []) chips.push(`<span class="meta-chip checklist" title="${C.checklist[c].replace(/"/g, '&quot;')}">On the week ${e.week} checklist</span>`);

      sec.innerHTML = `
        <div class="entry-head"><span class="entry-num">${e.num}</span><h2>${e.title}</h2>${e.recap ? '<span class="recap-tag">Recap</span>' : ''}</div>
        <div class="entry-meta">${chips.join('')}</div>
        <div class="entry-body">${transform(e.html)}</div>
        <div class="slides">
          <p class="slides-title">From the slides</p>
          <div class="slide-strip">${slides.map(s => `
            <button type="button" class="slide-thumb ${s.info.wide ? 'wide' : ''}" data-slide="${s.ref}">
              <img src="${slideSrc(s)}" alt="${slideName(s)}" loading="lazy">
              <span><b>${s.info.name}</b>, slide ${s.n}</span>
            </button>`).join('')}
          </div>
        </div>`;
      entriesRoot.appendChild(sec);
    }
  }

  /* ---------- Term registry + ids ---------- */
  const termInfo = {};   // id → { entryIndex, entry }
  ready.forEach((entry, i) => {
    const sec = $(`#e-${entry.id}`);
    $$('dfn[data-term]', sec).forEach(d => {
      const id = d.dataset.term;
      if (!C.terms[id]) console.error(`[terms] <dfn data-term="${id}"> has no entry in COURSE.terms`);
      if (termInfo[id]) console.error(`[terms] "${id}" is defined twice`);
      termInfo[id] = { entryIndex: i, entry };
      d.id = `t-${id}`;
    });
  });

  /* Used by the animations. Terms not defined yet (planned entries) stay plain text. */
  window.SiteUI = {
    transform,
    linkTerms: str => str.replace(/\[\[([a-z0-9-]+)(?:\|([^\]]+))?\]\]/g, (m, id, text) => {
      const label = text || id.replace(/-/g, ' ');
      return termInfo[id] ? `<a class="term-ref" href="#t-${id}" data-term="${id}">${label}</a>` : label;
    }),
  };

  /* A digest page (C.mainPage set) shows only some entries: a term defined in an entry
     that is not on it links to its definition on the main page instead. */
  if (C.mainPage) {
    $$('a.term-ref').forEach(a => { if (!termInfo[a.dataset.term]) a.setAttribute('href', `${C.mainPage}#t-${a.dataset.term}`); });
    /* and a link to an entry that is not on it goes to that entry on the main page */
    $$('a[href^="#e-"]').forEach(a => { const id = a.getAttribute('href').slice(1); if (!document.getElementById(id)) a.setAttribute('href', `${C.mainPage}#${id}`); });
  }

  /* ---------- Term link checks (open the console to see these) ---------- */
  /* Skipped on a digest page: its entries come from the weeks, which are checked on the main page */
  if (!C.mainPage) ready.forEach((entry, i) => {
    const sec = $(`#e-${entry.id}`);
    const linkedHere = new Set();
    $$('a.term-ref', sec).forEach(a => {
      const id = a.dataset.term;
      linkedHere.add(id);
      if (!termInfo[id]) console.error(`[terms] Entry ${entry.num} links to unknown term "${id}"`);
      else if (termInfo[id].entryIndex >= i) console.error(`[terms] Entry ${entry.num} links to "${id}", which is not defined earlier`);
    });
    // Flag known earlier terms that are mentioned but never linked in this entry
    const body = $('.entry-body', sec);
    const walker = document.createTreeWalker(body, NodeFilter.SHOW_TEXT, {
      acceptNode: n => n.parentElement.closest('a.term-ref, dfn, button, script, style, .katex, svg, .algo-mount, .ex-mount, .fig-mount, [data-fig], .callout-title, figcaption, .nt')
        ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT,
    });
    let text = '';
    while (walker.nextNode()) text += ' ' + walker.currentNode.nodeValue;
    for (const id in termInfo) {
      if (termInfo[id].entryIndex >= i || linkedHere.has(id)) continue;
      const hit = C.terms[id].aliases.find(a => new RegExp(`(?<![-\\w])${a}(?![-\\w])`, 'i').test(text));
      if (hit) console.warn(`[terms] Entry ${entry.num} mentions "${hit}" but has no [[${id}]] link`);
    }
  });

  /* ---------- Text for the search (read here, while formulas are still $…$) ---------- */
  const TEXT_BLOCK = /^(P|LI|UL|OL|DIV|PRE|SUMMARY|DETAILS|ASIDE|TABLE|THEAD|TBODY|TR|TD|TH|H[1-6]|BLOCKQUOTE|FIGURE|FIGCAPTION|SECTION)$/;
  const NOT_TEXT = '.algo-mount, .ex-mount, .fig-mount, [data-fig], [data-widget], [data-ex], svg, button, .added-tag, script, style';
  const markSpot = (entry, el, n) => {
    if (!el.id) el.id = `x-${entry.id}-${n}`;
    el.classList.add('text-spot');
    return el.id;
  };
  const passageFor = (entry, el, raw, n) => window.SearchLogic.makePassage(raw, {
    entry: entry.id, num: entry.num, title: entry.title, spot: markSpot(entry, el, n),
  });
  const textPassages = {};   // entry id → passages, in reading order
  ready.forEach(entry => {
    const list = textPassages[entry.id] = [];
    let owner = $('.entry-body', $(`#e-${entry.id}`)), text = '';
    const flush = () => { if (text.trim()) list.push(passageFor(entry, owner, text, list.length)); text = ''; };
    const walk = el => {
      for (const node of el.childNodes) {
        if (node.nodeType === Node.TEXT_NODE) { text += node.nodeValue; continue; }
        if (node.nodeType !== Node.ELEMENT_NODE || node.matches(NOT_TEXT)) continue;
        if (TEXT_BLOCK.test(node.tagName)) { flush(); owner = node; walk(node); flush(); owner = el; } else walk(node);
      }
    };
    walk(owner);
    flush();
  });

  /* ---------- Math ---------- */
  const mathOpts = {
    delimiters: [
      { left: '$$', right: '$$', display: true },
      { left: '$', right: '$', display: false },
    ],
    throwOnError: false,
  };
  const renderMath = el => { if (window.renderMathInElement) window.renderMathInElement(el, mathOpts); };
  renderMath($('#entries'));

  /* ---------- Interactive examples ---------- */
  const safely = (label, fn) => { try { fn(); } catch (err) { console.error(`${label} failed:`, err); } };
  ready.forEach(entry => {
    const sec = $(`#e-${entry.id}`);
    if (entry.init) safely(`Entry ${entry.num} example`, () => entry.init(sec));
    safely(`Entry ${entry.num} figures`, () => Figures.mountAll(sec));
    $$('[data-widget]', sec).forEach(w => safely(`Entry ${entry.num} widget`, () => Figures[w.dataset.widget](w)));
    $$('.algo-mount[data-algo]', sec).forEach(m => safely(`Entry ${entry.num} animation`, () => AlgoView.mount(m, Algorithms[m.dataset.algo], { mode: m.dataset.mode, preset: m.dataset.preset, presets: m.dataset.presets, modes: m.dataset.modes })));
    $$('[data-ex]', sec).forEach(m => safely(`Entry ${entry.num} exercise`, () => Exercises[m.dataset.ex](m)));
  });

  /* Checklist: which entries cover each item */
  const checkBox = $('#checklist-map');
  if (checkBox) {
    checkBox.innerHTML = C.weeks.map(week => `<li class="check-week">${weekName(week)}: ${week.title}</li>` + Object.entries(week.checklist).map(([key, text]) => {
      /* week.links (a digest page) names the entries for each line; otherwise entries list the key */
      const links = (week.links ? ready.filter(e => (week.links[key] || []).includes(e.id)) : ready.filter(e => (e.checklist || []).includes(key))).map(e => `<a href="#e-${e.id}">${e.num}</a>`).join(' ');
      return `<li><span>${text}</span><span class="check-links">${links}</span></li>`;
    }).join('')).join('');
  }

  /* ---------- Term hover card ---------- */
  const tip = $('#term-tip');
  let tipFor = null, hideTimer = null;

  const placeTip = a => {
    const r = a.getBoundingClientRect();
    tip.style.left = '0px'; tip.style.top = '0px';
    const w = tip.offsetWidth, h = tip.offsetHeight, m = 16;
    const left = Math.min(Math.max(m, r.left), document.documentElement.clientWidth - w - m);
    const below = r.bottom + 10 + h < window.innerHeight;
    const top = below ? r.bottom + 10 : r.top - h - 10;
    tip.style.left = `${left + window.scrollX}px`;
    tip.style.top = `${top + window.scrollY}px`;
  };

  const showTip = a => {
    clearTimeout(hideTimer);
    if (tipFor === a) return;
    if (tipFor) tipFor.classList.remove('tip-open');
    const id = a.dataset.term, t = C.terms[id];
    if (!t) return;
    const s = parseSlide(t.slide);
    const info = termInfo[id];
    tip.innerHTML = `
      <div class="tip-term">${t.name}</div>
      <p class="tip-def">${t.short}</p>
      <div class="tip-foot">
        <span>${info ? `Entry ${info.entry.num}` : ''}</span>
        <span>${slideName(s)}</span>
      </div>`;
    renderMath(tip);
    tip.hidden = false;
    placeTip(a);
    requestAnimationFrame(() => tip.classList.add('show'));
    tipFor = a; a.classList.add('tip-open');
  };

  const hideTip = (delay = 170) => {
    clearTimeout(hideTimer);
    hideTimer = setTimeout(() => {
      tip.classList.remove('show');
      if (tipFor) tipFor.classList.remove('tip-open');
      tipFor = null;
      setTimeout(() => { if (!tipFor) tip.hidden = true; }, 160);
    }, delay);
  };

  let lastPointer = 'mouse';
  document.addEventListener('pointerdown', e => { lastPointer = e.pointerType; }, true);

  const closestRef = t => (t instanceof Element ? t.closest('a.term-ref') : null);
  document.addEventListener('mouseover', e => {
    const a = closestRef(e.target);
    if (a && lastPointer !== 'touch') showTip(a);
  });
  document.addEventListener('mouseout', e => {
    if (closestRef(e.target)) hideTip();
  });
  document.addEventListener('focusin', e => {
    const a = closestRef(e.target);
    if (a && lastPointer !== 'touch') showTip(a);
  });
  document.addEventListener('focusout', e => { if (closestRef(e.target)) hideTip(); });
  tip.addEventListener('mouseenter', () => clearTimeout(hideTimer));
  tip.addEventListener('mouseleave', () => hideTip());

  /* ---------- Jump to a definition, flash it, offer a way back ---------- */
  const backBtn = $('#back-jump');
  let backY = null;

  const flashTarget = () => {
    const id = decodeURIComponent(location.hash.slice(1));
    if (!id) return;
    const target = document.getElementById(id);
    if (!target) return;
    const box = target.classList.contains('text-spot') ? target : target.closest('.box') || target;
    box.classList.remove('flash');
    void box.offsetWidth;   // restart the animation
    box.classList.add('flash');
    setTimeout(() => box.classList.remove('flash'), 1700);
  };
  window.addEventListener('hashchange', flashTarget);
  if (location.hash) flashTarget();

  document.addEventListener('click', e => {
    const a = closestRef(e.target);
    if (!a) return;
    // Touch: first tap shows the card, second tap jumps
    if (lastPointer === 'touch' && tipFor !== a) {
      e.preventDefault();
      showTip(a);
      return;
    }
    backY = window.scrollY;
    backBtn.hidden = false;
    hideTip(0);
    if (location.hash === a.getAttribute('href')) flashTarget();  // same target twice
  });

  backBtn.addEventListener('click', () => {
    if (backY != null) window.scrollTo({ top: backY });
    backY = null;
    backBtn.hidden = true;
  });

  // Tap anywhere else closes the card on touch screens
  document.addEventListener('click', e => {
    if (lastPointer === 'touch' && tipFor && !closestRef(e.target) && !tip.contains(e.target)) hideTip(0);
  });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') hideTip(0); });

  /* ---------- Search (matching rules are in search-logic.js) ---------- */
  const S = window.SearchLogic;
  const searchItems = ready.flatMap(entry => {
    const label = S.parseLabel(entry.title);
    const extras = [entry.algo && 'Algorithm', entry.exercise && 'Exercise'].filter(Boolean);
    const termIds = $$('dfn[data-term]', $(`#e-${entry.id}`)).map(d => d.dataset.term).filter(id => C.terms[id]);
    // An entry named exactly like the term it defines is one suggestion, not two
    const sameName = termIds.find(id => S.parseLabel(C.terms[id].name).norm === label.norm);
    const rows = [];
    if (!sameName) {
      const kinds = [entry.recap && 'Recap', ...extras].filter(Boolean);
      rows.push({ label, aliases: [], href: `#e-${entry.id}`, num: entry.num, kinds: kinds.length ? kinds : ['Topic'] });
    }
    for (const id of termIds) {
      rows.push({
        label: S.parseLabel(C.terms[id].name), aliases: C.terms[id].aliases, href: `#t-${id}`, num: entry.num,
        kinds: id === sameName ? ['Definition', ...extras] : ['Definition'],
      });
    }
    return rows;
  });

  // The animations' pseudo-code exists only once they are mounted, so it is added here
  const searchPassages = ready.flatMap(entry => {
    const list = textPassages[entry.id];
    $$('.algo-mount', $(`#e-${entry.id}`)).forEach(mount => {
      $$('.code-line code', mount).forEach(line => list.push(passageFor(entry, mount, line.textContent, list.length)));
    });
    return list;
  });

  const searchBox = $('#site-search');
  const searchPanel = $('#search-panel');
  const searchResults = $('#search-results');
  const searchStatus = $('#search-status');
  const tocScroller = $('#toc');
  let searchRows = [], searchActive = -1, tocScrollBefore = 0;

  const setSearchActive = (i, reveal) => {
    searchRows.forEach((r, n) => { r.classList.toggle('active', n === i); r.setAttribute('aria-selected', String(n === i)); });
    searchActive = i;
    if (i < 0) { searchBox.removeAttribute('aria-activedescendant'); return; }
    searchBox.setAttribute('aria-activedescendant', searchRows[i].id);
    if (reveal) {
      if (i === 0) tocScroller.scrollTop = 0;
      else searchRows[i].scrollIntoView({ block: 'nearest' });
    }
  };

  const closeSearchPanel = () => {
    if (searchPanel.hidden) return;
    searchPanel.hidden = true;
    tocList.hidden = false;
    searchRows = []; searchActive = -1;
    searchResults.innerHTML = '';
    searchBox.setAttribute('aria-expanded', 'false');
    searchBox.removeAttribute('aria-activedescendant');
    tocScroller.scrollTop = tocScrollBefore;
  };

  const renderSearch = () => {
    const found = S.rank(searchItems, searchBox.value);
    if (!found) { closeSearchPanel(); return; }
    if (searchPanel.hidden) {
      tocScrollBefore = tocScroller.scrollTop;
      searchPanel.hidden = false;
      tocList.hidden = true;
      searchBox.setAttribute('aria-expanded', 'true');
    }
    let n = 0;
    const row = ({ item, at, len, via }) => `
      <a class="search-row" id="search-row-${n++}" role="option" aria-selected="false" tabindex="-1" href="${item.href}">
        <span class="num">${item.num}</span>
        <span>${S.labelHTML(item.label, at, len)}<small class="search-kind">${item.kinds.map(k => k === 'Algorithm' ? '<span class="algo-badge">Algorithm</span>' : k).join(' · ')}${via ? ` · matches “${S.esc(via)}”` : ''}</small></span>
      </a>`;
    const q = S.esc(found.query);
    const group = (title, list) => list.length ? `<p class="search-tier" role="presentation">${title}</p>${list.map(row).join('')}` : '';
    const textRow = ({ passage: p, at, len, more }) => `
      <a class="search-row" id="search-row-${n++}" role="option" aria-selected="false" tabindex="-1" href="#${p.spot}">
        <span class="num">${p.num}</span>
        <span>${S.snippetHTML(p, at, len)}<small class="search-kind">${S.labelHTML(S.parseLabel(p.title))}${more ? ` · ${more} more in this entry` : ''}</small></span>
      </a>`;
    const textHits = S.searchText(searchPassages, searchBox.value);
    searchResults.innerHTML = group(`Starts with “${q}”`, found.starts) + group(`Contains “${q}”`, found.contains)
      + (textHits.length ? `<p class="search-tier" role="presentation">In the text</p>${textHits.map(textRow).join('')}` : '');
    searchRows = $$('.search-row', searchResults);
    const count = searchRows.length;
    searchStatus.textContent = count ? `${count} ${count === 1 ? 'suggestion' : 'suggestions'}` : `Nothing taught so far matches “${found.query}”.`;
    searchStatus.classList.toggle('empty', !count);
    tocScroller.scrollTop = 0;
    setSearchActive(count ? 0 : -1);
  };

  const clearSearch = () => { searchBox.value = ''; closeSearchPanel(); };

  searchBox.addEventListener('input', renderSearch);
  searchBox.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      if (searchBox.value) { e.preventDefault(); clearSearch(); } else searchBox.blur();
      return;
    }
    if (!searchRows.length) return;
    if (e.key === 'ArrowDown') { e.preventDefault(); setSearchActive((searchActive + 1) % searchRows.length, true); }
    if (e.key === 'ArrowUp') { e.preventDefault(); setSearchActive((searchActive - 1 + searchRows.length) % searchRows.length, true); }
    if (e.key === 'Enter') { e.preventDefault(); searchRows[Math.max(searchActive, 0)].click(); }
  });
  searchResults.addEventListener('mousemove', e => {
    const r = e.target instanceof Element ? e.target.closest('.search-row') : null;
    const i = r ? searchRows.indexOf(r) : -1;
    if (i >= 0 && i !== searchActive) setSearchActive(i);
  });
  searchResults.addEventListener('click', e => {
    const a = e.target instanceof Element ? e.target.closest('.search-row') : null;
    if (!a) return;
    backY = window.scrollY;
    backBtn.hidden = false;
    // A match can be inside a folded proof: unfold it before the browser jumps there
    const spot = document.getElementById(a.getAttribute('href').slice(1));
    for (let d = spot && spot.closest('details'); d; d = d.parentElement.closest('details')) d.open = true;
    if (location.hash === a.getAttribute('href')) flashTarget();  // same target twice
    setTimeout(() => { clearSearch(); searchBox.blur(); }, 0);    // after the browser has followed the link
  });

  /* ---------- Slide viewer ---------- */
  const viewer = $('#slide-viewer');
  const viewerImg = $('#viewer-img');
  const viewerCap = $('#viewer-caption');
  const prevBtn = $('#viewer-prev');
  const nextBtn = $('#viewer-next');
  let current = null;

  const showSlide = s => {
    current = s;
    viewerImg.src = slideSrc(s);
    viewerImg.alt = slideName(s);
    viewerCap.textContent = `${s.info.name}, slide ${s.n} of ${s.info.count}`;
    prevBtn.disabled = s.n <= 1;
    nextBtn.disabled = s.n >= s.info.count;
  };
  const step = d => {
    if (!current) return;
    const n = current.n + d;
    if (n < 1 || n > current.info.count) return;
    showSlide(parseSlide(`${current.deck}${n}`));
  };
  document.addEventListener('click', e => {
    if (!(e.target instanceof Element)) return;
    const b = e.target.closest('[data-slide]');
    if (!b) return;
    showSlide(parseSlide(b.dataset.slide));
    viewer.showModal();
  });
  prevBtn.addEventListener('click', () => step(-1));
  nextBtn.addEventListener('click', () => step(1));
  $('#viewer-close').addEventListener('click', () => viewer.close());
  viewer.addEventListener('click', e => { if (e.target === viewer) viewer.close(); });
  viewer.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft') step(-1);
    if (e.key === 'ArrowRight') step(1);
  });

  /* ---------- TOC: active entry + mobile drawer ---------- */
  const tocLinks = $$('.toc a[href^="#e-"]');
  const linkFor = id => tocLinks.find(a => a.getAttribute('href') === `#${id}`);
  if ('IntersectionObserver' in window) {
    let activeGroup = null;
    const io = new IntersectionObserver(items => {
      items.forEach(it => {
        if (!it.isIntersecting) return;
        tocLinks.forEach(a => a.classList.remove('active'));
        const l = linkFor(it.target.id);
        if (!l) return;
        l.classList.add('active');
        // Reading into a different week opens that week in the sidebar
        const group = l.closest('details');
        if (group !== activeGroup) { activeGroup = group; group.open = true; }
      });
    }, { rootMargin: '-20% 0px -70% 0px' });
    $$('.entry').forEach(s => io.observe(s));
  }
  const toc = $('#toc'), tocBtn = $('.toc-toggle');
  tocBtn.addEventListener('click', () => {
    const open = toc.classList.toggle('open');
    tocBtn.setAttribute('aria-expanded', String(open));
  });
  toc.addEventListener('click', e => {
    if (e.target instanceof Element && e.target.closest('a')) {
      toc.classList.remove('open');
      tocBtn.setAttribute('aria-expanded', 'false');
    }
  });
});
