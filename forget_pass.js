document.getElementById("forgotPasswordForm").addEventListener("submit", function(event) {
    event.preventDefault();
    
    const email = document.getElementById("email").value;
    
    if (email === "") {
        alert("Please enter your registered email.");
        return;
    }

    // Simulating backend process (Replace with actual backend request)
    setTimeout(() => {
        alert("A password reset link has been sent to your email.");
        document.getElementById("forgotPasswordForm").reset();
    }, 1500);
});
