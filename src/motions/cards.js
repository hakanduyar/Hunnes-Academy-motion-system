import {
  revealGroup,
} from './base.js';

export function cardsMotion({
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
        profile.distance + 4,

      scale: 0.982,
    }
  );
}