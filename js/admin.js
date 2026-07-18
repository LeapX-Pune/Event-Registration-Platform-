/* =====================================================
   EventPulse - Admin Dashboard Page Interactions (JS)
   ===================================================== */

/* Theme: js/utils/theme.js */

/* ----- Sidebar Toggle (Mobile) ----- */
function admToggleSidebar() {
  var sidebar = document.getElementById('admSidebar');
  var overlay = document.getElementById('admOverlay');
  if (!sidebar) return;

  sidebar.classList.toggle('open');
  if (overlay) overlay.classList.toggle('open');
}

/* ----- Profile Dropdown toggles ----- */
function admToggleProfile() {
  var dd = document.getElementById('admDropdown');
  var chevron = document.getElementById('admProfileChevron');
  if (!dd) return;

  dd.classList.toggle('active');
  if (chevron) {
    chevron.textContent = dd.classList.contains('active') ? 'expand_less' : 'expand_more';
  }
}

// Dropdown click outside detection logic
window.addEventListener('click', function(e) {
  var wrap = document.getElementById('admProfileWrap');
  var dd = document.getElementById('admDropdown');
  var chevron = document.getElementById('admProfileChevron');
  if (!wrap || !dd) return;

  if (!wrap.contains(e.target)) {
    dd.classList.remove('active');
    if (chevron) chevron.textContent = 'expand_more';
  }
});

/* ----- Dynamic Section Navigation ----- */
/* Ye function sections ko show/hide karta hai based on sidebar link tags clicks */
function admGoTo(sectionId, element) {
  // Clear active sections
  var sections = document.querySelectorAll('.adm-section');
  sections.forEach(function(sec) {
    sec.style.display = 'none';
    sec.classList.remove('active');
  });

  // Activate chosen section
  var activeSec = document.getElementById('adm-sec-' + sectionId);
  if (activeSec) {
    activeSec.style.display = 'block';
    setTimeout(function() { activeSec.classList.add('active'); }, 10);
  }

  // Handle active class updates in sidebar nav list
  if (element) {
    var navItems = document.querySelectorAll('.adm-nav-item');
    navItems.forEach(function(item) {
      item.classList.remove('active');
    });
    element.classList.add('active');
  }

  // Close mobile navigation drawer if open
  var sidebar = document.getElementById('admSidebar');
  var overlay = document.getElementById('admOverlay');
  if (sidebar && sidebar.classList.contains('open')) {
    sidebar.classList.remove('open');
    if (overlay) overlay.classList.remove('open');
  }
}

/* ----- Toast Notification Popups ----- */
var toastTimer = null;
function triggerToast(message, type) {
  var toast = document.getElementById('admToast');
  var toastMsg = document.getElementById('admToastMsg');
  var toastIcon = document.getElementById('admToastIcon');
  if (!toast || !toastMsg) return;

  toastMsg.textContent = message;

  if (type === 'error') {
    toastIcon.textContent = 'error';
    toastIcon.style.color = 'var(--error)';
    toast.style.borderColor = 'rgba(255, 180, 171, 0.3)';
  } else if (type === 'info') {
    toastIcon.textContent = 'info';
    toastIcon.style.color = 'var(--secondary)';
    toast.style.borderColor = 'rgba(69, 240, 244, 0.3)';
  } else {
    toastIcon.textContent = 'check_circle';
    toastIcon.style.color = 'var(--tertiary)';
    toast.style.borderColor = 'rgba(224, 182, 255, 0.2)';
  }

  toast.classList.add('active');

  clearTimeout(toastTimer);
  toastTimer = setTimeout(function() {
    toast.classList.remove('active');
  }, 3000);
}

/* ----- Modal delete event flow simulation ----- */
var currentDeletingEvent = '';

function openDeleteModal(eventName) {
  var modal = document.getElementById('admModal');
  var label = document.getElementById('delModalEventName');
  if (!modal) return;

  currentDeletingEvent = eventName;
  if (label) label.textContent = 'You are deleting "' + eventName + '". This action cannot be undone.';
  modal.classList.add('active');
}

function closeDeleteModal() {
  var modal = document.getElementById('admModal');
  if (modal) modal.classList.remove('active');
}

function confirmDeleteEvent() {
  closeDeleteModal();
  triggerToast('Event "' + currentDeletingEvent + '" successfully deleted!', 'success');
}

/* ----- Create Event submission flow simulation ----- */
function triggerAddEvent() {
  var title = document.getElementById('evtTitle').value;
  var cat = document.getElementById('evtCategory').value;
  var date = document.getElementById('evtDate').value;
  var venue = document.getElementById('evtVenue').value;

  // Add new event row to event list simulation UI
  var list = document.getElementById('admEventsList');
  if (list) {
    var tr = document.createElement('tr');
    tr.innerHTML = '<td><strong>' + title + '</strong></td>' +
                   '<td><span class="tag tag-primary" style="font-size:10px;">' + cat + '</span></td>' +
                   '<td>' + date + '</td>' +
                   '<td>12:00</td>' +
                   '<td>' + venue + '</td>' +
                   '<td>0 / 100</td>' +
                   '<td><span class="tag tag-tertiary" style="background:rgba(171,214,0,0.1);color:var(--tertiary);font-size:11px;">Published</span></td>' +
                   '<td style="text-align:right;">' +
                     '<button class="btn-icon" aria-label="Edit"><span class="material-symbols-outlined" style="font-size:16px;">edit</span></button> ' +
                     '<button class="btn-icon danger" onclick="openDeleteModal(\'' + title + '\')"><span class="material-symbols-outlined" style="font-size:16px;">delete</span></button>' +
                   '</td>';
    list.prepend(tr);
  }

  // Clear inputs form details
  document.getElementById('evtTitle').value = '';
  document.getElementById('evtDesc').value = '';
  document.getElementById('evtCategory').selectedIndex = 0;
  document.getElementById('evtDate').value = '';
  document.getElementById('evtTime').value = '';
  document.getElementById('evtMax').value = '';
  document.getElementById('evtVenue').value = '';
  if (document.getElementById('evtBanner')) document.getElementById('evtBanner').value = '';

  triggerToast('Event successfully created and published!', 'success');
  
  // Scroll to list
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
