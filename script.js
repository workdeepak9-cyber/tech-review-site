const themeToggle = document.getElementById('themeToggle');
const searchInput = document.getElementById('searchInput');
const searchClear = document.getElementById('searchClear');
const cards = Array.from(document.querySelectorAll('.review-card, .product-card, .deal-card'));
const compareCategory = document.getElementById('compareCategory');
const compareBudget = document.getElementById('compareBudget');
const compareAction = document.getElementById('compareAction');
const compareResult = document.getElementById('compareResult');
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

function filterCards(query) {
  const normalized = query.trim().toLowerCase();
  cards.forEach(card => {
    const text = card.getAttribute('data-search') || card.textContent;
    if (!normalized || text.toLowerCase().includes(normalized)) {
      card.style.display = '';
    } else {
      card.style.display = 'none';
    }
  });
}

searchInput.addEventListener('input', event => {
  filterCards(event.target.value);
});

searchClear.addEventListener('click', () => {
  searchInput.value = '';
  filterCards('');
  searchInput.focus();
});

const compareOptions = {
  smartphone: {
    budget: 'Best all-round smartphone with long battery life and a balanced camera package.',
    midrange: 'Top midrange smartphone with high refresh rate display, 5G, and smart AI features.',
    premium: 'Premium flagship smartphone with the latest chipset, pro-grade camera, and fast charging.'
  },
  laptop: {
    budget: 'Affordable laptop with solid battery life, portability, and productivity essentials.',
    midrange: 'Balanced laptop for creatives and remote workers with good performance and display.',
    premium: 'High-end laptop with premium build quality, powerful CPU/GPU, and advanced cooling.'
  },
  gaming: {
    budget: 'Value gaming rig focused on smooth 1080p gameplay and efficient thermal design.',
    midrange: 'Gaming laptop with strong graphics, adaptive refresh rate, and customizable lighting.',
    premium: 'Top-tier gaming setup with desktop-level power and fast high-refresh displays.'
  }
};

compareAction.addEventListener('click', () => {
  const category = compareCategory.value;
  const budget = compareBudget.value;
  const resultText = compareOptions[category]?.[budget] || 'Choose a category and budget to get a tailored recommendation.';
  compareResult.innerHTML = `
    <h3>Recommended ${category.charAt(0).toUpperCase() + category.slice(1)} Option</h3>
    <p>${resultText}</p>
  `;
});

newsletterForm.addEventListener('submit', event => {
  event.preventDefault();
  const email = newsletterEmail.value.trim();
  if (!email) {
    return;
  }
  newsletterForm.innerHTML = `<p class="newsletter-confirmation">Thanks! ${email} is now subscribed to our weekly tech newsletter.</p>`;
});

window.addEventListener('DOMContentLoaded', () => {
  if (searchInput.value) {
    filterCards(searchInput.value);
  }
});
