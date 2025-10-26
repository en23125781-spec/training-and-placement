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
    fetch("logout.php").then(() => {
        alert("Logged out successfully!");
        window.location.href = "login.html";
    });
}
