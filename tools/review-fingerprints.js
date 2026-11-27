// Fingerprints of reviewed content, kept in docs/REVIEW_LOG.md.
// A fingerprint is a short hash of an item's source, so a later review can tell
// what changed since it was last reviewed. See docs/CONTENT_REVIEW.md.
//
//   node tools/review-fingerprints.js check
//       Lists every item as UNCHANGED (reviewed, same source: skip it),
//       CHANGED (reviewed, but edited since: review again) or NEW (never reviewed).
//   node tools/review-fingerprints.js record <week> "<review title>" [extra items...]
//   node tools/review-fingerprints.js record exam:<id> "<review title>" [extra items...]
//       A past exam (past-exams/<id>/): its data file, its checks, the shared exam.js and
//       exam.css, and its graphs (Exercises.graphs keys that start with its deck).
//       After a review: writes the current fingerprints of that week's entries,
//       terms and Exercises.graphs, plus the extra items, into the log.
//
// Items: entry:<id>  term:<id>  graph:<key>  exercise:<Exercises function>
//        logic:<GraphLogic function>  file:<path from the project root>
global.window = global;
const fs = require('fs'), path = require('path'), crypto = require('crypto');
const d = path.resolve(__dirname, '..');
const LOG = d + '/docs/REVIEW_LOG.md';
const START = '<!-- fingerprints:start -->', END = '<!-- fingerprints:end -->';

global.E = {};
global.GraphView = { autoBend: e => e, create: () => ({}) };
global.Algorithms = {};
const scripts = [...fs.readFileSync(d + '/index.html', 'utf8').matchAll(/<script src="(js\/[^"]+)"/g)].map(m => m[1]);
for (const f of scripts) if (/^js\/(course\.js|weeks\/|graph-logic\.js|exercises\.js)/.test(f)) require(d + '/' + f);
const C = COURSE, entries = Object.fromEntries(C.parts.flatMap(p => p.entries).map(e => [e.id, e]));

const sourceOf = item => {
  const [kind, ...rest] = item.split(':'), name = rest.join(':');
  if (kind === 'entry' && entries[name]) { const e = entries[name]; return JSON.stringify([e.title, e.slides, e.checklist, e.recap, e.algo, e.exercise, e.html]); }
  if (kind === 'term' && C.terms[name]) return JSON.stringify(C.terms[name]);
  if (kind === 'graph' && Exercises.graphs[name]) return JSON.stringify(Exercises.graphs[name]);
  if (kind === 'exercise' && typeof Exercises[name] === 'function') return Exercises[name].toString();
  if (kind === 'logic' && typeof GraphLogic[name] === 'function') return GraphLogic[name].toString();
  if (kind === 'file' && fs.existsSync(d + '/' + name)) return fs.readFileSync(d + '/' + name, 'utf8');
  return null;
};
const hash = item => { const s = sourceOf(item); return s == null ? 'missing' : crypto.createHash('sha1').update(s).digest('hex').slice(0, 10); };

/* The log's fingerprint block: one line per item, "item  hash  date  review" */
const readLog = () => {
  const text = fs.readFileSync(LOG, 'utf8');
  const block = text.slice(text.indexOf(START) + START.length, text.indexOf(END));
  const rows = {};
  block.split('\n').map(l => l.trim()).filter(l => l && !l.startsWith('```') && !l.startsWith('#')).forEach(l => {
    const [item, h, date, ...title] = l.split(/\s+/);
    rows[item] = { h, date, title: title.join(' ') };
  });
  return { text, rows };
};

/* Everything a week owns: its entries, its terms, and the graphs whose key starts with its decks */
const weekItems = n => {
  const w = C.weeks.find(x => String(x.n) === String(n));
  if (!w) throw new Error(`No week ${n}`);
  const decks = Object.keys(w.decks);
  return [
    ...C.parts.filter(p => p.week === w.n).flatMap(p => p.entries.map(e => `entry:${e.id}`)),
    ...Object.keys(w.terms).map(t => `term:${t}`),
    ...Object.keys(Exercises.graphs).filter(k => decks.some(dk => k.startsWith(dk) && /\d/.test(k[dk.length] || ''))).map(k => `graph:${k}`),
  ];
};

