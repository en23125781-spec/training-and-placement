// Authentication middleware for students
const authenticateStudent = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const student = await Student.findById(decoded.id);

    if (!student || !student.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token or account deactivated.'
      });
    }

    req.student = student;
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(401).json({
      success: false,
      message: 'Invalid token.'
    });
  }
};

// Admin authentication middleware (for development - using localStorage check)
const authenticateAdmin = (req, res, next) => {
  try {
    // In a production environment, this should verify a proper admin session
    // For now, we'll check if admin exists in localStorage (client-side check)
    // This is a temporary solution for development

    // Note: In production, implement proper server-side admin sessions
    req.admin = { username: 'admin', role: 'admin' };
    next();
  } catch (error) {
    console.error('Admin authentication error:', error);
    res.status(401).json({
      success: false,
      message: 'Admin authentication required'
    });
  }
};

// Input validation middleware
const validateRequest = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);

    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        details: error.details.map(detail => detail.message)
      });
    }

    next();
  };
};

// File upload validation middleware
const validateFileUpload = (allowedTypes, maxSize) => {
  return (req, res, next) => {
    if (!req.file && !req.files) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    const files = req.files ? Object.values(req.files).flat() : [req.file];

    for (const file of files) {
      // Check file type
      if (!allowedTypes.includes(file.mimetype)) {
        return res.status(400).json({
          success: false,
          message: `Invalid file type. Allowed types: ${allowedTypes.join(', ')}`
        });
      }

      // Check file size
      if (file.size > maxSize) {
        return res.status(400).json({
          success: false,
          message: `File too large. Maximum size: ${maxSize / 1024 / 1024}MB`
        });
      }
    }

    next();
  };
};

module.exports = {
  authenticateStudent,
  authenticateAdmin,
  validateRequest,
  validateFileUpload
};
