const Storage = {
  key: "eventhub_events",

  init() {
    if (!localStorage.getItem(this.key)) {
      this.save(DEFAULT_EVENTS);
    }
  },

  load() {
    const data = localStorage.getItem(this.key);
    return data ? JSON.parse(data) : DEFAULT_EVENTS;
  },

  save(events) {
    localStorage.setItem(this.key, JSON.stringify(events));
  },

  getById(id) {
    const numId = Number(id);
    return this.load().find(e => Number(e.id) === numId);
  },

  add(event) {
    const events = this.load();
    event.id = Date.now();
    event.attendees = 0;
    events.push(event);
    this.save(events);
    return event;
  },

  update(id, updates) {
    const events = this.load();
    const idx = events.findIndex(e => e.id === id);
    if (idx !== -1) {
      events[idx] = { ...events[idx], ...updates };
      this.save(events);
      return events[idx];
    }
    return null;
  },

  remove(id) {
    let events = this.load();
    events = events.filter(e => e.id !== id);
    this.save(events);
  }
};
