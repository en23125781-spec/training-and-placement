<?php
$host = "localhost";
$user = "root";
$pass = "";
$db = "placement_system";

$conn = new mysqli($host, $user, $pass, $db);
if ($conn->connect_error) {
    die(json_encode(["success" => false, "message" => "Database connection failed"]));
}

$data = json_decode(file_get_contents("php://input"), true);
$email = $data['email'];

// Check if email exists
$checkQuery = "SELECT * FROM students WHERE email='$email'";
$result = $conn->query($checkQuery);

if ($result->num_rows > 0) {
    // Simulate sending email (Replace with actual email logic)
    echo json_encode(["success" => true, "message" => "Reset link sent!"]);
} else {
    echo json_encode(["success" => false, "message" => "Email not found!"]);
}

$conn->close();
?>
