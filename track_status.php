<?php
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "job_portal";  // Change this to your database name

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Fetch applications from the database
$sql = "SELECT * FROM applications ORDER BY applied_date DESC";
$result = $conn->query($sql);

$applications = [];

if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $applications[] = $row;
    }
}

$conn->close();

// Return JSON response
echo json_encode($applications);
?>
