document.getElementById("adminLoginForm").addEventListener("submit", function(event) {
    event.preventDefault();

    let username = document.getElementById("adminUsername").value.trim();
    let password = document.getElementById("adminPassword").value.trim();

    // Basic validation
    if (username === "" || password === "") {
        alert("Please enter both username and password!");
        return;
    }

    // Show loading effect on button
    let loginButton = document.querySelector("button");
    loginButton.innerText = "Logging in...";
    loginButton.style.opacity = "0.6";
    loginButton.disabled = true;

    // Make API call to Node.js server
    fetch("http://localhost:5000/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // Store admin session in localStorage
            localStorage.setItem("admin", JSON.stringify(data.admin));
            window.location.href = "admin_dashboard.html";  // Redirect to dashboard
        } else {
            alert("Invalid admin credentials");
            loginButton.innerText = "Login";
            loginButton.style.opacity = "1";
            loginButton.disabled = false;
        }
    })
    .catch(error => {
        console.error("Login error:", error);
        alert("Login failed. Please try again.");
        loginButton.innerText = "Login";
        loginButton.style.opacity = "1";
        loginButton.disabled = false;
    });
});
