// File: gallery.js

document.addEventListener('DOMContentLoaded', () => {

    // --- Mobile Menu Navigation Script ---
    const hamburgerButton = document.getElementById('hamburger-button');
    const mobileMenu = document.getElementById('mobile-menu');
    const menuIcon = document.getElementById('menu-icon');
    const closeIcon = document.getElementById('close-icon');

    if (hamburgerButton && mobileMenu && menuIcon && closeIcon) {
        hamburgerButton.addEventListener('click', () => {
            mobileMenu.classList.toggle('translate-x-full');
            menuIcon.classList.toggle('hidden');
            closeIcon.classList.toggle('hidden');
        });
    }

    // --- Gallery Modal Functionality (Your Code) ---
    const galleryImages = document.querySelectorAll('.gallery-item img');
    const modal = document.getElementById('image-modal');
    const modalImage = document.getElementById('modal-image');
    const closeModalButton = document.getElementById('close-modal-button');
    const prevButton = document.getElementById('prev-button');
    const nextButton = document.getElementById('next-button');

    // Only run gallery code if the necessary elements exist
    if (galleryImages.length > 0 && modal && modalImage) {
        const imageSources = Array.from(galleryImages).map(img => img.src);
        let currentImageIndex = 0;

        function showImage(index) {
            modalImage.src = imageSources[index];
            modal.classList.remove('hidden');
        }

        function hideModal() {
            modal.classList.add('hidden');
        }

        function showNextImage() {
            currentImageIndex = (currentImageIndex + 1) % imageSources.length;
            showImage(currentImageIndex);
        }

        function showPrevImage() {
            currentImageIndex = (currentImageIndex - 1 + imageSources.length) % imageSources.length;
            showImage(currentImageIndex);
        }

        galleryImages.forEach((img, index) => {
            img.addEventListener('click', () => {
                currentImageIndex = index;
                showImage(currentImageIndex);
            });
        });

        closeModalButton.addEventListener('click', hideModal);
        
        modal.addEventListener('click', (event) => {
            if (event.target === modal) {
                hideModal();
            }
        });

        nextButton.addEventListener('click', showNextImage);
        prevButton.addEventListener('click', showPrevImage);

        document.addEventListener('keydown', (event) => {
            if (modal.classList.contains('hidden')) {
                return;
            }
            if (event.key === 'ArrowRight') {
                showNextImage();
            } else if (event.key === 'ArrowLeft') {
                showPrevImage();
            } else if (event.key === 'Escape') {
                hideModal();
            }
        });
    }

    // --- Header Scroll Effect ---
    const header = document.getElementById('main-header');
    if (header) {
      window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
          header.classList.add('bg-[#3C2F2F]', 'shadow-lg');
        } else {
          header.classList.remove('bg-[#3C2F2F]', 'shadow-lg');
        }
      });
    }

    // --- Footer Year Update ---
    const yearSpan = document.getElementById("current-year");
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
});