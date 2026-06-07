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
