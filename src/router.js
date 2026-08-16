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
    }, 140);
  }

  function routeChange(reason) {
    routePending = true;

    schedule(reason);

    /*
      ikas yeni DOM'u URL değişiminden
      biraz sonra basarsa ikinci güvenlik kontrolü.
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

  ['pushState', 'replaceState'].forEach((method) => {
    const original = history[method];

    history[method] = function (...args) {
      const result = original.apply(this, args);

      routeChange(method);

      return result;
    };
  });

  window.addEventListener('popstate', () => {
    routeChange('popstate');
  });

  /*
    Aynı domain içindeki linkleri de izliyoruz.
    SPA router'ın nasıl çalıştığından bağımsız
    ekstra güvenlik sağlar.
  */
  document.addEventListener(
    'click',
    (event) => {
      const link = event.target.closest?.('a[href]');

      if (!link) return;
      if (link.target === '_blank') return;
      if (link.hasAttribute('download')) return;

      try {
        const url = new URL(
          link.href,
          location.href
        );

        if (url.origin !== location.origin) return;
        if (url.href === location.href) return;

        routePending = true;

        setTimeout(() => {
          if (
            location.href !== mountedHref ||
            getRoot() !== mountedRoot
          ) {
            schedule('link');
          }
        }, 80);
      } catch {
        // geçersiz URL ise görmezden gel
      }
    },
    true
  );

  /*
    Sadece DOM node ekleme/çıkarma izleniyor.
    GSAP'ın style değişiklikleri bunu tetiklemez.
  */
  const observer = new MutationObserver(() => {
    const root = getRoot();

    if (
      routePending ||
      location.href !== mountedHref ||
      root !== mountedRoot
    ) {
      schedule('dom');
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });

  schedule('initial');

  return function destroyRouter() {
    clearTimeout(timer);
    observer.disconnect();
  };
}