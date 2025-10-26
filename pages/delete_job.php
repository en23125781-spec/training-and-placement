<?php
include "db_connect.php";

$id = $_GET['id'];
$sql = "DELETE FROM job_listings WHERE id = $id";
$conn->query($sql);

$conn->close();
?>
