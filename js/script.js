/* =====================================================
   EventPulse - Homepage JS
   ===================================================== */

/* Theme helpers live in js/utils/theme.js (toggleTheme / applyTheme). */

/* ----- Mobile Navigation Drawer ----- */
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

/* ----- Hero Carousel (transform-based, infinite, swipe) ----- */
(function initHeroCarousel() {
  var wrap = document.querySelector('.hero-carousel-wrap');
  var carousel = document.querySelector('.hero-carousel');
  var track = document.querySelector('.hero-carousel-track');
  var prevBtn = document.querySelector('.hero-nav-btn.prev');
  var nextBtn = document.querySelector('.hero-nav-btn.next');
  var dotsContainer = document.getElementById('heroDots');

  if (!carousel || !track) return;

  var slides = Array.prototype.slice.call(track.querySelectorAll('.hero-slide'));
  var total = slides.length;
  if (total === 0) return;

  var index = 0;
  var autoPlayTimer = null;
  var isAnimating = false;
  var dragStartX = 0;
  var dragDelta = 0;
  var isDragging = false;

  /* Image loading states */
  slides.forEach(function (slide) {
    var img = slide.querySelector('img');
    if (!img) return;
    slide.classList.add('is-loading');
    function markLoaded() {
      img.classList.add('is-loaded');
      slide.classList.remove('is-loading');
    }
    if (img.complete && img.naturalWidth) markLoaded();
    else {
      img.addEventListener('load', markLoaded);
      img.addEventListener('error', function () {
        slide.classList.remove('is-loading');
        img.style.display = 'none';
      });
    }
  });

  if (dotsContainer && total > 1) {
    dotsContainer.innerHTML = '';
    for (var i = 0; i < total; i++) {
      var dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'hero-dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('aria-label', 'Go to slide ' + (i + 1));
      dot.setAttribute('data-idx', String(i));
      dotsContainer.appendChild(dot);
    }
    dotsContainer.addEventListener('click', function (e) {
      var btn = e.target.closest('.hero-dot');
      if (!btn) return;
      goTo(parseInt(btn.getAttribute('data-idx'), 10));
      resetAutoplay();
    });
  }

  function updateDots() {
    if (!dotsContainer) return;
    var dots = dotsContainer.querySelectorAll('.hero-dot');
    dots.forEach(function (d, i) {
      d.classList.toggle('active', i === index);
    });
  }

  function setTransform(offsetPx, withTransition) {
    if (!withTransition) track.classList.add('no-transition');
    else track.classList.remove('no-transition');
    track.style.transform = 'translate3d(' + (-index * 100 + offsetPx) + '%, 0, 0)';
    if (!withTransition) {
      void track.offsetHeight;
      track.classList.remove('no-transition');
    }
  }

  function goTo(idx, instant) {
    var nextIndex = ((idx % total) + total) % total;
    var wrapping = Math.abs(nextIndex - index) > 1 || (index === total - 1 && nextIndex === 0) || (index === 0 && nextIndex === total - 1 && idx < index);

    // Instant jump when wrapping for seamless infinite loop
    if (wrapping && total > 2) {
      index = nextIndex;
      setTransform(0, false);
      updateDots();
      return;
    }

    if (isAnimating && !instant) return;
    isAnimating = true;
    index = nextIndex;
    setTransform(0, !instant);
    updateDots();
    setTimeout(function () { isAnimating = false; }, instant ? 0 : 560);
  }

  function next() { goTo(index + 1); }
  function prev() { goTo(index - 1); }

  if (prevBtn) prevBtn.addEventListener('click', function () { prev(); resetAutoplay(); });
  if (nextBtn) nextBtn.addEventListener('click', function () { next(); resetAutoplay(); });

  function startAutoplay() {
    clearInterval(autoPlayTimer);
    if (total < 2) return;
    autoPlayTimer = setInterval(next, 4500);
  }

  function resetAutoplay() {
    clearInterval(autoPlayTimer);
    startAutoplay();
  }

  var heroSection = document.querySelector('.hero-section');
  if (heroSection) {
    heroSection.addEventListener('mouseenter', function () { clearInterval(autoPlayTimer); });
    heroSection.addEventListener('mouseleave', startAutoplay);
    heroSection.addEventListener('focusin', function () { clearInterval(autoPlayTimer); });
    heroSection.addEventListener('focusout', startAutoplay);
  }

  /* Pointer / touch swipe */
  function onPointerDown(clientX) {
    isDragging = true;
    dragStartX = clientX;
    dragDelta = 0;
    carousel.classList.add('is-dragging');
    track.classList.add('no-transition');
    clearInterval(autoPlayTimer);
  }

  function onPointerMove(clientX) {
    if (!isDragging) return;
    dragDelta = clientX - dragStartX;
    var pct = (dragDelta / carousel.offsetWidth) * 100;
    track.style.transform = 'translate3d(' + (-index * 100 + pct) + '%, 0, 0)';
  }

  function onPointerUp() {
    if (!isDragging) return;
    isDragging = false;
    carousel.classList.remove('is-dragging');
    track.classList.remove('no-transition');
    var threshold = carousel.offsetWidth * 0.18;
    if (dragDelta < -threshold) next();
    else if (dragDelta > threshold) prev();
    else setTransform(0, true);
    dragDelta = 0;
    resetAutoplay();
  }

  carousel.addEventListener('touchstart', function (e) {
    if (e.touches.length !== 1) return;
    onPointerDown(e.touches[0].clientX);
  }, { passive: true });

  carousel.addEventListener('touchmove', function (e) {
    if (!isDragging || e.touches.length !== 1) return;
    onPointerMove(e.touches[0].clientX);
  }, { passive: true });

  carousel.addEventListener('touchend', onPointerUp);
  carousel.addEventListener('touchcancel', onPointerUp);

  carousel.addEventListener('mousedown', function (e) {
    if (e.button !== 0) return;
    e.preventDefault();
    onPointerDown(e.clientX);
  });
  window.addEventListener('mousemove', function (e) { onPointerMove(e.clientX); });
  window.addEventListener('mouseup', onPointerUp);

  /* Keyboard */
  if (wrap) {
    wrap.setAttribute('tabindex', '0');
    wrap.setAttribute('aria-roledescription', 'carousel');
    wrap.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') { prev(); resetAutoplay(); }
      if (e.key === 'ArrowRight') { next(); resetAutoplay(); }
    });
  }

  setTransform(0, false);
  updateDots();
  startAutoplay();

  window.addEventListener('resize', function () {
    setTransform(0, false);
  });
})();

