<?php
// Database configuration
$host = "localhost";            // Usually "localhost"
$username = "root";             // Your MySQL username
$password = "";                 // Your MySQL password (default is empty in XAMPP)
$database = "placement_system"; // 🔁 Replace with your actual database name

// Create connection
$conn = new mysqli($host, $username, $password, $database);

// Check connection
if ($conn->connect_error) {
    // If there's a connection error, respond with a 500 error and JSON
    http_response_code(500);
    die(json_encode([
        "error" => "Database connection failed: " . $conn->connect_error
    ]));
}
?>
