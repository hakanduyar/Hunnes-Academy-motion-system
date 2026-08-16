export const CONFIG = {
  version: '0.1.0',

  debug: true,

  selectors: {
    root: 'main,[role="main"]',
    page: '[data-motion-page]',
  },

  breakpoints: {
    mobile: 767,
  },

  motion: {
    desktop: {
      duration: 0.62,
      distance: 20,
      stagger: 0.05,
    },

    mobile: {
      duration: 0.46,
      distance: 14,
      stagger: 0.025,
    },

    ease: 'power3.out',
  },
};