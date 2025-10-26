<?php
include 'database.php';

$data = json_decode(file_get_contents("php://input"));

$company = $data->company;
$position = $data->position;
$status = $data->status;
$dateApplied = $data->dateApplied;

$sql = "INSERT INTO applications (company, position, status, date_applied) VALUES ('$company', '$position', '$status', '$dateApplied')";

if ($conn->query($sql) === TRUE) {
    echo "Application added successfully!";
} else {
    echo "Error: " . $conn->error;
}

$conn->close();
?>
