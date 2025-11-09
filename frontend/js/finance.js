document.addEventListener("DOMContentLoaded", () => {
  const financeGrid = document.getElementById("financeGrid");
  const yearFilter = document.getElementById("financeYearFilter");
  const categoryFilter = document.getElementById("financeCategoryFilter");

  // 🧩 Example static data (backend will replace this)
  const financeData = [
    { src: "uploads/finance/annual-report-2025.pdf", type: "pdf", title: "Annual Report 2025", year: "2025", category: "annual-reports" },
    { src: "uploads/finance/budget-2024.pdf", type: "pdf", title: "Budget 2024", year: "2024", category: "budgets" },
    { src: "uploads/finance/audit-2023.pdf", type: "pdf", title: "Audit Report 2023", year: "2023", category: "audit-statements" },
    { src: "uploads/finance/expenditure-2025.png", type: "image", title: "Expenditure Chart 2025", year: "2025", category: "expenditure-details" }
  ];

  function renderFinance(data) {
    financeGrid.innerHTML = "";
    if (data.length === 0) {
      financeGrid.innerHTML = `<p class="text-gray-500 text-center w-full">No financial records found.</p>`;
      return;
    }

    data.forEach(item => {
      const div = document.createElement("div");
      div.className = "finance-item";

      if (item.type === "pdf") {
        div.innerHTML = `<a href="${item.src}" target="_blank">📄 ${item.title}</a>`;
      } else if (item.type === "image") {
        div.innerHTML = `<img src="${item.src}" alt="${item.title}" class="rounded-lg shadow-md mx-auto" />`;
      } else if (item.type === "excel") {
        div.innerHTML = `<a href="${item.src}" target="_blank">📊 ${item.title}</a>`;
      }

      financeGrid.appendChild(div);
    });
  }

  function applyFilters() {
    const year = yearFilter.value;
    const category = categoryFilter.value;

    const filtered = financeData.filter(item => {
      const matchYear = year === "all" || item.year === year;
      const matchCategory = category === "all" || item.category === category;
      return matchYear && matchCategory;
    });

    renderFinance(filtered);
  }

  yearFilter.addEventListener("change", applyFilters);
  categoryFilter.addEventListener("change", applyFilters);

  renderFinance(financeData);
});
