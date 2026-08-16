import {
  getPageId,
  getRoot,
  log,
} from './core.js';

const READY_SELECTORS = {
  home: '.hns-intro-title',
  education: '.hunnes-edu-hero',
};

export function createRouter(onRoute) {
  let timer = null;
  let readinessTimer = null;
  let mountedHref = '';

  function waitForPageReady(
    page,
    callback,
    attempt = 0
  ) {
    clearTimeout(readinessTimer);

    const selector =
      READY_SELECTORS[page];

    /*
     * Henüz özel selector tanımlamadığımız
     * sayfalarda beklemiyoruz.
     */
    if (!selector) {
      callback();
      return;
    }

    const element =
      document.querySelector(selector);

    if (element) {
      callback();
      return;
    }

    /*
     * Maksimum yaklaşık 4 saniye bekle.
     */
    if (attempt >= 80) {
      log(
        'page ready timeout',
        {
          page,
          selector,
        }
      );

      callback();
      return;
    }

    readinessTimer =
      setTimeout(() => {
        waitForPageReady(
          page,
          callback,
          attempt + 1
        );
      }, 50);
  }

  function emit(reason) {
    clearTimeout(timer);
    clearTimeout(readinessTimer);

    timer = setTimeout(() => {
      const page = getPageId();

      waitForPageReady(
        page,
        () => {
          const root = getRoot();

          if (!root) {
            emit(`${reason}:wait-root`);
            return;
          }

          mountedHref =
            location.href;

          log('route', {
            page,
            reason,
            path:
              location.pathname,
          });

          onRoute({
            page,
            root,
            reason,
          });
        }
      );
    }, 80);
  }

  function changed(reason) {
    emit(reason);

    /*
     * ikas SPA geçişlerinde ikinci
     * güvenlik kontrolü.
     */
    setTimeout(() => {
      if (
        location.href !== mountedHref
      ) {
        emit(
          `${reason}:settle`
        );
      }
    }, 450);
  }

  [
    'pushState',
    'replaceState',
  ].forEach((method) => {
    const original =
      history[method];

    history[method] =
      function (...args) {
        const result =
          original.apply(
            this,
            args
          );

        changed(method);

        return result;
      };
  });

  window.addEventListener(
    'popstate',
    () => {
      changed('popstate');
    }
  );

  document.addEventListener(
    'click',
    (event) => {
      const link =
        event.target.closest?.(
          'a[href]'
        );

      if (!link) return;

      if (
        link.target === '_blank'
      ) {
        return;
      }

      if (
        link.hasAttribute(
          'download'
        )
      ) {
        return;
      }

      try {
        const url =
          new URL(
            link.href,
            location.href
          );

        if (
          url.origin !==
          location.origin
        ) {
          return;
        }

        if (
          url.href ===
          location.href
        ) {
          return;
        }

        setTimeout(() => {
          if (
            location.href !==
            mountedHref
          ) {
            emit('link');
          }
        }, 160);
      } catch {
        /* ignore */
      }
    },
    true
  );

  emit('initial');

  return function destroyRouter() {
    clearTimeout(timer);
    clearTimeout(readinessTimer);
  };
}