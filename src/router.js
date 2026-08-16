import {
  getPageId,
  getRoot,
  log,
} from './core.js';

export function createRouter(onRoute) {
  let timer = null;

  let mountedHref = '';
  let mountedRoot = null;

  let routePending = false;

  function schedule(reason) {
    clearTimeout(timer);

    routePending = true;

    timer = setTimeout(() => {
      const root = getRoot();

      if (!root) {
        schedule(`${reason}:wait-root`);
        return;
      }

      const href = location.href;
      const page = getPageId();

      mountedHref = href;
      mountedRoot = root;
      routePending = false;

      log('route', {
        page,
        reason,
        path: location.pathname,
      });

      onRoute({
        page,
        root,
        reason,
      });
    }, 120);
  }

  function routeChange(reason) {
    routePending = true;

    schedule(reason);

    /*
     * ikas URL'yi değiştirip yeni DOM'u
     * biraz sonra oluşturursa tekrar kontrol et.
     */
    setTimeout(() => {
      if (
        location.href !== mountedHref ||
        getRoot() !== mountedRoot
      ) {
        schedule(`${reason}:settle`);
      }
    }, 350);
  }

  ['pushState', 'replaceState']
    .forEach((method) => {
      const original = history[method];

      history[method] = function (...args) {
        const result =
          original.apply(this, args);

        routeChange(method);

        return result;
      };
    });

  window.addEventListener(
    'popstate',
    () => {
      routeChange('popstate');
    }
  );

  document.addEventListener(
    'click',
    (event) => {
      const link =
        event.target.closest?.('a[href]');

      if (!link) return;
      if (link.target === '_blank') return;
      if (link.hasAttribute('download')) return;

      try {
        const url = new URL(
          link.href,
          location.href
        );

        if (
          url.origin !== location.origin
        ) {
          return;
        }

        if (
          url.href === location.href
        ) {
          return;
        }

        routePending = true;

        setTimeout(() => {
          if (
            location.href !== mountedHref ||
            getRoot() !== mountedRoot
          ) {
            schedule('link');
          }
        }, 100);
      } catch {
        /* ignore */
      }
    },
    true
  );

  const observer =
    new MutationObserver(() => {
      const root = getRoot();

      if (
        routePending ||
        location.href !== mountedHref ||
        root !== mountedRoot
      ) {
        schedule('dom');
      }
    });

  observer.observe(
    document.documentElement,
    {
      childList: true,
      subtree: true,
    }
  );

  schedule('initial');

  return function destroyRouter() {
    clearTimeout(timer);
    observer.disconnect();
  };
}