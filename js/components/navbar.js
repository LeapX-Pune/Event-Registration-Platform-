function Navbar(activePage) {
  var root = window.location.pathname.includes("/pages/") ? "../" : "";
  var links = [
    { label: "Home", href: root + "index.html", id: "home" },
    { label: "Admin", href: root + "pages/admin.html", id: "admin" }
  ];

  return `
    <header class="navbar">
      <div class="container">
        <a href="index.html" class="logo">EventHub</a>
        <nav>
          ${links.map(l => `
            <a href="${l.href}" class="${activePage === l.id ? "active" : ""}">${l.label}</a>
          `).join("")}
        </nav>
      </div>
    </header>
  `;
}