/* Seed localStorage with DEFAULT_EVENTS if available */
if (typeof Storage !== 'undefined' && Storage.init) {
  Storage.init();
}

/* ----- Dynamic Recommended Events (from Storage) ----- */
(function renderRecommendedEvents() {
  var container = document.getElementById('eventsContainer');
  if (!container) return;

  var events = [];
  if (typeof Storage !== 'undefined' && Storage.load) {
    Storage.init();
    events = Storage.load() || [];
  } else if (typeof DEFAULT_EVENTS !== 'undefined') {
    events = DEFAULT_EVENTS.slice();
  }

  if (!events.length) return;

  var FALLBACK = {
    Technology: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400&q=80',
    Music: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=400&q=80',
    Art: 'https://images.unsplash.com/photo-1559223607-a43c990c692c?w=400&q=80',
    Sports: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=400&q=80',
    Festival: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400&q=80',
    Workshop: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&q=80',
    default: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400&q=80'
  };

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function fmtDate(dateStr) {
    if (!dateStr) return 'TBA';
    var d = new Date(dateStr + (String(dateStr).indexOf('T') === -1 ? 'T12:00:00' : ''));
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }

  function imgFor(ev) {
    var img = (ev.image || '').trim();
    if (img) return img.replace(/w=\d+/, 'w=400');
    return FALLBACK[ev.category] || FALLBACK.default;
  }

  // Prefer a mix across categories for the home strip
  var featured = events.slice().sort(function (a, b) {
    return Number(b.attendees || 0) - Number(a.attendees || 0);
  });

  container.innerHTML = featured.map(function (ev) {
    var id = Number(ev.id);
    var title = esc(ev.title);
    var cat = esc(ev.category || 'Event');
    return (
      '<a href="event-details.html?id=' + id + '" class="event-card" data-category="' + cat + '" data-event-id="' + id + '" style="text-decoration:none;">' +
        '<div class="event-card-image">' +
          '<span class="material-symbols-outlined" style="font-size:60px;color:var(--outline-variant);position:absolute;z-index:0;">image</span>' +
          '<img src="' + imgFor(ev) + '" alt="' + title + '" loading="lazy">' +
          '<div class="event-card-badge">' + cat + '</div>' +
        '</div>' +
        '<h3 class="event-card-title">' + title + '</h3>' +
        '<p class="event-card-meta"><span class="material-symbols-outlined" style="font-size:14px;vertical-align:middle;">location_on</span> ' + esc(ev.location || 'TBA') + '</p>' +
        '<p class="event-card-meta"><span class="material-symbols-outlined" style="font-size:14px;vertical-align:middle;">calendar_today</span> ' + esc(fmtDate(ev.date)) + '</p>' +
      '</a>'
    );
  }).join('');
})();

