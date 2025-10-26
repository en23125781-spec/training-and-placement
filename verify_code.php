<?php
include 'forget_pass.php';

$data = json_decode(file_get_contents("php://input"), true);
$email = $data['email'];
$code = $data['code'];

$sql = "SELECT * FROM password_resets WHERE email='$email' AND token='$code'";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
    echo "Code verified";
} else {
    echo "Invalid code";
}
?>
