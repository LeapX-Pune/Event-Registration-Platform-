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
  if (!user || (user.role !== 'admin' && user.email !== 'admin')) {
    window.location.href = 'signin.html?redirect=admin.html';
    return;
  }
  
  // Update name
  var nameEls = document.querySelectorAll('.adm-user-name');
  nameEls.forEach(function(el) { el.textContent = user.name || user.email; });
  
  var topbarName = document.getElementById('admTopbarName');
  if (topbarName) {
    topbarName.textContent = user.name || "Admin";
  }

  // Update avatars
  var defaultAvatarHtml = '<span class="material-symbols-outlined">person</span>';
  var topbarAvatarHtml = user.name ? user.name.charAt(0).toUpperCase() : 'A';
  
  var topbarAvatar = document.getElementById('admTopbarAvatar');
  var sidebarAvatar = document.getElementById('admSidebarAvatar');
  
  if (user.photo) {
    var imgHtml = '<img src="' + user.photo + '" style="width:100%;height:100%;object-fit:cover;border-radius:50%;">';
    if (topbarAvatar) topbarAvatar.innerHTML = imgHtml;
    if (sidebarAvatar) sidebarAvatar.innerHTML = imgHtml;
  } else {
    if (topbarAvatar) topbarAvatar.innerHTML = topbarAvatarHtml;
    if (sidebarAvatar) sidebarAvatar.innerHTML = defaultAvatarHtml;
  }
}

