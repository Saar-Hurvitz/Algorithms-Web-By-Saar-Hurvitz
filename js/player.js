/* ==========================================================================
   Player: generic step controller. Knows nothing about any algorithm.
   new Player(els, { onRender(frame, index, prevIndex, delayMs), onPlayState(bool) })
   els: { root, restart, back, play, next, end, scrub, speed, speedOut, count }
   Frames are precomputed, so going back is exact.
   ========================================================================== */
window.Player = class {
  constructor(els, hooks) {
    this.els = els; this.hooks = hooks;
    this.frames = []; this.i = 0; this.playing = false; this.timer = null;
    this.baseDelay = 1150;

    els.restart.addEventListener('click', () => { this.pause(); this.go(0); this.keep(); });
    els.back.addEventListener('click', () => { this.pause(); this.go(this.i - 1); this.keep(); });
    els.next.addEventListener('click', () => { this.pause(); this.go(this.i + 1); this.keep(); });
    els.end.addEventListener('click', () => { this.pause(); this.go(this.frames.length - 1); this.keep(); });
    els.play.addEventListener('click', () => { this.toggle(); this.keep(); });
    els.scrub.addEventListener('input', () => { this.pause(); this.go(+els.scrub.value); });
    els.speed.addEventListener('input', () => this.showSpeed());
    this.showSpeed();

    els.root.addEventListener('keydown', e => {
      const inRange = e.target.matches('input[type="range"]');
      if (e.target.matches('select')) return;
      if (e.key === 'ArrowRight' && !inRange) { e.preventDefault(); this.pause(); this.go(this.i + 1); }
      else if (e.key === 'ArrowLeft' && !inRange) { e.preventDefault(); this.pause(); this.go(this.i - 1); }
      else if (e.key === ' ' && !e.target.closest('button, a')) { e.preventDefault(); this.toggle(); }
    });
  }

  /* Return focus to the widget after a mouse click, so the arrow keys and space keep working */
  keep() { this.els.root.focus({ preventScroll: true }); }

  get delay() { return this.baseDelay / parseFloat(this.els.speed.value); }

  showSpeed() { this.els.speedOut.textContent = `${parseFloat(this.els.speed.value)}×`; }

  load(frames) {
    this.pause();
    this.frames = frames; this.i = 0;
    this.els.scrub.max = frames.length - 1;
    this.go(0, true);
  }

  go(i, force) {
    const clamped = Math.max(0, Math.min(this.frames.length - 1, i));
    if (clamped === this.i && !force) return;
    const prev = this.i;
    this.i = clamped;
    this.els.scrub.value = clamped;
    this.els.count.textContent = `Step ${clamped + 1} of ${this.frames.length}`;
    this.els.back.disabled = this.els.restart.disabled = clamped === 0;
    this.els.next.disabled = this.els.end.disabled = clamped === this.frames.length - 1;
    this.hooks.onRender(this.frames[clamped], clamped, prev, this.delay);
  }

  tick() {
    if (!this.playing) return;
    if (this.i >= this.frames.length - 1) { this.pause(); return; }
    this.go(this.i + 1);
    this.timer = setTimeout(() => this.tick(), this.delay);
  }

  play() {
    if (this.playing) return;
    if (this.i >= this.frames.length - 1) this.go(0);
    this.playing = true;
    this.els.play.textContent = 'Pause';
    this.hooks.onPlayState && this.hooks.onPlayState(true);
    this.timer = setTimeout(() => this.tick(), Math.min(350, this.delay));
  }

  pause() {
    clearTimeout(this.timer);
    if (!this.playing) return;
    this.playing = false;
    this.els.play.textContent = 'Play';
    this.hooks.onPlayState && this.hooks.onPlayState(false);
  }

  toggle() { this.playing ? this.pause() : this.play(); }
};
