const student = JSON.parse(localStorage.getItem("student"));
if (!student) window.location.href = "login.html";

function loadSection(section) {
  const sectionTitle = document.getElementById("section-title");
  const contentDiv = document.getElementById("section-content");

  switch(section) {
    case "profile":
      sectionTitle.textContent = "Your Profile";
      contentDiv.innerHTML = `
        <div class="profile-section">
          <img id="profilePic" src="${student.profilePic ? 'http://localhost:5000/' + student.profilePic : 'default-avatar.png'}" alt="Profile Photo" width="150" height="150" style="border-radius:50%; object-fit:cover;">
          <h3>${student.fullName}</h3>
          <p><b>Email:</b> ${student.email}</p>
          <p><b>Student ID:</b> ${student.studentID}</p>
          <p><b>Branch:</b> ${student.program}</p>
          <form id="uploadForm" enctype="multipart/form-data">
            <input type="file" id="profileImage" name="profileImage" accept="image/*" required>
            <button type="submit">Upload Photo</button>
          </form>
          <button id="logoutBtn">Logout</button>
        </div>
      `;

      document.getElementById("uploadForm").addEventListener("submit", async (event) => {
        event.preventDefault();
        const fileInput = document.getElementById("profileImage");
        const formData = new FormData();
        formData.append("profileImage", fileInput.files[0]);
        formData.append("email", student.email);

        try {
          const response = await fetch("http://localhost:5000/uploadProfile", {
            method: "POST",
            body: formData
          });
          const result = await response.json();
          if (response.ok) {
            student.profilePic = result.profilePic;
            localStorage.setItem("student", JSON.stringify(student));
            document.getElementById("profilePic").src = `http://localhost:5000/${result.profilePic}`;
            alert("Profile photo updated!");
          } else {
            alert(result.error);
          }
        } catch (err) {
          alert("Upload failed");
        }
      });

      document.getElementById("logoutBtn").addEventListener("click", () => {
        localStorage.removeItem("student");
        window.location.href = "login.html";
      });
      break;

    case "Application":
      sectionTitle.textContent = "Application Form";
      contentDiv.innerHTML = `
        <div class="form-container" style="background-color: white; border-radius: 8px; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); padding: 20px; max-width: 800px; margin: auto;">
          <h1>Application Form</h1>
          <form id="applicationForm" enctype="multipart/form-data">
            <h2>Personal Details</h2>
            <div style="display: flex; flex-wrap: wrap; justify-content: space-between; margin-bottom: 15px;">
              <div style="flex: 1; margin-right: 10px; min-width: 250px;">
                <label for="name">Full Name</label>
                <input type="text" id="name" name="full_name" value="${student.fullName}" placeholder="Enter your name" required style="width: 100%; padding: 10px; margin-bottom: 5px; border: 1px solid #ccc; border-radius: 4px;">
              </div>
              <div style="flex: 1; margin-right: 10px; min-width: 250px;">
                <label for="dob">Date of Birth</label>
                <input type="date" id="dob" name="dob" required style="width: 100%; padding: 10px; margin-bottom: 5px; border: 1px solid #ccc; border-radius: 4px;">
              </div>
              <div style="flex: 1; margin-right: 10px; min-width: 250px;">
                <label for="email">Email</label>
                <input type="email" id="email" name="email" value="${student.email}" placeholder="Enter your email" required style="width: 100%; padding: 10px; margin-bottom: 5px; border: 1px solid #ccc; border-radius: 4px;">
              </div>
            </div>

            <div style="display: flex; flex-wrap: wrap; justify-content: space-between; margin-bottom: 15px;">
              <div style="flex: 1; margin-right: 10px; min-width: 250px;">
                <label for="phone">Mobile Number</label>
                <input type="tel" id="phone" name="phone" placeholder="Enter your mobile number" required style="width: 100%; padding: 10px; margin-bottom: 5px; border: 1px solid #ccc; border-radius: 4px;">
              </div>
              <div style="flex: 1; margin-right: 10px; min-width: 250px;">
                <label for="gender">Gender</label>
                <input type="text" id="gender" name="gender" placeholder="Enter your gender" required style="width: 100%; padding: 10px; margin-bottom: 5px; border: 1px solid #ccc; border-radius: 4px;">
              </div>
              <div style="flex: 1; margin-right: 10px; min-width: 250px;">
                <label for="occupation">Application No</label>
                <input type="text" id="occupation" name="occupation" placeholder="EN21XXXXXX/DSE21XXXXXX" required style="width: 100%; padding: 10px; margin-bottom: 5px; border: 1px solid #ccc; border-radius: 4px;">
              </div>
              <div style="flex: 1; margin-right: 10px; min-width: 250px;">
                <label for="address">Address</label>
                <input type="text" id="address" name="address" placeholder="Enter your Address" required style="width: 100%; padding: 10px; margin-bottom: 5px; border: 1px solid #ccc; border-radius: 4px;">
              </div>
            </div>

            <div style="margin-bottom: 15px;">
              <label for="photo">Upload Personal Photo</label>
              <input type="file" id="photo" name="photo" accept="image/*" required style="width: 100%; padding: 10px; margin-bottom: 5px; border: 1px solid #ccc; border-radius: 4px;">
              <img id="photo-preview" alt="Photo Preview" style="max-width: 150px; margin-top: 10px;">
            </div>

            <h2>Educational Details</h2>
            <div style="display: flex; flex-wrap: wrap; justify-content: space-between; margin-bottom: 15px;">
              <div style="flex: 1; margin-right: 10px; min-width: 250px;">
                <label for="ssc-school">SSC School Name</label>
                <input type="text" id="ssc-school" name="ssc_school" required style="width: 100%; padding: 10px; margin-bottom: 5px; border: 1px solid #ccc; border-radius: 4px;">
              </div>
              <div style="flex: 1; margin-right: 10px; min-width: 250px;">
                <label for="ssc">SSC Percentage</label>
                <input type="number" id="ssc" name="ssc" min="0" max="100" required style="width: 100%; padding: 10px; margin-bottom: 5px; border: 1px solid #ccc; border-radius: 4px;">
              </div>
            </div>

            <div style="display: flex; flex-wrap: wrap; justify-content: space-between; margin-bottom: 15px;">
              <div style="flex: 1; margin-right: 10px; min-width: 250px;">
                <label for="hsc-college">HSC College Name</label>
                <input type="text" id="hsc-college" name="hsc_college" required style="width: 100%; padding: 10px; margin-bottom: 5px; border: 1px solid #ccc; border-radius: 4px;">
              </div>
              <div style="flex: 1; margin-right: 10px; min-width: 250px;">
                <label for="hsc">HSC Percentage</label>
                <input type="number" id="hsc" name="hsc" min="0" max="100" required style="width: 100%; padding: 10px; margin-bottom: 5px; border: 1px solid #ccc; border-radius: 4px;">
              </div>
            </div>

            <div style="display: flex; flex-wrap: wrap; justify-content: space-between; margin-bottom: 15px;">
              <div style="flex: 1; margin-right: 10px; min-width: 250px;">
                <label for="degree">Degree</label>
                <input type="text" id="degree" name="degree" required style="width: 100%; padding: 10px; margin-bottom: 5px; border: 1px solid #ccc; border-radius: 4px;">
              </div>
              <div style="flex: 1; margin-right: 10px; min-width: 250px;">
                <label for="degree-percentage">Degree Percentage</label>
                <input type="number" id="degree-percentage" name="degree_percentage" min="0" max="100" required style="width: 100%; padding: 10px; margin-bottom: 5px; border: 1px solid #ccc; border-radius: 4px;">
              </div>
            </div>

            <div style="display: flex; flex-wrap: wrap; justify-content: space-between; margin-bottom: 15px;">
              <div style="flex: 1; margin-right: 10px; min-width: 250px;">
                <label for="college">College Name</label>
                <input type="text" id="college" name="college" value="Gharda Institute Of Technology, Lavel, Ratnagiri" required style="width: 100%; padding: 10px; margin-bottom: 5px; border: 1px solid #ccc; border-radius: 4px;">
              </div>
              <div style="flex: 1; margin-right: 10px; min-width: 250px;">
                <label for="cgpa">CGPA</label>
                <input type="number" id="cgpa" name="cgpa" min="0" max="100" required style="width: 100%; padding: 10px; margin-bottom: 5px; border: 1px solid #ccc; border-radius: 4px;">
              </div>
            </div>

            <div style="margin-bottom: 15px;">
              <label for="year">Year of Passing</label>
              <input type="text" id="year" name="year" required style="width: 100%; padding: 10px; margin-bottom: 5px; border: 1px solid #ccc; border-radius: 4px;">
            </div>

            <h2>Internship</h2>
            <input type="file" id="internship_certificate" name="internship_certificate" accept=".pdf,.jpg,.png" style="width: 100%; padding: 10px; margin-bottom: 15px; border: 1px solid #ccc; border-radius: 4px;">

            <h2>Upload CV</h2>
            <input type="file" id="cv" name="cv" accept=".pdf,.doc,.docx" required style="width: 100%; padding: 10px; margin-bottom: 15px; border: 1px solid #ccc; border-radius: 4px;">

            <div style="text-align: center;">
              <button type="submit" id="submitBtn" style="padding: 10px 20px; background-color: #5cb85c; border: none; border-radius: 4px; color: white; font-size: 16px; cursor: pointer;">Submit Application</button>
            </div>
          </form>
        </div>
      `;

      // Preview photo function
      window.previewPhoto = function() {
        const photo = document.getElementById("photo").files[0];
        const preview = document.getElementById("photo-preview");
        if (photo) {
          const reader = new FileReader();
          reader.onload = (e) => (preview.src = e.target.result);
          reader.readAsDataURL(photo);
        }
      };

      // Handle form submission
      document.getElementById("applicationForm").addEventListener("submit", async (e) => {
        e.preventDefault();
        const form = document.getElementById("applicationForm");
        const formData = new FormData(form);
        formData.append("studentEmail", student.email);

        try {
          const res = await fetch("http://localhost:5000/submit-application", {
            method: "POST",
            body: formData,
          });

          const data = await res.json();
          if (data.success) {
            alert("✅ Application submitted successfully!");
            form.reset();
            document.getElementById("photo-preview").src = "";
          } else {
            alert("❌ " + data.message);
          }
        } catch (err) {
          alert("Server error. Please try again later.");
          console.error(err);
        }
      });
      break;

    case "apply_job":
      sectionTitle.textContent = "Apply for Jobs";
      contentDiv.innerHTML = `
        <div style="text-align: center; margin-bottom: 20px;">
          <button onclick="fetchJobs()" style="padding: 8px 15px; background-color: #6a11cb; color: white; border: none; cursor: pointer; margin: 10px; border-radius: 5px;">🔄 Refresh Job List</button>
        </div>
        <div style="overflow-x: auto;">
          <table style="width: 100%; border-collapse: collapse; background-color: white; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); border-radius: 8px;">
            <thead>
              <tr style="background-color: #f2f2f2;">
                <th style="border: 1px solid #ccc; padding: 10px;">Company Name</th>
                <th style="border: 1px solid #ccc; padding: 10px;">Job Position</th>
                <th style="border: 1px solid #ccc; padding: 10px;">Location</th>
                <th style="border: 1px solid #ccc; padding: 10px;">Deadline</th>
                <th style="border: 1px solid #ccc; padding: 10px;">Apply</th>
              </tr>
            </thead>
            <tbody id="jobList">
              <tr><td colspan="5" style="text-align: center; padding: 20px;">Loading jobs...</td></tr>
            </tbody>
          </table>
        </div>
      `;

      window.fetchJobs = function() {
        document.getElementById("jobList").innerHTML = "<tr><td colspan='5' style='text-align: center; padding: 20px;'>Fetching latest jobs...</td></tr>";

        fetch("http://localhost:5000/jobs")
          .then(res => res.json())
          .then(data => {
            let content = "";
            if (data.length === 0) {
              content = "<tr><td colspan='5' style='text-align: center; padding: 20px;'>No job postings available.</td></tr>";
            } else {
              data.forEach(job => {
                content += `
                  <tr>
                    <td style="border: 1px solid #ccc; padding: 10px;">${job.companyName}</td>
                    <td style="border: 1px solid #ccc; padding: 10px;">${job.jobTitle}</td>
                    <td style="border: 1px solid #ccc; padding: 10px;">${job.location}</td>
                    <td style="border: 1px solid #ccc; padding: 10px;">${new Date(job.applicationDeadline).toLocaleDateString()}</td>
                    <td style="border: 1px solid #ccc; padding: 10px;"><button onclick="applyForJob('${job._id}')" style="padding: 8px 15px; background-color: #28a745; color: white; border: none; cursor: pointer; border-radius: 5px;">Apply</button></td>
                  </tr>`;
              });
            }
            document.getElementById("jobList").innerHTML = content;
          })
          .catch(err => {
            console.error("Error fetching jobs:", err);
            document.getElementById("jobList").innerHTML = "<tr><td colspan='5' style='text-align: center; padding: 20px;'>Error loading jobs.</td></tr>";
          });
      };

      window.applyForJob = function(jobId) {
        if (confirm("Do you want to apply for this job?")) {
          fetch("http://localhost:5000/apply-job", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              studentEmail: student.email,
              jobId: jobId
            })
          })
          .then(res => res.json())
          .then(data => {
            if (data.success) {
              alert("✅ Applied successfully!");
            } else {
              alert("❌ " + data.message);
            }
          })
          .catch(err => {
            alert("❌ Application failed. Please try again.");
            console.error(err);
          });
        }
      };

      fetchJobs(); // Load jobs initially
      break;

    case "upload_resume":
      sectionTitle.textContent = "Edit & Upload Resume";
      contentDiv.innerHTML = `
        <div style="background-color: white; border-radius: 8px; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); padding: 20px; max-width: 600px; margin: auto;">
          <h1>Upload Your Resume</h1>
          <form id="resumeForm" enctype="multipart/form-data">
            <div style="margin-bottom: 15px;">
              <label for="full_name">Full Name:</label>
              <input type="text" id="full_name" name="full_name" value="${student.fullName}" placeholder="Enter your name" required style="width: 100%; padding: 10px; border: 1px solid #ccc; border-radius: 4px;">
            </div>

            <div style="margin-bottom: 15px;">
              <label for="email">Email:</label>
              <input type="email" id="email" name="email" value="${student.email}" placeholder="Enter your email" required style="width: 100%; padding: 10px; border: 1px solid #ccc; border-radius: 4px;">
            </div>

            <div style="margin-bottom: 15px;">
              <label for="student_id">Student ID:</label>
              <input type="text" id="student_id" name="student_id" value="${student.studentID}" placeholder="Enter your Student ID" required style="width: 100%; padding: 10px; border: 1px solid #ccc; border-radius: 4px;">
            </div>

            <div style="margin-bottom: 15px;">
              <label for="resume">Choose Resume (PDF, DOC, DOCX):</label>
              <input type="file" id="resume" name="resume" accept=".pdf,.doc,.docx" required style="width: 100%; padding: 10px; border: 1px solid #ccc; border-radius: 4px;">
            </div>

            <div id="preview" style="margin-bottom: 15px; padding: 10px; background-color: #f8f9fa; border-radius: 4px;"></div>

            <div style="text-align: center;">
              <button type="submit" style="padding: 10px 20px; background-color: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer;">Upload Resume</button>
            </div>
          </form>
        </div>
      `;

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
            student.resume = result.resumePath;
            localStorage.setItem("student", JSON.stringify(student));
            alert("✅ Resume uploaded successfully!");
            form.reset();
          } else {
            alert("❌ " + result.message);
          }
        } catch (err) {
          alert("❌ Upload failed. Please try again.");
          console.error(err);
        }
      });
      break;

    case "view_schedule":
      sectionTitle.textContent = "View Placement Schedule";
      contentDiv.innerHTML = `
        <div style="text-align: center; margin-bottom: 20px;">
          <button onclick="fetchSchedule()" style="padding: 8px 15px; background-color: #6a11cb; color: white; border: none; cursor: pointer; margin: 10px; border-radius: 5px;">🔄 Refresh Schedule</button>
        </div>
        <div class="filter-container" style="margin-bottom: 20px; text-align: center;">
          <button class="filter-btn active" onclick="filterSchedule('all')" style="padding: 8px 15px; margin: 5px; background-color: #007bff; color: white; border: none; border-radius: 5px; cursor: pointer;">All</button>
          <button class="filter-btn" onclick="filterSchedule('Upcoming')" style="padding: 8px 15px; margin: 5px; background-color: #28a745; color: white; border: none; border-radius: 5px; cursor: pointer;">Upcoming</button>
          <button class="filter-btn" onclick="filterSchedule('Completed')" style="padding: 8px 15px; margin: 5px; background-color: #6c757d; color: white; border: none; border-radius: 5px; cursor: pointer;">Completed</button>
        </div>
        <div id="schedule-list" style="background-color: white; border-radius: 8px; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); padding: 20px;"></div>
      `;

      window.fetchSchedule = function() {
        fetch("http://localhost:5000/placement-schedule")
          .then(res => res.json())
          .then(data => {
            let content = "";
            if (data.length === 0) {
              content = "<p style='text-align: center; padding: 20px;'>No placement schedules available.</p>";
            } else {
              data.forEach(schedule => {
                const statusColor = schedule.status === 'Upcoming' ? '#28a745' : '#6c757d';
                content += `
                  <div style="border: 1px solid #ddd; border-radius: 8px; padding: 15px; margin-bottom: 10px; background-color: #f8f9fa;">
                    <h3 style="margin: 0 0 10px 0; color: #333;">${schedule.company}</h3>
                    <p style="margin: 5px 0; color: #666;"><strong>Date:</strong> ${new Date(schedule.eventDate).toLocaleDateString()}</p>
                    <p style="margin: 5px 0; color: #666;"><strong>Location:</strong> ${schedule.location}</p>
                    <p style="margin: 5px 0; color: #666;"><strong>Status:</strong> <span style="color: ${statusColor};">${schedule.status}</span></p>
                  </div>`;
              });
            }
            document.getElementById("schedule-list").innerHTML = content;
          })
          .catch(err => {
            console.error("Error fetching schedule:", err);
            document.getElementById("schedule-list").innerHTML = "<p style='text-align: center; padding: 20px; color: red;'>Error loading schedule.</p>";
          });
      };

      window.filterSchedule = function(filter) {
        const buttons = document.querySelectorAll('.filter-btn');
        buttons.forEach(btn => btn.classList.remove('active'));
        event.target.classList.add('active');

        fetch("http://localhost:5000/placement-schedule")
          .then(res => res.json())
          .then(data => {
            let filteredData = data;
            if (filter !== 'all') {
              filteredData = data.filter(item => item.status === filter);
            }

            let content = "";
            if (filteredData.length === 0) {
              content = "<p style='text-align: center; padding: 20px;'>No placement schedules available.</p>";
            } else {
              filteredData.forEach(schedule => {
                const statusColor = schedule.status === 'Upcoming' ? '#28a745' : '#6c757d';
                content += `
                  <div style="border: 1px solid #ddd; border-radius: 8px; padding: 15px; margin-bottom: 10px; background-color: #f8f9fa;">
                    <h3 style="margin: 0 0 10px 0; color: #333;">${schedule.company}</h3>
                    <p style="margin: 5px 0; color: #666;"><strong>Date:</strong> ${new Date(schedule.eventDate).toLocaleDateString()}</p>
                    <p style="margin: 5px 0; color: #666;"><strong>Location:</strong> ${schedule.location}</p>
                    <p style="margin: 5px 0; color: #666;"><strong>Status:</strong> <span style="color: ${statusColor};">${schedule.status}</span></p>
                  </div>`;
              });
            }
            document.getElementById("schedule-list").innerHTML = content;
          })
          .catch(err => {
            console.error("Error filtering schedule:", err);
            document.getElementById("schedule-list").innerHTML = "<p style='text-align: center; padding: 20px; color: red;'>Error loading schedule.</p>";
          });
      };

      fetchSchedule(); // Load schedule initially
      break;

    case "download_offer":
      sectionTitle.textContent = "Download Offer Letters";
      contentDiv.innerHTML = `
        <div style="background-color: white; border-radius: 8px; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); padding: 20px; max-width: 600px; margin: auto; text-align: center;">
          <h2>Your Offer Letters</h2>
          <div id="offers-list">
            <p>Loading your offers...</p>
          </div>
        </div>
      `;

      fetch("http://localhost:5000/student-offers?email=" + student.email)
        .then(res => res.json())
        .then(data => {
          let content = "";
          if (data.length === 0) {
            content = "<p>You don't have any offer letters yet.</p>";
          } else {
            content = "<div>";
            data.forEach(offer => {
              content += `
                <div style="border: 1px solid #ddd; border-radius: 8px; padding: 15px; margin-bottom: 10px; background-color: #f8f9fa;">
                  <h3 style="margin: 0 0 10px 0; color: #333;">${offer.companyName}</h3>
                  <p style="margin: 5px 0; color: #666;"><strong>Position:</strong> ${offer.position}</p>
                  <p style="margin: 5px 0; color: #666;"><strong>Status:</strong> ${offer.status}</p>
                  <button onclick="downloadOffer('${offer._id}')" style="padding: 8px 15px; background-color: #007bff; color: white; border: none; border-radius: 5px; cursor: pointer;">Download</button>
                </div>`;
            });
            content += "</div>";
          }
          document.getElementById("offers-list").innerHTML = content;
        })
        .catch(err => {
          console.error("Error fetching offers:", err);
          document.getElementById("offers-list").innerHTML = "<p style='color: red;'>Error loading offers.</p>";
        });

      window.downloadOffer = function(offerId) {
        window.open("http://localhost:5000/download-offer/" + offerId, '_blank');
      };
      break;

    case "track_status":
      sectionTitle.textContent = "Track Application Status";
      contentDiv.innerHTML = `
        <div class="filter-container" style="margin-bottom: 20px; text-align: center;">
          <button class="filter-btn active" onclick="filterApplications('All')" style="padding: 8px 15px; margin: 5px; background-color: #007bff; color: white; border: none; border-radius: 5px; cursor: pointer;">All</button>
          <button class="filter-btn" onclick="filterApplications('Applied')" style="padding: 8px 15px; margin: 5px; background-color: #ffc107; color: black; border: none; border-radius: 5px; cursor: pointer;">Applied</button>
          <button class="filter-btn" onclick="filterApplications('In Review')" style="padding: 8px 15px; margin: 5px; background-color: #17a2b8; color: white; border: none; border-radius: 5px; cursor: pointer;">In Review</button>
          <button class="filter-btn" onclick="filterApplications('Interview Scheduled')" style="padding: 8px 15px; margin: 5px; background-color: #fd7e14; color: white; border: none; border-radius: 5px; cursor: pointer;">Interview</button>
          <button class="filter-btn" onclick="filterApplications('Selected')" style="padding: 8px 15px; margin: 5px; background-color: #28a745; color: white; border: none; border-radius: 5px; cursor: pointer;">Selected</button>
          <button class="filter-btn" onclick="filterApplications('Rejected')" style="padding: 8px 15px; margin: 5px; background-color: #dc3545; color: white; border: none; border-radius: 5px; cursor: pointer;">Rejected</button>
        </div>
        <div id="applications" style="background-color: white; border-radius: 8px; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); padding: 20px;"></div>
      `;

      window.fetchApplications = function() {
        fetch("http://localhost:5000/student-applications?email=" + student.email)
          .then(res => res.json())
          .then(data => {
            let content = "";
            if (data.length === 0) {
              content = "<p style='text-align: center; padding: 20px;'>You haven't applied for any jobs yet.</p>";
            } else {
              data.forEach(app => {
                let statusColor = "#6c757d";
                switch(app.status) {
                  case 'Applied': statusColor = '#ffc107'; break;
                  case 'In Review': statusColor = '#17a2b8'; break;
                  case 'Interview Scheduled': statusColor = '#fd7e14'; break;
                  case 'Selected': statusColor = '#28a745'; break;
                  case 'Rejected': statusColor = '#dc3545'; break;
                }
                content += `
                  <div style="border: 1px solid #ddd; border-radius: 8px; padding: 15px; margin-bottom: 10px; background-color: #f8f9fa;">
                    <h3 style="margin: 0 0 10px 0; color: #333;">${app.companyName}</h3>
                    <p style="margin: 5px 0; color: #666;"><strong>Position:</strong> ${app.jobTitle}</p>
                    <p style="margin: 5px 0; color: #666;"><strong>Applied Date:</strong> ${new Date(app.applicationDate).toLocaleDateString()}</p>
                    <p style="margin: 5px 0; color: #666;"><strong>Status:</strong> <span style="color: ${statusColor};">${app.status}</span></p>
                  </div>`;
              });
            }
            document.getElementById("applications").innerHTML = content;
          })
          .catch(err => {
            console.error("Error fetching applications:", err);
            document.getElementById("applications").innerHTML = "<p style='text-align: center; padding: 20px; color: red;'>Error loading applications.</p>";
          });
      };

      window.filterApplications = function(filter) {
        const buttons = document.querySelectorAll('.filter-btn');
        buttons.forEach(btn => btn.classList.remove('active'));
        event.target.classList.add('active');

        fetch("http://localhost:5000/student-applications?email=" + student.email)
          .then(res => res.json())
          .then(data => {
            let filteredData = data;
            if (filter !== 'All') {
              filteredData = data.filter(app => app.status === filter);
            }

            let content = "";
            if (filteredData.length === 0) {
              content = "<p style='text-align: center; padding: 20px;'>No applications found.</p>";
            } else {
              filteredData.forEach(app => {
                let statusColor = "#6c757d";
                switch(app.status) {
                  case 'Applied': statusColor = '#ffc107'; break;
                  case 'In Review': statusColor = '#17a2b8'; break;
                  case 'Interview Scheduled': statusColor = '#fd7e14'; break;
                  case 'Selected': statusColor = '#28a745'; break;
                  case 'Rejected': statusColor = '#dc3545'; break;
                }
                content += `
                  <div style="border: 1px solid #ddd; border-radius: 8px; padding: 15px; margin-bottom: 10px; background-color: #f8f9fa;">
                    <h3 style="margin: 0 0 10px 0; color: #333;">${app.companyName}</h3>
                    <p style="margin: 5px 0; color: #666;"><strong>Position:</strong> ${app.jobTitle}</p>
                    <p style="margin: 5px 0; color: #666;"><strong>Applied Date:</strong> ${new Date(app.applicationDate).toLocaleDateString()}</p>
                    <p style="margin: 5px 0; color: #666;"><strong>Status:</strong> <span style="color: ${statusColor};">${app.status}</span></p>
                  </div>`;
              });
            }
            document.getElementById("applications").innerHTML = content;
          })
          .catch(err => {
            console.error("Error filtering applications:", err);
            document.getElementById("applications").innerHTML = "<p style='text-align: center; padding: 20px; color: red;'>Error loading applications.</p>";
          });
      };

      fetchApplications(); // Load applications initially
      break;

    case "announcements":
      sectionTitle.textContent = "Notifications & Announcements";
      contentDiv.innerHTML = `
        <div style="background-color: white; border-radius: 8px; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); padding: 20px; max-width: 800px; margin: auto;">
          <h2>Latest Announcements</h2>
          <div id="announcementList" style="max-height: 400px; overflow-y: auto;"></div>
        </div>
      `;

      fetch("http://localhost:5000/announcements")
        .then(res => res.json())
        .then(data => {
          let content = "";
          if (data.length === 0) {
            content = "<p style='text-align: center; padding: 20px;'>No announcements available.</p>";
          } else {
            data.forEach(announcement => {
              content += `
                <div style="border: 1px solid #ddd; border-radius: 8px; padding: 15px; margin-bottom: 10px; background-color: #f8f9fa;">
                  <h3 style="margin: 0 0 10px 0; color: #333;">${announcement.title}</h3>
                  <p style="margin: 5px 0; color: #666; line-height: 1.5;">${announcement.message}</p>
                  <p style="margin: 5px 0; color: #999; font-size: 0.9em;"><strong>Date:</strong> ${new Date(announcement.date).toLocaleDateString()}</p>
                </div>`;
            });
          }
          document.getElementById("announcementList").innerHTML = content;
        })
        .catch(err => {
          console.error("Error fetching announcements:", err);
          document.getElementById("announcementList").innerHTML = "<p style='text-align: center; padding: 20px; color: red;'>Error loading announcements.</p>";
        });
      break;

    case "settings":
      sectionTitle.textContent = "Settings & Logout";
      contentDiv.innerHTML = `
        <div style="background-color: white; border-radius: 8px; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); padding: 20px; max-width: 600px; margin: auto;">
          <h2>Account Settings</h2>
          <div style="margin-bottom: 20px;">
            <label style="display: block; margin-bottom: 5px; font-weight: bold;">Change Password</label>
            <form id="changePasswordForm">
              <input type="password" id="currentPassword" placeholder="Current Password" required style="width: 100%; padding: 10px; margin-bottom: 10px; border: 1px solid #ccc; border-radius: 4px;">
              <input type="password" id="newPassword" placeholder="New Password" required style="width: 100%; padding: 10px; margin-bottom: 10px; border: 1px solid #ccc; border-radius: 4px;">
              <input type="password" id="confirmPassword" placeholder="Confirm New Password" required style="width: 100%; padding: 10px; margin-bottom: 10px; border: 1px solid #ccc; border-radius: 4px;">
              <button type="submit" style="padding: 10px 20px; background-color: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer;">Change Password</button>
            </form>
          </div>

          <div style="margin-bottom: 20px;">
            <h3>Notification Preferences</h3>
            <label style="display: block; margin-bottom: 10px;">
              <input type="checkbox" id="emailNotifications" checked> Email Notifications
            </label>
            <label style="display: block; margin-bottom: 10px;">
              <input type="checkbox" id="jobAlerts" checked> Job Alerts
            </label>
            <label style="display: block; margin-bottom: 10px;">
              <input type="checkbox" id="announcementAlerts" checked> Announcement Alerts
            </label>
          </div>

          <div style="text-align: center; border-top: 1px solid #ddd; padding-top: 20px;">
            <button onclick="logout()" style="padding: 10px 20px; background-color: #dc3545; color: white; border: none; border-radius: 4px; cursor: pointer;">Logout</button>
          </div>
        </div>
      `;

      document.getElementById("changePasswordForm").addEventListener("submit", async (e) => {
        e.preventDefault();
        const currentPassword = document.getElementById("currentPassword").value;
        const newPassword = document.getElementById("newPassword").value;
        const confirmPassword = document.getElementById("confirmPassword").value;

        if (newPassword !== confirmPassword) {
          alert("❌ New passwords don't match!");
          return;
        }

        try {
          const response = await fetch("http://localhost:5000/change-password", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: student.email,
              currentPassword: currentPassword,
              newPassword: newPassword
            })
          });

          const result = await response.json();
          if (response.ok) {
            alert("✅ Password changed successfully!");
            document.getElementById("changePasswordForm").reset();
          } else {
            alert("❌ " + result.message);
          }
        } catch (err) {
          alert("❌ Failed to change password. Please try again.");
          console.error(err);
        }
      });

      window.logout = function() {
        if (confirm("Are you sure you want to logout?")) {
          localStorage.removeItem("student");
          window.location.href = "login.html";
        }
      };
      break;

    default:
      sectionTitle.textContent = "Dashboard Overview";
      contentDiv.innerHTML = `
        <div style="text-align: center; padding: 40px; background-color: white; border-radius: 8px; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);">
          <h2>Welcome to Your Dashboard!</h2>
          <p>Select an option from the sidebar to view details.</p>
          <div style="margin-top: 20px;">
            <div style="display: inline-block; margin: 10px; padding: 15px; background-color: #f8f9fa; border-radius: 8px; border-left: 4px solid #007bff;">
              <h3>📋 Application Form</h3>
              <p>Submit your job application with all required details</p>
            </div>
            <div style="display: inline-block; margin: 10px; padding: 15px; background-color: #f8f9fa; border-radius: 8px; border-left: 4px solid #28a745;">
              <h3>💼 Apply for Jobs</h3>
              <p>Browse and apply for available job positions</p>
            </div>
            <div style="display: inline-block; margin: 10px; padding: 15px; background-color: #f8f9fa; border-radius: 8px; border-left: 4px solid #ffc107;">
              <h3>📄 Upload Resume</h3>
              <p>Upload and update your resume</p>
            </div>
            <div style="display: inline-block; margin: 10px; padding: 15px; background-color: #f8f9fa; border-radius: 8px; border-left: 4px solid #17a2b8;">
              <h3>📅 View Schedule</h3>
              <p>Check placement drive schedules</p>
            </div>
            <div style="display: inline-block; margin: 10px; padding: 15px; background-color: #f8f9fa; border-radius: 8px; border-left: 4px solid #fd7e14;">
              <h3>📊 Track Status</h3>
              <p>Monitor your application status</p>
            </div>
            <div style="display: inline-block; margin: 10px; padding: 15px; background-color: #f8f9fa; border-radius: 8px; border-left: 4px solid #6f42c1;">
              <h3>📢 Announcements</h3>
              <p>View latest notifications and updates</p>
            </div>
          </div>
        </div>
      `;
  }
}

loadSection(); // Load default
