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


const sections = document.querySelectorAll("section");
const navLinkElements = document.querySelectorAll(".nav-links a");
const navbar = document.querySelector(".navbar");
const menuBtn = document.getElementById("menuBtn");
const navLinksContainer = document.getElementById("navLinks");

window.addEventListener("scroll", () => {
  if (window.scrollY > 10) {
    navbar.classList.add("scrolled");
  } else {
    navbar.classList.remove("scrolled");
  }

  let current = "";

  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    if (window.scrollY >= sectionTop - 200) {
      current = section.getAttribute("id");
    }
  });

  navLinkElements.forEach(link => {
    link.classList.remove("active");
    if (link.getAttribute("href") === "#" + current) {
      link.classList.add("active");
    }
  });
});

menuBtn.addEventListener("click", () => {
  menuBtn.classList.toggle("active");
  navLinksContainer.classList.toggle("active");
});

navLinkElements.forEach(link => {
  link.addEventListener("click", () => {
    menuBtn.classList.remove("active");
    navLinksContainer.classList.remove("active");
  });
});