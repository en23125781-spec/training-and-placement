document.getElementById("loginForm").addEventListener("submit", function(event) {
    event.preventDefault();

    let username = document.getElementById("username").value.trim();
    let password = document.getElementById("password").value.trim();

    // Basic validation
    if (username === "" || password === "") {
        alert("Please fill in all fields!");
        return;
    }

    // Show loading effect on button
    let loginButton = document.querySelector("button");
    loginButton.innerText = "Logging in...";
    loginButton.style.opacity = "0.6";
    loginButton.disabled = true;

    // Simulating server request (Replace with real fetch call)

});
