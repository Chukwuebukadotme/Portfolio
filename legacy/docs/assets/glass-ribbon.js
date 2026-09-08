/* <glass-ribbon> — liquid-glass hero visual.
 * One plane, one shader material, two crossfading textures (light/dark).
 * Attributes:
 *   light-src / dark-src   base texture path WITHOUT size suffix, e.g. "assets/ribbon-light"
 *   theme                  "light" | "dark"      (crossfades on change)
 *   amp                    flow amplitude, default 0.006
 *   opacity                canvas opacity, default 0.9
 *   fade                   "left" | "bottom" | "both" | "none"  edge mask, default "both"
 * Renders only while visible and while the tab is focused. Falls back to a static
 * <img> when WebGL or three.js is unavailable, and freezes motion under
 * prefers-reduced-motion.
 */
(function () {
  if (window.customElements && customElements.get('glass-ribbon')) return;

  var THREE_URL = 'https://esm.sh/three@0.169.0';
  var threePromise = null;
  function loadThree() {
    if (!threePromise) threePromise = import(/* webpackIgnore: true */ THREE_URL);
    return threePromise;
  }

  var VERT = [
    'varying vec2 vUv;',
    'void main() {',
    '  vUv = uv;',
    '  gl_Position = vec4(position.xy, 0.0, 1.0);',
    '}'
  ].join('\n');

  var FRAG = [
    'precision mediump float;',
    'varying vec2 vUv;',
    'uniform sampler2D uTexA;',
    'uniform sampler2D uTexB;',
    'uniform float uMix;',
    'uniform float uTime;',
    'uniform float uAmp;',
    'uniform float uBoost;',
    'uniform float uPointerAmt;',
    'uniform vec2  uPointer;',
    'uniform vec2  uRes;',
    'uniform vec2  uTexRes;',

    'vec2 coverUV(vec2 uv) {',
    '  float ca = uRes.x / max(uRes.y, 1.0);',
    '  float ta = uTexRes.x / max(uTexRes.y, 1.0);',
    '  vec2 s = ca > ta ? vec2(1.0, ta / ca) : vec2(ca / ta, 1.0);',
    '  return (uv - 0.5) * s + 0.5;',
    '}',

    /* three taps per texture: R and B nudged for micro-refraction */
    'vec3 glass(sampler2D tex, vec2 uv, vec2 ca) {',
    '  vec3 c;',
    '  c.r = texture2D(tex, uv + ca).r;',
    '  c.g = texture2D(tex, uv).g;',
    '  c.b = texture2D(tex, uv - ca).b;',
    '  return c;',
    '}',

    'void main() {',
    '  vec2 uv = coverUV(vUv);',
    '  float t = uTime;',

    /* low-frequency flow — one perceptual cycle ~12s */
    '  float w1 = sin(uv.x * 2.05 + t * 0.62) * 0.6 + sin(uv.y * 1.55 - t * 0.47) * 0.4;',
    '  float w2 = sin((uv.x + uv.y) * 2.6 - t * 0.53) * 0.6 + cos(uv.y * 2.2 + t * 0.39) * 0.4;',
    '  vec2 disp = vec2(w1, w2) * uAmp;',

    /* secondary micro-refraction, sub-pixel scale */
    '  disp += vec2(',
    '    sin(uv.y * 26.0 + t * 1.4) * 0.0011,',
    '    cos(uv.x * 22.0 - t * 1.1) * 0.0009',
    '  );',

    /* localized pointer disturbance, a few pixels, eased by the host */
    '  vec2 pd = uv - uPointer;',
    '  pd.x *= uRes.x / max(uRes.y, 1.0);',
    '  float g = exp(-dot(pd, pd) * 14.0) * uPointerAmt;',
    '  disp += normalize(pd + vec2(1e-5)) * g * 0.010;',

    '  vec2 suv = clamp(uv + disp, 0.0, 1.0);',
    '  vec2 ca = vec2(0.0016 + g * 0.004 + uBoost * 0.0008, 0.0);',

    '  vec3 col;',
    '  if (uMix <= 0.001) col = glass(uTexA, suv, ca);',
    '  else if (uMix >= 0.999) col = glass(uTexB, suv, ca);',
    '  else col = mix(glass(uTexA, suv, ca), glass(uTexB, suv, ca), uMix);',

    '  gl_FragColor = vec4(col, 1.0);',
    '}'
  ].join('\n');

  var MASKS = {
    left: 'linear-gradient(to right, transparent 0%, transparent 26%, rgba(0,0,0,.4) 56%, #000 86%)',
    bottom: 'linear-gradient(to right, transparent 0%, rgba(0,0,0,.35) 30%, #000 70%, rgba(0,0,0,.5) 100%), linear-gradient(to bottom, transparent 0%, #000 42%, transparent 100%)',
    both: 'linear-gradient(to right, transparent 0%, transparent 30%, rgba(0,0,0,.42) 60%, #000 90%), linear-gradient(to bottom, rgba(0,0,0,.55) 0%, #000 55%, rgba(0,0,0,.25) 100%)',
    none: null
  };

  function src(base, w) { return base + '-' + w + '.webp'; }

  var GlassRibbon = /*@__PURE__*/ (function () {
    function GlassRibbon() {
      var self = Reflect.construct(HTMLElement, [], GlassRibbon);
      self._raf = 0;
      self._visible = false;
      self._alive = false;
      self._pointer = { x: 0.5, y: 0.5, amt: 0, target: 0 };
      self._boost = 0;
      self._mix = 0;
      self._mixTarget = 0;
      self._clock = 0;
      self._last = 0;
      return self;
    }
    GlassRibbon.prototype = Object.create(HTMLElement.prototype);
    GlassRibbon.prototype.constructor = GlassRibbon;
    Object.setPrototypeOf(GlassRibbon, HTMLElement);

    var P = GlassRibbon.prototype;

    P._opt = function (name, fallback) {
      var camel = name.replace(/-([a-z])/g, function (_, c) { return c.toUpperCase(); });
      var v = this.getAttribute(name);
      if (v == null) v = this.getAttribute('data-' + name);
      if (v == null && this[camel] != null) v = this[camel];
      return v == null || v === '' ? fallback : v;
    };

    P.connectedCallback = function () {
      if (this._built) return;
      this._built = true;

      var lightBase = this._opt('light-src', '');
      var darkBase = this._opt('dark-src', lightBase);
      var wide = window.matchMedia('(min-width: 820px)').matches;
      var size = wide ? 1440 : 720;
      this._urls = [src(lightBase, size), src(darkBase, size)];
      this._theme = this._opt('theme', 'light') === 'dark' ? 'dark' : 'light';
      this._mix = this._mixTarget = this._theme === 'dark' ? 1 : 0;
      this._amp = parseFloat(this._opt('amp', '0.006'));
      this._opacity = parseFloat(this._opt('opacity', '0.9'));
      this._reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      var root = this.attachShadow({ mode: 'open' });
      var mask = MASKS[this._opt('fade', 'both')];
      var style = document.createElement('style');
      style.textContent = [
        ':host{display:block;position:relative;width:100%;height:100%;overflow:hidden;pointer-events:none;contain:paint}',
        '.layer{position:absolute;inset:0;width:100%;height:100%;opacity:0;transition:opacity .9s ease}',
        '.layer.on{opacity:1}',
        'img{object-fit:cover;object-position:center}',
        'canvas{display:block}',
        '@media (max-width: 760px){:host{opacity:.5}}'
      ].join('') + (mask ? '.layer{-webkit-mask-image:' + mask + ';mask-image:' + mask + ';-webkit-mask-composite:source-in;mask-composite:intersect}' : '');
      root.appendChild(style);

      var img = document.createElement('img');
      img.className = 'layer';
      img.decoding = 'async';
      img.loading = 'lazy';
      img.alt = '';
      img.setAttribute('aria-hidden', 'true');
      img.src = this._urls[this._theme === 'dark' ? 1 : 0];
      img.style.opacity = String(this._opacity);
      img.style.mixBlendMode = this._theme === 'dark' ? 'screen' : 'multiply';
      root.appendChild(img);
      this._img = img;

      this._io = new IntersectionObserver(this._onIntersect.bind(this), { rootMargin: '120px' });
      this._io.observe(this);

      this._onVis = this._onVisibility.bind(this);
      document.addEventListener('visibilitychange', this._onVis);

      if (!this._reduced) {
        this._onPointer = this._handlePointer.bind(this);
        this._onScroll = this._handleScroll.bind(this);
        window.addEventListener('pointermove', this._onPointer, { passive: true });
        window.addEventListener('scroll', this._onScroll, { passive: true });
        this._scrollY = window.scrollY;
      }
    };

    P.disconnectedCallback = function () { this._teardown(); };

    P.attributeChangedCallback = function (name, _old, val) {
      if (name !== 'theme' || !this._built) return;
      var t = val === 'dark' ? 'dark' : 'light';
      if (t === this._theme) return;
      this._theme = t;
      this._mixTarget = t === 'dark' ? 1 : 0;
      var blend = t === 'dark' ? 'screen' : 'multiply';
      if (this._canvas) this._canvas.style.mixBlendMode = blend;
      if (this._img) {
        this._img.style.mixBlendMode = blend;
        if (!this._gl) { this._img.src = this._urls[t === 'dark' ? 1 : 0]; }
      }
      if (this._reduced && this._gl) { this._mix = this._mixTarget; this._renderOnce(); }
      else this._start();
    };

    P._onIntersect = function (entries) {
      var vis = entries[entries.length - 1].isIntersecting;
      this._visible = vis;
      if (vis) { this._init(); this._start(); } else this._stop();
    };

    P._onVisibility = function () {
      if (document.hidden) this._stop();
      else if (this._visible) this._start();
    };

    P._handlePointer = function (e) {
      var r = this.getBoundingClientRect();
      if (!r.width || !r.height) return;
      var inside = e.clientX >= r.left - 80 && e.clientX <= r.right + 80 &&
                   e.clientY >= r.top - 80 && e.clientY <= r.bottom + 80;
      this._pointer.x = (e.clientX - r.left) / r.width;
      this._pointer.y = 1 - (e.clientY - r.top) / r.height;
      this._pointer.target = inside ? 1 : 0;
    };

    P._handleScroll = function () {
      var y = window.scrollY;
      var dv = Math.min(Math.abs(y - this._scrollY) / 90, 1);
      this._scrollY = y;
      this._boost = Math.min(this._boost + dv * 0.55, 1);
    };

    P._init = function () {
      if (this._alive || this._failed) return;
      this._alive = true;

      var probe = document.createElement('canvas');
      var ok = !!(probe.getContext('webgl2') || probe.getContext('webgl'));
      if (!ok) { this._fallback(); return; }

      var self = this;
      loadThree().then(function (THREE) {
        if (!self._built || self._failed) return;
        self._setup(THREE);
      }).catch(function () { self._fallback(); });

      /* show the static image immediately; the canvas fades over it */
      this._img.classList.add('on');
    };

    P._fallback = function () {
      this._failed = true;
      this._img.classList.add('on');
    };

    P._setup = function (THREE) {
      var self = this;
      var renderer;
      try {
        renderer = new THREE.WebGLRenderer({ alpha: false, antialias: false, powerPreference: 'low-power' });
      } catch (e) { this._fallback(); return; }

      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
      var canvas = renderer.domElement;
      canvas.className = 'layer';
      canvas.style.opacity = '0';
      canvas.style.mixBlendMode = this._theme === 'dark' ? 'screen' : 'multiply';
      this.shadowRoot.appendChild(canvas);
      this._canvas = canvas;
      this._renderer = renderer;
      this._THREE = THREE;

      var loader = new THREE.TextureLoader();
      loader.crossOrigin = 'anonymous';
      var load = function (url) {
        return new Promise(function (res, rej) { loader.load(url, res, undefined, rej); });
      };

      Promise.all([load(this._urls[0]), load(this._urls[1])]).then(function (tex) {
        if (!self._built) { tex.forEach(function (t) { t.dispose(); }); return; }
        tex.forEach(function (t) {
          t.colorSpace = THREE.SRGBColorSpace;
          t.minFilter = THREE.LinearFilter;
          t.magFilter = THREE.LinearFilter;
          t.generateMipmaps = false;
          t.wrapS = t.wrapT = THREE.ClampToEdgeWrapping;
        });
        self._tex = tex;

        var w = tex[0].image.width, h = tex[0].image.height;
        self._uniforms = {
          uTexA: { value: tex[0] },
          uTexB: { value: tex[1] },
          uMix: { value: self._mix },
          uTime: { value: 0 },
          uAmp: { value: self._reduced ? 0 : self._amp },
          uBoost: { value: 0 },
          uPointerAmt: { value: 0 },
          uPointer: { value: new THREE.Vector2(0.5, 0.5) },
          uRes: { value: new THREE.Vector2(1, 1) },
          uTexRes: { value: new THREE.Vector2(w, h) }
        };
        self._material = new THREE.ShaderMaterial({
          vertexShader: VERT, fragmentShader: FRAG, uniforms: self._uniforms,
          depthTest: false, depthWrite: false
        });
        self._geo = new THREE.PlaneGeometry(2, 2);
        self._scene = new THREE.Scene();
        self._scene.add(new THREE.Mesh(self._geo, self._material));
        self._camera = new THREE.Camera();

        self._ro = new ResizeObserver(function () { self._resize(); });
        self._ro.observe(self);
        self._resize();

        self._gl = true;
        canvas.style.opacity = String(self._opacity);
        self._img.classList.remove('on');
        self._imgHideT = setTimeout(function () {
          if (self._gl && self._img) self._img.style.display = 'none';
        }, 950);
        canvas.addEventListener('webglcontextlost', function () {
          if (self._imgHideT) clearTimeout(self._imgHideT);
          if (self._img) { self._img.style.display = 'block'; self._img.classList.add('on'); }
          self._gl = false;
          self._stop();
        });
        self._renderOnce();
        if (!self._reduced && self._visible && !document.hidden) self._start();
      }).catch(function () { self._fallback(); });
    };

    P._resize = function () {
      if (!this._renderer) return;
      var w = this.clientWidth || 1, h = this.clientHeight || 1;
      if (w === this._w && h === this._h) return;
      this._w = w; this._h = h;
      this._renderer.setSize(w, h, false);
      this._uniforms.uRes.value.set(w, h);
      if (!this._raf) this._renderOnce();
    };

    P._renderOnce = function () {
      if (!this._gl) return;
      this._uniforms.uMix.value = this._mix;
      this._renderer.render(this._scene, this._camera);
    };

    P._start = function () {
      if (!this._gl || this._raf || document.hidden || !this._visible) return;
      if (this._reduced && this._mix === this._mixTarget) return;
      this._last = performance.now();
      this._raf = requestAnimationFrame(this._frame.bind(this));
    };

    P._stop = function () {
      if (this._raf) { cancelAnimationFrame(this._raf); this._raf = 0; }
    };

    P._frame = function (now) {
      var dt = Math.min((now - this._last) / 1000, 0.05);
      this._last = now;
      var u = this._uniforms;

      if (!this._reduced) {
        this._clock += dt * (1 + this._boost * 1.6);
        this._boost += (0 - this._boost) * Math.min(dt * 1.1, 1);
        var p = this._pointer;
        p.amt += (p.target - p.amt) * Math.min(dt * 2.6, 1);
        u.uTime.value = this._clock;
        u.uBoost.value = this._boost;
        u.uPointerAmt.value = p.amt;
        u.uPointer.value.set(p.x, p.y);
      }

      if (this._mix !== this._mixTarget) {
        var step = dt / 0.7;
        this._mix += Math.sign(this._mixTarget - this._mix) * step;
        if (Math.abs(this._mixTarget - this._mix) < step) this._mix = this._mixTarget;
      }
      u.uMix.value = this._mix;

      this._renderer.render(this._scene, this._camera);

      if (this._reduced && this._mix === this._mixTarget) { this._raf = 0; return; }
      this._raf = requestAnimationFrame(this._frame.bind(this));
    };

    P._teardown = function () {
      this._stop();
      this._built = false;
      if (this._io) { this._io.disconnect(); this._io = null; }
      if (this._ro) { this._ro.disconnect(); this._ro = null; }
      document.removeEventListener('visibilitychange', this._onVis);
      if (this._onPointer) window.removeEventListener('pointermove', this._onPointer);
      if (this._onScroll) window.removeEventListener('scroll', this._onScroll);
      if (this._imgHideT) { clearTimeout(this._imgHideT); this._imgHideT = 0; }
      if (this._tex) this._tex.forEach(function (t) { t.dispose(); });
      if (this._material) this._material.dispose();
      if (this._geo) this._geo.dispose();
      if (this._renderer) { this._renderer.dispose(); this._renderer.forceContextLoss(); }
      this._tex = this._material = this._geo = this._renderer = this._scene = null;
      this._gl = false;
      this._alive = false;
    };

    return GlassRibbon;
  })();

  Object.defineProperty(GlassRibbon, 'observedAttributes', { get: function () { return ['theme']; } });
  customElements.define('glass-ribbon', GlassRibbon);
})();
