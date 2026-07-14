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

  registerForEvent(eventId) {
    const event = Storage.getById(eventId);
    if (!event) return;

    if (event.attendees >= event.maxAttendees) {
      Toast("This event is fully booked.", "error");
      return;
    }

    Storage.update(eventId, { attendees: event.attendees + 1 });
    Toast("You're registered! 🎉");
  }
};

document.addEventListener("DOMContentLoaded", () => App.init());
