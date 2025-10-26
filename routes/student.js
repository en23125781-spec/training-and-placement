const express = require('express');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { Student, Job, JobApplication, Application, PlacementSchedule, Announcement, Offer } = require('../models');
const { authenticateStudent, validateFileUpload } = require('../middleware/auth');
const { studentRegistrationSchema, studentLoginSchema, passwordChangeSchema } = require('../middleware/validation');

const router = express.Router();

// Configure multer for file uploads
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
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      'image/jpeg', 'image/png', 'image/gif',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];

    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'), false);
    }
  }
});

// @route   POST /api/auth/register
// @desc    Register a new student
// @access  Public
router.post('/register', async (req, res) => {
  try {
    const { error } = studentRegistrationSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        details: error.details.map(detail => detail.message)
      });
    }

    const { fullName, email, studentID, program, password } = req.body;

    // Check if student already exists
    const existingStudent = await Student.findOne({
      $or: [{ email: email.toLowerCase() }, { studentID: studentID.toUpperCase() }]
    });

    if (existingStudent) {
      return res.status(400).json({
        success: false,
        message: existingStudent.email === email.toLowerCase()
          ? 'Email already registered'
          : 'Student ID already exists'
      });
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create new student
    const newStudent = new Student({
      fullName: fullName.trim(),
      email: email.toLowerCase(),
      studentID: studentID.toUpperCase(),
      program: program.trim(),
      password: hashedPassword,
    });

    await newStudent.save();

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      student: {
        id: newStudent._id,
        fullName: newStudent.fullName,
        email: newStudent.email,
        studentID: newStudent.studentID,
        program: newStudent.program,
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Registration failed. Please try again.'
    });
  }
});

// @route   POST /api/auth/login
// @desc    Login student
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { error } = studentLoginSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        details: error.details.map(detail => detail.message)
      });
    }

    const { email, password } = req.body;

    // Find student
    const student = await Student.findOne({ email: email.toLowerCase() });

    if (!student) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    if (!student.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Account has been deactivated. Please contact admin.'
      });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, student.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Update last login
    await Student.findByIdAndUpdate(student._id, { lastLogin: new Date() });

    res.json({
      success: true,
      message: 'Login successful',
      student: {
        id: student._id,
        fullName: student.fullName,
        email: student.email,
        studentID: student.studentID,
        program: student.program,
        profilePic: student.profilePic,
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Login failed. Please try again.'
    });
  }
});

// @route   POST /api/profile/upload
// @desc    Upload profile picture
// @access  Private (Student)
router.post('/profile/upload', authenticateStudent, upload.single('profileImage'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No image file provided'
      });
    }

    const profilePicPath = `uploads/profile_pics/${req.file.filename}`;

    // Update student's profile picture
    const updatedStudent = await Student.findByIdAndUpdate(
      req.student._id,
      { profilePic: profilePicPath },
      { new: true }
    );

    if (!updatedStudent) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    res.json({
      success: true,
      message: 'Profile picture updated successfully',
      profilePic: updatedStudent.profilePic
    });
  } catch (error) {
    console.error('Profile upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload profile picture'
    });
  }
});

// @route   POST /api/resume/upload
// @desc    Upload resume
// @access  Private (Student)
router.post('/resume/upload', authenticateStudent, upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No resume file provided'
      });
    }

    const resumePath = `uploads/cv/${req.file.filename}`;

    // Update student's resume
    const updatedStudent = await Student.findByIdAndUpdate(
      req.student._id,
      { resume: resumePath },
      { new: true }
    );

    if (!updatedStudent) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    res.json({
      success: true,
      message: 'Resume uploaded successfully',
      resumePath: updatedStudent.resume
    });
  } catch (error) {
    console.error('Resume upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload resume'
    });
  }
});

// @route   POST /api/applications/submit
// @desc    Submit job application
// @access  Private (Student)
router.post('/applications/submit', authenticateStudent, upload.fields([
  { name: 'photo', maxCount: 1 },
  { name: 'cv', maxCount: 1 },
  { name: 'internship_certificate', maxCount: 1 }
]), async (req, res) => {
  try {
    const applicationData = req.body;

    // Check if student already has a pending application
    const existingApplication = await Application.findOne({
      email: req.student.email,
      status: 'Pending'
    });

    if (existingApplication) {
      return res.status(400).json({
        success: false,
        message: 'You already have a pending application. Please wait for approval before submitting another.'
      });
    }

    // Create new application
    const newApplication = new Application({
      ...applicationData,
      email: req.student.email,
      photo: req.files.photo ? req.files.photo[0].path : null,
      cv: req.files.cv ? req.files.cv[0].path : null,
      internship_certificate: req.files.internship_certificate
        ? req.files.internship_certificate[0].path
        : null,
    });

    await newApplication.save();

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully',
      applicationId: newApplication._id
    });
  } catch (error) {
    console.error('Application submission error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit application. Please try again.'
    });
  }
});

