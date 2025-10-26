<?php
include "db_connect.php"; // adjust if your DB connection file name is different

$query = "SELECT student_id, full_name, resume, 'Pending' as status FROM studentscv";
$result = mysqli_query($conn, $query);

$documents = [];
while ($row = mysqli_fetch_assoc($result)) {
    $documents[] = $row;
}

echo json_encode($documents);
?>
