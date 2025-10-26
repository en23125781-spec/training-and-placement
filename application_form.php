<?php
session_start();

// Set student ID for testing (replace with real login session in production)
$_SESSION['student_id'] = 1;
$student_id = $_SESSION['student_id'];
$company_id = 5; // Replace with the actual company ID dynamically if needed
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Application Form</title>
</head>
<body>
    <h1>Application Form</h1>

    <form action="submit_application.php?company_id=5" method="post" enctype="multipart/form-data">
    <label>Full Name:</label>
    <input type="text" name="name" required><br><br>

    <label>Email:</label>
    <input type="email" name="email" required><br><br>

    <label>Profile Picture:</label>
    <input type="file" name="profile_pic"><br><br>

    <input type="submit" value="Submit Application" onClick="Submit">
</form>
</body>
</html>
