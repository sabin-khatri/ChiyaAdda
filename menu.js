
    document.addEventListener('DOMContentLoaded', () => {

        // --- AUTHENTICATION ELEMENTS & LOGIC ---
        const authOverlay = document.getElementById('auth-overlay');
        const loginContainer = document.getElementById('login-container');
        const signupContainer = document.getElementById('signup-container');
        const loginForm = document.getElementById('login-form');
        const signupForm = document.getElementById('signup-form');
        const showSignupBtn = document.getElementById('show-signup-btn');
        const showLoginBtn = document.getElementById('show-login-btn');
        const loginError = document.getElementById('login-error');
        const signupError = document.getElementById('signup-error');
        
        // Elements to show/hide after login
        const mainHeader = document.getElementById('main-header');
        const mainContent = document.getElementById('main-content');
        const mainFooter = document.getElementById('main-footer');

        // Simple "hashing" function for demonstration.
        // In a real app, this MUST be done on a server with a library like bcrypt.
        const pseudoHash = (str) => {
            let hash = 0;
            for (let i = 0; i < str.length; i++) {
                const char = str.charCodeAt(i);
                hash = (hash << 5) - hash + char;
                hash |= 0; // Convert to 32bit integer
            }
            return 'h' + hash; // Prepend a letter to ensure it's a string
        };

        const checkAuth = () => {
            // sessionStorage is used so login is forgotten when the browser tab is closed.
            if (sessionStorage.getItem('chiyaGharUser')) {
                // User is logged in
                authOverlay.classList.add('opacity-0', 'pointer-events-none');
                mainHeader.classList.remove('invisible');
                mainContent.classList.remove('invisible');
                mainFooter.classList.remove('invisible');
                initializeMainApp(); // Run the main app logic
            } else {
                // User is not logged in, ensure overlay is visible
                authOverlay.classList.remove('opacity-0', 'pointer-events-none');
            }
        };
        
        // Form switching logic
        showSignupBtn.addEventListener('click', () => {
            loginContainer.classList.add('hidden');
            signupContainer.classList.remove('hidden');
        });

        showLoginBtn.addEventListener('click', () => {
            signupContainer.classList.add('hidden');
            loginContainer.classList.remove('hidden');
        });

        // Handle Sign Up
        signupForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const username = document.getElementById('signup-username').value;
            const password = document.getElementById('signup-password').value;
            const users = JSON.parse(localStorage.getItem('chiyaGharUsers')) || {};

            if (users[username]) {
                signupError.textContent = 'Username already exists.';
                return;
            }
            
            users[username] = pseudoHash(password);
            localStorage.setItem('chiyaGharUsers', JSON.stringify(users));
            sessionStorage.setItem('chiyaGharUser', username);
            checkAuth();
        });

        // Handle Login
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const username = document.getElementById('login-username').value;
            const password = document.getElementById('login-password').value;
            const users = JSON.parse(localStorage.getItem('chiyaGharUsers')) || {};
            
            if (users[username] && users[username] === pseudoHash(password)) {
                sessionStorage.setItem('chiyaGharUser', username);
                checkAuth();
            } else {
                loginError.textContent = 'Invalid username or password.';
            }
        });

        // --- MAIN APPLICATION LOGIC (Runs only after successful login) ---
        const initializeMainApp = () => {

            // --- Mobile Menu Toggle ---
            const hamburgerButton = document.getElementById('hamburger-button');
            const mobileMenu = document.getElementById('mobile-menu');
            const menuIcon = document.getElementById('menu-icon');
            const closeIcon = document.getElementById('close-icon');

            hamburgerButton.addEventListener('click', () => {
                mobileMenu.classList.toggle('translate-x-full');
                menuIcon.classList.toggle('hidden');
                closeIcon.classList.toggle('hidden');
            });

            // --- Header Scroll Effect ---
            window.addEventListener('scroll', () => {
                if (window.scrollY > 50) {
                    mainHeader.classList.add('bg-[#3C2F2F]', 'shadow-lg');
                } else {
                    mainHeader.classList.remove('bg-[#3C2F2F]', 'shadow-lg');
                }
            });

            // --- Cart Logic ---
            const cartLinkIcons = document.querySelectorAll('.cart-link');
            const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');

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
                    };

                    const existingItem = cart.find(cartItem => cartItem.id === itemData.id);
                    if (existingItem) {
                        existingItem.quantity++;
                    } else {
                        itemData.quantity = 1;
                        cart.push(itemData);
                    }
                    
                    saveCart(cart);
                    updateCartIcon();

                    // Button "Added!" animation
                    const btnText = button.querySelector('.btn-text');
                    if (btnText.textContent === 'Add to Cart') {
                        btnText.textContent = 'Added!';
                        button.classList.add('bg-green-600', 'hover:bg-green-700');
                        button.classList.remove('bg-amber-600', 'hover:bg-amber-700');

                        setTimeout(() => {
                            btnText.textContent = 'Add to Cart';
                            button.classList.remove('bg-green-600', 'hover:bg-green-700');
                            button.classList.add('bg-amber-600', 'hover:bg-amber-700');
                        }, 1500);
                    }
                });
            });
            
            // --- General UI Enhancements ---
            // Active Nav Link Highlighter
            const currentPage = window.location.pathname.split('/').pop() || 'index.html';
            const navLinks = document.querySelectorAll('a.nav-link, a.nav-link-mobile');
            navLinks.forEach(link => {
                const linkPage = link.getAttribute('href').split('/').pop() || 'index.html';
                if (linkPage === currentPage) {
                    link.classList.add('text-amber-400', 'font-bold');
                }
            });

            // Footer Year
            const yearSpan = document.getElementById('current-year');
            if (yearSpan) yearSpan.textContent = new Date().getFullYear();

            // Scroll Animations
            const scrollElements = document.querySelectorAll('.animate-on-scroll');
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('is-visible');
                        // Optional: unobserve after animating to save resources
                        // observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.1 });
            scrollElements.forEach(el => observer.observe(el));
            
            // Initial call to set the cart icon on page load
            updateCartIcon();
        };

        // --- Initial check on page load ---
        checkAuth();
    });
  