/* ==========================================================================
   Euler cycle by merging cycles (slides 2L19-23, 2R7), the Euler path built
   from it (2L16-17), and the De Bruijn sequence read from it (2L34).
   Frame generators only, no DOM. EulerView draws the frames.
   ========================================================================== */
window.Algorithms = window.Algorithms || {};
(function () {
  const G = () => Exercises.graphs;

  /* The lecture has no pseudo-code for this, so these are the bullets of 2L19-20 word for word */
  const LECTURE = [
    'Check whether one exists (the graph is connected, and all vertices have even degrees).',
    'Initialize: all edges are ‘untraced’ (not included yet in the path)',
    'Start from an arbitrary vertex A, choose any untraced edge adjacent to it (an edge of which A is an endpoint) and trace it (go to its other endpoint).',
    'Upon entering a vertex, search for an untraced incident edge and trace it.',
    'Repeat as long as possible.',
    'The iteration will stop at A (the starting vertex).',
    'So far we have a cycle which starts and ends in A.',
    'If there are more untraced edges, choose any edge adjacent to the cycle (at least one exists, why?)',
    'and build another path of untraced edges.',
    'By the same argument, the new path is a cycle, as it must end where it started.',
    'Merge the cycles to get an extended tour.',
    'Continue as long as there are untraced edges.',
  ];
  const RECITATION = [
    'v ← Pick a vertex at random',
    'Traverse the graph until returning to v',
    'while There are unused edges that are adjacent to vertex in the current tour do',
    '    Pick a vertex u incident to an unused edge',
    '    Traverse the graph using unused edges until returning to u',
    '    Join the paths',
  ];
  const DE_BRUIJN = [
    'Find an Euler Cycle in G(σ,n) = (V, E).',
    'Consider the sequence of edges in the order they appear in the cycle.',
    'Take from each edge the 1st letter.',
    'The sequence of L letters collected form a De-Bruin sequence.',
  ];

  /* Which code line each step of the algorithm is. null = this code has no line for it. */
  const lectureLines = o => ({ check: 1 + o, init: 2 + o, pickV: null, first: 3 + o, enter: 4 + o, repeat: 5 + o, stop: 6 + o, cycle: 7 + o, more: 8 + o, pickU: null, build: 9 + o, same: 10 + o, merge: 11 + o, cont: 12 + o });
  const recitationLines = { check: null, init: null, pickV: 1, first: 2, enter: 2, repeat: null, stop: null, cycle: null, more: 3, pickU: 4, build: 5, same: null, merge: 6, cont: null };
  const deBruijnLines = { check: null, init: null, pickV: null, first: 1, enter: 1, repeat: null, stop: null, cycle: null, more: 1, pickU: null, build: 1, same: null, merge: 1, cont: null };

  /* Adjacency lists as cells. An undirected edge has one cell at each end (2L24). */
  function buildLists(g, ids, order) {
    const lists = ids.map(() => []);
    const at = v => ids.indexOf(v);
    g.edges.forEach(([a, b], i) => {
      const e = `e${i}`;
      const word = g.words ? g.words[i] : null;
      lists[at(a)].push({ to: at(b), e, i, label: word || b });
      if (!g.directed) lists[at(b)].push({ to: at(a), e, i, label: a });
    });
    lists.forEach((list, v) => {
      const custom = order && typeof order === 'object' ? order[ids[v]] : null;
      if (custom) {
        const pool = list.slice();
        list.splice(0, list.length, ...custom.map(lbl => pool.splice(pool.findIndex(c => c.label === lbl), 1)[0]));
        return;
      }
      list.sort((x, y) => x.label.localeCompare(y.label) || x.i - y.i);
      if (order === 'desc') list.reverse();
    });
    return lists;
  }

  function run({ g, order, pick, start, lines, code, sections, tail, prefix }) {
    const ids = g.nodes.map(n => n[0]);
    const lists = buildLists(g, ids, order);
    const name = v => ids[v];
    const m = g.edges.length;

    const used = {};              // edge id → number of the cycle that traced it
    const cells = lists.map(l => l.map(c => ({ ...c, used: false })));
    /* The two cells of one undirected edge find each other ("same edge" pointers, 2L24) */
    const mateOf = (v, k) => {
      const c = cells[v][k];
      if (g.directed) return null;
      if (c.to !== v) return { v: c.to, k: cells[c.to].findIndex(x => x.e === c.e) };
      return { v, k: cells[v].findIndex((x, j) => x.e === c.e && j !== k) };
    };
    const ptr = cells.map(() => 0);   // how far each list has been read
    let scanned = 0, iterations = 0, subIdx = -1, key = 0;
    let tour = [], tourE = [], sub = [], subE = [];
    let cur = null, target = null, activeEdge = null, scan = null;
    const frames = [], counts = {}, cycles = [], tours = [];

    const bits = () => cells.map(l => l.map(c => (c.used ? 1 : 0)));
    const nextUntraced = () => cells.map(l => { const k = l.findIndex(c => !c.used); return k < 0 ? l.length : k; });
    const snap = (line, msg, extra = {}) => {
      if (line == null) return;
      counts[line] = (counts[line] || 0) + 1;
      frames.push({
        line, msg, counts: { ...counts }, cur, target, activeEdge, scan, used: { ...used }, bits: bits(), nextU: nextUntraced(),
        tour: tour.map(t => ({ ...t })), sub: sub.map(t => ({ ...t })), iterations, scanned, letters: [], removed: false,
        vars: [`iterations = ${iterations}`, `list cells scanned = ${scanned}`], ...extra,
      });
    };
    const step = (s, msg, extra) => snap(lines[s], msg, extra);
    const token = v => ({ key: key++, v, sub: subIdx });
    const names = list => list.map(t => name(t.v)).join(ids[0].length > 1 ? ' ' : '');

    /* Read a list past traced cells. Each cell is passed once in the whole run (2L24). */
    const untracedAt = v => {
      while (ptr[v] < cells[v].length && cells[v][ptr[v]].used) { ptr[v] += 1; scanned += 1; }
      return ptr[v] < cells[v].length ? ptr[v] : -1;
    };
    const traceFrom = v => {
      const k = untracedAt(v);
      const c = cells[v][k];
      c.used = true;
      ptr[v] += 1; scanned += 1;
      const mate = mateOf(v, k);
      if (mate) cells[mate.v][mate.k].used = true;
      used[c.e] = subIdx;
      activeEdge = c.e; scan = { owner: v, idx: k, mate };
      cur = c.to; target = null;
      const t = token(c.to);
      sub.push(t); subE.push(c.e);
      return c;
    };
    const edgeText = (v, c) => (g.words ? `edge ${c.label}` : `edge (${name(v)},${name(c.to)})`);

    /* One walk from u, as long as possible */
    const walk = (u, firstStep, nextStep) => {
      subIdx += 1; iterations += 1;
      sub = [token(u)]; subE = [];
      cur = u; target = null; activeEdge = null; scan = null;
      let from = u, c = traceFrom(u);
      step(firstStep, `Starting from ${name(u)}: traced the ${edgeText(from, c)}, now at ${name(cur)}.`);
      for (;;) {
        const k = untracedAt(cur);
        if (k < 0) {
          activeEdge = null; scan = null;
          step('repeat', `No untraced [[edge]] touches ${name(cur)}, so this walk cannot go on.`);
          return;
        }
        step('repeat', `${name(cur)} still has an untraced [[edge]], so the walk goes on.`);
        from = cur;
        c = traceFrom(cur);
        step(nextStep, `Entered ${name(from)} and found the untraced ${edgeText(from, c)}. Traced it, now at ${name(cur)}.`);
      }
    };

    if (prefix) prefix(snap);

    /* Start */
    const startV = ids.indexOf(start);
    const degText = g.directed ? 'every vertex has as many edges in as out' : 'all [[degree|degrees]] are even';
    step('check', `The [[graph]] is connected and ${degText}, so an [[euler-cycle|Euler cycle]] exists.`);
    step('init', `All ${m} [[edge|edges]] are untraced: every bit in the lists is 0.`);
    if (lines.pickV != null) { cur = startV; step('pickV', `Picked v = ${name(startV)}.`); }

    walk(startV, 'first', 'enter');
    step('stop', `The walk stopped at ${name(cur)}, the vertex it started from.`, { cycleDone: subIdx });
    cycles.push(names(sub));
    tour = sub; tourE = subE; sub = []; subE = [];
    tours.push(names(tour));
    activeEdge = null; scan = null;
    step('cycle', `So far the cycle is ${names(tour)}.`, { cycleDone: subIdx });

    /* Merge further cycles until no edge is left */
    for (;;) {
      const candidates = [];
      tour.forEach((t, i) => { if (untracedAt(t.v) >= 0) candidates.push(i); });
      if (!candidates.length) {
        cur = null; target = null;
        if (lines !== recitationLines && iterations === 1) step('more', `No untraced [[edge]] touches the tour. All ${m} edges are traced.`);
        break;
      }
      const idx = pick === 'last' ? candidates[candidates.length - 1] : candidates[0];
      const u = tour[idx].v;
      cur = null; target = u;
      const left = m - Object.keys(used).length;
      step('more', lines.pickU != null
        ? `${left} unused [[edge|edges]] remain, and some touch the current tour.`
        : `${left} [[edge|edges]] are still untraced. ${name(u)} is on the tour and has one, so the next walk starts there.`);
      if (lines.pickU != null) step('pickU', `Picked u = ${name(u)}.`);
      target = null;
      walk(u, 'build', 'build');
      cycles.push(names(sub));
      step('same', `This walk ended at ${name(cur)}, where it started, so it is a cycle: ${names(sub)}.`);
      /* Merge: the new cycle replaces this one occurrence of u in the tour */
      const inserted = sub.slice(1);
      tour = [...tour.slice(0, idx + 1), ...inserted, ...tour.slice(idx + 1)];
      tourE = [...tourE.slice(0, idx), ...subE, ...tourE.slice(idx)];
      sub = []; subE = [];
      tours.push(names(tour));
      activeEdge = null; scan = null; cur = u;
      step('merge', `Merged the new cycle into the tour at ${name(u)}: ${names(tour)}.`);
      /* Loop test on the last bullet, unless every edge is done (the closing frame reports that) */
      if (Object.keys(used).length < m) step('cont', 'There are still untraced [[edge|edges]], so continue.');
    }
    cur = null; target = null; activeEdge = null; scan = null;
    tour.forEach(t => untracedAt(t.v));   // the last scan that finds nothing left

    const out = {
      frames, code, sections, ids, lists, cycles, tours,
      nodes: g.nodes, directed: g.directed, loops: g.loops || {}, added: g.added || [],
      edges: g.edges.map(([from, to], i) => ({ id: `e${i}`, from, to, label: g.words ? g.words[i] : undefined })),
      hasWords: !!g.words, hasLetters: tail === 'deBruijn', title: g.title,
      tourWords: g.words ? tourE.map(e => g.words[+e.slice(1)]) : [],
    };
    const finished = { used: { ...used } };
    const finalOrder = tour.map(t => name(t.v));

    if (tail === 'cycle') {
      step('cont', `Done. Every [[edge]] is in the tour exactly once, so ${names(tour)} is an [[euler-cycle|Euler cycle]].`, { result: { ok: true, order: finalOrder }, ...finished });
    } else if (tail === 'recitation') {
      snap(3, `No unused [[edge|edges]] remain. The joined tour ${names(tour)} is an [[euler-cycle|Euler cycle]].`, { result: { ok: true, order: finalOrder }, ...finished });
    } else if (tail === 'path') {
      step('cont', 'There are no untraced [[edge|edges]] left: the [[euler-cycle|Euler cycle]] is complete.');
      /* Delete the added edge: the walk now starts just after where it was */
      const extra = `e${g.added[0]}`;
      const j = tourE.indexOf(extra);
      const a = tour[j].v, b = tour[j + 1].v;
      const pathTokens = [...tour.slice(j + 1), ...tour.slice(1, j + 1)];
      tour = pathTokens;
      delete used[extra];
      activeEdge = null;
      snap(16, `Deleted the added [[edge]] (a,b). What is left is an [[euler-path|Euler path]] from ${name(b)} to ${name(a)}, and it uses all ${m - 1} original edges.`, { result: { ok: true, order: pathTokens.map(t => name(t.v)) }, removed: true });
    } else if (tail === 'deBruijn') {
      snap(2, `The [[euler-cycle|Euler cycle]] lists all ${m} edges in order: ${out.tourWords.join(', ')}.`, finished);
      const letters = [];
      out.tourWords.forEach((w, i) => {
        letters.push(w[0]);
        activeEdge = tourE[i];
        snap(3, `Edge ${w}: its 1st letter is ${w[0]}.`, { letters: letters.slice(), ...finished });
      });
      activeEdge = null;
      snap(4, `The ${m} letters ${letters.join('')} form a [[de-bruijn-sequence|De Bruijn sequence]]: read around the circle, every word of length ${g.n} appears exactly once.`, { letters: letters.slice(), result: { ok: true, order: letters.slice() }, ...finished });
    }
    return out;
  }

  const codeOf = (lines, start = 1) => lines.map((text, i) => ({ n: start + i, text }));

  const listsSwitch = (first, second) => ({ id: 'lists', label: 'Adjacency lists', options: [first, second], defaultFor: () => first.id });

  /* Lecture example and the Euler path */
  Algorithms.euler = {
    defaultPreset: 'lecture',
    presets: { lecture: { title: 'Euler cycle (slides 21-23)' }, path: { title: 'Euler path by adding (a,b) (slides 16-17)' } },
    modes: [{ id: 'run', label: 'Run' }],
    switches: [
      listsSwitch({ id: 'asc', label: 'A → Z' }, { id: 'desc', label: 'Z → A' }),
      { id: 'pick', label: 'Next tour vertex', options: [{ id: 'first', label: 'Earliest' }, { id: 'last', label: 'Latest' }], defaultFor: () => 'first' },
    ],
    build(preset, mode, sw = {}) {
      const order = sw.lists || 'asc', pick = sw.pick || 'first';
      if (preset === 'path') {
        const g = G()['2L17+'];
        const code = [
          { n: 1, text: 'Denote by a and b the odd-degree vertices.' },
          { n: 2, text: 'To construct the path, add an edge (a,b).' },
          { n: 3, text: 'Now all vertices have even degrees.' },
          ...codeOf(LECTURE, 4),
          { n: 16, text: 'Build the Euler cycle and at the end delete the edge (a,b).' },
        ];
        const sections = [
          { id: 'add', title: 'Add an edge', slide: '2L16', from: 1, to: 3 },
          { id: 'trace', title: 'Find the cycle', slide: '2L19', from: 4, to: 8 },
          { id: 'more', title: 'Merge cycles', slide: '2L20', from: 9, to: 15 },
          { id: 'del', title: 'Delete the edge', slide: '2L16', from: 16, to: 16 },
        ];
        return run({
          g, order, pick, start: 'a', lines: lectureLines(3), code, sections, tail: 'path',
          prefix: snap => {
            snap(1, 'Only a and b have an odd [[degree]] (3 each), so they will be the two ends of the [[path]].', {});
            snap(2, 'Added an extra [[edge]] between a and b, drawn dashed. The [[graph]] may not be simple, and that is OK.', {});
            snap(3, 'a and b now have degree 4, so every degree is even and an [[euler-cycle|Euler cycle]] exists.', {});
          },
        });
      }
      const code = codeOf(LECTURE);
      const sections = [
        { id: 'trace', title: 'First cycle', slide: '2L19', from: 1, to: 5 },
        { id: 'more', title: 'More cycles', slide: '2L20', from: 6, to: 12 },
      ];
      return run({ g: G()['2L21'], order, pick, start: 'A', lines: lectureLines(0), code, sections, tail: 'cycle' });
    },
  };

  /* Recitation: code from 2R7, graph from 2R8. List order chosen to give the walks drawn on 2R9-10. */
  Algorithms.eulerRecitation = {
    defaultPreset: 'recitation',
    presets: { recitation: { title: 'Recitation example (slides 8-11)' } },
    modes: [{ id: 'run', label: 'Run' }],
    build() {
      return run({
        g: G()['2R8'], order: { 0: ['3', '2'], 1: ['3', '4'], 2: ['3', '0'], 3: ['0', '2', '1', '4'], 4: ['1', '3'] },
        pick: 'last', start: '0', lines: recitationLines, code: codeOf(RECITATION),
        sections: [{ id: 'all', title: 'Euler Cycle(G)', slide: '2R7', from: 1, to: 6 }], tail: 'recitation',
      });
    },
  };

  /* De Bruijn. 2L34 gives only the edge sequence; these list orders reproduce it (the order is added, as the page says). */
  const SLIDE_ORDER = { '00': ['000', '001'], '01': ['010', '011'], 10: ['101', '100'], 11: ['111', '110'] };
  Algorithms.deBruijn = {
    defaultPreset: 'g23',
    presets: { g23: { title: 'G₂,₃ (slides 29 and 34)' } },
    modes: [{ id: 'run', label: 'Run' }],
    switches: [listsSwitch({ id: 'slide', label: 'Gives slide 34\'s sequence' }, { id: 'asc', label: 'A → Z' })],
    build(preset, mode, sw = {}) {
      return run({
        g: G()['2L29'], order: (sw.lists || 'slide') === 'slide' ? SLIDE_ORDER : 'asc', pick: 'first', start: '00', lines: deBruijnLines,
        code: codeOf(DE_BRUIJN), sections: [{ id: 'all', title: 'Constructing the sequence', slide: '2L34', from: 1, to: 4 }], tail: 'deBruijn',
      });
    },
  };
})();
