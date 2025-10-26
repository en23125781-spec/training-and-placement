// Get admin authentication (assuming admin is logged in)
const admin = JSON.parse(localStorage.getItem("admin"));
if (!admin) {
    window.location.href = "../admin_login.html";
}

// Open/Close Upload Form
function openForm() {
    document.getElementById("uploadForm").style.display = "block";
}

function closeForm() {
    document.getElementById("uploadForm").style.display = "none";
    document.getElementById("uploadDocumentForm").reset();
}

// Fetch and display uploaded documents from the database
function loadDocuments() {
    // For now, we'll fetch student data which includes resumes
    fetch("http://localhost:5000/admin/students")
        .then(response => response.json())
        .then(data => {
            displayDocuments(data);
        })
        .catch(error => {
            console.error("Error fetching documents:", error);
            document.getElementById("documentTable").innerHTML = "<p style='color: red; text-align: center;'>Error loading documents.</p>";
        });
}

function displayDocuments(students) {
    const container = document.getElementById("documentTable");
    container.innerHTML = "";

    if (students.length === 0) {
        container.innerHTML = "<p style='text-align: center; padding: 20px;'>No documents found.</p>";
        return;
    }

    let content = `
        <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
            <thead>
                <tr style="background-color: #f2f2f2;">
                    <th style="border: 1px solid #ccc; padding: 10px;">Student Name</th>
                    <th style="border: 1px solid #ccc; padding: 10px;">Document Type</th>
                    <th style="border: 1px solid #ccc; padding: 10px;">File</th>
                    <th style="border: 1px solid #ccc; padding: 10px;">Status</th>
                    <th style="border: 1px solid #ccc; padding: 10px;">Actions</th>
                </tr>
            </thead>
            <tbody>
    `;

    students.forEach(student => {
        const hasResume = student.resume && student.resume.trim() !== "";
        const resumePath = hasResume ? `http://localhost:5000/uploads/cv/${student.resume.split('/').pop()}` : "#";

        content += `
            <tr>
                <td style="border: 1px solid #ccc; padding: 10px;">${student.fullName}</td>
                <td style="border: 1px solid #ccc; padding: 10px;">Resume</td>
                <td style="border: 1px solid #ccc; padding: 10px;">
                    ${hasResume ?
                        `<a href="${resumePath}" target="_blank" style="color: #007bff; text-decoration: none;">View Resume</a>` :
                        '<span style="color: #999;">No resume uploaded</span>'
                    }
                </td>
                <td style="border: 1px solid #ccc; padding: 10px;">
                    <span style="color: ${hasResume ? '#28a745' : '#ffc107'}; font-weight: bold;">
                        ${hasResume ? 'Uploaded' : 'Pending'}
                    </span>
                </td>
                <td style="border: 1px solid #ccc; padding: 10px; text-align: center;">
                    <button onclick="deleteDocument('${student._id}', 'resume')" style="padding: 5px 10px; background-color: #dc3545; color: white; border: none; border-radius: 4px; cursor: pointer;">Delete</button>
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

// Handle document upload
document.getElementById("uploadDocumentForm").addEventListener("submit", function (event) {
    event.preventDefault();

    let formData = new FormData();
    formData.append("docType", document.getElementById("docType").value);
    formData.append("fileUpload", document.getElementById("fileUpload").files[0]);

    // For demo purposes, we'll upload to the current user's account
    // In a real system, you'd have a student selection interface
    const demoStudentEmail = "student@demo.com";

    fetch(`http://localhost:5000/upload-resume`, {
        method: "POST",
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.message) {
            alert("✅ Document uploaded successfully!");
            closeForm();
            loadDocuments(); // refresh list
        } else {
            alert("❌ " + (data.error || "Upload failed"));
        }
    })
    .catch(error => {
        console.error("Error uploading document:", error);
        alert("❌ Failed to upload document. Please try again.");
    });
});

// Function to delete a document
function deleteDocument(studentId, docType) {
    if (confirm(`Are you sure you want to delete this ${docType}?`)) {
        // Update student to remove resume
        fetch(`http://localhost:5000/admin/students/${studentId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                resume: null // Remove resume
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert("✅ Document deleted successfully!");
                loadDocuments(); // refresh list
            } else {
                alert("❌ " + data.message);
            }
        })
        .catch(error => {
            console.error("Error deleting document:", error);
            alert("❌ Failed to delete document. Please try again.");
        });
    }
}

// Load documents on page load
document.addEventListener("DOMContentLoaded", loadDocuments);
