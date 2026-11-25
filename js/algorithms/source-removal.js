/* ==========================================================================
   Source removal: the idea of topological sort, before any data structure
   (lecture slides 62-71). Pure logic. Picks the first source in vertex order,
   which reproduces the slides' run: A, B, C, D, E, F.
   ========================================================================== */
window.Algorithms = window.Algorithms || {};

(function () {
  const presets = {
    slide: {
      title: 'Lecture graph (slides 62 to 71)', width: 500, height: 290,
      nodes: [['A', 70, 130], ['B', 190, 45], ['C', 340, 85], ['F', 450, 160], ['D', 200, 240], ['E', 350, 250]],
      adj: { A: ['B', 'D'], B: ['C'], C: ['D', 'E'], D: ['E'], E: [], F: [] },
    },
    cyclic61: Algorithms.toposort.presets.cyclic61,
    cyclic: Algorithms.toposort.presets.cyclic,
  };
  const order = { A: 0, B: 1, C: 2, D: 3, E: 4, F: 5 };

  const code = [
    { n: 1, text: 'Identify vertices that have no incoming edges.' },
    { n: 2, text: 'If no such vertex exists:' },
    { n: 3, text: '  The graph includes a cycle. Topological sort not possible. Halt.' },
    { n: 4, text: 'Select one of the sources.' },
    { n: 5, text: 'Delete this source and all its outgoing edges.' },
    { n: 6, text: 'Place it in the output.' },
    { n: 7, text: 'Repeat Step 1 and Step 2 until the graph is' },
    { n: 8, text: '  empty (or until HALT if not a DAG).' },
  ];
  const sections = [
    { id: 's1', title: 'Step 1', slide: 'L62', from: 1, to: 4 },
    { id: 's2', title: 'Step 2', slide: 'L65', from: 5, to: 6 },
    { id: 'rep', title: 'Repeat', slide: 'L66', from: 7, to: 8 },
  ];

  function build(presetId) {
    const t = Algorithms.makeTracer(presets[presetId]);
    const { n, adj, ids, name, st, snap, edgeId } = t;
    adj.forEach((list, v) => { if (st.D[v] === null) st.D[v] = 0; list.forEach(w => { st.D[w] = (st.D[w] || 0) + 1; }); });
    const alive = new Set(ids.keys());
    const byName = (a, b) => order[ids[a]] - order[ids[b]];

    while (alive.size) {
      const sources = [...alive].filter(v => st.D[v] === 0).sort(byName);
      snap(1, sources.length
        ? `The vertices with in-degree 0 right now: ${sources.map(name).join(', ')}. These are the [[source|sources]].`
        : 'Every remaining vertex still has an incoming edge.', { ready: sources });
      if (!sources.length) {
        snap(2, 'No source exists.');
        snap(3, `The graph includes a cycle, so a topological sort is not possible. Halt after ${st.out.length} of ${n} vertices.`,
          { result: { ok: false, order: st.out.map(name) } });
        return { frames: t.frames, code, sections, ids, adj };
      }
      snap(2, 'At least one source exists, so we can continue.', { ready: sources });
      const v = sources[0];
      snap(4, sources.length > 1
        ? `Select ${name(v)}. Any source would be correct; choosing another one gives a different valid order.`
        : `Select ${name(v)}, the only source.`, { ready: sources, cur: v });
      adj[v].forEach(w => { st.D[w] -= 1; st.gone.add(edgeId(v, w)); });
      alive.delete(v);
      snap(5, adj[v].length
        ? `Delete ${name(v)} and its outgoing edges to ${adj[v].map(name).join(', ')}. Their in-degrees each drop by 1.`
        : `Delete ${name(v)}. It has no outgoing edges.`, { cur: v, ready: sources.filter(x => x !== v) });
      st.out.push(v);
      snap(6, `${name(v)} goes to the output, at position ${st.out.length}.`, { cur: v, ready: sources.filter(x => x !== v) });
      if (alive.size) snap(7, `${alive.size} vertices are left, so repeat.`);
    }
    snap(7, `The graph is empty. Output: ${st.out.map(name).join(', ')}.`, { result: { ok: true, order: st.out.map(name) } });
    return { frames: t.frames, code, sections, ids, adj };
  }

  Algorithms.sourceRemoval = {
    presets, build, defaultPreset: 'slide',
    panels: { arrays: false, queue: false },
    modes: [{ id: 'only', label: '' }],
  };
})();
