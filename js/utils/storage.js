const Storage = {
  key: "eventhub_events",
  regKey: "eventhub_registrations",
  userKey: "eventhub_users",

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

  // ---- Registrations ----
  getRegistrations() {
    const data = localStorage.getItem(this.regKey);
    return data ? JSON.parse(data) : [];
  },

  addRegistration(reg) {
    const regs = this.getRegistrations();
    reg.id = Date.now() + Math.random();
    reg.createdAt = new Date().toISOString();
    regs.push(reg);
    localStorage.setItem(this.regKey, JSON.stringify(regs));
    return reg;
  },

  getRegistrationsForEvent(eventId) {
    return this.getRegistrations().filter(r => Number(r.eventId) === Number(eventId));
  },

  // ---- Users / Auth ----
  getUsers() {
    const data = localStorage.getItem(this.userKey);
    return data ? JSON.parse(data) : [];
  },

  addUser(user) {
    const users = this.getUsers();
    if (users.find(u => u.email === user.email)) return null;
    user.id = Date.now();
    users.push(user);
    localStorage.setItem(this.userKey, JSON.stringify(users));
    return user;
  },

  authenticate(email, password) {
    const users = this.getUsers();
    return users.find(u => u.email === email && u.password === password) || null;
  }
};
