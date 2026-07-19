(function() {
  function init() {
    var session = sessionStorage.getItem('eventpulse_user');
    if (!session) {
      window.location.href = 'signin.html?redirect=my-events.html';
      return;
    }
    var user = JSON.parse(session);
    var container = document.getElementById('myEventsContainer');
    var subtitle = document.getElementById('myEventsSubtitle');
    if (!container) return;

    if (typeof Storage !== 'undefined' && Storage.init) Storage.init();
    var regs = Storage.getRegistrations();
    var myRegs = regs.filter(function(r) { return r.email === user.email; });

    if (subtitle) {
      subtitle.textContent = 'You have registered for ' + myRegs.length + ' event' + (myRegs.length !== 1 ? 's' : '') + '.';
    }

    if (!myRegs.length) {
      container.innerHTML =
        '<div style="text-align:center;padding:60px 20px;">' +
          '<span class="material-symbols-outlined" style="font-size:48px;color:var(--outline);margin-bottom:16px;">event_busy</span>' +
          '<h3 style="margin-bottom:8px;">No registrations yet</h3>' +
          '<p style="color:var(--on-surface-variant);margin-bottom:24px;">You haven\'t registered for any events yet.</p>' +
          '<a href="event-details.html" class="btn btn-primary">Browse Events</a>' +
        '</div>';
      return;
    }

    container.innerHTML = '<div style="display:flex;flex-direction:column;gap:16px;" id="myEventsList"></div>';
    var list = document.getElementById('myEventsList');

    myRegs.slice().reverse().forEach(function(reg) {
      var event = Storage.getById(reg.eventId);
      var eventTitle = reg.eventTitle || 'Unknown Event';
      var eventDate = event ? Helpers.formatDate(event.date) : 'N/A';
      var eventVenue = event ? (event.venue || event.location || 'N/A') : 'N/A';
      var regDate = reg.createdAt ? new Date(reg.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A';
      var imgUrl = (event && event.image) ? event.image.replace(/w=\d+/, 'w=400') : 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&q=80';

      var div = document.createElement('div');
      div.className = 'glass-panel';
      div.style.cssText = 'padding:20px;border-radius:var(--radius-lg);display:flex;gap:16px;align-items:center;flex-wrap:wrap;';
      div.innerHTML =
        '<div style="width:72px;height:72px;border-radius:var(--radius-md);overflow:hidden;flex-shrink:0;background:var(--surface-container-low);">' +
          '<img src="' + imgUrl + '" alt="' + Helpers.escapeHtml(eventTitle) + '" style="width:100%;height:100%;object-fit:cover;" onerror="this.style.display=\'none\'">' +
        '</div>' +
        '<div style="flex:1;min-width:200px;">' +
          '<h3 style="font-weight:700;font-size:16px;margin-bottom:4px;">' + Helpers.escapeHtml(eventTitle) + '</h3>' +
          '<p style="font-size:13px;color:var(--on-surface-variant);">' + Helpers.escapeHtml(eventVenue) + ' &bull; ' + Helpers.escapeHtml(eventDate) + '</p>' +
          '<p style="font-size:11px;color:var(--outline);">Registered on ' + regDate + '</p>' +
        '</div>' +
        '<a href="event-details.html?id=' + reg.eventId + '" class="btn btn-outline" style="padding:8px 20px;font-size:12px;flex-shrink:0;">View Event</a>';
      list.appendChild(div);
    });
  }

  document.addEventListener('DOMContentLoaded', init);
})();
