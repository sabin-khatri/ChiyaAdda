    const hamburgerButton = document.getElementById('hamburger-button');
    const closeMenuButton = document.getElementById('close-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');

    hamburgerButton.addEventListener('click', () => {
      mobileMenu.classList.remove('hidden');
    });

    closeMenuButton.addEventListener('click', () => {
      mobileMenu.classList.add('hidden');
    });

    contactForm.addEventListener('submit', (event) => {
      event.preventDefault();

      formStatus.textContent = 'Sending...';
      formStatus.classList.remove('text-red-600', 'text-green-600');
      formStatus.classList.add('text-gray-600');

      const nameInput = document.getElementById('name');
      const emailInput = document.getElementById('email');
      const subjectInput = document.getElementById('subject');
      const messageInput = document.getElementById('message');

      if (
        !nameInput.value.trim() ||
        !emailInput.value.trim() ||
        !subjectInput.value.trim() ||
        !messageInput.value.trim()
      ) {
        formStatus.textContent = 'Please fill out all fields.';
        formStatus.classList.remove('text-gray-600', 'text-green-600');
        formStatus.classList.add('text-red-600');
        return;
      }

      setTimeout(() => {
        formStatus.textContent = 'Message sent successfully! We will get back to you soon.';
        formStatus.classList.remove('text-gray-600', 'text-red-600');
        formStatus.classList.add('text-green-600', 'font-semibold');
        contactForm.reset();

        setTimeout(() => {
          formStatus.textContent = '';
          formStatus.classList.remove('text-green-600', 'font-semibold');
        }, 5000);
      }, 1000);
    });