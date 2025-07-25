document.addEventListener('DOMContentLoaded', () => {
    const authOverlay = document.getElementById('auth-overlay');
    const mainContent = document.querySelector('main');
    
    const loginContainer = document.getElementById('login-container');
    const signupContainer = document.getElementById('signup-container');
    const showSignupBtn = document.getElementById('show-signup-btn');
    const showLoginBtn = document.getElementById('show-login-btn');
    
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    const loginError = document.getElementById('login-error');
    const signupError = document.getElementById('signup-error');

    const mainHeader = document.getElementById("main-header");
    const profileContainerDesktop = document.getElementById('profile-container-desktop');
    const profileButton = document.getElementById('profile-button');
    const profileDropdown = document.getElementById('profile-dropdown');
    const logoutButton = document.getElementById('logout-button');
    
    const hamburgerButton = document.getElementById("hamburger-button");
    const mobileMenu = document.getElementById("mobile-menu");
    const menuIcon = document.getElementById("menu-icon");
    const closeIcon = document.getElementById("close-icon");
    const logoutButtonMobile = document.getElementById('logout-button-mobile');

    const cartCountSpan = document.getElementById('cart-count');
    const mobileCartCountSpan = document.getElementById('mobile-cart-count');
    const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');

    const checkLoginState = () => localStorage.getItem('isLoggedIn') === 'true';
    const getCurrentUser = () => localStorage.getItem('currentUser');
    
    const getCart = () => JSON.parse(localStorage.getItem('cart')) || [];
    const saveCart = (cart) => localStorage.setItem('cart', JSON.stringify(cart));

    const updateCartCount = () => {
        const cart = getCart();
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        if (cartCountSpan) cartCountSpan.setAttribute('data-count', totalItems);
        if (mobileCartCountSpan) mobileCartCountSpan.setAttribute('data-count', totalItems);
    };
    
    const updateNavbarUI = () => {
        const isLoggedIn = checkLoginState();
        profileContainerDesktop.classList.toggle('hidden', !isLoggedIn);
        logoutButtonMobile.classList.toggle('hidden', !isLoggedIn);

        if (isLoggedIn) {
            const user = getCurrentUser();
            if (user && profileButton) {
                profileButton.textContent = user.charAt(0).toUpperCase();
            }
        } else {
            profileDropdown.classList.add('opacity-0', 'scale-95', 'invisible');
        }
    };
    
    const handleLogout = () => {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('currentUser');
        updateNavbarUI();
        authOverlay.classList.remove('hidden');
        mainContent.classList.add('hidden');
    };

    const handleLoginSuccess = (username) => {
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('currentUser', username);
        authOverlay.classList.add('hidden');
        mainContent.classList.remove('hidden');
        updateNavbarUI();
    };

    if (checkLoginState()) {
        authOverlay.classList.add('hidden');
        mainContent.classList.remove('hidden');
    }

    showSignupBtn.addEventListener('click', () => {
        loginContainer.classList.add('hidden');
        signupContainer.classList.remove('hidden');
    });

    showLoginBtn.addEventListener('click', () => {
        signupContainer.classList.add('hidden');
        loginContainer.classList.remove('hidden');
    });

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('login-username').value;
        handleLoginSuccess(username);
    });

    signupForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('signup-username').value;
        handleLoginSuccess(username);
    });

    profileButton?.addEventListener('click', (e) => {
        e.stopPropagation();
        profileDropdown.classList.toggle('opacity-0');
        profileDropdown.classList.toggle('scale-95');
        profileDropdown.classList.toggle('invisible');
    });

    window.addEventListener('click', () => {
        if (!profileDropdown.classList.contains('invisible')) {
            profileDropdown.classList.add('opacity-0', 'scale-95', 'invisible');
        }
    });
    
    logoutButton?.addEventListener('click', handleLogout);
    logoutButtonMobile?.addEventListener('click', handleLogout);

    hamburgerButton?.addEventListener("click", () => {
        mobileMenu.classList.toggle("max-h-0");
        mobileMenu.classList.toggle("opacity-0");
        mobileMenu.classList.toggle("max-h-screen");
        mobileMenu.classList.toggle("opacity-100");
        menuIcon.classList.toggle("hidden");
        closeIcon.classList.toggle("hidden");
    });

    addToCartButtons.forEach(button => {
        button.addEventListener('click', () => {
            const id = button.dataset.id;
            const name = button.dataset.name;
            const price = parseFloat(button.dataset.price);
            let cart = getCart();
            const existingItem = cart.find(item => item.id === id);

            if (existingItem) {
                existingItem.quantity++;
            } else {
                cart.push({ id, name, price, quantity: 1 });
            }
            saveCart(cart);
            updateCartCount();
        });
    });
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            mainHeader?.classList.add('bg-[#5C4033]/80', 'shadow-xl', 'backdrop-blur-lg');
        } else {
            mainHeader?.classList.remove('bg-[#5C4033]/80', 'shadow-xl', 'backdrop-blur-lg');
        }
    });

    const yearSpan = document.getElementById("current-year");
    if (yearSpan) yearSpan.textContent = new Date().getFullYear();
    
    updateNavbarUI();
    updateCartCount();
});