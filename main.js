/* ===================================
   SALEM STEAMER — McLEAN
   Main JavaScript
   =================================== */

'use strict';

// ─── Navigation Scroll Behavior ──────
const nav = document.getElementById('site-nav');

function handleNavScroll() {
  if (window.scrollY > 60) {
    nav.classList.add('scrolled');
    nav.classList.remove('transparent');
  } else {
    nav.classList.remove('scrolled');
    nav.classList.add('transparent');
  }
}

window.addEventListener('scroll', handleNavScroll, { passive: true });
handleNavScroll();

// ─── Mobile Menu ──────────────────────
const hamburger = document.querySelector('.hamburger');
const navLinks   = document.querySelector('.nav-links');

if (hamburger && navLinks) {
  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', navLinks.classList.contains('open'));
  });

  // Close on link click
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
    });
  });
}

// ─── Scroll Animations ────────────────
const fadeEls = document.querySelectorAll('.fade-up');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

fadeEls.forEach(el => observer.observe(el));

// ─── FAQ Accordion ────────────────────
document.querySelectorAll('.faq-question').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.closest('.faq-item');
    const isOpen = item.classList.contains('open');

    // Close all
    document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));

    // Toggle current
    if (!isOpen) item.classList.add('open');
  });
});

// ─── Time Slot Selection ──────────────
document.querySelectorAll('.time-slot').forEach(slot => {
  slot.addEventListener('click', () => {
    const group = slot.closest('.time-slots');
    group.querySelectorAll('.time-slot').forEach(s => s.classList.remove('selected'));
    slot.classList.add('selected');
  });
});

// ─── Contact Form ─────────────────────
const contactForm = document.getElementById('contact-form');

if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const btn = contactForm.querySelector('[type="submit"]');
    const originalText = btn.textContent;
    btn.textContent = 'Sending…';
    btn.disabled = true;

    // Simulate API delay
    await new Promise(r => setTimeout(r, 1200));

    btn.textContent = 'Message Received';
    btn.style.background = '#4a7c59';
    btn.style.color = '#fff';

    // Optionally reset after delay
    setTimeout(() => {
      btn.textContent = originalText;
      btn.disabled = false;
      btn.style.background = '';
      btn.style.color = '';
      contactForm.reset();
    }, 4000);
  });
}

// ─── Smooth Scroll for Anchor Links ──
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// ─── Active Nav Highlight ─────────────
const sections = document.querySelectorAll('section[id]');
const navLinkEls = document.querySelectorAll('.nav-links a[href^="#"]');

function highlightNav() {
  let current = '';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 120) {
      current = sec.getAttribute('id');
    }
  });

  navLinkEls.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === '#' + current) {
      link.classList.add('active');
    }
  });
}

window.addEventListener('scroll', highlightNav, { passive: true });

// ─── Parallax on Hero ────────────────
const heroBg = document.querySelector('.hero-bg');
if (heroBg) {
  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    heroBg.style.transform = `translateY(${scrolled * 0.3}px)`;
  }, { passive: true });
}

// ─── Stats Counter Animation ──────────
function animateCounter(el, target, duration = 1800) {
  let start = null;
  const isFloat = String(target).includes('.');
  const suffix = el.dataset.suffix || '';

  function step(ts) {
    if (!start) start = ts;
    const progress = Math.min((ts - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = eased * target;
    el.textContent = (isFloat ? current.toFixed(1) : Math.floor(current)) + suffix;
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const target = parseFloat(el.dataset.count);
      animateCounter(el, target);
      counterObserver.unobserve(el);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('[data-count]').forEach(el => counterObserver.observe(el));

// ─── Booking Date Picker (simple) ─────
const dateInput = document.getElementById('booking-date');
if (dateInput) {
  const today = new Date();
  const formatted = today.toISOString().split('T')[0];
  dateInput.setAttribute('min', formatted);
}

// ─── Page Routing (SPA-lite) ──────────
// All pages are in one HTML. Show/hide based on nav hash.
const pages = document.querySelectorAll('[data-page]');

function showPage(pageId) {
  pages.forEach(p => {
    if (p.dataset.page === pageId) {
      p.style.display = '';
      p.removeAttribute('hidden');
    } else {
      p.hidden = true;
    }
  });
  window.scrollTo(0, 0);

  // Refresh observers for newly visible elements
  setTimeout(() => {
    document.querySelectorAll('.fade-up:not(.visible)').forEach(el => observer.observe(el));
  }, 50);
}

function routeFromHash() {
  const hash = window.location.hash.replace('#page-', '') || 'home';
  const validPages = ['home', 'about', 'services', 'water-damage', 'discretion', 'contact'];
  showPage(validPages.includes(hash) ? hash : 'home');
}

// Nav links that target pages
document.querySelectorAll('[data-nav]').forEach(el => {
  el.addEventListener('click', e => {
    e.preventDefault();
    const target = el.dataset.nav;
    history.pushState(null, '', '#page-' + target);
    showPage(target);
    if (navLinks) navLinks.classList.remove('open');
  });
});

window.addEventListener('popstate', routeFromHash);
routeFromHash();
