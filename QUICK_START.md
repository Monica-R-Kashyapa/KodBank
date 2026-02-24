# Kodbank - Quick Start Guide

## ✅ Setup Complete!

Your database credentials have been configured and the database tables have been initialized.

## Start the Application

### Option 1: Run Backend and Frontend Separately

**Terminal 1 - Backend:**
```bash
cd backend
npm start
```
Backend will run on: `http://localhost:5000`

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```
Frontend will run on: `http://localhost:3000`

### Option 2: Use PowerShell (Windows)

**Backend:**
```powershell
cd backend; npm start
```

**Frontend (new terminal):**
```powershell
cd frontend; npm run dev
```

## Test the Application

1. **Open your browser:** `http://localhost:3000`
2. **Register a new user:**
   - Fill in username, email, password
   - Phone is optional
   - Role is automatically set to "Customer"
   - Click "Register"

3. **Login:**
   - You'll be redirected to login page
   - Enter your username and password
   - Click "Login"

4. **Check Balance:**
   - You'll see the dashboard
   - Click "Check Balance"
   - Enjoy the animated celebration! 🎉

## Database Status

✅ **Connected to:** auth-app-mysql-monica232004-f55d.i.aivencloud.com:16189
✅ **Database:** defaultdb
✅ **Tables Created:**
   - KodUser (with indexes)
   - UserToken (with foreign key)

## Default Balance

All new users start with: **$100,000.00**

## Troubleshooting

### Backend won't start
- Check if port 5000 is available
- Verify `.env` file exists in `backend/` directory
- Check database connection in console output

### Frontend won't start
- Check if port 3000 is available
- Verify `node_modules` are installed

### Database connection errors
- Verify Aiven MySQL service is running
- Check credentials in `backend/.env`
- Ensure SSL is enabled (already configured)

### CORS errors
- Ensure backend is running on port 5000
- Check `FRONTEND_URL` in backend `.env`

## Next Steps

1. Test registration and login
2. Test balance check functionality
3. Deploy to Vercel when ready (see SETUP_GUIDE.md)

---

**Ready to go!** 🚀
