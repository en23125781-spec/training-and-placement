const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Import database connection
const { connectDB, disconnectDB } = require('./config/database');

// Import middleware
const { errorHandler, notFound, limiter, securityHeaders, corsOptions } = require('./middleware/errorHandler');

// Import route handlers
const studentRoutes = require('./routes/student');
const adminRoutes = require('./routes/admin');

// Initialize Express app
const app = express();

// Trust proxy (for rate limiting and security)
app.set('trust proxy', 1);

// Security middleware
app.use(securityHeaders);

// Rate limiting
app.use('/api/', limiter);

// CORS configuration
app.use(cors(corsOptions));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Serve frontend files
app.use(express.static(path.join(__dirname, '/')));

// API Routes
app.use('/api', studentRoutes);
app.use('/api/admin', adminRoutes);

// Legacy routes (for backward compatibility)
app.post('/register', (req, res) => res.redirect(307, '/api/register'));
app.post('/login', (req, res) => res.redirect(307, '/api/login'));
app.get('/jobs', (req, res) => res.redirect(307, '/api/jobs'));
app.post('/apply-job', (req, res) => res.redirect(307, '/api/jobs/apply'));
app.get('/placement-schedule', (req, res) => res.redirect(307, '/api/schedule'));
app.get('/student-offers', (req, res) => res.redirect(307, '/api/offers'));
app.get('/student-applications', (req, res) => res.redirect(307, '/api/applications/status'));
app.get('/announcements', (req, res) => res.redirect(307, '/api/announcements'));
app.post('/change-password', (req, res) => res.redirect(307, '/api/auth/change-password'));

// Admin legacy routes
app.post('/admin/login', (req, res) => res.redirect(307, '/api/admin/login'));
app.get('/admin/jobs', (req, res) => res.redirect(307, '/api/admin/jobs'));
app.post('/admin/jobs', (req, res) => res.redirect(307, '/api/admin/jobs'));
app.put('/admin/jobs/:id', (req, res) => res.redirect(307, `/api/admin/jobs/${req.params.id}`));
app.delete('/admin/jobs/:id', (req, res) => res.redirect(307, `/api/admin/jobs/${req.params.id}`));
app.get('/admin/applications', (req, res) => res.redirect(307, '/api/admin/applications'));
app.get('/admin/job-applications', (req, res) => res.redirect(307, '/api/admin/job-applications'));
app.put('/admin/job-applications/:id', (req, res) => res.redirect(307, `/api/admin/job-applications/${req.params.id}`));
app.get('/admin/students', (req, res) => res.redirect(307, '/api/admin/students'));
app.put('/admin/students/:id', (req, res) => res.redirect(307, `/api/admin/students/${req.params.id}`));
app.delete('/admin/students/:id', (req, res) => res.redirect(307, `/api/admin/students/${req.params.id}`));
app.post('/admin/announcements', (req, res) => res.redirect(307, '/api/admin/announcements'));
app.delete('/admin/announcements/:id', (req, res) => res.redirect(307, `/api/admin/announcements/${req.params.id}`));
app.post('/admin/placement-schedule', (req, res) => res.redirect(307, '/api/admin/schedule'));
app.put('/admin/placement-schedule/:id', (req, res) => res.redirect(307, `/api/admin/schedule/${req.params.id}`));
app.delete('/admin/placement-schedule/:id', (req, res) => res.redirect(307, `/api/admin/schedule/${req.params.id}`));
app.post('/admin/offers', (req, res) => res.redirect(307, '/api/admin/offers'));
app.get('/admin/stats', (req, res) => res.redirect(307, '/api/admin/stats'));
app.post('/seed-data', (req, res) => res.redirect(307, '/api/admin/seed-data'));

// File upload routes (legacy)
app.post('/uploadProfile', (req, res) => res.redirect(307, '/api/profile/upload'));
app.post('/upload-resume', (req, res) => res.redirect(307, '/api/resume/upload'));
app.post('/submit-application', (req, res) => res.redirect(307, '/api/applications/submit'));
app.get('/download-offer/:id', (req, res) => res.redirect(307, `/api/offers/${req.params.id}/download`));

// Root route - serve login page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'login.html'));
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// API status endpoint
app.get('/api/status', (req, res) => {
  res.json({
    success: true,
    message: 'API is operational',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// 404 handler for unmatched routes
app.use(notFound);

// Global error handler
app.use(errorHandler);

// Graceful shutdown handling
const gracefulShutdown = (signal) => {
  console.log(`\n🛑 Received ${signal}. Starting graceful shutdown...`);

  server.close(async () => {
    console.log('✅ HTTP server closed');

    try {
      await disconnectDB();
      console.log('🔌 Database disconnected');
      process.exit(0);
    } catch (error) {
      console.error('❌ Error during shutdown:', error);
      process.exit(1);
    }
  });

  // Force close after 10 seconds
  setTimeout(() => {
    console.error('❌ Could not close connections in time, forcefully shutting down');
    process.exit(1);
  }, 10000);
};

// Handle shutdown signals
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Handle uncaught exceptions and unhandled rejections
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  gracefulShutdown('UNCAUGHT_EXCEPTION');
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  gracefulShutdown('UNHANDLED_REJECTION');
});

// Start server
const startServer = async () => {
  try {
    // Connect to database
    await connectDB();

    const PORT = process.env.PORT || 5000;

    const server = app.listen(PORT, () => {
      console.log(`
🚀 ========================================
🚀  TNPA Placement System Backend Server
🚀 ========================================
🚀  Server running on: http://localhost:${PORT}
🚀  Environment: ${process.env.NODE_ENV || 'development'}
🚀  API Base URL: http://localhost:${PORT}/api
🚀  Health Check: http://localhost:${PORT}/health
🚀 ========================================
      `);
    });

    // Store server instance for graceful shutdown
    global.server = server;

  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// Start the server
startServer();

module.exports = app;
