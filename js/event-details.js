/* =====================================================
   EventPulse - Event Details Page Interactions (JS)
   ===================================================== */

const eventDetailsData = [
  {
    id: 1,
    title: 'UX Masters Global Summit',
    category: 'Workshop',
    date: 'Sep 22, 2026',
    time: '9:30 AM',
    location: 'London, UK',
    venue: 'Convention Arena, London',
    price: '$79',
    organizer: 'Northstar Labs',
    description: 'A high-impact summit for design leaders, product strategists, and interface innovators. Expect deep-dive sessions, workshops, and networking with exceptional speakers from around the globe.',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1400&q=80',
    tags: ['#Design', '#Leadership', '#Workshop'],
    gallery: [
      'https://images.unsplash.com/photo-1511578314322-379afb476865?w=600&q=80',
      'https://images.unsplash.com/photo-1516321497487-e288fb19713f?w=600&q=80',
      'https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=600&q=80'
    ]
  },
  {
    id: 2,
    title: 'AI & Machine Learning Expo',
    category: 'Conference',
    date: 'Oct 12, 2026',
    time: '10:00 AM',
    location: 'San Francisco, CA',
    venue: 'Silicon Valley Tech Hub',
    price: '$129',
    organizer: 'FutureStack',
    description: 'Experience a curated event covering practical AI workflows, machine learning systems, and the future of intelligent products in a fast-moving, collaborative setting.',
    image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1400&q=80',
    tags: ['#AI', '#Tech', '#Networking'],
    gallery: [
      'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&q=80',
      'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&q=80',
      'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&q=80'
    ]
  },
  {
    id: 3,
    title: 'Enchanted Forest Soirée',
    category: 'Festival',
    date: 'Nov 12, 2026',
    time: '6:00 PM',
    location: 'Asheville, NC',
    venue: 'Asheville Meadow, NC',
    price: '$45',
    organizer: 'Lumen Collective',
    description: 'An immersive evening festival with lantern-lit pathways, live performances, and atmospheric dining designed to feel like stepping into a storybook.',
    image: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=1400&q=80',
    tags: ['#Festival', '#Nightlife', '#Culture'],
    gallery: [
      'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600&q=80',
      'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&q=80',
      'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=600&q=80'
    ]
  },
  {
    id: 4,
    title: 'Jazz & Blues Night',
    category: 'Concert',
    date: 'Dec 05, 2026',
    time: '8:00 PM',
    location: 'New Orleans, LA',
    venue: 'Royal Theatre, New Orleans',
    price: '$35',
    organizer: 'The Velvet Room',
    description: 'A sophisticated night of jazz and blues performances designed around intimate acoustics, soulful vocals, and a warm downtown atmosphere.',
    image: 'https://images.unsplash.com/photo-1531746790095-e5cb1571ea1f?w=1400&q=80',
    tags: ['#Jazz', '#Blues', '#LiveMusic'],
    gallery: [
      'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=600&q=80',
      'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=600&q=80',
      'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&q=80'
    ]
  },
  {
    id: 5,
    title: 'Modern Art & Design Expo',
    category: 'Art',
    date: 'Jan 20, 2027',
    time: '11:00 AM',
    location: 'Paris, France',
    venue: 'Galerie du Lumière',
    price: '$25',
    organizer: 'Studio Atelier',
    description: 'An inspiring showcase of contemporary art, interactive installations, and design-led experiences for tastemakers and collectors.',
    image: 'https://images.unsplash.com/photo-1559223607-a43c990c692c?w=1400&q=80',
    tags: ['#Art', '#Design', '#Exhibition'],
    gallery: [
      'https://images.unsplash.com/photo-1518998053901-5348d3961a04?w=600&q=80',
      'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=600&q=80',
      'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=600&q=80'
    ]
  }
];

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

function getSelectedEvent() {
  const params = new URLSearchParams(window.location.search);
  const eventId = Number(params.get('id'));
  return eventDetailsData.find((item) => item.id === eventId) || eventDetailsData[2];
}

