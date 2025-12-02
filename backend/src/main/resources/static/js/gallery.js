document.addEventListener("DOMContentLoaded", () => {
  const galleryGrid = document.getElementById("galleryGrid");
  const filterBtns = document.querySelectorAll(".filter-btn");
  const yearFilter = document.getElementById("yearFilter");
  const monthFilter = document.getElementById("monthFilter");

  if (!galleryGrid || !yearFilter || !monthFilter) {
    return;
  }

  let galleryData = [];

  // Function to fetch recent gallery items (limit 10)
  async function fetchGalleryItems() {
    try {
      // ✅ Relative URL so it works on the same port as Spring Boot
      const response = await fetch("/api/gallery/recent", {
        credentials: "include"
      });
      if (!response.ok) {
        throw new Error("Failed to fetch gallery items");
      }
      const items = await response.json();

      // Map backend GalleryItem to frontend galleryData format
      galleryData = items.map(item => ({
        src: item.fileUrl,
        category: (item.category || "").toLowerCase(),
        year: String(item.year || ""),
        month: (item.month || "").toLowerCase(),
        caption: item.title || ""
      }));
      applyFilters();
    } catch (error) {
      galleryGrid.innerHTML =
        `<p class="text-red-500 text-center w-full">${error.message}</p>`;
    }
  }

  // Render gallery items inside galleryGrid container
  function renderGallery(items) {
    galleryGrid.innerHTML = "";
    if (!items || items.length === 0) {
      galleryGrid.innerHTML =
        `<p class="text-gray-500 text-center w-full">No images found for this filter.</p>`;
      return;
    }

    items.forEach(item => {
      const card = document.createElement("div");
      card.className = "gallery-item";

      // Detect file type (optional: for video/pdf support)
      let mediaTag;
      const src = item.src || "";
      const caption = item.caption || "";

      if (src.endsWith(".mp4")) {
        mediaTag =
          `<video src="${src}" controls class="w-full h-40 object-cover"></video>`;
      } else if (src.endsWith(".pdf")) {
        mediaTag =
          `<a href="${src}" target="_blank" rel="noopener noreferrer">View PDF</a>`;
      } else {
        // Images (jpeg, jpg, png, etc.)
        mediaTag =
          `<img src="${src}" alt="${caption}" class="cursor-pointer rounded-lg shadow hover:opacity-80 transition" />`;
      }

      card.innerHTML = `
        ${mediaTag}
        <p class="caption text-sm mt-2">${caption}</p>
      `;

      const imgEl = card.querySelector("img");
      if (imgEl) {
        imgEl.addEventListener("click", () => openLightbox(item));
      }

      galleryGrid.appendChild(card);
    });
  }

  // Lightbox
  function openLightbox(item) {
    const lightbox = document.getElementById("lightbox");
    const lightboxMedia = document.getElementById("lightboxMedia");
    const lightboxCaption = document.getElementById("lightboxCaption");
    if (!lightbox || !lightboxMedia || !lightboxCaption) return;

    const src = item.src || "";
    const caption = item.caption || "";

    lightbox.classList.remove("hidden");

    if (src.endsWith(".mp4")) {
      lightboxMedia.innerHTML =
        `<video src="${src}" controls class="max-h-[80vh] max-w-[90vw] rounded shadow-lg"></video>`;
    } else if (src.endsWith(".pdf")) {
      lightboxMedia.innerHTML =
        `<a href="${src}" target="_blank" rel="noopener noreferrer" class="text-blue-600 underline">Open PDF</a>`;
    } else {
      lightboxMedia.innerHTML =
        `<img src="${src}" alt="${caption}" class="max-h-[80vh] max-w-[90vw] rounded shadow-lg">`;
    }

    lightboxCaption.textContent = caption;
  }

  const closeBtn = document.querySelector(".close-lightbox");
  if (closeBtn) {
    closeBtn.addEventListener("click", () => {
      const lightbox = document.getElementById("lightbox");
      const lightboxMedia = document.getElementById("lightboxMedia");
      if (!lightbox || !lightboxMedia) return;
      lightbox.classList.add("hidden");
      lightboxMedia.innerHTML = "";
    });
  }

  // Filter gallery using active category, year, and month selections
  function applyFilters() {
    const activeBtn = document.querySelector(".filter-btn.active");
    const activeCategory = activeBtn ? activeBtn.dataset.category : "all";
    const selectedYear = yearFilter.value;
    const selectedMonth = monthFilter.value;

    const filtered = galleryData.filter(item => {
      const matchCategory =
        activeCategory === "all" || item.category === activeCategory;
      const matchYear =
        selectedYear === "all" || item.year === selectedYear;
      const matchMonth =
        selectedMonth === "all" || item.month === selectedMonth;
      return matchCategory && matchYear && matchMonth;
    });

    renderGallery(filtered);
  }

  // Add click handlers to filter buttons (only filtering locally)
  if (filterBtns && filterBtns.length > 0) {
    filterBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        filterBtns.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        applyFilters();
      });
    });
  }

  yearFilter.addEventListener("change", applyFilters);
  monthFilter.addEventListener("change", applyFilters);

  // Initial fetch and render on page load
  fetchGalleryItems();
});
