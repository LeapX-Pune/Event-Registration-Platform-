/* =====================================================
   EventPulse - Admin Dashboard Page Interactions (JS)
   ===================================================== */

/* ----- Admin Authentication & Initialization ----- */
var editingEventId = null;

function getAdminUser() {
  var session = sessionStorage.getItem('eventpulse_user');
  if (session) {
    try { return JSON.parse(session); } catch(e) {}
  }
  return null;
}

function checkAdminAuth() {
  var user = getAdminUser();
  if (!user) {
    window.location.href = 'signin.html?redirect=admin.html';
    return;
  }
  var nameEls = document.querySelectorAll('.adm-user-name');
  nameEls.forEach(function(el) { el.textContent = user.name || user.email; });
}

function admLogout(event) {
  if (event) event.preventDefault();
  sessionStorage.removeItem('eventpulse_user');
  window.location.href = 'signin.html';
}

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

/* ----- Modal delete event flow ----- */
var currentDeletingEventId = null;

function openDeleteModal(eventId, eventName) {
  var modal = document.getElementById('admModal');
  var label = document.getElementById('delModalEventName');
  if (!modal) return;

  currentDeletingEventId = eventId;
  if (label) label.textContent = 'You are deleting "' + eventName + '". This action cannot be undone.';
  modal.classList.add('active');
}

function closeDeleteModal() {
  var modal = document.getElementById('admModal');
  if (modal) modal.classList.remove('active');
  currentDeletingEventId = null;
}

function confirmDeleteEvent() {
  if (currentDeletingEventId !== null) {
    Storage.remove(currentDeletingEventId);
    triggerToast('Event successfully deleted!', 'success');
    closeDeleteModal();
    admRenderEvents();
  }
}

/* ----- Render Events and Stats ----- */
function getCategoryTagClass(cat) {
  const c = (cat || '').toLowerCase();
  if (c === 'music') return 'tag tag-primary';
  if (c === 'technology' || c === 'tech') return 'tag tag-secondary';
  if (c === 'sports') return 'tag tag-tertiary';
  return 'tag';
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  const options = { month: 'short', day: 'numeric', year: 'numeric' };
  return d.toLocaleDateString('en-US', options);
}

function updateDashboardStats(events) {
  const statNums = document.querySelectorAll('.adm-stat-num');
  if (statNums.length >= 4) {
    const totalEvents = events.length;
    const totalRegistrations = events.reduce((sum, e) => sum + (e.attendees || 0), 0);
    const todayStr = new Date().toISOString().split('T')[0];
    const upcomingEvents = events.filter(e => e.date >= todayStr).length;
    const uniqueCats = new Set(events.map(e => e.category)).size;
    
    statNums[0].textContent = totalEvents;
    statNums[1].textContent = totalRegistrations.toLocaleString();
    statNums[2].textContent = upcomingEvents;
    statNums[3].textContent = uniqueCats;
  }
}

