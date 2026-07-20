const EventDetails = {
  render(eventId) {
    const app = document.getElementById("app");
    const event = Storage.getById(Number(eventId));

    if (!event) {
      app.innerHTML = `${Navbar()}<main class="container"><p class="no-events">Event not found.</p></main>`;
      return;
    }

    const imgSrc = event.image && event.image.trim()
      ? event.image
      : Helpers.placeholderImage();

    const full = event.attendees >= event.maxAttendees;

    app.innerHTML = `
      ${Navbar()}
      <main class="container" style="margin-top:2rem">
        <a href="../index.html" style="color:#4361ee">&larr; Back to Events</a>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:2rem;margin-top:1.5rem">
          <img src="${imgSrc}" alt="${Helpers.escapeHtml(event.title)}" style="width:100%;border-radius:12px;object-fit:cover;max-height:360px"
               onerror="this.src='${Helpers.placeholderImage()}'">
          <div>
            <span class="badge">${Helpers.escapeHtml(event.category)}</span>
            <h1 style="margin:0.5rem 0">${Helpers.escapeHtml(event.title)}</h1>
            <p style="color:#6c757d;margin-bottom:1rem">${Helpers.formatDate(event.date)} &middot; ${event.time}</p>
            <p style="color:#6c757d">${Helpers.escapeHtml(event.location)}</p>
            <p style="margin:1rem 0">${Helpers.escapeHtml(event.description)}</p>
            <p><strong>${event.attendees} / ${event.maxAttendees}</strong> registered</p>
            <button class="btn btn-primary mt-1" id="registerBtn" ${full ? "disabled" : ""}>
              ${full ? "Fully Booked" : "Register Now"}
            </button>
          </div>
        </div>
      </main>
      <div class="toast-container" id="toastContainer"></div>
    `;

    document.getElementById("registerBtn")?.addEventListener("click", () => {
      window.location.href = `registration.html?id=${event.id}`;
    });
  }
};
