<?php
$conn = new mysqli("localhost", "root", "", "placement_system");

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$sql = "SELECT * FROM placement_schedule ORDER BY event_date DESC";
$result = $conn->query($sql);

$drives = [];

while ($row = $result->fetch_assoc()) {
    $drives[] = $row;
}

header('Content-Type: application/json');
echo json_encode($drives);

$conn->close();
?>
