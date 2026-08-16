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

    const cleanupFunction = mount({
      root,
      gsap,
      ScrollTrigger,
    });

    if (
      typeof cleanupFunction === 'function'
    ) {
      pageCleanup = cleanupFunction;
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

function start() {
  if (destroyRouter) return;

  destroyRouter =
    createRouter(mountRoute);

  window.HunnesMotion = {
    version: CONFIG.version,

    get page() {
      return currentPage;
    },

    refresh,

    debug() {
      return {
        version: CONFIG.version,
        page: currentPage,
        path: location.pathname,
        triggers:
          ScrollTrigger.getAll().length,
      };
    },
  };

  log('system ready');
}

/*
 * Kritik:
 * document.body oluşmadan router başlatma.
 */
if (document.readyState === 'loading') {
  document.addEventListener(
    'DOMContentLoaded',
    start,
    { once: true }
  );
} else {
  start();
}