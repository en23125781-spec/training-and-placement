<?php
include 'forget_pass.php';

$data = json_decode(file_get_contents("php://input"), true);
$email = $data['email'];
$new_password = password_hash($data['password'], PASSWORD_DEFAULT);

$sql = "UPDATE users SET password='$new_password' WHERE email='$email'";
if ($conn->query($sql)) {
    echo "Password updated successfully";
} else {
    echo "Error updating password";
}
?>
