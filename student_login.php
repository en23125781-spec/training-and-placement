<?php
session_start(); // Start session to store user login data

$host = "localhost";
$user = "root";
$pass = "";
$db = "placement_system";

$conn = new mysqli($host, $user, $pass, $db);

if ($conn->connect_error) {
    die("Database connection failed");
}

// Check if form is submitted
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $email = $_POST['email'] ?? '';
    $password = $_POST['password'] ?? '';

    if (empty($email) || empty($password)) {
        die("Email and Password are required");
    }

    // Fetch the hashed password from the database
    $sql = "SELECT id, student_id, full_name, password FROM students WHERE email = ?";

    $stmt = $conn->prepare($sql);
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        $row = $result->fetch_assoc();
        
        // Verify the entered password with the stored hash
        if (password_verify($password, $row['password'])) {
            // Store user details in SESSION
            $_SESSION['student_id'] = $row['student_id'];
            $_SESSION['full_name'] = $row['full_name'];

            // Redirect to dashboard
           header("Location: student_dashboard.html");
            exit(); // Stop script execution after redirection
        } else {
            echo "Invalid email or password";
        }
    } else {
        echo "Invalid email or password";
    }

    $stmt->close();
}

$conn->close();
?>
