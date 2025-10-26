// Get admin authentication (assuming admin is logged in)
const admin = JSON.parse(localStorage.getItem("admin"));
if (!admin) {
    window.location.href = "../admin_login.html";
}

document.addEventListener("DOMContentLoaded", function () {
    fetchJobs(); // Load jobs when the page loads

    // Add job event listener
    document.querySelector("form").addEventListener("submit", function (e) {
        e.preventDefault();
        addJob();
    });
});

// Function to fetch jobs from the database
function fetchJobs() {
    fetch("http://localhost:5000/admin/jobs")
        .then(response => response.json())
        .then(data => {
            displayJobs(data);
        })
        .catch(error => {
            console.error("Error fetching jobs:", error);
            document.getElementById("jobTable").innerHTML = "<tr><td colspan='5' style='text-align: center; color: red;'>Error loading jobs.</td></tr>";
        });
}

// Function to display jobs in table
function displayJobs(jobs) {
    let jobTable = document.getElementById("jobTable");
    jobTable.innerHTML = ""; // Clear table

    if (jobs.length === 0) {
        jobTable.innerHTML = "<tr><td colspan='5' style='text-align: center; padding: 20px;'>No jobs available.</td></tr>";
        return;
    }

    jobs.forEach(job => {
        let row = `
            <tr>
                <td style="border: 1px solid #ddd; padding: 10px;">${job.companyName}</td>
                <td style="border: 1px solid #ddd; padding: 10px;">${job.jobTitle}</td>
                <td style="border: 1px solid #ddd; padding: 10px;">${job.location}</td>
                <td style="border: 1px solid #ddd; padding: 10px;">${new Date(job.applicationDeadline).toLocaleDateString()}</td>
                <td style="border: 1px solid #ddd; padding: 10px;">
                    <button class="edit-btn" onclick="editJob('${job._id}')" style="padding: 5px 10px; background-color: #ffc107; color: white; border: none; border-radius: 4px; cursor: pointer; margin-right: 5px;">Edit</button>
                    <button class="delete-btn" onclick="deleteJob('${job._id}')" style="padding: 5px 10px; background-color: #dc3545; color: white; border: none; border-radius: 4px; cursor: pointer;">Delete</button>
                </td>
            </tr>`;
        jobTable.innerHTML += row;
    });
}

// Function to add a job
function addJob() {
    let companyName = document.querySelector("input[name='company_name']").value;
    let jobTitle = document.querySelector("input[name='job_title']").value;
    let location = document.querySelector("input[name='location']").value;
    let applicationDeadline = document.querySelector("input[name='application_deadline']").value;

    fetch("http://localhost:5000/admin/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            companyName: companyName,
            jobTitle: jobTitle,
            location: location,
            applicationDeadline: applicationDeadline
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert("✅ Job added successfully!");
            fetchJobs(); // Refresh job list
            document.querySelector("form").reset();
        } else {
            alert("❌ " + data.message);
        }
    })
    .catch(error => {
        console.error("Error adding job:", error);
        alert("❌ Failed to add job. Please try again.");
    });
}

// Function to edit a job (placeholder for future implementation)
function editJob(jobId) {
    // For now, just show a placeholder message
    alert("Edit functionality will be implemented in the next update.");
    // TODO: Implement modal or inline editing
}

// Function to delete a job
function deleteJob(jobId) {
    if (confirm("Are you sure you want to delete this job?")) {
        fetch(`http://localhost:5000/admin/jobs/${jobId}`, {
            method: "DELETE"
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert("✅ Job deleted successfully!");
                fetchJobs(); // Refresh job list
            } else {
                alert("❌ " + data.message);
            }
        })
        .catch(error => {
            console.error("Error deleting job:", error);
            alert("❌ Failed to delete job. Please try again.");
        });
    }
}
