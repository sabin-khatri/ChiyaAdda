document.addEventListener('DOMContentLoaded', function() {
  
  // --- Element Selectors ---
  const hamburgerButton = document.getElementById("hamburger-button");
  const mobileMenu = document.getElementById("mobile-menu");
  const menuIcon = document.getElementById("menu-icon");
  const closeIcon = document.getElementById("close-icon");
  const mainHeader = document.getElementById("main-header");

  // --- Mobile Menu Toggle ---
  if (hamburgerButton) {
    hamburgerButton.addEventListener("click", () => {
      mobileMenu.classList.toggle("translate-x-full");
      menuIcon.classList.toggle("hidden");
      closeIcon.classList.toggle("hidden");
    });
  }

  // --- Header Style on Scroll ---
  if (mainHeader) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        mainHeader.classList.add('bg-[#5C4033]/80', 'shadow-xl', 'backdrop-blur-lg');
      } else {
        mainHeader.classList.remove('bg-[#5C4033]/80', 'shadow-xl', 'backdrop-blur-lg');
      }
    });
  }

  // --- Highlight Active Navigation Link ---
  const navLinks = document.querySelectorAll('.nav-link');
  if (navLinks.length > 0) {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    navLinks.forEach(link => {
        if (link.getAttribute('href').split('/').pop() === currentPage) {
            link.classList.add('active');
        }
    });
  }

  // --- Animate on Scroll ---
  const animatedElements = document.querySelectorAll('.animate-on-scroll');
  if (animatedElements.length > 0) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target); // Animate only once
        }
      });
    }, {
      threshold: 0.1 // Trigger when 10% of the element is visible
    });
    animatedElements.forEach(el => observer.observe(el));
  }

  // --- FAQ Accordion Logic ---
  const faqItems = document.querySelectorAll('.faq-item');
  if (faqItems.length > 0) {
    faqItems.forEach(item => {
        const questionButton = item.querySelector('.faq-question');
        if (questionButton) {
          questionButton.addEventListener('click', () => {
              // Close other open items for a "one-at-a-time" accordion effect
              faqItems.forEach(otherItem => {
                  if (otherItem !== item && otherItem.classList.contains('open')) {
                      otherItem.classList.remove('open');
                  }
              });
              // Toggle the clicked item
              item.classList.toggle('open');
          });
        }
    });
  }

  // --- Set Current Year in Footer ---
  const yearSpan = document.getElementById("current-year");
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }
  
});