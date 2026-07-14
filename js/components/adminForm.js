function AdminForm(event) {
  const e = event || {};
  const isEdit = !!e.id;

  return `
    <form class="admin-form" id="adminEventForm">
      <h3>${isEdit ? "Edit Event" : "Create Event"}</h3>

      <label>Title</label>
      <input type="text" name="title" value="${Helpers.escapeHtml(e.title || "")}" required>
      <span class="form-error" data-field="title"></span>

      <label>Description</label>
      <textarea name="description">${Helpers.escapeHtml(e.description || "")}</textarea>

      <label>Category</label>
      <select name="category">
        <option value="Technology" ${e.category === "Technology" ? "selected" : ""}>Technology</option>
        <option value="Music" ${e.category === "Music" ? "selected" : ""}>Music</option>
        <option value="Art" ${e.category === "Art" ? "selected" : ""}>Art</option>
      </select>

      <label>Date</label>
      <input type="date" name="date" value="${e.date || ""}" required>
      <span class="form-error" data-field="date"></span>

      <label>Time</label>
      <input type="text" name="time" value="${e.time || ""}" placeholder="e.g. 10:00 AM">

      <label>Venue</label>
      <input type="text" name="location" value="${Helpers.escapeHtml(e.location || "")}">

      <label>Banner Image URL</label>
      <input type="url" name="image" value="${Helpers.escapeHtml(e.image || "")}" placeholder="https://...">

      <label>Max Attendees</label>
      <input type="number" name="maxAttendees" value="${e.maxAttendees || 50}" min="1">
      <span class="form-error" data-field="maxAttendees"></span>

      <button type="submit" class="btn btn-primary mt-1">
        ${isEdit ? "Update Event" : "Create Event"}
      </button>
      ${isEdit ? `<button type="button" class="btn btn-sm mt-1" id="cancelEdit">Cancel</button>` : ""}
      <input type="hidden" name="id" value="${e.id || ""}">
    </form>
  `;
}
