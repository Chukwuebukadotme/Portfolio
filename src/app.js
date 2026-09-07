/**
 * Runtime behaviour for the portfolio.
 *
 * The build step bakes every route into the page as a [data-route] block and turns the
 * design's interactive bindings into data-* hooks. This file is the whole client: hash
 * routing, theme, mobile nav, the rotating hero word, scroll reveal and the contact form.
 * No framework, no build dependency.
 */
(function () {
  'use strict';

  var doc = document;
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  doc.documentElement.classList.add('js');

  /* ---------------------------------------------------------------- *
   * Theme
   * ---------------------------------------------------------------- */

  var STORE = 'co-theme';

  function applyTheme(t) {
    doc.body.setAttribute('data-theme', t);

    var meta = doc.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', t === 'light' ? '#FFFFFF' : '#0E172A');

    var light = t === 'light';
    each('[data-theme-text]', function (el) { el.textContent = light ? 'Dark' : 'Light'; });
    each('[data-theme-dot]', function (el) { el.style.background = light ? 'transparent' : 'var(--accent)'; });
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
    var t = doc.body.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    try { localStorage.setItem(STORE, t); } catch (e) {}
    applyTheme(t);
  }

  /* ---------------------------------------------------------------- *
   * Routing — hash based, every route pre-rendered in the document.
   * ---------------------------------------------------------------- */

  function currentRoute() {
    var raw = (window.location.hash || '').replace(/^#/, '');
    // An in-page anchor (#selected-work) is not a route.
    if (raw && raw.charAt(0) !== '/') return null;
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
      // Unknown hash — fall back to home rather than showing an empty page.
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
    if (work) work.style.color = route.indexOf('/work') === 0 ? 'var(--ink)' : 'var(--ink-2)';
    if (about) about.style.color = route === '/about' ? 'var(--ink)' : 'var(--ink-2)';
  }

  function onHashChange() {
    var r = currentRoute();
    if (r === null) return; // in-page anchor
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
      span.style.cssText = 'display:inline-block;color:var(--accent);animation:wordIn .62s cubic-bezier(.22,1,.36,1) both';
      span.textContent = WORDS[i];
      el.replaceWith(span);
      el = span;
    }, 2600);
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

    // Mirror the design: sections of the live route animate in as they enter view.
    var sel = ':scope > section, :scope > article, :scope > article > section, :scope > article > header, :scope > article > dl';
    try {
      active.querySelectorAll(sel).forEach(function (el) {
        if (!el.hasAttribute('data-reveal')) el.setAttribute('data-reveal', '1');
      });
    } catch (e) { /* :scope unsupported — the explicit data-reveal marks still apply */ }

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
      };
      select.addEventListener('change', sync);
      sync();
    }

    if (form) {
      form.addEventListener('submit', function (e) {
        // TODO: connect a form handler (Formspree, Resend, a serverless function...).
        // Until then the mailto link in the sidebar is the working path.
        e.preventDefault();
        if (sent) sent.hidden = false;
      });
    }
  }

  /* ---------------------------------------------------------------- *
   * Wiring
   * ---------------------------------------------------------------- */

  function each(sel, fn) {
    Array.prototype.forEach.call(doc.querySelectorAll(sel), fn);
  }

  doc.addEventListener('click', function (e) {
    var t = e.target;

    var themeBtn = t.closest('[data-theme-toggle]');
    if (themeBtn) { toggleTheme(); return; }

    var menuBtn = t.closest('[data-menu-toggle]');
    if (menuBtn) { setMenu(menuEl() ? menuEl().hidden : false); return; }

    var scrollBtn = t.closest('[data-scroll-work]');
    if (scrollBtn) {
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

    // Any route link closes the mobile nav; hashchange does the rest.
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
  showRoute(currentRoute() || '/', false);

  each('[data-year]', function (el) { el.textContent = String(new Date().getFullYear()); });
})();
