document.addEventListener("DOMContentLoaded", () => {
    loadAnnouncements();
});

function loadAnnouncements() {
    fetch("fetch_announcements.php")
        .then(res => res.json())
        .then(data => {
            const announcementList = document.getElementById("announcementList");
            announcementList.innerHTML = ""; // Clear existing list

            if (!Array.isArray(data)) {
                // If the data is not an array, log it for debugging
                console.error("Unexpected response format:", data);
                alert("Failed to load announcements.");
                return;
            }

            if (data.length === 0) {
                announcementList.innerHTML = "<li>No announcements available.</li>";
                return;
            }

            data.forEach(item => {
                const listItem = document.createElement("li");
                listItem.innerHTML = `
                    <strong>${item.title}</strong><br>
                    <p>${item.message}</p>
                    <small>${new Date(item.created_at).toLocaleString()}</small>
                `;
                announcementList.appendChild(listItem);
            });
        })
        .catch(err => {
            console.error("Error fetching announcements:", err);
            alert("An error occurred while fetching announcements.");
        });
}
