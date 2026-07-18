const Homepage = {
  render() {
    const app = document.getElementById("app");
    const events = Storage.load();
    const categories = [...new Set(events.map(e => e.category))];

    app.innerHTML = `
      ${Navbar("home")}
      <main class="container">
        <h1 class="mb-1" style="margin-top:1.5rem">Upcoming Events</h1>
        ${FilterPanel(categories)}
        <div class="event-grid" id="eventGrid"></div>
        <div class="no-events" id="noEvents" style="display:none">No events found.</div>
      </main>
      <div class="toast-container" id="toastContainer"></div>
    `;

    this.renderEvents(events);
    this.bindFilters(events);

    return app;
  },

  renderEvents(events) {
    const grid = document.getElementById("eventGrid");
    const none = document.getElementById("noEvents");

    if (!events.length) {
      grid.innerHTML = "";
      none.style.display = "block";
      return;
    }

    none.style.display = "none";
    grid.innerHTML = events.map(e => EventCard(e)).join("");
  },

  bindFilters(allEvents) {
    const catFilter = document.getElementById("categoryFilter");
    const dateFilter = document.getElementById("dateFilter");
    const searchFilter = document.getElementById("searchFilter");
    const clearBtn = document.getElementById("clearFilters");

    function filter() {
      const cat = catFilter.value;
      const date = dateFilter.value;
      const query = searchFilter.value.toLowerCase().trim();

      let filtered = allEvents;

      if (cat) filtered = filtered.filter(e => e.category === cat);
      if (date) filtered = filtered.filter(e => e.date === date);
      if (query) filtered = filtered.filter(e => e.title.toLowerCase().includes(query));

      Homepage.renderEvents(filtered);
    }

    catFilter.addEventListener("change", filter);
    dateFilter.addEventListener("change", filter);
    searchFilter.addEventListener("input", filter);
    clearBtn.addEventListener("click", () => {
      catFilter.value = "";
      dateFilter.value = "";
      searchFilter.value = "";
      Homepage.renderEvents(allEvents);
    });
  },

};
