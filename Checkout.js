// File: checkout.js

document.addEventListener('DOMContentLoaded', () => {
    const authOverlay = document.getElementById('auth-overlay');
    const mainHeader = document.getElementById('main-header');
    const mainContent = document.getElementById('main-content');
    
    // Corrected Authentication Check
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
        const cartLinkIcons = document.querySelectorAll('.cart-link');
        
        const checkoutItemsKey = 'chiyaGharCheckoutItems';
        
        const getCheckoutItems = () => JSON.parse(localStorage.getItem(checkoutItemsKey)) || [];
        const getCart = () => JSON.parse(localStorage.getItem('chiyaGharCart')) || [];
        const saveCart = (cart) => localStorage.setItem('chiyaGharCart', JSON.stringify(cart));
        
        const updateCartIcon = () => {
            const totalItems = getCart().reduce((sum, item) => sum + item.quantity, 0);
            cartLinkIcons.forEach(icon => {
                if (totalItems > 0) icon.setAttribute('data-count', totalItems);
                else icon.removeAttribute('data-count');
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