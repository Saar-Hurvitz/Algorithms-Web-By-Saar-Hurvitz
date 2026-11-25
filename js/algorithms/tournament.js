/* ==========================================================================
   Hamiltonian path in a tournament, by induction (slide 2L42), on the graph of
   slide 2L40. Frame generator only, no DOM. TournamentView draws the frames.
   ========================================================================== */
window.Algorithms = window.Algorithms || {};
Algorithms.tournament = {
  build() {
    const g = Exercises.graphs['2L40'];
    const ids = g.nodes.map(n => n[0]);
    const beats = (u, v) => g.edges.some(([a, b]) => a === u && b === v);
    const edgeOf = (u, v) => `${beats(u, v) ? u : v}>${beats(u, v) ? v : u}`;
    const code = [
      { n: 1, text: 'One directed edge define a HamPath.' },
      { n: 2, text: 'Solve the problem for the first N-1 groups' },
      { n: 3, text: 'Find the correct place for the N-th group' },
    ];
    const sections = [{ id: 'all', title: 'Solution by induction', slide: '2L42', from: 1, to: 3 }];
    const frames = [], counts = {};
    const snap = (line, msg, extra = {}) => {
      counts[line] = (counts[line] || 0) + 1;
      frames.push({ line, msg, counts: { ...counts }, path: [], walker: null, at: null, activeEdge: null, cmp: null, vars: [], ...extra });
    };

    const [x, y] = ids;
    let path = beats(x, y) ? [x, y] : [y, x];
    snap(1, `Teams ${x} and ${y}: ${path[0]} won, so the edge ${path[0]} → ${path[1]} is a [[hamiltonian-path|Hamiltonian path]] of these two.`, { path: path.slice(), activeEdge: edgeOf(x, y), vars: ['N = 2'] });

    for (let i = 2; i < ids.length; i++) {
      const team = ids[i], N = i + 1;
      snap(2, `The first ${N - 1} teams are already arranged: ${path.join(' → ')}.`, { path: path.slice(), walker: team, at: 0, vars: [`N = ${N}`] });
      let pos = path.length;
      for (let k = 0; k < path.length; k++) {
        const p = path[k];
        if (beats(team, p)) {
          pos = k;
          snap(3, `Team ${team} beat team ${p}, so ${team} can go right before ${p}.`, { path: path.slice(), walker: team, at: k, activeEdge: edgeOf(team, p), cmp: p, vars: [`N = ${N}`] });
          break;
        }
        snap(3, `Team ${p} beat team ${team}, so ${team} must come later than ${p}.`, { path: path.slice(), walker: team, at: k, activeEdge: edgeOf(team, p), cmp: p, vars: [`N = ${N}`] });
      }
      path = [...path.slice(0, pos), team, ...path.slice(pos)];
      const before = path[pos - 1], after = path[pos + 1];
      const where = before && after ? `between ${before} and ${after}` : after ? `at the front, before ${after}` : `at the end, after ${before}`;
      const last = i === ids.length - 1;
      snap(3, `Placed ${team} ${where}. The arrangement is now ${path.join(' → ')}.`, { path: path.slice(), vars: [`N = ${N}`], ...(last ? { result: { ok: true, order: path.slice() } } : {}) });
    }
    return { frames, code, sections, ids, graph: g };
  },
};
