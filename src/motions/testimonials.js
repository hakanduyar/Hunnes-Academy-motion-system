import {
  createScene,
  fromState,
  toState,
} from './base.js';

export function testimonialsMotion({
  gsap,
  profile,
  mobile,
  items,
  trigger,
}) {
  const testimonials =
    Array.from(
      items || []
    ).filter(Boolean);

  if (!testimonials.length) {
    return null;
  }

  const {
    timeline,
    initial,
  } = createScene(
    gsap,
    trigger ||
      testimonials[0],
    profile,
    {
      start: 'top 90%',
    }
  );

  testimonials.forEach(
    (item, index) => {
      timeline.fromTo(
        item,

        fromState(
          initial,
          {
            y:
              mobile
                ? 9
                : 11,
          }
        ),

        toState(
          initial,
          {
            y: 0,

            duration:
              mobile
                ? 0.4
                : 0.48,

            clearProps:
              'transform,opacity,visibility',
          }
        ),

        index *
          (
            mobile
              ? 0.025
              : 0.04
          )
      );
    }
  );

  return timeline;
}