function admRenderEvents() {
  const events = Storage.load();

  // 1. Render Dashboard Table
  const dashboardList = document.getElementById('admDashboardList');
  if (dashboardList) {
    dashboardList.innerHTML = '';
    events.slice().reverse().forEach(event => {
      const tr = document.createElement('tr');
      const categoryTag = getCategoryTagClass(event.category);
      const dateStr = formatDate(event.date);
      const isPublished = event.isDraft ? 'Draft' : 'Published';
      const statusTag = event.isDraft ? 'tag' : 'tag tag-tertiary';
      const statusStyle = event.isDraft ? 'background:rgba(217,119,6,0.1);color:#d97706;border-color:rgba(217,119,6,0.2);' : 'background:rgba(171,214,0,0.1);color:var(--tertiary);border-color:rgba(171,214,0,0.2);';
      
      tr.innerHTML = `
        <td style="font-weight:600;color:var(--on-surface);">${Helpers.escapeHtml(event.title)}</td>
        <td><span class="${categoryTag}" style="font-size:10px;padding:2px 8px;">${Helpers.escapeHtml(event.category)}</span></td>
        <td style="font-family:var(--font-mono);font-size:13px;">${dateStr}</td>
        <td>${Helpers.escapeHtml(event.venue || event.location)}</td>
        <td><span class="${statusTag}" style="${statusStyle}font-size:11px;">${isPublished}</span></td>
        <td style="text-align:right;">
          <button class="btn-icon" style="padding:4px;" aria-label="Edit event" onclick="admEditEvent(${event.id})"><span class="material-symbols-outlined" style="font-size:16px;">edit</span></button>
          <button class="btn-icon danger" style="padding:4px;" aria-label="Delete event" onclick="openDeleteModal(${event.id}, '${Helpers.escapeHtml(event.title.replace(/'/g, "\\'"))}')"><span class="material-symbols-outlined" style="font-size:16px;">delete</span></button>
        </td>
      `;
      dashboardList.appendChild(tr);
    });
  }

  // 2. Render Full Manage Events Table
  const list = document.getElementById('admEventsList');
  if (list) {
    list.innerHTML = '';
    events.slice().reverse().forEach(event => {
      const tr = document.createElement('tr');
      const categoryTag = getCategoryTagClass(event.category);
      const dateStr = formatDate(event.date);
      const isPublished = event.isDraft ? 'Draft' : 'Published';
      const statusTag = event.isDraft ? 'tag' : 'tag tag-tertiary';
      const statusStyle = event.isDraft ? 'background:rgba(217,119,6,0.1);color:#d97706;' : 'background:rgba(171,214,0,0.1);color:var(--tertiary);';
      
      tr.innerHTML = `
        <td style="font-weight:600;">${Helpers.escapeHtml(event.title)}</td>
        <td><span class="${categoryTag}" style="font-size:10px;">${Helpers.escapeHtml(event.category)}</span></td>
        <td>${dateStr}</td>
        <td>${Helpers.escapeHtml(event.time || '12:00')}</td>
        <td>${Helpers.escapeHtml(event.venue || event.location)}</td>
        <td>${event.attendees || 0} / ${event.maxAttendees || 100}</td>
        <td><span class="${statusTag}" style="${statusStyle}font-size:11px;">${isPublished}</span></td>
        <td style="text-align:right;">
          <button class="btn-icon" aria-label="Edit" onclick="admEditEvent(${event.id})"><span class="material-symbols-outlined" style="font-size:16px;">edit</span></button>
          <button class="btn-icon danger" onclick="openDeleteModal(${event.id}, '${Helpers.escapeHtml(event.title.replace(/'/g, "\\'"))}')"><span class="material-symbols-outlined" style="font-size:16px;">delete</span></button>
        </td>
      `;
      list.appendChild(tr);
    });
  }

  // 3. Stats update
  updateDashboardStats(events);

  // 4. Render Attendees / Registrations
  admRenderRegistrations();
}

