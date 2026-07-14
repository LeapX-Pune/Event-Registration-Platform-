function EventCard(event, showDetailsBtn = true) {
  const imgSrc = event.image && event.image.trim()
    ? event.image
    : Helpers.placeholderImage();

  return `
    <div class="event-card" data-id="${event.id}">
      <img src="${imgSrc}" alt="${Helpers.escapeHtml(event.title)}" loading="lazy"
           onerror="this.src='${Helpers.placeholderImage()}'">
      <div class="content">
        <span class="badge">${Helpers.escapeHtml(event.category)}</span>
        <h3>${Helpers.escapeHtml(event.title)}</h3>
        <div class="meta">
          ${Helpers.formatDate(event.date)} &middot; ${event.time}<br>
          ${Helpers.escapeHtml(event.location)}
        </div>
        <div class="attendees">${event.attendees} / ${event.maxAttendees} registered</div>
        ${showDetailsBtn ? `<button class="btn btn-primary btn-sm mt-1" onclick="App.viewDetails(${event.id})">View Details</button>` : ""}
      </div>
    </div>
  `;
}
