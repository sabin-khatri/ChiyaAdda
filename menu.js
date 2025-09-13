document.addEventListener('DOMContentLoaded', () => {
  const hamburgerButton = document.getElementById('hamburger-button');
  const mobileMenu = document.getElementById('mobile-menu');
  const menuIcon = document.getElementById('menu-icon');
  const closeIcon = document.getElementById('close-icon');
  const mainHeader = document.getElementById('main-header');
  const cartLinkIcons = document.querySelectorAll('.cart-link');
  const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');

  // Mobile Menu Toggle
  if (hamburgerButton && mobileMenu && menuIcon && closeIcon) {
    hamburgerButton.addEventListener('click', () => {
      mobileMenu.classList.toggle('translate-x-full');
      menuIcon.classList.toggle('hidden');
      closeIcon.classList.toggle('hidden');
    });

    // Close mobile menu on link click
    const mobileLinks = document.querySelectorAll('.nav-link-mobile');
    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        setTimeout(() => {
          mobileMenu.classList.add('translate-x-full');
          menuIcon.classList.remove('hidden');
          closeIcon.classList.add('hidden');
        }, 200);
      });
    });
  }

  // Header Scroll Effect with Debounce
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        if (window.scrollY > 50) {
          mainHeader.classList.add('bg-[#3C2F2F]', 'shadow-lg', 'backdrop-blur-lg');
        } else {
          mainHeader.classList.remove('bg-[#3C2F2F]', 'shadow-lg', 'backdrop-blur-lg');
        }
        ticking = false;
      });
      ticking = true;
    }
  });

  // Cart Logic
  const getCart = () => JSON.parse(localStorage.getItem('chiyaGharCart')) || [];
  const saveCart = (cart) => localStorage.setItem('chiyaGharCart', JSON.stringify(cart));

  const updateCartIcon = () => {
    const cart = getCart();
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

  addToCartButtons.forEach(button => {
    button.addEventListener('click', () => {
      const cart = getCart();
      const itemData = {
        id: button.dataset.id,
        name: button.dataset.name,
        price: parseFloat(button.dataset.price),
        image: button.dataset.image,
        quantity: 1
      };

      const existingItem = cart.find(cartItem => cartItem.id === itemData.id);
      if (existingItem) {
        existingItem.quantity++;
      } else {
        cart.push(itemData);
      }

      saveCart(cart);
      updateCartIcon();

      // Button "Added!" animation
      const btnText = button.querySelector('.btn-text');
      btnText.textContent = 'Added!';
      button.classList.add('bg-green-600', 'hover:bg-green-700');
      button.classList.remove('bg-amber-600', 'hover:bg-amber-700');

      setTimeout(() => {
        btnText.textContent = 'Add to Cart';
        button.classList.remove('bg-green-600', 'hover:bg-green-700');
        button.classList.add('bg-amber-600', 'hover:bg-amber-700');
      }, 1000);
    });
  });

  // Active Nav Link Highlighter
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-link, .nav-link-mobile');
  navLinks.forEach(link => {
    const linkPage = link.getAttribute('href')?.split('/').pop() || 'index.html';
    if (linkPage === currentPage && !link.id.includes('logout')) {
      link.classList.add('text-amber-400', 'font-bold');
    }
  });

  // Footer Year
  const yearSpan = document.getElementById('current-year');
  if (yearSpan) yearSpan.textContent = new Date().getFullYear();

  // Scroll Animations with Optimized IntersectionObserver
  const scrollElements = document.querySelectorAll('.animate-on-scroll');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target); // Unobserve to improve performance
      }
    });
  }, { threshold: 0.2, rootMargin: '0px 0px -50px 0px' });
  scrollElements.forEach(el => observer.observe(el));

  // Initial cart icon update
  updateCartIcon();
});