function Navbar(activePage = "home") {
  const links = [
    { label: "Home", href: "../index.html", id: "home" },
    { label: "Admin", href: "admin.html", id: "admin" }
  ];

  return `
    <header class="navbar">
      <div class="container">
        <a href="../index.html" class="logo">EventPulse</a>
        <nav>
          ${links.map(l => `
            <a href="${l.href}" class="${activePage === l.id ? "active" : ""}">${l.label}</a>
          `).join("")}
        </nav>
      </div>
    </header>
  `;
}
