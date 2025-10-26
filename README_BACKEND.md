# TNPA Placement System - Backend

A modern, modular Node.js backend for the Training & Placement Administration (TNPA) system.

## Features

- ✅ **Modular Architecture**: Clean separation of concerns
- ✅ **Environment Configuration**: Secure credential management
- ✅ **Input Validation**: Comprehensive request validation
- ✅ **Error Handling**: Centralized error management
- ✅ **Security**: Rate limiting, CORS, security headers
- ✅ **File Upload**: Secure file handling with validation
- ✅ **Authentication**: Student and admin authentication
- ✅ **Database**: MongoDB with Mongoose ODM
- ✅ **API Documentation**: RESTful API design
- ✅ **Graceful Shutdown**: Proper connection management

## Project Structure

```
backend/
├── config/
│   └── database.js          # Database connection configuration
├── middleware/
│   ├── auth.js             # Authentication middleware
│   ├── validation.js       # Input validation schemas
│   └── errorHandler.js     # Error handling middleware
├── models/
│   └── index.js            # Database models with validation
├── routes/
│   ├── student.js          # Student-related routes
│   └── admin.js            # Admin-related routes
├── uploads/                # File upload directory
├── .env                    # Environment variables
└── server_new.js           # Main server file
```

## Installation

1. **Install Dependencies**
```bash
npm install
```

2. **Environment Setup**
```bash
# Copy and configure environment variables
cp .env.example .env
```

3. **Configure Environment Variables**
Edit `.env` file:
```env
NODE_ENV=development
PORT=5000

# Database Configuration
MONGODB_URI=your_mongodb_connection_string

# Admin Configuration
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your_admin_password

# Security Configuration
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

## Usage

### Start Development Server
```bash
# Using the new modular server
node server_new.js

# Or using npm script
npm run dev
```

### API Endpoints

#### Authentication
- `POST /api/auth/register` - Student registration
- `POST /api/auth/login` - Student login
- `POST /api/admin/login` - Admin login
- `POST /api/auth/change-password` - Change password

#### Student Routes
- `GET /api/jobs` - Get available jobs
- `POST /api/jobs/apply` - Apply for a job
- `GET /api/schedule` - Get placement schedule
- `GET /api/announcements` - Get announcements
- `GET /api/offers` - Get student offers
- `GET /api/applications/status` - Get application status
- `POST /api/profile/upload` - Upload profile picture
- `POST /api/resume/upload` - Upload resume
- `POST /api/applications/submit` - Submit detailed application

#### Admin Routes
- `GET /api/admin/jobs` - Get all jobs
- `POST /api/admin/jobs` - Create job
- `PUT /api/admin/jobs/:id` - Update job
- `DELETE /api/admin/jobs/:id` - Delete job
- `GET /api/admin/applications` - Get all applications
- `GET /api/admin/job-applications` - Get job applications
- `PUT /api/admin/job-applications/:id` - Update application status
- `GET /api/admin/students` - Get all students
- `PUT /api/admin/students/:id` - Update student
- `DELETE /api/admin/students/:id` - Delete student
- `GET /api/admin/schedule` - Get placement schedule
- `POST /api/admin/schedule` - Create schedule
- `PUT /api/admin/schedule/:id` - Update schedule
- `DELETE /api/admin/schedule/:id` - Delete schedule
- `POST /api/admin/announcements` - Create announcement
- `DELETE /api/admin/announcements/:id` - Delete announcement
- `POST /api/admin/offers` - Create offer
- `GET /api/admin/stats` - Get dashboard statistics
- `POST /api/admin/seed-data` - Seed database with sample data

### Legacy Route Compatibility

The new backend maintains compatibility with legacy routes by redirecting them to the new API endpoints:

- Old routes automatically redirect to new API routes
- All existing frontend code continues to work
- Gradual migration path available

## Security Features

- **Rate Limiting**: Prevents abuse with configurable limits
- **CORS Protection**: Secure cross-origin resource sharing
- **Input Validation**: Comprehensive request validation
- **File Upload Security**: Type and size validation
- **Error Handling**: No sensitive data exposure
- **Security Headers**: Helmet.js protection

## Database Models

### Student Model
```javascript
{
  fullName: String (required, max 100 chars),
  email: String (required, unique, validated),
  studentID: String (required, unique, uppercase),
  program: String (required),
  password: String (required, hashed),
  profilePic: String (optional),
  resume: String (optional),
  isActive: Boolean (default: true),
  lastLogin: Date (optional)
}
```

### Job Model
```javascript
{
  companyName: String (required, max 100 chars),
  jobTitle: String (required, max 100 chars),
  location: String (required),
  applicationDeadline: Date (required, future date),
  description: String (optional, max 1000 chars),
  requirements: String (optional, max 500 chars),
  isActive: Boolean (default: true)
}
```

## Error Handling

The backend implements comprehensive error handling:

- **Validation Errors**: Detailed field-level validation messages
- **Database Errors**: Proper MongoDB error handling
- **File Upload Errors**: Secure file handling error management
- **Authentication Errors**: Clear authentication failure messages
- **Rate Limiting**: User-friendly rate limit messages

## Response Format

All API responses follow a consistent format:

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... },
  "count": 10
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "details": ["Field validation errors"],
  "errors": [...]
}
```

## Development

### Adding New Routes

1. **Create route file** in `routes/` directory
2. **Add validation schemas** in `middleware/validation.js`
3. **Implement authentication** in `middleware/auth.js`
4. **Register routes** in `server_new.js`

### Adding New Models

1. **Define schema** in `models/index.js`
2. **Add validation rules** as needed
3. **Export model** for use in routes

### Environment Variables

Key environment variables:

- `NODE_ENV`: Environment mode (development/production)
- `PORT`: Server port (default: 5000)
- `MONGODB_URI`: MongoDB connection string
- `ADMIN_USERNAME`: Admin login username
- `ADMIN_PASSWORD`: Admin login password
- `RATE_LIMIT_*`: Rate limiting configuration

## Migration Guide

### From Old to New Backend

1. **Backup Database**: Ensure MongoDB data is backed up
2. **Install Dependencies**: Run `npm install`
3. **Configure Environment**: Set up `.env` file
4. **Test API Endpoints**: Verify all routes work
5. **Update Frontend**: No changes needed (legacy compatibility)

### Database Migration

The new backend is fully compatible with existing MongoDB data. All existing collections and documents will work without changes.

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Verify `MONGODB_URI` in `.env`
   - Check MongoDB Atlas network access
   - Ensure database user permissions

2. **Port Already in Use**
   - Change `PORT` in `.env`
   - Kill existing process on port 5000

3. **File Upload Issues**
   - Check `uploads/` directory permissions
   - Verify file size limits in configuration

4. **CORS Issues**
   - Update `corsOptions` in `middleware/errorHandler.js`
   - Add frontend domain to allowed origins

### Health Checks

- **Server Health**: `GET /health`
- **API Status**: `GET /api/status`
- **Database Connection**: Check server logs

## Production Deployment

1. **Set Environment**: `NODE_ENV=production`
2. **Configure Production Database**: Update `MONGODB_URI`
3. **Set Secure Admin Credentials**: Update admin username/password
4. **Configure CORS**: Update allowed origins
5. **Enable SSL**: Use reverse proxy with HTTPS

## Contributing

1. **Follow Code Style**: Consistent indentation and naming
2. **Add Validation**: All inputs must be validated
3. **Error Handling**: Proper error responses
4. **Documentation**: Update README for new features
5. **Testing**: Add tests for new functionality

## License

This project is part of the TNPA Placement System.
