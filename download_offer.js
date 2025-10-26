// Get student email from localStorage (assuming user is logged in)
const student = JSON.parse(localStorage.getItem("student"));
if (!student) {
    window.location.href = "login.html";
}

document.addEventListener("DOMContentLoaded", function () {
    // Fetch offers from MongoDB backend
    fetch(`http://localhost:5000/student-offers?email=${student.email}`)
        .then(response => response.json())
        .then(data => {
            displayOffers(data);
        })
        .catch(error => {
            console.error("Error fetching offers:", error);
            document.getElementById("offerList").innerHTML = "<p style='color: red; text-align: center;'>Error loading offers.</p>";
        });

    function displayOffers(offers) {
        const container = document.getElementById("offerList");

        if (offers.length === 0) {
            container.innerHTML = "<p style='text-align: center; padding: 20px;'>You don't have any offer letters yet.</p>";
            return;
        }

        let content = `
            <table style="width: 100%; border-collapse: collapse; background-color: white; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); border-radius: 8px; overflow: hidden;">
                <thead>
                    <tr style="background-color: #f2f2f2;">
                        <th style="border: 1px solid #ccc; padding: 10px;">Company Name</th>
                        <th style="border: 1px solid #ccc; padding: 10px;">Position</th>
                        <th style="border: 1px solid #ccc; padding: 10px;">Status</th>
                        <th style="border: 1px solid #ccc; padding: 10px;">Download</th>
                    </tr>
                </thead>
                <tbody>
        `;

        offers.forEach(offer => {
            let statusColor = offer.status === 'Pending' ? '#ffc107' : '#28a745';
            content += `
                <tr>
                    <td style="border: 1px solid #ccc; padding: 10px;">${offer.companyName}</td>
                    <td style="border: 1px solid #ccc; padding: 10px;">${offer.position}</td>
                    <td style="border: 1px solid #ccc; padding: 10px;"><span style="color: ${statusColor}; font-weight: bold;">${offer.status}</span></td>
                    <td style="border: 1px solid #ccc; padding: 10px; text-align: center;">
                        <button onclick="downloadOffer('${offer._id}')" style="padding: 8px 15px; background-color: #007bff; color: white; border: none; border-radius: 5px; cursor: pointer;">Download</button>
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
});

// Download offer function
function downloadOffer(offerId) {
    window.open(`http://localhost:5000/download-offer/${offerId}`, '_blank');
}
