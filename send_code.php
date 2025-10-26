<?php
include 'forget_pass.php';

$data = json_decode(file_get_contents("php://input"), true);
$email = $data['email'];

$code = rand(100000, 999999);
$sql = "INSERT INTO password_resets (email, token) VALUES ('$email', '$code') ON DUPLICATE KEY UPDATE token='$code'";
$conn->query($sql);

// Simulate sending email (Replace this with actual email logic)
echo "Verification code sent to $email";
?>
