// <video-slot id="..." placeholder="..."> — drag-drop or click to load an MP4.
// The chosen file is stored in IndexedDB under the slot id, so it survives reload.
(function () {
  if (window.customElements && customElements.get('video-slot')) return;

  const DB = 'video-slot-store', STORE = 'files';
  function open() {
    return new Promise((res, rej) => {
      const r = indexedDB.open(DB, 1);
      r.onupgradeneeded = () => { if (!r.result.objectStoreNames.contains(STORE)) r.result.createObjectStore(STORE); };
      r.onsuccess = () => res(r.result);
      r.onerror = () => rej(r.error);
    });
  }
  async function put(key, blob) {
    const db = await open();
    return new Promise((res, rej) => {
      const tx = db.transaction(STORE, 'readwrite');
      tx.objectStore(STORE).put(blob, key);
      tx.oncomplete = res; tx.onerror = () => rej(tx.error);
    });
  }
  async function get(key) {
    const db = await open();
    return new Promise((res) => {
      const tx = db.transaction(STORE, 'readonly');
      const rq = tx.objectStore(STORE).get(key);
      rq.onsuccess = () => res(rq.result || null);
      rq.onerror = () => res(null);
    });
  }
  async function del(key) {
    const db = await open();
    return new Promise((res) => {
      const tx = db.transaction(STORE, 'readwrite');
      tx.objectStore(STORE).delete(key);
      tx.oncomplete = res; tx.onerror = res;
    });
  }

  class VideoSlot extends HTMLElement {
    connectedCallback() {
      if (this._built) return;
      this._built = true;
      const key = this.id || 'video-slot';
      const label = this.getAttribute('placeholder') || '';

      const root = this.attachShadow({ mode: 'open' });
      root.innerHTML = [
        '<style>',
        ':host{display:block;position:relative;width:100%;height:100%;min-height:120px}',
        '.wrap{position:absolute;inset:0;overflow:hidden;background:var(--bg-2,#09111F)}',
        'video{width:100%;height:100%;object-fit:cover;display:block}',
        '.ph{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;',
        'padding:18px;text-align:center;cursor:pointer;border:1px dashed var(--r34,rgba(148,163,184,.38));',
        "font-family:'IBM Plex Mono',ui-monospace,monospace;font-size:10px;letter-spacing:.18em;text-transform:uppercase;color:var(--ink-2,#94A3B8)}",
        '.ph:hover,.ph.over{border-color:var(--accent,#22D3EE);color:var(--accent,#22D3EE)}',
        '.ph b{font-weight:400;color:var(--ink,#F4F1EA);letter-spacing:.14em}',
        '.hint{font-size:9px;letter-spacing:.14em}',
        '.clear{position:absolute;top:8px;right:8px;z-index:2;background:var(--bg-2,#09111F);border:1px solid var(--r34,rgba(148,163,184,.34));',
        "color:var(--ink-2,#94A3B8);font-family:'IBM Plex Mono',ui-monospace,monospace;font-size:9px;letter-spacing:.16em;text-transform:uppercase;",
        'padding:5px 8px;cursor:pointer;opacity:0;transition:opacity .2s}',
        ':host(:hover) .clear{opacity:1}',
        '.clear:hover{color:var(--accent,#22D3EE);border-color:var(--accent,#22D3EE)}',
        'input{display:none}',
        '</style>',
        '<div class="wrap">',
        '<video playsinline muted loop autoplay hidden></video>',
        '<div class="ph" part="placeholder" tabindex="0" role="button">',
        '<b>' + label + '</b>',
        '</div>',
        '<button class="clear" type="button" hidden>Replace</button>',
        '<input type="file" accept="video/mp4,video/webm,video/quicktime" />',
        '</div>'
      ].join('');

      const video = root.querySelector('video');
      const ph = root.querySelector('.ph');
      const clear = root.querySelector('.clear');
      const input = root.querySelector('input');

      const show = (blob) => {
        if (this._url) URL.revokeObjectURL(this._url);
        this._url = URL.createObjectURL(blob);
        video.src = this._url;
        video.hidden = false;
        ph.hidden = true;
        clear.hidden = false;
        video.play().catch(() => {});
      };
      const reset = () => {
        if (this._url) { URL.revokeObjectURL(this._url); this._url = null; }
        video.removeAttribute('src');
        video.hidden = true;
        ph.hidden = false;
        clear.hidden = true;
      };
      const accept = (file) => {
        if (!file || !/^video\//.test(file.type)) return;
        show(file);
        put(key, file).catch(() => {});
      };

      ph.addEventListener('click', () => input.click());
      ph.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); input.click(); }
      });
      clear.addEventListener('click', () => { reset(); del(key); });
      input.addEventListener('change', () => accept(input.files && input.files[0]));

      ['dragenter', 'dragover'].forEach(t => this.addEventListener(t, (e) => {
        e.preventDefault(); ph.classList.add('over');
      }));
      ['dragleave', 'drop'].forEach(t => this.addEventListener(t, () => ph.classList.remove('over')));
      this.addEventListener('drop', (e) => {
        e.preventDefault();
        const f = e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0];
        accept(f);
      });

      get(key).then(blob => { if (blob) show(blob); }).catch(() => {});
    }
    disconnectedCallback() { if (this._url) URL.revokeObjectURL(this._url); }
  }
  customElements.define('video-slot', VideoSlot);
})();
