import {
  reveal,
} from './base.js';

export function ctaMotion({
  gsap,
  profile,
  element,
}) {
  return reveal(
    gsap,
    element,
    profile,
    {
      y:
        profile.distance + 4,

      scale: 0.987,

      duration:
        profile.duration + 0.08,

      start: 'top 90%',
    }
  );
}