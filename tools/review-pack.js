// Builds the input of a content review (docs/CONTENT_REVIEW.md), once, so the reviewers
// read a few files instead of extracting every slide and entry themselves.
//
//   node tools/review-pack.js <week> [--entries id1,id2,...] [--out <dir>]
//
// Writes to .review-pack/week<N>/ (or --out):
//   slides.md   the text of every slide in scope, one section per slide. A slide marked
//               LOOK has a picture, a drawing, a table or math symbols that text extraction
//               may lose: open its PNG before saying what it shows.
//   entries.md  every entry in scope as plain text, one numbered sentence per line, each
//               with its source: [cites 6L9] / [inherits 6L9] (from its paragraph or box) /
//               [entry] (only the entry's slide strip) / [added] / [NO SOURCE]. NUM? lists numbers that appear in none of the cited
//               slides (often a computed value that needs {{added}}).
//   flags.md    what to look at first: NO SOURCE and NUM? sentences, the ⚠️ notes,
//               the animations and exercises mounted, slides no entry cites, and the
//               NEW/CHANGED items of tools/review-fingerprints.js.
// With --entries, only those entries and the slides they cite are in scope.
global.window = global;
const fs = require('fs'), path = require('path'), { execFileSync } = require('child_process');
const d = path.resolve(__dirname, '..');

const args = process.argv.slice(2);
/* A past exam: node tools/review-pack.js exam <id>. Its "slides" are the exam's pages, and its
   entries are the questions as past-exams/<id>/<id>.js and js/exam.js build them. */
const EXAM_ID = args[0] === 'exam' ? args[1] : null;
const N = EXAM_ID ? 'X' : args[0];
if (!N || (!EXAM_ID && !/^\d+$/.test(N))) { console.error('Usage: node tools/review-pack.js <week> | exam <id> [--entries id1,id2] [--out dir]'); process.exit(1); }
const opt = k => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : null; };
const only = opt('--entries') ? opt('--entries').split(',').map(s => s.trim()) : null;
const out = path.resolve(d, opt('--out') || (EXAM_ID ? `.review-pack/exam-${EXAM_ID}` : `.review-pack/week${N}`));

/* Load the course as the page does */
global.E = {};
global.GraphView = { autoBend: e => e, create: () => ({}) };
global.Algorithms = {};
const scripts = [...fs.readFileSync(d + '/index.html', 'utf8').matchAll(/<script src="(js\/[^"]+)"/g)].map(m => m[1]);
for (const f of scripts) if (/^js\/(course\.js|weeks\/|graph-logic\.js|exercises\.js|algorithms\/)/.test(f)) require(d + '/' + f);
if (EXAM_ID) { require(`${d}/past-exams/${EXAM_ID}/${EXAM_ID}.js`); require(d + '/js/exam.js'); }
const C = COURSE, week = C.weeks.find(w => String(w.n) === N);
if (!week) { console.error(`No week ${N} on the site`); process.exit(1); }
C.parts.flatMap(p => p.entries).forEach((e, i) => { e.num = i + 1; });
const allEntries = C.parts.filter(p => p.week === week.n).flatMap(p => p.entries);
const entries = only ? allEntries.filter(e => only.includes(e.id)) : allEntries;
if (only && entries.length !== only.length) console.warn('Unknown entry ids:', only.filter(id => !entries.some(e => e.id === id)).join(', '));

