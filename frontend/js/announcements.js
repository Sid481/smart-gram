document.addEventListener("DOMContentLoaded", () => {
  const financeGrid = document.getElementById("financeGrid");
  const yearFilter = document.getElementById("financeYearFilter");
  const monthFilter = document.getElementById("financeMonthFilter");
  const categoryFilter = document.getElementById("financeCategoryFilter");

  // 🧩 Example static data (backend will replace this)
  const financeData = [
    { src: "uploads/finance/annual-report-2025.pdf", type: "pdf", title: "Annual Report Jan 2025", year: "2025", month: "january", category: "annual-reports" },
    { src: "uploads/finance/budget-2024.pdf", type: "pdf", title: "Budget Report Feb 2024", year: "2024", month: "february", category: "budgets" },
    { src: "uploads/finance/audit-2023.pdf", type: "pdf", title: "Audit Report Mar 2023", year: "2023", month: "march", category: "audit-statements" },
    { src: "uploads/finance/expenditure-2025.png", type: "image", title: "Expenditure Chart May 2025", year: "2025", month: "may", category: "expenditure-details" }
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
    const month = monthFilter.value;
    const category = categoryFilter.value;

    const filtered = financeData.filter(item => {
      const matchYear = year === "all" || item.year === year;
      const matchMonth = month === "all" || item.month === month;
      const matchCategory = category === "all" || item.category === category;
      return matchYear && matchMonth && matchCategory;
    });

    renderFinance(filtered);
  }

  yearFilter.addEventListener("change", applyFilters);
  monthFilter.addEventListener("change", applyFilters);
  categoryFilter.addEventListener("change", applyFilters);

  renderFinance(financeData);
});
