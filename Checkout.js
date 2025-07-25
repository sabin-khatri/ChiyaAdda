    document.getElementById('current-year').textContent = new Date().getFullYear();
    // --- Navigation Toggle (Standard) ---
    const hamburgerButton = document.getElementById('hamburger-button');
    const mobileMenu = document.getElementById('mobile-menu');
    const closeMenuButton = document.getElementById('close-menu-button');
    hamburgerButton.addEventListener('click', () => { mobileMenu.classList.remove('hidden'); document.body.style.overflow = 'hidden'; });
    closeMenuButton.addEventListener('click', () => { mobileMenu.classList.add('hidden'); document.body.style.overflow = ''; });

    // --- Key Definitions ---
    const CART_KEY = 'chiyaGharCart';
    const ORDERS_KEY = 'chiyaGharOrders';
    const CHECKOUT_ITEM_KEY = 'chiyaGharCheckoutItem'; // Key for sessionStorage
    const CHECKOUT_DETAILS_KEY = 'chiyaGharCheckoutDetails'; // Key for localStorage prefill (used by order history edit)

    // --- Storage Helper Functions ---
    function getCart() {
        const cart = localStorage.getItem(CART_KEY);
        return cart ? JSON.parse(cart) : [];
    }
    function saveCart(cart) {
        localStorage.setItem(CART_KEY, JSON.stringify(cart));
        updateCartCountIndicator(); // Update nav count when cart changes
    }
    function getOrders() {
        const orders = localStorage.getItem(ORDERS_KEY);
        return orders ? JSON.parse(orders) : [];
    }
    function saveOrders(orders) {
        localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
    }

    // --- Update Cart Count Indicator in Nav ---
    function updateCartCountIndicator() {
        const cart = getCart(); // Always read the full cart for the indicator
        const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 0), 0);
        const navCartLink = document.getElementById('nav-cart-link');
        const mobileNavCartLink = document.getElementById('mobile-nav-cart-link');
        const count = totalItems > 0 ? totalItems.toString() : '';

        [navCartLink, mobileNavCartLink].forEach(link => {
            if (link) {
                if (count) {
                    link.classList.add('cart-count');
                    link.dataset.count = count;
                } else {
                    link.classList.remove('cart-count');
                    delete link.dataset.count;
                }
            }
        });
    }

    // --- DOM Element References ---
    const checkoutItemSummaryDiv = document.getElementById('checkout-item-summary');
    const checkoutItemNameSpan = document.getElementById('checkout-item-name');
    const checkoutItemQuantitySpan = document.getElementById('checkout-item-quantity');
    const checkoutItemPriceSpan = document.getElementById('checkout-item-price');
    const checkoutItemTotalSpan = document.getElementById('checkout-item-total');
    const checkoutForm = document.getElementById('checkout-form');
    const placeOrderBtn = document.getElementById('place-order-btn');
    const messageElement = document.getElementById('checkout-message');

    // --- Form Input References ---
    const nameInput = document.getElementById('name');
    const addressInput = document.getElementById('address');
    const phoneInput = document.getElementById('phone');
    const nameError = document.getElementById('name-error');
    const addressError = document.getElementById('address-error');
    const phoneError = document.getElementById('phone-error');

    // --- Single Item Checkout Logic ---

    function displaySingleItemCheckout(item) {
        if (!item || typeof item.price !== 'number' || typeof item.quantity !== 'number') {
            showErrorMessage('Invalid item data for checkout.', true);
            return; // Exit if item data is invalid
        }

        checkoutItemNameSpan.textContent = item.name || 'N/A';
        checkoutItemQuantitySpan.textContent = item.quantity;
        checkoutItemPriceSpan.textContent = item.price.toFixed(2);
        const itemTotal = item.price * item.quantity;
        checkoutItemTotalSpan.textContent = itemTotal.toFixed(2);

        checkoutItemSummaryDiv.classList.remove('hidden');
        checkoutForm.classList.remove('hidden'); // Show the form only if item is valid
        messageElement.classList.add('hidden'); // Hide any previous messages
    }

    function validateForm() {
        let isValid = true;
        nameError.classList.add('hidden');
        addressError.classList.add('hidden');
        phoneError.classList.add('hidden');

        if (!nameInput.value.trim()) {
            nameError.classList.remove('hidden');
            isValid = false;
        }
        if (!addressInput.value.trim()) {
            addressError.classList.remove('hidden');
            isValid = false;
        }
        // Basic 10-digit phone validation
        if (!/^[0-9]{10}$/.test(phoneInput.value)) {
             phoneError.classList.remove('hidden');
             isValid = false;
         }

        return isValid;
    }

    function placeSingleItemOrder(item) {
        if (!validateForm()) {
            return; // Stop if form is invalid
        }
        if (!item || !item.id) {
            alert('Error: Cannot place order without valid item data.');
            return;
        }

        const customerDetails = {
            name: nameInput.value.trim(),
            address: addressInput.value.trim(),
            phone: phoneInput.value.trim()
        };

        const itemTotal = (item.price || 0) * (item.quantity || 0);

        const newOrder = {
            orderId: `CG-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`, // More unique ID
            orderDate: new Date().toISOString(),
            customerDetails: customerDetails,
            items: [item], // Order contains only this single item
            totalAmount: itemTotal
        };

        try {
            const orders = getOrders();
            orders.push(newOrder);
            saveOrders(orders);

            // Remove the *checked out item* from the main cart in localStorage
            let cart = getCart();
            cart = cart.filter(cartItem => cartItem.id !== item.id);
            saveCart(cart); // This also updates the nav count

            alert(`Order placed successfully!\nOrder ID: ${newOrder.orderId}\nTotal: Rs. ${itemTotal.toFixed(2)}`);
            checkoutForm.reset();
            // Redirect to order history or a success page
            window.location.href = 'order.html';

        } catch (error) {
            console.error("Error saving order:", error);
            alert('There was an error placing your order. Please try again.');
        }
    }

    function showErrorMessage(message, hideForm = false) {
        messageElement.textContent = message;
        messageElement.classList.remove('hidden');
        checkoutItemSummaryDiv.classList.add('hidden');
        if (hideForm) {
            checkoutForm.classList.add('hidden');
        }
    }

    // --- Pre-fill form from Order History Edit ---
    function prefillCheckoutFormFromHistory() {
        const prefillDataString = localStorage.getItem(CHECKOUT_DETAILS_KEY);
        if (prefillDataString) {
            try {
                const prefillData = JSON.parse(prefillDataString);
                if (nameInput && prefillData.name) nameInput.value = prefillData.name;
                if (addressInput && prefillData.address) addressInput.value = prefillData.address;
                if (phoneInput && prefillData.phone) phoneInput.value = prefillData.phone;
                localStorage.removeItem(CHECKOUT_DETAILS_KEY); // Clean up
                console.log('Checkout form pre-filled from edited order history.');
            } catch (error) {
                console.error('Error parsing prefill data from history:', error);
                localStorage.removeItem(CHECKOUT_DETAILS_KEY);
            }
        }
    }


    // --- Initial Setup on Page Load ---
    document.addEventListener('DOMContentLoaded', () => {
        updateCartCountIndicator(); // Initial cart count

        const singleItemDataString = sessionStorage.getItem(CHECKOUT_ITEM_KEY);
        let itemToCheckout = null;

        if (singleItemDataString) {
            try {
                itemToCheckout = JSON.parse(singleItemDataString);
                 // IMPORTANT: Remove from sessionStorage immediately after reading
                sessionStorage.removeItem(CHECKOUT_ITEM_KEY);
            } catch (error) {
                console.error("Error parsing item data from sessionStorage:", error);
                showErrorMessage('Error loading item data. Please go back to the cart and try again.', true);
                return; // Stop execution if data is invalid
            }
        }

        if (itemToCheckout) {
            // We have a single item to checkout
            displaySingleItemCheckout(itemToCheckout);
            prefillCheckoutFormFromHistory(); // Check if details came from order history edit

            checkoutForm.addEventListener('submit', (event) => {
                event.preventDefault(); // Prevent default submission
                placeSingleItemOrder(itemToCheckout); // Pass the specific item
            });

        } else {
            // No single item was passed via sessionStorage
            showErrorMessage('No item selected for checkout. Please select an item from your cart.', true);
            // Optionally disable the form submit button explicitly
            if(placeOrderBtn) placeOrderBtn.disabled = true;
        }
    });