// @route   GET /api/jobs
// @desc    Get all available jobs
// @access  Public
router.get('/jobs', async (req, res) => {
  try {
    const jobs = await Job.find({ isActive: true })
      .sort({ createdAt: -1 })
      .select('-__v');

    res.json({
      success: true,
      count: jobs.length,
      data: jobs
    });
  } catch (error) {
    console.error('Get jobs error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch jobs'
    });
  }
});

// @route   POST /api/jobs/apply
// @desc    Apply for a job
// @access  Private (Student)
router.post('/jobs/apply', authenticateStudent, async (req, res) => {
  try {
    const { jobId } = req.body;

    if (!jobId) {
      return res.status(400).json({
        success: false,
        message: 'Job ID is required'
      });
    }

    // Find the job
    const job = await Job.findById(jobId);
    if (!job || !job.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Job not found or no longer available'
      });
    }

    // Check if application deadline has passed
    if (new Date() > job.applicationDeadline) {
      return res.status(400).json({
        success: false,
        message: 'Application deadline has passed'
      });
    }

    // Check if student already applied for this job
    const existingApplication = await JobApplication.findOne({
      studentEmail: req.student.email,
      jobId: jobId
    });

    if (existingApplication) {
      return res.status(400).json({
        success: false,
        message: 'You have already applied for this job'
      });
    }

    // Create job application
    const application = new JobApplication({
      studentEmail: req.student.email,
      jobId: jobId,
      companyName: job.companyName,
      jobTitle: job.jobTitle,
      status: 'Applied'
    });

    await application.save();

    res.status(201).json({
      success: true,
      message: 'Job application submitted successfully',
      applicationId: application._id
    });
  } catch (error) {
    console.error('Job application error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit job application'
    });
  }
});

// @route   GET /api/schedule
// @desc    Get placement schedule
// @access  Public
router.get('/schedule', async (req, res) => {
  try {
    const schedule = await PlacementSchedule.find({ status: { $ne: 'Cancelled' } })
      .sort({ eventDate: 1 })
      .select('-__v');

    res.json({
      success: true,
      count: schedule.length,
      data: schedule
    });
  } catch (error) {
    console.error('Get schedule error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch placement schedule'
    });
  }
});

// @route   GET /api/offers
// @desc    Get student offers
// @access  Private (Student)
router.get('/offers', authenticateStudent, async (req, res) => {
  try {
    const offers = await Offer.find({ studentEmail: req.student.email })
      .sort({ createdAt: -1 })
      .select('-__v');

    res.json({
      success: true,
      count: offers.length,
      data: offers
    });
  } catch (error) {
    console.error('Get offers error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch offers'
    });
  }
});

// @route   GET /api/applications/status
// @desc    Get student job applications
// @access  Private (Student)
router.get('/applications/status', authenticateStudent, async (req, res) => {
  try {
    const applications = await JobApplication.find({ studentEmail: req.student.email })
      .sort({ applicationDate: -1 })
      .select('-__v');

    res.json({
      success: true,
      count: applications.length,
      data: applications
    });
  } catch (error) {
    console.error('Get applications error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch applications'
    });
  }
});

// @route   GET /api/announcements
// @desc    Get announcements
// @access  Public
router.get('/announcements', async (req, res) => {
  try {
    const announcements = await Announcement.find({ isActive: true })
      .sort({ createdAt: -1 })
      .select('-__v');

    res.json({
      success: true,
      count: announcements.length,
      data: announcements
    });
  } catch (error) {
    console.error('Get announcements error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch announcements'
    });
  }
});

// @route   POST /api/auth/change-password
// @desc    Change student password
// @access  Private (Student)
router.post('/auth/change-password', authenticateStudent, async (req, res) => {
  try {
    const { error } = passwordChangeSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        details: error.details.map(detail => detail.message)
      });
    }

    const { currentPassword, newPassword } = req.body;

    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, req.student.password);

    if (!isCurrentPasswordValid) {
      return res.status(400).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    // Hash new password
    const saltRounds = 12;
    const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);

    // Update password
    await Student.findByIdAndUpdate(req.student._id, { password: hashedNewPassword });

    res.json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to change password'
    });
  }
});

// @route   GET /api/offers/:id/download
// @desc    Download offer letter
// @access  Private (Student)
router.get('/offers/:id/download', authenticateStudent, async (req, res) => {
  try {
    const offer = await Offer.findOne({
      _id: req.params.id,
      studentEmail: req.student.email
    });

    if (!offer) {
      return res.status(404).json({
        success: false,
        message: 'Offer not found'
      });
    }

    const filePath = path.join(__dirname, '..', offer.offerPath);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: 'Offer file not found'
      });
    }

    res.download(filePath, `offer_${offer.companyName}_${req.student.fullName}.pdf`);
  } catch (error) {
    console.error('Download offer error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to download offer'
    });
  }
});

module.exports = router;
