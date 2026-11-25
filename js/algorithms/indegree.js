/* ==========================================================================
   Frame generator for "Calculate In-degrees" (lecture slide 74).
   Pure logic, no DOM. See docs/ALGORITHM_ANIMATION.md for the frame format.
   Emits code lines 1-6; lines 7-8 (endwhile/endfor) are block markers only.
   ========================================================================== */
window.Algorithms = window.Algorithms || {};

Algorithms.traceInDegrees = function (t) {
  const { n, adj, name, st, snap, edgeId } = t;

  for (let i = 0; i < n; i++) {
    st.D[i] = 0;
    snap(1, `Set D[${name(i)}] to 0. No edge has been counted yet.`,
      { cur: i, changed: i, vars: [`i = ${name(i)}`] });
  }

  for (let i = 0; i < n; i++) {
    const vars = [`i = ${name(i)}`];
    snap(2, `Next, walk through the adjacency list of ${name(i)}.`, { cur: i, vars });
    let k = 0;
    st.ptr = { owner: i, idx: 0, name: 'x' };
    snap(3, adj[i].length
      ? `x points to the first cell of the list of ${name(i)}.`
      : `The list of ${name(i)} is empty, so x is null.`, { cur: i, vars });

    for (;;) {
      if (k >= adj[i].length) {
        snap(4, `x is null, so the list of ${name(i)} is finished.`, { cur: i, vars });
        break;
      }
      const w = adj[i][k];
      const v2 = [...vars, `x.value = ${name(w)}`];
      snap(4, `x is not null. It holds ${name(w)}, so there is an [[edge|edge]] ${name(i)} → ${name(w)}.`,
        { cur: i, target: w, activeEdge: edgeId(i, w), vars: v2 });
      st.D[w] += 1;
      snap(5, `This edge enters ${name(w)}, so D[${name(w)}] goes up to ${st.D[w]}.`,
        { cur: i, target: w, activeEdge: edgeId(i, w), changed: w, vars: v2 });
      k += 1;
      st.ptr = { owner: i, idx: k, name: 'x' };
      snap(6, k < adj[i].length ? 'Move x to the next cell of the list.' : 'Move x forward. There is no next cell, so x is now null.',
        { cur: i, vars });
    }
    st.ptr = null;
  }
};
