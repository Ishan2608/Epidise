document.addEventListener("DOMContentLoaded", function () {

  /*
  --------------------------------------
  NAVIGATION HAMBURGER BUTTON
  --------------------------------------
  */

  const hamburger = document.getElementById("hamburger");
  const bodyOverlay = document.getElementById("body-overlay");
  const mobileNav = document.getElementById("mobile-nav");
  const closeBtn = document.getElementById("close-btn");

  // Mobile Navigation Toggle
  if (hamburger && mobileNav && bodyOverlay && closeBtn) {
    hamburger.addEventListener("click", function () {
      mobileNav.classList.add("active");
      bodyOverlay.classList.add("active");
    });

    closeBtn.addEventListener("click", function () {
      mobileNav.classList.remove("active");
      bodyOverlay.classList.remove("active");
    });

    bodyOverlay.addEventListener("click", function () {
      mobileNav.classList.remove("active");
      bodyOverlay.classList.remove("active");
    });
  }

  /*
  --------------------------------------
  DOWNLOAD BUTTONS
  --------------------------------------
  */

  // Select all download buttons
  const downloadButtons = document.querySelectorAll('img.d-btn');
  // Select the modal and overlay elements
  const modal = document.querySelector('.modal');
  const overlay = document.querySelector('.overlay');

  // Add event listeners to each button
  downloadButtons.forEach(button => {
    button.addEventListener('click', function () {
      // Show the modal and overlay
      modal.style.display = 'block';
      overlay.style.display = 'block';

      // Disable scrolling
      document.body.style.overflow = 'hidden';
    });
  });

  // Add event listener to the overlay to close the modal
  overlay.addEventListener('click', function () {
    modal.style.display = 'none';
    overlay.style.display = 'none';

    // Enable scrolling
    document.body.style.overflow = 'auto';
  });

  // Add event listener to the modal's close button (if you have one)
  const closeModalButton = document.querySelector('.close-modal');
  if (closeModalButton) {
    closeModalButton.addEventListener('click', function () {
      modal.style.display = 'none';
      overlay.style.display = 'none';
      document.body.style.overflow = 'auto';
    });
  }

  /*
  --------------------------------------
  PROCESS COLLAPSING AND EXPANDING CARDS
  --------------------------------------
  */

  /*
  --------------------------------------
  TOGGLE BETWEEN FEATURE SETS
  --------------------------------------
  */

  const t1Button = document.getElementById("t1");
  const t2Button = document.getElementById("t2");
  const featuresT1 = document.querySelector("#app-features-t1");
  const featuresT2 = document.querySelector("#app-features-t2");

  if (t1Button && t2Button && featuresT1 && featuresT2) {
    t1Button.addEventListener("click", function () {
      featuresT1.classList.remove("hidden");
      featuresT2.classList.add("hidden");
      t1Button.classList.add("active-toggle");
      t2Button.classList.remove("active-toggle");
    });

    t2Button.addEventListener("click", function () {
      featuresT1.classList.add("hidden");
      featuresT2.classList.remove("hidden");
      t1Button.classList.remove("active-toggle");
      t2Button.classList.add("active-toggle");
    });
  }

});
