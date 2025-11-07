// ----- Sample Data (will be replaced by backend later) -----
let galleryData = [
  { src: "uploads/gramsabha1.jpg", category: "gramsabha", year: "2024", month: "january", caption: "Gram Sabha - Jan 2024" },
  { src: "uploads/festival1.jpg", category: "festival", year: "2024", month: "march", caption: "Festival Celebration" },
  { src: "uploads/scheme1.jpg", category: "scheme", year: "2025", month: "february", caption: "Govt Scheme Launch" },
  { src: "uploads/cultural1.jpg", category: "cultural", year: "2023", month: "december", caption: "Cultural Program" }
];

// DOM elements
const galleryGrid = document.getElementById("galleryGrid");
const filterBtns = document.querySelectorAll(".filter-btn");
const yearFilter = document.getElementById("yearFilter");
const monthFilter = document.getElementById("monthFilter");
const lightbox = document.getElementById("lightbox");
const lightboxMedia = document.getElementById("lightboxMedia");
const lightboxCaption = document.getElementById("lightboxCaption");
const closeLightbox = document.querySelector(".close-lightbox");

// Display images
function renderGallery(items) {
  galleryGrid.innerHTML = "";
  if (items.length === 0) {
    galleryGrid.innerHTML = `<p class="text-gray-500 text-center w-full">No images found for this filter.</p>`;
    return;
  }

  items.forEach(item => {
    const card = document.createElement("div");
    card.className = "gallery-item";
    card.innerHTML = `
      <img src="${item.src}" alt="${item.caption}" class="cursor-pointer rounded-lg shadow hover:opacity-80 transition" />
      <p class="caption text-sm mt-2">${item.caption}</p>
    `;
    card.querySelector("img").addEventListener("click", () => openLightbox(item));
    galleryGrid.appendChild(card);
  });
}

// Lightbox open
function openLightbox(item) {
  lightbox.classList.remove("hidden");
  lightboxMedia.innerHTML = `<img src="${item.src}" alt="${item.caption}" class="max-h-[80vh] max-w-[90vw] rounded shadow-lg">`;
  lightboxCaption.textContent = item.caption;
}

// Close lightbox
closeLightbox.addEventListener("click", () => {
  lightbox.classList.add("hidden");
  lightboxMedia.innerHTML = "";
});

// Filtering
function applyFilters() {
  const activeCategory = document.querySelector(".filter-btn.active").dataset.category;
  const selectedYear = yearFilter.value;
  const selectedMonth = monthFilter.value;

  const filtered = galleryData.filter(item => {
    const matchCategory = activeCategory === "all" || item.category === activeCategory;
    const matchYear = selectedYear === "all" || item.year === selectedYear;
    const matchMonth = selectedMonth === "all" || item.month === selectedMonth;
    return matchCategory && matchYear && matchMonth;
  });

  renderGallery(filtered);
}

// Filter buttons
filterBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    filterBtns.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    applyFilters();
  });
});

// Dropdown filters
yearFilter.addEventListener("change", applyFilters);
monthFilter.addEventListener("change", applyFilters);

// Initial load
document.addEventListener("DOMContentLoaded", () => {
  renderGallery(galleryData);
});
