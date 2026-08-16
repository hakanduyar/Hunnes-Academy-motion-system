import { CONFIG } from '../config.js';

export function getProfile(mobile) {
  return mobile
    ? CONFIG.motion.mobile
    : CONFIG.motion.desktop;
}

function initialViewport(element) {
  if (!element) return false;

  const rect =
    element.getBoundingClientRect();

  return (
    rect.bottom > 0 &&
    rect.top < window.innerHeight * 0.94
  );
}

function triggerConfig(
  element,
  profile,
  start
) {
  return {
    trigger: element,
    start: start || profile.start,
    once: true,
    fastScrollEnd: true,
    preventOverlaps: 'hunnes-motion',
  };
}

export function reveal(
  gsap,
  element,
  profile,
  options = {}
) {
  if (!element) return;

  const y =
    options.y ?? profile.distance;

  const x =
    options.x ?? 0;

  const scale =
    options.scale ?? 0.99;

  const duration =
    options.duration ??
    profile.duration;

  const delay =
    options.delay ?? 0;

  const trigger =
    options.trigger || element;

  const from = {
    y,
    x,
    scale,
  };

  const to = {
    y: 0,
    x: 0,
    scale: 1,

    duration,
    delay,

    ease:
      options.ease ||
      CONFIG.motion.ease,

    clearProps:
      'transform,opacity,visibility',
  };

  /*
   * İlk viewport:
   * opacity 0 YOK.
   */
  if (!initialViewport(element)) {
    from.autoAlpha = 0;

    to.autoAlpha = 1;

    to.scrollTrigger =
      triggerConfig(
        trigger,
        profile,
        options.start
      );
  }

  return gsap.fromTo(
    element,
    from,
    to
  );
}

export function revealGroup(
  gsap,
  elements,
  profile,
  options = {}
) {
  const items =
    Array.from(elements || [])
      .filter(Boolean);

  if (!items.length) return;

  const trigger =
    options.trigger ||
    items[0].parentElement ||
    items[0];

  const from = {
    y:
      options.y ??
      profile.distance,

    x:
      options.x ?? 0,

    scale:
      options.scale ?? 0.985,
  };

  const to = {
    y: 0,
    x: 0,
    scale: 1,

    duration:
      options.duration ??
      profile.duration,

    stagger:
      options.stagger ??
      profile.stagger,

    ease:
      options.ease ||
      CONFIG.motion.ease,

    clearProps:
      'transform,opacity,visibility',
  };

  if (!initialViewport(trigger)) {
    from.autoAlpha = 0;

    to.autoAlpha = 1;

    to.scrollTrigger =
      triggerConfig(
        trigger,
        profile,
        options.start
      );
  }

  return gsap.fromTo(
    items,
    from,
    to
  );
}

export function mediaReveal(
  gsap,
  element,
  profile,
  options = {}
) {
  if (!element) return;

  const trigger =
    options.trigger || element;

  const from = {
    y:
      options.y ??
      Math.round(
        profile.distance * 0.7
      ),

    x:
      options.x ?? 0,

    scale:
      options.scale ??
      profile.mediaScale,

    clipPath:
      'inset(3% 1% 3% 1% round 12px)',
  };

  const to = {
    y: 0,
    x: 0,
    scale: 1,

    clipPath:
      'inset(0% 0% 0% 0% round 0px)',

    duration:
      options.duration ??
      profile.mediaDuration,

    ease: 'power3.out',

    clearProps:
      'transform,opacity,visibility,clipPath',
  };

  if (!initialViewport(element)) {
    from.autoAlpha = 0;
    to.autoAlpha = 1;

    to.scrollTrigger =
      triggerConfig(
        trigger,
        profile,
        options.start
      );
  }

  return gsap.fromTo(
    element,
    from,
    to
  );
}