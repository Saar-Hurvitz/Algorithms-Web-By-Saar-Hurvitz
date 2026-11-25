/* ==========================================================================
   search-logic.js — matching rules for the sidebar search. No page access,
   so it can be tested in Node with `global.window = global`.

   A row matches when the typed letters appear one after another, ignoring
   capitals and treating "-" as a space (so "in degree" finds "In-degree").
   Names that START with the letters come first, then names that only
   CONTAIN them. Each group keeps the order things were taught.

   Body text is matched separately (searchText). Formulas are turned into what
   you would type, so "n(n-1)/2" finds \frac{n(n-1)}{2}, and spacing around
   symbols does not matter.
   ========================================================================== */
window.SearchLogic = (() => {
  const fold = s => s.toLowerCase().replace(/-/g, ' ');
  const normalize = s => fold(s).trim().replace(/\s+/g, ' ');

  /* "Path graph $P_n$" → letters you can type ("Path graph Pn"), remembering
     which ones are subscripts so they can still be drawn as subscripts. */
  const parseLabel = name => {
    const chars = [];
    let inMath = false;
    for (let i = 0; i < name.length; i++) {
      const c = name[i];
      if (c === '$') { inMath = !inMath; continue; }
      if (inMath && c === '_') {
        let sub = name[i + 1];
        if (sub === '{') {
          const end = name.indexOf('}', i);
          sub = name.slice(i + 2, end);
          i = end;
        } else {
          i += 1;
        }
        for (const s of sub) chars.push({ c: s, sub: true });
        continue;
      }
      chars.push({ c, sub: false });
    }
    const text = chars.map(x => x.c).join('');
    return { chars, text, norm: fold(text) };
  };

  /* items: [{ label: parseLabel(...), aliases: [...] }], in taught order.
     Returns null for an empty search. */
  const rank = (items, query) => {
    const q = normalize(query);
    if (!q) return null;
    const starts = [], contains = [];
    for (const item of items) {
      const aliases = (item.aliases || []).map(fold);
      const names = [item.label.norm, ...aliases];
      const isStart = names.some(n => n.startsWith(q));
      if (!isStart && !names.some(n => n.includes(q))) continue;
      const at = item.label.norm.indexOf(q);
      // The visible name may not hold the letters ("toposort" → "Topological sort")
      const via = at >= 0 ? null : (aliases.find(n => n.startsWith(q)) || aliases.find(n => n.includes(q)));
      (isStart ? starts : contains).push({ item, at, len: q.length, via });
    }
    return { query: q, starts, contains };
  };

  const esc = s => s.replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  /* The name as HTML, with the matched letters marked. */
  const labelHTML = (label, at = -1, len = 0) => {
    let html = '';
    for (let i = 0; i < label.chars.length;) {
      const sub = label.chars[i].sub;
      const hit = at >= 0 && i >= at && i < at + len;
      let run = '';
      while (i < label.chars.length && label.chars[i].sub === sub
        && (at >= 0 && i >= at && i < at + len) === hit) run += label.chars[i++].c;
      let piece = esc(run);
      if (sub) piece = `<sub>${piece}</sub>`;
      if (hit) piece = `<mark class="search-hit">${piece}</mark>`;
      html += piece;
    }
    return html;
  };

  /* ---------- Body text ---------- */
  const TEX_SYMBOLS = {
    ge: '≥', geq: '≥', le: '≤', leq: '≤', ne: '≠', neq: '≠', gg: '≫', ll: '≪',
    in: 'in', notin: 'not in', subseteq: '⊆', subset: '⊂', cup: '∪', cap: '∩',
    to: '→', rightarrow: '→', xrightarrow: '→', Rightarrow: '⇒', implies: '⇒', Leftrightarrow: '⇔', iff: '⇔',
    cdot: '*', times: '×', neg: '¬', ldots: '...', dots: '...', cdots: '...', infty: '∞', emptyset: '∅',
  };
  const TEX_DROPPED = new Set(['left', 'right', 'quad', 'qquad', 'displaystyle', 'limits']);
  const TEX_WRAPPERS = new Set(['text', 'textbf', 'mathrm', 'mathbf', 'mathit', 'mathbb', 'mathcal', 'operatorname']);

  /* A fraction part needs brackets only if it is a sum: n(n-1) no, n-1 yes */
  const isSum = s => {
    let depth = 0;
    for (const c of s) {
      if (c === '(') depth++;
      if (c === ')') depth--;
      if (depth === 0 && /[-+\s]/.test(c)) return true;
    }
    return false;
  };

  /* "\frac{n(n-1)}{2}" → "n(n-1)/2" */
  const texToPlain = tex => {
    let i = 0;
    const arg = () => {
      while (tex[i] === ' ') i++;
      if (tex[i] === '{') { i++; const s = seq('}'); i++; return s; }
      if (tex[i] === '\\') return command();
      return tex[i++] || '';
    };
    const command = () => {
      i++;
      if (!/[a-zA-Z]/.test(tex[i] || '')) { const c = tex[i++] || ''; return /[,;:! ]/.test(c) ? ' ' : c; }
      let name = '';
      while (/[a-zA-Z]/.test(tex[i] || '')) name += tex[i++];
      if (name === 'frac' || name === 'dfrac' || name === 'tfrac') {
        const [a, b] = [arg(), arg()].map(s => (isSum(s) ? `(${s})` : s));
        return `${a}/${b}`;
      }
      if (name === 'begin' || name === 'end') { arg(); return ' '; }
      if (name === 'overset') { const over = arg(); return arg() + over; }
      if (name === 'left' || name === 'right') { if (tex[i] === '.') i++; return ''; }
      if (TEX_WRAPPERS.has(name)) return arg();
      if (TEX_DROPPED.has(name)) return '';
      return TEX_SYMBOLS[name] || name;
    };
    const seq = close => {
      let out = '';
      while (i < tex.length && tex[i] !== close) {
        const c = tex[i];
        if (c === '\\') {
          const word = command();
          out += /[a-z0-9]$/i.test(out) && /^[a-z]/i.test(word) ? ` ${word}` : word;
        } else if (c === '{') {
          out += arg();
        } else if (c === '^' || c === '_') {
          i++;
          const a = arg();
          out += c + (c === '^' && a.length > 1 ? `(${a})` : a);
        } else {
          out += c === '~' ? ' ' : c;
          i++;
        }
      }
      return out;
    };
    return seq().replace(/\s+/g, ' ').trim();
  };

  const mathToPlain = s => s.replace(/\$\$([\s\S]+?)\$\$|\$([^$]+?)\$/g, (m, a, b) => texToPlain(a || b));

  /* What a keyboard can type → the symbol a formula is shown with */
  const typedSymbols = s => s.replace(/<=>/g, '⇔').replace(/>=/g, '≥').replace(/<=/g, '≤').replace(/!=/g, '≠').replace(/=>/g, '⇒').replace(/->/g, '→');

  const SPACE_FREE = /[()[\]/+=,<>^|:;≤≥≠⊆⊂→⇒⇔×]/;

  /* The comparable form of a text, plus each of its letters' place in the original */
  const canon = text => {
    const kept = [];
    for (let i = 0; i < text.length; i++) {
      let c = text[i].toLowerCase();
      if (/[*·_{}$\\]/.test(c)) continue;
      if (c === '’' || c === '‘') c = "'";
      if (/[-−–—\s]/.test(c)) c = ' ';
      kept.push({ c, i });
    }
    const out = [];
    kept.forEach((k, n) => {
      if (k.c === ' ') {
        const prev = out[out.length - 1];
        let m = n + 1;
        while (kept[m] && kept[m].c === ' ') m++;
        if (!prev || prev.c === ' ' || !kept[m] || SPACE_FREE.test(prev.c) || SPACE_FREE.test(kept[m].c)) return;
      }
      out.push(k);
    });
    return { norm: out.map(k => k.c).join(''), map: out.map(k => k.i) };
  };

  /* raw: a passage as written, with $math$. Returns what searchText needs. */
  const makePassage = (raw, fields) => {
    const text = typedSymbols(mathToPlain(raw)).replace(/\s+/g, ' ').trim();
    return { ...fields, text, ...canon(text) };
  };

  /* passages: in taught order, each with an `entry` field. At most `perEntry`
     rows per entry; the last one shown counts the rest in `more`. */
  const searchText = (passages, query, perEntry = 3) => {
    const q = canon(typedSymbols(query)).norm;
    if (q.length < 2) return [];
    const hits = [], seen = new Map();
    for (const p of passages) {
      const at = p.norm.indexOf(q);
      if (at < 0) continue;
      const count = (seen.get(p.entry) || 0) + 1;
      seen.set(p.entry, count);
      if (count <= perEntry) hits.push({ passage: p, at, len: q.length, more: 0 });
    }
    const lastShown = new Map(hits.map(h => [h.passage.entry, h]));
    lastShown.forEach((h, entry) => { h.more = Math.max(0, seen.get(entry) - perEntry); });
    return hits;
  };

  /* A short piece of the passage around the match, with the match marked. */
  const snippetHTML = (p, at, len) => {
    const from = p.map[at], to = p.map[at + len - 1] + 1;
    let a = Math.max(0, from - 30), b = Math.min(p.text.length, to + 50);
    if (a > 0) { const sp = p.text.indexOf(' ', a); if (sp >= 0 && sp < from) a = sp + 1; }
    if (b < p.text.length) { const sp = p.text.lastIndexOf(' ', b); if (sp >= to) b = sp; }
    return `${a > 0 ? '…' : ''}${esc(p.text.slice(a, from))}<mark class="search-hit">${esc(p.text.slice(from, to))}</mark>${esc(p.text.slice(to, b))}${b < p.text.length ? '…' : ''}`;
  };

  return { normalize, parseLabel, rank, labelHTML, esc, texToPlain, makePassage, searchText, snippetHTML };
})();
