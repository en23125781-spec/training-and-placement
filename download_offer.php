<?php
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "placement_db";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$sql = "SELECT company_name, position, file_path FROM offer_letters";
$result = $conn->query($sql);

$offers = [];
while ($row = $result->fetch_assoc()) {
    $offers[] = $row;
}

echo json_encode($offers);
$conn->close();
?>
