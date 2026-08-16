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
  max = 8
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
  const mobile =
    window.matchMedia(
      '(max-width: 767px)'
    ).matches;

  const reduce =
    window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

  const forceMotion =
    localStorage.getItem(
      'hunnes-motion-force'
    ) === '1';

  console.log(
    '[Hunnes Motion] home setup',
    {
      mobile,
      reduce,
      forceMotion,
    }
  );

  if (
    reduce &&
    !forceMotion
  ) {
    console.log(
      '[Hunnes Motion] motion skipped: reduced motion'
    );

    return;
  }

  const profile =
    getProfile(mobile);


  /*
   * ========================================
   * INTRO — EDITORIAL
   * ========================================
   */

  const introLabel =
    root.querySelector(
      [
        '.hns-intro-label',
        '.hns-intro-eyebrow',
        '.hns-intro-kicker',
      ].join(',')
    );

  const introTitle =
    root.querySelector(
      '.hns-intro-title'
    );

  const introDescription =
    root.querySelector(
      [
        '.hns-intro-content',
        '.hns-intro-copy',
        '.hns-intro-text',
      ].join(',')
    );

  headingMotion({
    gsap,
    profile,
    mobile,

    label:
      introLabel,

    title:
      introTitle,

    description:
      introDescription,

    trigger:
      introTitle ||
      introDescription,
  });


  /*
   * ========================================
   * TRAINING / VIDEO SECTIONS
   * ========================================
   */

  const trainingCopies =
    Array.from(
      root.querySelectorAll(
        '.hns-training-copy'
      )
    );

  trainingCopies.forEach(
    (copy, index) => {
      const section =
        findAncestor(
          copy,

          (element) =>
            !!element.querySelector(
              'video, iframe'
            )
        );

      if (!section) {
        reveal(
          gsap,
          copy,
          profile,
          {
            y:
              mobile
                ? 12
                : 16,
          }
        );

        return;
      }

      const media =
        section.querySelector(
          'video, iframe'
        );

      splitMotion({
        gsap,
        profile,
        mobile,

        section,
        media,

        content:
          copy,

        reverse:
          index % 2 === 1,
      });
    }
  );


  /*
   * ========================================
   * BENEFITS
   * ========================================
   */

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

  const benefitsLabel =
    root.querySelector(
      [
        '.hns-benefits-heading__label',
        '.hns-benefits-content__label',
      ].join(',')
    );

  const benefitsTitle =
    root.querySelector(
      [
        '.hns-benefits-content h2',
        '.hns-benefits-heading h2',
      ].join(',')
    );

  const benefitsDescription =
    root.querySelector(
      [
        '.hns-benefits-heading p',
        '.hns-benefits-content > p',
      ].join(',')
    );

  if (
    benefitsLabel ||
    benefitsTitle ||
    benefitsDescription
  ) {
    headingMotion({
      gsap,
      profile,
      mobile,

      label:
        benefitsLabel,

      title:
        benefitsTitle,

      description:
        benefitsDescription,

      trigger:
        benefitsTitle ||
        benefitsGrid,
    });
  }

  cardsMotion({
    gsap,
    profile,
    mobile,

    items:
      benefitItems,

    trigger:
      benefitsGrid,
  });


  /*
   * ========================================
   * INSTRUCTOR
   * ========================================
   */

  const instructorContent =
    root.querySelector(
      '.hns-instructor-content'
    );

  const instructorLabel =
    root.querySelector(
      '.hns-instructor-content__label'
    );

  const instructorAnchor =
    instructorLabel ||
    instructorContent;

  if (instructorAnchor) {
    const instructorSection =
      findAncestor(
        instructorAnchor,

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
        mobile,

        element:
          image,

        trigger:
          instructorSection,

        x:
          mobile
            ? 0
            : -14,
      });

      if (content) {
        headingMotion({
          gsap,
          profile,
          mobile,

          label:
            content.querySelector(
              '.hns-instructor-content__label'
            ),

          title:
            content.querySelector(
              'h2, h3'
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


  /*
   * ========================================
   * TESTIMONIALS HEADING
   * ========================================
   */

  const testimonialHeading =
    root.querySelector(
      '.hns-testimonials-heading'
    );

  if (testimonialHeading) {
    headingMotion({
      gsap,
      profile,
      mobile,

      label:
        testimonialHeading.querySelector(
          '.hns-testimonials-heading__label'
        ),

      title:
        testimonialHeading.querySelector(
          'h2'
        ),

      description:
        testimonialHeading.querySelector(
          'p'
        ),

      trigger:
        testimonialHeading,
    });
  }


  /*
   * ========================================
   * TESTIMONIAL CARDS
   * ========================================
   */

  const testimonialList =
    root.querySelector(
      '.hns-testimonials__list'
    );

  if (testimonialList) {
    testimonialsMotion({
      gsap,
      profile,
      mobile,

      items:
        testimonialList
          .querySelectorAll(
            '.hns-testimonial'
          ),

      trigger:
        testimonialList,
    });
  }


  /*
   * ========================================
   * NEW SEASON CTA
   * ========================================
   */

  const cta =
    root.querySelector(
      '.hns-product-cta'
    );

  ctaMotion({
    gsap,
    profile,
    mobile,
    element:
      cta,
  });


  console.log(
    '[Hunnes Motion] premium home registered'
  );
}