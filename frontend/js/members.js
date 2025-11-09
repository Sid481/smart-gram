// 🧩 Panchayat Members JS
document.addEventListener("DOMContentLoaded", () => {
  const membersCount = document.getElementById("membersCount");
  const viewListBtn = document.getElementById("viewListBtn");
  const membersModal = document.getElementById("membersModal");
  const membersList = document.getElementById("membersList");
  const closeModal = document.getElementById("closeModal");

  const listTab = document.getElementById("listTab");
  const pdfTab = document.getElementById("pdfTab");
  const listSection = document.getElementById("listSection");
  const pdfSection = document.getElementById("pdfSection");

  // 🧾 File paths (backend will replace actual data)
  const pdfPath = "assets/images/members.pdf";
  const photoPath = "assets/images/members.jpg"; // optional photo support

  // 🧩 Check and load PDF or image dynamically
  function loadMembersData() {
    // 📄 Check for PDF
    fetch(pdfPath, { method: "HEAD" })
      .then(res => {
        if (res.ok) {
          pdfSection.innerHTML = `
            <iframe src="${pdfPath}" class="w-full h-[70vh] border rounded-lg" frameborder="0"></iframe>
          `;
        } else {
          // 🖼️ If PDF not found, check for image
          checkForImage();
        }
      })
      .catch(() => checkForImage());
  }

  // 🖼️ Fallback to image if PDF missing
  function checkForImage() {
    fetch(photoPath, { method: "HEAD" })
      .then(res => {
        if (res.ok) {
          pdfSection.innerHTML = `
            <img src="${photoPath}" alt="Panchayat Members Photo" class="w-full max-h-[70vh] object-contain rounded-lg shadow">
          `;
        } else {
          pdfSection.innerHTML = `
            <p class="text-gray-500 text-center py-10">No member list or photo available yet.</p>
          `;
        }
      })
      .catch(() => {
        pdfSection.innerHTML = `
          <p class="text-gray-500 text-center py-10">No member list or photo available yet.</p>
        `;
      });
  }

  // 🧩 Load files dynamically on page load
  loadMembersData();

  // 📊 Set member count placeholder (backend can replace later)
  membersCount.textContent = "Panchayat Members Information";

  // 🖱️ Open modal
  viewListBtn.addEventListener("click", () => {
    membersModal.classList.remove("hidden");
    setTimeout(() => {
      membersModal.querySelector("div").classList.remove("scale-95");
      membersModal.querySelector("div").classList.add("scale-100");
    }, 10);
  });

  // ❌ Close modal
  closeModal.addEventListener("click", () => {
    membersModal.querySelector("div").classList.add("scale-95");
    setTimeout(() => membersModal.classList.add("hidden"), 200);
  });

  // 🖱️ Close modal on background click
  membersModal.addEventListener("click", e => {
    if (e.target === membersModal) {
      membersModal.querySelector("div").classList.add("scale-95");
      setTimeout(() => membersModal.classList.add("hidden"), 200);
    }
  });

  // 🔁 Tab Switching
  listTab.addEventListener("click", () => {
    listSection.classList.remove("hidden");
    pdfSection.classList.add("hidden");

    listTab.classList.add("bg-indigo-600", "text-white");
    pdfTab.classList.remove("bg-indigo-600", "text-white");
    pdfTab.classList.add("bg-gray-200", "text-gray-700");
  });

  pdfTab.addEventListener("click", () => {
    listSection.classList.add("hidden");
    pdfSection.classList.remove("hidden");

    pdfTab.classList.add("bg-indigo-600", "text-white");
    listTab.classList.remove("bg-indigo-600", "text-white");
    listTab.classList.add("bg-gray-200", "text-gray-700");
  });
});
