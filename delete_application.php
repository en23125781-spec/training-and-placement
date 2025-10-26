<?php
include 'database.php';

$id = $_GET['id'];
$sql = "DELETE FROM applications WHERE id = $id";

if ($conn->query($sql)) {
    echo "Application deleted!";
} else {
    echo "Error: " . $conn->error;
}

$conn->close();
?>
