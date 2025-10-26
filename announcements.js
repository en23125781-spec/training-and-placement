document.addEventListener("DOMContentLoaded", function() {
    // Fetch announcements from MongoDB backend
    fetch("http://localhost:5000/announcements")
        .then(response => response.json())
        .then(data => {
            displayAnnouncements(data);
        })
        .catch(error => {
            console.error("Error fetching announcements:", error);
            document.getElementById("announcementList").innerHTML = "<p style='color: red; text-align: center;'>Error loading announcements.</p>";
        });

    function displayAnnouncements(announcements) {
        const container = document.getElementById("announcementList");

        if (announcements.length === 0) {
            container.innerHTML = "<p style='text-align: center; padding: 20px;'>No announcements available.</p>";
            return;
        }

        let content = "";
        announcements.forEach(announcement => {
            content += `
                <div style="
                    border: 1px solid #ddd;
                    border-radius: 8px;
                    padding: 15px;
                    margin-bottom: 15px;
                    background-color: #f8f9fa;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                ">
                    <h3 style="margin: 0 0 10px 0; color: #333;">${announcement.title}</h3>
                    <p style="margin: 5px 0; color: #666; line-height: 1.5;">${announcement.message}</p>
                    <p style="margin: 5px 0; color: #999; font-size: 0.9em;"><strong>Date:</strong> ${new Date(announcement.date).toLocaleDateString()}</p>
                </div>
            `;
        });

        container.innerHTML = content;
    }
});
