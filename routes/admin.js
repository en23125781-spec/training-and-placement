const express = require('express');
const bcrypt = require('bcryptjs');
const { Student, Job, JobApplication, Application, PlacementSchedule, Announcement, Offer } = require('../models');
const { authenticateAdmin } = require('../middleware/auth');
const { jobSchema, jobApplicationSchema, announcementSchema, placementScheduleSchema, offerSchema } = require('../middleware/validation');

const router = express.Router();

// @route   POST /api/admin/login
// @desc    Admin login
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Simple admin authentication (for demo purposes)
    if (username === process.env.ADMIN_USERNAME && password === process.env.ADMIN_PASSWORD) {
      const adminData = {
        username: username,
        loginTime: new Date().toISOString(),
        sessionId: require('crypto').randomBytes(32).toString('hex')
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
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({
      success: false,
      message: "Server error during login"
    });
  }
});

// @route   GET /api/admin/jobs
// @desc    Get all jobs
// @access  Private (Admin)
router.get('/jobs', authenticateAdmin, async (req, res) => {
  try {
    const jobs = await Job.find({})
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
      message: "Failed to fetch jobs"
    });
  }
});

// @route   POST /api/admin/jobs
// @desc    Create new job
// @access  Private (Admin)
router.post('/jobs', authenticateAdmin, async (req, res) => {
  try {
    const { error } = jobSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        details: error.details.map(detail => detail.message)
      });
    }

    const jobData = {
      ...req.body,
      applicationDeadline: new Date(req.body.applicationDeadline)
    };

    const newJob = new Job(jobData);
    await newJob.save();

    res.status(201).json({
      success: true,
      message: "Job created successfully",
      data: newJob
    });
  } catch (error) {
    console.error('Create job error:', error);

    if (error.code === 11000) {
      res.status(400).json({
        success: false,
        message: "Job with this title and company already exists"
      });
    } else {
      res.status(500).json({
        success: false,
        message: "Failed to create job"
      });
    }
  }
});

// @route   PUT /api/admin/jobs/:id
// @desc    Update job
// @access  Private (Admin)
router.put('/jobs/:id', authenticateAdmin, async (req, res) => {
  try {
    const { error } = jobSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        details: error.details.map(detail => detail.message)
      });
    }

    const updateData = {
      ...req.body,
      applicationDeadline: new Date(req.body.applicationDeadline)
    };

    const updatedJob = await Job.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedJob) {
      return res.status(404).json({
        success: false,
        message: "Job not found"
      });
    }

    res.json({
      success: true,
      message: "Job updated successfully",
      data: updatedJob
    });
  } catch (error) {
    console.error('Update job error:', error);

    if (error.code === 11000) {
      res.status(400).json({
        success: false,
        message: "Job with this title and company already exists"
      });
    } else {
      res.status(500).json({
        success: false,
        message: "Failed to update job"
      });
    }
  }
});

// @route   DELETE /api/admin/jobs/:id
// @desc    Delete job
// @access  Private (Admin)
router.delete('/jobs/:id', authenticateAdmin, async (req, res) => {
  try {
    const deletedJob = await Job.findByIdAndDelete(req.params.id);

    if (!deletedJob) {
      return res.status(404).json({
        success: false,
        message: "Job not found"
      });
    }

    // Also delete related job applications
    await JobApplication.deleteMany({ jobId: req.params.id });

    res.json({
      success: true,
      message: "Job deleted successfully"
    });
  } catch (error) {
    console.error('Delete job error:', error);
    res.status(500).json({
      success: false,
      message: "Failed to delete job"
    });
  }
});

// @route   GET /api/admin/applications
// @desc    Get all applications
// @access  Private (Admin)
router.get('/applications', authenticateAdmin, async (req, res) => {
  try {
    const applications = await Application.find({})
      .sort({ submittedAt: -1 })
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
      message: "Failed to fetch applications"
    });
  }
});

