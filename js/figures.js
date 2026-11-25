/* ==========================================================================
   Figures: small diagrams inside entries, mounted from <div data-fig="key">.
   Also the small interactive widgets (graph families, K(a,b), path walker, Big-O).
   ========================================================================== */
window.Figures = (function () {
  const parseN = s => s.split(' ').map(t => { const [id, x, y] = t.split(','); return [id, +x, +y]; });
  const parseE = s => s.split(' ').map(t => t.split('>'));
  const FIGS = {
    l42: { from: 'L56' },
    l43d: { n: 'v₁,60,70 v₂,250,70 v₃,440,70', e: 'v₁>v₂ v₂>v₁ v₂>v₃', d: true, h: 130 },
    l43u: { n: 'v₁,60,50 v₂,250,50 v₃,440,50', e: 'v₁>v₂ v₂>v₃', h: 100 },
    l44: { n: 'u,130,75 v,300,75', e: 'u>v u>v v>v', h: 150, w: 420, loopAngle: 0 },
    l46: { n: 'u,130,75 v,300,75', e: 'u>v u>v v>v', d: true, h: 150, w: 420, loopAngle: 0 },
    l45: { from: 'L45', explore: 'adjacent' },
    l45d: { from: 'L45', explore: 'degree' },
    l47: { from: 'L47', explore: 'inout' },
    l57ok: { from: 'L56' },
    l59: { n: 'A,70,130 B,240,40 C,420,90 D,260,245', e: 'A>B B>C C>D D>A', d: true, active: ['A>B', 'B>C', 'C>D', 'D>A'] },
    l61: { from: 'L61', active: ['A>B', 'B>C', 'C>D', 'D>A'] },
    l62: { from: 'L56', ready: ['A', 'F'] },
    l63: { from: 'L63' },
    r13: { n: '1,70,145 2,170,55 3,270,145 4,170,235 5,370,145 6,450,55 7,450,235', e: '1>2 2>3 3>4 4>1 3>5 5>6 5>7', active: ['1>2', '2>3', '3>5', '5>6'], target: ['1', '2', '3', '5', '6'] },
    r21: { n: '1,70,145 2,170,55 3,270,145 4,170,235 5,370,145 6,450,55 7,450,235', e: '1>2 2>3 3>4 4>1 3>5 5>6 5>7', active: ['1>2', '2>3', '3>4', '4>1'], target: ['1', '2', '3', '4'] },
    r15: { n: 'a,60,240 b,120,120 c,210,190 d,290,120 e,330,40 f,450,30 g,480,120 h,420,220', e: 'a>b b>c a>c b>d d>e e>f f>g g>h d>h e>h f>h', h: 280 },
    r17: { n: 'A,120,50 B,380,50 C,120,240 D,380,240', e: 'A>B A>C B>D C>D D>A', d: true },
    r22: { n: '1,70,60 2,240,60 3,420,60 4,70,230 5,240,230 6,420,230', e: '1>2 1>4 2>5 3>6 3>5 4>2 5>4 6>6', d: true },
  };

  const adjText = list => (list.length ? list.join(', ') : 'none');

  function mountFig(el) {
    const f = FIGS[el.dataset.fig];
    if (!f) { console.error('Unknown figure', el.dataset.fig); return; }
    const src = f.from ? Exercises.graphs[f.from] : null;
    const nodes = (src ? src.nodes : parseN(f.n)).map(([id, x, y]) => ({ id, x, y, label: id }));
    const pairs = src ? src.edges : parseE(f.e);
    const directed = src ? src.directed : !!f.d;
    const used = {};
    const edges = GraphView.autoBend(pairs.map(([from, to]) => {
      const k = `${from}>${to}`; used[k] = (used[k] || 0) + 1;
      return { id: used[k] > 1 ? `${k}#${used[k]}` : k, from, to, loopAngle: f.loopAngle };
    }));
    const box = document.createElement('div');
    box.className = 'graph-box';
    el.appendChild(box);
    const gv = GraphView.create(box, { nodes, edges, width: f.w || 500, height: f.h || 290, r: 22, directed, ariaLabel: el.dataset.alt || 'Graph figure' });
    (f.ready || []).forEach(v => gv.setNodeState(v, 'ready'));
    (f.target || []).forEach(v => gv.setNodeState(v, 'target'));
    (f.active || []).forEach(e => gv.setEdgeState(e, 'active'));
    if (!f.explore) return;

    const cap = document.createElement('p');
    cap.className = 'caption-live'; cap.setAttribute('aria-live', 'polite');
    const hint = { adjacent: 'Hover a vertex to see what it is adjacent to.', degree: 'Hover a vertex to count its degree.', inout: 'Hover a vertex: incoming edges turn orange, outgoing edges blue.' }[f.explore];
    cap.textContent = hint;
    el.appendChild(cap);
    const clear = () => {
      nodes.forEach(n => gv.setNodeState(n.id, ''));
      edges.forEach(e => gv.setEdgeState(e.id, ''));
    };
    gv.onHover(sel => {
      clear();
      if (!sel || sel.type !== 'node') { cap.textContent = hint; return; }
      const v = sel.id;
      gv.setNodeState(v, 'cur');
      const inc = edges.filter(e => e.from === v || e.to === v);
      if (f.explore === 'inout') {
        const ins = edges.filter(e => e.to === v), outs = edges.filter(e => e.from === v);
        outs.forEach(e => gv.setEdgeState(e.id, 'out'));
        ins.forEach(e => gv.setEdgeState(e.id, 'active'));
        cap.textContent = `${v}: in-degree ${ins.length}, out-degree ${outs.length}.${ins.some(e => e.from === e.to) ? ' The self-loop counts once in each.' : ''}`;
        return;
      }
      inc.forEach(e => gv.setEdgeState(e.id, 'active'));
      const others = [...new Set(inc.flatMap(e => [e.from, e.to]).filter(x => x !== v))];
      others.forEach(x => gv.setNodeState(x, 'target'));
      if (f.explore === 'adjacent') {
        const self = inc.some(e => e.from === e.to);
        cap.textContent = `${v} is adjacent to: ${adjText(self ? [...others, `${v} itself (the self-loop)`] : others)}. Edges incident with ${v}: ${adjText(inc.map(e => `(${e.from},${e.to})`))}.`;
      } else {
        const loops = inc.filter(e => e.from === e.to).length;
        const d = inc.length + loops;
        cap.textContent = `deg(${v}) = ${d}.${loops ? ` The self-loop counts twice: ${inc.length - loops} ordinary edges + 2.` : ''}`;
      }
    });
  }

  /* Graph families P(n), C(n), K(n), S(n) */
  function family(host) {
    host.innerHTML = `<div class="playground"><p class="playground-title">See each family at any size</p>
      <div class="controls"><div class="seg small">${['P', 'C', 'K', 'S'].map((f, i) => `<button type="button" data-f="${f}" aria-pressed="${i === 0}">${{ P: 'Path', C: 'Cycle', K: 'Clique', S: 'Star' }[f]}</button>`).join('')}</div>
      <label>n <input type="range" min="2" max="8" value="5" data-n> <output data-o></output></label></div>
      <div class="graph-box"></div><p class="caption-live" aria-live="polite"></p></div>`;
    const box = host.querySelector('.graph-box'), n = host.querySelector('[data-n]'), o = host.querySelector('[data-o]'), cap = host.querySelector('.caption-live');
    let kind = 'P';
    function draw() {
      if (kind === 'C' && +n.value < 3) n.value = 3;
      n.min = kind === 'C' ? 3 : kind === 'S' ? 1 : 2;
      const k = +n.value;
      o.textContent = k;
      const W = 500, H = 280, cx = W / 2, cy = H / 2, R = 105;
      let nodes = [], edges = [];
      const ring = (m, offset = 0) => [...Array(m).keys()].map(i => ({ x: cx + R * 1.5 * Math.cos(offset + 2 * Math.PI * i / m) * .9, y: cy + R * Math.sin(offset + 2 * Math.PI * i / m) }));
      if (kind === 'P') {
        nodes = [...Array(k).keys()].map(i => ({ id: `${i + 1}`, x: k === 1 ? cx : 45 + i * (W - 90) / (k - 1), y: cy }));
        for (let i = 1; i < k; i++) edges.push([`${i}`, `${i + 1}`]);
      } else if (kind === 'C' || kind === 'K') {
        const p = ring(k, -Math.PI / 2);
        nodes = p.map((q, i) => ({ id: `${i + 1}`, ...q }));
        if (kind === 'C') for (let i = 0; i < k; i++) edges.push([`${i + 1}`, `${(i + 1) % k + 1}`]);
        else for (let i = 1; i <= k; i++) for (let j = i + 1; j <= k; j++) edges.push([`${i}`, `${j}`]);
      } else {
        const p = ring(k, -Math.PI / 2);
        nodes = [{ id: 'c', x: cx, y: cy }, ...p.map((q, i) => ({ id: `${i + 1}`, ...q }))];
        for (let i = 1; i <= k; i++) edges.push(['c', `${i}`]);
      }
      box.innerHTML = '';
      const nameSub = String(k).replace(/\d/g, d => '₀₁₂₃₄₅₆₇₈₉'[d]);
      GraphView.create(box, { nodes: nodes.map(x => ({ ...x, label: x.id })), edges: edges.map(([from, to]) => ({ id: `${from}>${to}`, from, to })), width: W, height: H, r: 18, ariaLabel: `${kind}${k}` });
      cap.textContent = `${kind}${nameSub} has ${nodes.length} vertices and ${edges.length} edges.${kind === 'S' ? ` It is the same graph as K₁,${nameSub}.` : ''}`;
    }
    host.querySelector('.seg').addEventListener('click', e => {
      const b = e.target.closest('button'); if (!b) return;
      kind = b.dataset.f;
      host.querySelectorAll('.seg button').forEach(x => x.setAttribute('aria-pressed', String(x === b)));
      draw();
    });
    n.addEventListener('input', draw);
    draw();
  }

  /* Complete bipartite K(a,b) */
  function kab(host) {
    host.innerHTML = `<div class="playground"><p class="playground-title">Change a and b</p>
      <div class="controls"><label>a <input type="range" min="1" max="4" value="2" data-a> <output data-oa></output></label>
      <label>b <input type="range" min="1" max="5" value="3" data-b> <output data-ob></output></label></div>
      <div class="graph-box"></div><p class="caption-live" aria-live="polite"></p></div>`;
    const box = host.querySelector('.graph-box'), a = host.querySelector('[data-a]'), b = host.querySelector('[data-b]'), cap = host.querySelector('.caption-live');
    function draw() {
      const A = +a.value, B = +b.value, W = 460, H = 260;
      host.querySelector('[data-oa]').textContent = A; host.querySelector('[data-ob]').textContent = B;
      const col = (m, x, p) => [...Array(m).keys()].map(i => ({ id: `${p}${i + 1}`, label: `${p}${i + 1}`, x, y: H / 2 + (i - (m - 1) / 2) * Math.min(58, (H - 40) / Math.max(1, m - 1 || 1)) }));
      const L1 = col(A, 110, 'a'), L2 = col(B, 350, 'b');
      const edges = L1.flatMap(u => L2.map(v => ({ id: `${u.id}>${v.id}`, from: u.id, to: v.id })));
      box.innerHTML = '';
      const gv = GraphView.create(box, { nodes: [...L1, ...L2], edges, width: W, height: H, r: 18, ariaLabel: `K ${A},${B}` });
      L1.forEach(n => gv.setNodeState(n.id, 'c1')); L2.forEach(n => gv.setNodeState(n.id, 'c2'));
      cap.textContent = `Every vertex on the left connects to every vertex on the right: |E| = ${A} · ${B} = ${A * B}.${A === 1 ? ' With a = 1 this is a star.' : ''}`;
    }
    a.addEventListener('input', draw); b.addEventListener('input', draw); draw();
  }

  /* Walk the three sequences from slide 60 */
  function pathWalker(host) {
    host.innerHTML = `<div class="playground"><p class="playground-title">Walk along a sequence</p>
      <p class="playground-hint">These are the three sequences from slide 60. Press one and follow it edge by edge.</p>
      <div class="controls"><button type="button" class="ex-btn" data-s="F,D,C,B,E">P₁ = F, D, C, B, E</button>
      <button type="button" class="ex-btn" data-s="F,D,C,B,A">P₂ = F, D, C, B, A</button>
      <button type="button" class="ex-btn" data-s="E,D,C,B,E">P₃ = E, D, C, B, E</button></div>
      <div class="graph-box"></div><p class="caption-live" aria-live="polite">Press a sequence to start.</p></div>`;
    const nodes = parseN('F,60,50 D,205,125 E,375,50 A,470,150 B,340,225 C,180,250').map(([id, x, y]) => ({ id, x, y, label: id }));
    const list = [['F', 'D', 'e₁'], ['C', 'D', 'e₂'], ['E', 'D', 'e₃'], ['D', 'E', 'e₄'], ['A', 'E', 'e₅'], ['A', 'B', 'e₆'], ['C', 'B', 'e₇'], ['D', 'C', 'e₈'], ['B', 'E', 'e₉']];
    const edges = GraphView.autoBend(list.map(([from, to, label]) => ({ id: `${from}>${to}`, from, to, label })));
    const box = host.querySelector('.graph-box'), cap = host.querySelector('.caption-live');
    const gv = GraphView.create(box, { nodes, edges, width: 520, height: 290, r: 20, directed: true, edgeLabels: true, ariaLabel: 'Graph from slide 60' });
    let timer = null;
    const clear = () => { nodes.forEach(n => gv.setNodeState(n.id, '')); edges.forEach(e => gv.setEdgeState(e.id, '')); };
    host.querySelectorAll('[data-s]').forEach(btn => btn.addEventListener('click', () => {
      clearTimeout(timer); clear();
      const seq = btn.dataset.s.split(',');
      const closed = seq[0] === seq[seq.length - 1];
      let i = 0;
      gv.setNodeState(seq[0], 'cur');
      cap.textContent = `Start at ${seq[0]}.`;
      const step = () => {
        i += 1;
        if (i >= seq.length) {
          cap.textContent = closed ? `Every step used an edge and the sequence ended where it started: ${seq.join(', ')} is a cycle.` : `Every step used an edge, so ${seq.join(', ')} is a path.`;
          return;
        }
        const [a, b] = [seq[i - 1], seq[i]];
        const e = edges.find(x => x.from === a && x.to === b);
        if (!e) {
          gv.setNodeState(b, 'bad');
          cap.textContent = `There is no edge from ${a} to ${b} (the edge between them goes the other way), so this sequence is not a path.`;
          return;
        }
        gv.setEdgeState(e.id, 'active');
        gv.setNodeState(a, 'target'); gv.setNodeState(b, 'cur');
        cap.textContent = `${a} → ${b} uses edge ${e.label}.`;
        timer = setTimeout(step, 800);
      };
      timer = setTimeout(step, 700);
    }));
  }

  /* Big-O: is c·n an upper bound on n + 120? */
  function bigO(host) {
    host.innerHTML = `<div class="playground"><p class="playground-title">Find the constant c</p>
      <p class="playground-hint">Slide 10 shows n + 120 = O(n). Move c and see from which n the line c·n stays above n + 120.</p>
      <div class="controls"><label>c <input type="range" min="1" max="5" step="0.25" value="2" data-c> <output data-o></output></label></div>
      <div class="plot" style="position:relative"></div><p class="caption-live" aria-live="polite"></p></div>`;
    const c = host.querySelector('[data-c]'), plot = host.querySelector('.plot'), cap = host.querySelector('.caption-live'), o = host.querySelector('[data-o]');
    const W = 560, H = 290, m = { l: 48, r: 16, t: 14, b: 38 }, maxN = 300, maxY = 800;
    const X = n => m.l + n / maxN * (W - m.l - m.r), Y = v => H - m.b - Math.min(v, maxY) / maxY * (H - m.t - m.b);
    plot.innerHTML = `<svg viewBox="0 0 ${W} ${H}" class="chart" role="img" aria-label="Lines n plus 120 and c times n"></svg>
      <div class="legend-row"><span><i style="background:var(--chart-a)"></i>f(n) = n + 120</span><span><i style="background:var(--chart-b)"></i>c · g(n) = c · n</span></div>
      <div class="chart-tip" hidden></div>`;
    const svg = plot.querySelector('svg'), tip = plot.querySelector('.chart-tip');
    let cv = 2;
    function draw(hoverN) {
      cv = +c.value; o.textContent = cv;
      const N = cv > 1 ? 120 / (cv - 1) : null;
      let s = '';
      [0, 200, 400, 600, 800].forEach(v => { s += `<line class="grid" x1="${m.l}" x2="${W - m.r}" y1="${Y(v)}" y2="${Y(v)}"/><text class="tick" x="${m.l - 8}" y="${Y(v) + 4}" text-anchor="end">${v}</text>`; });
      [0, 100, 200, 300].forEach(v => { s += `<text class="tick" x="${X(v)}" y="${H - m.b + 18}" text-anchor="middle">${v}</text>`; });
      s += `<text class="tick" x="${W - m.r}" y="${H - 6}" text-anchor="end">n</text>`;
      if (N != null && N < maxN) s += `<rect class="zone" x="${X(N)}" y="${m.t}" width="${X(maxN) - X(N)}" height="${H - m.t - m.b}"/><line class="n-mark" x1="${X(N)}" x2="${X(N)}" y1="${m.t}" y2="${H - m.b}"/><text class="tick strong" x="${X(N) + 6}" y="${m.t + 14}">N = ${Math.ceil(N)}</text>`;
      const cEnd = Math.min(maxN, maxY / cv);
      s += `<line class="series a" x1="${X(0)}" y1="${Y(120)}" x2="${X(maxN)}" y2="${Y(420)}"/><line class="series b" x1="${X(0)}" y1="${Y(0)}" x2="${X(cEnd)}" y2="${Y(cv * cEnd)}"/>`;
      s += `<text class="dlabel" x="${X(maxN) - 4}" y="${Y(420) + 18}" text-anchor="end">n + 120</text><text class="dlabel" x="${X(cEnd) - 8}" y="${Y(cv * cEnd) + (cEnd < maxN ? 22 : -8)}" text-anchor="end">${cv} · n</text>`;
      if (hoverN != null) s += `<line class="cross" x1="${X(hoverN)}" x2="${X(hoverN)}" y1="${m.t}" y2="${H - m.b}"/><circle class="dot a" cx="${X(hoverN)}" cy="${Y(hoverN + 120)}" r="4.5"/><circle class="dot b" cx="${X(hoverN)}" cy="${Y(cv * hoverN)}" r="4.5"/>`;
      svg.innerHTML = s;
      cap.textContent = N == null
        ? 'With c = 1 the line c·n never catches n + 120, so this c does not work. Any c above 1 does.'
        : N <= maxN ? `With c = ${cv}: for all n ≥ ${Math.ceil(N)}, n + 120 ≤ ${cv}·n. So c = ${cv} and N = ${Math.ceil(N)} show that n + 120 = O(n).`
          : `With c = ${cv} the bound starts at n = ${Math.ceil(N)}, beyond this chart. It still works.`;
    }
    c.addEventListener('input', () => draw());
    svg.addEventListener('mousemove', e => {
      const r = svg.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width * W;
      const n = Math.max(0, Math.min(maxN, Math.round((px - m.l) / (W - m.l - m.r) * maxN)));
      draw(n);
      tip.hidden = false;
      tip.innerHTML = `n = ${n}<br>n + 120 = ${n + 120}<br>${cv}·n = ${cv * n}`;
      const left = X(n) / W * r.width;
      tip.style.left = `${Math.min(left + 12, r.width - 120)}px`; tip.style.top = '20px';
    });
    svg.addEventListener('mouseleave', () => { tip.hidden = true; draw(); });
    draw();
  }

  function mountAll(root) {
    root.querySelectorAll('[data-fig]').forEach(mountFig);
  }
  return { mountAll, family, kab, pathWalker, bigO };
})();
