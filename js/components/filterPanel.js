function FilterPanel(categories, onFilter) {
  return `
    <div class="filter-panel">
      <select id="categoryFilter">
        <option value="">All Categories</option>
        ${categories.map(c => `<option value="${c}">${c}</option>`).join("")}
      </select>
      <input type="date" id="dateFilter">
      <input type="text" id="searchFilter" placeholder="Search events..." />
      <button class="btn btn-primary btn-sm" id="clearFilters">Clear</button>
    </div>
  `;
}
