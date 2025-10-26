function openForm() {
    document.getElementById("driveForm").style.display = "block";
}

function closeForm() {
    document.getElementById("driveForm").style.display = "none";
}

// Load drives on page load
document.addEventListener("DOMContentLoaded", loadDrives);

// Get admin authentication
const admin = JSON.parse(localStorage.getItem("admin"));
if (!admin) {
    window.location.href = "../admin_login.html";
}

function loadDrives() {
    fetch("http://localhost:5000/admin/placement-schedule")
        .then(response => response.json())
        .then(data => {
            let table = document.getElementById("scheduleTable");
            table.innerHTML = "";

            if (data.length === 0) {
                table.innerHTML = "<tr><td colspan='5' style='text-align: center; padding: 20px;'>No placement drives scheduled.</td></tr>";
                return;
            }

            data.forEach(drive => {
                let statusColor = drive.status === 'Upcoming' ? '#ffc107' : drive.status === 'Completed' ? '#28a745' : '#6c757d';
                table.innerHTML += `
                    <tr>
                        <td style="border: 1px solid #ddd; padding: 10px;">${drive.company}</td>
                        <td style="border: 1px solid #ddd; padding: 10px;">${new Date(drive.eventDate).toLocaleDateString()}</td>
                        <td style="border: 1px solid #ddd; padding: 10px;">${drive.location}</td>
                        <td style="border: 1px solid #ddd; padding: 10px;"><span style="color: ${statusColor}; font-weight: bold;">${drive.status}</span></td>
                        <td style="border: 1px solid #ddd; padding: 10px; text-align: center;">
                            <button onclick="deleteDrive('${drive._id}')" style="padding: 5px 10px; background-color: #dc3545; color: white; border: none; border-radius: 4px; cursor: pointer; margin-right: 5px;">Delete</button>
                        </td>
                    </tr>
                `;
            });
        })
        .catch(error => {
            console.error("Error loading drives:", error);
            document.getElementById("scheduleTable").innerHTML = "<tr><td colspan='5' style='text-align: center; color: red; padding: 20px;'>Error loading placement drives.</td></tr>";
        });
}

// Submit form with AJAX
document.getElementById("addDriveForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const company = document.getElementById("company").value;
    const eventDate = document.getElementById("eventDate").value;
    const location = document.getElementById("location").value;
    const status = document.getElementById("status").value;

    fetch("http://localhost:5000/admin/placement-schedule", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            company: company,
            eventDate: eventDate,
            location: location,
            status: status
        })
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            alert("✅ Placement drive added successfully!");
            loadDrives();
            closeForm();
            this.reset();
        } else {
            alert("❌ " + data.message);
        }
    })
    .catch(error => {
        console.error("Error adding drive:", error);
        alert("❌ Failed to add placement drive. Please try again.");
    });
});

// Delete function
function deleteDrive(id) {
    if (confirm("Are you sure you want to delete this placement drive?")) {
        fetch(`http://localhost:5000/admin/placement-schedule/${id}`, {
            method: "DELETE"
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                alert("✅ Placement drive deleted successfully!");
                loadDrives();
            } else {
                alert("❌ " + data.message);
            }
        })
        .catch(error => {
            console.error("Error deleting drive:", error);
            alert("❌ Failed to delete placement drive. Please try again.");
        });
    }
}

