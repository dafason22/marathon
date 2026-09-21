// =========================================================
// TABORA GREEN MARATHON — site script
// Vanilla JS: nav, countdown, dark mode, copy, forms, lightbox
// =========================================================

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Mobile nav toggle ---------- */
  const navToggle = document.getElementById('navToggle');
  const nav = document.getElementById('nav');
  if (navToggle && nav) {
    navToggle.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
    nav.querySelectorAll('.nav__link').forEach(link => {
      link.addEventListener('click', () => nav.classList.remove('is-open'));
    });
  }

  /* ---------- Active link on scroll ---------- */
  const sections = document.querySelectorAll('main section[id]');
  const navLinks = document.querySelectorAll('.nav__link');
  const setActiveLink = () => {
    let currentId = sections[0] ? sections[0].id : '';
    const scrollPos = window.scrollY + 140;
    sections.forEach(sec => { if (scrollPos >= sec.offsetTop) currentId = sec.id; });
    navLinks.forEach(link => {
      link.classList.toggle('is-active', link.getAttribute('href') === `#${currentId}`);
    });
  };
  window.addEventListener('scroll', setActiveLink, { passive: true });
  setActiveLink();

  /* ---------- Dark mode toggle ---------- */
  const themeToggle = document.getElementById('themeToggle');
  const root = document.documentElement;
  const applyTheme = (theme) => {
    root.classList.toggle('dark', theme === 'dark');
    if (themeToggle) themeToggle.textContent = theme === 'dark' ? '☀️' : '🌙';
  };
  let savedTheme = 'light';
  try { savedTheme = localStorage.getItem('tgm-theme') || 'light'; } catch (e) { /* ignore */ }
  applyTheme(savedTheme);
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const next = root.classList.contains('dark') ? 'light' : 'dark';
      applyTheme(next);
      try { localStorage.setItem('tgm-theme', next); } catch (e) { /* ignore */ }
    });
  }

  /* ---------- Back to top ---------- */
  const toTop = document.getElementById('toTop');
  const toggleToTop = () => { if (toTop) toTop.classList.toggle('is-visible', window.scrollY > 600); };
  window.addEventListener('scroll', toggleToTop, { passive: true });
  toggleToTop();
  if (toTop) toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  /* ---------- Countdown to race day ---------- */
  const raceDate = new Date('2026-07-25T06:00:00');
  const dEl = document.getElementById('cd-days');
  const hEl = document.getElementById('cd-hours');
  const mEl = document.getElementById('cd-mins');
  const sEl = document.getElementById('cd-secs');
  const pad = (n) => String(n).padStart(2, '0');
  const updateCountdown = () => {
    if (!dEl) return;
    const diff = raceDate - new Date();
    if (diff <= 0) {
      dEl.textContent = hEl.textContent = mEl.textContent = sEl.textContent = '00';
      return;
    }
    dEl.textContent = pad(Math.floor(diff / 86400000));
    hEl.textContent = pad(Math.floor((diff / 3600000) % 24));
    mEl.textContent = pad(Math.floor((diff / 60000) % 60));
    sEl.textContent = pad(Math.floor((diff / 1000) % 60));
  };
  updateCountdown();
  setInterval(updateCountdown, 1000);

  /* ---------- Copy PayBill number ---------- */
  const copyBtn = document.getElementById('copyPaybill');
  const paybillNumber = document.getElementById('paybillNumber');
  if (copyBtn && paybillNumber) {
    copyBtn.addEventListener('click', async () => {
      const text = paybillNumber.textContent.trim();
      try {
        await navigator.clipboard.writeText(text);
      } catch (e) {
        const temp = document.createElement('textarea');
        temp.value = text;
        document.body.appendChild(temp);
        temp.select();
        document.execCommand('copy');
        document.body.removeChild(temp);
      }
      copyBtn.textContent = '✅ Copied';
      copyBtn.classList.add('is-copied');
      setTimeout(() => {
        copyBtn.textContent = '📋 Copy';
        copyBtn.classList.remove('is-copied');
      }, 2000);
    });
  }

  /* ---------- Scroll reveal ---------- */
  const revealTargets = document.querySelectorAll(
    '.timeline__card, .step, .sponsor-card, .partner-card, .gallery-card, .form-card, .contact-card'
  );
  revealTargets.forEach(el => el.classList.add('reveal'));
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealTargets.forEach(el => revealObserver.observe(el));

  /* ---------- Generic form validation ---------- */
  const validateForm = (form) => {
    let valid = true;
    form.querySelectorAll('[required]').forEach(field => {
      const wrapper = field.closest('.form__field');
      let fieldValid = field.value.trim() !== '';
      if (field.type === 'file') fieldValid = field.files && field.files.length > 0;
      if (fieldValid && field.type === 'email') fieldValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value.trim());
      if (fieldValid && field.type === 'tel') fieldValid = field.value.trim().length >= 7;
      if (wrapper) wrapper.classList.toggle('has-error', !fieldValid);
      if (!fieldValid) valid = false;
    });
    return valid;
  };

  /* ---------- Registration form ---------- */
  const registerForm = document.getElementById('registerForm');
  const formSuccess = document.getElementById('formSuccess');
  if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (validateForm(registerForm)) {
        formSuccess.classList.add('is-visible');
        registerForm.reset();
        formSuccess.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      } else {
        formSuccess.classList.remove('is-visible');
      }
    });
  }

  /* ---------- Contact form ---------- */
  const contactForm = document.getElementById('contactForm');
  const contactSuccess = document.getElementById('contactSuccess');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (validateForm(contactForm)) {
        contactSuccess.classList.add('is-visible');
        contactForm.reset();
      } else {
        contactSuccess.classList.remove('is-visible');
      }
    });
  }

  /* ---------- Gallery poster lightbox ---------- */
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxClose = document.getElementById('lightboxClose');
  const posterTrigger = document.getElementById('posterTrigger');
  if (posterTrigger && lightbox && lightboxImg) {
    posterTrigger.addEventListener('click', () => {
      const img = posterTrigger.querySelector('img');
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt;
      lightbox.classList.add('is-open');
    });
  }
  const closeLightbox = () => lightbox && lightbox.classList.remove('is-open');
  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightbox) lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeLightbox(); });

  /* ---------- Footer year ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

});
