import {
  createScene,
  fromState,
  toState,
} from './base.js';

export function splitMotion({
  gsap,
  profile,
  mobile,
  section,
  media,
  content,
  reverse = false,
}) {
  if (
    !section ||
    (!media && !content)
  ) {
    return null;
  }

  const {
    timeline,
    initial,
  } = createScene(
    gsap,
    section,
    profile,
    {
      start: 'top 88%',
    }
  );

  if (media) {
    timeline.fromTo(
      media,

      fromState(
        initial,
        {
          x:
            mobile
              ? 0
              : reverse
                ? 14
                : -14,

          y:
            mobile
              ? 7
              : 3,

          scale:
            mobile
              ? 1.018
              : 1.03,

          clipPath:
            'inset(3% 0% 3% 0%)',
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
  }

  if (content) {
    timeline.fromTo(
      content,

      fromState(
        initial,
        {
          x:
            mobile
              ? 0
              : reverse
                ? -16
                : 16,

          y:
            mobile
              ? 12
              : 4,
        }
      ),

      toState(
        initial,
        {
          x: 0,
          y: 0,

          duration:
            mobile
              ? 0.45
              : 0.58,

          ease:
            'power3.out',

          clearProps:
            'transform,opacity,visibility',
        }
      ),

      media
        ? mobile
          ? 0.08
          : 0.075
        : 0
    );
  }

  return timeline;
}