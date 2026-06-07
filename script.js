const themeToggle = document.getElementById('themeToggle');
const searchInput = document.getElementById('searchInput');
const searchClear = document.getElementById('searchClear');
const productCards = Array.from(document.querySelectorAll('.product-card'));
const newsletterForm = document.getElementById('newsletterForm');
const newsletterEmail = document.getElementById('newsletterEmail');

const savedTheme = localStorage.getItem('techReviewTheme');
const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');

function applyTheme(theme) {
  document.body.setAttribute('data-theme', theme);
  themeToggle.textContent = theme === 'dark' ? '☀️' : '🌙';
  localStorage.setItem('techReviewTheme', theme);
}

applyTheme(initialTheme);

themeToggle.addEventListener('click', () => {
  const nextTheme = document.body.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  applyTheme(nextTheme);
});

function filterProducts(query) {
  const normalized = query.trim().toLowerCase();
  productCards.forEach(card => {
    const text = card.getAttribute('data-search') || card.textContent;
    card.style.display = !normalized || text.toLowerCase().includes(normalized) ? 'grid' : 'none';
  });
}

if (searchInput) {
  searchInput.addEventListener('input', event => {
    filterProducts(event.target.value);
  });
}

if (searchClear) {
  searchClear.addEventListener('click', () => {
    if (searchInput) {
      searchInput.value = '';
      filterProducts('');
      searchInput.focus();
    }
  });
}

if (newsletterForm) {
  newsletterForm.addEventListener('submit', event => {
    event.preventDefault();
    const email = newsletterEmail.value.trim();
    if (!email) return;
    newsletterForm.innerHTML = `<p class="newsletter-confirmation">Thanks! ${email} is now subscribed to our weekly tech updates.</p>`;
  });
}

window.addEventListener('DOMContentLoaded', () => {
  if (searchInput && searchInput.value) {
    filterProducts(searchInput.value);
  }
});

// Mobile nav toggle
const hamburgerBtn = document.getElementById('hamburgerBtn');
const mobileNav = document.getElementById('mobileNav');
const mobileNavClose = document.getElementById('mobileNavClose');

function openMobileNav() {
  if (!mobileNav) return;
  mobileNav.classList.add('open');
  mobileNav.setAttribute('aria-hidden', 'false');
  if (hamburgerBtn) hamburgerBtn.setAttribute('aria-expanded', 'true');
  document.documentElement.classList.add('no-scroll');
  // Focus trap: save previously focused element and focus first focusable inside mobile nav
  lastFocusedBeforeNav = document.activeElement;
  activateFocusTrap();
}

function closeMobileNav() {
  if (!mobileNav) return;
  mobileNav.classList.remove('open');
  mobileNav.setAttribute('aria-hidden', 'true');
  if (hamburgerBtn) hamburgerBtn.setAttribute('aria-expanded', 'false');
  document.documentElement.classList.remove('no-scroll');
  // Remove focus trap and restore focus
  deactivateFocusTrap();
}

if (hamburgerBtn) {
  hamburgerBtn.addEventListener('click', openMobileNav);
}
if (mobileNavClose) {
  mobileNavClose.addEventListener('click', closeMobileNav);
}
// Close on Escape
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeMobileNav();
});

// Focus trap helpers for mobile nav
let lastFocusedBeforeNav = null;
let focusTrapHandler = null;

function getFocusableElements(container) {
  if (!container) return [];
  return Array.from(container.querySelectorAll('a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])'))
    .filter(el => !el.hasAttribute('disabled') && el.getAttribute('aria-hidden') !== 'true');
}

function activateFocusTrap() {
  if (!mobileNav) return;
  const focusable = getFocusableElements(mobileNav);
  if (focusable.length === 0) return;
  // Focus first element
  focusable[0].focus();
  focusTrapHandler = function(e) {
    if (e.key !== 'Tab') return;
    const focusableNow = getFocusableElements(mobileNav);
    if (focusableNow.length === 0) return;
    const first = focusableNow[0];
    const last = focusableNow[focusableNow.length - 1];
    if (e.shiftKey) {
      if (document.activeElement === first) {
        e.preventDefault();
        last.focus();
      }
    } else {
      if (document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  };
  document.addEventListener('keydown', focusTrapHandler);
}

function deactivateFocusTrap() {
  if (focusTrapHandler) {
    document.removeEventListener('keydown', focusTrapHandler);
    focusTrapHandler = null;
  }
  if (lastFocusedBeforeNav && typeof lastFocusedBeforeNav.focus === 'function') {
    lastFocusedBeforeNav.focus();
  }
  lastFocusedBeforeNav = null;
}

// Desktop categories dropdown
const categoryToggle = document.getElementById('categoryToggle');
const categoryMenu = document.getElementById('categoryMenu');
if (categoryToggle) {
  categoryToggle.addEventListener('click', (e) => {
    e.preventDefault();
    const parent = categoryToggle.parentElement;
    const open = parent.classList.toggle('open');
    categoryToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    if (categoryMenu) categoryMenu.setAttribute('aria-hidden', open ? 'false' : 'true');
  });
  // Close when clicking outside
  document.addEventListener('click', (e) => {
    if (!categoryToggle) return;
    const parent = categoryToggle.parentElement;
    if (!parent.contains(e.target)) {
      parent.classList.remove('open');
      categoryToggle.setAttribute('aria-expanded', 'false');
      if (categoryMenu) categoryMenu.setAttribute('aria-hidden', 'true');
    }
  });
}

// Mobile categories toggle
const mobileCatsToggle = document.getElementById('mobileCatsToggle');
const mobileCats = document.getElementById('mobileCats');
if (mobileCatsToggle && mobileCats) {
  mobileCatsToggle.addEventListener('click', () => {
    const open = mobileCats.classList.toggle('open');
    mobileCats.setAttribute('aria-hidden', open ? 'false' : 'true');
  });
}

// Dynamic breadcrumb for Category -> Mobile -> <Month><Day> -> Under 30k
function updateCategoryBreadcrumb(fixedDay = 26) {
  const el = document.getElementById('categoryMonth');
  if (!el) return;
  const today = new Date();
  let year = today.getFullYear();
  let monthIndex = today.getMonth();
  // If today's date is after the fixed day, show next month
  if (today.getDate() > fixedDay) {
    monthIndex += 1;
    if (monthIndex > 11) {
      monthIndex = 0;
      year += 1;
    }
  }
  const monthName = new Intl.DateTimeFormat('en-US', { month: 'long' }).format(new Date(year, monthIndex, 1));
  el.textContent = `${monthName}${fixedDay}`;
}

updateCategoryBreadcrumb(26);
