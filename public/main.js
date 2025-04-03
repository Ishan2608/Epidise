document.addEventListener("DOMContentLoaded", function () {
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

  // Process Collapsing and Expanding Cards Cards

const cards = document.querySelectorAll('#process-sect .cards-container > div');
const firstCard = document.querySelector('#step1');
const cardsContainer = document.querySelector('#process-sect .cards-container');

// Store original background colors
const originalBackgroundColors = {};
cards.forEach(card => {
    originalBackgroundColors[card.id] = getComputedStyle(card).backgroundColor;
});

function collapseOthers() {
    cards.forEach(card => {
        if (card !== firstCard) {
            card.style.flex = '1';
            card.querySelector('p').style.display = 'none';
            card.querySelector('.pbgc').style.display = 'none';
            card.style.backgroundColor = originalBackgroundColors[card.id];
            card.style.backdropFilter = ''; // Reset backdrop filter
        }
    });
    firstCard.style.flex = '1.3';
    firstCard.querySelector('p').style.display = 'block';
    firstCard.querySelector('.pbgc').style.display = 'block';
    firstCard.style.backgroundColor = originalBackgroundColors[firstCard.id];
    firstCard.style.backdropFilter = ''; // Reset backdrop filter
}

function adjustCardStyles() {
    if (window.innerWidth > 800) {
        collapseOthers();
    } else {
        cards.forEach(card => {
            card.style.flex = ''; // Reset flex to allow media queries to apply
            card.querySelector('p').style.display = 'block'; // Show all paragraphs
            card.querySelector('.pbgc').style.display = 'block';
            card.style.backgroundColor = getGlassMorphismColor(originalBackgroundColors[card.id]);
            card.style.backdropFilter = 'blur(100px)';
        });
    }
}

function getGlassMorphismColor(originalColor) {
    const rgba = originalColor.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
    if (rgba) {
        return `rgba(${rgba[1]}, ${rgba[2]}, ${rgba[3]}, 0.2)`; // Adjust alpha as needed
    }
    return 'rgba(255, 255, 255, 0.1)'; // Default if original color is invalid
}

adjustCardStyles(); // Initial adjustment

cards.forEach(card => {
    card.addEventListener('mouseover', function () {
        if (window.innerWidth > 800) {
            cards.forEach(c => {
                c.style.flex = '1';
                c.querySelector('p').style.display = 'none';
                c.querySelector('.pbgc').style.display = 'none';
            });
            this.style.flex = '1.3';
            this.querySelector('p').style.display = 'block';
            this.querySelector('.pbgc').style.display = 'block';
            this.style.backgroundColor = getGlassMorphismColor(originalBackgroundColors[this.id]);
            this.style.backdropFilter = 'blur(100px)';
        }
    });

    card.addEventListener('mouseout', function () {
        if (window.innerWidth > 800) {
            collapseOthers();
        }
    });
});

cardsContainer.addEventListener('mouseleave', function () {
    if (window.innerWidth > 800) {
        collapseOthers();
    }
});

window.addEventListener('resize', adjustCardStyles);

  // Toggle between feature sections
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

  // Select all download buttons
  const downloadButtons = document.querySelectorAll('.d-btn');

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

});
