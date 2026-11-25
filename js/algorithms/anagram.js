/* ==========================================================================
   The master's Anagram solution (lecture slides 21-24). Pure logic.
   The slides name binary search but give no steps; the midpoint version here
   is tagged "not on the slides" in the entry.
   ========================================================================== */
window.Algorithms = window.Algorithms || {};

(function () {
  const dictionary = ['ASP', 'DOG', 'LURE', 'GOD', 'NICE', 'RULE', 'SPA'];   // slide 21
  const signature = w => [...w].sort().join('');

  const code = [
    { n: 1, text: 'After each word, write its "signature"' },
    { n: 2, text: '  (sort its letters)' },
    { n: 3, text: 'Sort by the signatures' },
    { n: 4, text: 'Input word W' },
    { n: 5, text: 'X := signature of W' },
    { n: 6, text: 'Use binary search to find the anagram class' },
    { n: 7, text: '  of W and output it.' },
  ];
  const sections = [
    { id: 'pre', title: 'Preprocessing', slide: 'L22', from: 1, to: 3 },
    { id: 'query', title: "Master's program", slide: 'L24', from: 4, to: 7 },
  ];

  function build(word) {
    const frames = [];
    const counts = {};
    let rows = dictionary.map(w => ({ word: w, sig: null }));
    const snap = (line, msg, extra = {}) => {
      counts[line] = (counts[line] || 0) + 1;
      frames.push(Object.assign({ line, msg, counts: { ...counts }, rows: rows.map(r => ({ ...r })), W: null, X: null, output: [], sorted: false, vars: [] }, extra));
    };

    rows.forEach((r, i) => {
      r.sig = signature(r.word);
      snap(1, `Sort the letters of ${r.word}: its signature is ${r.sig}.`, { cur: i, justSig: i });
    });
    /* Stable sort by signature, the order shown on slide 23 */
    rows = rows.map((r, i) => [r, i]).sort((a, b) => (a[0].sig < b[0].sig ? -1 : a[0].sig > b[0].sig ? 1 : a[1] - b[1])).map(x => x[0]);
    snap(3, 'Sort the dictionary by signature. Words with the same signature are now next to each other: each group is an anagram class.', { sorted: true });

    const base = { sorted: true, W: word };
    snap(4, `The input word is ${word}.`, base);
    const X = signature(word);
    const q = { ...base, X };
    snap(5, `X is the signature of ${word}: ${X}.`, q);

    let lo = 0, hi = rows.length - 1, hit = -1;
    while (lo <= hi) {
      const mid = Math.floor((lo + hi) / 2);
      const s = rows[mid].sig;
      if (s === X) {
        hit = mid;
        snap(6, `The middle signature, ${s}, equals X. The anagram class is found.`, { ...q, lo, hi, mid, vars: [`low = ${lo + 1}`, `high = ${hi + 1}`, `middle = ${mid + 1}`] });
        break;
      }
      const goRight = s < X;
      snap(6, `The middle signature, ${s}, comes ${goRight ? 'before' : 'after'} X = ${X}, so continue ${goRight ? 'below' : 'above'} the middle.`,
        { ...q, lo, hi, mid, vars: [`low = ${lo + 1}`, `high = ${hi + 1}`, `middle = ${mid + 1}`] });
      if (goRight) lo = mid + 1; else hi = mid - 1;
    }

    if (hit < 0) {
      snap(7, `No signature equals ${X}. This 7-word dictionary has no anagram of ${word}, so the output is empty.`, { ...q, output: [], result: { ok: false } });
    } else {
      let a = hit, b = hit;
      while (a > 0 && rows[a - 1].sig === X) a -= 1;
      while (b < rows.length - 1 && rows[b + 1].sig === X) b += 1;
      const cls = rows.slice(a, b + 1).map(r => r.word);
      snap(7, `Output the whole class: ${cls.join(', ')}.`, { ...q, classFrom: a, classTo: b, output: cls, result: { ok: true } });
    }
    return { frames, code, sections };
  }

  Algorithms.anagram = { dictionary, signature, build, code, sections, words: ['RULE', 'GOD', 'SPA', 'NICE', 'CAT'] };
})();
