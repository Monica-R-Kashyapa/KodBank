# Kodbank Application - Staged Development Plan

## Overview
This document outlines a comprehensive, staged approach to building the Kodbank application - a banking system with user registration, authentication via JWT tokens, and balance checking functionality.

## Technology Stack
- **Frontend**: React.js with modern UI libraries (React Router, Axios)
- **Backend**: Node.js with Express.js
- **Database**: Aiven MySQL
- **Authentication**: JWT (jsonwebtoken)
- **Password Security**: bcrypt
- **Deployment**: Vercel (Frontend + Backend as serverless functions)
- **Cookie Management**: cookie-parser

---

## Stage 1: Project Setup & Infrastructure
**Goal**: Set up the project structure, dependencies, and database connection

### Tasks:
1. **Initialize Project Structure**
   - Create frontend directory (React app)
   - Create backend directory (Node.js/Express)
   - Set up package.json files for both
   - Configure environment variables (.env files)

2. **Install Dependencies**
   - Frontend: React, React Router, Axios, styling library (Tailwind CSS or Material-UI)
   - Backend: Express, mysql2, jsonwebtoken, bcrypt, cookie-parser, dotenv, cors

3. **Database Setup**
   - Connect to Aiven MySQL database
   - Create database connection module
   - Set up connection pooling
   - Test database connectivity

4. **Create Database Schema**
   - Create `KodUser` table:
     - uid (INT PRIMARY KEY AUTO_INCREMENT)
     - username (VARCHAR UNIQUE NOT NULL)
     - email (VARCHAR UNIQUE NOT NULL)
     - password (VARCHAR NOT NULL) - will store hashed password
     - balance (DECIMAL(15,2) DEFAULT 100000)
     - phone (VARCHAR)
     - role (ENUM('Customer', 'Manager', 'Admin') DEFAULT 'Customer')
   - Create `UserToken` table:
     - tid (INT PRIMARY KEY AUTO_INCREMENT)
     - token (TEXT NOT NULL)
     - uid (INT NOT NULL, FOREIGN KEY REFERENCES KodUser(uid))
     - expiry (DATETIME NOT NULL)
     - INDEX on uid for faster lookups

5. **Environment Configuration**
   - Set up .env files for development
   - Configure database connection strings
   - Set JWT secret key
   - Set cookie settings

**Deliverables**: 
- Working project structure
- Database connection established
- Tables created and ready

---

## Stage 2: Backend API - User Registration
**Goal**: Implement user registration endpoint with validation and password hashing

### Tasks:
1. **Create Registration Endpoint**
   - POST `/api/register`
   - Accept: uid, username, password, email, phone, role
   - Validate role is "Customer" only
   - Validate all required fields
   - Validate email format
   - Validate phone format (optional)

2. **Password Security**
   - Hash password using bcrypt (salt rounds: 10)
   - Never store plain text passwords

3. **Database Operations**
   - Check if username already exists
   - Check if email already exists
   - Insert new user with default balance (100000)
   - Handle database errors gracefully

4. **Response Handling**
   - Return success response with user data (excluding password)
   - Return appropriate error messages for validation failures
   - Handle duplicate username/email errors

**Deliverables**:
- Working registration API endpoint
- Password hashing implemented
- Database insertion working
- Proper error handling

---

## Stage 3: Backend API - User Login & JWT Generation
**Goal**: Implement login authentication with JWT token generation and storage

### Tasks:
1. **Create Login Endpoint**
   - POST `/api/login`
   - Accept: username, password
   - Validate username and password are provided

2. **User Authentication**
   - Query database for user by username
   - Compare provided password with hashed password using bcrypt.compare()
   - Return error if user not found or password incorrect

3. **JWT Token Generation**
   - Use jsonwebtoken library
   - Set subject (sub) as username
   - Add role as claim in payload
   - Set expiration time (e.g., 24 hours)
   - Use standard signature algorithm (HS256)
   - Sign with secret key from environment variables

4. **Token Storage**
   - Insert token into UserToken table
   - Store: token (full JWT string), uid (user ID), expiry (calculated expiry time)
   - Handle token storage errors

