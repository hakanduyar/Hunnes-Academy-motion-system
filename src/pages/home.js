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
  /*
   * ========================================
   * DEVICE / ACCESSIBILITY
   * ========================================
   */

  const mobile =
    window.matchMedia(
      '(max-width: 767px)'
    ).matches;

  const reduce =
    window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

  /*
   * Geliştirme sırasında:
   *
   * localStorage.setItem(
   *   'hunnes-motion-force',
   *   '1'
   * );
   *
   * ile reduced-motion override edilebilir.
   */
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


  /*
   * Kullanıcı reduced motion tercih etmişse
   * normal production davranışında
   * animasyon çalıştırma.
   *
   * forceMotion sadece bizim test
   * override'ımızdır.
   */
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
   * DOM DEBUG
   * ========================================
   */

  console.log(
    '[Hunnes Motion] home animations registering',
    {
      intro:
        root.querySelectorAll(
          '.hns-intro-title'
        ).length,

      training:
        root.querySelectorAll(
          '.hns-training-copy'
        ).length,

      benefits:
        root.querySelectorAll(
          '.hns-benefits-content__item'
        ).length,

      instructor:
        root.querySelectorAll(
          '.hns-instructor-content'
        ).length,

      testimonials:
        root.querySelectorAll(
          '.hns-testimonial'
        ).length,

      cta:
        root.querySelectorAll(
          '.hns-product-cta'
        ).length,
    }
  );


  /*
   * ========================================
   * INTRO
   * ========================================
   */

  const introTitle =
    root.querySelector(
      '.hns-intro-title'
    );

  const introCopy =
    root.querySelector(
      [
        '.hns-intro-content',
        '.hns-intro-copy',
        '.hns-intro-text',
      ].join(',')
    );


  if (
    introTitle ||
    introCopy
  ) {
    headingMotion({
      gsap,
      profile,

      title:
        introTitle,

      description:
        introCopy,

      trigger:
        introTitle ||
        introCopy,
    });
  }


  /*
   * ========================================
   * 3 VIDEO / TEXT SECTIONS
   * ========================================
   */

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
              'video, iframe'
            )
        );


      /*
       * Section bulunamazsa yalnızca
       * metni sade reveal ile çalıştır.
       */
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


  const benefitTitle =
    root.querySelector(
      [
        '.hns-benefits-content h2',
        '.hns-benefits-heading h2',
      ].join(',')
    );


  if (benefitTitle) {
    headingMotion({
      gsap,
      profile,

      title:
        benefitTitle,

      trigger:
        benefitTitle,
    });
  }


  if (
    benefitsGrid &&
    benefitItems.length
  ) {
    cardsMotion({
      gsap,
      profile,

      items:
        benefitItems,

      trigger:
        benefitsGrid,
    });
  }


  /*
   * ========================================
   * INSTRUCTOR
   * ========================================
   */

  const instructorLabel =
    root.querySelector(
      '.hns-instructor-content__label'
    );


  const instructorContent =
    root.querySelector(
      '.hns-instructor-content'
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


      if (image) {
        mediaMotion({
          gsap,
          profile,

          element:
            image,

          trigger:
            instructorSection,

          x:
            mobile
              ? 0
              : -18,
        });
      }


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
    } else {
      /*
       * Resimli parent bulunamazsa
       * içeriğin kendisini yine göster.
       */
      reveal(
        gsap,
        instructorContent,
        profile
      );
    }
  }


  /*
   * ========================================
   * TESTIMONIALS
   * ========================================
   */

  const testimonialList =
    root.querySelector(
      '.hns-testimonials__list'
    );


  if (testimonialList) {
    const testimonialItems =
      testimonialList
        .querySelectorAll(
          '.hns-testimonial'
        );


    if (
      testimonialItems.length
    ) {
      testimonialsMotion({
        gsap,
        profile,

        items:
          testimonialItems,

        trigger:
          testimonialList,
      });
    }
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


  if (cta) {
    ctaMotion({
      gsap,
      profile,
      element:
        cta,
    });
  }


  /*
   * ========================================
   * FINISHED
   * ========================================
   */

  console.log(
    '[Hunnes Motion] home registered'
  );
}