document.addEventListener("DOMContentLoaded", () => {
  const galleryGrid = document.getElementById("galleryGrid");
  const filterBtns = document.querySelectorAll(".filter-btn");
  const yearFilter = document.getElementById("yearFilter");
  const monthFilter = document.getElementById("monthFilter");

  if (!galleryGrid || !yearFilter || !monthFilter) {
    return;
  }

  let galleryData = [];

  // ============================
  // Fetch recent gallery items
  // ============================
  async function fetchGalleryItems() {
    try {
      const response = await fetch("/api/gallery/recent", {
        credentials: "include"
      });
      if (!response.ok) {
        throw new Error("Failed to fetch gallery items");
      }
      const items = await response.json();

      galleryData = items.map(item => {
        const src = `/api/gallery/${item.id}/file`;
        const type = (item.type || "").toUpperCase();
        const contentType = item.contentType || "";

        const isVideo =
          type === "VIDEO" ||
          contentType.startsWith("video/");

        const isPdf =
          type === "PDF" ||
          contentType === "application/pdf" ||
          (item.fileUrl && item.fileUrl.toLowerCase().endsWith(".pdf"));

        return {
          id: item.id,
          src,
          category: (item.category || "").toLowerCase(),
          year: String(item.year || ""),
          month: (item.month || "").toLowerCase(),
          caption: item.title || "",
          isVideo,
          isPdf
        };
      });

      applyFilters();
    } catch (error) {
      console.error(error);
      galleryGrid.innerHTML =
        `<p class="text-red-500 text-center w-full">${error.message}</p>`;
    }
  }

  // ============================
  // Render gallery items (grid)
  // ============================
  function renderGallery(items) {
    galleryGrid.innerHTML = "";
    if (!items || items.length === 0) {
      galleryGrid.innerHTML =
        `<p class="text-gray-500 text-center w-full">No media found for this filter.</p>`;
      return;
    }

    items.forEach(item => {
      const card = document.createElement("div");
      card.className = "gallery-item";

      const { src, caption, isVideo, isPdf } = item;
      let mediaTag;

      if (isVideo) {
        // Preview only; full playback in lightbox
        mediaTag = `
          <video src="${src}"
                 class="w-full h-40 object-cover rounded-lg shadow bg-black">
          </video>`;
      } else if (isPdf) {
        mediaTag = `
          <a href="${src}" target="_blank" rel="noopener noreferrer"
             class="block w-full h-40 flex items-center justify-center
                    bg-gray-100 rounded-lg shadow text-blue-600 underline">
            View PDF
          </a>`;
      } else {
        mediaTag = `
          <img src="${src}" alt="${caption}"
               class="cursor-pointer rounded-lg shadow hover:opacity-80 transition
                      w-full h-40 object-cover"
               loading="lazy"
               onerror="this.style.display='none';"
          />`;
      }

      card.innerHTML = `
        ${mediaTag}
        <p class="caption text-sm mt-2 text-center">${caption}</p>
      `;

      const clickable =
        card.querySelector("img") || (isVideo && card.querySelector("video"));

      if (clickable && !isPdf) {
        clickable.addEventListener("click", () => {
          console.log("Clicked item", item.id);
          openLightbox(item);
        });
      }

      galleryGrid.appendChild(card);
    });
  }

  // ============================
  // Lightbox
  // ============================
  function openLightbox(item) {
    const lightbox = document.getElementById("lightbox");
    const lightboxMedia = document.getElementById("lightboxMedia");
    const lightboxCaption = document.getElementById("lightboxCaption");
    if (!lightbox || !lightboxMedia || !lightboxCaption) return;

    const { src, caption, isVideo, isPdf } = item;

    lightbox.classList.remove("hidden");
    lightbox.classList.add("flex");

    if (isVideo) {
      lightboxMedia.innerHTML = `
        <video src="${src}" controls autoplay
               class="max-h-[80vh] max-w-[90vw] rounded shadow-lg bg-black">
        </video>`;
    } else if (isPdf) {
      lightboxMedia.innerHTML = `
        <a href="${src}" target="_blank" rel="noopener noreferrer"
           class="text-blue-400 underline bg-white p-4 rounded">
          Open PDF
        </a>`;
    } else {
      lightboxMedia.innerHTML = `
        <img src="${src}" alt="${caption}"
             class="max-h-[80vh] max-w-[90vw] rounded shadow-lg object-contain">`;
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
      lightbox.classList.remove("flex");
      lightboxMedia.innerHTML = "";
    });
  }

  const lightboxOverlay = document.getElementById("lightbox");
  if (lightboxOverlay) {
    lightboxOverlay.addEventListener("click", (e) => {
      if (e.target === lightboxOverlay) {
        const lightboxMedia = document.getElementById("lightboxMedia");
        lightboxOverlay.classList.add("hidden");
        lightboxOverlay.classList.remove("flex");
        if (lightboxMedia) lightboxMedia.innerHTML = "";
      }
    });
  }

  // ============================
  // Filters
  // ============================
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

  // ============================
  // Initial load
  // ============================
  fetchGalleryItems();
});
