import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { CONFIG } from './config.js';

gsap.registerPlugin(ScrollTrigger);

export { gsap, ScrollTrigger };

export function q(selector, root = document) {
  return root.querySelector(selector);
}

export function qa(selector, root = document) {
  return Array.from(
    root.querySelectorAll(selector)
  );
}

export function getRoot() {
  return (
    document.querySelector(
      CONFIG.selectors.root
    ) ||
    document.body
  );
}

export function isMobile() {
  return (
    window.innerWidth <=
    CONFIG.breakpoints.mobile
  );
}

export function getPageId() {
  const explicit =
    document.querySelector(
      CONFIG.selectors.page
    );

  if (
    explicit &&
    explicit.dataset.motionPage
  ) {
    return explicit.dataset.motionPage;
  }

  const path =
    window.location.pathname
      .toLocaleLowerCase('tr-TR')
      .replace(/\/+$/, '');

  if (!path) {
    return 'home';
  }

  if (
    path.includes(
      'yapay-zeka-egitimi-2026'
    ) ||
    path.includes('/egitim')
  ) {
    return 'education';
  }

  if (
    path.includes('egitmen') ||
    path.includes('instructor')
  ) {
    return 'instructor';
  }

  if (
    path.includes('iletisim') ||
    path.includes('contact')
  ) {
    return 'contact';
  }

  if (
    path.includes('sss') ||
    path.includes('faq')
  ) {
    return 'faq';
  }

  return 'unknown';
}

export function refresh() {
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      ScrollTrigger.refresh(true);
    });
  });
}

export function log(...args) {
  if (CONFIG.debug) {
    console.log(
      '[Hunnes Motion]',
      ...args
    );
  }
}