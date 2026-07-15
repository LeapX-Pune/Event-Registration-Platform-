function Navbar(activePage = "home") {
  const isNestedPage = window.location.pathname.includes("/pages/");
  const links = [
    { label: "Home", href: isNestedPage ? "../index.html" : "index.html", id: "home" },
    { label: "Admin", href: isNestedPage ? "admin.html" : "pages/admin.html", id: "admin" }
  ];

  return `
    <header class="navbar">
      <div class="container">
        <a href="${isNestedPage ? "../index.html" : "index.html"}" class="logo">EventHub</a>
        <div class="navbar-actions">
          <nav>
            ${links.map(l => `
              <a href="${l.href}" class="${activePage === l.id ? "active" : ""}">${l.label}</a>
            `).join("")}
          </nav>
          <button class="theme-toggle" type="button" data-theme-toggle aria-label="Switch to dark mode" aria-pressed="false">
            <span class="theme-toggle__icon theme-toggle__icon--sun" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="4.2"></circle>
                <path d="M12 2.5v2.1M12 19.4v2.1M4.6 4.6l1.5 1.5M17.9 17.9l1.5 1.5M2.5 12h2.1M19.4 12h2.1M4.6 19.4l1.5-1.5M17.9 6.1l1.5-1.5"></path>
              </svg>
            </span>
            <span class="theme-toggle__icon theme-toggle__icon--moon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20 14.7A8.5 8.5 0 1 1 9.3 4a7 7 0 0 0 10.7 10.7Z"></path>
              </svg>
            </span>
          </button>
        </div>
      </div>
    </header>
  `;
}