/* ---------- Slides: text per page, from the week's PDFs ---------- */
const run = (cmd, a) => execFileSync(cmd, a, { encoding: 'utf8', maxBuffer: 1 << 26 });
const pdfDir = EXAM_ID ? path.dirname(`${d}/${EXAM.pdf}`) : `${d}/weeks/week${N}`;
const pdfs = fs.readdirSync(pdfDir).filter(f => /\.pdf$/i.test(f) && (!EXAM_ID || f === path.basename(EXAM.pdf))).map(f => {
  const file = `${pdfDir}/${f}`;
  return { f, file, pages: +(run('pdfinfo', [file]).match(/Pages:\s+(\d+)/) || [])[1] };
});
const deckPdf = {};
const decksInScope = EXAM_ID ? { [EXAM.deck]: EXAM.deckInfo } : week.decks;
for (const [key, deck] of Object.entries(decksInScope)) {
  const same = pdfs.filter(p => p.pages === deck.count);
  deckPdf[key] = same.find(p => p.f.toLowerCase().includes(deck.kind.toLowerCase())) || same[0];
  if (!deckPdf[key]) console.warn(`No PDF with ${deck.count} pages for deck ${key}`);
}
const refRe = /\{\{(\d*[A-Z])(\d+)\}\}/g;
const slideText = {}, look = {};
const MATH = /[∑≤≥→←∞δΔ∈∉⊆∪∩πλσ√≠×·⇒⇔]|[-�]/;
for (const [key, deck] of Object.entries(decksInScope)) {
  const pdf = deckPdf[key];
  if (!pdf) continue;
  const imgPages = new Set();
  try { run('pdfimages', ['-list', pdf.file]).split('\n').slice(2).forEach(l => { const p = +l.trim().split(/\s+/)[0]; if (p) imgPages.add(p); }); } catch (e) { /* no pdfimages */ }
  for (let i = 1; i <= deck.count; i++) {
    const t = run('pdftotext', ['-layout', '-f', String(i), '-l', String(i), pdf.file, '-']).split('\n').map(l => l.replace(/\s+$/, '')).filter(l => l.trim()).join('\n');
    slideText[`${key}${i}`] = t.normalize('NFKC');
    const why = [];
    if (imgPages.has(i)) why.push('picture');
    if (t.split('\n').filter(l => l.trim().split(/\s+/).every(w => w.length <= 3)).length >= 5) why.push('drawing or table');
    if (MATH.test(t)) why.push('math symbols');
    if (t.replace(/\s/g, '').length < 15) why.push('almost no text');
    if (EXAM_ID) why.push('Hebrew: extraction reverses parentheses and mixed-direction text, and loses the blue color and underlines');
    if (why.length) look[`${key}${i}`] = why.join(', ');
  }
}

