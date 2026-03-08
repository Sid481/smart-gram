document.addEventListener("DOMContentLoaded", () => {

  // =========================
  // Elements
  // =========================
  const loginSection = document.getElementById("loginSection");
  const uploadSection = document.getElementById("uploadSection");
  const previewSection = document.getElementById("previewSection");

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

  const yearSelect = document.getElementById("yearSelect");
  const monthSelect = document.getElementById("monthSelect");
  const fileInput = document.getElementById("fileInput");


  // =========================
  // Admin Password (JS Only)
  // =========================
  const ADMIN_PASSWORD = "smartgram123";


  // =========================
  // Check Login Session
  // =========================
  if (localStorage.getItem("isAdminLoggedIn") === "true") {
    showAdminPanel();
  }


  // =========================
  // Login
  // =========================
  if (loginBtn) {
    loginBtn.addEventListener("click", (e) => {

      e.preventDefault();

      const enteredPassword = adminPassword.value.trim();

      if (enteredPassword === ADMIN_PASSWORD) {

        loginMessage.textContent = "✅ Access Granted!";
        loginMessage.style.color = "green";

        localStorage.setItem("isAdminLoggedIn", "true");

        setTimeout(showAdminPanel, 5000);

      } else {

        loginMessage.textContent = "❌ Incorrect Password!";
        loginMessage.style.color = "red";

      }

    });
  }


  // =========================
  // Show Admin Panel
  // =========================
  function showAdminPanel() {

    if (loginSection) loginSection.classList.add("hidden");

    if (uploadSection) uploadSection.classList.remove("hidden");

    if (previewSection) previewSection.classList.remove("hidden");

    if (adminHeader) adminHeader.classList.remove("hidden");

  }


  // =========================
  // Logout
  // =========================
  if (logoutBtn) {

    logoutBtn.addEventListener("click", () => {

      localStorage.removeItem("isAdminLoggedIn");

      location.reload();

    });

  }


  // =========================
  // Back to Home
  // =========================
  if (backBtn) {

    backBtn.addEventListener("click", () => {

      window.location.href = "index.html";

    });

  }


  // =========================
  // Page Category Mapping
  // =========================
  const pageCategories = {

    gallery: [
      "Gram Sabha",
      "Festivals",
      "Cultural Events",
      "Govt Schemes"
    ],

    announcements: [
      "Notice",
      "Circulars",
      "Public Announcements"
    ],

    schemes: [
      "Agriculture",
      "Education",
      "Health",
      "Infrastructure"
    ],

    leadership: [
      "Panchayat Members PDF",
      "Members Photo"
    ]

  };


  // =========================
  // Populate Categories
  // =========================
  if (pageSelect && categorySelect) {

    pageSelect.addEventListener("change", () => {

      const selectedPage = pageSelect.value;

      categorySelect.innerHTML =
        "<option value=''>-- Select Category --</option>";

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


  // =========================
  // Upload File
  // =========================
  if (uploadBtn) {

    uploadBtn.addEventListener("click", async () => {

      const page = pageSelect.value;
      const category = categorySelect.value;
      const year = yearSelect.value;
      const month = monthSelect.value;
      const file = fileInput.files[0];

      const type = getFileType(file);

      if (!page || !category || !file) {

        uploadMessage.textContent =
          "⚠️ Please fill all required fields and select a file.";

        uploadMessage.style.color = "red";
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

        uploadMessage.textContent = "⬆️ Uploading...";
        uploadMessage.style.color = "#1d4ed8";

        const response = await fetch("/api/gallery/upload", {
          method: "POST",
          body: formData
        });

        if (!response.ok) {
          throw new Error("Upload failed");
        }

        uploadMessage.textContent = "✅ Upload successful!";
        uploadMessage.style.color = "green";

        resetForm();

      } catch (error) {

        uploadMessage.textContent = "❌ Upload failed!";
        uploadMessage.style.color = "red";

        console.error(error);
      }

    });


  }


  // =========================
  // Reset Form
  // =========================
  function resetForm() {

    fileInput.value = "";

    pageSelect.value = "";

    categorySelect.innerHTML =
      "<option value=''>-- Select Category --</option>";

    yearSelect.value = "all";

    monthSelect.value = "all";

  }


  // =========================
  // Detect File Type
  // =========================
  function getFileType(file) {

    if (!file) return "";

    const mime = file.type;

    if (mime.startsWith("image/")) return "IMAGE";

    if (mime === "application/pdf") return "PDF";

    if (mime.startsWith("video/")) return "VIDEO";

    return "";

  }

});
