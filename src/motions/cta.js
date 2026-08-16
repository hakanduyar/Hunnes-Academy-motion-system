import {
  createScene,
  fromState,
  toState,
} from './base.js';

export function ctaMotion({
  gsap,
  profile,
  mobile,
  element,
}) {
  if (!element) return null;

  const {
    timeline,
    initial,
  } = createScene(
    gsap,
    element,
    profile,
    {
      start: 'top 91%',
    }
  );

  timeline.fromTo(
    element,

    fromState(
      initial,
      {
        y:
          mobile
            ? 11
            : 15,

        scale:
          mobile
            ? 0.997
            : 0.993,
      }
    ),

    toState(
      initial,
      {
        y: 0,
        scale: 1,

        duration:
          mobile
            ? 0.48
            : 0.62,

        ease:
          'power3.out',

        clearProps:
          'transform,opacity,visibility',
      }
    ),

    0
  );

  return timeline;
}