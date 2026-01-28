const revealElements = document.querySelectorAll(
    ".services, .values, .portfolio-item"
);

// EmailJS init
alert("script.js loaded");

(function () {
  emailjs.init("I6NisfSnEgvDMw5K5"); // your PUBLIC KEY
})();

document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("contact-form");

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const message = document.getElementById("message").value.trim();

    if (!name || !email || !message) {
      alert("Please fill all fields");
      return;
    }

    emailjs
      .send("service_h6c8qgj", "template_mn02898", {
        name: name,
        email: email,
        message: message,
      })
      .then(
        function () {
          alert("✅ Message sent successfully!");
          form.reset();
        },
        function (error) {
          console.error("EmailJS Error:", error);
          alert("❌ Failed to send message. Check console.");
        }
      );
  });
});
