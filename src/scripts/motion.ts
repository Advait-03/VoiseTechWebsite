/**
 * Site-wide motion system. Everything here is progressive enhancement:
 * markup renders complete and visible without it, and every effect is
 * skipped when the visitor prefers reduced motion.
 */
declare global { interface Window { __vtMotion?: boolean; dataLayer?: unknown[] } }
window.__vtMotion = true;

const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const finePointer = matchMedia('(hover: hover) and (pointer: fine)');

/* ---------------------------------------------------------------- reveal */
function setupStagger(root: ParentNode = document) {
  root.querySelectorAll<HTMLElement>('[data-stagger]').forEach((group) => {
    group.querySelectorAll<HTMLElement>(':scope > [data-reveal], :scope > * > [data-reveal]').forEach((el, i) => {
      el.style.setProperty('--i', String(Math.min(i, 8)));
    });
  });
}

function setupDraw(root: ParentNode = document) {
  root.querySelectorAll<SVGElement>('[data-draw]').forEach((svg) => {
    svg.querySelectorAll<SVGGeometryElement>('path, line, polyline, circle.draw').forEach((p, i) => {
      try {
        const len = Math.ceil(p.getTotalLength());
        p.style.setProperty('--len', String(len));
        if (!p.style.getPropertyValue('--i')) p.style.setProperty('--i', String(i));
      } catch { /* not rendered */ }
    });
  });
}

const revealObserver = new IntersectionObserver(
  (entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      entry.target.classList.add('is-in');
      revealObserver.unobserve(entry.target);
    }
  },
  { rootMargin: '0px 0px -8% 0px', threshold: 0.12 },
);

/* -------------------------------------------------------------- counters */
function formatCount(el: HTMLElement, value: number) {
  const decimals = Number(el.dataset.decimals ?? 0);
  return `${el.dataset.prefix ?? ''}${value.toLocaleString('en-GB', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}${el.dataset.suffix ?? ''}`;
}
function runCounter(el: HTMLElement) {
  const target = Number(el.dataset.count);
  const out = el.querySelector<HTMLElement>('[data-count-value]') ?? el;
  const duration = 1600;
  const start = performance.now();
  const tick = (now: number) => {
    const t = Math.min(1, (now - start) / duration);
    const eased = 1 - Math.pow(1 - t, 4);
    out.textContent = formatCount(el, target * eased);
    if (t < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}
const counterObserver = new IntersectionObserver(
  (entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      runCounter(entry.target as HTMLElement);
      counterObserver.unobserve(entry.target);
    }
  },
  { threshold: 0.6 },
);

/* ------------------------------------------------------ pointer highlight */
function setupGlow() {
  if (!finePointer.matches || reduced.matches) return;
  document.addEventListener('pointermove', (e) => {
    const el = (e.target as Element)?.closest?.<HTMLElement>('[data-glow]');
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty('--mx', `${e.clientX - r.left}px`);
    el.style.setProperty('--my', `${e.clientY - r.top}px`);
  }, { passive: true });
}

/* -------------------------------------------------------------- parallax */
function setupParallax() {
  const els = [...document.querySelectorAll<HTMLElement>('[data-parallax]')];
  if (!els.length || reduced.matches) return;
  const visible = new Set<HTMLElement>();
  const io = new IntersectionObserver((entries) => entries.forEach((e) => (e.isIntersecting ? visible.add(e.target as HTMLElement) : visible.delete(e.target as HTMLElement))));
  els.forEach((el) => io.observe(el));
  let ticking = false;
  const update = () => {
    const vh = innerHeight;
    visible.forEach((el) => {
      const r = el.getBoundingClientRect();
      const progress = (r.top + r.height / 2 - vh / 2) / vh; // -1 … 1 around viewport centre
      el.style.transform = `translate3d(0, ${(progress * Number(el.dataset.parallax) * 100).toFixed(2)}px, 0)`;
    });
    ticking = false;
  };
  addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
  update();
}

/* ------------------------------------------------------- reading progress */
function setupProgress() {
  const bar = document.querySelector<HTMLElement>('[data-progress]');
  const target = document.querySelector<HTMLElement>('[data-progress-target]');
  if (!bar || !target) return;
  let ticking = false;
  const update = () => {
    const r = target.getBoundingClientRect();
    const total = r.height - innerHeight * 0.6;
    const p = Math.min(1, Math.max(0, -r.top / Math.max(total, 1)));
    bar.style.transform = `scaleX(${p})`;
    ticking = false;
  };
  addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
  update();
}

/* ------------------------------------------------- in-page section indicator */
function setupSectionNav() {
  document.querySelectorAll<HTMLElement>('[data-section-nav]').forEach((nav) => {
    const links = [...nav.querySelectorAll<HTMLAnchorElement>('a[href^="#"]')];
    const sections = links.map((a) => document.getElementById(a.hash.slice(1))).filter(Boolean) as HTMLElement[];
    const setActive = (id: string) => links.forEach((a) => (a.hash === `#${id}` ? a.setAttribute('aria-current', 'location') : a.removeAttribute('aria-current')));
    const io = new IntersectionObserver(
      (entries) => {
        const hit = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (hit) setActive(hit.target.id);
      },
      { rootMargin: '-35% 0px -55% 0px' },
    );
    sections.forEach((s) => io.observe(s));
  });
}

/* ------------------------------------ pause decorative loops when offscreen */
function setupPlayInView() {
  const io = new IntersectionObserver((entries) =>
    entries.forEach((e) => (e.target as HTMLElement).toggleAttribute('data-paused', !e.isIntersecting)),
  );
  document.querySelectorAll('[data-play-in-view]').forEach((el) => io.observe(el));
}

/* ------------------------------------------------------------------ init */
function init() {
  setupPlayInView();
  setupStagger();
  setupDraw();
  if (reduced.matches) {
    document.querySelectorAll('[data-reveal],[data-draw]').forEach((el) => el.classList.add('is-in'));
  } else {
    document.querySelectorAll('[data-reveal],[data-draw]').forEach((el) => revealObserver.observe(el));
    document.querySelectorAll<HTMLElement>('[data-count]').forEach((el) => {
      const out = el.querySelector<HTMLElement>('[data-count-value]') ?? el;
      out.textContent = formatCount(el, 0);
      counterObserver.observe(el);
    });
  }
  setupGlow();
  setupParallax();
  setupProgress();
  setupSectionNav();
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
else init();

export {};
