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
  const membersData = [
    { name: "Smt. Suraja Yogesh Bobade", post: "Sarpanch", mobile: "9970781009", photo: "/assets/images/sarpanch.jpg" },
    { name: "Smt. Rajshree Satish Newase", post: "Up-Sarpanch", mobile: "9730822644", photo: "/assets/images/upsarpanch.jpg" },
    { name: "Shri. Kailas Bikarji Satpute", post: "Member", mobile: "9422462254", photo: "assets/members/3.jpg" },
    { name: "Smt. Shamal Tukaram Dokhe", post: "Member", mobile: "9423336338", photo: "assets/members/4.jpg" },
    { name: "Shri. Hanuman Sopan Wagh", post: "Member", mobile: "7507738418", photo: "assets/members/5.jpg" },
    { name: "Shri. Ganesh Vijay Hawaldar", post: "Member", mobile: "9011891947", photo: "assets/members/6.jpg" },
    { name: "Smt. Muktabai Gorling Patil", post: "Member", mobile: "9960793770", photo: "assets/members/7.jpg" },
    { name: "Smt. Vidya Shailesh Ohol", post: "Member", mobile: "9860884144", photo: "assets/members/8.jpg" },
    { name: "Smt. Rupmati Rajaram Sherat", post: "Member", mobile: "9404690277", photo: "assets/members/9.jpg" },
    { name: "Shri. Tribhakesh Mohan Bobade", post: "Member", mobile: "9158880900", photo: "assets/members/10.jpg" },
    { name: "Smt. Sunanda Siddheshwar Tabe", post: "Member", mobile: "9975790551", photo: "assets/members/11.jpg" },
    { name: "Shri. Sachin Nilkanth Hodage", post: "Member", mobile: "9850281551", photo: "assets/images/sachin.jpeg" },
    { name: "Smt. Pratima Parameshwar Kharat", post: "Member", mobile: "8668541275", photo: "assets/members/13.jpg" },
    { name: "Smt. Sarubai Vaibhav Deshmukh", post: "Member", mobile: "9561192525", photo: "assets/members/14.jpg" },
    { name: "Shri. Balasaheb Anjanrao Dhonge", post: "Member", mobile: "9860360481", photo: "assets/members/15.jpg" },
    { name: "Shri. Amar Mahadev Kamble", post: "Member", mobile: "7507574044", photo: "assets/images/amarkambale.jpeg" },
    { name: "Smt. Aarti Lakhan Pawar", post: "Member", mobile: "9730128212", photo: "assets/members/17.jpg" },
    { name: "Shri. Pramod Prabhakar Kute", post: "Member", mobile: "9850304551", photo: "/assets/images/pramodkute.jpeg" }
  ];


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
  // 🌟 Render members list into modal
  membersList.innerHTML = membersData
    .map(m => `
      <li class="member-item">
        <img src="${m.photo}" class="member-photo">

        <div>
          <p class="font-semibold">${m.name}</p>
          <p>Post: ${m.post}</p>
          <p>Mobile:
            <a href="tel:${m.mobile}" class="text-indigo-600">
              ${m.mobile}
            </a>
          </p>
        </div>
      </li>
    `)
    .join("");

});

