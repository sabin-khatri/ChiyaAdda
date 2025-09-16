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
    
    // Form switching logic with animation
    showSignupBtn.addEventListener('click', () => {
        loginContainer.classList.add('hidden');
        setTimeout(() => signupContainer.classList.remove('hidden'), 200);
    });

    showLoginBtn.addEventListener('click', () => {
        signupContainer.classList.add('hidden');
        setTimeout(() => loginContainer.classList.remove('hidden'), 200);
    });

    // Handle Sign Up
    signupForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('signup-username').value.trim();
        const password = document.getElementById('signup-password').value;
        const users = JSON.parse(localStorage.getItem('chiyaGharUsers')) || {};

        if (users[username]) {
            signupError.textContent = 'Username already exists.';
            signupError.classList.add('animate-pulse');
            setTimeout(() => signupError.classList.remove('animate-pulse'), 2000);
            return;
        }
        
        if (username.length < 3 || password.length < 6) {
            signupError.textContent = 'Username must be at least 3 chars, password at least 6.';
            return;
        }
        
        users[username] = pseudoHash(password);
        localStorage.setItem('chiyaGharUsers', JSON.stringify(users));
        sessionStorage.setItem('chiyaGharUser', username);
        authOverlay.classList.add('opacity-0', 'pointer-events-none');
        setTimeout(checkAuth, 500);
    });

    // Handle Login
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('login-username').value.trim();
        const password = document.getElementById('login-password').value;
        const users = JSON.parse(localStorage.getItem('chiyaGharUsers')) || {};
        
        if (users[username] && users[username] === pseudoHash(password)) {
            sessionStorage.setItem('chiyaGharUser', username);
            authOverlay.classList.add('opacity-0', 'pointer-events-none');
            setTimeout(checkAuth, 500);
        } else {
            loginError.textContent = 'Invalid username or password.';
            loginError.classList.add('animate-pulse');
            setTimeout(() => loginError.classList.remove('animate-pulse'), 2000);
        }
    });

    // --- MAIN APPLICATION LOGIC (Runs only after successful login) ---
    const initializeMainApp = () => {

        // --- Mobile Menu Toggle with Enhanced Animation ---
        const hamburgerButton = document.getElementById('hamburger-button');
        const mobileMenu = document.getElementById('mobile-menu');
        const menuIcon = document.getElementById('menu-icon');
        const closeIcon = document.getElementById('close-icon');

        hamburgerButton.addEventListener('click', () => {
            const isOpen = !mobileMenu.classList.contains('translate-x-full');
            mobileMenu.classList.toggle('translate-x-full');
            menuIcon.classList.toggle('hidden');
            closeIcon.classList.toggle('hidden');
            
            // Add body scroll lock when menu is open
            if (!isOpen) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = 'auto';
            }
            
            // Close menu when clicking outside (optional)
            if (!isOpen) {
                setTimeout(() => {
                    const handleClickOutside = (e) => {
                        if (!mobileMenu.contains(e.target) && !hamburgerButton.contains(e.target)) {
                            mobileMenu.classList.add('translate-x-full');
                            menuIcon.classList.remove('hidden');
                            closeIcon.classList.add('hidden');
                            document.body.style.overflow = 'auto';
                            document.removeEventListener('click', handleClickOutside);
                        }
                    };
                    document.addEventListener('click', handleClickOutside);
                }, 100);
            }
        });

        // Close mobile menu when a link is clicked
        const mobileNavLinks = document.querySelectorAll('.nav-link-mobile');
        mobileNavLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.add('translate-x-full');
                menuIcon.classList.remove('hidden');
                closeIcon.classList.add('hidden');
                document.body.style.overflow = 'auto';
            });
        });

        // --- Header Scroll Effect ---
        let lastScrollY = 0;
        window.addEventListener('scroll', () => {
            const currentScrollY = window.scrollY;
            if (currentScrollY > 50) {
                mainHeader.classList.add('scrolled');
            } else {
                mainHeader.classList.remove('scrolled');
            }
            lastScrollY = currentScrollY;
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

                // Enhanced Button "Added!" animation
                const btnText = button.querySelector('.btn-text');
                const originalText = btnText.textContent;
                if (originalText === 'Add to Cart') {
                    btnText.textContent = 'Added! ✓';
                    button.classList.add('added');
                    
                    setTimeout(() => {
                        btnText.textContent = originalText;
                        button.classList.remove('added');
                    }, 2000);
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
                link.classList.add('active', 'text-amber-400', 'font-bold');
            }
        });

        // Footer Year
        const yearSpan = document.getElementById('current-year');
        if (yearSpan) yearSpan.textContent = new Date().getFullYear();

        // Enhanced Scroll Animations with stagger
        const scrollElements = document.querySelectorAll('.animate-on-scroll');
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.classList.add('is-visible');
                    }, index * 150); // Stagger effect
                }
            });
        }, observerOptions);
        scrollElements.forEach(el => observer.observe(el));
        
        // Initial call to set the cart icon on page load
        updateCartIcon();

        // Preload images for smoother animations (optional)
        const menuImages = document.querySelectorAll('img[src*="images/"]');
        menuImages.forEach(img => {
            const newImg = new Image();
            newImg.src = img.src;
        });
    };

    // --- Initial check on page load ---
    checkAuth();
});