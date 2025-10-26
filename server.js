// -------------------- IMPORTS --------------------
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// -------------------- INITIALIZE APP --------------------
const app = express();

// -------------------- MIDDLEWARE --------------------
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploads folder (for profile images & application docs)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Serve frontend files (HTML, JS, CSS)
app.use(express.static(path.join(__dirname, "/")));

// -------------------- MONGODB ATLAS CONNECTION --------------------
mongoose
  .connect(
    "mongodb+srv://Nikita:nikita123@tnpa.nugzs3f.mongodb.net/tnpa?retryWrites=true&w=majority",
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log("✅ MongoDB Atlas connected"))
  .catch((err) => console.error("❌ Atlas connection error:", err));

// -------------------- SCHEMAS --------------------

// Student Schema
const studentSchema = new mongoose.Schema({
  fullName: String,
  email: { type: String, unique: true },
  studentID: String,
  program: String,
  password: String,
  profilePic: String,
  resume: String,
});
const Student = mongoose.model("Student", studentSchema);

// Job Schema
const jobSchema = new mongoose.Schema({
  companyName: String,
  jobTitle: String,
  location: String,
  applicationDeadline: Date,
  createdAt: { type: Date, default: Date.now }
});
const Job = mongoose.model("Job", jobSchema);

// Application Schema (updated for job applications)
const jobApplicationSchema = new mongoose.Schema({
  studentEmail: String,
  jobId: mongoose.Schema.Types.ObjectId,
  companyName: String,
  jobTitle: String,
  status: { type: String, default: 'Applied' },
  applicationDate: { type: Date, default: Date.now }
});
const JobApplication = mongoose.model("JobApplication", jobApplicationSchema);

// Application Schema (for detailed applications)
const applicationSchema = new mongoose.Schema({
  full_name: String,
  dob: String,
  email: String,
  phone: String,
  gender: String,
  occupation: String,
  address: String,
  ssc_school: String,
  ssc: String,
  hsc_college: String,
  hsc: String,
  degree: String,
  degree_percentage: String,
  college: String,
  cgpa: String,
  year: String,
  photo: String,
  cv: String,
  internship_certificate: String,
  submittedAt: { type: Date, default: Date.now },
});
const Application = mongoose.model("Application", applicationSchema);

// Placement Schedule Schema
const placementScheduleSchema = new mongoose.Schema({
  company: String,
  eventDate: Date,
  location: String,
  status: { type: String, default: 'Upcoming' },
  createdAt: { type: Date, default: Date.now }
});
const PlacementSchedule = mongoose.model("PlacementSchedule", placementScheduleSchema);

// Announcement Schema
const announcementSchema = new mongoose.Schema({
  title: String,
  message: String,
  date: { type: Date, default: Date.now }
});
const Announcement = mongoose.model("Announcement", announcementSchema);

// Offer Schema
const offerSchema = new mongoose.Schema({
  studentEmail: String,
  companyName: String,
  position: String,
  status: { type: String, default: 'Pending' },
  offerPath: String,
  createdAt: { type: Date, default: Date.now }
});
const Offer = mongoose.model("Offer", offerSchema);

// -------------------- MULTER STORAGE --------------------
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let folder = "uploads/";
    if (file.fieldname === "profileImage") folder += "profile_pics/";
    else if (file.fieldname === "photo") folder += "photos/";
    else if (file.fieldname === "cv" || file.fieldname === "resume") folder += "cv/";
    else if (file.fieldname === "internship_certificate") folder += "internships/";
    else if (file.fieldname === "offer") folder += "offers/";

    // Create directory if it doesn't exist
    if (!fs.existsSync(folder)) {
      fs.mkdirSync(folder, { recursive: true });
    }
    cb(null, folder);
  },
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

// -------------------- ROUTES --------------------

// Root route -> serve login page
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "login.html"));
});

