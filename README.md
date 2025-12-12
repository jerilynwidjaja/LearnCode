# AI-Powered E-Learning Coding Platform

A comprehensive e-learning platform with AI-powered course recommendations, personalized learning paths, intelligent progress feedback, and an integrated mentor-mentee matching system. Built with modern web technologies and OpenAI integration.

## 🚀 Features

### Core Learning Features
- **Interactive Code Editor**: Monaco Editor with multi-language support
- **Real-time Code Execution**: Execute and test code with immediate feedback
- **Progress Tracking**: Detailed analytics on learning progress and performance
- **Multi-difficulty Courses**: Beginner, intermediate, and advanced level content

### AI-Powered Features
- **Intelligent Course Recommendations**: OpenAI GPT-3.5 powered course suggestions
- **Personalized Learning Paths**: AI-generated structured learning journeys
- **Progress Feedback**: Detailed AI analysis of learning patterns and suggestions
- **Adaptive Content**: Recommendations based on user performance and preferences

### Mentor-Mentee Program
- **Smart Matching System**: Algorithm-based mentor-mentee matching with compatibility scores
- **Dual Role Support**: Users can be mentors, mentees, or both
- **Real-time Messaging**: Built-in chat system for seamless communication
- **Request Management**: Send, accept, or decline mentorship requests
- **Profile Management**: Detailed profiles with expertise, experience, and learning goals
- **Match Analytics**: Track mentorship relationships and activity status
- **Availability Tracking**: Monitor mentor capacity and mentee engagement

### User Experience
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **User Preferences**: Customizable learning goals and skill tracking
- **Progress Dashboard**: Comprehensive analytics and insights
- **Authentication**: Secure JWT-based authentication system
- **Dark Mode**: Full dark mode support throughout the application

## 🛠 Technology Stack

### Frontend
- **React 18** - Modern React with hooks and functional components
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Vite** - Fast build tool and development server
- **React Router** - Client-side routing
- **Axios** - HTTP client for API requests
- **Monaco Editor** - VS Code-powered code editor
- **Lucide React** - Beautiful icon library
- **React Hot Toast** - Elegant notifications

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **Sequelize** - SQL ORM for database operations
- **SQLite** - Lightweight database for development
- **JWT** - JSON Web Tokens for authentication
- **bcryptjs** - Password hashing
- **OpenAI API** - AI-powered recommendations and feedback
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variable management

### Development Tools
- **ESLint** - Code linting and formatting
- **TypeScript ESLint** - TypeScript-specific linting rules
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixing

## 📁 Project Structure
```
├── src/                          # Frontend source code
│   ├── components/               # React components
│   │   ├── Login.tsx            # Authentication login
│   │   ├── Register.tsx         # User registration with role selection
│   │   ├── Profile.tsx          # Main dashboard
│   │   ├── CourseDetail.tsx     # Course overview
│   │   ├── QuestionView.tsx     # Code editor and execution
│   │   ├── ProgressDashboard.tsx # AI analytics dashboard
│   │   ├── MentorDashboard.tsx  # Mentor-mentee management
│   │   └── UserPreferencesModal.tsx # User settings
│   ├── contexts/                # React contexts
│   │   ├── AuthContext.tsx      # Authentication state management
│   │   └── ThemeContext.tsx     # Dark mode and theme management
│   ├── services/                # API services
│   │   ├── authService.ts       # Authentication API calls
│   │   ├── courseService.ts     # Course API calls
│   │   └── mentorService.ts     # Mentor-mentee API calls
│   ├── App.tsx                  # Main application component
│   ├── main.tsx                 # Application entry point
│   └── index.css                # Global styles
├── server/                       # Backend source code
│   ├── models/                  # Database models
│   │   ├── User.js              # User model with role support
│   │   ├── Mentor.js            # Mentor profile model
│   │   ├── Mentee.js            # Mentee profile model
│   │   ├── MentorMatch.js       # Mentor-mentee matching model
│   │   ├── ChatMessage.js       # Real-time messaging model
│   │   ├── Course.js            # Course model
│   │   ├── Question.js          # Question model
│   │   ├── UserProgress.js      # Progress tracking model
│   │   └── index.js             # Model associations
│   ├── routes/                  # API routes
│   │   ├── auth.js              # Authentication endpoints
│   │   ├── courses.js           # Course management
│   │   ├── questions.js         # Question handling
│   │   ├── progress.js          # Progress analytics
│   │   └── mentor.js            # Mentor-mentee endpoints
│   ├── services/                # Business logic
│   │   ├── aiRecommendationService.js # AI integration
│   │   ├── authService.js       # Authentication logic
│   │   └── mentorService.js     # Mentor matching logic
│   ├── middleware/              # Express middleware
│   │   └── auth.js              # JWT authentication
│   ├── seedData.js              # Database seeding
│   └── server.js                # Express server setup
├── package.json                 # Frontend dependencies
├── server/package.json          # Backend dependencies
├── tailwind.config.js           # Tailwind configuration
├── vite.config.ts               # Vite configuration
└── README.md                    # Project documentation
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- OpenAI API key

### Installation

1. **Clone the repository**
```bash
   git clone 
   cd elearning-platform
