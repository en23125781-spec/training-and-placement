<?php
$servername = "localhost";
$username = "root";  // Change this if needed
$password = "";      // Change this if needed
$database = "your_database_name"; // Change to your DB name

$conn = new mysqli($servername, $username, $password, $database);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
?>
