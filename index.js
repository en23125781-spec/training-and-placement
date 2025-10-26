document.addEventListener("DOMContentLoaded", function() {
    // Smooth scrolling for navigation links
    document.querySelectorAll("nav ul li a").forEach(anchor => {
        anchor.addEventListener("click", function(event) {
            if (this.getAttribute("href").startsWith("#")) {
                event.preventDefault();
                const targetSection = document.querySelector(this.getAttribute("href"));
                if (targetSection) {
                    window.scrollTo({
                        top: targetSection.offsetTop - 60,
                        behavior: "smooth"
                    });
                }
            }
        });
    });
});
