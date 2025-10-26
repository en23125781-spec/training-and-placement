<?php
// Database connection details
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "placement_system";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Check if form is submitted
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $company_name = $conn->real_escape_string(trim($_POST['company_name']));
    $job_title = $conn->real_escape_string(trim($_POST['job_title']));
    $location = $conn->real_escape_string(trim($_POST['location']));
    $application_deadline = $conn->real_escape_string(trim($_POST['application_deadline']));

    // SQL insert query
    $sql = "INSERT INTO job_listings (company_name, job_title, location, application_deadline) 
            VALUES ('$company_name', '$job_title', '$location', '$application_deadline')";

    if ($conn->query($sql) === TRUE) {
        echo "<script>
            alert('Job added successfully!');
            window.location.href = 'manage_companies.html';
        </script>";
    } else {
        echo "Error: " . $sql . "<br>" . $conn->error;
    }
}

$conn->close();
?>
