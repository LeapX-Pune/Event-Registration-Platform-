/* =====================================================
   EventPulse - Event Details (dynamic, Storage-backed)
   ===================================================== */

/* Theme: js/utils/theme.js */

var FALLBACK_IMAGES = {
  Technology: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1400&q=80',
  Music: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=1400&q=80',
  Art: 'https://images.unsplash.com/photo-1559223607-a43c990c692c?w=1400&q=80',
  Sports: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=1400&q=80',
  Festival: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1400&q=80',
  Workshop: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1400&q=80',
  Business: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=1400&q=80',
  Education: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1400&q=80',
  Entertainment: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=1400&q=80',
  Food: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=1400&q=80',
  Health: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=1400&q=80',
  Community: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=1400&q=80',
  default: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1400&q=80'
};

function getAllEvents() {
  if (typeof Storage !== 'undefined' && Storage.init) {
    Storage.init();
    return Storage.load() || [];
  }
  return typeof DEFAULT_EVENTS !== 'undefined' ? DEFAULT_EVENTS : [];
}

function getEventById(id) {
  var numId = Number(id);
  if (!numId) return null;
  if (typeof Storage !== 'undefined' && Storage.getById) {
    Storage.init();
    var fromStorage = Storage.getById(numId);
    if (fromStorage) return fromStorage;
  }
  var events = getAllEvents();
  return events.find(function (e) { return Number(e.id) === numId; }) || null;
}