// @route   GET /api/admin/job-applications
// @desc    Get all job applications
// @access  Private (Admin)
router.get('/job-applications', authenticateAdmin, async (req, res) => {
  try {
    const applications = await JobApplication.find({})
      .sort({ applicationDate: -1 })
      .populate('jobId', 'companyName jobTitle')
      .select('-__v');

    res.json({
      success: true,
      count: applications.length,
      data: applications
    });
  } catch (error) {
    console.error('Get job applications error:', error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch job applications"
    });
  }
});

// @route   PUT /api/admin/job-applications/:id
// @desc    Update job application status
// @access  Private (Admin)
router.put('/job-applications/:id', authenticateAdmin, async (req, res) => {
  try {
    const { status, notes } = req.body;

    const validStatuses = ['Applied', 'In Review', 'Interview Scheduled', 'Selected', 'Rejected'];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status. Must be one of: " + validStatuses.join(', ')
      });
    }

    const updateData = {};
    if (status) updateData.status = status;
    if (notes) updateData.notes = notes;

    const updatedApplication = await JobApplication.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedApplication) {
      return res.status(404).json({
        success: false,
        message: "Job application not found"
      });
    }

    res.json({
      success: true,
      message: "Job application updated successfully",
      data: updatedApplication
    });
  } catch (error) {
    console.error('Update job application error:', error);
    res.status(500).json({
      success: false,
      message: "Failed to update job application"
    });
  }
});

// @route   GET /api/admin/students
// @desc    Get all students
// @access  Private (Admin)
router.get('/students', authenticateAdmin, async (req, res) => {
  try {
    const students = await Student.find({})
      .sort({ fullName: 1 })
      .select('-password -__v');

    res.json({
      success: true,
      count: students.length,
      data: students
    });
  } catch (error) {
    console.error('Get students error:', error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch students"
    });
  }
});

// @route   PUT /api/admin/students/:id
// @desc    Update student
// @access  Private (Admin)
router.put('/students/:id', authenticateAdmin, async (req, res) => {
  try {
    const { fullName, email, studentID, program } = req.body;

    const updatedStudent = await Student.findByIdAndUpdate(
      req.params.id,
      { fullName, email, studentID, program },
      { new: true, runValidators: true }
    );

    if (!updatedStudent) {
      return res.status(404).json({
        success: false,
        message: "Student not found"
      });
    }

    res.json({
      success: true,
      message: "Student updated successfully",
      data: updatedStudent
    });
  } catch (error) {
    console.error('Update student error:', error);

    if (error.code === 11000) {
      res.status(400).json({
        success: false,
        message: "Email or Student ID already exists"
      });
    } else {
      res.status(500).json({
        success: false,
        message: "Failed to update student"
      });
    }
  }
});

// @route   DELETE /api/admin/students/:id
// @desc    Delete student
// @access  Private (Admin)
router.delete('/students/:id', authenticateAdmin, async (req, res) => {
  try {
    const deletedStudent = await Student.findByIdAndDelete(req.params.id);

    if (!deletedStudent) {
      return res.status(404).json({
        success: false,
        message: "Student not found"
      });
    }

    res.json({
      success: true,
      message: "Student deleted successfully"
    });
  } catch (error) {
    console.error('Delete student error:', error);
    res.status(500).json({
      success: false,
      message: "Failed to delete student"
    });
  }
});

// @route   GET /api/admin/schedule
// @desc    Get placement schedule
// @access  Private (Admin)
router.get('/schedule', authenticateAdmin, async (req, res) => {
  try {
    const schedule = await PlacementSchedule.find({})
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
      message: "Failed to fetch placement schedule"
    });
  }
});

