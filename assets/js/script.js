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
document.querySelector("form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const data = {
    customerName: document.querySelector("[name='customerName']").value,
    reportDate: document.querySelector("[name='reportDate']").value,
    siteLocation: document.querySelector("[name='siteLocation']").value,
    serviceType: document.querySelector("[name='serviceType']").value,
    contactPerson: document.querySelector("[name='contactPerson']").value,
    technician: document.querySelector("[name='technician']").value,

    equipment: {
      machineName: document.querySelector("[name='machineName']").value,
      makeModel: document.querySelector("[name='makeModel']").value,
      serialNumber: document.querySelector("[name='serialNumber']").value,
      plcModel: document.querySelector("[name='plcModel']").value
    }
  };

  const res = await fetch("https://portfolio-132f.onrender.com/api/reports/submit", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });

  const result = await res.json();
  alert(result.message);
});
document.querySelector("form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const data = {
    customerName: document.querySelector("input[name='customer']").value,
    siteLocation: document.querySelector("input[name='location']").value,
    technician: document.querySelector("input[name='technician']").value
  };

  const res = await fetch("https://portfolio-132f.onrender.com/api/reports", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });

  const result = await res.json();
  console.log(result);
  alert("Report saved!");
});

