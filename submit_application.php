<?php
session_start();
include 'apply_job.php'; // Database connection

// -----------------------------
// 1️⃣ Get student info from session
// -----------------------------
if (!isset($_SESSION['student_db_id'])) {
    die("Student not logged in");
}

// Use the numeric primary key for foreign keys
$student_db_id = $_SESSION['student_db_id'];
$session_student_id = $_SESSION['student_id']; // roll number, just for display if needed

// -----------------------------
// 2️⃣ Get company ID from GET
// -----------------------------
$company_id = $_GET['company_id'] ?? 0;
if ($company_id == 0) {
    $_SESSION['error'] = "❌ Invalid Company ID.";
    header("Location: student_dashboard.php");
    exit();
}

// -----------------------------
// 3️⃣ Prevent duplicate application
// -----------------------------
$check = $conn->prepare("SELECT id FROM applications WHERE student_id=? AND company_id=?");
$check->bind_param("ii", $student_db_id, $company_id);
$check->execute();
$result = $check->get_result();
if ($result->num_rows > 0) {
    $_SESSION['error'] = "⚠️ You have already applied for this company!";
    header("Location: student_dashboard.php");
    exit();
}
$check->close();

// -----------------------------
// 4️⃣ Get form data
// -----------------------------
$full_name = $_POST['name'] ?? '';
$email     = $_POST['email'] ?? '';

// -----------------------------
// 5️⃣ File uploads
// -----------------------------
function uploadFile($field, $allowed, $folder){
    if (isset($_FILES[$field]) && $_FILES[$field]['error'] == 0) {
        if (!is_dir($folder)) mkdir($folder, 0777, true);
        $ext = strtolower(pathinfo($_FILES[$field]['name'], PATHINFO_EXTENSION));
        if (!in_array($ext, $allowed)) return null;
        $fileName = time().'_'.$field.'.'.$ext;
        $filePath = $folder.$fileName;
        if (move_uploaded_file($_FILES[$field]['tmp_name'], $filePath)) {
            return $filePath;
        }
    }
    return null;
}

$profile_pic = uploadFile("profile_pic", ["jpg","jpeg","png"], "uploads/profile_pics/");
$resume_file = uploadFile("resume", ["pdf","doc","docx"], "uploads/resume/");

// -----------------------------
// 6️⃣ Update student profile
// -----------------------------
if ($profile_pic && $resume_file) {
    $stmt = $conn->prepare("UPDATE students SET full_name=?, email=?, profile_pic=?, resume=? WHERE id=?");
    $stmt->bind_param("ssssi", $full_name, $email, $profile_pic, $resume_file, $student_db_id);
} elseif ($profile_pic) {
    $stmt = $conn->prepare("UPDATE students SET full_name=?, email=?, profile_pic=? WHERE id=?");
    $stmt->bind_param("sssi", $full_name, $email, $profile_pic, $student_db_id);
} elseif ($resume_file) {
    $stmt = $conn->prepare("UPDATE students SET full_name=?, email=?, resume=? WHERE id=?");
    $stmt->bind_param("sssi", $full_name, $email, $resume_file, $student_db_id);
} else {
    $stmt = $conn->prepare("UPDATE students SET full_name=?, email=? WHERE id=?");
    $stmt->bind_param("ssi", $full_name, $email, $student_db_id);
}
$stmt->execute();
$stmt->close();

// -----------------------------
// 7️⃣ Insert application
// -----------------------------
$stmt2 = $conn->prepare("INSERT INTO applications (student_id, company_id, status) VALUES (?, ?, 'Applied')");
$stmt2->bind_param("ii", $student_db_id, $company_id);
$stmt2->execute();
$stmt2->close();

// -----------------------------
// 8️⃣ Done
// -----------------------------
$conn->close();

$_SESSION['success'] = "✅ Profile updated and application submitted successfully!";
header("Location: student_dashboard.php");
exit();
?>
