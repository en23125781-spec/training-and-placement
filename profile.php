<?php
session_start();

// Check if student is logged in
$student_id = $_SESSION['student_id'] ?? 0;
if($student_id == 0){
    die("Student not logged in");
}

// Database connection
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "placement_system";

$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Fetch student data securely
$stmt = $conn->prepare("SELECT full_name, profile_pic FROM students WHERE student_id=?");
$stmt->bind_param("i", $student_id);
$stmt->execute();
$result = $stmt->get_result();
$student = $result->fetch_assoc();
$stmt->close();
$conn->close();

// If student not found
if(!$student){
    die("Student not found");
}

// Set default image if profile_pic is null or empty
$profile_img = !empty($student['profile_pic']) ? $student['profile_pic'] : 'default.png';
?>

<div class="profile-card">
    <div class="profile-header">
        <img src="uploads/profile_pics/<?php echo htmlspecialchars($profile_img); ?>" 
             alt="Profile Image" class="profile-img">
    </div>
    <div class="profile-body">
        <h2><?php echo htmlspecialchars($student['full_name']); ?></h2>
        <p><i class="fas fa-id-card"></i> Student ID: <?php echo htmlspecialchars($student_id); ?></p>
    </div>
</div>

<!-- FontAwesome for icons -->
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">

<style>
    .profile-card {
        max-width: 350px;
        margin: 40px auto;
        background: #fff;
        border-radius: 15px;
        overflow: hidden;
        box-shadow: 0 8px 25px rgba(0,0,0,0.15);
        text-align: center;
        transition: transform 0.3s ease, box-shadow 0.3s ease;
    }

    .profile-card:hover {
        transform: translateY(-8px);
        box-shadow: 0 12px 30px rgba(0,0,0,0.25);
    }

    .profile-header {
        background: linear-gradient(135deg, #4CAF50, #2e7d32);
        padding: 30px 0;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .profile-img {
        width: 160px;
        height: 160px;
        object-fit: cover;
        border-radius: 12px;
        border: 4px solid #fff;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
    }

    .profile-body {
        padding: 20px;
    }

    .profile-body h2 {
        font-size: 24px;
        font-weight: 700;
        margin-bottom: 10px;
        color: #333;
    }

    .profile-body p {
        font-size: 15px;
        color: #555;
        margin: 6px 0;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
    }

    .profile-body i {
        color: #4CAF50;
    }
</style>