function admRenderRegistrations() {
  const regs = (typeof Storage !== 'undefined' && Storage.getRegistrations) ? Storage.getRegistrations() : [];
  const list = document.getElementById('admAttendeesList');
  if (!list) return;

  list.innerHTML = '';
  if (!regs.length) {
    list.innerHTML = '<tr><td colspan="6" style="text-align:center;color:var(--on-surface-variant);padding:32px;">No registrations yet.</td></tr>';
  } else {
    regs.slice().reverse().forEach(function(reg) {
      const tr = document.createElement('tr');
      const dateStr = reg.createdAt ? new Date(reg.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A';
      tr.innerHTML = `
        <td style="font-weight:600;">${Helpers.escapeHtml(reg.name)}</td>
        <td>${Helpers.escapeHtml(reg.email)}</td>
        <td>${Helpers.escapeHtml(reg.eventTitle || 'Unknown Event')}</td>
        <td>${dateStr}</td>
        <td><span class="tag tag-tertiary" style="background:rgba(171,214,0,0.1);color:var(--tertiary);font-size:10px;">Confirmed</span></td>
        <td style="text-align:right;">
          <button class="btn-icon danger" onclick="triggerToast('Registration removed','info')"><span class="material-symbols-outlined" style="font-size:16px;">close</span></button>
        </td>
      `;
      list.appendChild(tr);
    });
  }

  const totalEl = document.getElementById('admTotalRegs');
  if (totalEl) totalEl.textContent = regs.length;

  const uniqueAttendees = new Set(regs.map(function(r) { return r.email; })).size;
  const uniqueEl = document.getElementById('admUniqueAttendees');
  if (uniqueEl) uniqueEl.textContent = uniqueAttendees;

  const eventsWithRegs = new Set(regs.map(function(r) { return r.eventId; })).size;
  const eventsEl = document.getElementById('admEventsWithRegs');
  if (eventsEl) eventsEl.textContent = eventsWithRegs;
}

/* ----- Add & Edit Event Flow ----- */
function admEditEvent(id) {
  const event = Storage.getById(id);
  if (!event) return;

  editingEventId = id;
  
  // Set fields
  document.getElementById('evtTitle').value = event.title || '';
  document.getElementById('evtDesc').value = event.description || '';
  document.getElementById('evtCategory').value = event.category || '';
  document.getElementById('evtDate').value = event.date || '';
  document.getElementById('evtTime').value = event.time || '';
  document.getElementById('evtMax').value = event.maxAttendees || '';
  document.getElementById('evtVenue').value = event.venue || event.location || '';
  document.getElementById('evtBanner').value = event.image || '';

  // Update UI headers & buttons
  const formTitle = document.querySelector('#createEventFormPanel h2');
  if (formTitle) formTitle.textContent = 'Edit Event: ' + event.title;
  
  const submitBtn = document.querySelector('#createEventFormPanel button[type="submit"]');
  if (submitBtn) submitBtn.textContent = 'Save Changes';

  // Navigate/scroll to the form
  admGoTo('events');
  const panel = document.getElementById('createEventFormPanel');
  if (panel) {
    panel.scrollIntoView({ behavior: 'smooth' });
  }
}

function resetForm() {
  editingEventId = null;
  document.getElementById('evtTitle').value = '';
  document.getElementById('evtDesc').value = '';
  document.getElementById('evtCategory').selectedIndex = 0;
  document.getElementById('evtDate').value = '';
  document.getElementById('evtTime').value = '';
  document.getElementById('evtMax').value = '';
  document.getElementById('evtVenue').value = '';
  document.getElementById('evtBanner').value = '';

  const formTitle = document.querySelector('#createEventFormPanel h2');
  if (formTitle) formTitle.textContent = 'Create New Event';

  const submitBtn = document.querySelector('#createEventFormPanel button[type="submit"]');
  if (submitBtn) submitBtn.textContent = 'Publish Event';
}

function handleFormSubmit(event, isDraft) {
  if (event) event.preventDefault();

  const title = document.getElementById('evtTitle').value.trim();
  const desc = document.getElementById('evtDesc').value.trim();
  const category = document.getElementById('evtCategory').value;
  const date = document.getElementById('evtDate').value;
  const time = document.getElementById('evtTime').value;
  const max = parseInt(document.getElementById('evtMax').value);
  const venue = document.getElementById('evtVenue').value.trim();
  const banner = document.getElementById('evtBanner').value.trim();

  // Validations
  if (!title || !desc || !category || !date || !time || isNaN(max) || !venue) {
    triggerToast("Please fill in all required fields.", "error");
    return;
  }

  if (max <= 0) {
    triggerToast("Max attendees must be greater than zero.", "error");
    return;
  }

  const today = new Date();
  today.setHours(0,0,0,0);
  const selectedDate = new Date(date);
  if (selectedDate < today) {
    triggerToast("Event date cannot be in the past.", "error");
    return;
  }

  const eventData = {
    title: title,
    description: desc,
    category: category,
    date: date,
    time: time,
    maxAttendees: max,
    location: venue,
    venue: venue,
    image: banner || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&q=80",
    isDraft: !!isDraft
  };

  if (editingEventId !== null) {
    Storage.update(editingEventId, eventData);
    triggerToast("Event successfully updated!", "success");
  } else {
    Storage.add(eventData);
    triggerToast("Event successfully created!", "success");
  }

  resetForm();
  admRenderEvents();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Bind checkAdminAuth on load
document.addEventListener('DOMContentLoaded', function() {
  checkAdminAuth();
  admRenderEvents();

  // Bind form submit triggers
  const form = document.querySelector('#createEventFormPanel form');
  if (form) {
    form.addEventListener('submit', function(e) {
      handleFormSubmit(e, false);
    });
    
    // Bind Draft button
    const draftBtn = document.querySelector('#createEventFormPanel button[onclick*="Draft"]');
    if (draftBtn) {
      // Remove original inline action
      draftBtn.removeAttribute('onclick');
      draftBtn.addEventListener('click', function(e) {
        handleFormSubmit(null, true);
      });
    }
  }
});
