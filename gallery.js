
    document.addEventListener('DOMContentLoaded', () => {
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
        function getCart() {
            const cart = localStorage.getItem(CART_KEY);
            return cart ? JSON.parse(cart) : [];
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
        
        updateCartCountIndicator();

        // --- Gallery Modal with Slider Functionality ---
        const modal = document.getElementById('image-modal');
        const modalImage = document.getElementById('modal-image');
        const closeModalButton = document.getElementById('close-modal-button');
        const prevButton = document.getElementById('prev-button');
        const nextButton = document.getElementById('next-button');

        const allImages = Array.from(document.querySelectorAll('.gallery-item img'));
        let currentIndex = 0;

        function showImage(index) {
            const image = allImages[index];
            modalImage.src = image.src;
            modalImage.alt = image.alt;
            currentIndex = index;
        }

        function openModal(index) {
            showImage(index);
            modal.classList.remove('hidden');
            document.body.style.overflow = 'hidden';
        }

        function closeModal() {
            modal.classList.add('hidden');
            document.body.style.overflow = '';
        }

        function showNextImage() {
            const nextIndex = (currentIndex + 1) % allImages.length;
            showImage(nextIndex);
        }

        function showPrevImage() {
            const prevIndex = (currentIndex - 1 + allImages.length) % allImages.length;
            showImage(prevIndex);
        }

        allImages.forEach((item, index) => {
            item.addEventListener('click', () => {
                openModal(index);
            });
        });

        closeModalButton.addEventListener('click', closeModal);
        nextButton.addEventListener('click', showNextImage);
        prevButton.addEventListener('click', showPrevImage);

        modal.addEventListener('click', (event) => {
            if (event.target === modal) {
                closeModal();
            }
        });

        document.addEventListener('keydown', (event) => {
            if (modal.classList.contains('hidden')) return; 

            if (event.key === 'Escape') {
                closeModal();
            } else if (event.key === 'ArrowRight') {
                showNextImage();
            } else if (event.key === 'ArrowLeft') {
                showPrevImage();
            }
        });
    });
  