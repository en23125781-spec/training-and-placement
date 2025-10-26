<?php
include 'database.php';

session_start();
$student_id = $_SESSION['student_id']; // Student ID from session

$data = json_decode(file_get_contents("php://input"));

$name = $data->name;
$email = $data->email;

$sql = "UPDATE students SET name='$name', email='$email' WHERE id='$student_id'";

if ($conn->query($sql) === TRUE) {
    echo "Profile updated successfully!";
} else {
    echo "Error: " . $conn->error;
}

$conn->close();
?>
