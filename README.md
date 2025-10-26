# Training & Placement Management System (TNPA)

A comprehensive web-based system for managing college placement activities, built with Node.js, Express, MongoDB, and modern frontend technologies.

## 🚀 Features

### Student Features
- **User Registration & Login**: Secure authentication with password hashing
- **Profile Management**: Upload profile pictures and manage personal information
- **Application System**: Submit detailed job applications with document uploads
- **Job Browsing**: View and apply for available job positions
- **Application Tracking**: Monitor application status in real-time
- **Placement Schedule**: View upcoming placement drives and events
- **Offer Management**: Download offer letters when selected
- **Announcements**: Stay updated with latest notifications
- **Resume Upload**: Upload and manage resumes
- **Settings**: Change password and manage notification preferences

### Admin Features (via MongoDB)
- **Company Management**: Add and manage company listings
- **Job Management**: Post and manage job openings
- **Application Review**: Review and process student applications
- **Placement Scheduling**: Schedule placement drives and events
- **Analytics**: View placement statistics and reports
- **Announcements**: Send notifications to all students

## 🛠️ Technology Stack

### Backend
- **Node.js**: Runtime environment
- **Express.js**: Web framework
- **MongoDB**: NoSQL database (Atlas cluster)
- **Mongoose**: MongoDB object modeling
- **Multer**: File upload handling
- **bcryptjs**: Password hashing
- **CORS**: Cross-origin resource sharing

### Frontend
- **HTML5**: Semantic markup
- **CSS3**: Modern styling with responsive design
- **JavaScript (ES6+)**: Dynamic functionality
- **Fetch API**: HTTP requests

## 📋 Prerequisites

Before running this application, make sure you have:
- Node.js (version 14 or higher)
- MongoDB Atlas account (or local MongoDB installation)
- npm or yarn package manager

## ⚡ Installation

1. **Clone the repository**
   ```bash
   git clone <your-repository-url>
   cd TNPA
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create uploads directories**
   ```bash
   mkdir -p uploads/profile_pics uploads/photos uploads/cv uploads/internships uploads/offers
   ```

4. **Environment Setup**
   - The application connects to MongoDB Atlas by default
   - If you want to use local MongoDB, update the connection string in `server.js`
   - Make sure MongoDB is running (either Atlas or local instance)

## 🚀 Running the Application

1. **Start the server**
   ```bash
   npm start
   ```
   Or for development with auto-reload:
   ```bash
   npm run dev
   ```

2. **Access the application**
   - Open your browser and go to: `http://localhost:5000`
   - The server will automatically serve the login page

3. **Seed the database (optional)**
   ```bash
   npm run seed
   ```
   This will populate the database with sample jobs, schedules, and announcements.

## 📁 Project Structure

```
TNPA/
├── server.js              # Main server file with all API endpoints
├── package.json           # Dependencies and scripts
├── login.html            # Login page
├── register.html         # Registration page
├── student_dashboard.html # Main student dashboard
├── student_dashboard.js  # Dashboard JavaScript functionality
├── uploads/              # File storage directory
│   ├── profile_pics/    # Profile pictures
│   ├── photos/          # Application photos
│   ├── cv/              # Resumes
│   ├── internships/     # Internship certificates
│   └── offers/          # Offer letters
├── pages/               # Admin pages (PHP-based)
├── sql/                 # Database schema files
└── README.md            # This file
```

## 🔌 API Endpoints

### Authentication
- `POST /register` - Student registration
- `POST /login` - Student login
- `POST /change-password` - Change password

### Profile Management
- `POST /uploadProfile` - Upload profile picture
- `POST /upload-resume` - Upload resume

### Job Management
- `GET /jobs` - Get all available jobs
- `POST /apply-job` - Apply for a specific job

### Applications
- `POST /submit-application` - Submit detailed application
- `GET /student-applications` - Get student's applications

### Information
- `GET /placement-schedule` - Get placement schedule
- `GET /announcements` - Get announcements
- `GET /student-offers` - Get student's offer letters
- `GET /download-offer/:id` - Download offer letter

### Utilities
- `POST /seed-data` - Seed database with sample data

## 🗄️ Database Schema

### Students Collection
```javascript
{
  fullName: String,
  email: String (unique),
  studentID: String,
  program: String,
  password: String (hashed),
  profilePic: String,
  resume: String,
  createdAt: Date
}
```

### Jobs Collection
```javascript
{
  companyName: String,
  jobTitle: String,
  location: String,
  applicationDeadline: Date,
  createdAt: Date
}
```

### Applications Collection
```javascript
{
  studentEmail: String,
  companyName: String,
  jobTitle: String,
  status: String,
  applicationDate: Date,
  // ... other application details
}
```

## 🔧 Configuration

### MongoDB Connection
The application connects to MongoDB Atlas by default. To change:
1. Open `server.js`
2. Find the mongoose.connect line (around line 25)
3. Replace the connection string with your MongoDB URI

### File Upload Limits
- Maximum file size: 10MB (configured in server.js)
- Allowed file types: Images (JPEG, PNG), PDFs, DOC, DOCX

### Port Configuration
- Default port: 5000
- To change: Modify the PORT variable in server.js

## 🧪 Testing

1. **Create a test student account**
   - Go to registration page
   - Fill in details and register

2. **Test job application flow**
   - Login with your credentials
   - Browse available jobs
   - Submit applications
   - Track application status

3. **Test file uploads**
   - Upload profile picture
   - Upload resume
   - Submit applications with documents

## 🔒 Security Features

- **Password Hashing**: Uses bcryptjs for secure password storage
- **Input Validation**: Server-side validation for all inputs
- **File Upload Security**: Restricted file types and size limits
- **CORS Protection**: Configured for cross-origin requests
- **Error Handling**: Comprehensive error handling and logging

## 🐛 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Check your internet connection
   - Verify MongoDB Atlas credentials
   - Ensure the IP whitelist includes your current IP

2. **File Upload Errors**
   - Check if uploads directories exist and have write permissions
   - Verify file size is under 10MB limit
   - Ensure file type is allowed

3. **Port Already in Use**
   - Change the PORT variable in server.js
   - Or kill the process using the port

4. **Dependencies Issues**
   ```bash
   npm install
   # or
   rm -rf node_modules package-lock.json && npm install
   ```

### Logs
- Server logs are displayed in the console
- MongoDB connection status is logged on startup
- API errors are logged with details

## 📝 Development Notes

- The system uses a hybrid approach with both static HTML/JS files and MongoDB backend
- Student dashboard dynamically loads content using JavaScript
- File uploads are stored locally in the uploads/ directory
- All student data is stored in MongoDB Atlas for scalability

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Support

For support or questions:
- Check the troubleshooting section above
- Review server logs for error details
- Ensure all dependencies are properly installed

---

**Built with ❤️ for educational institutions and students**
