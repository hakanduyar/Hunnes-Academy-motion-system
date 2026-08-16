import {
  getPageId,
  getRoot,
  log,
} from './core.js';

export function createRouter(onRoute) {
  let timer = null;
  let mountedHref = '';

  function emit(reason) {
    clearTimeout(timer);

    timer = setTimeout(() => {
      const root = getRoot();

      if (!root) {
        emit(`${reason}:wait`);
        return;
      }

      mountedHref = location.href;

      const page = getPageId();

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

  function changed(reason) {
    emit(reason);

    /*
     * ikas DOM'u URL'den biraz sonra
     * değiştirirse ikinci kontrol.
     */
    setTimeout(() => {
      if (location.href !== mountedHref) {
        emit(`${reason}:settle`);
      }
    }, 350);
  }

  ['pushState', 'replaceState'].forEach((method) => {
    const original = history[method];

    history[method] = function (...args) {
      const result = original.apply(this, args);

      changed(method);

      return result;
    };
  });

  window.addEventListener('popstate', () => {
    changed('popstate');
  });

  document.addEventListener(
    'click',
    (event) => {
      const link = event.target.closest?.('a[href]');

      if (!link) return;
      if (link.target === '_blank') return;
      if (link.hasAttribute('download')) return;

      try {
        const url = new URL(link.href, location.href);

        if (url.origin !== location.origin) return;
        if (url.href === location.href) return;

        /*
         * ikas link tıklamasından sonra
         * URL/DOM'u değiştirsin, sonra kontrol et.
         */
        setTimeout(() => {
          if (location.href !== mountedHref) {
            emit('link');
          }
        }, 160);

        setTimeout(() => {
          if (location.href !== mountedHref) {
            emit('link:settle');
          }
        }, 450);
      } catch {
        /* ignore */
      }
    },
    true
  );

  emit('initial');

  return function destroyRouter() {
    clearTimeout(timer);
  };
}