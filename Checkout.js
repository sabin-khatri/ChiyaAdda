
    document.addEventListener('DOMContentLoaded', () => {
      const authOverlay = document.getElementById('auth-overlay');
      const mainHeader = document.getElementById('main-header');
      const mainContent = document.getElementById('main-content');
      const hamburgerButton = document.getElementById('hamburger-button');
      const mobileMenu = document.getElementById('mobile-menu');
      const menuIcon = document.getElementById('menu-icon');
      const closeIcon = document.getElementById('close-icon');
      const navLinksMobile = document.querySelectorAll('.nav-link-mobile');
      const cartLinkIcons = document.querySelectorAll('.cart-link');

      // Toggle Mobile Menu
      const toggleMobileMenu = () => {
        mobileMenu.classList.toggle('show');
        menuIcon.classList.toggle('hidden');
        closeIcon.classList.toggle('hidden');
        hamburgerButton.classList.toggle('active');
        document.body.style.overflow = mobileMenu.classList.contains('show') ? 'hidden' : 'auto';
        mobileMenu.scrollTop = 0;
      };

      hamburgerButton.addEventListener('click', toggleMobileMenu);
      hamburgerButton.addEventListener('touchstart', (e) => {
        e.preventDefault();
        toggleMobileMenu();
      });

      // Close Mobile Menu on Link Click
      navLinksMobile.forEach(link => {
        link.addEventListener('click', () => {
          mobileMenu.classList.remove('show');
          menuIcon.classList.remove('hidden');
          closeIcon.classList.add('hidden');
          hamburgerButton.classList.remove('active');
          document.body.style.overflow = 'auto';
        });
      });

      // Close Menu When Clicking Outside
      document.addEventListener('click', (e) => {
        if (!mobileMenu.contains(e.target) && !hamburgerButton.contains(e.target) && mobileMenu.classList.contains('show')) {
          toggleMobileMenu();
        }
      });

      // Header Scroll Effect
      window.addEventListener('scroll', () => {
        mainHeader.classList.toggle('scrolled', window.scrollY > 50);
      });

      // Highlight Active Navigation Link
      const currentPage = window.location.pathname.split('/').pop() || 'index.html';
      const navLinks = document.querySelectorAll('.nav-link, .nav-link-mobile');
      navLinks.forEach(link => {
        const linkPage = link.getAttribute('href').split('/').pop() || 'index.html';
        if (linkPage === currentPage) {
          link.classList.add('active');
        }
      });

      // Authentication Check
      const checkAuth = () => {
        if (sessionStorage.getItem('chiyaGharUser')) {
          mainHeader.classList.remove('invisible');
          mainContent.classList.remove('invisible');
          initializeCheckoutPage();
        } else {
          authOverlay.classList.remove('hidden');
          authOverlay.classList.add('flex');
          mainHeader.classList.add('invisible');
          mainContent.classList.add('invisible');
        }
      };

      const initializeCheckoutPage = () => {
        const form = document.getElementById('checkout-form');
        const placeOrderBtn = document.getElementById('place-order-btn');
        const summaryItemsContainer = document.getElementById('summary-items-container');
        const summaryTotalEl = document.getElementById('summary-total');
        const successModal = document.getElementById('success-modal');
        const modalCloseBtn = document.getElementById('modal-close-btn');
        
        const checkoutItemsKey = 'chiyaGharCheckoutItems';
        
        const getCheckoutItems = () => JSON.parse(localStorage.getItem(checkoutItemsKey)) || [];
        const getCart = () => JSON.parse(localStorage.getItem('chiyaGharCart')) || [];
        const saveCart = (cart) => localStorage.setItem('chiyaGharCart', JSON.stringify(cart));
        
        const updateCartIcon = () => {
          const totalItems = getCart().reduce((sum, item) => sum + item.quantity, 0);
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

        const renderCheckoutSummary = () => {
          const items = getCheckoutItems();
          if (items.length === 0) {
            alert("Your checkout session is empty. Redirecting to cart.");
            window.location.href = 'cart.html';
            return;
          }
          summaryItemsContainer.innerHTML = '';
          
          let total = 0;
          items.forEach(item => {
            const itemTotal = item.price * item.quantity;
            total += itemTotal;
            const itemElement = document.createElement('div');
            itemElement.className = 'flex items-center gap-4';
            itemElement.innerHTML = `
              <img src="${item.image}" alt="${item.name}" class="w-12 h-12 object-cover rounded-md">
              <div class="flex-grow"><p class="font-semibold">${item.name}</p><p class="text-sm text-gray-400">Qty: ${item.quantity}</p></div>
              <p class="font-medium">Rs. ${itemTotal.toFixed(2)}</p>
            `;
            summaryItemsContainer.appendChild(itemElement);
          });
          
          summaryTotalEl.textContent = `Rs. ${total.toFixed(2)}`;
        };

        form.addEventListener('submit', (e) => {
          e.preventDefault();
          placeOrderBtn.disabled = true;
          placeOrderBtn.textContent = 'Placing Order...';
          
          const formData = new FormData(form);
          const orderDetails = {
            orderId: `CG-${Date.now()}`,
            user: sessionStorage.getItem('chiyaGharUser'),
            items: getCheckoutItems(),
            paymentMethod: formData.get('paymentMethod'),
            totals: { 
              grandTotal: summaryTotalEl.textContent 
            },
            orderDate: new Date().toISOString()
          };

          setTimeout(() => {
            const allOrders = JSON.parse(localStorage.getItem('chiyaGharOrders')) || [];
            allOrders.push(orderDetails);
            localStorage.setItem('chiyaGharOrders', JSON.stringify(allOrders));
            
            localStorage.removeItem(checkoutItemsKey);
            saveCart([]);
            
            successModal.classList.remove('hidden');
            updateCartIcon();
          }, 1500);
        });

        modalCloseBtn.addEventListener('click', () => {
          window.location.href = 'index.html';
        });

        renderCheckoutSummary();
        updateCartIcon();
      };

      checkAuth();
    });
  