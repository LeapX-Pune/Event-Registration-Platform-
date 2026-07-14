const ChatBot = {
  respond(userMessage) {
    const msg = userMessage.toLowerCase().trim();
    const events = Storage.load();

    if (msg.includes("tech") || msg.includes("technology")) {
      return this.filterResponse(events.filter(e => e.category === "Technology"), "tech");
    }
    if (msg.includes("music") || msg.includes("concert")) {
      return this.filterResponse(events.filter(e => e.category === "Music"), "music");
    }
    if (msg.includes("art") || msg.includes("design") || msg.includes("photography")) {
      return this.filterResponse(events.filter(e => e.category === "Art"), "art");
    }
    if (msg.includes("weekend") || msg.includes("this weekend")) {
      const weekend = this.getWeekendDates();
      const matches = events.filter(e => weekend.includes(e.date));
      if (matches.length) {
        return `This weekend we have: ${matches.map(e => e.title).join(", ")}.`;
      }
      return "No events this weekend. Check back soon!";
    }
    if (msg.includes("hello") || msg.includes("hi") || msg.includes("hey")) {
      return "Hello! Ask me about events by category (tech, music, art) or say 'this weekend'.";
    }
    if (msg.includes("event") || msg.includes("show") || msg.includes("all")) {
      return `We have ${events.length} events. Try filtering by category or date!`;
    }

    return `I'm not sure about that. Try asking about "tech events", "music", "art", or "this weekend".`;
  },

  filterResponse(events, label) {
    if (!events.length) return `No ${label} events scheduled. Check other categories!`;
    return `Here are our ${label} events: ${events.map(e => e.title).join(", ")}.`;
  },

  getWeekendDates() {
    const today = new Date();
    const day = today.getDay();
    const sat = new Date(today);
    sat.setDate(today.getDate() + (6 - day));
    const sun = new Date(today);
    sun.setDate(today.getDate() + (7 - day));
    return [sat.toISOString().split("T")[0], sun.toISOString().split("T")[0]];
  }
};
