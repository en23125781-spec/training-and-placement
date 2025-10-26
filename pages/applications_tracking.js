// Get admin authentication (assuming admin is logged in)
const admin = JSON.parse(localStorage.getItem("admin"));
if (!admin) {
    window.location.href = "../admin_login.html";
}

document.addEventListener("DOMContentLoaded", function() {
    fetchApplications(); // Load applications when the page loads

    // Add application event listener
    document.getElementById("addApplicationForm").addEventListener("submit", function(event) {
        event.preventDefault();
        addApplication();
    });
});

// Function to fetch applications from the database
function fetchApplications() {
    fetch("http://localhost:5000/admin/job-applications")
        .then(response => response.json())
        .then(data => {
            displayApplications(data);
        })
        .catch(error => {
            console.error("Error fetching applications:", error);
            document.getElementById("applicationTable").innerHTML = "<tr><td colspan='5' style='text-align: center; color: red;'>Error loading applications.</td></tr>";
        });
}

// Function to display applications in table
function displayApplications(applications) {
    let applicationTable = document.getElementById("applicationTable");
    applicationTable.innerHTML = ""; // Clear table

    if (applications.length === 0) {
        applicationTable.innerHTML = "<tr><td colspan='5' style='text-align: center; padding: 20px;'>No applications found.</td></tr>";
        return;
    }

    applications.forEach(app => {
        let statusColor = "#6c757d";
        switch(app.status) {
            case 'Applied': statusColor = '#ffc107'; break;
            case 'In Review': statusColor = '#17a2b8'; break;
            case 'Interview Scheduled': statusColor = '#fd7e14'; break;
            case 'Selected': statusColor = '#28a745'; break;
            case 'Rejected': statusColor = '#dc3545'; break;
        }

        let row = `
            <tr>
                <td style="border: 1px solid #ddd; padding: 10px;">${app.companyName || app.company}</td>
                <td style="border: 1px solid #ddd; padding: 10px;">${app.jobTitle || app.position}</td>
                <td style="border: 1px solid #ddd; padding: 10px;"><span style="color: ${statusColor}; font-weight: bold;">${app.status}</span></td>
                <td style="border: 1px solid #ddd; padding: 10px;">${new Date(app.applicationDate || app.submittedAt).toLocaleDateString()}</td>
                <td style="border: 1px solid #ddd; padding: 10px;">
                    <select onchange="updateApplicationStatus('${app._id}', this.value)" style="padding: 5px; border-radius: 4px; border: 1px solid #ccc;">
                        <option value="Applied" ${app.status === 'Applied' ? 'selected' : ''}>Applied</option>
                        <option value="In Review" ${app.status === 'In Review' ? 'selected' : ''}>In Review</option>
                        <option value="Interview Scheduled" ${app.status === 'Interview Scheduled' ? 'selected' : ''}>Interview Scheduled</option>
                        <option value="Selected" ${app.status === 'Selected' ? 'selected' : ''}>Selected</option>
                        <option value="Rejected" ${app.status === 'Rejected' ? 'selected' : ''}>Rejected</option>
                    </select>
                </td>
            </tr>`;
        applicationTable.innerHTML += row;
    });
}

// Function to open add application form
function openForm() {
    document.getElementById("applicationForm").style.display = "block";
}

// Function to close add application form
function closeForm() {
    document.getElementById("applicationForm").style.display = "none";
}

// Function to add a new application
function addApplication() {
    let company = document.getElementById("company").value;
    let position = document.getElementById("position").value;
    let status = document.getElementById("status").value;
    let dateApplied = document.getElementById("dateApplied").value;

    // For now, we'll add it to the JobApplication collection
    // In a real scenario, you might want to create a separate admin application endpoint
    fetch("http://localhost:5000/admin/job-applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            studentEmail: "admin@system.com", // Placeholder email
            companyName: company,
            jobTitle: position,
            status: status,
            applicationDate: new Date(dateApplied)
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert("✅ Application added successfully!");
            fetchApplications(); // Refresh applications list
            closeForm();
            document.getElementById("addApplicationForm").reset();
        } else {
            alert("❌ " + data.message);
        }
    })
    .catch(error => {
        console.error("Error adding application:", error);
        alert("❌ Failed to add application. Please try again.");
    });
}

// Function to update application status
function updateApplicationStatus(applicationId, newStatus) {
    fetch(`http://localhost:5000/admin/job-applications/${applicationId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert("✅ Application status updated successfully!");
            fetchApplications(); // Refresh applications list
        } else {
            alert("❌ " + data.message);
        }
    })
    .catch(error => {
        console.error("Error updating application status:", error);
        alert("❌ Failed to update application status. Please try again.");
    });
}
