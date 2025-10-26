const Joi = require('joi');

// Student validation schemas
const studentRegistrationSchema = Joi.object({
  fullName: Joi.string().trim().min(2).max(100).required(),
  email: Joi.string().email().lowercase().required(),
  studentID: Joi.string().uppercase().required(),
  program: Joi.string().trim().required(),
  password: Joi.string().min(6).required()
});

const studentLoginSchema = Joi.object({
  email: Joi.string().email().lowercase().required(),
  password: Joi.string().required()
});

// Job validation schemas
const jobSchema = Joi.object({
  companyName: Joi.string().trim().min(2).max(100).required(),
  jobTitle: Joi.string().trim().min(2).max(100).required(),
  location: Joi.string().trim().required(),
  applicationDeadline: Joi.date().min('now').required(),
  description: Joi.string().max(1000),
  requirements: Joi.string().max(500)
});

const jobApplicationSchema = Joi.object({
  studentEmail: Joi.string().email().lowercase().required(),
  jobId: Joi.string().required(),
  companyName: Joi.string().trim().required(),
  jobTitle: Joi.string().trim().required(),
  status: Joi.string().valid('Applied', 'In Review', 'Interview Scheduled', 'Selected', 'Rejected'),
  notes: Joi.string().max(500)
});

// Application validation schema
const applicationSchema = Joi.object({
  full_name: Joi.string().trim().required(),
  dob: Joi.string().required(),
  email: Joi.string().email().lowercase().required(),
  phone: Joi.string().required(),
  gender: Joi.string().required(),
  occupation: Joi.string().required(),
  address: Joi.string().required(),
  ssc_school: Joi.string().required(),
  ssc: Joi.string().required(),
  hsc_college: Joi.string().required(),
  hsc: Joi.string().required(),
  degree: Joi.string().required(),
  degree_percentage: Joi.string().required(),
  college: Joi.string().required(),
  cgpa: Joi.string().required(),
  year: Joi.string().required(),
  studentEmail: Joi.string().email().lowercase()
});

// Admin validation schemas
const adminLoginSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required()
});

const announcementSchema = Joi.object({
  title: Joi.string().trim().min(5).max(200).required(),
  message: Joi.string().min(10).max(1000).required(),
  priority: Joi.string().valid('Low', 'Medium', 'High', 'Urgent')
});

const placementScheduleSchema = Joi.object({
  company: Joi.string().trim().required(),
  eventDate: Joi.date().required(),
  location: Joi.string().trim().required(),
  status: Joi.string().valid('Upcoming', 'Completed', 'Cancelled'),
  description: Joi.string().max(500)
});

const offerSchema = Joi.object({
  studentEmail: Joi.string().email().lowercase().required(),
  companyName: Joi.string().trim().required(),
  position: Joi.string().trim().required(),
  status: Joi.string().valid('Pending', 'Accepted', 'Rejected'),
  salary: Joi.number().min(0),
  joiningDate: Joi.date()
});

// Password change validation
const passwordChangeSchema = Joi.object({
  currentPassword: Joi.string().required(),
  newPassword: Joi.string().min(6).required(),
  confirmPassword: Joi.string().valid(Joi.ref('newPassword')).required()
});

module.exports = {
  studentRegistrationSchema,
  studentLoginSchema,
  jobSchema,
  jobApplicationSchema,
  applicationSchema,
  adminLoginSchema,
  announcementSchema,
  placementScheduleSchema,
  offerSchema,
  passwordChangeSchema
};
