document.getElementById("registerForm").addEventListener("submit", async (event) => {
    event.preventDefault();
  
    const fullName = document.getElementById("fullName").value.trim();
    const email = document.getElementById("email").value.trim();
    const studentID = document.getElementById("studentID").value.trim();
    const program = document.getElementById("program").value;
    const password = document.getElementById("password").value.trim();
    const confirmPassword = document.getElementById("confirmPassword").value.trim();
  
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
  
    try {
      const response = await fetch("http://localhost:5000/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName, email, studentID, program, password })
      });
  
      const result = await response.json();
  
      if (response.ok) {
        alert("Registration successful!");
        window.location.href = "login.html";
      } else {
        alert(result.error || "Registration failed.");
      }
    } catch (err) {
      alert("Server error");
    }
  });
  