// @route   POST /api/admin/schedule
// @desc    Create placement schedule
// @access  Private (Admin)
router.post('/schedule', authenticateAdmin, async (req, res) => {
  try {
    const { error } = placementScheduleSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        details: error.details.map(detail => detail.message)
      });
    }

    const scheduleData = {
      ...req.body,
      eventDate: new Date(req.body.eventDate)
    };

    const newSchedule = new PlacementSchedule(scheduleData);
    await newSchedule.save();

    res.status(201).json({
      success: true,
      message: "Placement schedule created successfully",
      data: newSchedule
    });
  } catch (error) {
    console.error('Create schedule error:', error);
    res.status(500).json({
      success: false,
      message: "Failed to create placement schedule"
    });
  }
});

// @route   PUT /api/admin/schedule/:id
// @desc    Update placement schedule
// @access  Private (Admin)
router.put('/schedule/:id', authenticateAdmin, async (req, res) => {
  try {
    const { error } = placementScheduleSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        details: error.details.map(detail => detail.message)
      });
    }

    const updateData = {
      ...req.body,
      eventDate: new Date(req.body.eventDate)
    };

    const updatedSchedule = await PlacementSchedule.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedSchedule) {
      return res.status(404).json({
        success: false,
        message: "Placement schedule not found"
      });
    }

    res.json({
      success: true,
      message: "Placement schedule updated successfully",
      data: updatedSchedule
    });
  } catch (error) {
    console.error('Update schedule error:', error);
    res.status(500).json({
      success: false,
      message: "Failed to update placement schedule"
    });
  }
});

// @route   DELETE /api/admin/schedule/:id
// @desc    Delete placement schedule
// @access  Private (Admin)
router.delete('/schedule/:id', authenticateAdmin, async (req, res) => {
  try {
    const deletedSchedule = await PlacementSchedule.findByIdAndDelete(req.params.id);

    if (!deletedSchedule) {
      return res.status(404).json({
        success: false,
        message: "Placement schedule not found"
      });
    }

    res.json({
      success: true,
      message: "Placement schedule deleted successfully"
    });
  } catch (error) {
    console.error('Delete schedule error:', error);
    res.status(500).json({
      success: false,
      message: "Failed to delete placement schedule"
    });
  }
});

// @route   POST /api/admin/announcements
// @desc    Create announcement
// @access  Private (Admin)
router.post('/announcements', authenticateAdmin, async (req, res) => {
  try {
    const { error } = announcementSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        details: error.details.map(detail => detail.message)
      });
    }

    const newAnnouncement = new Announcement(req.body);
    await newAnnouncement.save();

    res.status(201).json({
      success: true,
      message: "Announcement created successfully",
      data: newAnnouncement
    });
  } catch (error) {
    console.error('Create announcement error:', error);
    res.status(500).json({
      success: false,
      message: "Failed to create announcement"
    });
  }
});

// @route   DELETE /api/admin/announcements/:id
// @desc    Delete announcement
// @access  Private (Admin)
router.delete('/announcements/:id', authenticateAdmin, async (req, res) => {
  try {
    const deletedAnnouncement = await Announcement.findByIdAndDelete(req.params.id);

    if (!deletedAnnouncement) {
      return res.status(404).json({
        success: false,
        message: "Announcement not found"
      });
    }

    res.json({
      success: true,
      message: "Announcement deleted successfully"
    });
  } catch (error) {
    console.error('Delete announcement error:', error);
    res.status(500).json({
      success: false,
      message: "Failed to delete announcement"
    });
  }
});

// @route   POST /api/admin/offers
// @desc    Create offer
// @access  Private (Admin)
router.post('/offers', authenticateAdmin, async (req, res) => {
  try {
    const { error } = offerSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        details: error.details.map(detail => detail.message)
      });
    }

    const newOffer = new Offer(req.body);
    await newOffer.save();

    res.status(201).json({
      success: true,
      message: "Offer created successfully",
      data: newOffer
    });
  } catch (error) {
    console.error('Create offer error:', error);
    res.status(500).json({
      success: false,
      message: "Failed to create offer"
    });
  }
});

