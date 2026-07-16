/* =====================================================
   EventPulse - Event Details Page Interactions (JS)
   Ye file Event Details page ke sabhi interactive flows ko handle karti hai
   ===================================================== */

/* ----- Theme Handling (Dark/Light) ----- */
/* Theme toggle switch action */
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
/* Hamburger aur close click drawer animations */
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

/* ----- Lightbox Zoom Screen Modal ----- */
/* Gallery images click image overlay zoom functionality */
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

/* Lightbox overlay background click to close */
if (lightbox) {
  lightbox.addEventListener('click', function(e) {
    if (e.target === lightbox) {
      closeLightbox();
    }
  });
}

/* ----- Toast Notification Helper ----- */
/* Custom feedback toast displaying mechanism */
var toastTimer = null;
function showToastNotification(message, type) {
  var toast = document.getElementById('edToast');
  var toastMsg = document.getElementById('edToastMsg');
  var toastIcon = document.getElementById('edToastIcon');
  
  if (!toast || !toastMsg) return;

  toastMsg.textContent = message;
  
  // Icon and theme config based on warning/success
  if (type === 'error') {
    toastIcon.textContent = 'error';
    toastIcon.style.color = 'var(--error)';
    toast.style.borderColor = 'rgba(255, 180, 171, 0.3)';
  } else {
    toastIcon.textContent = 'check_circle';
    toastIcon.style.color = 'var(--tertiary)';
    toast.style.borderColor = 'rgba(224, 182, 255, 0.2)';
  }

  // Active status toggle
  toast.classList.add('active');
  
  clearTimeout(toastTimer);
  toastTimer = setTimeout(function() {
    toast.classList.remove('active');
  }, 3500);
}

/* ----- Action Buttons Interactions ----- */
/* Ticket Registration Click action simulation */
function triggerRegistration() {
  showToastNotification('Registration successful! Confirmation has been sent to your email.', 'success');
}

/* Contact Organizer action simulation */
function contactOrganizer() {
  showToastNotification('Organizer contact form initialized. Messaging active.', 'info');
}

/* ----- Sharing Dialog Simulation ----- */
/* Social sharing links action triggers feedback */
var shareBtns = document.querySelectorAll('.ed-share-btn');
shareBtns.forEach(function(btn) {
  btn.addEventListener('click', function() {
    var platform = this.textContent.trim();
    showToastNotification('Copied event link for ' + platform + ' to clipboard!', 'success');
  });
});
