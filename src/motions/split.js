import {
  reveal,
  mediaReveal,
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
  if (mobile) {
    mediaReveal(
      gsap,
      media,
      profile,
      {
        trigger: section,
      }
    );

    reveal(
      gsap,
      content,
      profile,
      {
        trigger: section,
        y: 14,
      }
    );

    return;
  }

  const mediaX =
    reverse ? 20 : -20;

  const contentX =
    reverse ? -18 : 18;

  mediaReveal(
    gsap,
    media,
    profile,
    {
      trigger: section,
      x: mediaX,
    }
  );

  reveal(
    gsap,
    content,
    profile,
    {
      trigger: section,
      x: contentX,
      y: 6,
    }
  );
}