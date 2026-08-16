import { CONFIG } from './config.js';

import {
  gsap,
  ScrollTrigger,
  log,
  refresh,
} from './core.js';

import { createRouter } from './router.js';

import { mountHome } from './pages/home.js';
import { mountEducation } from './pages/education.js';
import { mountInstructor } from './pages/instructor.js';
import { mountContact } from './pages/contact.js';
import { mountFaq } from './pages/faq.js';

const pages = {
  home: mountHome,
  education: mountEducation,
  instructor: mountInstructor,
  contact: mountContact,
  faq: mountFaq,
};

let context = null;
let pageCleanup = null;
let currentPage = null;
let destroyRouter = null;

function cleanup() {
  if (typeof pageCleanup === 'function') {
    pageCleanup();
    pageCleanup = null;
  }

  if (context) {
    context.revert();
    context = null;
  }
}

function mountRoute({
  page,
  root,
  reason,
}) {
  cleanup();

  currentPage = page;

  const mount = pages[page];

  context = gsap.context(() => {
    if (!mount) return;

    const result = mount({
      root,
      gsap,
      ScrollTrigger,
    });

    if (typeof result === 'function') {
      pageCleanup = result;
    }
  }, root);

  window.HunnesMotionSystem = {
    version: CONFIG.version,
    status: 'running',
    page,
    reason,
    gsap: gsap.version,
  };

  log(
    `mounted: ${page}`,
    `reason: ${reason}`
  );

  refresh();
}

function debug() {
  return {
    version: CONFIG.version,
    status: 'running',
    page: currentPage,
    path: location.pathname,
    triggers: ScrollTrigger.getAll().length,
  };
}

/*
 * GLOBAL API ROUTER'DAN ÖNCE OLUŞUYOR.
 */
window.HunnesMotion = {
  version: CONFIG.version,

  get page() {
    return currentPage;
  },

  refresh,
  debug,
};

window.HunnesMotionSystem = {
  version: CONFIG.version,
  status: 'booting',
  page: null,
  gsap: gsap.version,
};

function start() {
  if (destroyRouter) return;

  destroyRouter =
    createRouter(mountRoute);

  log('system ready');
}

if (document.readyState === 'loading') {
  document.addEventListener(
    'DOMContentLoaded',
    start,
    { once: true }
  );
} else {
  start();
}