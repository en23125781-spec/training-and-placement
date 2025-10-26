// Get admin authentication (assuming admin is logged in)
const admin = JSON.parse(localStorage.getItem("admin"));
if (!admin) {
    window.location.href = "../admin_login.html";
}

document.addEventListener("DOMContentLoaded", () => {
    loadAnnouncements();

    document.getElementById("addAnnouncementForm").addEventListener("submit", function (e) {
        e.preventDefault();
        addAnnouncement();
    });
});

function loadAnnouncements() {
    fetch("http://localhost:5000/announcements")
        .then(res => res.json())
        .then(data => {
            displayAnnouncements(data);
        })
        .catch(error => {
            console.error("Error loading announcements:", error);
            document.getElementById("adminTable").innerHTML = "<p style='color: red; text-align: center;'>Error loading announcements.</p>";
        });
}

function displayAnnouncements(announcements) {
    const container = document.getElementById("adminTable");
    container.innerHTML = "";

    if (announcements.length === 0) {
        container.innerHTML = "<p style='text-align: center; padding: 20px;'>No announcements found.</p>";
        return;
    }

    let content = `
        <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
            <thead>
                <tr style="background-color: #f2f2f2;">
                    <th style="border: 1px solid #ccc; padding: 10px;">Title</th>
                    <th style="border: 1px solid #ccc; padding: 10px;">Message</th>
                    <th style="border: 1px solid #ccc; padding: 10px;">Date</th>
                    <th style="border: 1px solid #ccc; padding: 10px;">Actions</th>
                </tr>
            </thead>
            <tbody>
    `;

    announcements.forEach(announcement => {
        content += `
            <tr>
                <td style="border: 1px solid #ccc; padding: 10px;">${announcement.title}</td>
                <td style="border: 1px solid #ccc; padding: 10px;">${announcement.message}</td>
                <td style="border: 1px solid #ccc; padding: 10px;">${new Date(announcement.date).toLocaleDateString()}</td>
                <td style="border: 1px solid #ccc; padding: 10px; text-align: center;">
                    <button onclick="deleteAnnouncement('${announcement._id}')" style="padding: 5px 10px; background-color: #dc3545; color: white; border: none; border-radius: 4px; cursor: pointer;">Delete</button>
                </td>
            </tr>
        `;
    });

    content += `
            </tbody>
        </table>
    `;

    container.innerHTML = content;
}

function addAnnouncement() {
    const title = document.getElementById("title").value;
    const message = document.getElementById("message").value;

    fetch("http://localhost:5000/admin/announcements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, message })
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            alert("✅ Announcement added successfully!");
            closeForm();
            loadAnnouncements();
        } else {
            alert("❌ " + data.message);
        }
    })
    .catch(error => {
        console.error("Error adding announcement:", error);
        alert("❌ Failed to add announcement. Please try again.");
    });
}

function deleteAnnouncement(id) {
    if (confirm("Are you sure you want to delete this announcement?")) {
        fetch(`http://localhost:5000/admin/announcements/${id}`, {
            method: "DELETE"
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                alert("✅ Announcement deleted successfully!");
                loadAnnouncements();
            } else {
                alert("❌ " + data.message);
            }
        })
        .catch(error => {
            console.error("Error deleting announcement:", error);
            alert("❌ Failed to delete announcement. Please try again.");
        });
    }
}

function openForm() {
    document.getElementById("announcementForm").style.display = "block";
}

function closeForm() {
    document.getElementById("announcementForm").style.display = "none";
    document.getElementById("addAnnouncementForm").reset();
}
