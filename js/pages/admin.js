const Admin = {
  editingId: null,

  render() {
    const app = document.getElementById("app");
    app.innerHTML = `
      ${Navbar("admin")}
      <main class="container" style="margin-top:1.5rem">
        <h1 class="mb-1">Admin Dashboard</h1>
        <div class="admin-layout">
          <div id="adminFormContainer">${AdminForm()}</div>
          <div id="adminTableContainer"></div>
        </div>
      </main>
      <div class="toast-container" id="toastContainer"></div>
    `;

    this.renderTable();
    this.bindForm();

    return app;
  },

  renderTable() {
    const container = document.getElementById("adminTableContainer");
    const events = Storage.load();

    if (!events.length) {
      container.innerHTML = '<p class="no-events">No events yet. Create one!</p>';
      return;
    }

    container.innerHTML = `
      <table class="admin-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Category</th>
            <th>Date</th>
            <th>Attendees</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          ${events.map(e => `
            <tr>
              <td>${Helpers.escapeHtml(e.title)}</td>
              <td>${e.category}</td>
              <td>${Helpers.formatDate(e.date)}</td>
              <td>${e.attendees}/${e.maxAttendees}</td>
              <td class="actions">
                <button class="btn btn-sm btn-primary" onclick="Admin.editEvent(${e.id})">Edit</button>
                <button class="btn btn-sm btn-danger" onclick="Admin.confirmDelete(${e.id})">Delete</button>
              </td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    `;
  },

  bindForm() {
    const form = document.getElementById("adminEventForm");
    if (!form) return;

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const data = Object.fromEntries(new FormData(form));

      const errors = Validator.validateEvent(data);
      document.querySelectorAll(".form-error").forEach(el => el.textContent = "");
      const hasErrors = Object.keys(errors).length;

      if (hasErrors) {
        Object.entries(errors).forEach(([field, msg]) => {
          const errEl = document.querySelector(`.form-error[data-field="${field}"]`);
          if (errEl) errEl.textContent = msg;
        });
        return;
      }

      if (this.editingId) {
        Storage.update(this.editingId, data);
        Toast("Event updated!");
        this.editingId = null;
      } else {
        Storage.add(data);
        Toast("Event created!");
      }

      this.renderTable();
      this.resetForm();
    });

    document.getElementById("cancelEdit")?.addEventListener("click", () => this.resetForm());
  },

  editEvent(id) {
    const event = Storage.getById(id);
    if (!event) return;
    this.editingId = id;
    document.getElementById("adminFormContainer").innerHTML = AdminForm(event);
    this.bindForm();
  },

  confirmDelete(id) {
    if (confirm("Delete this event?")) {
      Storage.remove(id);
      Toast("Event deleted.");
      if (this.editingId === id) this.resetForm();
      this.renderTable();
    }
  },

  resetForm() {
    this.editingId = null;
    document.getElementById("adminFormContainer").innerHTML = AdminForm();
    this.bindForm();
  }
};
