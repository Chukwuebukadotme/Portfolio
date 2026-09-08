/**
 * Runtime behaviour for the portfolio.
 *
 * The build bakes every route into the page as a [data-route] block and turns the
 * design's interactive bindings into data-* hooks. This file is the whole client:
 * hash routing, theme, mobile nav, the rotating hero word, scroll reveal, the glass
 * specular tracking and the contact form. No framework.
 */
(function () {
  'use strict';

  var doc = document;
  var root = doc.documentElement;
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  root.classList.add('js');

  function each(sel, fn) {
    Array.prototype.forEach.call(doc.querySelectorAll(sel), fn);
  }

  /* ---------------------------------------------------------------- *
   * Theme — the design system resolves dark from :root[data-theme="dark"].
   * ---------------------------------------------------------------- */

  var STORE = 'co-theme';

  function applyTheme(t) {
    root.setAttribute('data-theme', t);
    doc.body.setAttribute('data-theme', t);

    var meta = doc.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', t === 'light' ? '#FFFFFF' : '#050608');

    // The hero visual crossfades between its two textures on this attribute.
    each('glass-ribbon', function (el) { el.setAttribute('theme', t); });

    var light = t === 'light';
    each('[data-theme-text]', function (el) { el.textContent = light ? 'Dark' : 'Light'; });
    each('[data-icon-light]', function (el) { el.hidden = !light; });
    each('[data-icon-dark]', function (el) { el.hidden = light; });
    each('[data-theme-toggle]', function (el) {
      el.setAttribute('aria-pressed', String(light));
      el.setAttribute('title', light ? 'Switch to dark mode' : 'Switch to light mode');
    });
  }

  function initTheme() {
    var t = null;
    try { t = localStorage.getItem(STORE); } catch (e) {}
    if (t !== 'light' && t !== 'dark') t = 'light';
    applyTheme(t);
  }

  function toggleTheme() {
    var t = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    try { localStorage.setItem(STORE, t); } catch (e) {}
    applyTheme(t);
  }

  /* ---------------------------------------------------------------- *
   * Routing — hash based, every route pre-rendered in the document.
   * ---------------------------------------------------------------- */

  function currentRoute() {
    var raw = (window.location.hash || '').replace(/^#/, '');
    if (raw && raw.charAt(0) !== '/') return null; // in-page anchor, not a route
    return raw || '/';
  }

  function showRoute(route, scroll) {
    var found = false;
    each('[data-route]', function (el) {
      var match = el.getAttribute('data-route') === route;
      el.hidden = !match;
      if (match) found = true;
    });

    if (!found) {
      var home = doc.querySelector('[data-route="/"]');
      if (home) home.hidden = false;
      route = '/';
    }

    syncNav(route);
    closeMenu();
    revealIn();
    if (scroll) window.scrollTo({ top: 0, behavior: 'auto' });
  }

  function syncNav(route) {
    var work = doc.querySelector('[data-nav="wide"] a[href="#/work"]');
    var about = doc.querySelector('[data-nav="wide"] a[href="#/about"]');
    if (work) work.style.color = route.indexOf('/work') === 0 ? 'var(--text-primary)' : 'var(--text-tertiary)';
    if (about) about.style.color = route === '/about' ? 'var(--text-primary)' : 'var(--text-tertiary)';
  }

  function onHashChange() {
    var r = currentRoute();
    if (r === null) return;
    showRoute(r, true);
  }

  /* ---------------------------------------------------------------- *
   * Mobile nav
   * ---------------------------------------------------------------- */

  function menuEl() { return doc.querySelector('[data-mobile-nav]'); }

  function setMenu(open) {
    var el = menuEl();
    if (el) el.hidden = !open;
    each('[data-menu-toggle]', function (b) { b.setAttribute('aria-expanded', String(open)); });
    each('[data-menu-label]', function (s) { s.textContent = open ? 'Close' : 'Menu'; });
    doc.body.style.overflow = open ? 'hidden' : '';
  }

  function closeMenu() { setMenu(false); }

  /* ---------------------------------------------------------------- *
   * Rotating hero word
   * ---------------------------------------------------------------- */

  var WORDS = ['digital products', 'web experiences', 'intelligent systems', 'AI workflows'];

  function initRotator() {
    var el = doc.querySelector('[data-rot]');
    if (!el || reduced) return;
    var i = 0;
    setInterval(function () {
      i = (i + 1) % WORDS.length;
      var span = doc.createElement('span');
      span.setAttribute('data-rot', '');
      span.style.cssText = 'display:inline-block;color:var(--text-accent);' +
        'animation:wordIn var(--dur-slow) var(--ease-glass) both';
      span.textContent = WORDS[i];
      el.replaceWith(span);
      el = span;
    }, 2600);
  }

  /* ---------------------------------------------------------------- *
   * Glass specular — the one bit of GlassPanel that tracked the pointer.
   * ---------------------------------------------------------------- */

  function initGlass() {
    if (reduced) return;
    each('.ds-glass', function (panel) {
      var spec = panel.querySelector('[data-glass-specular]');
      if (!spec) return; // refract={false}
      panel.addEventListener('mousemove', function (e) {
        var r = panel.getBoundingClientRect();
        if (!r.width || !r.height) return;
        var x = (e.clientX - r.left) / r.width;
        var y = (e.clientY - r.top) / r.height;
        spec.style.transform = 'translate3d(' + ((x - .5) * 6) + '%,' + ((y - .5) * 6) + '%,0)';
      });
      panel.addEventListener('mouseleave', function () {
        spec.style.transform = 'translate3d(-1.08%,-2.16%,0)';
      });
    });
  }

  /* ---------------------------------------------------------------- *
   * Scroll reveal
   * ---------------------------------------------------------------- */

  var io = null;

  function revealIn() {
    if (io) io.disconnect();

    if (reduced || !('IntersectionObserver' in window)) {
      each('[data-reveal]', function (el) { el.classList.add('is-in'); });
      return;
    }

    var active = doc.querySelector('[data-route]:not([hidden])');
    if (!active) return;

    var sel = ':scope > section, :scope > article, :scope > article > section,' +
      ':scope > article > header, :scope > article > dl';
    try {
      active.querySelectorAll(sel).forEach(function (el) {
        if (!el.hasAttribute('data-reveal')) el.setAttribute('data-reveal', '1');
      });
    } catch (e) { /* :scope unsupported — explicit marks still apply */ }

    var nodes = active.querySelectorAll('[data-reveal]');
    io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        var el = e.target;
        var i = Number(el.getAttribute('data-reveal-i') || 0);
        el.style.transitionDelay = (i * 60) + 'ms';
        el.classList.add('is-in');
        io.unobserve(el);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });

    Array.prototype.forEach.call(nodes, function (el, i) {
      el.setAttribute('data-reveal-i', String(i % 6));
      io.observe(el);
    });
  }

  /* ---------------------------------------------------------------- *
   * Contact form
   * ---------------------------------------------------------------- */

  function initForm() {
    var select = doc.querySelector('[data-type-select]');
    var extra = doc.querySelector('[data-project-fields]');
    var sent = doc.querySelector('[data-sent]');
    var form = doc.querySelector('[data-contact-form]');

    if (select && extra) {
      var sync = function () {
        var v = select.value;
        extra.hidden = !(v !== '' && v !== 'Hiring / Career Opportunity');
        // The DS Select greys its own text until something is chosen.
        select.style.color = v ? 'var(--text-primary)' : '';
      };
      select.addEventListener('change', sync);
      sync();
    }

    if (form) {
      form.addEventListener('submit', function (e) {
        // TODO: connect a form handler. Until then the mailto link is the working path.
        e.preventDefault();
        if (sent) sent.hidden = false;
      });
    }
  }

  /* ---------------------------------------------------------------- *
   * Wiring
   * ---------------------------------------------------------------- */

  doc.addEventListener('click', function (e) {
    var t = e.target;

    if (t.closest('[data-theme-toggle]')) { toggleTheme(); return; }
    if (t.closest('[data-menu-toggle]')) { setMenu(menuEl() ? menuEl().hidden : false); return; }

    if (t.closest('[data-scroll-work]')) {
      e.preventDefault();
      var target = doc.getElementById('selected-work');
      if (target) {
        window.scrollTo({
          top: target.getBoundingClientRect().top + window.scrollY - 40,
          behavior: reduced ? 'auto' : 'smooth'
        });
      }
      return;
    }

    var link = t.closest('a[href^="#/"]');
    if (link) {
      closeMenu();
      if (link.getAttribute('href') === '#' + currentRoute()) {
        window.scrollTo({ top: 0, behavior: 'auto' });
      }
    }
  });

  doc.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeMenu();
  });

  window.addEventListener('hashchange', onHashChange);

  initTheme();
  initForm();
  initRotator();
  initGlass();
  showRoute(currentRoute() || '/', false);

  each('[data-year]', function (el) { el.textContent = String(new Date().getFullYear()); });
})();
