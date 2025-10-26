document.addEventListener("DOMContentLoaded", function () {
    const scheduleList = document.getElementById("schedule-list");
    const filterButtons = document.querySelectorAll(".filter-btn");

    // Fetch data from MongoDB backend
    fetch("http://localhost:5000/placement-schedule")
        .then(response => response.json())
        .then(data => {
            displaySchedules(data);
        })
        .catch(error => {
            console.error("Error fetching schedule:", error);
            scheduleList.innerHTML = "<p style='color: red; text-align: center;'>Error loading schedule.</p>";
        });

    function displaySchedules(schedules) {
        scheduleList.innerHTML = "";
        schedules.forEach(schedule => {
            const card = document.createElement("div");
            card.classList.add("schedule-card");
            card.setAttribute("data-status", schedule.status);

            const statusColor = schedule.status === 'Upcoming' ? '#28a745' : '#6c757d';

            card.innerHTML = `
                <h2 style="color: #333; margin-bottom: 10px;">${schedule.company}</h2>
                <p style="margin: 5px 0; color: #666;"><strong>Date:</strong> ${new Date(schedule.eventDate).toLocaleDateString()}</p>
                <p style="margin: 5px 0; color: #666;"><strong>Location:</strong> ${schedule.location}</p>
                <p style="margin: 5px 0; color: #666;"><strong>Status:</strong> <span style="color: ${statusColor}; font-weight: bold;">${schedule.status}</span></p>
            `;

            // Add styling to the card
            card.style.cssText = `
                border: 1px solid #ddd;
                border-radius: 8px;
                padding: 15px;
                margin-bottom: 15px;
                background-color: #f8f9fa;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            `;

            scheduleList.appendChild(card);
        });
    }

    // Filter schedules based on status
    filterButtons.forEach(button => {
        button.addEventListener("click", () => {
            filterButtons.forEach(btn => btn.classList.remove("active"));
            button.classList.add("active");

            const filter = button.getAttribute("data-filter");

            fetch("http://localhost:5000/placement-schedule")
                .then(response => response.json())
                .then(data => {
                    const filteredSchedules = filter === "all"
                        ? data
                        : data.filter(schedule => schedule.status === filter);
                    displaySchedules(filteredSchedules);
                })
                .catch(error => {
                    console.error("Error filtering schedule:", error);
                    scheduleList.innerHTML = "<p style='color: red; text-align: center;'>Error loading schedule.</p>";
                });
        });
    });
});
