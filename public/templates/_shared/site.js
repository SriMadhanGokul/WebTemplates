/* Shared interactions for all template pages (homepages + inner pages).
   Cart / wishlist (localStorage), filters, sorting, product gallery, tabs, lightbox,
   form validation, pricing toggle, reveal animations, mobile menu, detail-page filling. */
(function () {
  var D = document, W = window;
  var tid = (D.body && D.body.getAttribute('data-tpl')) || (location.pathname.match(/templates\/(\d{3})\//) || [])[1] || 'x';
  var KEY = 'tpl-cart-' + tid, WKEY = 'tpl-wish-' + tid;
  var DATA = W.XI_DATA || {};
  var CUR = DATA.cur || '$';
  function $(s, r) { return (r || D).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || D).querySelectorAll(s)); }
  function fmt(v) { return CUR + Number(v).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 }); }
  function load(k) { try { return JSON.parse(localStorage.getItem(k)) || []; } catch (e) { return []; } }
  function save(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  function qs(name) { var m = location.search.match(new RegExp('[?&]' + name + '=([^&]*)')); return m ? decodeURIComponent(m[1].replace(/\+/g, ' ')) : null; }

  /* ---------- toast ---------- */
  var toastEl;
  function toast(msg) {
    if (!toastEl) { toastEl = D.createElement('div'); toastEl.className = 'xi-toast'; D.body.appendChild(toastEl); }
    toastEl.innerHTML = msg; toastEl.classList.add('on');
    clearTimeout(toastEl._t); toastEl._t = setTimeout(function () { toastEl.classList.remove('on'); }, 2600);
  }
  W.xiToast = toast;

  /* ---------- cart ---------- */
  function cart() { return load(KEY); }
  function count() { return cart().reduce(function (a, i) { return a + i.q; }, 0); }
  function badges() {
    var c = count();
    $$('a[href$="cart.html"], a[href*="cart.html?"]').forEach(function (a) {
      if (a.closest('.xi-menu-panel')) return;
      var b = a.querySelector('.xi-badge');
      if (!b) { b = D.createElement('i'); b.className = 'xi-badge'; a.appendChild(b); if (getComputedStyle(a).position === 'static') a.style.position = 'relative'; }
      b.textContent = c; b.style.display = c ? '' : 'none';
      var em = a.querySelector('em'); if (em && /^\d+$/.test(em.textContent.trim())) { em.textContent = c; b.style.display = 'none'; }
    });
    $$('[data-cart-count]').forEach(function (e) { e.textContent = c; });
  }
  function add(item, q) {
    var c = cart(), f = c.filter(function (i) { return i.id == item.id && i.v == item.v; })[0];
    if (f) f.q += q; else c.push({ id: item.id, name: item.name, price: +item.price, img: item.img, v: item.v || '', q: q });
    save(KEY, c); badges();
    toast('<b>Added to cart</b> ' + item.name + ' <a href="cart.html">View cart →</a>');
  }
  D.addEventListener('click', function (e) {
    var b = e.target.closest('[data-add]');
    if (b) {
      e.preventDefault();
      var p = (DATA.products || [])[+b.getAttribute('data-add')] || {};
      var box = b.closest('[data-pdp]');
      var q = box && $('[data-qty]', box) ? Math.max(1, +$('[data-qty]', box).value || 1) : 1;
      var v = box ? $$('.xi-opt.on', box).map(function (o) { return o.textContent.trim(); }).join(' / ') : '';
      if (box && box.getAttribute('data-id') != null) p = (DATA.products || [])[+box.getAttribute('data-id')] || p;
      add({ id: p.id, name: p.name, price: p.price, img: p.img, v: v }, q);
      b.classList.add('xi-pulse'); setTimeout(function () { b.classList.remove('xi-pulse'); }, 500);
      return;
    }
    var w = e.target.closest('.x-fav, [data-wish]');
    if (w) {
      e.preventDefault();
      w.classList.toggle('xi-on');
      var on = w.classList.contains('xi-on');
      if (w.textContent.trim() === '♡' || w.textContent.trim() === '♥') w.textContent = on ? '♥' : '♡';
      toast(on ? 'Saved to your wishlist ♥' : 'Removed from wishlist');
      return;
    }
    var q = e.target.closest('[data-step]');
    if (q) {
      e.preventDefault();
      var inp = q.parentNode.querySelector('input');
      inp.value = Math.max(1, (+inp.value || 1) + (+q.getAttribute('data-step')));
      inp.dispatchEvent(new Event('change', { bubbles: true }));
      return;
    }
    var o = e.target.closest('.xi-opt');
    if (o) { e.preventDefault(); $$('.xi-opt', o.parentNode).forEach(function (x) { x.classList.remove('on'); }); o.classList.add('on'); return; }
    var t = e.target.closest('[data-tab]');
    if (t) {
      e.preventDefault();
      var g = t.closest('[data-tabs]');
      $$('[data-tab]', g).forEach(function (x) { x.classList.toggle('on', x === t); });
      $$('[data-pane]', g).forEach(function (x) { x.hidden = x.getAttribute('data-pane') !== t.getAttribute('data-tab'); });
      return;
    }
    var th = e.target.closest('[data-thumb]');
    if (th) {
      e.preventDefault();
      var main = $('[data-main]', th.closest('[data-gallery]'));
      main.style.opacity = 0;
      setTimeout(function () { main.src = th.getAttribute('data-thumb'); main.style.opacity = 1; }, 160);
      $$('[data-thumb]', th.parentNode).forEach(function (x) { x.classList.toggle('on', x === th); });
      return;
    }
    var m = e.target.closest('[data-xi-menu]');
    if (m) { e.preventDefault(); openMenu(); return; }
    var dead = e.target.closest('a[href="#"]');
    if (dead && !dead.hasAttribute('data-keep')) { e.preventDefault(); }
  });

  /* ---------- cart page ---------- */
  function renderCart() {
    var box = $('[data-cart]'); if (!box) return;
    var c = cart(), list = $('[data-cart-list]', box), sum = 0;
    if (!c.length) {
      list.innerHTML = '<div class="xi-empty"><b>Your cart is empty</b><p>Looks like you haven\'t added anything yet.</p><a class="x-btn" href="' + (DATA.listing || 'index.html') + '">Continue shopping</a></div>';
    } else {
      list.innerHTML = c.map(function (i, k) {
        sum += i.price * i.q;
        return '<div class="xi-line"><img src="' + i.img + '" alt=""><div><b>' + i.name + '</b><small>' + (i.v || '') + '</small><span class="xi-qty"><button data-step="-1" aria-label="Decrease">−</button><input data-line="' + k + '" value="' + i.q + '" inputmode="numeric" aria-label="Quantity"><button data-step="1" aria-label="Increase">+</button></span></div><div class="xi-lp"><b>' + fmt(i.price * i.q) + '</b><button class="xi-rm" data-rm="' + k + '">Remove</button></div></div>';
      }).join('');
    }
    var ship = sum === 0 || sum > (DATA.freeShip || 100) ? 0 : (DATA.shipFee || 9);
    $('[data-sub]', box).textContent = fmt(sum);
    $('[data-ship]', box).textContent = ship ? fmt(ship) : 'Free';
    $('[data-total]', box).textContent = fmt(sum + ship);
    badges();
  }
  D.addEventListener('change', function (e) {
    var l = e.target.getAttribute && e.target.getAttribute('data-line');
    if (l != null) { var c = cart(); c[+l].q = Math.max(1, +e.target.value || 1); save(KEY, c); renderCart(); }
  });
  D.addEventListener('click', function (e) {
    var r = e.target.closest('[data-rm]');
    if (r) { var c = cart(); c.splice(+r.getAttribute('data-rm'), 1); save(KEY, c); renderCart(); toast('Item removed'); }
    var co = e.target.closest('[data-checkout]');
    if (co) {
      e.preventDefault();
      if (!cart().length) { toast('Your cart is empty'); return; }
      save(KEY, []); renderCart();
      var ok = $('[data-cart-done]'); if (ok) { ok.hidden = false; ok.scrollIntoView({ behavior: 'smooth', block: 'center' }); }
      toast('<b>Order placed!</b> A confirmation is on its way.');
    }
    var cp = e.target.closest('[data-coupon]');
    if (cp) { e.preventDefault(); var i = cp.parentNode.querySelector('input'); toast(i.value.trim() ? 'Code “' + i.value.trim().toUpperCase() + '” isn\'t valid right now' : 'Enter a promo code'); }
  });

  /* ---------- filters / sort / search ---------- */
  function initFilters() {
    var grid = $('[data-grid]'); if (!grid) return;
    var cards = $$('[data-cat]', grid), state = { cat: 'All', price: 'all', q: '' };
    var start = qs('c');
    function apply() {
      var shown = 0;
      cards.forEach(function (c) {
        var p = +c.getAttribute('data-price') || 0, ok = true;
        if (state.cat !== 'All' && c.getAttribute('data-cat') !== state.cat) ok = false;
        if (state.price !== 'all') { var r = state.price.split('-'); if (p < +r[0] || p > +r[1]) ok = false; }
        if (state.q && c.textContent.toLowerCase().indexOf(state.q) < 0) ok = false;
        c.style.display = ok ? '' : 'none'; if (ok) shown++;
      });
      $$('[data-count]').forEach(function (e) { e.textContent = shown; });
      var none = $('[data-none]'); if (none) none.hidden = shown > 0;
    }
    $$('[data-filter]').forEach(function (b) {
      b.addEventListener('click', function (e) {
        e.preventDefault(); state.cat = b.getAttribute('data-filter');
        $$('[data-filter]').forEach(function (x) { x.classList.toggle('on', x.getAttribute('data-filter') === state.cat); });
        apply();
      });
    });
    $$('[data-price-f]').forEach(function (b) {
      b.addEventListener('change', function () { state.price = b.value; apply(); });
    });
    var s = $('[data-search]'); if (s) s.addEventListener('input', function () { state.q = s.value.trim().toLowerCase(); apply(); });
    var so = $('[data-sort]');
    if (so) so.addEventListener('change', function () {
      var v = so.value, arr = cards.slice();
      if (v === 'low') arr.sort(function (a, b) { return a.getAttribute('data-price') - b.getAttribute('data-price'); });
      else if (v === 'high') arr.sort(function (a, b) { return b.getAttribute('data-price') - a.getAttribute('data-price'); });
      else if (v === 'name') arr.sort(function (a, b) { return a.textContent.trim().localeCompare(b.textContent.trim()); });
      else arr.sort(function (a, b) { return a.getAttribute('data-i') - b.getAttribute('data-i'); });
      arr.forEach(function (c) { grid.appendChild(c); });
    });
    var reset = $('[data-reset]');
    if (reset) reset.addEventListener('click', function (e) {
      e.preventDefault(); state = { cat: 'All', price: 'all', q: '' };
      $$('[data-filter]').forEach(function (x) { x.classList.toggle('on', x.getAttribute('data-filter') === 'All'); });
      $$('[data-price-f]').forEach(function (x) { x.checked = x.value === 'all'; });
      if (s) s.value = ''; apply();
    });
    if (start) {
      var m = $$('[data-filter]').filter(function (b) { return b.getAttribute('data-filter').toLowerCase() === start.toLowerCase(); })[0];
      if (m) m.click();
    }
    apply();
  }

  /* ---------- detail pages: fill from ?id= ---------- */
  function fillDetail() {
    $$('[data-detail]').forEach(function (root) {
      var set = DATA[root.getAttribute('data-detail')] || [], id = +(qs('id') || 0);
      var it = set[id]; if (!it) return;
      $$('[data-f]', root).forEach(function (e) {
        var k = e.getAttribute('data-f'); if (it[k] == null) return;
        if (k === 'price' || k === 'was') e.textContent = fmt(it[k]); else e.innerHTML = it[k];
      });
      $$('[data-fimg]', root).forEach(function (e) { var k = e.getAttribute('data-fimg'); if (it[k]) e.src = it[k]; });
      if (it.gallery) $$('[data-thumb]', root).forEach(function (t, i) { if (it.gallery[i]) { t.setAttribute('data-thumb', it.gallery[i]); var im = t.querySelector('img'); if (im) im.src = it.gallery[i]; } });
      if (it.gallery) {
        var off = root.querySelector('[data-lightbox] img[data-fimg]') ? 0 : 1;
        $$('[data-lightbox]', root).forEach(function (a, i) { var g = it.gallery[i + off]; if (g) { a.href = g; var im = a.querySelector('img'); if (im) im.src = g; } });
      }
      var pdp = $('[data-pdp]', root); if (pdp) pdp.setAttribute('data-id', id);
      var addb = $('[data-add]', root); if (addb) addb.setAttribute('data-add', id);
      if ((it.name || it.title) && root.querySelector('[data-f="name"],[data-f="title"]')) D.title = (it.name || it.title) + ' \u2014 ' + (DATA.brand || '');
    });
  }

  /* ---------- forms ---------- */
  D.addEventListener('submit', function (e) {
    var f = e.target;
    if (f.getAttribute('action') && f.getAttribute('action') !== '#') return;
    e.preventDefault();
    var bad = 0;
    $$('input, textarea, select', f).forEach(function (i) {
      var err = i.parentNode.querySelector('.xi-err');
      var v = (i.value || '').trim(), msg = '';
      if (i.required && !v && i.type !== 'checkbox') msg = 'This field is required';
      else if (i.type === 'checkbox' && i.required && !i.checked) msg = 'Please accept to continue';
      else if (i.type === 'email' && v && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) msg = 'Enter a valid email address';
      else if (i.type === 'tel' && v && v.replace(/\D/g, '').length < 7) msg = 'Enter a valid phone number';
      else if (i.minLength > 0 && v && v.length < i.minLength) msg = 'Use at least ' + i.minLength + ' characters';
      i.classList.toggle('xi-bad', !!msg);
      if (msg) { bad++; if (!err) { err = D.createElement('small'); err.className = 'xi-err'; i.insertAdjacentElement('afterend', err); } err.textContent = msg; }
      else if (err) err.remove();
    });
    if (bad) { toast('Please check the highlighted fields'); return; }
    var ok = f.getAttribute('data-ok') || (f.querySelector('input[type=email]') && $$('input', f).length <= 2 ? 'Thanks for subscribing! Check your inbox for a welcome gift.' : 'Thank you! We\'ll be in touch shortly.');
    var box = f.querySelector('.xi-success');
    if (box) { box.innerHTML = '✓ ' + ok; box.hidden = false; } else toast('✓ ' + ok);
    f.reset();
  });
  D.addEventListener('input', function (e) { if (e.target.classList && e.target.classList.contains('xi-bad')) { e.target.classList.remove('xi-bad'); var er = e.target.parentNode.querySelector('.xi-err'); if (er) er.remove(); } });

  /* ---------- pricing toggle ---------- */
  $$('[data-billing]').forEach(function (sw) {
    sw.addEventListener('click', function (e) {
      e.preventDefault();
      var y = sw.classList.toggle('on');
      $$('[data-m]').forEach(function (p) { p.textContent = y ? p.getAttribute('data-y') : p.getAttribute('data-m'); });
      $$('[data-per]').forEach(function (p) { p.textContent = y ? '/year' : '/month'; });
      $$('.xi-bill-l').forEach(function (l, i) { l.classList.toggle('on', y ? i === 1 : i === 0); });
    });
  });

  /* ---------- lightbox ---------- */
  var lb, lbList = [], lbI = 0;
  function lbShow(i) { lbI = (i + lbList.length) % lbList.length; lb.querySelector('img').src = lbList[lbI].getAttribute('href'); lb.querySelector('figcaption').textContent = lbList[lbI].getAttribute('data-cap') || ''; }
  D.addEventListener('click', function (e) {
    var a = e.target.closest('[data-lightbox]'); if (!a) return;
    e.preventDefault();
    lbList = $$('[data-lightbox]');
    if (!lb) {
      lb = D.createElement('div'); lb.className = 'xi-lb';
      lb.innerHTML = '<button class="xi-lb-x" aria-label="Close">×</button><button class="xi-lb-p" aria-label="Previous">‹</button><figure><img alt=""><figcaption></figcaption></figure><button class="xi-lb-n" aria-label="Next">›</button>';
      D.body.appendChild(lb);
      lb.addEventListener('click', function (ev) {
        if (ev.target.closest('.xi-lb-p')) lbShow(lbI - 1); else if (ev.target.closest('.xi-lb-n')) lbShow(lbI + 1);
        else if (ev.target === lb || ev.target.closest('.xi-lb-x')) lb.classList.remove('on');
      });
      D.addEventListener('keydown', function (ev) {
        if (!lb.classList.contains('on')) return;
        if (ev.key === 'Escape') lb.classList.remove('on'); if (ev.key === 'ArrowLeft') lbShow(lbI - 1); if (ev.key === 'ArrowRight') lbShow(lbI + 1);
      });
    }
    lbShow(lbList.indexOf(a)); lb.classList.add('on');
  });

  /* ---------- mobile menu ---------- */
  var menu;
  function openMenu() {
    if (!menu) {
      var pages = DATA.pages || [];
      menu = D.createElement('div'); menu.className = 'xi-menu';
      menu.innerHTML = '<div class="xi-menu-panel"><div class="xi-menu-top"><b>' + (DATA.brand || 'Menu') + '</b><button aria-label="Close menu">×</button></div><nav>' +
        '<a href="index.html">Home</a>' + pages.filter(function (p) { return ['product','post','project','property','tour','model','service'].indexOf(p[0]) < 0; }).map(function (p) { return '<a href="' + p[0] + '.html">' + p[1] + '</a>'; }).join('') + '</nav></div>';
      D.body.appendChild(menu);
      menu.addEventListener('click', function (e) { if (e.target === menu || e.target.closest('.xi-menu-top button')) menu.classList.remove('on'); });
    }
    menu.classList.add('on');
  }
  function burger() {
    if (!(DATA.pages || []).length) return;
    var b = D.createElement('button'); b.className = 'xi-burger' + (DATA.burgerAlways ? ' xi-always' : ''); b.setAttribute('aria-label', 'Open menu'); b.setAttribute('data-xi-menu', '');
    b.innerHTML = '<span></span><span></span><span></span>';
    D.body.appendChild(b);
  }

  /* ---------- reveal ---------- */
  function reveal() {
    var els = $$('.xi-rv');
    if (!('IntersectionObserver' in W)) { els.forEach(function (e) { e.classList.add('xi-show'); }); return; }
    var io = new IntersectionObserver(function (en) { en.forEach(function (x) { if (x.isIntersecting) { x.target.classList.add('xi-show'); io.unobserve(x.target); } }); }, { rootMargin: '0px 0px -8% 0px' });
    els.forEach(function (e, i) { e.style.transitionDelay = (i % 4) * 70 + 'ms'; io.observe(e); });
    setTimeout(function () { els.forEach(function (e) { if (e.getBoundingClientRect().top < innerHeight * 1.1) e.classList.add('xi-show'); }); }, 1800);
  }

  /* ---------- band title colour (inner pages) ---------- */
  function band() {
    var t = $('.xi-ph-band'); if (!t) return;
    var a = $('[data-xnav] a') || $('[data-xnav]'); if (!a) return;
    var c = getComputedStyle(a).color, m = c.match(/\d+(\.\d+)?/g);
    if (!m) return;
    var l = (0.299 * m[0] + 0.587 * m[1] + 0.114 * m[2]) / 255;
    var img = false, el = t.parentNode;
    while (el && el !== D.body) {
      if (el.classList && el.classList.contains('xi-band') && /url\(/.test(getComputedStyle(el).backgroundImage)) img = true;
      el = el.parentNode;
    }
    if (img) { t.classList.add('xi-scrim', 'xi-light'); t.style.color = '#fff'; }
    else { t.style.color = c; t.classList.add(l > 0.6 ? 'xi-light' : 'xi-darkt'); }
    var nav = $('[data-xnav]'), base = parseFloat(getComputedStyle(t).paddingTop) || 0;
    function fit() {
      t.style.paddingTop = '';
      var pos = getComputedStyle(nav).position;
      if (pos !== 'absolute' && pos !== 'fixed') return;
      var nb = nav.getBoundingClientRect().bottom, tt = t.getBoundingClientRect().top;
      if (nb > tt - 16) t.style.paddingTop = (base + nb - tt + 16) + 'px';
    }
    fit(); W.addEventListener('resize', fit); W.addEventListener('load', fit);
  }

  /* ---------- current page in nav ---------- */
  function active() {
    var nav = $('[data-xnav]'); if (!nav) return;
    var file = (location.pathname.split('/').pop() || 'index.html');
    if (file === 'index.html') return;
    var links = $$('a', nav), cls = null;
    links.forEach(function (a) { ['active', 'on', 'current', 'is-active'].forEach(function (k) { if (a.classList.contains(k)) { cls = k; a.classList.remove(k); } }); });
    var base = file.replace('.html', ''), map = { product: 'shop', cart: 'shop', post: 'blog', project: 'projects', property: 'properties', tour: 'destinations', model: 'models', service: 'services' };
    var want = [file, (map[base] || base) + '.html'];
    var hit = links.filter(function (a) { var h = (a.getAttribute('href') || '').split('?')[0]; return want.indexOf(h) >= 0; })[0];
    if (hit && cls) hit.classList.add(cls);
  }

  function init() {
    $$("form").forEach(function (f) { if (!f.getAttribute("action") || f.getAttribute("action") === "#") f.noValidate = true; });
    active(); band(); fillDetail(); initFilters(); renderCart(); badges(); burger(); reveal();
  }
  if (D.readyState === 'loading') D.addEventListener('DOMContentLoaded', init); else init();
})();
