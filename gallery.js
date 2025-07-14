document.addEventListener('DOMContentLoaded', () => {
  // --- Get all the necessary elements from the page ---
  const galleryImages = document.querySelectorAll('.gallery-item img');
  const modal = document.getElementById('image-modal');
  const modalImage = document.getElementById('modal-image');
  const closeModalButton = document.getElementById('close-modal-button');
  const prevButton = document.getElementById('prev-button');
  const nextButton = document.getElementById('next-button');

  // Create an array of all image sources from the gallery
  const imageSources = Array.from(galleryImages).map(img => img.src);
  let currentImageIndex = 0;

  // --- Functions to control the modal ---

  function showImage(index) {
    // Set the image in the modal
    modalImage.src = imageSources[index];
    // Make the modal visible
    modal.classList.remove('hidden');
  }

  function hideModal() {
    modal.classList.add('hidden');
  }

  function showNextImage() {
    // Move to the next index, or loop back to the start if at the end
    currentImageIndex = (currentImageIndex + 1) % imageSources.length;
    showImage(currentImageIndex);
  }

  function showPrevImage() {
    // Move to the previous index, or loop to the end if at the start
    currentImageIndex = (currentImageIndex - 1 + imageSources.length) % imageSources.length;
    showImage(currentImageIndex);
  }


  // --- Event Listeners ---

  // 1. When a gallery image is clicked, open the modal
  galleryImages.forEach((img, index) => {
    img.addEventListener('click', () => {
      currentImageIndex = index;
      showImage(currentImageIndex);
    });
  });

  // 2. When the close button is clicked, hide the modal
  closeModalButton.addEventListener('click', hideModal);

  // 3. When the modal background is clicked, hide the modal
  modal.addEventListener('click', (event) => {
    // Only close if the click is on the dark background itself, not the image or buttons
    if (event.target === modal) {
      hideModal();
    }
  });

  // 4. When the next/prev buttons are clicked
  nextButton.addEventListener('click', showNextImage);
  prevButton.addEventListener('click', showPrevImage);

  // 5. Add keyboard navigation (Arrow keys and Escape)
  document.addEventListener('keydown', (event) => {
    // Do nothing if the modal is hidden
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

  // --- Mobile Menu Script (from your other page) ---
  const hamburgerButton = document.getElementById("hamburger-button");
  const mobileMenu = document.getElementById("mobile-menu");
  const menuIcon = document.getElementById("menu-icon");
  const closeIcon = document.getElementById("close-icon");

  if(hamburgerButton) {
      hamburgerButton.addEventListener("click", () => {
        mobileMenu.classList.toggle("max-h-0");
        mobileMenu.classList.toggle("opacity-0");
        mobileMenu.classList.toggle("max-h-screen");
        mobileMenu.classList.toggle("opacity-100");

        menuIcon.classList.toggle("hidden");
        closeIcon.classList.toggle("hidden");
      });
  }

  // Set current year in footer
  const yearSpan = document.getElementById("current-year");
  if(yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }
});