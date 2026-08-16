import {
  createScene,
  fromState,
  toState,
} from './base.js';

export function mediaMotion({
  gsap,
  profile,
  mobile,
  element,
  trigger,
  x = 0,
}) {
  if (!element) return null;

  const {
    timeline,
    initial,
  } = createScene(
    gsap,
    trigger || element,
    profile,
    {
      start: 'top 90%',
    }
  );

  timeline.fromTo(
    element,

    fromState(
      initial,
      {
        x:
          mobile
            ? 0
            : x,

        y:
          mobile
            ? 8
            : 5,

        scale:
          mobile
            ? 1.018
            : 1.032,

        clipPath:
          mobile
            ? 'inset(2% 0% 2% 0%)'
            : 'inset(3% 0% 3% 0%)',
      }
    ),

    toState(
      initial,
      {
        x: 0,
        y: 0,
        scale: 1,

        clipPath:
          'inset(0% 0% 0% 0%)',

        duration:
          mobile
            ? 0.56
            : 0.72,

        ease:
          'power3.out',

        clearProps:
          'transform,opacity,visibility,clipPath',
      }
    ),

    0
  );

  return timeline;
}