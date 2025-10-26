<?php
include 'db_connect.php';

$section_id = $_GET['section_id'];

$query = "SELECT section_name, content FROM dashboard_sections WHERE id = $section_id";
$result = $conn->query($query);

if ($result->num_rows > 0) {
    echo json_encode($result->fetch_assoc());
} else {
    echo json_encode(["section_name" => "Not Found", "content" => "No content available."]);
}

$conn->close();
?>
