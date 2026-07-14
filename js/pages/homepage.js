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
      ${ChatWidget()}
      <div class="toast-container" id="toastContainer"></div>
    `;

    this.renderEvents(events);
    this.bindFilters(events);
    this.bindChat();

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

  bindChat() {
    const input = document.getElementById("chatInput");
    const sendBtn = document.getElementById("chatSend");
    const messages = document.getElementById("chatMessages");
    const toggle = document.getElementById("chatToggle");
    const widget = document.getElementById("chatWidget");

    toggle.addEventListener("click", () => {
      const body = widget.querySelector(".chat-messages, .chat-input-area");
      const hdr = widget.querySelector(".chat-header");
      const all = widget.querySelectorAll(":scope > :not(.chat-header)");
      const hidden = all[0]?.style.display === "none";
      all.forEach(el => el.style.display = hidden ? "" : "none");
      toggle.textContent = hidden ? "\u00d7" : "\u002b";
    });

    function addMessage(text, role) {
      const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const div = document.createElement("div");
      div.className = `msg ${role}`;
      div.innerHTML = `${Helpers.escapeHtml(text)}<div class="timestamp">${time}</div>`;
      messages.appendChild(div);
      messages.scrollTop = messages.scrollHeight;
    }

    function handleSend() {
      const text = input.value.trim();
      if (!text) return;
      addMessage(text, "user");
      input.value = "";

      setTimeout(() => {
        const reply = ChatBot.respond(text);
        addMessage(reply, "bot");
      }, 400);
    }

    sendBtn.addEventListener("click", handleSend);
    input.addEventListener("keydown", e => { if (e.key === "Enter") handleSend(); });
  }
};
