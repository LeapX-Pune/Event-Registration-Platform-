const Registration = {
  render(eventId) {
    const app = document.getElementById("app");
    const event = Storage.getById(Number(eventId));

    if (!event) {
      app.innerHTML = `${Navbar()}<main class="container"><p class="no-events">Event not found.</p></main>`;
      return;
    }

    app.innerHTML = `
      ${Navbar()}
      <main class="container" style="margin-top:2rem;max-width:600px">
        <h1>Registration</h1>
        <p style="margin:1rem 0"><strong>${Helpers.escapeHtml(event.title)}</strong> &middot; ${Helpers.formatDate(event.date)}</p>
        <div class="admin-form" id="registrationForm">
          <label>Full Name</label>
          <input type="text" id="regName" required>
          <label>Email</label>
          <input type="email" id="regEmail" required>
          <button class="btn btn-primary mt-1" id="submitRegistration">Confirm Registration</button>
        </div>
        <a href="../index.html" style="color:#4361ee;display:inline-block;margin-top:1rem">&larr; Back</a>
      </main>
      <div class="toast-container" id="toastContainer"></div>
    `;

    document.getElementById("submitRegistration")?.addEventListener("click", () => {
      const name = document.getElementById("regName").value.trim();
      const email = document.getElementById("regEmail").value.trim();
      if (!name || !email) {
        Toast("Please fill in all fields.", "error");
        return;
      }
      var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        Toast("Please enter a valid email address.", "error");
        return;
      }
      App.registerForEvent(event.id, name, email);
      Toast(`Welcome, ${name}! You're registered for "${event.title}".`);
      document.getElementById("submitRegistration").disabled = true;
      setTimeout(function() { window.location.href = "../index.html"; }, 2000);
    });
  }
};
