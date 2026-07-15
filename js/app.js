const Theme = {
  storageKey: "eventhub-theme",

  getStoredTheme() {
    return localStorage.getItem(this.storageKey);
  },

  apply(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    const toggle = document.querySelector("[data-theme-toggle]");

    if (toggle) {
      const isDark = theme === "dark";
      toggle.classList.toggle("is-active", isDark);
      toggle.setAttribute("aria-pressed", String(isDark));
      toggle.setAttribute("aria-label", isDark ? "Switch to light mode" : "Switch to dark mode");
    }
  },

  bind() {
    const toggle = document.querySelector("[data-theme-toggle]");
    if (!toggle) return;

    toggle.addEventListener("click", () => {
      const currentTheme = document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";
      const nextTheme = currentTheme === "dark" ? "light" : "dark";
      localStorage.setItem(this.storageKey, nextTheme);
      this.apply(nextTheme);
    });
  },

  init() {
    const savedTheme = this.getStoredTheme();
    const preferredTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    const activeTheme = savedTheme === "dark" || savedTheme === "light" ? savedTheme : preferredTheme;

    this.apply(activeTheme);
    this.bind();
  }
};

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

    Theme.init();
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
