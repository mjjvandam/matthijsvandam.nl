(() => {
  'use strict';
  const story = document.querySelector('[data-professionals-story]');
  const stage = story?.querySelector('.professional-story-stage');
  const svg = story?.querySelector('#professional-story-svg');
  const world = story?.querySelector('#professional-world');
  const label = story?.querySelector('[data-professionals-map-label]');
  const pillar = story?.querySelector('[data-professionals-pillar]');
  const moments = story ? [...story.querySelectorAll('[data-professionals-moment]')] : [];
  if (!story || !stage || !svg || !world || !label || !moments.length) return;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const labels = ['Nederland · samenwerking krijgt lokaal vorm','Midden-Brabant · inzoomen op Tilburg','Het netwerk rond het Orthopedisch Centrum ETZ','Pijler 1 · korte afstemming','Pijler 2 · verwijzen en terugverwijzen','Pijler 3 · samen beoordelen','Pijler 4 · samen leren'];
  const pillars = ['', '', 'Het netwerk rond de patiënt', 'Korte afstemming', 'Verwijzen en terugverwijzen', 'Samen beoordelen', 'Samen leren'];
  const scenes = [
    { x: 450, scale: 1.00, side: 'right' },
    { x: 1700, scale: .92, side: 'left' },
    { x: 3000, scale: 1.05, side: 'right' },
    { x: 3000, scale: 1.12, side: 'left' },
    { x: 3000, scale: 1.12, side: 'right' },
    { x: 3000, scale: 1.12, side: 'left' },
    { x: 3000, scale: 1.12, side: 'right' },
  ];
  const clamp = value => Math.max(0, Math.min(1, value));
  const ease = value => { const v = clamp(value); return v * v * (3 - 2 * v); };
  const mix = (a, b, t) => a + (b - a) * t;
  let scheduled = false;

  function paint() {
    scheduled = false;
    if (reduced.matches) return;
    const mobile = innerWidth < 850;
    const focus = innerHeight * (mobile ? .08 : .3);
    const positions = moments.map(moment => moment.getBoundingClientRect().top - focus);
    let current = 0;
    while (current < moments.length - 1 && positions[current + 1] <= 0) current += 1;
    const next = Math.min(current + 1, moments.length - 1);
    const span = current === next ? moments[current].getBoundingClientRect().height : positions[next] - positions[current];
    const local = span > 0 ? clamp(-positions[current] / span) : 1;
    const travel = ease((local - .62) / .38);
    const beat = ease(local / .62);
    const from = scenes[current];
    const to = scenes[next];
    const rect = stage.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const scale = mix(from.scale, to.scale, travel);
    const x = mix(from.x, to.x, travel);
    const focusX = mobile ? .5 : (from.side === 'right' ? .29 : .71);
    const worldWidth = (mobile ? 760 : 1160) / scale;
    const worldHeight = worldWidth * height / width;
    const originX = x - worldWidth * focusX;
    const originY = 405 - worldHeight * (mobile ? .56 : .54);
    svg.setAttribute('viewBox', `${originX} ${originY} ${worldWidth} ${worldHeight}`);

    story.dataset.scene = String(current);
    story.style.setProperty('--story-beat', beat.toFixed(3));
    label.textContent = labels[current];
    label.style.left = mobile ? '0' : (from.side === 'right' ? '5%' : '52%');
    if (pillar) pillar.textContent = pillars[current];
    moments.forEach((moment, index) => moment.classList.toggle('is-active', index === current));

    const stationProgress = [
      current === 0 ? 1 - travel : current < 1 ? 1 : 0,
      current === 1 ? Math.max(beat, 1 - travel) : 0,
      current >= 2 ? 1 : travel,
    ];
    story.querySelector('.professional-story-country').style.opacity = String(.025 + stationProgress[0] * .975);
    story.querySelector('.professional-story-region').style.opacity = String(.025 + stationProgress[1] * .975);
    story.querySelector('.professional-story-network').style.opacity = String(.025 + stationProgress[2] * .975);
    story.querySelector('.professional-world-route').style.strokeDashoffset = String(1 - ease((current + local) / 2.25));

    const networkReveal = current < 2 ? 0 : current === 2 ? beat : 1;
    story.querySelectorAll('.professional-story-links path').forEach((line, index) => {
      line.style.strokeDashoffset = String(1 - ease((networkReveal - index * .07) / .55));
    });
    story.querySelectorAll('.professional-story-node').forEach((node, index) => {
      const reveal = ease((networkReveal - index * .07) / .48);
      node.style.opacity = String(reveal);
      node.style.transform = `translateY(${(1 - reveal) * 18}px)`;
    });
    const focusPill = story.querySelector('.professional-story-pillar-focus');
    focusPill.style.opacity = String(current >= 2 ? 1 : 0);
    focusPill.style.transform = `translateY(${current >= 2 ? 0 : 12}px)`;
  }

  function requestPaint() {
    if (!scheduled) { scheduled = true; requestAnimationFrame(paint); }
  }
  function applyMode() {
    story.classList.toggle('is-enhanced', !reduced.matches && innerHeight >= 600);
    paint();
  }
  addEventListener('scroll', requestPaint, { passive: true });
  addEventListener('resize', applyMode);
  addEventListener('pageshow', requestPaint);
  reduced.addEventListener('change', applyMode);
  applyMode();
})();
