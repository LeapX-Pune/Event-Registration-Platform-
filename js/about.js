/* =====================================================
   EventPulse - About Page Interactions (JS)
   ===================================================== */

/* Theme: js/utils/theme.js | Contact: js/components/contactModal.js */

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

/* Contact modal opened via data-open-contact / openContactModal() */
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
