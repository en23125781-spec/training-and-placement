<?php
session_start();

// Database connection
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "placement_system";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Get student ID from session
    $student_id = $_SESSION['student_id'] ?? 1; // change 1 for testing if session not set
    $company_id = $_GET['company_id'] ?? 0;

    if ($company_id == 0) {
        $_SESSION['error'] = "❌ Invalid Company ID.";
        header("Location: application_form.php");
        exit();
    }

    // Sanitize input
    $full_name = trim($_POST['name']);
    $dob = trim($_POST['dob']);
    $email = trim($_POST['email']);
    $phone = trim($_POST['phone']);
    $gender = trim($_POST['gender']);
    $occupation = trim($_POST['occupation']);
    $address = trim($_POST['address']);
    $ssc_school = trim($_POST['ssc-school']);
    $ssc = trim($_POST['ssc']);
    $hsc_college = trim($_POST['hsc-college']);
    $hsc = trim($_POST['hsc']);
    $degree = trim($_POST['degree']);
    $degree_percentage = trim($_POST['degree-percentage']);
    $college = trim($_POST['college']);
    $cgpa = trim($_POST['cgpa']);
    $year = trim($_POST['year']);

    // Validate email & phone
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $_SESSION['error'] = "❌ Invalid email format.";
        header("Location: application_form.php");
        exit();
    }
    if (!preg_match("/^[0-9]{10}$/", $phone)) {
        $_SESSION['error'] = "❌ Invalid phone number.";
        header("Location: application_form.php");
        exit();
    }

    // Upload function
    function uploadFile($field, $allowed_extensions, $folder) {
        if (isset($_FILES[$field]) && $_FILES[$field]['error'] == 0) {
            if (!is_dir($folder)) {
                mkdir($folder, 0755, true);
            }

            $file_ext = strtolower(pathinfo($_FILES[$field]['name'], PATHINFO_EXTENSION));
            if (!in_array($file_ext, $allowed_extensions)) {
                $_SESSION['error'] = "❌ Invalid file type for $field.";
                header("Location: application_form.php");
                exit();
            }

            $fileName = uniqid($field . "_") . "." . $file_ext;
            $filePath = $folder . $fileName;

            if (move_uploaded_file($_FILES[$field]['tmp_name'], $filePath)) {
                return $filePath;
            } else {
                $_SESSION['error'] = "❌ Failed to upload $field.";
                header("Location: application_form.php");
                exit();
            }
        }
        return null; // Optional
    }

    // Handle uploads
    $photo = uploadFile("photo", ["jpg","jpeg","png"], "uploads/photos/");
    $cv = uploadFile("cv", ["pdf","doc","docx"], "uploads/cv/");
    $internshipCert = uploadFile("internship-certificate", ["pdf","jpg","jpeg","png"], "uploads/internships/");

    1️⃣ Update student profile
    $stmt = $conn->prepare("UPDATE students SET full_name=?
        -- , dob=?, email=?, phone=?, gender=?, occupation=?, address=?, 
        -- photo=?, ssc_school=?, ssc_percentage=?, hsc_college=?, hsc_percentage=?,
        -- degree=?, degree_percentage=?, college=?, cgpa=?, year=?, cv=?, internship_certificate=? 
        WHERE student_id=?");

    $stmt->bind_param("sssssssssssssssssssi",
        $full_name, $dob, $email, $phone, $gender, $occupation, $address,
        $photo, $ssc_school, $ssc, $hsc_college, $hsc,
        $degree, $degree_percentage, $college, $cgpa, $year,
        $cv, $internshipCert, $student_id
    );

    if (!$stmt->execute()) {
        $_SESSION['error'] = "❌ Database Error (updating student): " . $stmt->error;
        header("Location: application_form.php");
        exit();
    }
    $stmt->close();

    // 2️⃣ Insert application into applications table
    $stmt2 = $conn->prepare("INSERT INTO applications (student_id, company_id, status) VALUES (?, ?, 'Applied')");
    $stmt2->bind_param("ii", $student_id, $company_id);

    if ($stmt2->execute()) {
        $_SESSION['success'] = "✅ Profile updated and application submitted successfully!";
        header("Location: student_dashboard.php"); // redirect to dashboard
        exit();
    } else {
        $_SESSION['error'] = "❌ Database Error (applications): " . $stmt2->error;
        header("Location: application_form.php");
        exit();
    }

    $stmt2->close();
    $conn->close();
}
?>