/* ----- Category Filtering ----- */
(function initCategoryFilter() {
  var cards = document.querySelectorAll('#eventsContainer .event-card[data-category]');
  var categoryBtns = document.querySelectorAll('[data-filter-category]');
  var empty = document.getElementById('emptyState');
  var container = document.getElementById('eventsContainer');
  var statusEl = document.getElementById('filterStatus');
  var resetBtn = document.getElementById('resetCategoryFilter');
  var activeCategory = 'all';

  if (!cards.length || !categoryBtns.length) return;

  function normalize(cat) {
    return String(cat || '').trim().toLowerCase();
  }

  function setActiveButtons(category) {
    categoryBtns.forEach(function (btn) {
      var val = normalize(btn.getAttribute('data-filter-category'));
      btn.classList.toggle('active', val === normalize(category));
    });
  }

  function filterEvents(category) {
    activeCategory = category || 'all';
    var key = normalize(activeCategory);
    var visible = 0;

    cards.forEach(function (card) {
      var cat = normalize(card.getAttribute('data-category'));
      var match = key === 'all' || cat === key;
      card.classList.toggle('is-hidden', !match);
      if (match) {
        card.classList.remove('fade-in');
        void card.offsetWidth;
        card.classList.add('fade-in');
        visible++;
      }
    });

    if (empty) empty.style.display = visible === 0 ? 'flex' : 'none';
    if (container) container.style.display = visible === 0 ? 'none' : 'flex';

    if (statusEl) {
      if (key === 'all') {
        statusEl.innerHTML = '<span>Showing <strong>all events</strong></span>';
      } else {
        var label = activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1);
        statusEl.innerHTML = '<span>Showing <strong>' + label + '</strong> events (' + visible + ')</span>';
      }
    }

    if (resetBtn) resetBtn.hidden = key === 'all';
    setActiveButtons(activeCategory);
  }

  categoryBtns.forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      filterEvents(btn.getAttribute('data-filter-category') || 'all');
      var section = document.getElementById('recommendedSection');
      if (section) section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  if (resetBtn) {
    resetBtn.addEventListener('click', function () {
      filterEvents('all');
    });
  }

  window.resetEmpty = function () { filterEvents('all'); };
  filterEvents('all');
})();

/* ----- Navbar Scroll Effect ----- */
window.addEventListener('scroll', function () {
  var navbar = document.querySelector('.navbar');
  if (!navbar) return;
  navbar.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });

/* ----- Smooth Scroll ----- */
document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
  anchor.addEventListener('click', function (e) {
    var href = this.getAttribute('href');
    if (!href || href === '#') return;
    var target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});
