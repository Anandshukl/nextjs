# Quick Start Guide

## 🚀 Get Running in 5 Minutes

### 1. Database Setup (2 minutes)

**Option A: Windows - Using Command Prompt**
```cmd
# Open Command Prompt
# Navigate to project folder
cd c:\Users\DELL\OneDrive\Desktop\nextjs

# Open MySQL
mysql -u root -p

# In MySQL terminal, run:
CREATE DATABASE cultural_hub;
USE cultural_hub;
SOURCE database.sql;
EXIT;
```

**Option B: Using MySQL Workbench**
1. Open MySQL Workbench
2. File → Open SQL Script → Select `database.sql`
3. Click the lightning bolt to execute
4. Done!

### 2. Environment Setup (1 minute)

Create `.env.local` file in project root:
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=cultural_hub
JWT_SECRET=your_secret_key_12345
PORT=5000
```

### 3. Start the Project (30 seconds)

```bash
# Terminal 1: Start backend + frontend together
npm run dev

# Or run them separately:
# Terminal 1 - Backend
npm run server

# Terminal 2 - Frontend  
npm run dev
```

### 4. Access the App

Open browser → `http://localhost:3000`

## ✅ Test It Out

1. **Sign Up**: Click Sign Up → Fill form → Create Account
2. **Login**: Use the email/password you just created
3. **Profile**: See your data from database
4. **Edit**: Click edit button, change bio/interests
5. **Settings**: Toggle dark/light theme
6. **Logout**: Use logout button in navigation

## 🎯 Default Demo Account (if created)

```
Email: user@example.com
Password: password123
```

## 🔧 Troubleshooting

**Backend won't start?**
- Check MySQL is running
- Check `.env.local` credentials
- Make sure database exists: `mysql -u root -p -e "SHOW DATABASES;"`

**"Port 5000 already in use"?**
- Edit `.env.local` and change PORT to 5001
- Or kill process: `taskkill /PID [process_id] /F`

**Frontend won't load?**
- Make sure backend is running first
- Check browser console for errors (F12)

**Login not working?**
- Clear localStorage: F12 → Application → Clear All
- Try signing up again

## 📂 Key Files

| File | Purpose |
|------|---------|
| `server.js` | Express backend API |
| `database.sql` | MySQL schema |
| `.env.local` | Configuration |
| `app/lib/api.ts` | API client |
| `app/login/page.tsx` | Login page |
| `app/profile/page.tsx` | Profile page |

## 🌐 API Endpoints

- `POST /api/auth/register` - Create account
- `POST /api/auth/login` - Login
- `GET /api/user/profile` - Get profile
- `PUT /api/user/profile` - Update profile
- `GET /api/user/settings` - Get settings
- `PUT /api/user/settings` - Update settings

## 📱 Features

✅ Register & Login
✅ Real database storage
✅ Edit profile with DB save
✅ Dark/Light theme
✅ Dashboard
✅ Blog & Community pages
✅ JWT authentication
✅ Password hashing

---

**Need more details?** → See `SETUP_GUIDE.md`
