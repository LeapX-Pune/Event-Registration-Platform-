/* =====================================================
   EventPulse - Homepage JS
   Ye file homepage ke saare interactive elements handle karti hai
   ===================================================== */

/* ----- Theme Toggle (Dark/Light) ----- */
/* Ye function dark aur light mode toggle karta hai */
function toggleTheme() {
  var html = document.documentElement;
  var current = html.getAttribute('data-theme') || 'dark';
  var next = current === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-theme', next);
  localStorage.setItem('eventpulse_theme', next);
  var icon = document.getElementById('themeIcon');
  if (icon) icon.textContent = next === 'dark' ? 'dark_mode' : 'light_mode';
}

/* Ye function page load pe saved theme apply karta hai */
(function initTheme() {
  var saved = localStorage.getItem('eventpulse_theme');
  if (saved) {
    document.documentElement.setAttribute('data-theme', saved);
    var icon = document.getElementById('themeIcon');
    if (icon) icon.textContent = saved === 'dark' ? 'dark_mode' : 'light_mode';
  }
})();

/* ----- Mobile Navigation Drawer ----- */
/* Ye mobile menu ke liye drawer open/close karta hai */
var mobileMenuBtn = document.getElementById('mobileMenuBtn');
var mobileNavOverlay = document.getElementById('mobileNavOverlay');
var mobileNavDrawer = document.getElementById('mobileNavDrawer');

if (mobileMenuBtn) {
  mobileMenuBtn.addEventListener('click', function () {
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

/* ----- Hero Carousel ----- */
/* Ye hero section ka carousel/slider manage karta hai */
(function initHeroCarousel() {
  var carousel = document.querySelector('.hero-carousel');
  var prevBtn = document.querySelector('.hero-nav-btn.prev');
  var nextBtn = document.querySelector('.hero-nav-btn.next');
  var dotsContainer = document.getElementById('heroDots');

  if (!carousel) return;

  var slides = carousel.querySelectorAll('.hero-slide');
  var totalSlides = slides.length;
  var currentIndex = 0;
  var autoPlayTimer = null;

  /* Dots banao agar container available hai */
  if (dotsContainer && totalSlides > 1) {
    for (var i = 0; i < totalSlides; i++) {
      var dot = document.createElement('button');
      dot.className = 'hero-dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('aria-label', 'Slide ' + (i + 1));
      dot.setAttribute('data-idx', i);
      dotsContainer.appendChild(dot);
    }
    dotsContainer.addEventListener('click', function (e) {
      var btn = e.target.closest('.hero-dot');
      if (btn) goToSlide(parseInt(btn.getAttribute('data-idx')));
    });
  }

  /* Specific slide pe jaao */
  function goToSlide(idx) {
    currentIndex = (idx + totalSlides) % totalSlides;
    carousel.scrollTo({ left: currentIndex * carousel.offsetWidth, behavior: 'smooth' });
    updateDots();
  }

  function updateDots() {
    if (!dotsContainer) return;
    var dots = dotsContainer.querySelectorAll('.hero-dot');
    dots.forEach(function (d, i) {
      d.classList.toggle('active', i === currentIndex);
    });
  }

  /* Scroll se current index detect karo */
  carousel.addEventListener('scroll', function () {
    var idx = Math.round(carousel.scrollLeft / carousel.offsetWidth);
    if (idx !== currentIndex) {
      currentIndex = idx;
      updateDots();
    }
  });

  /* Previous button click */
  if (prevBtn) prevBtn.addEventListener('click', function () { goToSlide(currentIndex - 1); resetAutoplay(); });
  /* Next button click */
  if (nextBtn) nextBtn.addEventListener('click', function () { goToSlide(currentIndex + 1); resetAutoplay(); });

  /* Auto-play carousel har 4 seconds mein next slide */
  function startAutoplay() {
    autoPlayTimer = setInterval(function () {
      goToSlide(currentIndex + 1);
    }, 4000);
  }

  function resetAutoplay() {
    clearInterval(autoPlayTimer);
    startAutoplay();
  }

  startAutoplay();

  /* Hover pe autoplay pause karo */
  var heroSection = document.querySelector('.hero-section');
  if (heroSection) {
    heroSection.addEventListener('mouseenter', function () { clearInterval(autoPlayTimer); });
    heroSection.addEventListener('mouseleave', startAutoplay);
  }
})();

/* ----- Chat Widget ----- */
/* ChatWidget is initialised on first open via toggleChat() in chatWidget.js.
   toggleChat() is defined there and called by the FAB button in index.html.
   No stub logic needed here — all chat behaviour lives in chatWidget.js + chatbot.js. */

/* Seed localStorage with DEFAULT_EVENTS if not already set.
   This ensures Storage.load() returns live data (including admin edits/deletes)
   rather than always falling back to the hardcoded DEFAULT_EVENTS constant. */
if (typeof Storage !== 'undefined' && Storage.init) {
  Storage.init();
}

/* ----- Empty State Reset ----- */
/* Search empty state reset karta hai */
function resetEmpty() {
  var empty = document.getElementById('emptyState');
  var container = document.getElementById('eventsContainer');
  if (empty) empty.style.display = 'none';
  if (container) container.style.display = 'flex';
}

/* ----- Smooth Scroll ----- */
/* Anchor links ke liye smooth scroll */
document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
  anchor.addEventListener('click', function (e) {
    var target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

/* ----- Navbar Scroll Effect ----- */
/* Scroll karne par navbar ka shadow change hota hai */
window.addEventListener('scroll', function () {
  var navbar = document.querySelector('.navbar');
  if (navbar) {
    if (window.scrollY > 20) {
      navbar.style.boxShadow = '0 4px 30px rgba(0,0,0,0.4)';
    } else {
      navbar.style.boxShadow = '0 1px 20px rgba(0,0,0,0.3)';
    }
  }
}, { passive: true });