// @route   GET /api/admin/stats
// @desc    Get dashboard statistics
// @access  Private (Admin)
router.get('/stats', authenticateAdmin, async (req, res) => {
  try {
    const [
      totalStudents,
      totalJobs,
      totalApplications,
      totalJobApplications,
      upcomingSchedules,
      pendingOffers
    ] = await Promise.all([
      Student.countDocuments(),
      Job.countDocuments(),
      Application.countDocuments(),
      JobApplication.countDocuments(),
      PlacementSchedule.countDocuments({ status: 'Upcoming' }),
      Offer.countDocuments({ status: 'Pending' })
    ]);

    res.json({
      success: true,
      data: {
        totalStudents,
        totalJobs,
        totalApplications,
        totalJobApplications,
        upcomingSchedules,
        pendingOffers
      }
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch statistics"
    });
  }
});

// @route   POST /api/admin/seed-data
// @desc    Seed database with sample data
// @access  Private (Admin)
router.post('/seed-data', authenticateAdmin, async (req, res) => {
  try {
    // Clear existing data
    await Promise.all([
      Job.deleteMany({}),
      PlacementSchedule.deleteMany({}),
      Announcement.deleteMany({}),
      Offer.deleteMany({})
    ]);

    // Seed jobs
    const jobs = [
      {
        companyName: 'TechCorp Solutions',
        jobTitle: 'Full Stack Developer',
        location: 'Mumbai',
        applicationDeadline: new Date('2025-04-20'),
        description: 'Join our dynamic team as a Full Stack Developer',
        requirements: 'React, Node.js, MongoDB, 2+ years experience'
      },
      {
        companyName: 'DataTech Innovations',
        jobTitle: 'Software Engineer',
        location: 'Pune',
        applicationDeadline: new Date('2025-05-15'),
        description: 'Work on cutting-edge data solutions',
        requirements: 'Python, SQL, Machine Learning basics'
      },
      {
        companyName: 'WebFlow Systems',
        jobTitle: 'Frontend Developer',
        location: 'Bangalore',
        applicationDeadline: new Date('2025-06-10'),
        description: 'Create beautiful and responsive web applications',
        requirements: 'React, TypeScript, CSS, UI/UX knowledge'
      }
    ];

    await Job.insertMany(jobs);

    // Seed placement schedule
    const schedules = [
      {
        company: 'TechCorp Solutions',
        eventDate: new Date('2025-04-10'),
        location: 'Mumbai',
        status: 'Upcoming',
        description: 'Campus recruitment drive'
      },
      {
        company: 'DataTech Innovations',
        eventDate: new Date('2025-05-05'),
        location: 'Pune',
        status: 'Upcoming',
        description: 'Technical interview process'
      },
      {
        company: 'WebFlow Systems',
        eventDate: new Date('2025-06-15'),
        location: 'Bangalore',
        status: 'Upcoming',
        description: 'Full day recruitment event'
      }
    ];

    await PlacementSchedule.insertMany(schedules);

    // Seed announcements
    const announcements = [
      {
        title: 'Placement Drive Starting Soon',
        message: 'Our placement season will begin next month. Make sure your profiles are updated and be prepared for upcoming opportunities.',
        priority: 'High'
      },
      {
        title: 'Resume Building Workshop',
        message: 'Join us for a comprehensive resume building workshop next Friday. Learn how to create impactful resumes that get noticed.',
        priority: 'Medium'
      },
      {
        title: 'New Job Openings Available',
        message: 'Several new job opportunities have been posted. Check the jobs section and apply before deadlines.',
        priority: 'High'
      }
    ];

    await Announcement.insertMany(announcements);

    res.json({
      success: true,
      message: "Database seeded successfully with sample data"
    });
  } catch (error) {
    console.error('Seed data error:', error);
    res.status(500).json({
      success: false,
      message: "Failed to seed database"
    });
  }
});

module.exports = router;
