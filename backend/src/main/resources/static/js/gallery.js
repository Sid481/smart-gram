document.addEventListener("DOMContentLoaded", () => {
  const galleryGrid = document.getElementById("galleryGrid");
  const filterBtns = document.querySelectorAll(".filter-btn");
  const yearFilter = document.getElementById("yearFilter");
  const monthFilter = document.getElementById("monthFilter");

  if (!galleryGrid || !yearFilter || !monthFilter) return;

  let galleryData = [];

  // Fetch recent gallery items
  async function fetchGalleryItems() {
    try {
      const response = await fetch("/api/gallery/recent", {
        credentials: "include"
      });
      if (!response.ok) throw new Error("Failed to fetch gallery items");

      const items = await response.json();

      galleryData = items.map(item => ({
        id: item.id,
        src: `/api/gallery/${item.id}/file`,
        category: (item.category || "").toLowerCase(),
        year: String(item.year || ""),
        month: (item.month || "").toLowerCase(),
        caption: item.title || "",
        type: item.type || "IMAGE"
      }));

      applyFilters();
    } catch (error) {
      galleryGrid.innerHTML = `<p class="text-red-500 text-center w-full">${error.message}</p>`;
    }
  }

  // Render gallery items
  function renderGallery(items) {
    galleryGrid.innerHTML = "";
    if (!items || items.length === 0) {
      galleryGrid.innerHTML = `<p class="text-gray-500 text-center w-full">No items found for this filter.</p>`;
      return;
    }

    items.forEach(item => {
      const card = document.createElement("div");
      card.className = "gallery-item";

      const src = item.src || "";
      const caption = item.caption || "";
      const type = item.type;

      let mediaTag = "";

      if (type === "VIDEO") {
        mediaTag = `
          <video controls class="w-full h-40 object-cover">
            <source src="${src}" type="video/mp4">
            Your browser does not support the video tag.
          </video>
        `;
      } else if (type === "PDF") {
        mediaTag = `<a href="${src}" target="_blank" rel="noopener noreferrer" class="block text-blue-600 underline">View PDF</a>`;
      } else {
        // IMAGE
        mediaTag = `
          <img src="${src}" alt="${caption}"
               class="cursor-pointer rounded-lg shadow hover:opacity-80 transition w-full h-40 object-cover"
               loading="lazy"
               onerror="this.style.display='none'; this.parentElement.innerHTML='<p class=text-gray-400>Failed to load</p>';"
          />
        `;
      }

      card.innerHTML = `
        ${mediaTag}
        <p class="caption text-sm mt-2 truncate">${caption}</p>
      `;

      const imgEl = card.querySelector("img");
      if (imgEl) {
        imgEl.addEventListener("click", () => openLightbox(item));
      }

      const videoEl = card.querySelector("video");
      if (videoEl) {
        videoEl.addEventListener("click", () => openLightbox(item));
      }

      galleryGrid.appendChild(card);
    });
  }

  // Lightbox modal
  function openLightbox(item) {
    const lightbox = document.getElementById("lightbox");
    const lightboxMedia = document.getElementById("lightboxMedia");
    const lightboxCaption = document.getElementById("lightboxCaption");
    if (!lightbox || !lightboxMedia || !lightboxCaption) return;

    const src = item.src || "";
    const caption = item.caption || "";
    const type = item.type;

    lightbox.classList.remove("hidden");

    if (type === "VIDEO") {
      lightboxMedia.innerHTML = `
        <video controls class="max-h-[80vh] max-w-[90vw] rounded shadow-lg">
          <source src="${src}" type="video/mp4">
          Your browser does not support the video tag.
        </video>
      `;
    } else if (type === "PDF") {
      lightboxMedia.innerHTML = `
        <a href="${src}" target="_blank" rel="noopener noreferrer" class="text-blue-600 underline text-lg">Open PDF in New Tab</a>
      `;
    } else {
      lightboxMedia.innerHTML = `
        <img src="${src}" alt="${caption}" class="max-h-[80vh] max-w-[90vw] rounded shadow-lg object-contain">
      `;
    }

    lightboxCaption.textContent = caption;
  }

  // Close lightbox
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

  // Close lightbox when clicking outside media
  const lightbox = document.getElementById("lightbox");
  if (lightbox) {
    lightbox.addEventListener("click", (e) => {
      if (e.target === lightbox) {
        lightbox.classList.add("hidden");
        document.getElementById("lightboxMedia").innerHTML = "";
      }
    });
  }

  // Apply filters (category/year/month)
  function applyFilters() {
    const activeBtn = document.querySelector(".filter-btn.active");
    const activeCategory = activeBtn ? activeBtn.dataset.category : "all";
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
  if (filterBtns && filterBtns.length > 0) {
    filterBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        filterBtns.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        applyFilters();
      });
    });
  }

  // Year and month filters
  yearFilter.addEventListener("change", applyFilters);
  monthFilter.addEventListener("change", applyFilters);

  // Initial fetch
  fetchGalleryItems();
});
