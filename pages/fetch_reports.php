<?php
include 'database.php';

$dateFrom = isset($_GET['dateFrom']) ? $_GET['dateFrom'] : '2000-01-01';
$dateTo = isset($_GET['dateTo']) ? $_GET['dateTo'] : date('Y-m-d');

$sqlApplications = "SELECT COUNT(*) AS count FROM applications WHERE date_applied BETWEEN '$dateFrom' AND '$dateTo'";
$sqlVerifiedDocs = "SELECT COUNT(*) AS count FROM documents WHERE status='Verified' AND uploaded_at BETWEEN '$dateFrom' AND '$dateTo'";
$sqlPendingReviews = "SELECT COUNT(*) AS count FROM documents WHERE status='Pending' AND uploaded_at BETWEEN '$dateFrom' AND '$dateTo'";
$sqlPlacements = "SELECT COUNT(*) AS count FROM placements WHERE placement_date BETWEEN '$dateFrom' AND '$dateTo'";

$totalApplications = $conn->query($sqlApplications)->fetch_assoc()['count'];
$verifiedDocs = $conn->query($sqlVerifiedDocs)->fetch_assoc()['count'];
$pendingReviews = $conn->query($sqlPendingReviews)->fetch_assoc()['count'];
$placements = $conn->query($sqlPlacements)->fetch_assoc()['count'];

$response = [
    "totalApplications" => $totalApplications,
    "verifiedDocs" => $verifiedDocs,
    "pendingReviews" => $pendingReviews,
    "placements" => $placements
];

echo json_encode($response);
?>
