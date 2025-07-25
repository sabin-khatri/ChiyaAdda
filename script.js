
      document.addEventListener('DOMContentLoaded', function() {
        const hamburgerButton = document.getElementById("hamburger-button");
        const mobileMenu = document.getElementById("mobile-menu");
        const menuIcon = document.getElementById("menu-icon");
        const closeIcon = document.getElementById("close-icon");
        const mainHeader = document.getElementById("main-header");

        // --- Mobile Menu Toggle ---
        hamburgerButton.addEventListener("click", () => {
          mobileMenu.classList.toggle("translate-x-full");
          menuIcon.classList.toggle("hidden");
          closeIcon.classList.toggle("hidden");
        });

        // --- Header Style on Scroll ---
        window.addEventListener('scroll', () => {
          if (window.scrollY > 50) {
            mainHeader.classList.add('bg-[#5C4033]/80', 'shadow-xl', 'backdrop-blur-lg');
          } else {
            mainHeader.classList.remove('bg-[#5C4033]/80', 'shadow-xl', 'backdrop-blur-lg');
          }
        });

        // --- Highlight Active Navigation Link ---
        const navLinks = document.querySelectorAll('.nav-link');
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        navLinks.forEach(link => {
            if (link.getAttribute('href').split('/').pop() === currentPage) {
                link.classList.add('active');
            }
        });

        // --- Animate on Scroll ---
        const animatedElements = document.querySelectorAll('.animate-on-scroll');
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

        animatedElements.forEach(el => {
          observer.observe(el);
        });

        // --- Set Current Year in Footer ---
        document.getElementById("current-year").textContent = new Date().getFullYear();
      });
    