export const CONFIG = {
version: '0.2.3',
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
      mediaDuration: 0.76,
      distance: 20,
      stagger: 0.055,
      start: 'top 88%',
      mediaScale: 1.035,
    },

    mobile: {
      duration: 0.46,
      mediaDuration: 0.56,
      distance: 14,
      stagger: 0.025,
      start: 'top 91%',
      mediaScale: 1.02,
    },

    ease: 'power3.out',
  },
};