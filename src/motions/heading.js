import {
  createScene,
  fromState,
  toState,
} from './base.js';

export function headingMotion({
  gsap,
  profile,
  mobile,
  label,
  title,
  description,
  trigger,
}) {
  const anchor =
    trigger ||
    title ||
    label ||
    description;

  if (!anchor) return null;

  const {
    timeline,
    initial,
  } = createScene(
    gsap,
    anchor,
    profile
  );

  const distance =
    mobile ? 11 : 15;

  if (label) {
    timeline.fromTo(
      label,

      fromState(
        initial,
        {
          y: distance * 0.65,
        }
      ),

      toState(
        initial,
        {
          y: 0,
          duration:
            mobile
              ? 0.38
              : 0.46,

          clearProps:
            'transform,opacity,visibility',
        }
      ),

      0
    );
  }

  if (title) {
    timeline.fromTo(
      title,

      fromState(
        initial,
        {
          y: distance,
        }
      ),

      toState(
        initial,
        {
          y: 0,

          duration:
            mobile
              ? 0.46
              : 0.58,

          clearProps:
            'transform,opacity,visibility',
        }
      ),

      label
        ? 0.055
        : 0
    );
  }

  if (description) {
    timeline.fromTo(
      description,

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
              ? 0.42
              : 0.52,

          clearProps:
            'transform,opacity,visibility',
        }
      ),

      title
        ? 0.115
        : 0.06
    );
  }

  return timeline;
}