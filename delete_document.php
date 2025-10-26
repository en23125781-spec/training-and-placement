<?php
include "db_connect.php"; // adjust filename if needed

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $student_id = $_POST['student_id'];
    $resume = $_POST['resume'];

    // delete file from uploads folder
    $filePath = "uploads/" . $resume;
    if (file_exists($filePath)) {
        unlink($filePath);
    }

    // delete from DB
    $query = "DELETE FROM studentscv WHERE student_id = '$student_id'";
    if (mysqli_query($conn, $query)) {
        echo "Resume deleted successfully!";
    } else {
        echo "Error: " . mysqli_error($conn);
    }
}
?>
