import {
  revealGroup,
} from './base.js';

export function headingMotion({
  gsap,
  profile,
  label,
  title,
  description,
  trigger,
}) {
  const elements = [
    label,
    title,
    description,
  ].filter(Boolean);

  if (!elements.length) return;

  return revealGroup(
    gsap,
    elements,
    profile,
    {
      trigger:
        trigger ||
        title ||
        elements[0],

      y:
        profile.distance,

      scale: 0.995,

      stagger:
        profile.stagger * 0.85,
    }
  );
}