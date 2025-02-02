document.addEventListener("DOMContentLoaded", function () {
  const hamburger = document.getElementById("hamburger");
  const bodyOverlay = document.getElementById("body-overlay");
  const mobileNav = document.getElementById("mobile-nav");
  const closeBtn = document.getElementById("close-btn");

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
});
