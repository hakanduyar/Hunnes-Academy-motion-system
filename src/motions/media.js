import {
  mediaReveal,
} from './base.js';

export function mediaMotion({
  gsap,
  profile,
  element,
  trigger,
  x = 0,
}) {
  return mediaReveal(
    gsap,
    element,
    profile,
    {
      trigger,
      x,
    }
  );
}