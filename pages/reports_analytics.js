// Get admin authentication (assuming admin is logged in)
const admin = JSON.parse(localStorage.getItem("admin"));
if (!admin) {
    window.location.href = "../admin_login.html";
}

function loadReports() {
    let dateFrom = document.getElementById("dateFrom").value;
    let dateTo = document.getElementById("dateTo").value;

    // For now, we'll fetch general stats without date filtering
    // In a real system, you'd implement date filtering in the backend
    fetch("http://localhost:5000/admin/stats")
        .then(response => response.json())
        .then(data => {
            updateStats(data);
            renderChart(data);
        })
        .catch(error => {
            console.error("Error loading reports:", error);
            document.getElementById("totalApplications").innerText = "Error";
            document.getElementById("verifiedDocs").innerText = "Error";
            document.getElementById("pendingReviews").innerText = "Error";
            document.getElementById("placements").innerText = "Error";
        });
}

function updateStats(data) {
    document.getElementById("totalApplications").innerText = data.totalApplications || 0;
    document.getElementById("verifiedDocs").innerText = data.totalStudents || 0; // Using students as verified docs proxy
    document.getElementById("pendingReviews").innerText = data.totalApplications || 0; // Using applications as pending reviews proxy
    document.getElementById("placements").innerText = data.totalJobApplications || 0;
}

function renderChart(data) {
    let ctx = document.getElementById('analyticsChart').getContext('2d');

    // Destroy existing chart if it exists
    if (window.analyticsChart) {
        window.analyticsChart.destroy();
    }

    window.analyticsChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Total Students', 'Total Jobs', 'Applications', 'Job Applications'],
            datasets: [{
                label: 'System Statistics',
                data: [
                    data.totalStudents || 0,
                    data.totalJobs || 0,
                    data.totalApplications || 0,
                    data.totalJobApplications || 0
                ],
                backgroundColor: ['#6a0dad', '#4CAF50', '#FF9800', '#2196F3'],
                borderColor: ['#5a0a8a', '#388E3C', '#F57C00', '#1976D2'],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        precision: 0
                    }
                }
            },
            plugins: {
                legend: {
                    display: true,
                    position: 'top'
                },
                title: {
                    display: true,
                    text: 'Placement Management System Analytics',
                    font: {
                        size: 16
                    }
                }
            }
        }
    });
}

// Load reports on page load
document.addEventListener("DOMContentLoaded", loadReports);
