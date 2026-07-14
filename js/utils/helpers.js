const Helpers = {
  formatDate(dateStr) {
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric", month: "short", day: "numeric"
    });
  },

  formatTime(timeStr) {
    return timeStr;
  },

  placeholderImage() {
    return "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='200' viewBox='0 0 400 200'%3E%3Crect fill='%23dee2e6' width='400' height='200'/%3E%3Ctext x='50%25' y='50%25' fill='%23adb5bd' font-size='16' text-anchor='middle' dy='.3em'%3ENo Image%3C/text%3E%3C/svg%3E";
  },

  getTodayISO() {
    return new Date().toISOString().split("T")[0];
  },

  escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }
};
