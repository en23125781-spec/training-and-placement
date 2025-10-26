<?php
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "placement_db";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$sql = "SELECT * FROM placement_schedule ORDER BY date DESC";
$result = $conn->query($sql);

$schedules = array();

while ($row = $result->fetch_assoc()) {
    $schedules[] = $row;
}

echo json_encode($schedules);

$conn->close();
?>
