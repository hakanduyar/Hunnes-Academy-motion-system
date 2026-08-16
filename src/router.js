import {
  getPageId,
  getRoot,
  log,
} from './core.js';

const PAGE_READY = {
  home() {
    return (
      document.querySelectorAll(
        '.hns-intro-title'
      ).length >= 1 &&

      document.querySelectorAll(
        '.hns-training-copy'
      ).length >= 3 &&

      document.querySelectorAll(
        '.hns-benefits-content__item'
      ).length >= 4 &&

      document.querySelectorAll(
        '.hns-instructor-content'
      ).length >= 1 &&

      document.querySelectorAll(
        '.hns-testimonial'
      ).length >= 4 &&

      document.querySelectorAll(
        '.hns-product-cta'
      ).length >= 1
    );
  },

  education() {
    return (
      document.querySelector(
        '.hunnes-edu-hero'
      ) !== null
    );
  },
};

export function createRouter(onRoute) {
  let routeTimer = null;
  let readyTimer = null;

  let mountedHref = '';

  /*
   * Aynı DOM'un birkaç kontrol boyunca
   * sabit kaldığını doğruluyoruz.
   */
  function getPageSignature(page) {
    if (page === 'home') {
      return [
        document.querySelector(
          '.hns-intro-title'
        ),

        ...document.querySelectorAll(
          '.hns-training-copy'
        ),

        ...document.querySelectorAll(
          '.hns-benefits-content__item'
        ),

        document.querySelector(
          '.hns-instructor-content'
        ),

        ...document.querySelectorAll(
          '.hns-testimonial'
        ),

        document.querySelector(
          '.hns-product-cta'
        ),
      ];
    }

    if (page === 'education') {
      return [
        document.querySelector(
          '.hunnes-edu-hero'
        ),
      ];
    }

    return [];
  }

  function sameSignature(a, b) {
    if (!a || !b) return false;

    if (a.length !== b.length) {
      return false;
    }

    return a.every(
      (node, index) =>
        node === b[index]
    );
  }

  function waitForStablePage(
    page,
    callback
  ) {
    clearTimeout(readyTimer);

    const readyCheck =
      PAGE_READY[page];

    /*
     * Henüz özel readiness tanımlamadığımız
     * sayfalarda direkt devam et.
     */
    if (!readyCheck) {
      callback();
      return;
    }

    let attempts = 0;
    let stableChecks = 0;
    let previousSignature = null;

    function check() {
      attempts += 1;

      if (!readyCheck()) {
        stableChecks = 0;
        previousSignature = null;

        if (attempts >= 100) {
          log(
            'page ready timeout',
            { page }
          );

          callback();
          return;
        }

        readyTimer =
          setTimeout(check, 50);

        return;
      }

      const signature =
        getPageSignature(page);

      if (
        sameSignature(
          signature,
          previousSignature
        )
      ) {
        stableChecks += 1;
      } else {
        stableChecks = 0;
      }

      previousSignature =
        signature;

      /*
       * 4 ardışık kontrolde aynı DOM.
       * 50ms x 4 ≈ 200ms stabilite.
       */
      if (stableChecks >= 4) {
        log(
          'page stable',
          {
            page,
            attempts,
          }
        );

        callback();
        return;
      }

      if (attempts >= 100) {
        log(
          'page stability timeout',
          { page }
        );

        callback();
        return;
      }

      readyTimer =
        setTimeout(check, 50);
    }

    check();
  }

  function emit(reason) {
    clearTimeout(routeTimer);
    clearTimeout(readyTimer);

    routeTimer =
      setTimeout(() => {
        const page =
          getPageId();

        waitForStablePage(
          page,
          () => {
            const root =
              getRoot();

            if (!root) {
              emit(
                `${reason}:wait-root`
              );

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
      }, 60);
  }

  function changed(reason) {
    emit(reason);

    setTimeout(() => {
      if (
        location.href !==
        mountedHref
      ) {
        emit(
          `${reason}:settle`
        );
      }
    }, 500);
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
        }, 180);
      } catch {
        /* ignore */
      }
    },
    true
  );

  emit('initial');

  return function destroyRouter() {
    clearTimeout(routeTimer);
    clearTimeout(readyTimer);
  };
}