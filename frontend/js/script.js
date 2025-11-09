// Language Translation & Page Interactivity

/*const translations = {
  en: { heroTitle: "Welcome to Tembhurni Grampanchayat", heroSubtitle: "Empowering Rural Development and Transparency" },
  mr: { heroTitle: "टेंभुर्णी ग्रामपंचायतीत आपले स्वागत आहे", heroSubtitle: "ग्रामीण विकास आणि पारदर्शकतेसाठी कार्यरत" }
};

let currentLang = 'en';
function toggleLanguage() {
  currentLang = currentLang === 'en' ? 'mr' : 'en';
  updateContent();
}

function updateContent() {
  const lang = translations[currentLang];
  Object.keys(lang).forEach(key => {
    const el = document.getElementById(key);
    if (el) el.textContent = lang[key];
  });
}

document.addEventListener('DOMContentLoaded', () => {
  updateContent();
});
*/
// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    e.preventDefault();
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) target.scrollIntoView({ behavior: 'smooth' });
  });
});

// Script for Hamburger Toggle -->

  const menuBtn = document.getElementById('menuBtn');
  const navLinks = document.getElementById('navLinks');

  menuBtn.addEventListener('click', () => {
    navLinks.classList.toggle('hidden');
  });

// Initialize Google Translate
function googleTranslateElementInit() {
  new google.translate.TranslateElement({
    pageLanguage: 'en',
    includedLanguages: 'en,mr',
    layout: google.translate.TranslateElement.InlineLayout.SIMPLE
  }, 'google_translate_element');
}

// Dynamically load Google Translate script
(function() {
  var gt = document.createElement('script');
  gt.type = 'text/javascript';
  gt.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
  document.body.appendChild(gt);
})();


