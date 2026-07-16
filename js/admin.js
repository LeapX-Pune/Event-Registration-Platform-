/* ============================================================
   admin.js — Admin Dashboard UI interactions
   Sirf UI skeleton hai — koi CRUD functionality nahi
   ============================================================ */

/* ===== SIDEBAR TOGGLE ===== */
/* Ye mobile mein sidebar open/close karta hai */
function admToggleSidebar() {
  var sidebar = document.getElementById('admSidebar');
  if (sidebar) sidebar.classList.toggle('open');
}

/* Sidebar ke bahar click pe band karo */
document.addEventListener('click', function (e) {
  var sidebar = document.getElementById('admSidebar');
  var btn     = document.querySelector('.adm-menu-btn');
  if (sidebar && sidebar.classList.contains('open') &&
      !sidebar.contains(e.target) && btn && !btn.contains(e.target)) {
    sidebar.classList.remove('open');
  }
});

/* ===== SIDEBAR NAV ACTIVE STATE ===== */
/* Handled by inline SPA script in admin.html */
document.addEventListener('DOMContentLoaded', function () {
  /* Ensure first section is visible on load */
  if (!document.querySelector('.adm-section.active')) {
    var first = document.getElementById('sec-dashboard');
    if (first) first.classList.add('active');
  }
});

/* ===== PROFILE DROPDOWN ===== */
/* Ye profile button dropdown toggle karta hai */
function admToggleProfile() {
  var dd      = document.getElementById('admDropdown');
  var chevron = document.getElementById('admProfileChevron');
  if (!dd) return;
  var isOpen = dd.classList.toggle('open');
  if (chevron) chevron.textContent = isOpen ? 'expand_less' : 'expand_more';
}

/* Dropdown bahar click pe band karo */
document.addEventListener('click', function (e) {
  var wrap = document.getElementById('admProfileWrap');
  var dd   = document.getElementById('admDropdown');
  if (wrap && dd && !wrap.contains(e.target)) {
    dd.classList.remove('open');
    var chevron = document.getElementById('admProfileChevron');
    if (chevron) chevron.textContent = 'expand_more';
  }
});

/* ===== DELETE MODAL ===== */
var admPendingDeleteId = null;

function admConfirmDelete(id) {
  admPendingDeleteId = id;
  sOpenModal('admDeleteModal');
}

function admDeleteConfirmed() {
  sCloseModal('admDeleteModal');
  sToast('Event #' + admPendingDeleteId + ' deleted.', 'success');
  admPendingDeleteId = null;
}

/* ===== EDIT EVENT ===== */
/* Edit button pe click karne se form mein data populate karo (UI only) */
function admEditEvent(id) {
  var titleEl = document.getElementById('admFormTitle');
  var btnEl   = document.getElementById('admSubmitBtn');
  if (titleEl) titleEl.innerHTML = '<span class="material-symbols-outlined" style="color:#a855f7;">edit</span> Edit Event';
  if (btnEl)   btnEl.innerHTML   = '<span class="material-symbols-outlined" style="font-size:16px;">save</span> Save Changes';
  sToast('Editing event #' + id + ' — update the form above.', 'info');
  var panel = document.getElementById('admFormPanel');
  if (panel) panel.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/* ===== FORM SUBMIT ===== */
/* UI only — koi backend nahi */
function admHandleSubmit(e) {
  e.preventDefault();
  sToast('Event saved successfully! 🎉', 'success');
  admResetForm();
}

function admResetForm() {
  var form    = document.getElementById('admEventForm');
  var titleEl = document.getElementById('admFormTitle');
  var btnEl   = document.getElementById('admSubmitBtn');
  if (form)    form.reset();
  if (titleEl) titleEl.innerHTML = '<span class="material-symbols-outlined" style="color:#a855f7;">add_circle</span> Create New Event';
  if (btnEl)   btnEl.innerHTML   = '<span class="material-symbols-outlined" style="font-size:16px;">add</span> Add Event';
}

/* ===== SCROLL TO FORM ===== */
function admScrollToForm() {
  var panel = document.getElementById('admFormPanel');
  if (panel) panel.scrollIntoView({ behavior: 'smooth' });
  sToast('Fill in the form to create a new event.', 'info');
}
