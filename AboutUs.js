
    document.addEventListener('DOMContentLoaded', () => {
        // --- Navigation ---
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

        // --- FAQ Accordion Logic ---
        const faqItems = document.querySelectorAll('.faq-item');

        faqItems.forEach(item => {
            const questionButton = item.querySelector('.faq-question');
            questionButton.addEventListener('click', () => {
                const wasOpen = item.classList.contains('open');

                // Close all other items
                faqItems.forEach(otherItem => {
                    otherItem.classList.remove('open');
                });
                
                // Toggle the clicked item
                if (!wasOpen) {
                    item.classList.add('open');
                }
            });
        });
    });