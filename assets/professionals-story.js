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
  const labels = ['Nederland · samenwerking krijgt lokaal vorm','ETZ · level-1-traumacentrum','Midden-Brabant · inzoomen op Tilburg','Het netwerk rond het Orthopedisch Centrum ETZ','Pijler 1 · korte afstemming','Pijler 2 · verwijzen en terugverwijzen','Pijler 3 · samen beoordelen','Pijler 4 · samen leren','Pijler 5 · patiënt, praktijk en wetenschap'];
  const pillars = ['', '', '', 'Het netwerk rond de patiënt', 'Korte afstemming', 'Verwijzen en terugverwijzen', 'Samen beoordelen', 'Samen leren', 'Patiënt, praktijk en wetenschap'];
  const scenes = [
    { x: 450, y: 405, scale: 1.00, side: 'right' },
    { x: 466, y: 523, scale: 2.60, side: 'left' },
    { x: 466, y: 523, scale: .98, side: 'right' },
    { x: 1150, y: 405, scale: 1.05, side: 'left' },
    { x: 1150, y: 405, scale: 1.12, side: 'right' },
    { x: 1150, y: 405, scale: 1.12, side: 'left' },
    { x: 1150, y: 405, scale: 1.12, side: 'right' },
    { x: 1150, y: 405, scale: 1.12, side: 'left' },
    { x: 1850, y: 405, scale: .90, side: 'right', focus: .27 },
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
    const travel = ease((local - .46) / .54);
    const beat = ease(local / .7);
    const from = scenes[current];
    const to = scenes[next];
    const rect = stage.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const scale = mix(from.scale, to.scale, travel);
    const x = mix(from.x, to.x, travel);
    const y = mix(from.y ?? 405, to.y ?? 405, travel);
    const fromFocusX = from.focus ?? (from.side === 'right' ? .29 : .71);
    const toFocusX = to.focus ?? (to.side === 'right' ? .29 : .71);
    const focusX = mobile ? .5 : mix(fromFocusX, toFocusX, travel);
    const worldWidth = (mobile ? 760 : 1160) / scale;
    const worldHeight = worldWidth * height / width;
    const originX = x - worldWidth * focusX;
    const originY = y - worldHeight * (mobile ? .56 : .54);
    svg.setAttribute('viewBox', `${originX} ${originY} ${worldWidth} ${worldHeight}`);

    story.dataset.scene = String(current);
    story.style.setProperty('--story-beat', beat.toFixed(3));
    const labelIndex = travel < .5 ? current : next;
    label.textContent = labels[labelIndex];
    label.style.left = mobile ? '0' : `${mix(from.side === 'right' ? 5 : 52, to.side === 'right' ? 5 : 52, travel)}%`;
    if (pillar) {
      pillar.textContent = pillars[labelIndex];
      const swapDistance = Math.abs(travel - .5) * 2;
      pillar.parentElement.style.opacity = String(labelIndex >= 3 ? .22 + ease(swapDistance) * .78 : 0);
    }
    moments.forEach((moment, index) => moment.classList.toggle('is-active', index === current));

    const leaving = 1 - ease((travel - .45) / .55);
    const entering = ease(travel / .55);
    const stationProgress = [
      current === 0 ? 1 : current === 1 ? leaving : 0,
      current === 1 ? entering : current === 2 ? leaving : 0,
      current >= 3 && current < 7 ? 1 : current === 2 ? entering : current === 7 ? leaving : 0,
      current >= 8 ? 1 : current === 7 ? entering : 0,
    ];
    story.querySelector('.professional-story-country').style.opacity = String(stationProgress[0]);
    story.querySelector('.professional-story-region').style.opacity = String(stationProgress[1]);
    story.querySelector('.professional-story-network').style.opacity = String(stationProgress[2]);
    story.querySelector('.professional-story-learning').style.opacity = String(stationProgress[3]);
    story.querySelector('.professional-world-route').style.strokeDashoffset = String(1 - ease((current + local) / 8));

    const networkReveal = current < 3 ? 0 : current === 3 ? beat : 1;
    story.querySelectorAll('.professional-story-links path').forEach((line, index) => {
      line.style.strokeDashoffset = String(1 - ease((networkReveal - index * .07) / .55));
    });
    story.querySelectorAll('.professional-story-node').forEach((node, index) => {
      const reveal = ease((networkReveal - index * .07) / .48);
      node.style.opacity = String(reveal);
      node.style.transform = `translateY(${(1 - reveal) * 18}px)`;
    });
    const peerReveal = current < 4 ? 0 : clamp((current - 4 + beat) / 4);
    story.querySelectorAll('.professional-story-peer-links path').forEach((line, index) => {
      line.style.strokeDashoffset = String(1 - ease((peerReveal - index * .075) / .55));
    });
    const learningReveal = current < 7 ? 0 : current === 7 ? entering : 1;
    story.querySelector('.professional-story-learning-orbit').style.strokeDashoffset = String(1 - learningReveal);
    story.querySelectorAll('.professional-story-learning-links path').forEach((line, index) => {
      line.style.strokeDashoffset = String(1 - ease((learningReveal - index * .06) / .58));
    });
    story.querySelectorAll('.professional-story-learning-node, .professional-story-learning-partner').forEach((node, index) => {
      const reveal = ease((learningReveal - index * .07) / .5);
      node.style.opacity = String(reveal);
    });
    const focusPill = story.querySelector('.professional-story-pillar-focus');
    focusPill.style.transform = `translateY(${labelIndex >= 3 ? 0 : 12}px)`;
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
