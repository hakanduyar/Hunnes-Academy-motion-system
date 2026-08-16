import {
  createScene,
  fromState,
  toState,
} from './base.js';

export function cardsMotion({
  gsap,
  profile,
  mobile,
  items,
  trigger,
}) {
  const cards =
    Array.from(
      items || []
    ).filter(Boolean);

  if (!cards.length) {
    return null;
  }

  const {
    timeline,
    initial,
  } = createScene(
    gsap,
    trigger ||
      cards[0],
    profile,
    {
      start: 'top 89%',
    }
  );

  cards.forEach(
    (card, index) => {
      let position;

      if (mobile) {
        position =
          index * 0.035;
      } else {
        const row =
          Math.floor(
            index / 2
          );

        const column =
          index % 2;

        position =
          row * 0.085 +
          column * 0.04;
      }

      timeline.fromTo(
        card,

        fromState(
          initial,
          {
            y:
              mobile
                ? 12
                : 16,

            scale:
              mobile
                ? 1
                : 0.994,
          }
        ),

        toState(
          initial,
          {
            y: 0,
            scale: 1,

            duration:
              mobile
                ? 0.42
                : 0.52,

            clearProps:
              'transform,opacity,visibility',
          }
        ),

        position
      );
    }
  );

  return timeline;
}