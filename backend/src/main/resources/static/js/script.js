// Language Translation & Page Interactivity

// Smooth scroll for in-page anchors
document.addEventListener("DOMContentLoaded", () => {
  // Smooth scroll
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", e => {
      const href = anchor.getAttribute("href");
      if (!href || href === "#") return;

      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth" });
    });
  });

  // Script for Hamburger Toggle
  const menuBtn = document.getElementById("menuBtn");
  const navLinks = document.getElementById("navLinks");

  if (menuBtn && navLinks) {
    menuBtn.addEventListener("click", () => {
      navLinks.classList.toggle("hidden");
    });
  }

  // Dynamically load Google Translate script
  /*(function () {
    if (document.getElementById("google-translate-script")) return;

    var gt = document.createElement("script");
    gt.type = "text/javascript";
    gt.id = "google-translate-script";
    gt.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    document.body.appendChild(gt);
  })();*/
});

// Initialize Google Translate (global callback required by Google)
function googleTranslateElementInit() {
  if (!window.google || !google.translate) return;

  new google.translate.TranslateElement(
    {
      pageLanguage: "en",
      includedLanguages: "en,mr",
      layout: google.translate.TranslateElement.InlineLayout.SIMPLE
    },
    "google_translate_element"
  );
}
