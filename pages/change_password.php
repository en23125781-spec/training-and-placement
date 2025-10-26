<?php
include 'database.php';

session_start();
$admin_id = $_SESSION['admin_id']; // Admin ID from session

$data = json_decode(file_get_contents("php://input"));

$currentPassword = $data->currentPassword;
$newPassword = password_hash($data->newPassword, PASSWORD_DEFAULT);

// Check current password
$sql = "SELECT password FROM admins WHERE id='$admin_id'";
$result = $conn->query($sql);
$row = $result->fetch_assoc();

if (password_verify($currentPassword, $row['password'])) {
    $update_sql = "UPDATE admins SET password='$newPassword' WHERE id='$admin_id'";
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
