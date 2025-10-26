document.addEventListener('DOMContentLoaded', function () {
    fetchApplications();
});

function fetchApplications() {
    fetch('fetch_applications.php')
        .then(response => response.json())
        .then(data => {
            let container = document.getElementById('applications');
            container.innerHTML = '';

            data.forEach(app => {
                let statusClass = app.status.toLowerCase().replace(' ', '-');
                
                let card = `
                    <div class="application-card" data-status="${app.status}">
                        <h2>${app.company_name} - ${app.position}</h2>
                        <p>Applied Date: ${app.applied_date}</p>
                        <span class="status ${statusClass}">${app.status}</span>
                    </div>
                `;

                container.innerHTML += card;
            });
        })
        .catch(error => console.error('Error fetching applications:', error));
}
