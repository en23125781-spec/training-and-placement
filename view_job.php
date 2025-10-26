<?php
$conn = new mysqli("localhost", "root", "", "job_portal");
$result = $conn->query("SELECT * FROM companies");
$jobs = [];
while ($row = $result->fetch_assoc()) {
    $jobs[] = $row;
}
echo json_encode($jobs);
$conn->close();
?>
