# Kodbank Setup Guide

## Quick Start

### 1. Database Setup (Aiven MySQL)

1. **Create Aiven MySQL Service:**
   - Log in to [Aiven Console](https://console.aiven.io/)
   - Create a new MySQL service
   - Wait for the service to be ready
   - Note down the connection details

2. **Get Connection Details:**
   - Host: `your-service-name.a.aivencloud.com`
   - Port: Usually `3306` or the port shown in Aiven console
   - Username: Usually `avnadmin`
   - Password: Copy from Aiven console
   - Database: Usually `defaultdb`

3. **Run Database Schema:**
   - Option 1: Use MySQL client or Aiven console SQL editor
     - Copy contents of `backend/api/db/schema.sql`
     - Execute in your database
   
   - Option 2: Use the initialization script
     ```bash
     cd backend
     npm install
     # Set up .env first (see step 2 below)
     npm run init-db
     ```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env with your Aiven credentials
# Use your favorite editor or:
# Windows: notepad .env
# Mac/Linux: nano .env
```

**Update `.env` file:**
```env
DB_HOST=your-service-name.a.aivencloud.com
DB_USER=avnadmin
DB_PASSWORD=your-password-from-aiven
DB_NAME=defaultdb
DB_PORT=3306
DB_SSL=true
JWT_SECRET=generate-a-random-secret-key-here-min-32-characters
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

**Generate JWT Secret:**
```bash
# You can use Node.js to generate a secure secret:
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**Start Backend:**
```bash
npm start
```

Backend should be running on `http://localhost:5000`

### 3. Frontend Setup

```bash
# Navigate to frontend directory (from project root)
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend should be running on `http://localhost:3000`

### 4. Test the Application

1. **Register a new user:**
   - Go to `http://localhost:3000/register`
   - Fill in the form
   - Submit

2. **Login:**
   - You'll be redirected to login page
   - Enter your credentials
   - Submit

3. **Check Balance:**
   - You'll be redirected to dashboard
   - Click "Check Balance"
   - See the animated balance display!

## Deployment to Vercel

### Option 1: Deploy Frontend and Backend Separately (Recommended)

**Backend Deployment:**
1. Create a new Vercel project for backend
2. Root directory: `backend`
3. Build command: (leave empty)
4. Output directory: (leave empty)
5. Install command: `npm install`
6. Add all environment variables from `backend/.env.example`
7. Deploy

**Frontend Deployment:**
1. Create a new Vercel project for frontend
2. Root directory: `frontend`
3. Build command: `npm run build`
4. Output directory: `dist`
5. Install command: `npm install`
6. Add environment variable: `VITE_API_URL` = your backend API URL
7. Deploy

### Option 2: Monorepo Deployment (Single Project)

1. Create a Vercel project
2. Root directory: project root
3. Build command: `cd frontend && npm install && npm run build`
4. Output directory: `frontend/dist`
5. Add all environment variables
6. Configure API routes in `vercel.json`

**Important:** For monorepo, you may need to adjust the Vercel configuration based on your project structure.

## Troubleshooting

### Database Connection Failed

**Error:** `ER_ACCESS_DENIED_ERROR` or connection timeout

**Solutions:**
- Verify Aiven service is running
- Check SSL is enabled (`DB_SSL=true`)
- Verify credentials match Aiven console exactly
- Check if your IP needs to be whitelisted in Aiven

### Port Already in Use

**Error:** `EADDRINUSE: address already in use`

**Solution:**
```bash
# Change PORT in backend/.env to a different port
PORT=5001
```

### CORS Errors

**Error:** CORS policy blocked

**Solution:**
- Ensure `FRONTEND_URL` in backend `.env` matches your frontend URL
- Check CORS configuration in `backend/api/index.js`

### Cookie Not Set

**Error:** Cookie not being sent/received

**Solution:**
- Ensure `withCredentials: true` in axios config (already set)
- In production, ensure HTTPS is used
- Check cookie settings match domain

### JWT Token Invalid

**Error:** Invalid or expired token

**Solution:**
- Verify `JWT_SECRET` is set correctly
- Check token expiry (24 hours default)
- Ensure token is being sent in requests

## Environment Variables Checklist

### Backend (.env)
- [ ] DB_HOST
- [ ] DB_USER
- [ ] DB_PASSWORD
- [ ] DB_NAME
- [ ] DB_PORT
- [ ] DB_SSL
- [ ] JWT_SECRET
- [ ] PORT
- [ ] NODE_ENV
- [ ] FRONTEND_URL

### Frontend (.env) - Optional
- [ ] VITE_API_URL (defaults to http://localhost:5000/api)

## Next Steps

After setup:
1. Test all features (register, login, balance check)
2. Review security settings
3. Set up production environment variables
4. Deploy to Vercel
5. Test production deployment

## Support

If you encounter issues:
1. Check the error messages in console
2. Verify all environment variables are set
3. Check database connection
4. Review the README.md for detailed documentation
