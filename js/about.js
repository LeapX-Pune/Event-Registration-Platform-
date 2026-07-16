/* =====================================================
   EventPulse - About Page Interactions (JS)
   Ye file about us page ke counters, scroll-reveals aur theme toggling handle karti hai
   ===================================================== */

/* ----- Theme Sync (Dark/Light) ----- */
function toggleTheme() {
  var html = document.documentElement;
  var current = html.getAttribute('data-theme') || 'dark';
  var next = current === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-theme', next);
  localStorage.setItem('eventpulse_theme', next);
  var icon = document.getElementById('themeIcon');
  if (icon) icon.textContent = next === 'dark' ? 'dark_mode' : 'light_mode';
}

(function initTheme() {
  var saved = localStorage.getItem('eventpulse_theme');
  if (saved) {
    document.documentElement.setAttribute('data-theme', saved);
    var icon = document.getElementById('themeIcon');
    if (icon) icon.textContent = saved === 'dark' ? 'dark_mode' : 'light_mode';
  }
})();

/* ----- Mobile Nav Drawer Toggles ----- */
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

/* ----- Toast Feedback Notification Alerts ----- */
var toastTimer = null;
function showToast(message) {
  var toast = document.getElementById('aboutToast');
  var msgEl = document.getElementById('aboutToastMsg');
  if (!toast || !msgEl) return;

  msgEl.textContent = message;
  toast.classList.add('active');

  clearTimeout(toastTimer);
  toastTimer = setTimeout(function() {
    toast.classList.remove('active');
  }, 3500);
}

function triggerContactMsg() {
  showToast('Connecting you with the partner program executive. Live chat loading!');
}

/* ----- IntersectionObserver for Scroll Reveal & Counter Increments ----- */
document.addEventListener('DOMContentLoaded', function() {
  var revealElements = document.querySelectorAll('.reveal');
  var statsNumbers = document.querySelectorAll('.about-stat-number');
  var countersTriggered = false;

  // Number counting animation logic
  function startCounting() {
    if (countersTriggered) return;
    countersTriggered = true;

    statsNumbers.forEach(function(numEl) {
      var target = parseInt(numEl.getAttribute('data-target'), 10);
      var current = 0;
      var duration = 2000; // 2 seconds counting duration
      var increment = target / (duration / 16); // ~60fps refresh interval
      
      var timer = setInterval(function() {
        current += increment;
        if (current >= target) {
          clearInterval(timer);
          numEl.textContent = target.toLocaleString() + (target === 12 ? '' : '+');
        } else {
          numEl.textContent = Math.floor(current).toLocaleString() + '+';
        }
      }, 16);
    });
  }

  // Set up IntersectionObserver
  if ('IntersectionObserver' in window) {
    // 1. Reveal Animations observer
    var revealObserver = new IntersectionObserver(function(entries, observer) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          
          // Trigger counting if statistics block is revealed
          if (entry.target.classList.contains('about-stats')) {
            startCounting();
          }
          
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(function(el) {
      revealObserver.observe(el);
    });
  } else {
    // Fallback if observer is unsupported
    revealElements.forEach(function(el) {
      el.classList.add('visible');
    });
    startCounting();
  }
});
