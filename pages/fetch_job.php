<?php
include "db_connect.php"; // Include database connection

$sql = "SELECT * FROM job_listings";
$result = $conn->query($sql);

$jobs = [];
while ($row = $result->fetch_assoc()) {
    $jobs[] = $row;
}

echo json_encode($jobs);
$conn->close();
?>