function formatEventDate(dateStr) {
  if (!dateStr) return 'TBA';
  var d = new Date(dateStr + (String(dateStr).indexOf('T') === -1 ? 'T12:00:00' : ''));
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function getEventImage(event, size) {
  var img = (event && event.image) ? String(event.image).trim() : '';
  if (img) {
    if (size === 'thumb') return img.replace(/w=\d+/, 'w=400');
    return img.replace(/w=\d+/, 'w=1400');
  }
  var fallback = FALLBACK_IMAGES[event && event.category] || FALLBACK_IMAGES.default;
  return size === 'thumb' ? fallback.replace('w=1400', 'w=400') : fallback;
}

function getOrganizer(event) {
  if (event && event.organizer) return event.organizer;
  var map = {
    Technology: 'Pulse Tech Labs',
    Music: 'Soundwave Collective',
    Art: 'Atelier Pulse',
    Sports: 'Arena Sports Co.',
    Festival: 'Lumen Collective',
    Workshop: 'Northstar Workshops',
    Business: 'Summit Partners',
    Education: 'Open Campus',
    Entertainment: 'Stage & Screen'
  };
  return map[event && event.category] || 'EventPulse Partners';
}

function getCity(event) {
  if (!event || !event.location) return 'TBA';
  var parts = String(event.location).split(',');
  return parts.length > 1 ? parts.slice(-2).join(',').trim() : event.location;
}

function escapeHtml(str) {
  return String(str == null ? '' : str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function normalizeTags(event) {
  var tags = (event && event.tags) ? event.tags : [];
  return tags.map(function (t) {
    var raw = String(t).replace(/^#/, '');
    return '#' + raw.charAt(0).toUpperCase() + raw.slice(1);
  });
}

function getRelatedEvents(event, limit) {
  var all = getAllEvents();
  var id = Number(event.id);
  var same = all.filter(function (e) {
    return Number(e.id) !== id && e.category === event.category;
  });
  var others = all.filter(function (e) {
    return Number(e.id) !== id && e.category !== event.category;
  });
  return same.concat(others).slice(0, limit || 3);
}

function renderNotFound(root, triedId) {
  document.title = 'Event Not Found | EventPulse';
  root.innerHTML =
    '<div class="empty-state" style="display:flex;">' +
      '<div class="empty-state-icon">' +
        '<span class="material-symbols-outlined" style="font-size:36px;color:var(--outline);">event_busy</span>' +
      '</div>' +
      '<h3>Event not found</h3>' +
      '<p>We couldn&rsquo;t find an event' +
        (triedId ? ' with ID <strong>' + escapeHtml(triedId) + '</strong>' : '') +
        '. It may have been removed or the link is invalid.</p>' +
      '<div style="display:flex;gap:12px;flex-wrap:wrap;justify-content:center;">' +
        '<a href="categories.html" class="btn btn-primary">Browse Categories</a>' +
        '<a href="index.html" class="btn btn-outline">Back Home</a>' +
      '</div>' +
    '</div>';
}

function renderEventsIndex(root) {
  var events = getAllEvents();
  document.title = 'All Events | EventPulse';

  if (!events.length) {
    root.innerHTML =
      '<div class="empty-state" style="display:flex;">' +
        '<h3>No events available</h3>' +
        '<p>Check back soon for upcoming experiences.</p>' +
        '<a href="index.html" class="btn btn-outline">Back Home</a>' +
      '</div>';
    return;
  }

  root.innerHTML =
    '<div class="page-intro-card" style="margin-bottom:24px;">' +
      '<div class="section-eyebrow"><span class="material-symbols-outlined">event</span> Browse all</div>' +
      '<h1>All Events</h1>' +
      '<p>Select an event to view full details, pricing, and registration.</p>' +
    '</div>' +
    '<div class="related-grid">' +
      events.map(function (item) {
        return (
          '<a href="event-details.html?id=' + Number(item.id) + '" class="related-card" style="text-decoration:none;">' +
            '<img src="' + getEventImage(item, 'thumb') + '" alt="' + escapeHtml(item.title) + '">' +
            '<div class="related-card-body">' +
              '<div class="label-sm" style="color:var(--primary);margin-bottom:6px;">' + escapeHtml(item.category) + '</div>' +
              '<h4 style="font-weight:700;margin-bottom:6px;">' + escapeHtml(item.title) + '</h4>' +
              '<p style="font-size:13px;color:var(--on-surface-variant);">' +
                escapeHtml(formatEventDate(item.date)) + ' &bull; ' + escapeHtml(item.location || '') +
              '</p>' +
            '</div>' +
          '</a>'
        );
      }).join('') +
    '</div>';
}

function renderEventDetails() {
  var root = document.getElementById('eventDetailRoot');
  if (!root) return;

  var params = new URLSearchParams(window.location.search);
  var rawId = params.get('id');

  // No ID → show browsable list of all events (Events nav)
  if (!rawId) {
    renderEventsIndex(root);
    return;
  }

  var event = getEventById(rawId);

  if (!event) {
    renderNotFound(root, rawId);
    return;
  }

  var title = escapeHtml(event.title);
  var category = escapeHtml(event.category || 'Event');
  var dateLabel = escapeHtml(formatEventDate(event.date));
  var timeLabel = escapeHtml(event.time || 'TBA');
  var venue = escapeHtml(event.venue || 'TBA');
  var city = escapeHtml(getCity(event));
  var location = escapeHtml(event.location || 'TBA');
  var description = escapeHtml(event.description || 'No description available.');
  var price = escapeHtml(event.price || 'Free');
  var organizer = escapeHtml(getOrganizer(event));
  var image = getEventImage(event);
  var capacity = (event.maxAttendees != null)
    ? (Number(event.attendees || 0) + ' / ' + Number(event.maxAttendees))
    : 'Open';
  var tags = normalizeTags(event);
  var related = getRelatedEvents(event, 3);
  var orgInitials = organizer.split(/\s+/).map(function (w) { return w.charAt(0); }).join('').slice(0, 2).toUpperCase();

  document.title = event.title + ' | EventPulse';
  var meta = document.querySelector('meta[name="description"]');
  if (meta) meta.setAttribute('content', event.description || (event.title + ' on EventPulse'));

  root.innerHTML =
    '<div class="page-intro-card" style="margin-bottom:24px;">' +
      '<div class="section-eyebrow"><span class="material-symbols-outlined">event_available</span> ' + category + '</div>' +
      '<h1>' + title + '</h1>' +
      '<p>' + description + '</p>' +
    '</div>' +
    '<div class="event-detail-grid">' +
      '<div class="detail-card">' +
        '<div class="event-detail-media">' +
          '<img src="' + image + '" alt="' + title + '" onerror="this.onerror=null;this.src=\'' + FALLBACK_IMAGES.default + '\'">' +
        '</div>' +
        '<div class="detail-meta" style="margin-top:20px;">' +
          '<div class="detail-chip"><span class="label">Date</span><strong>' + dateLabel + '</strong></div>' +
          '<div class="detail-chip"><span class="label">Time</span><strong>' + timeLabel + '</strong></div>' +
          '<div class="detail-chip"><span class="label">City</span><strong>' + city + '</strong></div>' +
          '<div class="detail-chip"><span class="label">Venue</span><strong>' + venue + '</strong></div>' +
          '<div class="detail-chip"><span class="label">Location</span><strong>' + location + '</strong></div>' +
          '<div class="detail-chip"><span class="label">Capacity</span><strong>' + escapeHtml(String(capacity)) + '</strong></div>' +
        '</div>' +
        '<div style="margin-top:24px;">' +
          '<h2 class="headline-md" style="font-size:22px;margin-bottom:10px;">About this event</h2>' +
          '<p class="body-md" style="color:var(--on-surface-variant);line-height:1.7;">' + description + '</p>' +
        '</div>' +
        (tags.length
          ? '<div style="margin-top:24px;">' +
              '<h3 class="headline-md" style="font-size:18px;margin-bottom:12px;">Tags</h3>' +
              '<div style="display:flex;flex-wrap:wrap;gap:8px;">' +
                tags.map(function (tag) { return '<span class="ed-tag">' + escapeHtml(tag) + '</span>'; }).join('') +
              '</div>' +
            '</div>'
          : '') +
        (related.length
          ? '<div style="margin-top:24px;">' +
              '<h3 class="headline-md" style="font-size:18px;margin-bottom:12px;">Related events</h3>' +
              '<div class="related-grid">' +
                related.map(function (item) {
                  return (
                    '<a href="event-details.html?id=' + Number(item.id) + '" class="related-card" style="text-decoration:none;">' +
                      '<img src="' + getEventImage(item, 'thumb') + '" alt="' + escapeHtml(item.title) + '">' +
                      '<div class="related-card-body">' +
                        '<div class="label-sm" style="color:var(--primary);margin-bottom:6px;">' + escapeHtml(item.category) + '</div>' +
                        '<h4 style="font-weight:700;margin-bottom:6px;">' + escapeHtml(item.title) + '</h4>' +
                        '<p style="font-size:13px;color:var(--on-surface-variant);">' +
                          escapeHtml(formatEventDate(item.date)) + ' &bull; ' + escapeHtml(item.location || '') +
                        '</p>' +
                      '</div>' +
                    '</a>'
                  );
                }).join('') +
              '</div>' +
            '</div>'
          : '') +
      '</div>' +
      '<div class="detail-side-card">' +
        '<div class="section-eyebrow"><span class="material-symbols-outlined">confirmation_number</span> Reserve your place</div>' +
        '<h3 class="headline-md" style="font-size:20px;margin-bottom:10px;">' + title + '</h3>' +
        '<div style="display:flex;align-items:baseline;gap:8px;margin-bottom:16px;">' +
          '<span class="display-lg-mobile" style="font-size:32px;color:var(--tertiary);font-weight:800;">' + price + '</span>' +
          '<span class="body-md" style="color:var(--outline);">per attendee</span>' +
        '</div>' +
        '<p class="body-md" style="color:var(--on-surface-variant);margin-bottom:8px;">' + venue + '</p>' +
        '<p class="body-md" style="color:var(--on-surface-variant);margin-bottom:16px;">' + dateLabel + ' &bull; ' + timeLabel + '</p>' +
        '<div style="display:flex;flex-direction:column;gap:12px;">' +
          '<button type="button" class="btn btn-primary w-full" onclick="triggerRegistration()">Register now</button>' +
          '<button type="button" class="btn btn-outline w-full" onclick="contactOrganizer()">Contact organizer</button>' +
        '</div>' +
        '<div style="margin-top:24px;padding-top:24px;border-top:1px solid var(--border-subtle);">' +
          '<p class="label-sm" style="color:var(--outline);margin-bottom:12px;">Organizer</p>' +
          '<div style="display:flex;align-items:center;gap:12px;">' +
            '<div style="width:40px;height:40px;border-radius:50%;background:linear-gradient(135deg, var(--primary), var(--secondary));display:flex;align-items:center;justify-content:center;color:var(--on-primary);font-weight:700;font-size:13px;">' +
              escapeHtml(orgInitials) +
            '</div>' +
            '<div>' +
              '<p style="font-weight:700;">' + organizer + '</p>' +
              '<p style="font-size:13px;color:var(--on-surface-variant);">Verified organizer</p>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</div>' +
    '</div>';
}

var lightbox = document.getElementById('edLightbox');
var lightboxImg = document.getElementById('edLightboxImg');

function openLightbox(src) {
  if (lightbox && lightboxImg) {
    lightboxImg.src = src;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

function closeLightbox() {
  if (lightbox) {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }
}

if (lightbox) {
  lightbox.addEventListener('click', function (e) {
    if (e.target === lightbox) closeLightbox();
  });
}



function triggerRegistration() {
  var params = new URLSearchParams(window.location.search);
  var rawId = params.get('id');
  var event = getEventById(rawId);
  if (!event) {
    showToast('Event not found.', 'error');
    return;
  }
  if (Number(event.attendees || 0) >= Number(event.maxAttendees)) {
    showToast('This event is fully booked.', 'error');
    return;
  }
  window.location.href = 'registration.html?id=' + Number(event.id);
}

function contactOrganizer() {
  if (typeof openContactModal === 'function') openContactModal();
  else showToast('Contact form is unavailable on this page.', 'info');
}

document.addEventListener('DOMContentLoaded', function() {
  renderEventDetails();
});
