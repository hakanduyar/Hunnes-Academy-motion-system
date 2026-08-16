import { CONFIG } from '../config.js';

export function getProfile(mobile) {
  return mobile
    ? CONFIG.motion.mobile
    : CONFIG.motion.desktop;
}

export function isInitialViewport(element) {
  if (!element) return false;

  const rect =
    element.getBoundingClientRect();

  return (
    rect.bottom > 0 &&
    rect.top < window.innerHeight * 0.94
  );
}

export function createScene(
  gsap,
  trigger,
  profile,
  options = {}
) {
  if (!trigger) {
    return {
      timeline: gsap.timeline(),
      initial: true,
    };
  }

  const initial =
    isInitialViewport(trigger);

  const vars = {
    defaults: {
      ease:
        options.ease ||
        CONFIG.motion.ease,
    },
  };

  if (!initial) {
    vars.scrollTrigger = {
      trigger,
      start:
        options.start ||
        profile.start,

      once: true,

      invalidateOnRefresh: true,

      fastScrollEnd: true,
    };
  }

  return {
    timeline:
      gsap.timeline(vars),

    initial,
  };
}

export function fromState(
  initial,
  vars = {}
) {
  const state = {
    ...vars,
  };

  /*
   * İlk ekrandaki içerik:
   * opacity: 0 YOK.
   */
  if (!initial) {
    state.autoAlpha = 0;
  }

  return state;
}

export function toState(
  initial,
  vars = {}
) {
  const state = {
    ...vars,
  };

  if (!initial) {
    state.autoAlpha = 1;
  }

  return state;
}

export function reveal(
  gsap,
  element,
  profile,
  options = {}
) {
  if (!element) return null;

  const {
    timeline,
    initial,
  } = createScene(
    gsap,
    options.trigger || element,
    profile,
    options
  );

  timeline.fromTo(
    element,

    fromState(
      initial,
      {
        y:
          options.y ??
          profile.distance,

        x:
          options.x ?? 0,

        scale:
          options.scale ?? 1,
      }
    ),

    toState(
      initial,
      {
        y: 0,
        x: 0,
        scale: 1,

        duration:
          options.duration ??
          profile.duration,

        clearProps:
          'transform,opacity,visibility',
      }
    ),

    0
  );

  return timeline;
}