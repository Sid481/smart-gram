document.addEventListener("DOMContentLoaded", () => {
  const galleryGrid = document.getElementById("galleryGrid");
  const filterBtns = document.querySelectorAll(".filter-btn");
  const yearFilter = document.getElementById("yearFilter");
  const monthFilter = document.getElementById("monthFilter");

  let galleryData = [];

  // Function to fetch recent gallery items (limit 10)
  async function fetchGalleryItems() {
    try {
      const response = await fetch("http://localhost:8081/api/gallery/recent");
      if (!response.ok) {
        throw new Error("Failed to fetch gallery items");
      }
      const items = await response.json();

      // Map backend GalleryItem to frontend galleryData format
      galleryData = items.map(item => ({
        src: item.fileUrl,
        category: item.category.toLowerCase(),
        year: item.year.toString(),
        month: item.month.toLowerCase(),
        caption: item.title
      }));
      applyFilters();
    } catch (error) {
      galleryGrid.innerHTML = `<p class="text-red-500 text-center w-full">${error.message}</p>`;
    }
  }

  // Render gallery items inside galleryGrid container
  function renderGallery(items) {
    galleryGrid.innerHTML = "";
    if (items.length === 0) {
      galleryGrid.innerHTML = `<p class="text-gray-500 text-center w-full">No images found for this filter.</p>`;
      return;
    }
   items.forEach(item => {
    const card = document.createElement("div");
    card.className = "gallery-item";

    // Detect file type (optional: for video/pdf support)
    let mediaTag;
    if (item.src.endsWith('.mp4')) {
      mediaTag = `<video src="http://localhost:8081${item.src}" controls class="w-full h-40 object-cover"></video>`;
    } else if (item.src.endsWith('.pdf')) {
      mediaTag = `<a href="http://localhost:8081${item.src}" target="_blank">View PDF</a>`;
    } else {
      // Images (jpeg, jpg, png, etc.)
      mediaTag = `<img src="http://localhost:8081${item.src}" alt="${item.caption}" class="cursor-pointer rounded-lg shadow hover:opacity-80 transition" />`;
    }

    card.innerHTML = `
      ${mediaTag}
      <p class="caption text-sm mt-2">${item.caption}</p>
    `;
    if (card.querySelector("img")) {
      card.querySelector("img").addEventListener("click", () => openLightbox(item));
    }
    galleryGrid.appendChild(card);
  });
}

  // Lightbox handlers omitted for brevity; reuse your existing ones
  function openLightbox(item) {
    const lightbox = document.getElementById("lightbox");
    const lightboxMedia = document.getElementById("lightboxMedia");
    const lightboxCaption = document.getElementById("lightboxCaption");
    lightbox.classList.remove("hidden");
    // For video or pdf, you may want to add additional logic here
    lightboxMedia.innerHTML = `<img src="${item.src}" alt="${item.caption}" class="max-h-[80vh] max-w-[90vw] rounded shadow-lg">`;
    lightboxCaption.textContent = item.caption;
  }

  document.querySelector(".close-lightbox").addEventListener("click", () => {
    const lightbox = document.getElementById("lightbox");
    const lightboxMedia = document.getElementById("lightboxMedia");
    lightbox.classList.add("hidden");
    lightboxMedia.innerHTML = "";
  });

  // Filter gallery using active category, year, and month selections
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

  // Add click handlers to filter buttons (only filtering locally)
  filterBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      filterBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      applyFilters();
    });
  });

  yearFilter.addEventListener("change", applyFilters);
  monthFilter.addEventListener("change", applyFilters);

  // Initial fetch and render on page load
  fetchGalleryItems();
});
