<?php
require 'vendor/autoload.php';
use PhpOffice\PhpSpreadsheet\IOFactory;

$host = "localhost";
$user = "root";
$pass = "";
$dbname = "placement_portal";

$conn = new mysqli($host, $user, $pass, $dbname);

if (isset($_FILES['excelFile']['tmp_name'])) {
    $file = $_FILES['excelFile']['tmp_name'];
    $spreadsheet = IOFactory::load($file);
    $data = $spreadsheet->getActiveSheet()->toArray();

    echo "<h2>Eligible Students (CGPA >= 7.0)</h2>";
    echo "<table border='1' cellpadding='10'>
            <tr><th>Name</th><th>Department</th><th>CGPA</th></tr>";

    foreach ($data as $index => $row) {
        if ($index === 0) continue; // Skip header row
        list($name, $dept, $cgpa) = $row;

        if ($cgpa >= 7.0) {
            echo "<tr><td>$name</td><td>$dept</td><td>$cgpa</td></tr>";
            $stmt = $conn->prepare("INSERT INTO eligible_students (name, department, cgpa) VALUES (?, ?, ?)");
            $stmt->bind_param("ssd", $name, $dept, $cgpa);
            $stmt->execute();
        }
    }
    echo "</table>";
}
?>
