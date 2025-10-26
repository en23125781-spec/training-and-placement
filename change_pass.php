<?php
include 'database.php';

session_start();
$student_id = $_SESSION['student_id']; // Student ID from session

$data = json_decode(file_get_contents("php://input"));

$currentPassword = $data->currentPassword;
$newPassword = password_hash($data->newPassword, PASSWORD_DEFAULT);

// Check current password
$sql = "SELECT password FROM students WHERE id='$student_id'";
$result = $conn->query($sql);
$row = $result->fetch_assoc();

if (password_verify($currentPassword, $row['password'])) {
    $update_sql = "UPDATE students SET password='$newPassword' WHERE id='$student_id'";
    if ($conn->query($update_sql) === TRUE) {
        echo "Password changed successfully!";
    } else {
        echo "Error: " . $conn->error;
    }
} else {
    echo "Incorrect current password!";
}

$conn->close();
?>
