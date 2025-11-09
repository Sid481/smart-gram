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

  const ADMIN_PASSWORD = "smartgram123";

  // ✅ Maintain session using localStorage
  if (localStorage.getItem("isAdminLoggedIn") === "true") {
    showAdminPanel();
  }

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

  function showAdminPanel() {
    loginSection.classList.add("hidden");
    uploadSection.classList.remove("hidden");
    document.getElementById("previewSection").classList.remove("hidden");
    adminHeader.classList.remove("hidden");
  }

  // 🚪 Logout button
  logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("isAdminLoggedIn");
    location.reload();
  });

  // ⬅️ Back to Home button
  backBtn.addEventListener("click", () => {
    window.location.href = "index.html";
  });

  // 📂 Page-based categories
  const pageCategories = {
    gallery: ["Gram Sabha", "Festivals", "Cultural Events", "Govt Schemes"],
    announcements: ["Notice", "Circulars", "Public Announcements"],
    schemes: ["Agriculture", "Education", "Health", "Infrastructure"],
    leadership: ["Panchayat Members PDF", "Members Photo"]
  };

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

  // 💾 Upload (frontend simulation)
  uploadBtn.addEventListener("click", () => {
    const page = pageSelect.value;
    const category = categorySelect.value;
    const file = document.getElementById("fileInput").files[0];

    if (!page || !category || !file) {
      uploadMessage.textContent = "⚠️ Please fill all fields!";
      uploadMessage.style.color = "red";
      return;
    }

    uploadMessage.textContent = "✅ File ready to upload (backend will handle saving).";
    uploadMessage.style.color = "green";
  });
});
