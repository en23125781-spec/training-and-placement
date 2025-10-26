<?php
$servername = "localhost";
$username = "root";
$password = "";
$database = "placement_system";

$conn = new mysqli($servername, $username, $password, $database);
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$sql = "SELECT student_id, full_name, email, resume FROM studentsCV";
$result = $conn->query($sql);

$resumes = [];
while ($row = $result->fetch_assoc()) {
    $resumes[] = [
        "student_id" => $row["student_id"],
        "full_name" => $row["full_name"],
        "email" => $row["email"],
        "resume" => $row["resume"],
        "docType" => "Resume", // defaulting type
        "status" => "Pending"  // example status
    ];
}

header('Content-Type: application/json');
echo json_encode($resumes);

$conn->close();
?>