/* Everything a past exam owns */
const examIds = fs.existsSync(d + '/past-exams') ? fs.readdirSync(d + '/past-exams').filter(x => fs.existsSync(`${d}/past-exams/${x}/${x}.js`)) : [];
const examItems = id => {
  const src = fs.readFileSync(`${d}/past-exams/${id}/${id}.js`, 'utf8'), deck = (src.match(/deck: '(\w+)'/) || [])[1];
  return [`file:past-exams/${id}/${id}.js`, `file:past-exams/${id}/index.html`, `file:tools/checks/exam-${id}.js`, 'file:js/exam.js', 'file:css/exam.css',
    ...Object.keys(Exercises.graphs).filter(k => deck && k.startsWith(deck)).map(k => `graph:${k}`)];
};
const itemsOf = w => (String(w).startsWith('exam:') ? examItems(String(w).slice(5)) : weekItems(w));

const [cmd, ...args] = process.argv.slice(2);
if (cmd === 'record') {
  const [week, title, ...extra] = args;
  if (!week || !title) { console.error('usage: record <week> "<review title>" [items...]'); process.exit(1); }
  const items = [...new Set([...itemsOf(week), ...extra])];
  const bad = items.filter(i => sourceOf(i) == null);
  if (bad.length) { console.error('Unknown items:', bad.join(' ')); process.exit(1); }
  const { text, rows } = readLog();
  const date = new Date().toISOString().slice(0, 10);
  items.forEach(i => { rows[i] = { h: hash(i), date, title }; });
  const width = Math.max(...Object.keys(rows).map(k => k.length)) + 2;
  const lines = Object.keys(rows).sort().map(k => `${k.padEnd(width)}${rows[k].h}  ${rows[k].date}  ${rows[k].title}`);
  const block = `\n\`\`\`\n# item${' '.repeat(width - 6)}hash        reviewed    review\n${lines.join('\n')}\n\`\`\`\n`;
  fs.writeFileSync(LOG, text.slice(0, text.indexOf(START) + START.length) + block + text.slice(text.indexOf(END)));
  console.log(`Recorded ${items.length} items for week ${week}.`);
} else if (cmd === 'check') {
  const { rows } = readLog();
  const all = [...new Set([...C.weeks.flatMap(w => weekItems(w.n)), ...examIds.flatMap(examItems), ...Object.keys(rows)])];
  const out = { UNCHANGED: [], CHANGED: [], NEW: [] };
  all.forEach(i => {
    if (!rows[i]) out.NEW.push(i);
    else if (rows[i].h !== hash(i)) out.CHANGED.push(`${i} (reviewed ${rows[i].date}: ${rows[i].title})`);
    else out.UNCHANGED.push(i);
  });
  console.log(`UNCHANGED since its review, skip: ${out.UNCHANGED.length} items`);
  console.log(`CHANGED since its review, review again (${out.CHANGED.length}):${out.CHANGED.map(x => '\n  ' + x).join('')}`);
  /* A week with nothing in the log was reviewed before the log existed: one summary line, not every item */
  const weekOf = {};
  C.weeks.forEach(w => weekItems(w.n).forEach(i => { weekOf[i] = w.n; }));
  const logged = new Set(Object.keys(rows).map(i => weekOf[i]).filter(x => x != null));
  const listed = out.NEW.filter(i => weekOf[i] == null || logged.has(weekOf[i]));
  const older = {};
  out.NEW.filter(i => !listed.includes(i)).forEach(i => { older[weekOf[i]] = (older[weekOf[i]] || 0) + 1; });
  console.log(`NEW, never reviewed with a fingerprint (${listed.length}):${listed.map(x => '\n  ' + x).join('')}`);
  for (const w in older) console.log(`Week ${w}: ${older[w]} items, reviewed before this log existed, so they have no fingerprints and edits to them are not detected`);
} else {
  console.error('usage: node tools/review-fingerprints.js check | record <week> "<review title>" [items...]');
  process.exit(1);
}
