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
    res.status(500).json({ error: "Failed to fetch jobs" });
  }
});

// -------------------- APPLY FOR JOB --------------------
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

// -------------------- DEFAULT FALLBACK --------------------
app.use((req, res) => {
  res.status(404).send("❌ Page not found");
});

// -------------------- START SERVER --------------------
const PORT = 5000;
app.listen(PORT, () => console.log("🚀 Server running at http://localhost:" + PORT));
