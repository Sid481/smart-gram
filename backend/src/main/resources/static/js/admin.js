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

  const yearSelect = document.getElementById("yearSelect");
  const monthSelect = document.getElementById("monthSelect");
  const fileInput = document.getElementById("fileInput");

  // ✅ Maintain session using localStorage
  if (localStorage.getItem("isAdminLoggedIn") === "true") {
    showAdminPanel();
  }

  // 🔐 LOGIN — ask backend to verify password
  if (loginBtn && adminPassword && loginMessage) {
    loginBtn.addEventListener("click", async () => {

      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          password: adminPassword.value
        })
      });

      if (res.ok) {
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
    if (previewSection) previewSection.classList.remove("hidden");
    if (adminHeader) adminHeader.classList.remove("hidden");
  }

  // 🚪 Logout button
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("isAdminLoggedIn");
      location.reload();
    });
  }

  // ⬅️ Back to Home button
  if (backBtn) {
    backBtn.addEventListener("click", () => {
      window.location.href = "index.html";
    });
  }

  // 📂 Page-based categories
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

  // 💾 Upload with backend call
  if (uploadBtn) {
    uploadBtn.addEventListener("click", async () => {
      const page = pageSelect ? pageSelect.value : "";
      const category = categorySelect ? categorySelect.value : "";
      const year = yearSelect ? yearSelect.value : "";
      const month = monthSelect ? monthSelect.value : "";
      const file = fileInput && fileInput.files ? fileInput.files[0] : null;
      const type = getFileType(file);

      if (!page || !category || !file) {
        if (uploadMessage) {
          uploadMessage.textContent = "⚠️ Please fill all required fields and select a file!";
          uploadMessage.style.color = "red";
        }
        return;
      }

      if (!type) {
        if (uploadMessage) {
          uploadMessage.textContent = "⚠️ Unsupported file type!";
          uploadMessage.style.color = "red";
        }
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
          body: formData,
          credentials: "include"
        });

        if (!response.ok) throw new Error(await response.text());

        uploadMessage.textContent = "✅ Upload successful!";
        uploadMessage.style.color = "green";

        if (fileInput) fileInput.value = "";
        if (categorySelect) categorySelect.value = "";
        if (pageSelect) pageSelect.value = "";
        if (yearSelect) yearSelect.value = "all";
        if (monthSelect) monthSelect.value = "all";
      } catch (error) {
        uploadMessage.textContent = "❌ " + error.message;
        uploadMessage.style.color = "red";
      }
    });
  }

  function getFileType(file) {
    if (!file) return "";
    const mime = file.type;
    if (mime.startsWith("image/")) return "IMAGE";
    if (mime === "application/pdf") return "PDF";
    if (mime.startsWith("video/")) return "VIDEO";
    return "";
  }
})
