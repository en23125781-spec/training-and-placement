document.getElementById("loginForm").addEventListener("submit", async (event) => {
    event.preventDefault();
  
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
  
    try {
      const response = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
  
      const result = await response.json();
  
      if (response.ok) {
        localStorage.setItem("student", JSON.stringify(result.user));
        window.location.href = "student_dashboard.html";
      } else {
        alert(result.error || "Invalid credentials");
      }
    } catch (err) {
      alert("Server error");
    }
  });
  