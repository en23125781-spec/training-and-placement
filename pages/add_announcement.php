<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

$conn = new mysqli("localhost", "root", "", "placement_system");

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$title = $_POST['title'] ?? '';
$message = $_POST['message'] ?? '';

if (empty($title) || empty($message)) {
    die("Title and message are required.");
}

$sql = "INSERT INTO announcements (title, message) VALUES (?, ?)";
$stmt = $conn->prepare($sql);

if (!$stmt) {
    die("Prepare failed: " . $conn->error);
}

$stmt->bind_param("ss", $title, $message);

if ($stmt->execute()) {
    echo "Announcement added successfully.";
} else {
    echo "Error adding announcement: " . $stmt->error;
}

$stmt->close();
$conn->close();
?>
