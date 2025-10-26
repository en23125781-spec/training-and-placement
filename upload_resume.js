// File preview functionality
document.getElementById("resume").addEventListener("change", function () {
    let file = this.files[0];
    if (file) {
        let fileURL = URL.createObjectURL(file);
        document.getElementById("preview").innerHTML = `
            <p><strong>Resume Preview:</strong></p>
            <a href="${fileURL}" target="_blank">${file.name}</a>
            <p style="color: #666; font-size: 0.9em;">File size: ${(file.size / 1024 / 1024).toFixed(2)} MB</p>
        `;
    }
});

// Handle form submission
document.getElementById("resumeForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const form = document.getElementById("resumeForm");
    const formData = new FormData(form);

    try {
        const response = await fetch("http://localhost:5000/upload-resume", {
            method: "POST",
            body: formData
        });

        const result = await response.json();

        if (response.ok) {
            alert("✅ Resume uploaded successfully!");
            form.reset();
            document.getElementById("preview").innerHTML = "";
        } else {
            alert("❌ " + (result.error || "Upload failed"));
        }
    } catch (err) {
        alert("❌ Server error. Please try again.");
        console.error(err);
    }
});