/* ---------- Entries: HTML to sourced sentences ---------- */
const nums = s => (s.replace(/\{\{[^}]*\}\}/g, ' ').replace(/\b(Lecture|Recitation|Week|week|slide|slides|Exercise|Claim|step|Step|Lemma|Remark|remark)\s+\d+(\.\d+)?/g, ' ').replace(/^\s*\d+\.\s/, ' ').match(/(?<![A-Za-z_^{\d.])\d+(?:\.\d+)?(?![A-Za-z\d])/g) || []);
function render(html) {
  let h = html
    .replace(/data-lazy-(ex|algo)=/g, 'data-$1=')
    .replace(/<div class="algo-mount"([^>]*)><\/div>/g, (_, a) => `<p>[ANIMATION${a.replace(/data-/g, ' ').replace(/"/g, '')}]</p>`)
    .replace(/<div class="ex-mount"([^>]*)><\/div>/g, (_, a) => `<p>[EXERCISE${a.replace(/data-/g, ' ').replace(/"/g, '')}]</p>`)
    .replace(/\[\[([^\]|]+)\|([^\]]+)\]\]/g, '$2').replace(/\[\[([^\]]+)\]\]/g, (_, id) => id.replace(/-/g, ' '))
    .replace(/==([^=]+)==/g, '$1').replace(/!!([^!]+)!!/g, '$1');
  /* Walk the tags: text goes to the innermost block; boxes, callouts and proofs give context */
  const blocks = [], stack = [];
  let buf = '', bufRefs = null;
  const BLOCK = EXAM_ID ? /^(p|li|summary|tr|pre|h\d|figcaption|button)$/ : /^(p|li|summary|tr|pre|h\d|figcaption)$/;
  const ctx = () => stack.filter(s => s.ctx).map(s => s.ctx);
  const flush = kind => {
    const text = buf.replace(/\s+/g, kind === 'pre' ? ' ' : ' ').trim();
    if (text) blocks.push({ text, kind, context: ctx().map(c => ({ ...c })) });
    buf = '';
  };
  const re = /<(\/?)([a-zA-Z0-9]+)([^>]*)>|([^<]+|<)/g;
  let m;
  while ((m = re.exec(h))) {
    if (m[4] != null) { buf += m[4]; continue; }
    if (/^(td|th)$/i.test(m[2]) && !m[1]) { if (buf.trim()) buf += ' | '; continue; }
    const [, close, tag, attrs] = m, t = tag.toLowerCase(), cls = (attrs.match(/class="([^"]*)"/) || [])[1] || '';
    if (/^(br)$/.test(t)) { buf += ' '; continue; }
    if (!close) {
      if (BLOCK.test(t) || /box-label|callout-title/.test(cls)) flush('text');
      const kind = /\bbox\b/.test(cls) ? `box ${cls.replace(/\bbox\b/, '').trim()}` : /callout/.test(cls) ? `callout ${cls.replace(/callout/, '').trim()}` : t === 'details' ? 'proof' : t === 'table' ? 'table' : null;
      stack.push({ t, ctx: kind ? { kind, label: '', refs: [] } : null, label: /box-label|callout-title/.test(cls), block: BLOCK.test(t) });
      continue;
    }
    for (let i = stack.length - 1; i >= 0; i--) {
      if (stack[i].t !== t) continue;
      const el = stack.splice(i)[0];
      if (el.label || t === 'summary') {
        const label = buf.trim(), owner = [...stack].reverse().find(s => s.ctx);
        if (owner) { owner.ctx.label = label.replace(/\{\{[^}]*\}\}/g, '').trim(); owner.ctx.refs = [...label.matchAll(refRe)].map(x => x[1] + x[2]); owner.ctx.added = /\{\{added\}\}/.test(label); }
        flush(el.label ? 'label' : t);
      } else if (el.block) {
        if (t === 'tr' && stack.some(x => x.t === 'thead')) {
          const owner = [...stack].reverse().find(x => x.ctx);
          if (owner) { owner.ctx.label = buf.replace(/\{\{[^}]*\}\}/g, '').replace(/\s+/g, ' ').trim().slice(0, 40); owner.ctx.refs = [...buf.matchAll(refRe)].map(x => x[1] + x[2]); }
          flush('label');
        } else flush(t === 'pre' ? 'code' : t === 'li' ? 'item' : 'text');
      }
      break;
    }
  }
  flush('text');
  return blocks;
}
function sentences(block) {
  if (block.kind === 'code' || block.kind === 'label' || /^\[(ANIMATION|EXERCISE)/.test(block.text)) return [block.text];
  const parts = block.text.split(/(?<=[.?!])\s+(?=[A-Z0-9("“$[\\])/);
  /* A {{…}} that opens a part belongs to the sentence before it */
  for (let i = 1; i < parts.length; i++) {
    const lead = parts[i].match(/^((?:\{\{[^}]*\}\}\s*)+)/);
    if (lead) { parts[i - 1] += ' ' + lead[1].trim(); parts[i] = parts[i].slice(lead[1].length).trim(); }
  }
  for (let i = parts.length - 2; i >= 0; i--) if (/^\(?\d+\.\)?$/.test(parts[i].trim())) { parts[i] = parts[i] + ' ' + parts[i + 1]; parts.splice(i + 1, 1); }
  return parts.filter(p => p.trim());
}

const lines = [], flags = { none: [], num: [], notes: [], mounts: [] };
const cited = new Set();
entries.forEach(e => {
  e.slides.forEach(s => cited.add(s));
  const tags = [e.recap && 'recap', e.algo && 'algorithm', e.exercise && 'exercise'].filter(Boolean).join(', ');
  lines.push(`\n## ${e.num} ${e.id}: ${e.title}`, `slides: ${e.slides.join(' ')}${tags ? `  |  ${tags}` : ''}${e.checklist ? `  |  checklist: ${e.checklist.join(' ') || '—'}` : ''}\n`);
  let k = 0;
  let before = [];
  render(e.html).forEach(b => {
    const ctxLabel = b.context.length ? b.context.map(c => `${c.kind}${c.label ? ` "${c.label.slice(0, 40)}"` : ''}`).join(' > ') : '';
    const ctxRefs = b.context.flatMap(c => c.refs);
    const blockRefs = [...b.text.matchAll(refRe)].map(x => x[1] + x[2]);
    const blockAdded = /\{\{added\}\}\s*$/.test(b.text) || b.context.some(c => c.added);
    if (b.kind === 'text' && (blockRefs.length || ctxRefs.length)) before = blockRefs.length ? blockRefs : ctxRefs;
    if (b.context.some(c => /caution/.test(c.kind) && /⚠️/.test(c.label)) && b.kind !== 'label') flags.notes.push(`${e.num} ${e.id}: ${b.context.find(c => /caution/.test(c.kind)).label}`);
    if (/^\[(ANIMATION|EXERCISE)/.test(b.text)) flags.mounts.push(`${e.num} ${e.id}: ${b.text}`);
    if (ctxLabel && b.kind !== 'label') lines.push(`   (in ${ctxLabel}${ctxRefs.length ? ` ${ctxRefs.join(' ')}` : ''})`);
    sentences(b).forEach(s => {
      k++;
      const own = [...s.matchAll(refRe)].map(x => x[1] + x[2]);
      own.forEach(r => cited.add(r));
      const added = /\{\{added\}\}/.test(s) || blockAdded;
      const inherited = [...new Set([...blockRefs, ...ctxRefs, ...((b.kind === 'item' || b.kind === 'code') ? before : [])])].filter(r => !own.includes(r));
      let src;
      if (b.kind === 'label') src = '[label]';
      else if (/^\[(ANIMATION|EXERCISE)/.test(s)) src = '[mount]';
      else if (added) src = /\{\{added\}\}/.test(s) ? '[added]' : '[added, by its paragraph or box]';
      else if (own.length) src = `[cites ${own.join(' ')}]`;
      else if (inherited.length) src = `[inherits ${inherited.join(' ')}]`;
      else if (e.slides.length) src = '[entry]';
      else src = '[NO SOURCE]';
      const pool = (own.length ? own : inherited.length ? inherited : e.slides).map(r => slideText[r] || '').join(' ');
      const have = new Set((pool.replace(/[−–]/g, '-').match(/\d+/g) || []));
      const missing = added || b.kind === 'code' || !/^\[(cites|inherits|entry)/.test(src) ? [] : [...new Set(nums(s))].filter(x => (+x > 1 || /^0\d/.test(x)) && !have.has(x) && !have.has(x.replace(/^0+(?=\d)/, '')));
      const text = s.replace(/\s+/g, ' ').replace(/\{\{added\}\}/g, '{added}');
      lines.push(`${e.num}.${k} ${src}${missing.length ? ` NUM? ${missing.join(',')}` : ''} ${text}`);
      if (src === '[NO SOURCE]') flags.none.push(`${e.num}.${k} ${e.id}: ${text.slice(0, 140)}`);
      if (missing.length) flags.num.push(`${e.num}.${k} ${e.id}: NUM? ${missing.join(',')} :: ${text.slice(0, 120)}`);
    });
  });
});

/* ---------- Write ---------- */
fs.mkdirSync(out, { recursive: true });
const inScope = Object.keys(slideText).filter(r => !only || cited.has(r));
fs.writeFileSync(`${out}/slides.md`, `# Week ${N} slides: text by page\nLOOK = open the PNG (${EXAM_ID ? `assets/exams/${EXAM_ID}/` : `assets/slides/week${N}/`}…) before saying what the slide shows.\n` +
  inScope.map(r => `\n## ${r}${look[r] ? `   LOOK: ${look[r]}` : ''}\n${slideText[r] || '(no text)'}`).join('\n') + '\n');
fs.writeFileSync(`${out}/entries.md`, `# Week ${N} entries as sentences\nEach line: <entry>.<n> [source] text. [cites X] = the sentence cites X; [inherits X] = its paragraph or box cites X;\n[entry] = only the entry's slide strip (its \`slides\` list) covers it; [added] / [added, by its paragraph] = tagged {{added}}; [NO SOURCE] = none of these. NUM? = numbers found in none of those slides' text.\n` + lines.join('\n') + '\n');

let fp = '';
try {
  const all = run('node', [d + '/tools/review-fingerprints.js', 'check']);
  fp = (all.match(/CHANGED since its review[\s\S]*?(?=\nNEW)/) || [''])[0] + '\n' + (all.match(/NEW, never reviewed[\s\S]*?(?=\nWeek \d|$)/) || [''])[0];
} catch (e) { fp = '(review-fingerprints.js check failed)'; }
const uncited = Object.keys(slideText).filter(r => !cited.has(r) && !only);
fs.writeFileSync(`${out}/flags.md`, [
  `# Week ${N}: what to check first`,
  `Scope: ${only ? `entries ${only.join(', ')}` : `all ${entries.length} entries of week ${N}`}; ${inScope.length} slides.`,
  `\n## Sentences with NO SOURCE (${flags.none.length}): need a citation or {{added}}, unless they only link or introduce`, ...flags.none,
  `\n## NUM? (${flags.num.length}): numbers absent from the cited slides' text. Often a computed value (needs {{added}}); sometimes the slide's text extraction lost it (LOOK at the PNG)`, ...flags.num,
  `\n## ⚠️ slide notes (${[...new Set(flags.notes)].length}): check each is right`, ...new Set(flags.notes),
  `\n## Animations and exercises (${flags.mounts.length})`, ...flags.mounts,
  ...(only ? [] : [`\n## Slides no entry cites (${uncited.length}): confirm each is a title, quiz, admin or duplicate (week.js checklistNote)`,
    ...uncited.map(r => `${r}: ${(slideText[r] || '').split('\n')[0].trim().slice(0, 70)}`)]),
  `\n## LOOK slides in scope (${inScope.filter(r => look[r]).length})`, inScope.filter(r => look[r]).join(' '),
  `\n## Fingerprints (tools/review-fingerprints.js check)`, fp.trim(),
].join('\n') + '\n');
console.log(`Wrote ${path.relative(d, out)}/slides.md, entries.md, flags.md: ${entries.length} entries, ${inScope.length} slides, ${flags.none.length} NO SOURCE, ${flags.num.length} NUM?, ${uncited.length} uncited slides.`);
