 // Smooth scroll
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      document.querySelector(this.getAttribute("href"))
        ?.scrollIntoView({ behavior: "smooth" });
    });
  });

  document.addEventListener("DOMContentLoaded", () => {

  const backToTop = document.getElementById("backToTop");
  if (!backToTop) return;

  function isMobile() {
    return window.innerWidth <= 768;
  }

  window.addEventListener("scroll", () => {
    if (isMobile() && window.scrollY > 300) {
      backToTop.style.display = "block";
    } else {
      backToTop.style.display = "none";
    }
  });

  backToTop.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  });

});
  