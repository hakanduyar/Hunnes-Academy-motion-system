import {
  getProfile,
  reveal,
} from '../motions/base.js';

import {
  headingMotion,
} from '../motions/heading.js';

import {
  cardsMotion,
} from '../motions/cards.js';

import {
  splitMotion,
} from '../motions/split.js';

import {
  mediaMotion,
} from '../motions/media.js';

import {
  testimonialsMotion,
} from '../motions/testimonials.js';

import {
  ctaMotion,
} from '../motions/cta.js';

function findAncestor(
  element,
  test,
  max = 7
) {
  let current = element;

  while (
    current &&
    current !== document.body &&
    max--
  ) {
    if (test(current)) {
      return current;
    }

    current =
      current.parentElement;
  }

  return null;
}

export function mountHome({
  root,
  gsap,
}) {
  const mm =
    gsap.matchMedia();

  mm.add(
    {
      mobile:
        '(max-width: 767px)',

      desktop:
        '(min-width: 768px)',

      reduce:
        '(prefers-reduced-motion: reduce)',
    },

    (context) => {
      const {
        mobile,
        reduce,
      } = context.conditions;

      const forceMotion =
  localStorage.getItem('hunnes-motion-force') === '1';

if (reduce && !forceMotion) {
  return;
}

      const profile =
        getProfile(mobile);


      /* =========================
         INTRO
      ========================= */

      const introTitle =
        root.querySelector(
          '.hns-intro-title'
        );

      const introCopy =
        root.querySelector(
          '.hns-intro-content,' +
          '.hns-intro-copy,' +
          '.hns-intro-text'
        );

      headingMotion({
        gsap,
        profile,
        title: introTitle,
        description: introCopy,
        trigger:
          introTitle || introCopy,
      });


      /* =========================
         3 VIDEO / TEXT SECTIONS
      ========================= */

      const copies =
        Array.from(
          root.querySelectorAll(
            '.hns-training-copy'
          )
        );

      copies.forEach(
        (copy, index) => {
          const section =
            findAncestor(
              copy,
              (element) =>
                !!element.querySelector(
                  'video,iframe'
                )
            );

          if (!section) {
            reveal(
              gsap,
              copy,
              profile
            );

            return;
          }

          const media =
            section.querySelector(
              'video,iframe'
            );

          splitMotion({
            gsap,
            profile,
            mobile,
            section,
            media,
            content: copy,
            reverse:
              index % 2 === 1,
          });
        }
      );


      /* =========================
         BENEFITS
      ========================= */

      const benefitsGrid =
        root.querySelector(
          '.hns-benefits-content__grid'
        );

      const benefitItems =
        benefitsGrid
          ? benefitsGrid.querySelectorAll(
              '.hns-benefits-content__item'
            )
          : [];

      const benefitTitle =
        root.querySelector(
          '.hns-benefits-content h2,' +
          '.hns-benefits-heading h2'
        );

      if (benefitTitle) {
        headingMotion({
          gsap,
          profile,
          title: benefitTitle,
          trigger: benefitTitle,
        });
      }

      cardsMotion({
        gsap,
        profile,
        items: benefitItems,
        trigger: benefitsGrid,
      });


      /* =========================
         INSTRUCTOR
      ========================= */

      const instructorLabel =
        root.querySelector(
          '.hns-instructor-content__label'
        );

      if (instructorLabel) {
        const instructorSection =
          findAncestor(
            instructorLabel,
            (element) =>
              !!element.querySelector(
                'img'
              )
          );

        if (instructorSection) {
          const image =
            instructorSection
              .querySelector('img');

          const content =
            instructorSection
              .querySelector(
                '.hns-instructor-content'
              );

          mediaMotion({
            gsap,
            profile,
            element: image,
            trigger:
              instructorSection,

            x:
              mobile
                ? 0
                : -18,
          });

          if (content) {
            headingMotion({
              gsap,
              profile,

              label:
                content.querySelector(
                  '.hns-instructor-content__label'
                ),

              title:
                content.querySelector(
                  'h2,h3'
                ),

              description:
                content.querySelector(
                  'p'
                ),

              trigger:
                instructorSection,
            });
          }
        }
      }


      /* =========================
         TESTIMONIALS
      ========================= */

      const testimonialList =
        root.querySelector(
          '.hns-testimonials__list'
        );

      if (testimonialList) {
        testimonialsMotion({
          gsap,
          profile,

          items:
            testimonialList
              .querySelectorAll(
                '.hns-testimonial'
              ),

          trigger:
            testimonialList,
        });
      }


      /* =========================
         NEW SEASON / CTA
      ========================= */

      const cta =
        root.querySelector(
          '.hns-product-cta'
        );

      ctaMotion({
        gsap,
        profile,
        element: cta,
      });
    }
  );

  return () => {
    mm.revert();
  };
}