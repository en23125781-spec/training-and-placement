<?php
$conn = new mysqli("localhost", "root", "", "placement_system");

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$sql = "SELECT * FROM announcements ORDER BY date DESC";
$result = $conn->query($sql);

$announcements = [];

while ($row = $result->fetch_assoc()) {
    $announcements[] = $row;
}

header('Content-Type: application/json');
echo json_encode($announcements);

$conn->close();
?>
