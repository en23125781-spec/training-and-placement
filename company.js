document.addEventListener("DOMContentLoaded", fetchCompanies);

function fetchCompanies() {
    fetch("view_companies.php")
        .then(response => response.json())
        .then(data => {
            let tableContent = "";
            data.forEach(company => {
                tableContent += `
                    <tr class="${checkDeadline(company.application_deadline)}">
                        <td>${company.name}</td>
                        <td>${company.job_position}</td>
                        <td>${company.application_deadline}</td>
                        <td><button class="apply-btn" onclick="applyJob(${company.id})">Apply</button></td>
                    </tr>
                `;
            });
            document.getElementById("companyList").innerHTML = tableContent;
        });
}

function applyJob(companyId) {
    fetch("apply_job.php?company_id=" + companyId)
        .then(response => response.text())
        .then(data => alert(data));
}

function checkDeadline(deadline) {
    const today = new Date().toISOString().split("T")[0]; // Get current date in YYYY-MM-DD
    return deadline >= today ? "upcoming" : "expired";
}

function filterJobs(type) {
    const rows = document.querySelectorAll("#companyList tr");
    document.querySelectorAll(".filter-btn").forEach(btn => btn.classList.remove("active"));
    
    document.querySelector(`[onclick="filterJobs('${type}')"]`).classList.add("active");

    rows.forEach(row => {
        row.style.display = "table-row";
        if (type !== "all" && !row.classList.contains(type)) {
            row.style.display = "none";
        }
    });
}
