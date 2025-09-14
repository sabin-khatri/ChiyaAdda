document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const hamburgerButton = document.getElementById('hamburger-button');
  const mobileMenu = document.getElementById('mobile-menu');
  const menuIcon = document.getElementById('menu-icon');
  const closeIcon = document.getElementById('close-icon');
  const mainHeader = document.getElementById('main-header');
  const loader = document.querySelector('.loader');

  // Hide loader after page load
  setTimeout(() => {
    loader.classList.add('hidden');
  }, 1000);

  // Toggle mobile menu
  hamburgerButton.addEventListener('click', () => {
    mobileMenu.classList.toggle('translate-x-full');
    menuIcon.classList.toggle('hidden');
    closeIcon.classList.toggle('hidden');
  });

  // Close mobile menu on link click
  document.querySelectorAll('.nav-link-mobile').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.add('translate-x-full');
      menuIcon.classList.remove('hidden');
      closeIcon.classList.add('hidden');
    });
  });

  // Header scroll effect
  window.addEventListener('scroll', () => {
    mainHeader.classList.toggle('bg-[#3C2F2F]/95', window.scrollY > 50);
    mainHeader.classList.toggle('glass-card', window.scrollY > 50);
    mainHeader.classList.toggle('shadow-2xl', window.scrollY > 50);
  });

  // Highlight active nav link
  const navLinks = document.querySelectorAll('.nav-link');
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  navLinks.forEach(link => {
    if (link.getAttribute('href').split('/').pop() === currentPage) {
      link.classList.add('active');
    }
  });

  // Enhanced Scroll animations
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.3,
    rootMargin: '0px 0px -50px 0px',
  });

  document.querySelectorAll('.animate-on-scroll').forEach(el => {
    observer.observe(el);
  });

  // Parallax effect for hero section
  const heroSection = document.querySelector('.hero-bg');
  window.addEventListener('scroll', () => {
    const scrollPosition = window.scrollY;
    heroSection.style.backgroundPositionY = `${scrollPosition * 0.5}px`;
  });

  // Particle effect for hero section
  const particlesContainer = document.querySelector('.particles');
  function createParticle() {
    const particle = document.createElement('div');
    particle.classList.add('particle');
    const size = Math.random() * 10 + 5;
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.left = `${Math.random() * 100}%`;
    particle.style.animationDuration = `${Math.random() * 5 + 5}s`;
    particle.style.animationDelay = `${Math.random() * 2}s`;
    particlesContainer.appendChild(particle);
    setTimeout(() => particle.remove(), 10000);
  }
  setInterval(createParticle, 300);

  // Set current year in footer
  document.getElementById('current-year').textContent = new Date().getFullYear();

  // Hover effect for cards
  document.querySelectorAll('.glass-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });
});