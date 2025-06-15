
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
    const ORDERS_KEY = 'chiyaGharOrders';
    const CHECKOUT_DETAILS_KEY = 'chiyaGharCheckoutDetails';
    const CHECKOUT_ITEM_KEY = 'chiyaGharCheckoutItem'; // Added for consistency, though not used directly on this page for edit

    function getCart() {
        const cart = localStorage.getItem(CART_KEY);
        return cart ? JSON.parse(cart) : [];
    }

    function saveCart(cart) {
         localStorage.setItem(CART_KEY, JSON.stringify(cart));
    }

    function getOrders() {
        const orders = localStorage.getItem(ORDERS_KEY);
        return orders ? JSON.parse(orders) : [];
    }

    function saveOrders(orders) {
        localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
    }

     function updateCartCountIndicator() {
        const cart = getCart();
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

    const ordersContainer = document.getElementById('orders-container');
    const noOrdersMessage = document.getElementById('no-orders-message');

    function renderOrders() {
        const orders = getOrders();
        ordersContainer.innerHTML = '';

        if (orders.length === 0) {
            noOrdersMessage.classList.remove('hidden');
            ordersContainer.classList.add('hidden');
        } else {
            noOrdersMessage.classList.add('hidden');
            ordersContainer.classList.remove('hidden');

            orders.slice().reverse().forEach((order) => {
                const orderElement = document.createElement('div');
                orderElement.classList.add('bg-[#5C4033]', 'p-4', 'md:p-6', 'rounded-lg', 'shadow-md');
                const formattedDate = new Date(order.orderDate).toLocaleString();
                const totalAmount = (typeof order.totalAmount === 'number') ? order.totalAmount.toFixed(2) : 'N/A';
                const customerName = order.customerDetails?.name || 'N/A';
                const customerAddress = order.customerDetails?.address || 'N/A';
                const customerPhone = order.customerDetails?.phone || 'N/A';

                orderElement.innerHTML = `
                    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3 border-b border-gray-600 pb-2 gap-1 sm:gap-4">
                        <h3 class="text-lg md:text-xl font-semibold text-amber-300 order-1 sm:order-none">Order ID: ${order.orderId}</h3>
                        <span class="text-xs md:text-sm text-gray-400 order-2 sm:order-none">Placed on: ${formattedDate}</span>
                    </div>
                    <div class="mb-3">
                        <span class="font-medium">Total Amount:</span>
                        <span class="font-bold text-yellow-200">Rs. ${totalAmount}</span>
                    </div>
                    <div class="mb-4 text-sm text-gray-300 space-y-1">
                         <p><span class="font-medium">Name:</span> ${customerName}</p>
                         <p><span class="font-medium">Address:</span> ${customerAddress}</p>
                         <p><span class="font-medium">Phone:</span> ${customerPhone}</p>
                    </div>
                    <div class="mt-3 flex flex-wrap items-center gap-2">
                        <button class="toggle-details-btn" data-order-id="${order.orderId}">Show Items</button>
                        <button class="edit-order-btn" data-order-id="${order.orderId}">Edit</button>
                        <button class="delete-order-btn" data-order-id="${order.orderId}">Delete</button>
                    </div>
                    <div class="order-item-list hidden mt-3" id="items-${order.orderId}"></div>
                `;
                ordersContainer.appendChild(orderElement);

                const toggleBtn = orderElement.querySelector('.toggle-details-btn');
                const editBtn = orderElement.querySelector('.edit-order-btn');
                const deleteBtn = orderElement.querySelector('.delete-order-btn');

                if(toggleBtn) toggleBtn.addEventListener('click', toggleOrderItems);
                if(editBtn) editBtn.addEventListener('click', handleEditOrder);
                if(deleteBtn) deleteBtn.addEventListener('click', handleDeleteOrder);
            });
        }
    }

    function toggleOrderItems(event) {
         const button = event.target;
         const orderId = button.dataset.orderId;
         const orders = getOrders();
         const order = orders.find(o => o.orderId === orderId);

         if (!order || !Array.isArray(order.items)) return;

         const itemsListDiv = document.getElementById(`items-${order.orderId}`);
         if (!itemsListDiv) return;

         if (itemsListDiv.classList.contains('hidden')) {
             itemsListDiv.innerHTML = '<h4 class="font-semibold mb-1 text-amber-400">Items:</h4>';
             if (order.items.length === 0) {
                 itemsListDiv.innerHTML += '<p class="text-gray-400">No item details available for this order.</p>';
             } else {
                 order.items.forEach(item => {
                     const p = document.createElement('p');
                     const itemName = item.name || 'Unknown Item';
                     const itemQuantity = item.quantity || 0;
                     const itemPrice = (typeof item.price === 'number') ? item.price.toFixed(2) : 'N/A';
                     p.textContent = `${itemQuantity} x ${itemName} @ Rs. ${itemPrice}`;
                     itemsListDiv.appendChild(p);
                 });
             }
             itemsListDiv.classList.remove('hidden');
             button.textContent = 'Hide Items';
         } else {
             itemsListDiv.classList.add('hidden');
             itemsListDiv.innerHTML = '';
             button.textContent = 'Show Items';
         }
    }


    function handleDeleteOrder(event) {
        const button = event.target;
        const orderId = button.dataset.orderId;
        if (!orderId) return;

        if (confirm(`Are you sure you want to delete Order ID: ${orderId}? This action cannot be undone.`)) {
            let orders = getOrders();
            const updatedOrders = orders.filter(order => order.orderId !== orderId);
            saveOrders(updatedOrders);
            renderOrders();
        }
    }

    function handleEditOrder(event) {
        const button = event.target;
        const orderId = button.dataset.orderId;
        if (!orderId) return;

        const confirmationMessage = `This will set the item(s) from Order ID: ${orderId} for checkout and take you to the checkout page. Your current cart contents will NOT be cleared initially. Do you want to proceed?`;

        if (confirm(confirmationMessage)) {
            const orders = getOrders();
            const orderToEdit = orders.find(o => o.orderId === orderId);

            if (!orderToEdit || !Array.isArray(orderToEdit.items) || orderToEdit.items.length === 0 || !orderToEdit.customerDetails) {
                alert('Error: Could not find complete order details or items for editing.');
                return;
            }

            // We only support editing single-item orders via this flow now
            if (orderToEdit.items.length > 1) {
                 alert('Editing orders with multiple items is not currently supported via this button. Please re-add items manually.');
                 return;
            }

            const itemToCheckout = orderToEdit.items[0]; // Get the single item

             if (!itemToCheckout || typeof itemToCheckout.id === 'undefined') {
                 alert('Error: Item data is incomplete for checkout.');
                 return;
             }

            // Temporarily store the SINGLE item for checkout.html
            sessionStorage.setItem(CHECKOUT_ITEM_KEY, JSON.stringify(itemToCheckout));

            // Temporarily store customer details for checkout page pre-filling
            localStorage.setItem(CHECKOUT_DETAILS_KEY, JSON.stringify(orderToEdit.customerDetails));

            updateCartCountIndicator(); // Update indicator based on localStorage cart (which hasn't changed yet)

            window.location.href = 'checkout.html';
        }
    }


    document.addEventListener('DOMContentLoaded', () => {
        renderOrders();
        updateCartCountIndicator();
    });

