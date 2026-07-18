/* =====================================================
   EventPulse - Categories Page Interactions
   ===================================================== */

/* Theme: js/utils/theme.js */

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

document.addEventListener('DOMContentLoaded', function () {
  var revealCards = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var cardObserver = new IntersectionObserver(function (entries, observer) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
    revealCards.forEach(function (card) { cardObserver.observe(card); });
  } else {
    revealCards.forEach(function (card) { card.classList.add('visible'); });
  }
});

var toastTimer = null;
function showToast(message) {
  var toast = document.getElementById('catToast');
  var msgEl = document.getElementById('catToastMsg');
  if (!toast || !msgEl) return;
  msgEl.textContent = message;
  toast.classList.add('active');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(function () { toast.classList.remove('active'); }, 2800);
}

function triggerSubscribe() {
  showToast('Thank you for subscribing! Check your inbox for updates.');
}

var CAT_FALLBACK_IMAGES = {
  Technology: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400&q=80',
  Music: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=400&q=80',
  Art: 'https://images.unsplash.com/photo-1559223607-a43c990c692c?w=400&q=80',
  Sports: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=400&q=80',
  Festival: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400&q=80',
  Workshop: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&q=80',
  default: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400&q=80'
};

function getCategoryEvents() {
  if (typeof Storage !== 'undefined' && Storage.init) {
    Storage.init();
    return Storage.load() || [];
  }
  return typeof DEFAULT_EVENTS !== 'undefined' ? DEFAULT_EVENTS.slice() : [];
}

