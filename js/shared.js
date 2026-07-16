/* ============================================================
   shared.js — Sabhi pages ka common JavaScript
   Navbar toggle, toast, modal, scroll reveal — sab yahan
   ============================================================ */

/* ===== NAVBAR HAMBURGER TOGGLE ===== */
/* Ye mobile mein menu open/close karta hai */
function sInitNav() {
  var ham  = document.querySelector('.s-hamburger');
  var menu = document.querySelector('.s-mobile-menu');
  if (!ham || !menu) return;

  ham.addEventListener('click', function () {
    ham.classList.toggle('open');
    menu.classList.toggle('open');
  });

  /* Link click pe menu band karo */
  menu.querySelectorAll('.s-nav-link').forEach(function (l) {
    l.addEventListener('click', function () {
      ham.classList.remove('open');
      menu.classList.remove('open');
    });
  });

  /* Current page ka link active karo */
  var page = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.s-nav-link').forEach(function (l) {
    var href = (l.getAttribute('href') || '').split('/').pop();
    if (href === page || (page === '' && href === 'index.html')) l.classList.add('active');
  });
}

/* ===== TOAST ===== */
/* Ye notification toast dikhata hai */
function sToast(msg, type) {
  type = type || 'success';
  var icons   = { success: 'check_circle', error: 'error', info: 'info' };
  var colors  = { success: '#34d399',      error: '#f87171', info: '#60a5fa' };

  var box = document.getElementById('sToastContainer');
  if (!box) {
    box = document.createElement('div');
    box.id = 'sToastContainer';
    document.body.appendChild(box);
  }

  var t = document.createElement('div');
  t.className = 's-toast';
  t.innerHTML = '<span class="s-toast-icon material-symbols-outlined" style="color:' + colors[type] + '">' + icons[type] + '</span><span>' + msg + '</span>';
  box.appendChild(t);

  setTimeout(function () {
    t.style.transition = 'all 0.3s';
    t.style.opacity = '0';
    t.style.transform = 'translateX(16px)';
    setTimeout(function () { t.remove(); }, 300);
  }, 3000);
}

/* ===== MODAL ===== */
function sOpenModal(id)  { var m = document.getElementById(id); if (m) { m.classList.add('open');    document.body.style.overflow = 'hidden'; } }
function sCloseModal(id) { var m = document.getElementById(id); if (m) { m.classList.remove('open'); document.body.style.overflow = ''; } }

document.addEventListener('click', function (e) {
  if (e.target.classList.contains('s-modal-backdrop')) {
    e.target.closest('.s-modal').classList.remove('open');
    document.body.style.overflow = '';
  }
});

/* ===== SCROLL REVEAL ===== */
/* Ye elements ko scroll pe fade-in karta hai */
function sInitReveal() {
  var obs = new IntersectionObserver(function (entries) {
    entries.forEach(function (en, i) {
      if (en.isIntersecting) {
        setTimeout(function () { en.target.classList.add('revealed'); }, (en.target.dataset.delay || 0) * 1);
        obs.unobserve(en.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('[data-reveal]').forEach(function (el) { obs.observe(el); });
}

/* ===== COUNTER ANIMATION ===== */
/* Ye stat numbers ko animate karta hai jab visible ho */
function sInitCounters() {
  var obs = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (!en.isIntersecting) return;
      obs.unobserve(en.target);
      var el  = en.target;
      var end = parseFloat(el.getAttribute('data-count'));
      var suf = el.getAttribute('data-suffix') || '';
      var dur = 1600, t0 = null;

      function tick(ts) {
        if (!t0) t0 = ts;
        var p = Math.min((ts - t0) / dur, 1);
        var v = end * (1 - Math.pow(1 - p, 3));
        el.textContent = (v >= 1000 ? (v / 1000).toFixed(v % 1000 ? 1 : 0) + 'k' : Math.round(v)) + suf;
        if (p < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    });
  }, { threshold: 0.4 });

  document.querySelectorAll('[data-count]').forEach(function (el) { obs.observe(el); });
}

/* ===== INIT ON LOAD ===== */
document.addEventListener('DOMContentLoaded', function () {
  sInitNav();
  sInitReveal();
  sInitCounters();
});

/* ===== COMPATIBILITY ALIASES ===== */
/* About, Admin, Categories pages purane function names use karte hain */

/* showToast — style.css pages ke liye (inline toast using CSS vars) */
function showToast(msg) {
  var t  = document.getElementById('toast');
  var m  = document.getElementById('toastMsg');
  if (t && m) {
    m.textContent = msg;
    t.style.opacity = '1';
    t.style.pointerEvents = 'auto';
    clearTimeout(t._timer);
    t._timer = setTimeout(function () {
      t.style.opacity = '0';
      t.style.pointerEvents = 'none';
    }, 3000);
  } else {
    /* Fallback to sToast for pages without inline toast div */
    sToast(msg, 'success');
  }
}

/* toggleTheme — admin/categories/about pages ke liye */
function toggleTheme() {
  var html = document.documentElement;
  var cur  = html.getAttribute('data-theme') || 'dark';
  var next = cur === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-theme', next);
  try { localStorage.setItem('ep_theme', next); } catch(e) {}
  var icon = document.getElementById('themeIcon');
  if (icon) icon.textContent = next === 'dark' ? 'dark_mode' : 'light_mode';
}

/* Restore saved theme on load */
(function () {
  try {
    var saved = localStorage.getItem('ep_theme') || localStorage.getItem('eventpulse_theme');
    if (saved && saved !== 'dark') {
      document.documentElement.setAttribute('data-theme', saved);
      document.addEventListener('DOMContentLoaded', function () {
        var icon = document.getElementById('themeIcon');
        if (icon) icon.textContent = saved === 'dark' ? 'dark_mode' : 'light_mode';
      });
    }
  } catch(e) {}
})();
