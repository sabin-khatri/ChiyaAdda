document.addEventListener('DOMContentLoaded', () => {
  const hamburgerButton = document.getElementById('hamburger-button');
  const closeMenuButton = document.getElementById('close-menu-button');
  const mobileMenu = document.getElementById('mobile-menu');

  const openMenu = () => {
      if (mobileMenu && hamburgerButton) {
          mobileMenu.classList.remove('hidden');
          hamburgerButton.setAttribute('aria-expanded', 'true');
      }
  };

  const closeMenu = () => {
      if (mobileMenu && hamburgerButton) {
          mobileMenu.classList.add('hidden');
          hamburgerButton.setAttribute('aria-expanded', 'false');
      }
  };

  if (hamburgerButton && mobileMenu) {
      hamburgerButton.addEventListener('click', openMenu);
  } else {
      console.error("Hamburger button or mobile menu element not found!");
  }

  if (closeMenuButton && mobileMenu) {
      closeMenuButton.addEventListener('click', closeMenu);

      document.addEventListener('keydown', (event) => {
          if (event.key === 'Escape' && !mobileMenu.classList.contains('hidden')) {
              closeMenu();
          }
      });

  } else {
       console.error("Close menu button or mobile menu element not found!");
  }
});

