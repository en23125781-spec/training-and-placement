// Get student email from localStorage (assuming user is logged in)
const student = JSON.parse(localStorage.getItem("student"));
if (!student) {
    window.location.href = "login.html";
}

document.addEventListener("DOMContentLoaded", function() {
    fetchApplications();

    // Fetch applications from MongoDB
    function fetchApplications() {
        fetch(`http://localhost:5000/student-applications?email=${student.email}`)
            .then(response => response.json())
            .then(data => {
                displayApplications(data);
            })
            .catch(error => {
                console.error("Error fetching applications:", error);
                document.getElementById("applications").innerHTML = "<p style='color: red; text-align: center;'>Error loading applications.</p>";
            });
    }

    // Display applications in cards
    function displayApplications(applications) {
        const container = document.getElementById("applications");

        if (applications.length === 0) {
            container.innerHTML = "<p style='text-align: center; padding: 20px;'>No applications found.</p>";
            return;
        }

        let content = "";
        applications.forEach(app => {
            let statusColor = "#6c757d";
            let statusText = app.status;

            switch(app.status) {
                case 'Applied': statusColor = '#ffc107'; break;
                case 'In Review': statusColor = '#17a2b8'; break;
                case 'Interview Scheduled': statusColor = '#fd7e14'; break;
                case 'Selected': statusColor = '#28a745'; break;
                case 'Rejected': statusColor = '#dc3545'; break;
            }

            content += `
                <div class="application-card" data-status="${app.status}" style="
                    border: 1px solid #ddd;
                    border-radius: 8px;
                    padding: 15px;
                    margin-bottom: 15px;
                    background-color: #f8f9fa;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                ">
                    <h3 style="margin: 0 0 10px 0; color: #333;">${app.companyName}</h3>
                    <p style="margin: 5px 0; color: #666;"><strong>Position:</strong> ${app.jobTitle}</p>
                    <p style="margin: 5px 0; color: #666;"><strong>Applied Date:</strong> ${new Date(app.applicationDate).toLocaleDateString()}</p>
                    <p style="margin: 5px 0; color: #666;"><strong>Status:</strong> <span style="color: ${statusColor}; font-weight: bold;">${statusText}</span></p>
                </div>
            `;
        });

        container.innerHTML = content;
    }

    // Filter applications by status
    window.filterStatus = function(status) {
        let cards = document.querySelectorAll('.application-card');
        let buttons = document.querySelectorAll('.filter-btn');

        buttons.forEach(btn => btn.classList.remove('active'));
        event.target.classList.add('active');

        cards.forEach(card => {
            if (status === 'All' || card.dataset.status === status) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    };
});
