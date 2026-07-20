const App = {
  init() {
    Storage.init();
    const path = window.location.pathname;

    if (path.includes("admin")) {
      Admin.render();
    } else if (path.includes("event-details")) {
      const params = new URLSearchParams(window.location.search);
      EventDetails.render(params.get("id"));
    } else if (path.includes("registration")) {
      const params = new URLSearchParams(window.location.search);
      Registration.render(params.get("id"));
    } else {
      Homepage.render();
    }
  },

  viewDetails(id) {
    var root = window.location.pathname.includes("/pages/") ? "../" : "";
    window.location.href = root + `pages/event-details.html?id=${id}`;
  },

  registerForEvent(eventId, name, email) {
    var event = Storage.getById(eventId);
    if (!event) return;

    var existing = Storage.getRegistrations().find(
      function(r) { return Number(r.eventId) === Number(eventId) && r.email === email; }
    );
    if (existing) {
      Toast("You're already registered for this event!", "error");
      return;
    }

    var freshEvent = Storage.getById(eventId);
    if (Number(freshEvent.attendees || 0) >= Number(freshEvent.maxAttendees)) {
      Toast("This event is fully booked.", "error");
      return;
    }

    Storage.addRegistration({
      eventId: event.id,
      eventTitle: event.title,
      name: name,
      email: email
    });

    Storage.update(eventId, { attendees: Number(freshEvent.attendees || 0) + 1 });
  }
};

document.addEventListener("DOMContentLoaded", () => App.init());
