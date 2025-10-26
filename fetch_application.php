<?php
include 'database.php';

$result = $conn->query("SELECT * FROM applications");

$apps = [];
while ($row = $result->fetch_assoc()) {
    $apps[] = $row;
}

echo json_encode($apps);
$conn->close();
?>
