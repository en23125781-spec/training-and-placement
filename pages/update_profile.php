<?php
include 'database.php';

session_start();
$admin_id = $_SESSION['admin_id']; // Admin ID from session

$data = json_decode(file_get_contents("php://input"));

$name = $data->name;
$email = $data->email;

$sql = "UPDATE admins SET name='$name', email='$email' WHERE id='$admin_id'";

if ($conn->query($sql) === TRUE) {
    echo "Profile updated successfully!";
} else {
    echo "Error: " . $conn->error;
}

$conn->close();
?>
