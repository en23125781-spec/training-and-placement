<?php
// Enable error reporting for debugging
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Database connection
$conn = new mysqli("localhost", "root", "", "placement_system");

// Check for connection errors
if ($conn->connect_error) {
    echo json_encode(['error' => 'Connection failed: ' . $conn->connect_error]);
    exit;
}

// Query to fetch announcements
$sql = "SELECT id, title, message, created_at FROM announcements ORDER BY created_at DESC";
$result = $conn->query($sql);

// Check if the query was successful
if (!$result) {
    echo json_encode(['error' => 'Query failed: ' . $conn->error]);
    exit;
}

// Fetch and store results in an array
$announcements = [];
while ($row = $result->fetch_assoc()) {
    $announcements[] = $row;
}

// Return announcements as JSON
echo json_encode($announcements);

// Close database connection
$conn->close();
?>