function formatCatDate(dateStr) {
  if (!dateStr) return 'TBA';
  var d = new Date(dateStr + (String(dateStr).indexOf('T') === -1 ? 'T12:00:00' : ''));
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function eventCardImage(event) {
  var img = (event.image || '').trim();
  if (img) return img.replace(/w=\d+/, 'w=400');
  return CAT_FALLBACK_IMAGES[event.category] || CAT_FALLBACK_IMAGES.default;
}

function escapeCat(str) {
  return String(str == null ? '' : str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function renderCategoryEventCards(events) {
  var container = document.getElementById('catEventsContainer');
  if (!container) return;

  if (!events.length) {
    container.innerHTML = '';
    return;
  }

  container.innerHTML = events.map(function (event) {
    var id = Number(event.id);
    var title = escapeCat(event.title);
    var category = escapeCat(event.category || 'Event');
    var location = escapeCat(event.location || 'TBA');
    var dateLabel = escapeCat(formatCatDate(event.date));
    var img = eventCardImage(event);

    return (
      '<a href="event-details.html?id=' + id + '" class="event-card" data-category="' + category + '" data-event-id="' + id + '" style="text-decoration:none;">' +
        '<div class="event-card-image">' +
          '<img src="' + img + '" alt="' + title + '" loading="lazy" onerror="this.onerror=null;this.src=\'' + CAT_FALLBACK_IMAGES.default + '\'">' +
          '<div class="event-card-badge">' + category + '</div>' +
        '</div>' +
        '<h3 class="event-card-title">' + title + '</h3>' +
        '<p class="event-card-meta">' + location + '</p>' +
        '<p class="event-card-meta">' + dateLabel + '</p>' +
      '</a>'
    );
  }).join('');
}

function renderTrending(events) {
  var list = document.getElementById('catTrendingList');
  if (!list) return;

  var trending = events
    .slice()
    .sort(function (a, b) { return Number(b.attendees || 0) - Number(a.attendees || 0); })
    .slice(0, 5);

  list.innerHTML = trending.map(function (event, idx) {
    var id = Number(event.id);
    var rank = String(idx + 1).padStart(2, '0');
    var title = escapeCat(event.title);
    var category = escapeCat(event.category || 'Event');
    var meta = escapeCat((event.venue || event.location || '') + ' • ' + formatCatDate(event.date));

    return (
      '<a href="event-details.html?id=' + id + '" class="cat-trending-row" data-category="' + category + '" data-event-id="' + id + '" style="text-decoration:none;color:inherit;">' +
        '<div class="cat-rank">' + rank + '</div>' +
        '<div style="flex:1;">' +
          '<h3 class="body-lg" style="font-weight:700;margin-bottom:4px;">' + title + '</h3>' +
          '<p class="body-md" style="color:var(--on-surface-variant);font-size:14px;">' + meta + '</p>' +
        '</div>' +
        '<span class="tag tag-primary">' + category + '</span>' +
      '</a>'
    );
  }).join('');
}

function updateCategoryCounts(events) {
  document.querySelectorAll('.cat-card[data-category]').forEach(function (card) {
    var cat = card.getAttribute('data-category');
    var count = events.filter(function (e) {
      return String(e.category || '').toLowerCase() === String(cat).toLowerCase();
    }).length;
    var badge = card.querySelector('.cat-card-badge');
    if (badge) badge.textContent = count + (count === 1 ? ' Event' : ' Events');
  });
}

/* ----- Category filtering ----- */
(function initCategoryPageFilter() {
  var allEvents = getCategoryEvents();
  renderCategoryEventCards(allEvents);
  renderTrending(allEvents);
  updateCategoryCounts(allEvents);

  var catCards = document.querySelectorAll('.cat-card[data-category]');
  var empty = document.getElementById('catEmptyState');
  var container = document.getElementById('catEventsContainer');
  var statusEl = document.getElementById('catFilterStatus');
  var resetBtn = document.getElementById('catResetFilter');
  var chipBar = document.getElementById('catFilterBar');
  var active = 'all';

  function normalize(v) {
    return String(v || '').trim().toLowerCase();
  }

  function filterBy(category) {
    active = category || 'all';
    var key = normalize(active);

    catCards.forEach(function (card) {
      card.classList.toggle('active', key !== 'all' && normalize(card.getAttribute('data-category')) === key);
    });

    if (chipBar) {
      chipBar.querySelectorAll('[data-filter-category]').forEach(function (chip) {
        chip.classList.toggle('active', normalize(chip.getAttribute('data-filter-category')) === key);
      });
    }

    var filtered = key === 'all'
      ? allEvents
      : allEvents.filter(function (e) { return normalize(e.category) === key; });

    renderCategoryEventCards(filtered);

    document.querySelectorAll('#catTrendingList .cat-trending-row').forEach(function (row) {
      var match = key === 'all' || normalize(row.getAttribute('data-category')) === key;
      row.style.display = match ? '' : 'none';
    });

    var visible = filtered.length;
    if (empty) empty.style.display = visible === 0 ? 'flex' : 'none';
    if (container) container.style.display = visible === 0 ? 'none' : 'flex';

    if (statusEl) {
      if (key === 'all') {
        statusEl.innerHTML = '<span>Showing <strong>all events</strong> (' + visible + ')</span>';
      } else {
        var label = active.charAt(0).toUpperCase() + active.slice(1);
        statusEl.innerHTML = '<span>Filtered by <strong>' + escapeCat(label) + '</strong> (' + visible + ' events)</span>';
      }
    }
    if (resetBtn) resetBtn.hidden = key === 'all';

    if (key !== 'all') {
      showToast('Showing ' + active + ' events');
      var section = document.getElementById('catFeaturedSection');
      if (section) section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  catCards.forEach(function (card) {
    card.setAttribute('role', 'button');
    card.setAttribute('tabindex', '0');
    card.addEventListener('click', function () {
      filterBy(card.getAttribute('data-category'));
    });
    card.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        filterBy(card.getAttribute('data-category'));
      }
    });
  });

  if (chipBar) {
    chipBar.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-filter-category]');
      if (!btn) return;
      filterBy(btn.getAttribute('data-filter-category'));
    });
  }

  if (resetBtn) resetBtn.addEventListener('click', function () { filterBy('all'); });

  var params = new URLSearchParams(window.location.search);
  var fromQuery = params.get('category');
  if (fromQuery) filterBy(fromQuery);
  else filterBy('all');
})();
