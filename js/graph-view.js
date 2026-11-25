/* ==========================================================================
   GraphView — tiny SVG graph renderer (no dependencies).

   GraphView.create(container, {
     nodes: [{ id, x, y, label, labelSide }], // x/y in viewBox units
     edges: [{ id, from, to, label, bend }],   // bend = curve; from === to = self-loop
     width, height,                          // viewBox size
     directed: false,                        // arrowheads (fade in/out smoothly)
     nodeLabels: true, edgeLabels: false,
     labelPos: 'inside' | 'below',           // where node labels sit
     r: 20,                                  // node radius
     badges: false                           // small number beside each node (setBadge)
   }) → api
   api.setDirected(bool) / setNodeLabels(bool) / setEdgeLabels(bool)
   api.highlight({ nodes: [...ids], edges: [...ids] })   // adds .on
   api.onHover(fn)  → fn({ type: 'node'|'edge'|null, id })
   api.svg, api.nodeEl(id), api.edgeEl(id)
   ========================================================================== */
(function () {
  const NS = 'http://www.w3.org/2000/svg';
  const el = (tag, attrs = {}, parent) => {
    const e = document.createElementNS(NS, tag);
    for (const k in attrs) e.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(e);
    return e;
  };

  /* Endpoints for a straight edge, a curved edge (e.bend) or a self-loop */
  function geometry(a, b, r, e) {
    if (e.from === e.to) {
      const t = e.loopAngle != null ? e.loopAngle : -Math.PI / 4;
      const p = ang => [a.x + Math.cos(ang) * r, a.y + Math.sin(ang) * r];
      const q = ang => [a.x + Math.cos(ang) * r * 3.3, a.y + Math.sin(ang) * r * 3.3];
      const [x1, y1] = p(t - .55), [x2, y2] = p(t + .55);
      const [c1x, c1y] = q(t - .75), [c2x, c2y] = q(t + .75);
      const len = Math.hypot(x2 - c2x, y2 - c2y) || 1;
      return {
        d: `M${x1},${y1} C${c1x},${c1y} ${c2x},${c2y} ${x2},${y2}`,
        tipX: x2, tipY: y2, ux: (x2 - c2x) / len, uy: (y2 - c2y) / len,
        labelX: a.x + Math.cos(t) * r * 3, labelY: a.y + Math.sin(t) * r * 3,
      };
    }
    const dx = b.x - a.x, dy = b.y - a.y, len = Math.hypot(dx, dy) || 1;
    const ux = dx / len, uy = dy / len;
    if (e.bend) {
      const cx = (a.x + b.x) / 2 - uy * e.bend * 2, cy = (a.y + b.y) / 2 + ux * e.bend * 2;
      const toward = (from, off) => {
        const l = Math.hypot(cx - from.x, cy - from.y) || 1;
        return [from.x + (cx - from.x) / l * off, from.y + (cy - from.y) / l * off];
      };
      const [x1, y1] = toward(a, r), [x2, y2] = toward(b, r + 2);
      const el2 = Math.hypot(x2 - cx, y2 - cy) || 1;
      return {
        d: `M${x1},${y1} Q${cx},${cy} ${x2},${y2}`,
        tipX: x2, tipY: y2, ux: (x2 - cx) / el2, uy: (y2 - cy) / el2,
        labelX: (a.x + b.x) / 2 - uy * (e.bend + 14 * Math.sign(e.bend)), labelY: (a.y + b.y) / 2 + ux * (e.bend + 14 * Math.sign(e.bend)),
      };
    }
    const x2 = b.x - ux * (r + 2), y2 = b.y - uy * (r + 2);
    return {
      x1: a.x + ux * r, y1: a.y + uy * r, x2, y2, tipX: x2, tipY: y2, ux, uy,
      labelX: (a.x + b.x) / 2 - uy * 14, labelY: (a.y + b.y) / 2 + ux * 14,
    };
  }

  /* Gives parallel and opposite edges between the same two vertices separate curves */
  function autoBend(edges, size = 24) {
    const groups = {};
    edges.forEach(e => {
      if (e.from === e.to) return;
      const key = [e.from, e.to].sort().join('|');
      (groups[key] = groups[key] || []).push(e);
    });
    Object.values(groups).forEach(list => {
      if (list.length < 2) return;
      const first = list[0].from;
      const slots = list.length % 2 ? [0] : [];
      for (let k = 1; slots.length < list.length; k++) slots.push(k * size, -k * size);
      list.forEach((e, i) => { e.bend = (e.from === first ? 1 : -1) * slots[i]; });
    });
    return edges;
  }

  function create(container, opts) {
    const o = Object.assign({ width: 520, height: 300, directed: false, nodeLabels: true,
      edgeLabels: false, labelPos: 'inside', r: 20 }, opts);
    const svg = el('svg', { viewBox: `0 0 ${o.width} ${o.height}`, class: 'graph', role: 'img' });
    if (o.ariaLabel) svg.setAttribute('aria-label', o.ariaLabel);
    const gEdges = el('g', { class: 'edges' }, svg);
    const gNodes = el('g', { class: 'nodes' }, svg);
    const byId = Object.fromEntries(o.nodes.map(n => [n.id, n]));
    const nodeEls = {}, edgeEls = {}, badgeEls = {};
    let hoverCb = null;

    // Edges first (drawn below nodes)
    for (const e of o.edges) {
      const a = byId[e.from], b = byId[e.to];
      const g = el('g', { class: 'edge', 'data-id': e.id }, gEdges);
      const geo = geometry(a, b, o.r, e);
      if (geo.d) {
        el('path', { class: 'curve', d: geo.d }, g);
      } else {
        el('line', { x1: geo.x1, y1: geo.y1, x2: geo.x2, y2: geo.y2 }, g);
      }
      // Arrowhead as its own path so it can fade (SVG markers can't transition)
      const ah = 13, aw = 6.5;
      const bx = geo.tipX - geo.ux * ah, by = geo.tipY - geo.uy * ah;
      const px = -geo.uy * aw, py = geo.ux * aw;
      el('path', { class: 'arrow', d: `M${geo.tipX},${geo.tipY} L${bx + px},${by + py} L${bx - px},${by - py} Z` }, g);
      if (geo.d) el('path', { class: 'hit', d: geo.d, fill: 'none' }, g);
      else el('line', { class: 'hit', x1: geo.x1, y1: geo.y1, x2: geo.x2, y2: geo.y2 }, g);
      if (e.label != null) {
        const t = el('text', { class: 'elabel', x: geo.labelX, y: geo.labelY }, g);
        t.textContent = e.label;
      }
      g.addEventListener('mouseenter', () => hoverCb && hoverCb({ type: 'edge', id: e.id }));
      g.addEventListener('mouseleave', () => hoverCb && hoverCb({ type: null }));
      edgeEls[e.id] = g;
    }

    for (const n of o.nodes) {
      const g = el('g', { class: 'node', 'data-id': n.id, tabindex: 0 }, gNodes);
      el('circle', { cx: n.x, cy: n.y, r: o.r }, g);
      if (o.badges) {
        // Put the badge in the direction farthest from every edge touching this node
        const angles = o.edges.filter(e => e.from === n.id || e.to === n.id).map(e => {
          const other = byId[e.from === n.id ? e.to : e.from];
          return Math.atan2(other.y - n.y, other.x - n.x);
        });
        const dist = o.r + 11;
        /* A badge must stay inside the drawing: skip directions that would push it past the
           viewBox edge (half a badge is about 12 wide and 9 high), unless none is left */
        const fits = a => { const x = n.x + Math.cos(a) * dist, y = n.y + Math.sin(a) * dist; return x >= 12 && x <= o.width - 12 && y >= 9 && y <= o.height - 9; };
        let best = -Math.PI / 4, bestGap = -1;
        for (const inside of [true, false]) {
          for (let k = 0; k < 8; k++) {
            const a = -Math.PI / 4 + k * Math.PI / 4;
            if (inside && !fits(a)) continue;
            const gap = angles.length ? Math.min(...angles.map(b => Math.abs(Math.atan2(Math.sin(a - b), Math.cos(a - b))))) : 9;
            if (gap > bestGap + .01) { bestGap = gap; best = a; }
          }
          if (bestGap >= 0) break;
        }
        badgeEls[n.id] = el('text', { class: 'badge', x: n.x + Math.cos(best) * dist, y: n.y + Math.sin(best) * dist }, g);
      }
      if (n.label != null) {
        const side = n.labelSide || o.labelPos;   // a node can override: labelSide: 'above'
        const t = el('text',
          side === 'below' ? { class: 'below', x: n.x, y: n.y + o.r + 5 }
          : side === 'above' ? { class: 'above', x: n.x, y: n.y - o.r - 6 }
          : { x: n.x, y: n.y + 1 }, g);
        t.textContent = n.label;
      }
      const enter = () => hoverCb && hoverCb({ type: 'node', id: n.id });
      const leave = () => hoverCb && hoverCb({ type: null });
      g.addEventListener('mouseenter', enter); g.addEventListener('focus', enter);
      g.addEventListener('mouseleave', leave); g.addEventListener('blur', leave);
      nodeEls[n.id] = g;
    }

    container.appendChild(svg);

    const api = {
      svg,
      nodeEl: id => nodeEls[id],
      edgeEl: id => edgeEls[id],
      setDirected(on) { svg.querySelectorAll('.arrow').forEach(a => a.classList.toggle('faded', !on)); },
      setNodeLabels(on) { svg.querySelectorAll('.node text').forEach(t => t.classList.toggle('faded', !on)); },
      setEdgeLabels(on) { svg.querySelectorAll('.elabel').forEach(t => t.classList.toggle('faded', !on)); },
      highlight({ nodes = [], edges = [] } = {}) {
        for (const id in nodeEls) nodeEls[id].classList.toggle('on', nodes.includes(id));
        for (const id in edgeEls) edgeEls[id].classList.toggle('on', edges.includes(id));
      },
      onHover(fn) { hoverCb = fn; },
      /* For algorithm animations: state is read by CSS through data-state */
      setNodeState(id, state) { nodeEls[id].dataset.state = state || ''; },
      setEdgeState(id, state) { edgeEls[id].dataset.state = state || ''; },
      setBadge(id, value) { if (badgeEls[id] && badgeEls[id].textContent !== String(value)) badgeEls[id].textContent = value; },
      edgeIds: () => Object.keys(edgeEls),
    };
    api.setDirected(o.directed);
    api.setNodeLabels(o.nodeLabels);
    api.setEdgeLabels(o.edgeLabels);
    return api;
  }

  window.GraphView = { create, autoBend };
})();
