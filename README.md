# Kodbank - Banking Application

A modern banking application built with React frontend and Node.js/Express backend, featuring JWT authentication and balance checking functionality.

## Features

- ✅ User Registration with validation
- ✅ Secure Login with JWT authentication
- ✅ Protected Balance Check endpoint
- ✅ Beautiful animated balance display
- ✅ Cookie-based session management
- ✅ MySQL database integration (Aiven)

## Tech Stack

### Frontend
- React 18
- React Router DOM
- Axios
- Vite
- CSS3 Animations

### Backend
- Node.js
- Express.js
- MySQL2 (Aiven MySQL)
- JWT (jsonwebtoken)
- bcrypt (password hashing)
- cookie-parser

### Database
- Aiven MySQL
- Two tables: `KodUser` and `UserToken`

## Project Structure

```
kodbank/
├── frontend/           # React frontend application
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── services/      # API service layer
│   │   └── App.jsx        # Main app component
│   └── package.json
├── backend/            # Express backend API
│   ├── api/
│   │   ├── routes/        # API routes
│   │   ├── middleware/    # Auth middleware
│   │   ├── db/            # Database connection & schema
│   │   └── index.js       # Express server
│   └── package.json
├── vercel.json         # Vercel deployment config
└── README.md
```

## Setup Instructions

### Prerequisites
- Node.js 18+ installed
- Aiven MySQL database account
- npm or yarn package manager

### 1. Database Setup

1. Log in to your Aiven account and create a MySQL service
2. Note down your connection details:
   - Host
   - Port
   - Username
   - Password
   - Database name

3. Run the SQL schema to create tables:
   ```sql
   -- Execute backend/api/db/schema.sql in your Aiven MySQL database
   ```

### 2. Backend Setup

1. Navigate to backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env` file (copy from `.env.example`):
   ```bash
   cp .env.example .env
   ```

4. Update `.env` with your Aiven MySQL credentials:
   ```env
   DB_HOST=your-aiven-host.a.aivencloud.com
   DB_USER=avnadmin
   DB_PASSWORD=your-password
   DB_NAME=defaultdb
   DB_PORT=3306
   DB_SSL=true
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   PORT=5000
   NODE_ENV=development
   FRONTEND_URL=http://localhost:3000
   ```

5. Start the backend server:
   ```bash
   npm start
   ```

   The server will run on `http://localhost:5000`

### 3. Frontend Setup

1. Navigate to frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env` file (optional, for custom API URL):
   ```bash
   cp .env.example .env
   ```

4. Update `.env` if needed:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

   The app will run on `http://localhost:3000`

## Usage

### Registration Flow
1. Navigate to `/register`
2. Fill in the registration form:
   - Username (required)
   - Email (required)
   - Password (required, min 6 characters)
   - Phone (optional)
   - Role is automatically set to "Customer"
3. Submit the form
4. You'll be redirected to the login page

### Login Flow
1. Navigate to `/login`
2. Enter your username and password
3. On successful login:
   - JWT token is generated and stored in database
   - Token is set as HTTP-only cookie
   - You're redirected to the dashboard

### Balance Check Flow
1. From the dashboard, click "Check Balance"
2. The app sends a request with the JWT cookie
3. Backend verifies the token
4. Balance is fetched and displayed with celebration animation

## API Endpoints

### POST `/api/register`
Register a new user.

**Request Body:**
```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "securepassword",
  "phone": "1234567890",
  "role": "Customer"
}
```

**Response:**
```json
{
  "message": "User registered successfully",
  "user": {
    "uid": 1,
    "username": "john_doe",
    "email": "john@example.com",
    "phone": "1234567890",
    "role": "Customer",
    "balance": 100000.00
  }
}
```

### POST `/api/login`
Login and get JWT token.

**Request Body:**
```json
{
  "username": "john_doe",
  "password": "securepassword"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "user": {
    "uid": 1,
    "username": "john_doe",
    "email": "john@example.com",
    "role": "Customer",
    "balance": 100000.00
  }
}
```

**Cookie:** `token` (HTTP-only, secure)

### GET `/api/balance`
Get user balance (requires authentication).

**Headers:** Cookie with JWT token

**Response:**
```json
{
  "balance": 100000.00,
  "message": "Balance retrieved successfully"
}
```

## Database Schema

### KodUser Table
```sql
CREATE TABLE KodUser (
    uid INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    balance DECIMAL(15, 2) DEFAULT 100000.00,
    phone VARCHAR(20),
    role ENUM('Customer', 'Manager', 'Admin') DEFAULT 'Customer',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### UserToken Table
```sql
CREATE TABLE UserToken (
    tid INT PRIMARY KEY AUTO_INCREMENT,
    token TEXT NOT NULL,
    uid INT NOT NULL,
    expiry DATETIME NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (uid) REFERENCES KodUser(uid) ON DELETE CASCADE
);
```

## Deployment to Vercel

### Prerequisites
- Vercel account
- GitHub repository (optional, but recommended)

### Steps

1. **Install Vercel CLI** (if not already installed):
   ```bash
   npm i -g vercel
   ```

2. **Configure Environment Variables in Vercel:**
   - Go to your Vercel project settings
   - Add all environment variables from `backend/.env.example`
   - Make sure to set `NODE_ENV=production`
   - Update `FRONTEND_URL` to your Vercel domain

3. **Deploy:**
   ```bash
   vercel
   ```

   Or connect your GitHub repository to Vercel for automatic deployments.

4. **Update Frontend Environment:**
   - In Vercel dashboard, add `VITE_API_URL` pointing to your backend API URL

### Vercel Configuration Notes

- Backend API routes are handled by `@vercel/node`
- Frontend is built as static files
- Routes are configured in `vercel.json`
- API routes are prefixed with `/api`

## Security Features

- ✅ Password hashing with bcrypt (10 salt rounds)
- ✅ JWT token authentication
- ✅ HTTP-only cookies (prevents XSS)
- ✅ Secure flag for cookies in production
- ✅ SameSite cookie attribute (CSRF protection)
- ✅ Token expiry (24 hours)
- ✅ Token validation in database
- ✅ SQL injection prevention (parameterized queries)
- ✅ Input validation

## Development

### Running in Development Mode

**Backend:**
```bash
cd backend
npm start
```

**Frontend:**
```bash
cd frontend
npm run dev
```

### Building for Production

**Frontend:**
```bash
cd frontend
npm run build
```

The built files will be in `frontend/dist/`

## Troubleshooting

### Database Connection Issues
- Verify Aiven MySQL service is running
- Check SSL settings (should be `true` for Aiven)
- Verify connection credentials in `.env`

### CORS Issues
- Ensure `FRONTEND_URL` in backend `.env` matches your frontend URL
- Check CORS configuration in `backend/api/index.js`

### Cookie Issues
- Ensure `withCredentials: true` in axios config
- Check cookie settings (secure flag in production)
- Verify domain settings

### JWT Token Issues
- Verify `JWT_SECRET` is set in environment variables
- Check token expiry time
- Verify token is being sent in requests

## Future Enhancements

- [ ] Password reset functionality
- [ ] Email verification
- [ ] Transaction history
- [ ] Money transfer between accounts
- [ ] Admin/Manager dashboards
- [ ] Multi-factor authentication
- [ ] Token refresh mechanism
- [ ] Rate limiting
- [ ] Account lockout after failed attempts

## License

This project is created for educational purposes.

## Support

For issues or questions, please check the troubleshooting section or review the code comments.
