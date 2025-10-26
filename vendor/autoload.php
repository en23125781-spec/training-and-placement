<?php
// Database connection
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "tnpcell";

$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Retrieve filter criteria
$cgpa = $_POST['cgpa'];
$department = $_POST['department'];
$min_cgpa = isset($_POST['min_cgpa']) ? (float)$_POST['min_cgpa'] : null;
$max_cgpa = isset($_POST['max_cgpa']) ? (float)$_POST['max_cgpa'] : null;

// SQL query
$sql = "SELECT * FROM applications WHERE 1";

// Filter by CGPA
if ($cgpa === '6') {
    $sql .= " AND cgpa >= 6";
} elseif ($cgpa === '8') {
    $sql .= " AND cgpa >= 8";
} elseif ($cgpa === '9') {
    $sql .= " AND cgpa >= 9";
} elseif ($cgpa === 'custom' && $min_cgpa !== null && $max_cgpa !== null) {
    $sql .= " AND cgpa BETWEEN $min_cgpa AND $max_cgpa";
}

// Filter by department
if ($department !== 'all') {
    $sql .= " AND department = '$department'";
}

// Execute query
$result = $conn->query($sql);

// Display results
if ($result->num_rows > 0) {
    echo "<h2>Filtered Students:</h2>";
    echo "<table border='1'><tr><th>Name</th><th>CGPA</th></tr>";
    while($row = $result->fetch_assoc()) {
        echo "<tr><td>" . $row["name"] . "</td><td>" . $row["cgpa"] . "</td><td>" ;
    }
    echo "</table>";
} else {
    echo "No students found matching the criteria.";
}

$conn->close();
?>
