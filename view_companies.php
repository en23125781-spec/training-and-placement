<?php
include 'db.php';

$sql = "SELECT * FROM companies WHERE status = 'Upcoming'";
$result = $conn->query($sql);

$companies = [];
while ($row = $result->fetch_assoc()) {
    $companies[] = $row;
}

echo json_encode($companies);
?>
