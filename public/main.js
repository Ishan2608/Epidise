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

  const t1Button = document.getElementById("t1");
  const t2Button = document.getElementById("t2");
  const featuresT1 = document.querySelector("#app-features-t1");
  const featuresT2 = document.querySelector("#app-features-t2");

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

});
