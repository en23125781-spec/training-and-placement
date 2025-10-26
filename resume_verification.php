<?php
// ✅ Database connection (keep this at the top)
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "verification_db";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
?>

<!DOCTYPE html>
<html>
<head>
  <title>Resume Verification</title>
</head>
<body>
  <h2>Resume & Document Verification</h2>

  <!-- ✅ HTML Table for displaying data -->
  <table border="1">
    <thead>
      <tr>
        <th>Student Name</th>
        <th>Resume</th>
        <th>Status</th>
        <th>Action</th>
      </tr>
    </thead>
    <tbody id="documentTable">
      <!-- JS will fill rows here -->
    </tbody>
  </table>

  <!-- ✅ Link JS -->
  <script src="resume_verification.js"></script>
</body>
</html>