function renderEventDetails() {
  const root = document.getElementById('eventDetailRoot');
  if (!root) return;
  const event = getSelectedEvent();
  const related = eventDetailsData.filter((item) => item.id !== event.id).slice(0, 3);

  root.innerHTML = `
    <div class="page-intro-card" style="margin-bottom:24px;">
      <div class="section-eyebrow"><span class="material-symbols-outlined">event_available</span> Featured experience</div>
      <h1>${event.title}</h1>
      <p>${event.description}</p>
    </div>
    <div class="event-detail-grid">
      <div class="detail-card">
        <div class="event-detail-media">
          <img src="${event.image}" alt="${event.title}">
        </div>
        <div class="detail-meta" style="margin-top:20px;">
          <div class="detail-chip"><span class="label">Date</span><strong>${event.date}</strong></div>
          <div class="detail-chip"><span class="label">Time</span><strong>${event.time}</strong></div>
          <div class="detail-chip"><span class="label">Location</span><strong>${event.location}</strong></div>
          <div class="detail-chip"><span class="label">Venue</span><strong>${event.venue}</strong></div>
        </div>
        <div style="margin-top:24px;">
          <h2 class="headline-md" style="font-size:22px;margin-bottom:10px;">About this event</h2>
          <p class="body-md" style="color:var(--on-surface-variant);line-height:1.7;">${event.description}</p>
        </div>
        <div style="margin-top:24px;">
          <h3 class="headline-md" style="font-size:18px;margin-bottom:12px;">Highlights</h3>
          <div style="display:flex;flex-wrap:wrap;gap:8px;">
            ${event.tags.map((tag) => `<span class="ed-tag">${tag}</span>`).join('')}
          </div>
        </div>
        <div style="margin-top:24px;">
          <h3 class="headline-md" style="font-size:18px;margin-bottom:12px;">Gallery</h3>
          <div class="ed-gallery">
            ${event.gallery.map((src) => `<img src="${src}" alt="${event.title} gallery" onclick="openLightbox('${src}')">`).join('')}
          </div>
        </div>
        <div style="margin-top:24px;">
          <h3 class="headline-md" style="font-size:18px;margin-bottom:12px;">Related events</h3>
          <div class="related-grid">
            ${related.map((item) => `
              <a href="event-details.html?id=${item.id}" class="related-card" style="text-decoration:none;">
                <img src="${item.image}" alt="${item.title}">
                <div class="related-card-body">
                  <div class="label-sm" style="color:var(--primary);margin-bottom:6px;">${item.category}</div>
                  <h4 style="font-weight:700;margin-bottom:6px;">${item.title}</h4>
                  <p style="font-size:13px;color:var(--on-surface-variant);">${item.date} • ${item.location}</p>
                </div>
              </a>
            `).join('')}
          </div>
        </div>
      </div>
      <div class="detail-side-card">
        <div class="section-eyebrow"><span class="material-symbols-outlined">confirmation_number</span> Reserve your place</div>
        <h3 class="headline-md" style="font-size:20px;margin-bottom:10px;">${event.title}</h3>
        <div style="display:flex;align-items:baseline;gap:8px;margin-bottom:16px;">
          <span class="display-lg-mobile" style="font-size:32px;color:var(--tertiary);font-weight:800;">${event.price}</span>
          <span class="body-md" style="color:var(--outline);">per attendee</span>
        </div>
        <p class="body-md" style="color:var(--on-surface-variant);margin-bottom:16px;">${event.venue}</p>
        <div style="display:flex;flex-direction:column;gap:12px;">
          <button class="btn btn-primary w-full" onclick="triggerRegistration()">Register now</button>
          <button class="btn btn-outline w-full" onclick="contactOrganizer()">Contact organizer</button>
        </div>
        <div style="margin-top:24px;padding-top:24px;border-top:1px solid rgba(77,67,83,0.2);">
          <p class="label-sm" style="color:var(--outline);margin-bottom:12px;">Organizer</p>
          <div style="display:flex;align-items:center;gap:12px;">
            <div style="width:40px;height:40px;border-radius:50%;background:linear-gradient(135deg, var(--primary), var(--secondary));display:flex;align-items:center;justify-content:center;color:#10131a;font-weight:700;">EP</div>
            <div>
              <p style="font-weight:700;">${event.organizer}</p>
              <p style="font-size:13px;color:var(--on-surface-variant);">Verified organizer</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
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
  lightbox.addEventListener('click', function(e) {
    if (e.target === lightbox) {
      closeLightbox();
    }
  });
}

var toastTimer = null;
function showToastNotification(message, type) {
  var toast = document.getElementById('edToast');
  var toastMsg = document.getElementById('edToastMsg');
  var toastIcon = document.getElementById('edToastIcon');
  if (!toast || !toastMsg) return;

  toastMsg.textContent = message;
  if (type === 'error') {
    toastIcon.textContent = 'error';
    toastIcon.style.color = 'var(--error)';
    toast.style.borderColor = 'rgba(255, 180, 171, 0.3)';
  } else {
    toastIcon.textContent = 'check_circle';
    toastIcon.style.color = 'var(--tertiary)';
    toast.style.borderColor = 'rgba(224, 182, 255, 0.2)';
  }

  toast.classList.add('active');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(function() {
    toast.classList.remove('active');
  }, 3500);
}

function triggerRegistration() {
  showToastNotification('Registration successful! Confirmation has been sent to your email.', 'success');
}

function contactOrganizer() {
  showToastNotification('Organizer contact form initialized. Messaging active.', 'info');
}

document.addEventListener('DOMContentLoaded', renderEventDetails);