```

2. **Install frontend dependencies**
```bash
   npm install
```

3. **Install backend dependencies**
```bash
   cd server
   npm install
```

4. **Environment Setup**
   
   Create a `.env` file in the `server` directory:
```env
   # Database
   DATABASE_URL=sqlite:./database.sqlite

   # JWT Secret
   JWT_SECRET=your-super-secret-jwt-key-here

   # OpenAI API Configuration
   OPENAI_API_KEY=your-openai-api-key-here

   # Server Configuration
   PORT=5000
   NODE_ENV=development
```

5. **Database Setup**
```bash
   # From the server directory
   node seedData.js
```

6. **Start the development servers**
   
   Terminal 1 (Backend):
```bash
   cd server
   npm run dev
```
   
   Terminal 2 (Frontend):
```bash
   npm run dev
```

7. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5001

## 🎯 Usage

### Getting Started
1. **Register** a new account and select your role (Mentor, Mentee, Both, or None)
2. **Set up your profile** with skills, experience, and learning goals
3. **Complete preferences** including availability and areas of interest
4. **Explore AI recommendations** tailored to your profile
5. **Connect with mentors/mentees** through the matching system
6. **Start learning** with interactive challenges
7. **Track your progress** with detailed analytics

### Key Features

#### Mentor-Mentee Matching System

##### For Mentees:
1. **Browse Available Mentors**
   - View mentor profiles with experience, skills, and availability
   - See compatibility match scores (0-100%)
   - Filter by expertise, industry, and location
   - Check mentor availability (current mentees vs. capacity)

2. **Send Mentorship Requests**
   - Craft personalized request messages
   - Explain your learning goals and why you chose them
   - Track request status (pending, accepted, declined)

3. **Manage Your Mentors**
   - View all accepted mentorships
   - Access real-time chat for communication
   - Review match details and progress

##### For Mentors:
1. **Receive Mentorship Requests**
   - Review mentee profiles and learning goals
   - See compatibility scores and match details
   - Read personalized request messages

2. **Accept or Decline Requests**
   - Respond with personalized messages
   - Manage mentee capacity (default: 3 mentees)
   - Track active mentorships

3. **Mentor Dashboard**
   - View all your mentees
   - Monitor engagement and activity
   - Access chat for guidance and support

##### Matching Algorithm:
The platform uses an intelligent scoring system that considers:
- **Experience Level** (5-20 points): Years of professional experience
- **Mentoring Experience** (5-15 points): Previous mentoring background
- **Skills Match** (up to 10 points): Overlap between mentor expertise and mentee goals
- **Profile Completeness** (5 points): Detailed bio and information
- **Availability** (10 points / -20 points): Current capacity status
- **Randomization** (0-10 points): Variety in recommendations

**Score Ranges:**
- 90-100%: Excellent match
- 75-89%: Very good match
- 60-74%: Good match
- Below 60%: Fair match

##### Real-time Messaging:
- **Direct Chat**: One-on-one communication between mentor and mentee
- **Message History**: Complete conversation archive
- **Read Receipts**: Track message status
- **Active Indicators**: See when matches are active
- **Message Timestamps**: Track communication timeline

##### Match Lifecycle:
1. **Pending**: Request sent, awaiting mentor response
2. **Accepted**: Mentor accepted the request
3. **Active**: Both parties are actively communicating
4. **Completed**: Mentorship concluded (decrements mentor's mentee count)
5. **Declined**: Request was declined by mentor

#### AI Course Recommendations
- Personalized course suggestions based on your profile
- Intelligent scoring system considering multiple factors
- Adaptive recommendations that evolve with your progress
- Integration with mentor recommendations

#### Learning Paths
- Structured, phase-based learning journeys
- Prerequisites and learning objectives for each phase
- Estimated duration and priority levels
- Aligned with mentor guidance

#### Progress Analytics
- Completion rates by category and difficulty
- Learning streak tracking
- Recent activity monitoring
- Detailed performance insights
- Mentorship activity tracking

#### Code Challenges
- Multi-language support (JavaScript, Python, Java, C++, etc.)
- Real-time code execution and testing
- Immediate feedback on solutions
- Progress tracking per question
- Difficulty-based progression

## 🔧 Configuration

### OpenAI Integration
The platform uses OpenAI GPT-3.5 Turbo for:
- Course recommendations
- Learning path generation
- Progress feedback and insights

### Supported Programming Languages
- JavaScript (Node.js)
- Python
- Java
- C++
- C
- C#
- Kotlin
- Ruby
- Rust
- PHP
- Go
- TypeScript
- SQL
- Swift

### Database Schema

#### Core Models
- **Users**: Authentication and profile data with role support (mentor/mentee/both/none)
- **Courses**: Course metadata and structure
- **Questions**: Coding challenges and test cases
- **UserProgress**: Tracking completion and attempts

#### Mentor-Mentee Models
- **Mentors**: Mentor profiles with expertise, experience, and availability
  - Fields: yearsOfExperience, areasOfStrength, areasOfExpertise, mentoringExperience, availability, bio, industry, currentRole, company, rating, currentMenteeCount, maxMentees
- **Mentees**: Mentee profiles with goals and learning preferences
  - Fields: careerStage, learningGoals, skills, timeAvailability, level, interests, bio
- **MentorMatch**: Match records between mentors and mentees
  - Fields: mentorId, menteeId, status, matchScore, requestMessage, responseMessage, matchedAt, completedAt
- **ChatMessage**: Real-time messaging between matched pairs
  - Fields: senderId, receiverId, matchId, message, messageType, isRead, readAt

### Model Relationships
```
User 1:1 Mentor (foreignKey: userId)
User 1:1 Mentee (foreignKey: userId)
Mentor 1:N MentorMatch (foreignKey: mentorId)
Mentee 1:N MentorMatch (foreignKey: menteeId)
MentorMatch 1:N ChatMessage (foreignKey: matchId)
User 1:N ChatMessage as sender (foreignKey: senderId)
User 1:N ChatMessage as receiver (foreignKey: receiverId)
```

## 🚀 Deployment

### Frontend (Netlify/Vercel)
```bash
npm run build
# Deploy the dist/ folder
```

### Backend (Heroku/Railway/Render)
```bash
# Set environment variables
# Deploy with your preferred platform
```

### Environment Variables
Ensure all required environment variables are set in production:
- `OPENAI_API_KEY`
- `JWT_SECRET`
- `DATABASE_URL`
- `NODE_ENV=production`
- `PORT` (optional, defaults to 5000)

### Production Considerations
- Use PostgreSQL or MySQL instead of SQLite
- Enable HTTPS for secure communication
- Set up proper CORS configuration
- Implement rate limiting for API endpoints
- Use environment-specific configurations
- Set up monitoring and logging

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Contribution Guidelines
- Follow existing code style and conventions
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting

## 📝 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - User registration with role selection
  - Body: `{ email, password, firstName, lastName, role }`
  - Returns: `{ token, user }`
- `POST /api/auth/login` - User login
  - Body: `{ email, password }`
  - Returns: `{ token, user }`
- `POST /api/auth/preferences` - Update user preferences
  - Headers: `Authorization: Bearer <token>`
  - Body: Preference fields based on role
- `GET /api/auth/profile` - Get user profile
  - Headers: `Authorization: Bearer <token>`
  - Returns: Complete user profile with role-specific data
- `POST /api/auth/change-password` - Change user password
  - Headers: `Authorization: Bearer <token>`
  - Body: `{ currentPassword, newPassword }`

### Course Endpoints
- `GET /api/courses` - Get all courses with user progress
  - Headers: `Authorization: Bearer <token>`
  - Returns: Array of courses with completion status
- `GET /api/courses/recommended` - Get AI-powered course recommendations
  - Headers: `Authorization: Bearer <token>`
  - Returns: Personalized course recommendations with scores
- `GET /api/courses/:id` - Get course details
  - Headers: `Authorization: Bearer <token>`
  - Returns: Course with questions and progress

### Question Endpoints
- `GET /api/questions/:id` - Get question details
  - Headers: `Authorization: Bearer <token>`
  - Returns: Question with test cases
- `POST /api/questions/:id/submit` - Submit code solution
  - Headers: `Authorization: Bearer <token>`
  - Body: `{ code, language }`
  - Returns: Test results and completion status

### Progress Endpoints
- `GET /api/progress/feedback` - Get AI-powered progress feedback
  - Headers: `Authorization: Bearer <token>`
  - Returns: Detailed AI analysis of learning patterns
- `GET /api/progress/learning-path` - Get personalized learning path
  - Headers: `Authorization: Bearer <token>`
  - Returns: Phase-based learning journey
- `GET /api/progress/analytics` - Get detailed analytics
  - Headers: `Authorization: Bearer <token>`
  - Returns: Comprehensive progress statistics

### Mentor-Mentee Endpoints
- `GET /api/mentor/mentors` - Get available mentors (for mentees)
  - Headers: `Authorization: Bearer <token>`
  - Returns: List of active mentors with match scores
- `GET /api/mentor/matches` - Get user's matches (as mentor or mentee)
  - Headers: `Authorization: Bearer <token>`
  - Returns: All matches with status and details
- `POST /api/mentor/request` - Request mentorship (mentee to mentor)
  - Headers: `Authorization: Bearer <token>`
  - Body: `{ mentorUserId, message }`
  - Returns: Created match record
- `POST /api/mentor/respond` - Respond to mentorship request (mentor)
  - Headers: `Authorization: Bearer <token>`
  - Body: `{ matchId, status, message }`
  - Returns: Updated match record
- `GET /api/mentor/chat/:matchId` - Get chat messages for a match
  - Headers: `Authorization: Bearer <token>`
  - Returns: Array of messages with sender info
- `POST /api/mentor/chat/:matchId` - Send a chat message
  - Headers: `Authorization: Bearer <token>`
  - Body: `{ message, messageType }`
  - Returns: Created message record
- `POST /api/mentor/complete/:matchId` - Complete/end mentorship
  - Headers: `Authorization: Bearer <token>`
  - Returns: Updated match with completed status

## 🔒 Security

### Authentication & Authorization
- JWT-based authentication with 7-day expiration
- Password hashing with bcrypt (12 salt rounds)
- Protected routes requiring authentication
- Role-based access control for mentor/mentee features

### Data Protection
- Input validation and sanitization
- SQL injection prevention through Sequelize ORM
- XSS protection in user inputs
- CORS configuration for trusted origins
- Environment variable protection

### Best Practices
- Secure password requirements
- Token refresh mechanism
- Rate limiting on sensitive endpoints
- Audit logging for critical operations
- Regular security updates

## 📊 Performance

### Frontend Optimization
- Optimized React components with proper memoization
- Code splitting and lazy loading
- Responsive design for all devices
- Efficient state management
- Minimized bundle size

### Backend Optimization
- Efficient database queries with Sequelize
- Proper indexing on frequently queried fields
- Connection pooling for database
- Caching strategies for static data
- API response compression

### Database Optimization
- Indexed foreign keys for relationships
- Efficient query patterns
- Pagination for large datasets
- Optimized associations and includes

## 🐛 Troubleshooting

### Common Issues

1. **OpenAI API Key Error**
   - Ensure your OpenAI API key is valid and has sufficient credits
   - Check the `.env` file configuration
   - Verify API key permissions

2. **Database Connection Issues**
   - Verify SQLite database file permissions
   - Run the seed script to initialize data
   - Check database path configuration

3. **CORS Errors**
   - Check that the backend server is running on the correct port
   - Verify CORS configuration in server.js
   - Ensure frontend is making requests to correct backend URL

4. **Authentication Failures**
   - Verify JWT_SECRET is set in environment variables
   - Check token expiration (7-day default)
   - Ensure Authorization header format: `Bearer <token>`

5. **Mentor-Mentee Matching Issues**
   - Verify user has proper role set (mentor/mentee/both)
   - Check that mentor/mentee profiles were created during registration
   - Ensure userId fields match between User and Mentor/Mentee tables

6. **Chat Not Loading**
   - Verify match status is 'accepted' or 'active'
   - Check that user is part of the match
   - Ensure WebSocket/polling mechanism is working

### Debug Mode
Enable detailed logging by setting in `.env`:
```env
NODE_ENV=development
DEBUG=true
```

## 📈 Future Enhancements

### Planned Features
- **Video Calling**: Integrate video chat for mentor-mentee sessions
- **Screen Sharing**: Allow code review and pair programming
- **Calendar Integration**: Schedule mentorship sessions
- **Notification System**: Email and push notifications for messages and requests
- **Advanced Analytics**: More detailed progress tracking and insights
- **Gamification**: Badges, achievements, and leaderboards
- **Mobile App**: Native iOS and Android applications
- **Group Mentoring**: Support for multiple mentees per session
- **Resource Sharing**: File uploads and document sharing
- **Feedback System**: Rating and review system for mentorships
- **AI Chat Assistant**: Integrated AI tutor for instant help

### Technical Improvements
- WebSocket implementation for real-time features
- Redis caching layer
- Elasticsearch for advanced search
- Microservices architecture
- GraphQL API option
- Comprehensive testing suite
- CI/CD pipeline setup

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **OpenAI** for providing the GPT-3.5 API
- **Monaco Editor** team for the excellent code editor
- **React** and **Node.js** communities
- **Sequelize** for the robust ORM
- **Tailwind CSS** for the utility-first CSS framework
- All contributors and testers