function admLogout(event) {
  if (event) event.preventDefault();
  sessionStorage.removeItem('eventpulse_user');
  window.location.href = 'index.html';
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
function triggerToast(message, type) {
  if (typeof showToast === 'function') showToast(message, type);
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

/* ============================================================
   Admin: Categories CRUD
   ============================================================ */
var admEditingCategoryId = null;

function admRenderCategories() {
  var grid = document.getElementById('admCategoryGrid');
  if (!grid) return;
  var cats = (typeof Storage !== 'undefined' && Storage.getCategories) ? Storage.getCategories() : [];
  
  grid.innerHTML = cats.map(function(cat) {
    var icon = cat.icon || 'category';
    var color = cat.color || '#9d4edd';
    return (
      '<div class="adm-category-card" data-cat-id="' + cat.id + '">' +
        '<div style="display:flex;align-items:center;gap:16px;">' +
          '<div style="width:48px;height:48px;background:rgba(224,182,255,0.12);color:' + color + ';border-radius:var(--radius-lg);display:flex;align-items:center;justify-content:center;">' +
            '<span class="material-symbols-outlined">' + icon + '</span>' +
          '</div>' +
          '<div>' +
            '<h3 style="font-weight:700;font-size:18px;">' + Helpers.escapeHtml(cat.name) + '</h3>' +
            '<p style="font-size:12px;color:var(--outline);font-family:var(--font-mono);">' + (cat.eventCount || 0) + ' Active Events</p>' +
          '</div>' +
        '</div>' +
        '<div style="display:flex;gap:8px;margin-top:20px;border-top:1px solid rgba(77,67,83,0.2);padding-top:16px;">' +
          '<button class="btn btn-outline w-full" style="padding:6px;font-size:11px;justify-content:center;" onclick="admEditCategory(' + cat.id + ')">Edit</button>' +
          '<button class="btn btn-icon danger" onclick="admDeleteCategory(' + cat.id + ', \'' + Helpers.escapeHtml(cat.name.replace(/'/g, "\\'")) + '\')" aria-label="Delete Category"><span class="material-symbols-outlined">delete</span></button>' +
        '</div>' +
      '</div>'
    );
  }).join('');
}

function admOpenCategoryModal() {
  admEditingCategoryId = null;
  document.getElementById('admCategoryModalTitle').textContent = 'Add Category';
  document.getElementById('catName').value = '';
  document.getElementById('catIcon').value = 'category';
  document.getElementById('catColor').value = '#9d4edd';
  document.getElementById('admCategoryModal').classList.add('active');
}

function admCloseCategoryModal() {
  document.getElementById('admCategoryModal').classList.remove('active');
  admEditingCategoryId = null;
}

function admEditCategory(id) {
  var cats = Storage.getCategories();
  var cat = cats.find(function(c) { return Number(c.id) === Number(id); });
  if (!cat) return;
  admEditingCategoryId = cat.id;
  document.getElementById('admCategoryModalTitle').textContent = 'Edit Category: ' + cat.name;
  document.getElementById('catName').value = cat.name;
  document.getElementById('catIcon').value = cat.icon || 'category';
  document.getElementById('catColor').value = cat.color || '#9d4edd';
  document.getElementById('admCategoryModal').classList.add('active');
}

function admSaveCategory() {
  var name = document.getElementById('catName').value.trim();
  var icon = document.getElementById('catIcon').value.trim() || 'category';
  var color = document.getElementById('catColor').value.trim() || '#9d4edd';
  if (!name) {
    triggerToast('Please enter a category name.', 'error');
    return;
  }
  if (admEditingCategoryId !== null) {
    Storage.updateCategory(admEditingCategoryId, { name: name, icon: icon, color: color });
    triggerToast('Category updated!', 'success');
  } else {
    Storage.addCategory({ name: name, icon: icon, color: color });
    triggerToast('Category added!', 'success');
  }
  admCloseCategoryModal();
  admRenderCategories();
}

function admDeleteCategory(id, name) {
  if (!confirm('Delete category "' + name + '"? Events in this category will not be deleted.')) return;
  Storage.removeCategory(id);
  triggerToast('Category "' + name + '" deleted.', 'success');
  admRenderCategories();
}

/* ============================================================
   Admin: Analytics Charts (Canvas-based)
   ============================================================ */
function admRenderCharts() {
  var events = Storage.load();
  if (!events || !events.length) return;
  
  // Bar chart: registrations per category
  var barCanvas = document.getElementById('admBarChart');
  if (barCanvas) {
    var ctx = barCanvas.getContext('2d');
    var w = barCanvas.width;
    var h = barCanvas.height;
    ctx.clearRect(0, 0, w, h);
    
    var catMap = {};
    events.forEach(function(e) {
      var cat = e.category || 'Other';
      catMap[cat] = (catMap[cat] || 0) + (e.attendees || 0);
    });
    var labels = Object.keys(catMap);
    var values = Object.values(catMap);
    if (!labels.length) return;
    
    var maxVal = Math.max.apply(null, values);
    var padding = { top: 20, bottom: 40, left: 40, right: 20 };
    var chartW = w - padding.left - padding.right;
    var chartH = h - padding.top - padding.bottom;
    var barW = Math.min(40, chartW / labels.length - 8);
    
    ctx.clearRect(0, 0, w, h);
    
    // Title
    ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--on-surface').trim() || '#e0e0e0';
    ctx.font = '12px Sora, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Registrations by Category', w / 2, 14);
    
    var colors = ['#9d4edd', '#0ea5e9', '#16a34a', '#ec4899', '#d97706', '#dc2626', '#2563eb', '#059669', '#7c3aed', '#ea580c', '#0d9488', '#e11d48'];
    
    labels.forEach(function(label, i) {
      var x = padding.left + (chartW / labels.length) * i + (chartW / labels.length - barW) / 2;
      var valH = (values[i] / maxVal) * chartH;
      var y = padding.top + chartH - valH;
      
      ctx.fillStyle = colors[i % colors.length];
      ctx.fillRect(x, y, barW, valH);
      
      // Label
      ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--on-surface-variant').trim() || '#a0a0a0';
      ctx.font = '9px Sora, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(label.substring(0, 6), x + barW / 2, h - padding.bottom + 14);
      
      // Value
      ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--on-surface').trim() || '#e0e0e0';
      ctx.font = 'bold 10px JetBrains Mono, monospace';
      ctx.fillText(String(values[i]), x + barW / 2, y - 4);
    });
  }
  
  // Pie chart: event distribution by category
  var pieCanvas = document.getElementById('admPieChart');
  if (pieCanvas) {
    var ctx2 = pieCanvas.getContext('2d');
    var pw = pieCanvas.width;
    var ph = pieCanvas.height;
    ctx2.clearRect(0, 0, pw, ph);
    
    var catCount = {};
    events.forEach(function(e) {
      var cat = e.category || 'Other';
      catCount[cat] = (catCount[cat] || 0) + 1;
    });
    var pieLabels = Object.keys(catCount);
    var pieValues = Object.values(catCount);
    var total = pieValues.reduce(function(a, b) { return a + b; }, 0);
    if (!total) return;
    
    var cx = pw / 2;
    var cy = ph / 2 - 10;
    var radius = Math.min(cx, cy) - 20;
    var startAngle = -Math.PI / 2;
    
    ctx2.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--on-surface').trim() || '#e0e0e0';
    ctx2.font = '12px Sora, sans-serif';
    ctx2.textAlign = 'center';
    ctx2.fillText('Events by Category', pw / 2, 14);
    
    pieValues.forEach(function(val, i) {
      var sliceAngle = (val / total) * 2 * Math.PI;
      ctx2.beginPath();
      ctx2.moveTo(cx, cy);
      ctx2.arc(cx, cy, radius, startAngle, startAngle + sliceAngle);
      ctx2.closePath();
      ctx2.fillStyle = colors[i % colors.length];
      ctx2.fill();
      
      var midAngle = startAngle + sliceAngle / 2;
      var lx = cx + (radius * 0.6) * Math.cos(midAngle);
      var ly = cy + (radius * 0.6) * Math.sin(midAngle);
      ctx2.fillStyle = '#fff';
      ctx2.font = 'bold 10px JetBrains Mono, monospace';
      ctx2.textAlign = 'center';
      if (val / total > 0.05) {
        ctx2.fillText(String(val), lx, ly + 3);
      }
      
      startAngle += sliceAngle;
    });
    
    // Legend
    var legendY = ph - 20;
    var legendX = 20;
    pieLabels.forEach(function(label, i) {
      ctx2.fillStyle = colors[i % colors.length];
      ctx2.fillRect(legendX, legendY - 6, 8, 8);
      ctx2.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--on-surface-variant').trim() || '#a0a0a0';
      ctx2.font = '9px Sora, sans-serif';
      ctx2.textAlign = 'left';
      ctx2.fillText(label.substring(0, 12), legendX + 12, legendY + 1);
      legendX += ctx2.measureText(label.substring(0, 12)).width + 24;
      if (legendX > pw - 40) { legendX = 20; legendY += 16; }
    });
  }
}

/* ============================================================
   Admin: Settings Persistence
   ============================================================ */
function admLoadSettings() {
  var user = getAdminUser();
  if (!user) return;
  
  var nameEl = document.getElementById('adminName');
  var emailEl = document.getElementById('adminEmail');
  var passEl = document.getElementById('adminPass');
  var photoPreview = document.getElementById('settingsAdminPhotoPreview');
  
  if (nameEl) nameEl.value = user.name || '';
  if (emailEl) emailEl.value = user.email || 'admin';
  if (passEl) passEl.value = user.password || 'admin123';
  
  if (photoPreview) {
    if (user.photo) {
      photoPreview.innerHTML = '<img src="' + user.photo + '" style="width:100%;height:100%;object-fit:cover;border-radius:50%;">';
    } else {
      photoPreview.innerHTML = '<span class="material-symbols-outlined" style="color:var(--primary);font-size:36px;">person</span>';
    }
  }

  var saved = localStorage.getItem('eventhub_admin_settings');
  if (saved) {
    try {
      var s = JSON.parse(saved);
      var toggles = document.querySelectorAll('#adm-sec-settings input[type="checkbox"]');
      if (toggles[0]) toggles[0].checked = s.realtimeSearch !== false;
      if (toggles[1]) toggles[1].checked = s.notifEmails !== false;
    } catch(e) {}
  }
}

function admSaveSettings() {
  var user = getAdminUser();
  if (!user) return;
  
  var nameEl = document.getElementById('adminName');
  var passEl = document.getElementById('adminPass');
  var photoInput = document.getElementById('settingsAdminPhoto');
  var toggles = document.querySelectorAll('#adm-sec-settings input[type="checkbox"]');
  
  var newName = nameEl ? nameEl.value.trim() : user.name;
  var newPass = passEl ? passEl.value : user.password;
  
  if (!newName) {
    triggerToast('Display Name cannot be empty', 'error');
    return;
  }
  
  if (newPass !== 'admin123') {
    triggerToast('Admin Password must be "admin123" only!', 'error');
    return;
  }
  
  var saveAndApply = function(photoBase64) {
    var updatedPhoto = photoBase64 || user.photo;
    
    // Update user object
    user.name = newName;
    user.photo = updatedPhoto;
    user.password = newPass;
    
    // Save to users list in localStorage
    if (window.Storage) {
      Storage.addUser(user); // Will overwrite/update the admin user
    }
    
    // Save to active session
    sessionStorage.setItem('eventpulse_user', JSON.stringify(user));
    
    // Update settings preferences
    var settings = {
      realtimeSearch: toggles[0] ? toggles[0].checked : true,
      notifEmails: toggles[1] ? toggles[1].checked : true
    };
    localStorage.setItem('eventhub_admin_settings', JSON.stringify(settings));
    
    // Refresh header / sidebar details
    checkAdminAuth();
    admLoadSettings();
    triggerToast('Admin settings successfully updated!', 'success');
  };
  
  if (photoInput && photoInput.files && photoInput.files[0]) {
    var reader = new FileReader();
    reader.onload = function(e) {
      saveAndApply(e.target.result);
    };
    reader.readAsDataURL(photoInput.files[0]);
  } else {
    saveAndApply(null);
  }
}

/* ============================================================
   Admin: Attendee Removal (Real)
   ============================================================ */
function admRemoveRegistration(regId) {
  if (!confirm('Remove this registration?')) return;
  var regs = Storage.getRegistrations();
  var reg = regs.find(function(r) { return Number(r.id) === Number(regId); });
  if (reg) {
    var event = Storage.getById(reg.eventId);
    if (event) {
      Storage.update(reg.eventId, { attendees: Math.max(0, (event.attendees || 0) - 1) });
    }
  }
  regs = regs.filter(function(r) { return Number(r.id) !== Number(regId); });
  localStorage.setItem(Storage.regKey, JSON.stringify(regs));
  triggerToast('Registration removed', 'info');
  admRenderRegistrations();
  admRenderEvents();
}

function admRenderRegistrations() {
  var regs = (typeof Storage !== 'undefined' && Storage.getRegistrations) ? Storage.getRegistrations() : [];
  var list = document.getElementById('admAttendeesList');
  if (!list) return;

  list.innerHTML = '';
  if (!regs.length) {
    list.innerHTML = '<tr><td colspan="6" style="text-align:center;color:var(--on-surface-variant);padding:32px;">No registrations yet.</td></tr>';
  } else {
    regs.slice().reverse().forEach(function(reg) {
      var tr = document.createElement('tr');
      var dateStr = reg.createdAt ? new Date(reg.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A';
      tr.innerHTML = [
        '<td style="font-weight:600;">' + Helpers.escapeHtml(reg.name) + '</td>',
        '<td>' + Helpers.escapeHtml(reg.email) + '</td>',
        '<td>' + Helpers.escapeHtml(reg.eventTitle || 'Unknown Event') + '</td>',
        '<td>' + dateStr + '</td>',
        '<td><span class="tag tag-tertiary" style="background:rgba(171,214,0,0.1);color:var(--tertiary);font-size:10px;">Confirmed</span></td>',
        '<td style="text-align:right;">',
          '<button class="btn-icon danger" onclick="admRemoveRegistration(' + reg.id + ')"><span class="material-symbols-outlined" style="font-size:16px;">close</span></button>',
        '</td>'
      ].join('');
      list.appendChild(tr);
    });
  }

  var totalEl = document.getElementById('admTotalRegs');
  if (totalEl) totalEl.textContent = regs.length;

  var uniqueAttendees = new Set(regs.map(function(r) { return r.email; })).size;
  var uniqueEl = document.getElementById('admUniqueAttendees');
  if (uniqueEl) uniqueEl.textContent = uniqueAttendees;

  var eventsWithRegs = new Set(regs.map(function(r) { return r.eventId; })).size;
  var eventsEl = document.getElementById('admEventsWithRegs');
  if (eventsEl) eventsEl.textContent = eventsWithRegs;
}

/* ============================================================
   Admin: Download Report (CSV) / Export List
   ============================================================ */
function admDownloadReport() {
  var events = Storage.load();
  if (!events || !events.length) {
    triggerToast('No events data to export.', 'info');
    return;
  }
  var rows = [['Title','Category','Date','Time','Venue','Attendees','MaxAttendees','Status']];
  events.forEach(function(e) {
    rows.push([
      '"' + (e.title || '').replace(/"/g, '""') + '"',
      '"' + (e.category || '').replace(/"/g, '""') + '"',
      e.date || '',
      e.time || '',
      '"' + (e.venue || e.location || '').replace(/"/g, '""') + '"',
      e.attendees || 0,
      e.maxAttendees || 0,
      e.isDraft ? 'Draft' : 'Published'
    ]);
  });
  var csv = rows.map(function(r) { return r.join(','); }).join('\n');
  var blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  var link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'eventpulse_events_report_' + new Date().toISOString().split('T')[0] + '.csv';
  link.click();
  URL.revokeObjectURL(link.href);
  triggerToast('Report downloaded as CSV', 'success');
}

function admExportAttendees() {
  var regs = Storage.getRegistrations();
  if (!regs || !regs.length) {
    triggerToast('No registrations to export.', 'info');
    return;
  }
  var rows = [['Name','Email','Event','Date','Phone','Company']];
  regs.forEach(function(r) {
    rows.push([
      '"' + (r.name || '').replace(/"/g, '""') + '"',
      '"' + (r.email || '').replace(/"/g, '""') + '"',
      '"' + (r.eventTitle || '').replace(/"/g, '""') + '"',
      r.createdAt ? new Date(r.createdAt).toISOString().split('T')[0] : '',
      '"' + (r.phone || '').replace(/"/g, '""') + '"',
      '"' + (r.company || '').replace(/"/g, '""') + '"'
    ]);
  });
  var csv = rows.map(function(r) { return r.join(','); }).join('\n');
  var blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  var link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'eventpulse_attendees_' + new Date().toISOString().split('T')[0] + '.csv';
  link.click();
  URL.revokeObjectURL(link.href);
  triggerToast('Attendees list exported to CSV', 'success');
}

// Bind checkAdminAuth on load
document.addEventListener('DOMContentLoaded', function() {
  checkAdminAuth();
  admRenderEvents();
  admRenderCategories();
  admLoadSettings();

  // Bind form submit triggers
  var form = document.querySelector('#createEventFormPanel form');
  if (form) {
    form.addEventListener('submit', function(e) {
      handleFormSubmit(e, false);
    });
    
    // Bind Draft button - fixed robust selector
    var draftBtn = document.querySelector('#createEventFormPanel .btn-outline');
    if (draftBtn && draftBtn.textContent.trim().indexOf('Draft') !== -1) {
      draftBtn.removeAttribute('onclick');
      draftBtn.addEventListener('click', function(e) {
        handleFormSubmit(null, true);
      });
    }
  }
  
  // Analytics charts: render after section becomes visible
  var analyticsObserver = new MutationObserver(function() {
    var sec = document.getElementById('adm-sec-analytics');
    if (sec && sec.style.display !== 'none') {
      setTimeout(admRenderCharts, 100);
    }
  });
  var analyticsSec = document.getElementById('adm-sec-analytics');
  if (analyticsSec) {
    analyticsObserver.observe(analyticsSec, { attributes: true, attributeFilter: ['style'] });
  }
  
  // Bind settings form
  var settingsForm = document.querySelector('#adm-sec-settings form');
  if (settingsForm) {
    settingsForm.addEventListener('submit', function(e) {
      e.preventDefault();
      admSaveSettings();
    });
  }
});
