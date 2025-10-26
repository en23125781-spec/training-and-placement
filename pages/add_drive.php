<?php
$conn = new mysqli("localhost", "root", "", "placement_system");

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

if (
    isset($_POST['company']) &&
    isset($_POST['date']) &&
    isset($_POST['location']) &&
    isset($_POST['status'])
) {
    $company = $_POST['company'];
    $event_date = $_POST['date'];
    $location = $_POST['location'];
    $status = $_POST['status'];

    $stmt = $conn->prepare("INSERT INTO placement_schedule (company, event_date, location, status) VALUES (?, ?, ?, ?)");
    $stmt->bind_param("ssss", $company, $event_date, $location, $status);

    if ($stmt->execute()) {
        echo "Placement drive added successfully!";
    } else {
        echo "Error: " . $stmt->error;
    }

    $stmt->close();
} else {
    echo "Missing required fields.1";
}

$conn->close();
?>
