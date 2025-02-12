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

  // Hero Section Scroll Effect
  const mockup = document.querySelector("#home-hero .mockups");
  const hero = document.getElementById("home-hero");

  if (mockup && hero) {
    window.addEventListener("scroll", (event) => {
      const scrollY = window.scrollY;
      const heroHeight = hero.offsetHeight;
      const mockupHeight = mockup.offsetHeight;

      // Calculate the maximum distance the mockup can move up
      const maxScrollDistance = heroHeight - mockupHeight - 20;

      if (scrollY > heroHeight / 3) {
        // Move mockup up at 2x the scroll speed
        mockup.style.transform = `translate(-50%, ${-scrollY * 1.25}px)`;
      } else {
        // Reset when user scrolls back up
        mockup.style.transform = `translate(-50%, 0px)`;
      }


    });
  }

  const stepperSection = document.querySelector('.stepper-section');
const steps = document.querySelectorAll('.step');
const stepNumbers = document.querySelectorAll('.step-number');
const stepCards = document.querySelectorAll('.step-card');
const dottedLine = document.querySelector('.dotted-line');

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateSteps();
        observer.unobserve(stepperSection);
      }
    });
  },
  { threshold: 0.5 }
);

observer.observe(stepperSection);

function animateSteps() {
  stepNumbers.forEach((stepNumber, index) => {
    setTimeout(() => {
      stepNumber.style.backgroundColor = '#D2DEF2';
      stepNumber.style.boxShadow = '0 0 10px #D2DEF2';
    }, index * 500);
  });

  stepCards.forEach((stepCard, index) => {
    setTimeout(() => {
      stepCard.style.opacity = '1';
      stepCard.style.transform = 'translateY(0)';
    }, index * 500);
  });

  // Animate dotted line (improved)
  if (window.innerWidth > 768) { // Horizontal line
    dottedLine.style.width = 'calc(100% - 100px)'; // Adjust width as needed
  } else { // Vertical line
    dottedLine.style.height = 'calc(100% - 70px)'; // Adjust height as needed
    dottedLine.style.width = '2px'; // Ensure width is set for vertical line
  }
  dottedLine.classList.add('animate'); // Trigger CSS transition
}


});
