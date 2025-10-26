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
$fullName = $data['fullName'];
$email = $data['email'];
$studentID = $data['studentID'];
$password = password_hash($data['password'], PASSWORD_BCRYPT);

$query = "INSERT INTO students (full_name, email, student_id, password) VALUES ('$fullName', '$email', '$studentID', '$password')";
if ($conn->query($query)) {
    echo json_encode(["success" => true, "message" => "Registration Successful!"]);
} else {
    echo json_encode(["success" => false, "message" => "Error: " . $conn->error]);
}

$conn->close();
?>
