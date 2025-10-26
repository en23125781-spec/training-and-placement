document.getElementById("updateProfileForm").addEventListener("submit", function(event) {
    event.preventDefault();
    
    let name = document.getElementById("name").value;
    let email = document.getElementById("email").value;

    fetch("update_profile.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email })
    })
    .then(response => response.text())
    .then(data => alert(data));
});

document.getElementById("changePasswordForm").addEventListener("submit", function(event) {
    event.preventDefault();

    let currentPassword = document.getElementById("currentPassword").value;
    let newPassword = document.getElementById("newPassword").value;
    let confirmPassword = document.getElementById("confirmPassword").value;

    if (newPassword !== confirmPassword) {
        alert("New passwords do not match!");
        return;
    }

    fetch("change_password.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword })
    })
    .then(response => response.text())
    .then(data => alert(data));
});
function logout() {
    fetch("logout.php")
        .then(response => response.text())  // Get the response text from logout.php
        .then(data => {
            console.log(data);  // Log the response for debugging
            alert(data);  // Show logout message
            window.location.href = "index.html";  // Redirect to login page after successful logout
        })
        .catch(error => {
            console.error("Logout error:", error);  // Log any error that occurs
            alert("There was an error logging out. Please try again.");
        });
}

