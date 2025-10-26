const mongoose = require('mongoose');

// Student Schema with validation
const studentSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, 'Full name is required'],
    trim: true,
    maxlength: [100, 'Full name cannot exceed 100 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  studentID: {
    type: String,
    required: [true, 'Student ID is required'],
    unique: true,
    uppercase: true
  },
  program: {
    type: String,
    required: [true, 'Program is required'],
    trim: true
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters']
  },
  profilePic: {
    type: String,
    default: null
  },
  resume: {
    type: String,
    default: null
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

// Job Schema with validation
const jobSchema = new mongoose.Schema({
  companyName: {
    type: String,
    required: [true, 'Company name is required'],
    trim: true,
    maxlength: [100, 'Company name cannot exceed 100 characters']
  },
  jobTitle: {
    type: String,
    required: [true, 'Job title is required'],
    trim: true,
    maxlength: [100, 'Job title cannot exceed 100 characters']
  },
  location: {
    type: String,
    required: [true, 'Location is required'],
    trim: true
  },
  applicationDeadline: {
    type: Date,
    required: [true, 'Application deadline is required'],
    validate: {
      validator: function(value) {
        return value > new Date();
      },
      message: 'Application deadline must be in the future'
    }
  },
  description: {
    type: String,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  requirements: {
    type: String,
    maxlength: [500, 'Requirements cannot exceed 500 characters']
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Job Application Schema
const jobApplicationSchema = new mongoose.Schema({
  studentEmail: {
    type: String,
    required: [true, 'Student email is required'],
    lowercase: true
  },
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: [true, 'Job ID is required']
  },
  companyName: {
    type: String,
    required: [true, 'Company name is required']
  },
  jobTitle: {
    type: String,
    required: [true, 'Job title is required']
  },
  status: {
    type: String,
    enum: ['Applied', 'In Review', 'Interview Scheduled', 'Selected', 'Rejected'],
    default: 'Applied'
  },
  applicationDate: {
    type: Date,
    default: Date.now
  },
  notes: {
    type: String,
    maxlength: [500, 'Notes cannot exceed 500 characters']
  }
}, {
  timestamps: true
});

// Detailed Application Schema
const applicationSchema = new mongoose.Schema({
  full_name: {
    type: String,
    required: [true, 'Full name is required'],
    trim: true
  },
  dob: {
    type: String,
    required: [true, 'Date of birth is required']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    lowercase: true
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required']
  },
  gender: {
    type: String,
    required: [true, 'Gender is required']
  },
  occupation: {
    type: String,
    required: [true, 'Application number is required']
  },
  address: {
    type: String,
    required: [true, 'Address is required']
  },
  ssc_school: {
    type: String,
    required: [true, 'SSC school is required']
  },
  ssc: {
    type: String,
    required: [true, 'SSC percentage is required']
  },
  hsc_college: {
    type: String,
    required: [true, 'HSC college is required']
  },
  hsc: {
    type: String,
    required: [true, 'HSC percentage is required']
  },
  degree: {
    type: String,
    required: [true, 'Degree is required']
  },
  degree_percentage: {
    type: String,
    required: [true, 'Degree percentage is required']
  },
  college: {
    type: String,
    required: [true, 'College name is required']
  },
  cgpa: {
    type: String,
    required: [true, 'CGPA is required']
  },
  year: {
    type: String,
    required: [true, 'Year of passing is required']
  },
  photo: {
    type: String,
    required: [true, 'Photo is required']
  },
  cv: {
    type: String,
    required: [true, 'CV is required']
  },
  internship_certificate: {
    type: String,
    default: null
  },
  status: {
    type: String,
    enum: ['Pending', 'Under Review', 'Approved', 'Rejected'],
    default: 'Pending'
  }
}, {
  timestamps: true
});

// Placement Schedule Schema
const placementScheduleSchema = new mongoose.Schema({
  company: {
    type: String,
    required: [true, 'Company name is required'],
    trim: true
  },
  eventDate: {
    type: Date,
    required: [true, 'Event date is required']
  },
  location: {
    type: String,
    required: [true, 'Location is required']
  },
  status: {
    type: String,
    enum: ['Upcoming', 'Completed', 'Cancelled'],
    default: 'Upcoming'
  },
  description: {
    type: String,
    maxlength: [500, 'Description cannot exceed 500 characters']
  }
}, {
  timestamps: true
});

// Announcement Schema
const announcementSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  message: {
    type: String,
    required: [true, 'Message is required'],
    maxlength: [1000, 'Message cannot exceed 1000 characters']
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Urgent'],
    default: 'Medium'
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Offer Schema
const offerSchema = new mongoose.Schema({
  studentEmail: {
    type: String,
    required: [true, 'Student email is required'],
    lowercase: true
  },
  companyName: {
    type: String,
    required: [true, 'Company name is required']
  },
  position: {
    type: String,
    required: [true, 'Position is required']
  },
  status: {
    type: String,
    enum: ['Pending', 'Accepted', 'Rejected'],
    default: 'Pending'
  },
  offerPath: {
    type: String,
    required: [true, 'Offer path is required']
  },
  salary: {
    type: Number,
    min: [0, 'Salary cannot be negative']
  },
  joiningDate: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

// Admin Session Schema (for better admin management)
const adminSessionSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  loginTime: {
    type: Date,
    default: Date.now
  },
  ipAddress: {
    type: String,
    default: null
  },
  userAgent: {
    type: String,
    default: null
  }
}, {
  timestamps: true
});

module.exports = {
  Student: mongoose.model('Student', studentSchema),
  Job: mongoose.model('Job', jobSchema),
  JobApplication: mongoose.model('JobApplication', jobApplicationSchema),
  Application: mongoose.model('Application', applicationSchema),
  PlacementSchedule: mongoose.model('PlacementSchedule', placementScheduleSchema),
  Announcement: mongoose.model('Announcement', announcementSchema),
  Offer: mongoose.model('Offer', offerSchema),
  AdminSession: mongoose.model('AdminSession', adminSessionSchema)
};
