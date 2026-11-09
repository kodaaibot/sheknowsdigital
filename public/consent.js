/* Cookie consent for sheknowsdigital.com.
   Loaded by a small script in Base.astro only after the page has finished loading (window "load", then idle time),
   so it never delays the page. Two categories:
   - Necessary: always on (the stored choice itself, Google reCAPTCHA on form pages).
   - Embedded content: YouTube, SlideShare and Giphy iframes in old posts. Off until the visitor allows it.
   The choice is kept in localStorage under "skd-consent". */
(function () {
  'use strict';
  if (window.skdConsent) return;
  var KEY = 'skd-consent';
  var VERSION = 1;
  var script = document.currentScript;

  function read() {
    try {
      var v = JSON.parse(localStorage.getItem(KEY) || 'null');
      return v && v.v === VERSION ? v : null;
    } catch (e) { return null; }
  }
  function write(embeds) {
    var v = { v: VERSION, embeds: !!embeds, at: new Date().toISOString() };
    try { localStorage.setItem(KEY, JSON.stringify(v)); } catch (e) { /* private mode: the choice lasts for this page only */ }
    state = v;
    return v;
  }
  var state = read();

  function loadEmbeds() {
    var frames = document.querySelectorAll('iframe[data-consent-src]');
    for (var i = 0; i < frames.length; i++) {
      var f = frames[i];
      f.src = f.getAttribute('data-consent-src');
      f.removeAttribute('data-consent-src');
      f.hidden = false;
      var wrap = f.closest('.consent-embed');
      if (wrap) {
        wrap.classList.add('is-loaded');
        var note = wrap.querySelector('.consent-embed-note');
        if (note) note.parentNode.removeChild(note);
      }
    }
  }
  function embedsLoaded() { return !!document.querySelector('.consent-embed.is-loaded'); }

  var css = [
    '.ckb{position:fixed;z-index:60;left:max(16px,env(safe-area-inset-left,0px));right:max(16px,env(safe-area-inset-right,0px));bottom:calc(16px + env(safe-area-inset-bottom,0px));',
    'max-width:560px;margin-left:auto;background:var(--card,#fbfaf6);color:var(--fg,#1f2b22);border:1px solid var(--border,#ddd6c8);',
    'box-shadow:0 18px 48px -12px rgba(20,40,25,.35);padding:22px 22px 20px;font:400 14px/1.6 Manrope,Arial,sans-serif;animation:ckb-in .25s ease-out}',
    '@media (prefers-reduced-motion:reduce){.ckb{animation:none}}',
    '@keyframes ckb-in{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}}',
    '.ckb h2{margin:0 0 6px;font:400 22px/1.25 "Fraunces Variable",Georgia,serif}',
    '.ckb p{margin:0;color:var(--muted,#5b675d)}',
    '.ckb a{color:var(--accent-text,#9a4a26);text-decoration:underline;text-underline-offset:3px}',
    '.ckb-actions{display:flex;flex-wrap:wrap;gap:8px;margin-top:16px}',
    '.ckb button{font:500 14px/1.2 Manrope,Arial,sans-serif;padding:11px 16px;border:1px solid var(--primary,#24452f);background:transparent;color:var(--primary,#24452f);cursor:pointer;border-radius:0}',
    '.ckb button.solid{background:var(--primary,#24452f);color:var(--on-primary,#f6f2ea)}',
    '.ckb button.plain{border-color:transparent;text-decoration:underline;text-underline-offset:3px;padding-inline:4px}',
    '.ckb button:focus-visible{outline:2px solid var(--clay,#c46a3e);outline-offset:2px}',
    '.ckb-prefs{margin-top:14px;border-top:1px solid var(--border,#ddd6c8)}',
    '.ckb-row{display:flex;gap:12px;align-items:flex-start;padding:12px 0;border-bottom:1px solid var(--border,#ddd6c8)}',
    '.ckb-row input{margin-top:4px;width:18px;height:18px;accent-color:var(--primary,#24452f);flex:0 0 auto}',
    '.ckb-row strong{display:block;font-weight:600;color:var(--fg,#1f2b22)}',
    '@media (max-width:480px){.ckb{padding:18px 16px 16px}.ckb-actions button{flex:1 1 auto}}'
  ].join('');

  var box = null;
  function el(tag, attrs, html) {
    var e = document.createElement(tag);
    for (var k in attrs) e.setAttribute(k, attrs[k]);
    if (html != null) e.innerHTML = html;
    return e;
  }
  function close() {
    if (box) { box.parentNode.removeChild(box); box = null; }
  }
  function save(embeds) {
    var had = embedsLoaded();
    write(embeds);
    close();
    if (embeds) loadEmbeds();
    else if (had) location.reload(); // stop embeds that already loaded
  }
  function show(withPrefs) {
    close();
    if (!document.getElementById('ckb-style')) document.head.appendChild(el('style', { id: 'ckb-style' }, css));
    var hasEmbeds = !!document.querySelector('.consent-embed');
    box = el('section', { 'class': 'ckb', role: 'region', 'aria-label': 'Cookie choices' });
    box.innerHTML =
      '<h2>Cookies, briefly</h2>' +
      '<p>This site uses no analytics or advertising cookies. A few older posts embed videos and media from YouTube, SlideShare and Giphy, which set their own cookies, so they only load if you allow them. ' +
      '<a href="/cookie-policy/">Cookie policy</a></p>' +
      '<div class="ckb-prefs" hidden>' +
        '<label class="ckb-row"><input type="checkbox" checked disabled><span><strong>Necessary</strong>Remembers this choice, and protects the forms from spam with Google reCAPTCHA. Always on.</span></label>' +
        '<label class="ckb-row"><input type="checkbox" id="ckb-embeds"><span><strong>Embedded content</strong>Videos and media from YouTube, SlideShare and Giphy' + (hasEmbeds ? ', including on this page' : '') + '.</span></label>' +
      '</div>' +
      '<div class="ckb-actions">' +
        '<button type="button" data-ckb="reject">Reject non-essential</button>' +
        '<button type="button" class="solid" data-ckb="accept">Accept all</button>' +
        '<button type="button" class="plain" data-ckb="prefs" aria-expanded="false">Choose</button>' +
      '</div>';
    document.body.appendChild(box);
    var cb = box.querySelector('#ckb-embeds');
    cb.checked = !!(state && state.embeds);
    function openPrefs() {
      box.querySelector('.ckb-prefs').hidden = false;
      var b = box.querySelector('[data-ckb="prefs"]');
      b.textContent = 'Save choices';
      b.setAttribute('data-ckb', 'save');
      b.setAttribute('aria-expanded', 'true');
      b.classList.remove('plain');
    }
    box.addEventListener('click', function (e) {
      var t = e.target.closest('[data-ckb]');
      if (!t) return;
      var a = t.getAttribute('data-ckb');
      if (a === 'accept') save(true);
      else if (a === 'reject') save(false);
      else if (a === 'prefs') { openPrefs(); cb.focus(); }
      else if (a === 'save') save(cb.checked);
    });
    if (withPrefs) { openPrefs(); cb.focus(); }
  }

  window.skdConsent = {
    open: function () { show(true); },
    allowEmbeds: function () { write(true); close(); loadEmbeds(); },
    get: function () { return state; }
  };

  document.addEventListener('click', function (e) {
    var t = e.target.closest && e.target.closest('[data-cookie-settings],[data-consent-load]');
    if (!t) return;
    e.preventDefault();
    if (t.hasAttribute('data-consent-load')) window.skdConsent.allowEmbeds();
    else window.skdConsent.open();
  });

  if (state && state.embeds) loadEmbeds();
  var intent = script && script.getAttribute('data-intent');
  if (intent && window.skdConsent[intent]) window.skdConsent[intent]();
  else if (!state) show(false);
})();
