import {
  revealGroup,
} from './base.js';

export function testimonialsMotion({
  gsap,
  profile,
  items,
  trigger,
}) {
  return revealGroup(
    gsap,
    items,
    profile,
    {
      trigger,
      y:
        profile.distance,

      scale: 0.99,

      stagger:
        profile.stagger * 0.8,
    }
  );
}