// -------------------- ADMIN LOGIN --------------------
app.post("/admin/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    // Simple admin authentication (for demo purposes)
    if (username === 'admin' && password === 'admin123') {
      const adminData = {
        username: username,
        loginTime: new Date().toISOString()
      };

      res.json({
        success: true,
        message: "Admin login successful",
        admin: adminData
      });
    } else {
      res.status(401).json({
        success: false,
        message: "Invalid admin credentials"
      });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// -------------------- REGISTER --------------------
app.post("/register", async (req, res) => {
  try {
    const { fullName, email, studentID, program, password } = req.body;
    const existing = await Student.findOne({ email });
    if (existing) return res.status(400).json({ error: "Email already registered" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newStudent = new Student({
      fullName,
      email,
      studentID,
      program,
      password: hashedPassword,
    });

    await newStudent.save();
    res.json({ message: "✅ Registration successful" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// -------------------- LOGIN --------------------
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await Student.findOne({ email });
    if (!user) return res.status(400).json({ error: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid password" });

    res.json({
      message: "✅ Login successful",
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        studentID: user.studentID,
        program: user.program,
        profilePic: user.profilePic,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// -------------------- UPLOAD PROFILE PHOTO --------------------
app.post("/uploadProfile", upload.single("profileImage"), async (req, res) => {
  try {
    const { email } = req.body;
    const profilePic = req.file ? `uploads/profile_pics/${req.file.filename}` : null;

    if (!profilePic) return res.status(400).json({ error: "No file uploaded" });

    const user = await Student.findOneAndUpdate(
      { email },
      { profilePic },
      { new: true }
    );

    if (!user) return res.status(404).json({ error: "User not found" });

    res.json({ message: "✅ Profile photo updated", profilePic: user.profilePic });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// -------------------- UPLOAD RESUME --------------------
app.post("/upload-resume", upload.single("resume"), async (req, res) => {
  try {
    const { email } = req.body;
    const resumePath = req.file ? `uploads/cv/${req.file.filename}` : null;

    if (!resumePath) return res.status(400).json({ error: "No file uploaded" });

    const user = await Student.findOneAndUpdate(
      { email },
      { resume: resumePath },
      { new: true }
    );

    if (!user) return res.status(404).json({ error: "User not found" });

    res.json({ message: "✅ Resume uploaded successfully", resumePath });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// -------------------- APPLICATION FORM SUBMISSION --------------------
app.post(
  "/submit-application",
  upload.fields([
    { name: "photo" },
    { name: "cv" },
    { name: "internship_certificate" },
  ]),
  async (req, res) => {
    try {
      const data = req.body;
      const files = req.files;

      const newApp = new Application({
        ...data,
        photo: files.photo ? files.photo[0].path : null,
        cv: files.cv ? files.cv[0].path : null,
        internship_certificate: files.internship_certificate
          ? files.internship_certificate[0].path
          : null,
      });

      await newApp.save();
      res.json({ success: true, message: "✅ Application submitted successfully!" });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ success: false, message: "❌ Server error while submitting application" });
    }
  }
);

// -------------------- GET JOBS --------------------
app.get("/jobs", async (req, res) => {
  try {
    const jobs = await Job.find({}).sort({ createdAt: -1 });
    res.json(jobs);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching jobs");
  }
});

// -------------------- ADMIN ROUTES --------------------
app.post("/apply-job", async (req, res) => {
  try {
    const { studentEmail, jobId } = req.body;

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    // Check if already applied
    const existingApplication = await JobApplication.findOne({
      studentEmail,
      companyName: job.companyName,
      jobTitle: job.jobTitle
    });

    if (existingApplication) {
      return res.status(400).json({ success: false, message: "Already applied for this job" });
    }

    const application = new JobApplication({
      studentEmail,
      jobId,
      companyName: job.companyName,
      jobTitle: job.jobTitle,
      status: 'Applied'
    });

    await application.save();
    res.json({ success: true, message: "Application submitted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Application failed" });
  }
});

// -------------------- GET PLACEMENT SCHEDULE --------------------
app.get("/placement-schedule", async (req, res) => {
  try {
    const schedule = await PlacementSchedule.find({}).sort({ eventDate: 1 });
    res.json(schedule);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch schedule" });
  }
});

// -------------------- GET STUDENT OFFERS --------------------
app.get("/student-offers", async (req, res) => {
  try {
    const { email } = req.query;
    const offers = await Offer.find({ studentEmail: email }).sort({ createdAt: -1 });
    res.json(offers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch offers" });
  }
});

// -------------------- GET STUDENT APPLICATIONS --------------------
app.get("/student-applications", async (req, res) => {
  try {
    const { email } = req.query;
    const applications = await JobApplication.find({ studentEmail: email }).sort({ applicationDate: -1 });
    res.json(applications);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch applications" });
  }
});

// -------------------- GET ANNOUNCEMENTS --------------------
app.get("/announcements", async (req, res) => {
  try {
    const announcements = await Announcement.find({}).sort({ date: -1 });
    res.json(announcements);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch announcements" });
  }
});

// -------------------- CHANGE PASSWORD --------------------
app.post("/change-password", async (req, res) => {
  try {
    const { email, currentPassword, newPassword } = req.body;

    const student = await Student.findOne({ email });
    if (!student) {
      return res.status(404).json({ success: false, message: "Student not found" });
    }

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, student.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Current password is incorrect" });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    await Student.findOneAndUpdate(
      { email },
      { password: hashedPassword },
      { new: true }
    );

    res.json({ success: true, message: "Password changed successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to change password" });
  }
});

// -------------------- DOWNLOAD OFFER --------------------
app.get("/download-offer/:id", async (req, res) => {
  try {
    const offer = await Offer.findById(req.params.id);
    if (!offer) {
      return res.status(404).send("Offer not found");
    }

    const filePath = path.join(__dirname, offer.offerPath);
    if (fs.existsSync(filePath)) {
      res.download(filePath);
    } else {
      res.status(404).send("Offer file not found");
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Error downloading offer");
  }
});

// -------------------- ADMIN ROUTES --------------------

// -------------------- GET ALL JOBS (Admin) --------------------
app.get("/admin/jobs", async (req, res) => {
  try {
    const jobs = await Job.find({}).sort({ createdAt: -1 });
    res.json(jobs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch jobs" });
  }
});

// -------------------- ADD NEW JOB (Admin) --------------------
app.post("/admin/jobs", async (req, res) => {
  try {
    const { companyName, jobTitle, location, applicationDeadline } = req.body;

    const newJob = new Job({
      companyName,
      jobTitle,
      location,
      applicationDeadline: new Date(applicationDeadline)
    });

    await newJob.save();
    res.json({ success: true, message: "Job added successfully", job: newJob });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to add job" });
  }
});

// -------------------- UPDATE JOB (Admin) --------------------
app.put("/admin/jobs/:id", async (req, res) => {
  try {
    const { companyName, jobTitle, location, applicationDeadline } = req.body;

    const updatedJob = await Job.findByIdAndUpdate(
      req.params.id,
      {
        companyName,
        jobTitle,
        location,
        applicationDeadline: new Date(applicationDeadline)
      },
      { new: true }
    );

    if (!updatedJob) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    res.json({ success: true, message: "Job updated successfully", job: updatedJob });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to update job" });
  }
});

// -------------------- DELETE JOB (Admin) --------------------
app.delete("/admin/jobs/:id", async (req, res) => {
  try {
    const deletedJob = await Job.findByIdAndDelete(req.params.id);

    if (!deletedJob) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    res.json({ success: true, message: "Job deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to delete job" });
  }
});

// -------------------- GET ALL APPLICATIONS (Admin) --------------------
app.get("/admin/applications", async (req, res) => {
  try {
    const applications = await Application.find({}).sort({ submittedAt: -1 });
    res.json(applications);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch applications" });
  }
});

// -------------------- GET ALL JOB APPLICATIONS (Admin) --------------------
app.get("/admin/job-applications", async (req, res) => {
  try {
    const applications = await JobApplication.find({}).sort({ applicationDate: -1 });
    res.json(applications);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch job applications" });
  }
});

// -------------------- ADD JOB APPLICATION (Admin) --------------------
app.post("/admin/job-applications", async (req, res) => {
  try {
    const { studentEmail, companyName, jobTitle, status, applicationDate } = req.body;

    const newApplication = new JobApplication({
      studentEmail,
      companyName,
      jobTitle,
      status: status || 'Applied',
      applicationDate: new Date(applicationDate)
    });

    await newApplication.save();
    res.json({ success: true, message: "Job application added successfully", application: newApplication });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to add job application" });
  }
});

// -------------------- UPDATE JOB APPLICATION STATUS (Admin) --------------------
app.put("/admin/job-applications/:id", async (req, res) => {
  try {
    const { status } = req.body;

    const updatedApplication = await JobApplication.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!updatedApplication) {
      return res.status(404).json({ success: false, message: "Application not found" });
    }

    res.json({ success: true, message: "Application status updated successfully", application: updatedApplication });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to update application status" });
  }
});

// -------------------- GET ALL STUDENTS (Admin) --------------------
app.get("/admin/students", async (req, res) => {
  try {
    const students = await Student.find({}).sort({ fullName: 1 });
    res.json(students);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch students" });
  }
});

// -------------------- UPDATE APPLICATION STATUS (Admin) --------------------
app.put("/admin/applications/:id", async (req, res) => {
  try {
    const { status } = req.body;

    const updatedApplication = await Application.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!updatedApplication) {
      return res.status(404).json({ success: false, message: "Application not found" });
    }

    res.json({ success: true, message: "Application status updated successfully", application: updatedApplication });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to update application status" });
  }
});

// -------------------- ADD ANNOUNCEMENT (Admin) --------------------
app.post("/admin/announcements", async (req, res) => {
  try {
    const { title, message } = req.body;

    const newAnnouncement = new Announcement({
      title,
      message,
      date: new Date()
    });

    await newAnnouncement.save();
    res.json({ success: true, message: "Announcement added successfully", announcement: newAnnouncement });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to add announcement" });
  }
});

// -------------------- DELETE ANNOUNCEMENT (Admin) --------------------
app.delete("/admin/announcements/:id", async (req, res) => {
  try {
    const deletedAnnouncement = await Announcement.findByIdAndDelete(req.params.id);

    if (!deletedAnnouncement) {
      return res.status(404).json({ success: false, message: "Announcement not found" });
    }

    res.json({ success: true, message: "Announcement deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to delete announcement" });
  }
});

// -------------------- ADD PLACEMENT SCHEDULE (Admin) --------------------
app.post("/admin/placement-schedule", async (req, res) => {
  try {
    const { company, eventDate, location, status } = req.body;

    const newSchedule = new PlacementSchedule({
      company,
      eventDate: new Date(eventDate),
      location,
      status: status || 'Upcoming'
    });

    await newSchedule.save();
    res.json({ success: true, message: "Placement schedule added successfully", schedule: newSchedule });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to add placement schedule" });
  }
});

// -------------------- UPDATE PLACEMENT SCHEDULE (Admin) --------------------
app.put("/admin/placement-schedule/:id", async (req, res) => {
  try {
    const { company, eventDate, location, status } = req.body;

    const updatedSchedule = await PlacementSchedule.findByIdAndUpdate(
      req.params.id,
      {
        company,
        eventDate: new Date(eventDate),
        location,
        status
      },
      { new: true }
    );

    if (!updatedSchedule) {
      return res.status(404).json({ success: false, message: "Schedule not found" });
    }

    res.json({ success: true, message: "Placement schedule updated successfully", schedule: updatedSchedule });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to update placement schedule" });
  }
});

// -------------------- DELETE PLACEMENT SCHEDULE (Admin) --------------------
app.delete("/admin/placement-schedule/:id", async (req, res) => {
  try {
    const deletedSchedule = await PlacementSchedule.findByIdAndDelete(req.params.id);

    if (!deletedSchedule) {
      return res.status(404).json({ success: false, message: "Schedule not found" });
    }

    res.json({ success: true, message: "Placement schedule deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to delete placement schedule" });
  }
});

// -------------------- ADD OFFER (Admin) --------------------
app.post("/admin/offers", async (req, res) => {
  try {
    const { studentEmail, companyName, position, status, offerPath } = req.body;

    const newOffer = new Offer({
      studentEmail,
      companyName,
      position,
      status: status || 'Pending',
      offerPath,
      createdAt: new Date()
    });

    await newOffer.save();
    res.json({ success: true, message: "Offer added successfully", offer: newOffer });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to add offer" });
  }
});

// -------------------- UPDATE STUDENT PROFILE (Admin) --------------------
app.put("/admin/students/:id", async (req, res) => {
  try {
    const { fullName, email, studentID, program } = req.body;

    const updatedStudent = await Student.findByIdAndUpdate(
      req.params.id,
      { fullName, email, studentID, program },
      { new: true }
    );

    if (!updatedStudent) {
      return res.status(404).json({ success: false, message: "Student not found" });
    }

    res.json({ success: true, message: "Student updated successfully", student: updatedStudent });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to update student" });
  }
});

// -------------------- DELETE STUDENT (Admin) --------------------
app.delete("/admin/students/:id", async (req, res) => {
  try {
    const deletedStudent = await Student.findByIdAndDelete(req.params.id);

    if (!deletedStudent) {
      return res.status(404).json({ success: false, message: "Student not found" });
    }

    res.json({ success: true, message: "Student deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to delete student" });
  }
});

// -------------------- GET DASHBOARD STATS (Admin) --------------------
app.get("/admin/stats", async (req, res) => {
  try {
    const totalStudents = await Student.countDocuments();
    const totalJobs = await Job.countDocuments();
    const totalApplications = await Application.countDocuments();
    const totalJobApplications = await JobApplication.countDocuments();
    const upcomingSchedules = await PlacementSchedule.countDocuments({ status: 'Upcoming' });

    res.json({
      totalStudents,
      totalJobs,
      totalApplications,
      totalJobApplications,
      upcomingSchedules
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch statistics" });
  }
});

// -------------------- SEED DATA (for testing) --------------------
app.post("/seed-data", async (req, res) => {
  try {
    // Clear existing data
    await Job.deleteMany({});
    await PlacementSchedule.deleteMany({});
    await Announcement.deleteMany({});
    await Offer.deleteMany({});

    // Seed jobs
    const jobs = [
      {
        companyName: 'Creonox',
        jobTitle: 'Full Stack Developer',
        location: 'Mumbai',
        applicationDeadline: new Date('2025-04-20')
      },
      {
        companyName: 'Tech Solutions Inc',
        jobTitle: 'Software Engineer',
        location: 'Pune',
        applicationDeadline: new Date('2025-05-15')
      },
      {
        companyName: 'InnovateTech',
        jobTitle: 'Frontend Developer',
        location: 'Bangalore',
        applicationDeadline: new Date('2025-06-10')
      }
    ];

    await Job.insertMany(jobs);

    // Seed placement schedule
    const schedules = [
      {
        company: 'creonox',
        eventDate: new Date('2025-04-10'),
        location: 'Mumbai',
        status: 'Upcoming'
      },
      {
        company: 'Tech Solutions Inc',
        eventDate: new Date('2025-05-05'),
        location: 'Pune',
        status: 'Upcoming'
      },
      {
        company: 'InnovateTech',
        eventDate: new Date('2025-06-15'),
        location: 'Bangalore',
        status: 'Upcoming'
      }
    ];

    await PlacementSchedule.insertMany(schedules);

    // Seed announcements
    const announcements = [
      {
        title: 'Placement Drive Starting Soon',
        message: 'Placement drive will start soon. Check the placement schedule for more details.'
      },
      {
        title: 'New Job Openings',
        message: 'New job openings have been posted. Apply before the deadline.'
      },
      {
        title: 'Resume Workshop',
        message: 'Resume building workshop scheduled for next week. All students are encouraged to attend.'
      }
    ];

    await Announcement.insertMany(announcements);

    res.json({ success: true, message: "Data seeded successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to seed data" });
  }
});

// -------------------- DEFAULT FALLBACK --------------------
app.use((req, res) => {
  res.status(404).send("❌ Page not found");
});

// -------------------- START SERVER --------------------
const PORT = 5000;
app.listen(PORT, () => console.log("🚀 Server running at http://localhost:" + PORT));