5. **Cookie Management**
   - Set JWT token as HTTP-only cookie
   - Configure cookie settings:
     - httpOnly: true (prevents XSS attacks)
     - secure: true (HTTPS only in production)
     - sameSite: 'strict' (CSRF protection)
     - maxAge: matching token expiry
     - path: '/'

6. **Response**
   - Return success status (200)
   - Include user data (excluding password)
   - Cookie automatically sent to client

**Deliverables**:
- Working login API endpoint
- JWT token generation
- Token stored in database
- Cookie set successfully

---

## Stage 4: Backend API - Protected Routes & Balance Check
**Goal**: Implement JWT verification middleware and balance check endpoint

### Tasks:
1. **Create JWT Verification Middleware**
   - Extract token from cookie
   - Verify token signature using secret key
   - Check token expiry
   - Extract username from token (subject)
   - Extract role from token claims
   - Handle invalid/expired tokens gracefully

2. **Token Validation**
   - Verify token exists in UserToken table
   - Check if token hasn't expired (compare with database expiry)
   - Optionally: Check if token matches stored token in DB

3. **Create Balance Check Endpoint**
   - GET `/api/balance`
   - Protected route (requires JWT middleware)
   - Extract username from verified token
   - Query KodUser table for balance using username
   - Return balance amount

4. **Error Handling**
   - Handle missing token
   - Handle invalid token
   - Handle expired token
   - Handle user not found
   - Return appropriate HTTP status codes (401 for auth errors, 404 for not found)

**Deliverables**:
- JWT verification middleware
- Protected route implementation
- Balance check API endpoint
- Comprehensive error handling

---

## Stage 5: Frontend - Registration Page
**Goal**: Create user-friendly registration interface

### Tasks:
1. **Create Registration Component**
   - Form with fields: uid, username, password, email, phone
   - Role field (pre-filled/disabled as "Customer")
   - Form validation (client-side)
   - Password strength indicator (optional)
   - Email format validation
   - Phone format validation

2. **API Integration**
   - Connect to POST `/api/register`
   - Handle form submission
   - Display loading state during API call
   - Handle success response
   - Handle error responses (duplicate username/email, validation errors)
   - Display user-friendly error messages

3. **Navigation**
   - On successful registration, redirect to login page
   - Use React Router for navigation

4. **UI/UX**
   - Clean, modern design
   - Responsive layout
   - Form validation feedback
   - Success/error message display

**Deliverables**:
- Functional registration page
- Form validation
- API integration
- Redirect to login on success

---

## Stage 6: Frontend - Login Page
**Goal**: Create login interface with authentication

### Tasks:
1. **Create Login Component**
   - Form with fields: username, password
   - Form validation
   - "Remember me" option (optional)
   - Forgot password link (optional, for future)

2. **API Integration**
   - Connect to POST `/api/login`
   - Send credentials
   - Handle cookie reception (automatic)
   - Display loading state
   - Handle authentication errors
   - Display user-friendly error messages

3. **Navigation**
   - On successful login, redirect to user dashboard
   - Store authentication state (context/state management)

4. **UI/UX**
   - Clean, professional design
   - Responsive layout
   - Error message display
   - Loading indicators

**Deliverables**:
- Functional login page
- Cookie handling
- Redirect to dashboard on success
- Error handling

---

## Stage 7: Frontend - Dashboard & Balance Check
**Goal**: Create user dashboard with balance checking functionality

### Tasks:
1. **Create Dashboard Component**
   - Protected route (requires authentication)
   - Display welcome message with username
   - "Check Balance" button
   - Logout button (optional)

2. **Balance Check Functionality**
   - On button click, call GET `/api/balance`
   - Send JWT token via cookie (automatic)
   - Handle loading state
   - Display balance result

3. **Balance Display Animation**
   - Create animated celebration component
   - Use CSS animations or animation library (Framer Motion)
   - Party popper effect:
     - Confetti animation
     - Colorful particles
     - Smooth transitions
     - Display message: "Your balance is: ${balance}"
   - Animated background:
     - Gradient animations
     - Floating particles
     - Smooth color transitions

