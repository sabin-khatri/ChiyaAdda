    document.getElementById('current-year').textContent = new Date().getFullYear();
    const hamburgerButton = document.getElementById('hamburger-button');
    const mobileMenu = document.getElementById('mobile-menu');
    const closeMenuButton = document.getElementById('close-menu-button');

    hamburgerButton.addEventListener('click', () => {
      mobileMenu.classList.remove('hidden');
      document.body.style.overflow = 'hidden';
    });

    closeMenuButton.addEventListener('click', () => {
      mobileMenu.classList.add('hidden');
      document.body.style.overflow = '';
    });

    const CART_KEY = 'chiyaGharCart';
    const CHECKOUT_ITEM_KEY = 'chiyaGharCheckoutItem'; // Key for sessionStorage

    function getCart() {
        const cart = localStorage.getItem(CART_KEY);
        return cart ? JSON.parse(cart) : [];
    }

    function saveCart(cart) {
        localStorage.setItem(CART_KEY, JSON.stringify(cart));
        updateCartCountIndicator();
        renderCart();
    }

     function updateCartCountIndicator() {
        const cart = getCart();
        const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 0), 0);
        const navCartLink = document.getElementById('nav-cart-link');
        const mobileNavCartLink = document.getElementById('mobile-nav-cart-link');

        if (totalItems > 0) {
            if (navCartLink) navCartLink.classList.add('cart-count');
            if (mobileNavCartLink) mobileNavCartLink.classList.add('cart-count');
            if (navCartLink) navCartLink.dataset.count = totalItems;
            if (mobileNavCartLink) mobileNavCartLink.dataset.count = totalItems;
        } else {
             if (navCartLink) navCartLink.classList.remove('cart-count');
             if (mobileNavCartLink) mobileNavCartLink.classList.remove('cart-count');
             if (navCartLink) delete navCartLink.dataset.count;
             if (mobileNavCartLink) delete mobileNavCartLink.dataset.count;
        }
    }

    const cartItemsContainer = document.getElementById('cart-items-container');
    const cartTotalElement = document.getElementById('cart-total');
    const emptyCartMessage = document.getElementById('empty-cart-message');
    const cartSummaryElement = document.getElementById('cart-summary');
    const clearCartBtn = document.getElementById('clear-cart-btn');

    function renderCart() {
        const cart = getCart();
        cartItemsContainer.innerHTML = '';

        if (cart.length === 0) {
            emptyCartMessage.classList.remove('hidden');
            cartSummaryElement.classList.add('hidden');
        } else {
            emptyCartMessage.classList.add('hidden');
            cartSummaryElement.classList.remove('hidden');

            cart.forEach(item => {
                const itemElement = document.createElement('div');
                itemElement.classList.add(
                    'flex', 'flex-col', 'sm:flex-row', // Stack on small, row on sm+
                    'items-start', 'sm:items-center',
                    'justify-between', 'py-3', 'border-b',
                    'border-gray-600', 'gap-3', 'sm:gap-4'
                 );
                itemElement.dataset.itemId = item.id;

                const itemPrice = (item.price || 0).toFixed(2);
                const itemName = item.name || 'Unknown Item';
                const itemQuantity = item.quantity || 0;

                // Container for item info and quantity controls
                const infoQtyContainer = document.createElement('div');
                infoQtyContainer.classList.add('flex', 'flex-col', 'sm:flex-row', 'sm:items-center', 'flex-grow', 'gap-2', 'sm:gap-4', 'w-full', 'sm:w-auto');

                infoQtyContainer.innerHTML = `
                    <div class="w-full sm:w-3/5 flex-shrink-0">
                        <span class="font-semibold text-amber-300">${itemName}</span>
                        <span class="text-sm text-gray-400 block">Rs. ${itemPrice} each</span>
                    </div>
                    <div class="flex items-center justify-start w-auto">
                        <button class="qty-btn decrease-qty-btn" data-id="${item.id}">-</button>
                        <span class="mx-2 font-medium">${itemQuantity}</span>
                        <button class="qty-btn increase-qty-btn" data-id="${item.id}">+</button>
                    </div>
                `;

                // Container for action buttons (Checkout Item, Remove)
                const actionsContainer = document.createElement('div');
                actionsContainer.classList.add('item-actions', 'self-end', 'sm:self-center'); // Use custom class for responsive actions

                actionsContainer.innerHTML = `
                    <button class="checkout-item-btn" data-id="${item.id}">Checkout Item</button>
                    <button class="remove-btn remove-item-btn" data-id="${item.id}">Remove</button>
                `;

                itemElement.appendChild(infoQtyContainer);
                itemElement.appendChild(actionsContainer);
                cartItemsContainer.appendChild(itemElement);
            });
            updateTotal(); // Update the total for the entire cart
        }
        updateCartCountIndicator();
    }

    function updateTotal() {
        const cart = getCart();
        // Calculate total for all items currently shown in the cart summary
        const total = cart.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 0), 0);
        cartTotalElement.textContent = `Rs. ${total.toFixed(2)}`;
    }

    function updateQuantity(itemId, change) {
        const cart = getCart();
        const itemIndex = cart.findIndex(item => item.id === itemId);
        if (itemIndex > -1) {
            cart[itemIndex].quantity = (cart[itemIndex].quantity || 0) + change;
            if (cart[itemIndex].quantity <= 0) {
                cart.splice(itemIndex, 1);
            }
            saveCart(cart);
        }
    }

    function removeFromCart(itemId) {
        let cart = getCart();
        cart = cart.filter(item => item.id !== itemId);
        saveCart(cart);
    }

    function clearCart() {
        if (confirm('Are you sure you want to clear the entire cart?')) {
            saveCart([]);
        }
    }

    function checkoutSingleItem(itemId) {
        const cart = getCart();
        const itemToCheckout = cart.find(item => item.id === itemId);

        if (itemToCheckout) {
            console.log('Checking out item:', itemToCheckout);
            // Store only this item in sessionStorage for checkout.html to pick up
            sessionStorage.setItem(CHECKOUT_ITEM_KEY, JSON.stringify(itemToCheckout));
            // Redirect to checkout page
            window.location.href = 'checkout.html';
        } else {
            console.error('Could not find item with ID to checkout:', itemId);
            alert('Error: Could not find the item to checkout.');
        }
    }


    cartItemsContainer.addEventListener('click', (event) => {
        const target = event.target;
        // Find the closest parent element with data-item-id if the click wasn't directly on a button
        const itemElement = target.closest('[data-item-id]');
        const itemId = itemElement ? itemElement.dataset.itemId : null;

        if (!itemId) return; // Exit if no item ID context

        if (target.classList.contains('increase-qty-btn')) {
            updateQuantity(itemId, 1);
        } else if (target.classList.contains('decrease-qty-btn')) {
            updateQuantity(itemId, -1);
        } else if (target.classList.contains('remove-item-btn')) {
            removeFromCart(itemId);
        } else if (target.classList.contains('checkout-item-btn')) {
            checkoutSingleItem(itemId);
        }
    });

    clearCartBtn.addEventListener('click', clearCart);

    document.addEventListener('DOMContentLoaded', () => {
        sessionStorage.removeItem(CHECKOUT_ITEM_KEY); // Clear any leftover single item checkout data
        renderCart();
    });

