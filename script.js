// Theme toggle, greeting/date, cart, and form validation

(function init() {
  const root = document.documentElement;
  const themeToggle = document.getElementById('themeToggle');
  const cartCountEl = document.getElementById('cartCount');

  // Initialize year in footer
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Greeting and date on homepage
  const greetingEl = document.getElementById('greeting');
  const todayDateEl = document.getElementById('todayDate');
  if (greetingEl && todayDateEl) {
    const now = new Date();
    const hour = now.getHours();
    let greeting = 'Good evening';
    if (hour < 12) greeting = 'Good morning';
    else if (hour < 17) greeting = 'Good afternoon';
    greetingEl.textContent = `${greeting}, welcome to Kutus Bakery.`;
    todayDateEl.textContent = now.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  }

  // Theme persistence
  const savedTheme = localStorage.getItem('theme') || 'light';
  root.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const current = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', current);
      localStorage.setItem('theme', current);
      updateThemeIcon(current);
    });
  }
  function updateThemeIcon(theme) {
    if (!themeToggle) return;
    themeToggle.textContent = theme === 'dark' ? '🌙' : '🌞';
  }

  // Cart: count stored in localStorage
  const initialCount = parseInt(localStorage.getItem('cartCount') || '0', 10);
  if (cartCountEl) cartCountEl.textContent = initialCount;

  // Add-to-cart buttons
  document.querySelectorAll('.add-to-cart').forEach(btn => {
    btn.addEventListener('click', () => {
      const name = btn.getAttribute('data-product');
      const price = parseInt(btn.getAttribute('data-price') || '0', 10);
      // Simple cart: just increment count and show a subtle feedback
      const current = parseInt(localStorage.getItem('cartCount') || '0', 10) + 1;
      localStorage.setItem('cartCount', String(current));
      if (cartCountEl) cartCountEl.textContent = current;

      btn.disabled = true;
      const original = btn.textContent;
      btn.textContent = 'Added ✓';
      setTimeout(() => {
        btn.disabled = false;
        btn.textContent = original;
      }, 900);

      // Optional: also store basic line items (not required, but handy)
      const cartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
      cartItems.push({ name, price, qty: 1, addedAt: Date.now() });
      localStorage.setItem('cartItems', JSON.stringify(cartItems));
    });
  });

  // Contact form validation
  const form = document.getElementById('contactForm');
  if (form) {
    const nameEl = document.getElementById('name');
    const emailEl = document.getElementById('email');
    const messageEl = document.getElementById('message');
    const nameError = document.getElementById('nameError');
    const emailError = document.getElementById('emailError');
    const messageError = document.getElementById('messageError');
    const successEl = document.getElementById('formSuccess');

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let valid = true;
      // Name
      if (!nameEl.value.trim()) {
        valid = false;
        nameError.textContent = 'Please enter your name.';
      } else {
        nameError.textContent = '';
      }
      // Email contains @
      const emailVal = emailEl.value.trim();
      if (!emailVal || !emailVal.includes('@')) {
        valid = false;
        emailError.textContent = 'Please enter a valid email with "@".';
      } else {
        emailError.textContent = '';
      }
      // Message
      if (!messageEl.value.trim()) {
        valid = false;
        messageError.textContent = 'Please write a message.';
      } else {
        messageError.textContent = '';
      }

      if (valid) {
        successEl.textContent = 'Thanks for reaching out! We will get back to you soon.';
        form.reset();
      } else {
        successEl.textContent = '';
      }
    });
  }
})();
