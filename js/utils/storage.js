const Storage = {
  key: "eventhub_events",
  regKey: "eventhub_registrations",

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
    const numId = Number(id);
    const idx = events.findIndex(e => Number(e.id) === numId);
    if (idx !== -1) {
      events[idx] = { ...events[idx], ...updates };
      this.save(events);
      return events[idx];
    }
    return null;
  },

  remove(id) {
    let events = this.load();
    const numId = Number(id);
    events = events.filter(e => Number(e.id) !== numId);
    this.save(events);
  },

  getRegistrations() {
    const data = localStorage.getItem(this.regKey);
    if (!data) return [];
    try { return JSON.parse(data); } catch(e) { return []; }
  },

  addRegistration(reg) {
    const regs = this.getRegistrations();
    reg.id = Date.now() + Math.random();
    reg.createdAt = new Date().toISOString();
    regs.push(reg);
    localStorage.setItem(this.regKey, JSON.stringify(regs));
    return reg;
  }
};
