window.addEventListener('load', () => {
  const loaderWrapper = document.getElementById('loader-wrapper');
  const floatingContact = document.getElementById('floatingContact');
  
  if (loaderWrapper) {
    setTimeout(() => {
      loaderWrapper.classList.add('hidden');
      if (floatingContact) floatingContact.classList.add('show');
    }, 3500); // 1.5 second artificial delay for the animation to show (user wanted loading page like this)
  } else {
    if (floatingContact) floatingContact.classList.add('show');
  }
});

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

  window.addEventListener("scroll", () => {
    if (window.scrollY > 300) {
      backToTop.classList.add("show");
    } else {
      backToTop.classList.remove("show");
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

document.addEventListener("click", (e) => {
  if (!menuBtn.contains(e.target) && !navLinksContainer.contains(e.target)) {
    navLinksContainer.classList.remove("active");
    menuBtn.classList.remove("active");
  }
});


// FAQ Accordion Interaction
document.querySelectorAll('.faq-question').forEach(button => {
  button.addEventListener('click', () => {
    const faqItem = button.parentElement;
    
    // Optional: Close other open items
    document.querySelectorAll('.faq-item').forEach(item => {
      if (item !== faqItem) {
        item.classList.remove('active');
      }
    });
    
    // Toggle current item
    faqItem.classList.toggle('active');
  });
});
