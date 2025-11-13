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

  //const username = "ADMIN";
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

//   // 💾 Upload (frontend simulation)
//   uploadBtn.addEventListener("click", () => {
//     const page = pageSelect.value;
//     const category = categorySelect.value;
//     const file = document.getElementById("fileInput").files[0];

//     if (!page || !category || !file) {
//       uploadMessage.textContent = "⚠️ Please fill all fields!";
//       uploadMessage.style.color = "red";
//       return;
//     }

//     uploadMessage.textContent = "✅ File ready to upload (backend will handle saving).";
//     uploadMessage.style.color = "green";
//   });
// });

uploadBtn.addEventListener("click", async () => {
    const page = pageSelect.value;
    const category = categorySelect.value;
    const year = document.getElementById("yearSelect").value;
    const month = document.getElementById("monthSelect").value;
    const fileInput = document.getElementById("fileInput");
    const file = fileInput.files[0];
    const type = getFileType(file);

    if (!page || !category || !file) {
      uploadMessage.textContent = "⚠️ Please fill all required fields and select a file!";
      uploadMessage.style.color = "red";
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("category", category);
    formData.append("title", file.name); // You can add separate title input if needed
    formData.append("year", year);
    formData.append("month", month);
    formData.append("type", type);

    try {
      uploadMessage.textContent = "⬆️ Uploading...";
      uploadMessage.style.color = "#1d4ed8";

      const response = await fetch("http://localhost:8081/api/gallery/upload", {
        method: "POST",
        body: formData,
        credentials: "include" // important for session cookie to be sent
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Upload failed");
      }

      const result = await response.json();
      uploadMessage.textContent = "✅ Upload successful!";
      uploadMessage.style.color = "green";

      // Optionally, clear the inputs or refresh preview here
      fileInput.value = "";
      categorySelect.value = "";
      pageSelect.value = "";
    } catch (error) {
      uploadMessage.textContent = "❌ " + error.message;
      uploadMessage.style.color = "red";
    }
  });

  // Helper to determine file type string for backend enum
  function getFileType(file) {
    if (!file) return "";
    const mime = file.type;
    if (mime.startsWith("image/")) return "IMAGE";
    if (mime === "application/pdf") return "PDF";
    if (mime.startsWith("video/")) return "VIDEO";
    return "";
  }
});
