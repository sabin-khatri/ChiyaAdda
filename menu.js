
    document.addEventListener('DOMContentLoaded', () => {
        const authOverlay = document.getElementById('auth-overlay');
        const mainContent = document.querySelector('main');

        const loginContainer = document.getElementById('login-container');
        const signupContainer = document.getElementById('signup-container');
        const loginForm = document.getElementById('login-form');
        const signupForm = document.getElementById('signup-form');

        const showSignupBtn = document.getElementById('show-signup-btn');
        const showLoginBtn = document.getElementById('show-login-btn');

        const loginErrorEl = document.getElementById('login-error');
        const signupErrorEl = document.getElementById('signup-error');
        
        const navContactLink = document.getElementById('nav-contact-link');
        const navLogoutBtn = document.getElementById('nav-logout-btn');
        const mobileContactLink = document.getElementById('mobile-contact-link');
        const mobileLogoutBtn = document.getElementById('mobile-logout-btn');

        const navUsernameDisplay = document.getElementById('nav-username-display');
        const mobileUsernameDisplay = document.getElementById('mobile-username-display');
        
        const USERS_KEY = 'chiyaGharUsers';
        const LOGGED_IN_KEY = 'chiyaGharLoggedInUser';
        const CART_KEY = 'chiyaGharCart';

        const getUsers = () => JSON.parse(localStorage.getItem(USERS_KEY)) || [];
        const saveUsers = (users) => localStorage.setItem(USERS_KEY, JSON.stringify(users));

        const showMenu = () => {
            const username = localStorage.getItem(LOGGED_IN_KEY);

            authOverlay.classList.add('hidden');
            mainContent.classList.remove('hidden');
            document.body.style.overflow = '';
            
            navContactLink.classList.add('hidden');
            navLogoutBtn.classList.remove('hidden');
            navUsernameDisplay.textContent = `Hi, ${username}`;
            navUsernameDisplay.classList.remove('hidden');
            
            mobileContactLink.classList.add('hidden');
            mobileLogoutBtn.classList.remove('hidden');
            mobileUsernameDisplay.textContent = `Hi, ${username}`;
            mobileUsernameDisplay.classList.remove('hidden');
            
            updateCartCountIndicator();
        };

        const showAuth = () => {
            authOverlay.classList.remove('hidden');
            mainContent.classList.add('hidden');
            document.body.style.overflow = 'hidden';

            navContactLink.classList.remove('hidden');
            navLogoutBtn.classList.add('hidden');
            navUsernameDisplay.classList.add('hidden');

            mobileContactLink.classList.remove('hidden');
            mobileLogoutBtn.classList.add('hidden');
            mobileUsernameDisplay.classList.add('hidden');
        };

        const handleLogin = (e) => {
            e.preventDefault();
            const username = document.getElementById('login-username').value.trim();
            const password = document.getElementById('login-password').value;
            const users = getUsers();
            const user = users.find(u => u.username === username && u.password === password);

            if (user) {
                localStorage.setItem(LOGGED_IN_KEY, username);
                showMenu();
            } else {
                loginErrorEl.textContent = 'Invalid username or password.';
                loginErrorEl.classList.remove('hidden');
            }
        };

        const handleSignup = (e) => {
            e.preventDefault();
            const username = document.getElementById('signup-username').value.trim();
            const password = document.getElementById('signup-password').value;
            const users = getUsers();

            if (!username || !password) {
                signupErrorEl.textContent = 'Username and password cannot be empty.';
                signupErrorEl.classList.remove('hidden');
                return;
            }

            if (users.some(u => u.username === username)) {
                signupErrorEl.textContent = 'Username already exists.';
                signupErrorEl.classList.remove('hidden');
            } else {
                users.push({ username, password });
                saveUsers(users);
                localStorage.setItem(LOGGED_IN_KEY, username);
                showMenu();
            }
        };

        const handleLogout = () => {
            localStorage.removeItem(LOGGED_IN_KEY);
            showAuth();
            loginForm.reset();
            signupForm.reset();
            loginErrorEl.classList.add('hidden');
            signupErrorEl.classList.add('hidden');
        };
        
        showSignupBtn.addEventListener('click', () => {
            loginContainer.classList.add('hidden');
            signupContainer.classList.remove('hidden');
            loginErrorEl.classList.add('hidden');
        });
        
        showLoginBtn.addEventListener('click', () => {
            signupContainer.classList.add('hidden');
            loginContainer.classList.remove('hidden');
            signupErrorEl.classList.add('hidden');
        });
        
        loginForm.addEventListener('submit', handleLogin);
        signupForm.addEventListener('submit', handleSignup);
        navLogoutBtn.addEventListener('click', handleLogout);
        mobileLogoutBtn.addEventListener('click', handleLogout);

        if (localStorage.getItem(LOGGED_IN_KEY)) {
            showMenu();
        } else {
            showAuth();
        }

        document.getElementById('current-year').textContent = new Date().getFullYear();
        const hamburgerButton = document.getElementById('hamburger-button');
        const mobileMenu = document.getElementById('mobile-menu');
        const closeMenuButton = document.getElementById('close-menu-button');

        hamburgerButton.addEventListener('click', () => {
            mobileMenu.classList.remove('hidden');
        });

        closeMenuButton.addEventListener('click', () => {
            mobileMenu.classList.add('hidden');
        });
        
        const getCart = () => JSON.parse(localStorage.getItem(CART_KEY)) || [];
        const saveCart = (cart) => {
            localStorage.setItem(CART_KEY, JSON.stringify(cart));
            updateCartCountIndicator();
        };

        const addToCart = (item) => {
            const cart = getCart();
            const existingItemIndex = cart.findIndex(cartItem => cartItem.id === item.id);

            if (existingItemIndex > -1) {
                cart[existingItemIndex].quantity += 1;
            } else {
                cart.push({ ...item, quantity: 1 });
            }
            saveCart(cart);
        };

        function updateCartCountIndicator() {
            const cart = getCart();
            const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
            const navCartLink = document.getElementById('nav-cart-link');
            const mobileNavCartLink = document.getElementById('mobile-nav-cart-link');
            const links = [navCartLink, mobileNavCartLink];

            links.forEach(link => {
                if (!link) return;
                if (totalItems > 0) {
                    link.classList.add('cart-count');
                    link.dataset.count = totalItems;
                } else {
                    link.classList.remove('cart-count');
                    delete link.dataset.count;
                }
            });
        }
        
        const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
        addToCartButtons.forEach(button => {
            button.addEventListener('click', (event) => {
                const id = event.target.dataset.id;
                const name = event.target.dataset.name;
                const price = parseFloat(event.target.dataset.price);

                if (!id || !name || isNaN(price)) {
                    console.error('Invalid item data:', event.target.dataset);
                    alert('Could not add item to cart. Invalid data.');
                    return;
                }

                const item = { id, name, price };
                addToCart(item);
                alert(`${name} added to cart!`);
            });
        });

    });
 
