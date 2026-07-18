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
  },

  // ---- Categories ----
  catKey: "eventhub_categories",

  getCategories() {
    const data = localStorage.getItem(this.catKey);
    if (data) return JSON.parse(data);
    const defaults = [
      { id: 1, name: "Music", icon: "music_note", color: "#9d4edd", eventCount: 0 },
      { id: 2, name: "Technology", icon: "computer", color: "#0ea5e9", eventCount: 0 },
      { id: 3, name: "Sports", icon: "sports_basketball", color: "#16a34a", eventCount: 0 },
      { id: 4, name: "Art", icon: "palette", color: "#ec4899", eventCount: 0 },
      { id: 5, name: "Workshop", icon: "school", color: "#d97706", eventCount: 0 },
      { id: 6, name: "Festival", icon: "celebration", color: "#dc2626", eventCount: 0 },
      { id: 7, name: "Business", icon: "business_center", color: "#2563eb", eventCount: 0 },
      { id: 8, name: "Education", icon: "menu_book", color: "#059669", eventCount: 0 },
      { id: 9, name: "Entertainment", icon: "theaters", color: "#7c3aed", eventCount: 0 },
      { id: 10, name: "Food", icon: "restaurant", color: "#ea580c", eventCount: 0 },
      { id: 11, name: "Health", icon: "favorite", color: "#0d9488", eventCount: 0 },
      { id: 12, name: "Community", icon: "groups", color: "#e11d48", eventCount: 0 }
    ];
    this.saveCategories(defaults);
    return defaults;
  },

  saveCategories(cats) {
    const events = this.load();
    cats.forEach(c => {
      c.eventCount = events.filter(e => (e.category || '').toLowerCase() === c.name.toLowerCase()).length;
    });
    localStorage.setItem(this.catKey, JSON.stringify(cats));
  },

  addCategory(cat) {
    const cats = this.getCategories();
    cat.id = Date.now();
    cat.eventCount = 0;
    cats.push(cat);
    this.saveCategories(cats);
    return cat;
  },

  updateCategory(id, updates) {
    const cats = this.getCategories();
    const idx = cats.findIndex(c => Number(c.id) === Number(id));
    if (idx !== -1) {
      cats[idx] = { ...cats[idx], ...updates };
      this.saveCategories(cats);
      return cats[idx];
    }
    return null;
  },

  removeCategory(id) {
    let cats = this.getCategories();
    cats = cats.filter(c => Number(c.id) !== Number(id));
    this.saveCategories(cats);
  }
};