4. **Error Handling**
   - Handle token expiration
   - Handle unauthorized access
   - Redirect to login if token invalid
   - Display error messages

5. **UI/UX**
   - Modern dashboard design
   - Smooth animations
   - Responsive layout
   - Clear balance display

**Deliverables**:
- User dashboard
- Balance check functionality
- Animated balance display
- Error handling

---

## Stage 8: Integration & Testing
**Goal**: Integrate all components and test the complete flow

### Tasks:
1. **End-to-End Testing**
   - Test registration flow
   - Test login flow
   - Test balance check flow
   - Test error scenarios

2. **Security Testing**
   - Test JWT token validation
   - Test cookie security
   - Test password hashing
   - Test SQL injection prevention
   - Test XSS prevention

3. **Edge Cases**
   - Test duplicate registration
   - Test invalid credentials
   - Test expired tokens
   - Test missing tokens
   - Test database connection failures

4. **Performance Testing**
   - Test API response times
   - Test database query performance
   - Optimize slow queries if needed

5. **Code Quality**
   - Code review
   - Error handling review
   - Security review
   - Code cleanup

**Deliverables**:
- Fully tested application
- Security verified
- Performance optimized
- Ready for deployment

---

## Stage 9: Deployment to Vercel
**Goal**: Deploy application to Vercel production environment

### Tasks:
1. **Vercel Configuration**
   - Create vercel.json for backend API routes
   - Configure serverless functions
   - Set up environment variables in Vercel dashboard
   - Configure build settings

2. **Database Configuration**
   - Ensure Aiven MySQL connection string is in Vercel environment variables
   - Test database connection from Vercel
   - Verify SSL connection if required

3. **Frontend Deployment**
   - Build React app for production
   - Configure static file serving
   - Set up routing (SPA routing)

4. **Backend Deployment**
   - Configure API routes as serverless functions
   - Set up CORS for production domain
   - Configure cookie settings for production (secure, sameSite)

5. **Environment Variables**
   - JWT_SECRET
   - DB_HOST
   - DB_USER
   - DB_PASSWORD
   - DB_NAME
   - DB_PORT

6. **Testing Production**
   - Test registration in production
   - Test login in production
   - Test balance check in production
   - Verify cookies work correctly
   - Test HTTPS security

7. **Monitoring & Logging**
   - Set up error logging
   - Monitor API performance
   - Set up alerts for critical errors

**Deliverables**:
- Application deployed to Vercel
- Production environment configured
- All features working in production
- Monitoring in place

---

## Additional Considerations

### Security Best Practices:
- Use HTTPS in production
- Implement rate limiting for login attempts
- Add CSRF protection
- Sanitize all user inputs
- Use parameterized queries (prevent SQL injection)
- Implement password strength requirements
- Add account lockout after failed attempts (future enhancement)

### Future Enhancements (Post-MVP):
- Password reset functionality
- Email verification
- Transaction history
- Transfer money between accounts
- Admin/Manager dashboards
- Multi-factor authentication
- Session management
- Token refresh mechanism

### File Structure (Recommended):
```
kodbank/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Register.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   └── BalanceDisplay.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   └── index.js
│   └── package.json
├── backend/
│   ├── api/
│   │   ├── routes/
│   │   │   ├── auth.js
│   │   │   └── balance.js
│   │   ├── middleware/
│   │   │   └── auth.js
│   │   ├── db/
│   │   │   └── connection.js
│   │   └── index.js
│   └── package.json
├── vercel.json
└── README.md
```

---

## Summary

This staged approach ensures:
1. **Incremental Development**: Each stage builds on the previous one
2. **Testing**: Each stage can be tested independently
3. **Risk Management**: Issues are identified early
4. **Clear Milestones**: Each stage has clear deliverables
5. **Maintainability**: Well-structured code from the start

The plan progresses from infrastructure setup → backend APIs → frontend components → integration → deployment, ensuring a solid foundation at each step.
