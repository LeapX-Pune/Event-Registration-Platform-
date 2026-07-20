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
    window.location.href = `pages/event-details.html?id=${id}`;
  },

  registerForEvent(eventId, name, email) {
    const event = Storage.getById(eventId);
    if (!event) return;

    const freshEvent = Storage.getById(eventId);
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
