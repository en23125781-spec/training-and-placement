<?php
session_start();

// ✅ check if student is logged in (use both)
if (!isset($_SESSION['student_id']) || !isset($_SESSION['student_db_id'])) {
    header("Location: home.php"); // redirect to your actual login page
    exit();
}

// ✅ For debugging only – remove later
// echo "<pre>"; print_r($_SESSION); echo "</pre>";
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Student Dashboard | Training & Placement</title>
    <link rel="stylesheet" href="index.css">
</head>
<body>
    <!-- Navigation Bar -->
    <nav>
        <div class="logo">Training & Placement Cell</div>
        <ul>
            <li><a href="student_dashboard.php">Home</a></li>
            <li><a href="profile.php">Profile</a></li> <!-- ✅ profile link -->
            <li><a href="logout.php">Logout</a></li>   <!-- ✅ logout -->
        </ul>
    </nav>

    <!-- Hero Section -->
    <section class="hero">
        <div class="hero-content">
            <h1>
                Welcome, 
                <?php 
                    echo isset($_SESSION['full_name']) ? $_SESSION['full_name'] : $_SESSION['student_id']; 
                ?> 🎓
            </h1>
            <p>Your gateway to career opportunities and professional success.</p>
        </div>
    </section>

    <!-- About Section -->
    <section id="about">
        <h2>About Us</h2>
        <p>The Training & Placement Management System helps students get job opportunities, manage training sessions, and connect with top recruiters.</p>
    </section>

    <!-- Contact Section -->
    <section id="contact">
        <h2>Contact Us</h2>
        <p>Email: support@tpcell.com | Phone: +91 8329996462</p>
    </section>
</body>
</html>
