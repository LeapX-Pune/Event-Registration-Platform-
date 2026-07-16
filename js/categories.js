/* =====================================================
   EventPulse - Categories Page Interactions (JS)
   Ye script file categories grid animations aur feedback mechanisms handle karti hai
   ===================================================== */

/* ----- Theme Handling (Dark/Light) ----- */
/* Theme toggle configuration */
function toggleTheme() {
  var html = document.documentElement;
  var current = html.getAttribute('data-theme') || 'dark';
  var next = current === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-theme', next);
  localStorage.setItem('eventpulse_theme', next);
  var icon = document.getElementById('themeIcon');
  if (icon) icon.textContent = next === 'dark' ? 'dark_mode' : 'light_mode';
}

/* Page load standard template check to sync theme settings */
(function initTheme() {
  var saved = localStorage.getItem('eventpulse_theme');
  if (saved) {
    document.documentElement.setAttribute('data-theme', saved);
    var icon = document.getElementById('themeIcon');
    if (icon) icon.textContent = saved === 'dark' ? 'dark_mode' : 'light_mode';
  }
})();

/* ----- Mobile Nav Drawer Toggles ----- */
/* Hamburger click drawer animations */
var mobileMenuBtn = document.getElementById('mobileMenuBtn');
var mobileNavOverlay = document.getElementById('mobileNavOverlay');
var mobileNavDrawer = document.getElementById('mobileNavDrawer');

if (mobileMenuBtn) {
  mobileMenuBtn.addEventListener('click', function() {
    mobileNavDrawer.classList.add('open');
    mobileNavOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  });
}

if (mobileNavOverlay) {
  mobileNavOverlay.addEventListener('click', closeMobileNav);
}

function closeMobileNav() {
  if (mobileNavDrawer) mobileNavDrawer.classList.remove('open');
  if (mobileNavOverlay) mobileNavOverlay.classList.remove('open');
  document.body.style.overflow = '';
}

/* ----- Scroll Reveal Grid Animation ----- */
/* Cards slide and fade-in on scrolling down */
document.addEventListener('DOMContentLoaded', function() {
  var revealCards = document.querySelectorAll('.reveal');
  
  if ('IntersectionObserver' in window) {
    var cardObserver = new IntersectionObserver(function(entries, observer) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    revealCards.forEach(function(card) {
      cardObserver.observe(card);
    });
  } else {
    // Fallback if IntersectionObserver is not supported
    revealCards.forEach(function(card) {
      card.classList.add('visible');
    });
  }
});

/* ----- Search Bar Glow Ring Focus Effect ----- */
/* Focus styles handled dynamically */
function focusSearch(isFocused) {
  var bar = document.getElementById('catSearchBar');
  if (!bar) return;
  if (isFocused) {
    bar.style.borderColor = 'var(--primary)';
  } else {
    bar.style.borderColor = 'rgba(77, 67, 83, 0.4)';
  }
}

/* ----- Toast Alerts Feedback ----- */
var toastTimer = null;
function showToast(message) {
  var toast = document.getElementById('catToast');
  var msgEl = document.getElementById('catToastMsg');
  if (!toast || !msgEl) return;

  msgEl.textContent = message;
  toast.classList.add('active');

  clearTimeout(toastTimer);
  toastTimer = setTimeout(function() {
    toast.classList.remove('active');
  }, 3500);
}

/* ----- Newsletter Subscription simulation ----- */
/* Successful subscription notifications flow */
function triggerSubscribe() {
  showToast('Thank you for subscribing! Check your inbox for updates.');
}

/* Category cards redirection simulation feedback */
var catCards = document.querySelectorAll('.cat-card');
catCards.forEach(function(card) {
  card.addEventListener('click', function() {
    var catName = this.querySelector('.cat-card-title').textContent.trim();
    showToast('Redirecting to curated list for ' + catName + ' events...');
  });
});
