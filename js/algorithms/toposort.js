/* ==========================================================================
   Frame generator + configuration for Topological Sort.
   Code = slide 74 (in-degrees) + slide 77 step 2 (initialize) + slide 78 (main loop).
   Pure logic, no DOM. See docs/ALGORITHM_ANIMATION.md.
   ========================================================================== */
window.Algorithms = window.Algorithms || {};

(function () {
  const presets = {
    lecture: {
      title: 'Lecture graph (slides 72 to 80)', width: 500, height: 290,
      nodes: [['1', 50, 150], ['2', 170, 55], ['3', 330, 80], ['4', 170, 235], ['5', 360, 245], ['6', 450, 120]],
      adj: { 1: ['2', '4'], 2: ['3'], 3: ['4', '5'], 4: ['5'], 5: [], 6: [] },
    },
    recitation: {
      title: 'Recitation graph (slide 33)', width: 500, height: 290,
      nodes: [['S', 45, 145], ['A', 165, 65], ['C', 300, 65], ['E', 450, 65], ['B', 165, 225], ['D', 300, 225], ['F', 450, 225]],
      adj: { S: ['A', 'B'], A: ['C'], C: ['E', 'F'], B: ['D'], E: [], D: [], F: [] },
    },
    cyclic61: {
      title: 'Source + cycle (slide 61)', width: 500, height: 290,
      nodes: [['A', 90, 130], ['B', 195, 48], ['C', 340, 75], ['D', 200, 240], ['E', 350, 245], ['F', 450, 140]],
      adj: { A: ['B'], B: ['C'], C: ['D', 'E'], D: ['A', 'E'], E: [], F: [] },
    },
    cyclic: {
      title: 'Graph with a cycle (slide 63)', width: 500, height: 290,
      nodes: [['A', 170, 120], ['B', 265, 48], ['C', 400, 85], ['D', 275, 235], ['E', 85, 235], ['F', 430, 235]],
      adj: { A: ['B', 'E'], B: ['C'], C: ['D', 'F'], D: ['A'], E: ['D'], F: [] },
    },
  };

  /* Words that differ between the two versions of the structure */
  const words = {
    queue: { name: 'Q', noun: 'queue', take: 'Dequeue(Q)', put: 'Enqueue(Q,y.value)', takeVerb: 'Dequeue', putVerb: 'Enqueue' },
    stack: { name: 'S', noun: 'stack', take: 'Pop(S)', put: 'Push(S,y.value)', takeVerb: 'Pop', putVerb: 'Push' },
  };

  function code(mode) {
    const w = words[mode];
    return [
      { n: 1, text: 'for i = 1 to n do D[i] := 0; endfor' },
      { n: 2, text: 'for i = 1 to n do' },
      { n: 3, text: '  x := A[i];' },
      { n: 4, text: '  while x ≠ null do' },
      { n: 5, text: '    D[x.value] := D[x.value] + 1;' },
      { n: 6, text: '    x := x.next;' },
      { n: 7, text: '  endwhile' },
      { n: 8, text: 'endfor' },
      { n: 9, text: `Initialize ${w.name} with all sources` },
      { n: 10, text: `while notEmpty(${w.name}) do` },
      { n: 11, text: `  x := ${w.take}` },
      { n: 12, text: '  Output(x)' },
      { n: 13, text: '  y := A[x];' },
      { n: 14, text: '  while y ≠ null do' },
      { n: 15, text: '    D[y.value] := D[y.value] – 1;' },
      { n: 16, text: `    if D[y.value] = 0 then ${w.put};` },
      { n: 17, text: '    y := y.next;' },
      { n: 18, text: '  endwhile' },
      { n: 19, text: 'endwhile' },
      { n: 20, text: 'If all vertices are output then success,' },
      { n: 21, text: '  otherwise there is a cycle.' },
    ];
  }

  const sections = [
    { id: 'deg', title: 'Calculate in-degrees', slide: 'L74', from: 1, to: 8 },
    { id: 'init', title: 'Initialize', slide: 'L77', from: 9, to: 9 },
    { id: 'main', title: 'Main loop', slide: 'L78', from: 10, to: 19 },
    { id: 'final', title: 'Final check', slide: 'L77', from: 20, to: 21 },
  ];

  /* Shared tracer: holds the algorithm state and records a frame per executed line */
  function makeTracer(p, reverseLists) {
    const ids = p.nodes.map(x => x[0]);
    const n = ids.length;
    const index = Object.fromEntries(ids.map((id, i) => [id, i]));
    const adj = ids.map(id => {
      const list = (p.adj[id] || []).map(w => index[w]);
      return reverseLists ? list.reverse() : list;
    });
    const st = { D: Array(n).fill(null), Q: [], out: [], holding: null, ptr: null, gone: new Set() };
    const counts = {};
    const frames = [];
    return {
      n, ids, adj, st, frames,
      name: i => ids[i],
      edgeId: (a, b) => `${ids[a]}>${ids[b]}`,
      snap(line, msg, extra = {}) {
        if (line != null) counts[line] = (counts[line] || 0) + 1;
        frames.push(Object.assign({
          line, msg, counts: { ...counts },
          D: st.D.slice(), Q: st.Q.slice(), out: st.out.slice(), holding: st.holding,
          ptr: st.ptr ? { ...st.ptr } : null, gone: [...st.gone], vars: [],
        }, extra));
      },
    };
  }

  function build(presetId, mode, opts = {}) {
    const p = presets[presetId];
    const w = words[mode];
    const t = makeTracer(p, opts.lists === 'reversed');
    const fill = opts.fill || (mode === 'stack' ? 'desc' : 'asc');
    const { n, adj, name, st, snap, edgeId } = t;

    Algorithms.traceInDegrees(t);

    /* Line 9. Slide 80 assumes push(6) and then push(1), so by default the stack is filled from n down to 1. */
    const order = [...Array(n).keys()];
    if (fill === 'desc') order.reverse();
    let found = 0;
    for (const v of order) {
      if (st.D[v] !== 0) continue;
      st.Q.push(v); found += 1;
      snap(9, `D[${name(v)}] = 0, so ${name(v)} is a [[source|source]]. ${w.putVerb} it.` +
        (mode === 'stack' && fill === 'desc' ? ' Slide 80 fills the stack from the last vertex to the first.' : ''), { enq: v, target: v });
    }
    if (!found) snap(9, `No vertex has in-degree 0, so the ${w.noun} stays empty.`);

    /* Main loop */
    for (;;) {
      if (!st.Q.length) { snap(10, `The ${w.noun} is empty, so the main loop ends.`); break; }
      snap(10, `The ${w.noun} is not empty, so run the loop again.`);

      const v = mode === 'queue' ? st.Q.shift() : st.Q.pop();
      st.holding = v;
      const vars = [`x = ${name(v)}`];
      snap(11, `${w.takeVerb}: take ${name(v)} out of the ${w.noun}.`, { cur: v, vars });
      st.holding = null; st.out.push(v);
      snap(12, `Output ${name(v)}. It is now position ${st.out.length} of the order.`, { cur: v, vars });

      let k = 0;
      st.ptr = { owner: v, idx: 0, name: 'y' };
      snap(13, adj[v].length ? `y points to the first cell of the list of ${name(v)}.` : `${name(v)} has no outgoing edges, so y is null.`, { cur: v, vars });

      for (;;) {
        if (k >= adj[v].length) { snap(14, `y is null, so every outgoing edge of ${name(v)} has been handled.`, { cur: v, vars }); break; }
        const u = adj[v][k];
        const e = edgeId(v, u);
        const v2 = [...vars, `y.value = ${name(u)}`];
        snap(14, `y is not null. It holds ${name(u)}: the edge ${name(v)} → ${name(u)}.`, { cur: v, target: u, activeEdge: e, vars: v2 });
        st.D[u] -= 1; st.gone.add(e);
        snap(15, `Delete this edge: D[${name(u)}] drops to ${st.D[u]}.`, { cur: v, target: u, activeEdge: e, changed: u, vars: v2 });
        if (st.D[u] === 0) {
          st.Q.push(u);
          snap(16, `D[${name(u)}] is 0, so ${name(u)} just became a [[source|source]]. ${w.putVerb} it.`, { cur: v, target: u, enq: u, vars: v2 });
        } else {
          snap(16, `D[${name(u)}] is ${st.D[u]}, not 0. ${name(u)} still has incoming edges, so it waits.`, { cur: v, target: u, vars: v2 });
        }
        k += 1;
        st.ptr = { owner: v, idx: k, name: 'y' };
        snap(17, k < adj[v].length ? 'Move y to the next cell.' : 'Move y forward. There is no next cell, so y is now null.', { cur: v, vars });
      }
      st.ptr = null;
    }

    /* Lines 20-21: step 4 of slide 77 (slide 78's code has no line for it) */
    const ok = st.out.length === n;
    const order2 = st.out.map(name).join(', ');
    snap(ok ? 20 : 21, ok
      ? `All ${n} vertices were output: success. This is a valid topological sort: ${order2}.`
      : `Only ${st.out.length} of ${n} vertices were output, so there is a cycle and no topological sort exists.`,
      { result: { ok, order: st.out.map(name) } });

    return { frames: t.frames, code: code(mode), sections, ids: t.ids, adj: t.adj, words: w };
  }

  /* Default fill order for each structure, as drawn on the slides */
  const switches = [
    { id: 'fill', label: 'Fill from', options: [{ id: 'asc', label: 'First to last' }, { id: 'desc', label: 'Last to first' }],
      defaultFor: mode => (mode === 'stack' ? 'desc' : 'asc') },
    { id: 'lists', label: 'Adjacency lists', options: [{ id: 'slide', label: 'As the slides\' runs imply' }, { id: 'reversed', label: 'Reversed' }],
      defaultFor: () => 'slide' },
  ];

  Algorithms.makeTracer = makeTracer;
  Algorithms.toposort = {
    presets, build, switches, defaultPreset: 'lecture',
    modes: [{ id: 'queue', label: 'Queue' }, { id: 'stack', label: 'Stack' }],
  };

  /* Stand-alone "Calculate In-degrees" (slide 74) */
  const inDegCode = code('queue').filter(c => c.n <= 8);
  const inDegPresets = { lecture: presets.lecture, recitation: presets.recitation };
  Algorithms.indegree = {
    presets: inDegPresets, defaultPreset: 'lecture', panels: { strips: false },
    modes: [{ id: 'only', label: '' }],
    build(presetId) {
      const t = makeTracer(inDegPresets[presetId]);
      Algorithms.traceInDegrees(t);
      t.snap(null, `Finished. D holds the in-degree of every vertex: ${t.st.D.join(', ')}.`, { result: { ok: true, order: [] } });
      return { frames: t.frames, code: inDegCode, sections: [{ id: 'deg', title: 'Calculate in-degrees', slide: 'L74', from: 1, to: 8 }], ids: t.ids, adj: t.adj };
    },
  };
})();
