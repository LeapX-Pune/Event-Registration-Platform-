/* ============================================================
   main.js — EventPulse shared JavaScript
   Ye file sabhi pages pe include hoti hai
   ============================================================ */

/* ===== NAVBAR KA HAMBURGER TOGGLE ===== */
/* Ye mobile mein navbar open/close karta hai */
function epInitNavbar() {
  var hamburger = document.querySelector('.ep-hamburger');
  var mobileMenu = document.querySelector('.ep-mobile-menu');
  if (!hamburger || !mobileMenu) return;

  hamburger.addEventListener('click', function () {
    hamburger.classList.toggle('open');
    mobileMenu.classList.toggle('open');
  });

  /* Mobile menu ke links click pe band ho jaaye */
  mobileMenu.querySelectorAll('.ep-nav-link').forEach(function (link) {
    link.addEventListener('click', function () {
      hamburger.classList.remove('open');
      mobileMenu.classList.remove('open');
    });
  });

  /* Current page ka nav link active mark karo */
  var path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.ep-nav-link').forEach(function (link) {
    var href = link.getAttribute('href') || '';
    if (href === path || (path === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
}

/* ===== TOAST NOTIFICATION ===== */
/* Ye screen ke corner mein notification dikhata hai */
function epToast(message, type) {
  type = type || 'success';
  var icons = { success: '✓', error: '✕', info: 'ℹ' };
  var colors = { success: '#34d399', error: '#f87171', info: '#60a5fa' };

  var container = document.getElementById('epToastContainer');
  if (!container) {
    container = document.createElement('div');
    container.id = 'epToastContainer';
    container.className = 'ep-toast-container';
    document.body.appendChild(container);
  }

  var toast = document.createElement('div');
  toast.className = 'ep-toast ep-toast-' + type;
  toast.innerHTML =
    '<span class="ep-toast-icon" style="color:' + colors[type] + '">' + icons[type] + '</span>' +
    '<span>' + message + '</span>';
  container.appendChild(toast);

  setTimeout(function () {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(20px)';
    toast.style.transition = 'all 0.3s';
    setTimeout(function () { toast.remove(); }, 300);
  }, 3000);
}

/* ===== MODAL HELPERS ===== */
function epOpenModal(id) {
  var m = document.getElementById(id);
  if (m) { m.classList.add('open'); document.body.style.overflow = 'hidden'; }
}
function epCloseModal(id) {
  var m = document.getElementById(id);
  if (m) { m.classList.remove('open'); document.body.style.overflow = ''; }
}
/* Backdrop click se modal band hoga */
document.addEventListener('click', function (e) {
  if (e.target.classList.contains('ep-modal-backdrop')) {
    e.target.closest('.ep-modal-overlay').classList.remove('open');
    document.body.style.overflow = '';
  }
});

/* ===== SCROLL REVEAL ANIMATION ===== */
/* Ye elements ko scroll karne pe fade-in karta hai */
function epInitScrollReveal() {
  var els = document.querySelectorAll('[data-reveal]');
  if (!els.length) return;

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('ep-revealed');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  els.forEach(function (el, i) {
    el.style.transition = 'opacity 0.5s ease ' + (i % 4 * 0.08) + 's, transform 0.5s ease ' + (i % 4 * 0.08) + 's';
    observer.observe(el);
  });
}

/* ===== COUNTER ANIMATION ===== */
/* Ye stat numbers ko animate karta hai */
function epAnimateCounters() {
  document.querySelectorAll('[data-count]').forEach(function (el) {
    var target = parseFloat(el.getAttribute('data-count'));
    var suffix = el.getAttribute('data-suffix') || '';
    var start = 0;
    var dur = 1800;
    var t0 = null;

    function step(ts) {
      if (!t0) t0 = ts;
      var p = Math.min((ts - t0) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      var val = target * eased;
      el.textContent = (val >= 1000 ? (val / 1000).toFixed(1) + 'k' : Math.round(val)) + suffix;
      if (p < 1) requestAnimationFrame(step);
      else el.textContent = (target >= 1000 ? (target / 1000).toFixed(target % 1000 ? 1 : 0) + 'k' : target) + suffix;
    }

    var observer = new IntersectionObserver(function (entries) {
      if (entries[0].isIntersecting) {
        requestAnimationFrame(step);
        observer.disconnect();
      }
    }, { threshold: 0.5 });
    observer.observe(el);
  });
}

/* ===== PAGE INIT ===== */
document.addEventListener('DOMContentLoaded', function () {
  epInitNavbar();
  epInitScrollReveal();
  epAnimateCounters();

  /* Scroll reveal CSS inject karo agar nahi hai */
  if (!document.getElementById('epRevealStyle')) {
    var s = document.createElement('style');
    s.id = 'epRevealStyle';
    s.textContent =
      '[data-reveal]{opacity:0;transform:translateY(24px);}' +
      '[data-reveal="left"]{transform:translateX(-24px);}' +
      '[data-reveal="right"]{transform:translateX(24px);}' +
      '.ep-revealed{opacity:1!important;transform:translate(0)!important;}';
    document.head.appendChild(s);
  }
});
