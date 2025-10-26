<?php
include 'database.php';

$company = $_POST['company'];
$position = $_POST['position'];
$status = $_POST['status'];
$dateApplied = $_POST['dateApplied'];
$notes = $_POST['notes'];

$sql = "INSERT INTO applications (company, position, status, date_applied, notes) 
        VALUES ('$company', '$position', '$status', '$dateApplied', '$notes')";

if ($conn->query($sql)) {
    echo "Application added successfully!";
} else {
    echo "Error: " . $conn->error;
}

$conn->close();
?>
