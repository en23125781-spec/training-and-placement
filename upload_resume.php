<?php
// Database Connection
$servername = "localhost";
$username = "root";
$password = "";
$database = "placement_system";

$conn = new mysqli($servername, $username, $password, $database);
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $full_name = trim($_POST["full_name"]);
    $email = trim($_POST["email"]);
    $student_id = trim($_POST["student_id"]);

    // File Upload Handling
    $uploadDir = "uploads/";

    if (!is_dir($uploadDir)) {
        mkdir($uploadDir, 0777, true);
    }

    $originalFileName = basename($_FILES["resume"]["name"]);
    $safeFileName = preg_replace("/[^a-zA-Z0-9\.\-_]/", "", $originalFileName);
    $resumeFile = $uploadDir . $safeFileName;
    $resumeFileType = strtolower(pathinfo($resumeFile, PATHINFO_EXTENSION));
    $allowedTypes = array("pdf", "doc", "docx");

    if (!in_array($resumeFileType, $allowedTypes)) {
        header("Location: upload_resume.html?status=error&type=file");
        exit;
    }

    if (move_uploaded_file($_FILES["resume"]["tmp_name"], $resumeFile)) {
        $stmt = $conn->prepare("INSERT INTO studentsCV (full_name, email, student_id, resume) 
                                VALUES (?, ?, ?, ?)
                                ON DUPLICATE KEY UPDATE 
                                    full_name = VALUES(full_name), 
                                    email = VALUES(email), 
                                    resume = VALUES(resume)");
        $stmt->bind_param("ssss", $full_name, $email, $student_id, $resumeFile);

        if ($stmt->execute()) {
            header("Location: student_dashboard.html?status=success");
            exit;
        } else {
            header("Location: student_dashboard.html?status=error&type=db");
            exit;
        }

        $stmt->close();
    } else {
        header("Location: student_dashboard.html?status=error&type=upload");
        exit;
    }
} else {
    header("Location: student_dashboard.html?status=error&type=method");
    exit;
}

$conn->close();
?>
