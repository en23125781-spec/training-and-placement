<?php
include 'database.php';

$docType = $_POST['docType'];
$fileName = $_FILES['fileUpload']['name'];
$fileTmpName = $_FILES['fileUpload']['tmp_name'];
$uploadDir = "uploads/";
$filePath = $uploadDir . basename($fileName);

if (move_uploaded_file($fileTmpName, $filePath)) {
    $sql = "INSERT INTO documents (docType, filePath, status) VALUES ('$docType', '$filePath', 'Pending')";
    if ($conn->query($sql) === TRUE) {
        echo "File uploaded successfully!";
    } else {
        echo "Error: " . $conn->error;
    }
} else {
    echo "File upload failed!";
}

$conn->close();
?>
