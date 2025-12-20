document.addEventListener("DOMContentLoaded", () => {
  const loginSection = document.getElementById("loginSection");
  const uploadSection = document.getElementById("uploadSection");
  const loginBtn = document.getElementById("loginBtn");
  const adminPassword = document.getElementById("adminPassword");
  const loginMessage = document.getElementById("loginMessage");
  const adminHeader = document.getElementById("adminHeader");
  const logoutBtn = document.getElementById("logoutBtn");
  const backBtn = document.getElementById("backBtn");

  const pageSelect = document.getElementById("pageSelect");
  const categorySelect = document.getElementById("categorySelect");
  const uploadBtn = document.getElementById("uploadBtn");
  const uploadMessage = document.getElementById("uploadMessage");
  const previewSection = document.getElementById("previewSection");
  const previewGrid = document.getElementById("previewGrid");

  const yearSelect = document.getElementById("yearSelect");
  const monthSelect = document.getElementById("monthSelect");
  const fileInput = document.getElementById("fileInput");

  // ---- NEW VIDEO MODAL REFERENCES ----
  const videoModal = document.getElementById("videoModal");
  const videoPlayer = document.getElementById("videoPlayer");
  const closeVideoModal = document.getElementById("closeVideoModal");

  const ADMIN_PASSWORD = "smartgram123";

  const navButtonContainer = document.createElement("div");
  navButtonContainer.style.display = "flex";
  navButtonContainer.style.gap = "10px";
  navButtonContainer.style.marginBottom = "10px";

  const viewUploadBtn = document.createElement("button");
  viewUploadBtn.textContent = "📤 Upload Content";
  viewUploadBtn.style.padding = "6px 12px";
  viewUploadBtn.style.cursor = "pointer";

  const viewPreviewBtn = document.createElement("button");
  viewPreviewBtn.textContent = "📁 View Uploaded Items";
  viewPreviewBtn.style.padding = "6px 12px";
  viewPreviewBtn.style.cursor = "pointer";

  navButtonContainer.appendChild(viewUploadBtn);
  navButtonContainer.appendChild(viewPreviewBtn);

  uploadSection.parentElement.insertBefore(navButtonContainer, uploadSection);

  if (localStorage.getItem("isAdminLoggedIn") === "true") {
    showAdminPanel();
  }

  if (loginBtn && adminPassword && loginMessage) {
    loginBtn.addEventListener("click", () => {
      if (adminPassword.value === ADMIN_PASSWORD) {
        loginMessage.textContent = "✅ Access Granted!";
        loginMessage.style.color = "green";
        localStorage.setItem("isAdminLoggedIn", "true");
        setTimeout(showAdminPanel, 700);
      } else {
        loginMessage.textContent = "❌ Incorrect Password!";
        loginMessage.style.color = "red";
      }
    });
  }

  function showAdminPanel() {
    if (loginSection) loginSection.classList.add("hidden");
    if (uploadSection) uploadSection.classList.remove("hidden");
    if (previewSection) previewSection.classList.add("hidden");
    if (adminHeader) adminHeader.classList.remove("hidden");
  }

  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("isAdminLoggedIn");
      location.reload();
    });
  }

  if (backBtn) {
    backBtn.addEventListener("click", () => {
      window.location.href = "index.html";
    });
  }

  const pageCategories = {
    gallery: ["Gram Sabha", "Festivals", "Cultural Events", "Govt Schemes"],
    announcements: ["Notice", "Circulars", "Public Announcements"],
    schemes: ["Agriculture", "Education", "Health", "Infrastructure"],
    leadership: ["Panchayat Members PDF", "Members Photo"]
  };

  if (pageSelect && categorySelect) {
    pageSelect.addEventListener("change", () => {
      const selectedPage = pageSelect.value;
      categorySelect.innerHTML = "<option value=''>-- Select Category --</option>";

      if (pageCategories[selectedPage]) {
        pageCategories[selectedPage].forEach(cat => {
          const option = document.createElement("option");
          option.value = cat.toLowerCase().replace(/\s+/g, "-");
          option.textContent = cat;
          categorySelect.appendChild(option);
        });
      }
    });
  }

  if (uploadBtn) {
    uploadBtn.addEventListener("click", async () => {
      const page = pageSelect ? pageSelect.value : "";
      const category = categorySelect ? categorySelect.value : "";
      const year = yearSelect ? yearSelect.value : "";
      const month = monthSelect ? monthSelect.value : "";
      const file = fileInput && fileInput.files ? fileInput.files[0] : null;
      const type = getFileType(file);

      if (!page || !category || !file) {
        showMessage(uploadMessage, "⚠️ Please fill all required fields and select a file!", "red");
        return;
      }

      if (!type) {
        showMessage(uploadMessage, "⚠️ Unsupported file type!", "red");
        return;
      }

      const formData = new FormData();
      formData.append("file", file);
      formData.append("category", category);
      formData.append("title", file.name);
      formData.append("year", year);
      formData.append("month", month);
      formData.append("type", type);

      try {
        showMessage(uploadMessage, "⬆️ Uploading...", "#1d4ed8");

        const response = await fetch("/api/gallery/upload", {
          method: "POST",
          body: formData,
          credentials: "include"
        });

        if (!response.ok) throw new Error(await response.text());

        showMessage(uploadMessage, "✅ Upload successful!", "green");
        clearForm();
      } catch (error) {
        showMessage(uploadMessage, "❌ " + error.message, "red");
      }
    });
  }

  function clearForm() {
    if (fileInput) fileInput.value = "";
    if (categorySelect) categorySelect.value = "";
    if (pageSelect) pageSelect.value = "";
    yearSelect.value = "2025";
    monthSelect.value = "January";
  }

  function showMessage(node, msg, color) {
    if (!node) return;
    node.textContent = msg;
    node.style.color = color;
  }

  viewPreviewBtn.addEventListener("click", () => {
    uploadSection.classList.add("hidden");
    previewSection.classList.remove("hidden");
    loadUploadedItems();
  });

  viewUploadBtn.addEventListener("click", () => {
    previewSection.classList.add("hidden");
    uploadSection.classList.remove("hidden");
  });

  async function loadUploadedItems() {
    try {
      previewGrid.innerHTML = "Loading...";

      const response = await fetch("/api/gallery/recent?limit=50", {
        credentials: "include"
      });
      if (!response.ok) throw new Error("Failed to fetch items");

      const items = await response.json();
      previewGrid.innerHTML = "";

      if (items.length === 0) {
        previewGrid.innerHTML = "<p style='grid-column: 1/-1; text-align: center; color: #999;'>No items uploaded yet</p>";
        return;
      }

      items.forEach(item => {
        const isVideo = item.type === "VIDEO";
        const fileUrl = `/api/gallery/${item.id}/file`;

        const card = document.createElement("div");
        card.className = "preview-card";

        card.innerHTML = `
          <div class="preview-image-container">
            ${isVideo
              ? `<video class="preview-image" muted onclick="openVideo('${fileUrl}')">
                   <source src="${fileUrl}" type="video/mp4">
                 </video>`
              : `<img src="${fileUrl}"
                  class="preview-image"
                  onclick="openImage('${fileUrl}')"
                  onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%27150%27 height=%27150%27%3E%3Crect fill=%27%23ddd%27 width=%27150%27 height=%27150%27/%3E%3Ctext x=%2750%25%27 y=%2750%25%27 text-anchor=%27middle%27 dy=%27.3em%27 fill=%27%23999%27%3ENo Image%3C/text%3E%3C/svg%3E'">`
            }
          </div>
          <div class="preview-info">
            <p class="preview-title">${item.title}</p>
            <p class="preview-meta">
              <strong>Category:</strong> ${item.category}<br>
              <strong>Date:</strong> ${item.month} ${item.year}<br>
              <strong>Type:</strong> ${item.type}
            </p>
            <div class="preview-actions">
              <button class="btn-delete" onclick="deleteItem(${item.id})">🗑️ Delete</button>
            </div>
          </div>
        `;

        previewGrid.appendChild(card);
      });

    } catch (error) {
      previewGrid.innerHTML = `<p style='grid-column: 1/-1; color: red;'>Error: ${error.message}</p>`;
      console.error("Load error:", error);
    }
  }

  window.deleteItem = async (id) => {
    if (!confirm("Are you sure you want to delete this item?")) {
      return;
    }

    try {
      const response = await fetch(`/api/gallery/${id}`, {
        method: "DELETE",
        credentials: "include"
      });

      if (!response.ok) throw new Error("Delete failed");

      showMessage(uploadMessage, "✅ Item deleted successfully", "green");
      loadUploadedItems();
    } catch (error) {
      showMessage(uploadMessage, `❌ Delete error: ${error.message}`, "red");
      console.error("Delete error:", error);
    }
  };

  function getFileType(file) {
    if (!file) return "";
    const mime = file.type;
    if (mime.startsWith("image/")) return "IMAGE";
    if (mime === "application/pdf") return "PDF";
    if (mime.startsWith("video/")) return "VIDEO";
    return "";
  }

  // ----- VIDEO MODAL -----
  window.openVideo = (url) => {
    videoPlayer.src = url;
    videoModal.classList.remove("hidden");
    videoPlayer.play();
  };

  closeVideoModal.addEventListener("click", () => {
    videoModal.classList.add("hidden");
    videoPlayer.pause();
    videoPlayer.src = "";
  });

  videoModal.addEventListener("click", (e) => {
    if (e.target === videoModal) {
      videoModal.classList.add("hidden");
      videoPlayer.pause();
      videoPlayer.src = "";
    }
  });

});
