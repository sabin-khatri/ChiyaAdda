document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const hamburgerButton = document.getElementById('hamburger-button');
  const mobileMenu = document.getElementById('mobile-menu');
  const menuIcon = document.getElementById('menu-icon');
  const closeIcon = document.getElementById('close-icon');
  const mainHeader = document.getElementById('main-header');
  const loader = document.querySelector('.loader');
  const navLinksMobile = document.querySelectorAll('.nav-link-mobile');
  const cartLinkIcons = document.querySelectorAll('.cart-link');

  // Hide loader after page load
  setTimeout(() => {
    loader.classList.add('hidden');
  }, 1000);

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    mobileMenu.classList.toggle('show');
    menuIcon.classList.toggle('hidden');
    closeIcon.classList.toggle('hidden');
    hamburgerButton.classList.toggle('active');
    document.body.style.overflow = mobileMenu.classList.contains('show') ? 'hidden' : 'auto';
    mobileMenu.scrollTop = 0; // Reset scroll to top
  };

  hamburgerButton.addEventListener('click', toggleMobileMenu);
  hamburgerButton.addEventListener('touchstart', (e) => {
    e.preventDefault(); // Prevent double-tap zoom on mobile
    toggleMobileMenu();
  });

  // Close mobile menu on link click
  navLinksMobile.forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('show');
      menuIcon.classList.remove('hidden');
      closeIcon.classList.add('hidden');
      hamburgerButton.classList.remove('active');
      document.body.style.overflow = 'auto';
    });
  });

  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (!mobileMenu.contains(e.target) && !hamburgerButton.contains(e.target) && mobileMenu.classList.contains('show')) {
      toggleMobileMenu();
    }
  });

  // Header scroll effect
  window.addEventListener('scroll', () => {
    mainHeader.classList.toggle('scrolled', window.scrollY > 50);
  });

  // Highlight active nav link
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-link, .nav-link-mobile');
  navLinks.forEach(link => {
    const linkPage = link.getAttribute('href').split('/').pop() || 'index.html';
    if (linkPage === currentPage) {
      link.classList.add('active');
    }
  });

  // Update cart icon
  const updateCartIcon = () => {
    const cart = JSON.parse(localStorage.getItem('chiyaGharCart')) || [];
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartLinkIcons.forEach(icon => {
      if (totalItems > 0) {
        icon.setAttribute('data-count', totalItems);
        icon.classList.add('cart-count');
      } else {
        icon.removeAttribute('data-count');
        icon.classList.remove('cart-count');
      }
    });
  };

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

  // Cart count styling
  const style = document.createElement('style');
  style.textContent = `
    .cart-count::after {
      content: attr(data-count);
      position: absolute;
      top: -12px;
      right: -12px;
      background-color: #EF4444;
      color: white;
      font-size: 0.75rem;
      font-weight: bold;
      border-radius: 50%;
      padding: 4px 8px;
      line-height: 1;
      min-width: 22px;
      text-align: center;
      border: 2px solid #5C4033;
      box-shadow: 0 2px 6px rgba(0,0,0,0.4);
      transition: transform 0.3s ease;
      animation: bounce 0.5s ease-in-out;
    }
    .cart-count:hover::after {
      transform: scale(1.2);
    }
    @keyframes bounce {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-5px); }
    }
  `;
  document.head.appendChild(style);

  updateCartIcon();
});