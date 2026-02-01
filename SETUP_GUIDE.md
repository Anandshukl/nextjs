# Cultural Hub - Complete Setup Guide

## Prerequisites
- Node.js (v16 or higher)
- MySQL Server (v5.7 or higher)
- npm or yarn

## Step 1: Database Setup

### Option A: Using MySQL Command Line
```bash
# Open MySQL terminal
mysql -u root -p

# Create database and import schema
CREATE DATABASE cultural_hub;
USE cultural_hub;

# Run the SQL schema file
SOURCE database.sql;
```

### Option B: Using MySQL Workbench
1. Open MySQL Workbench
2. Click on "File" → "Open SQL Script"
3. Select the `database.sql` file
4. Execute the script (Ctrl + Shift + Enter)

## Step 2: Environment Configuration

Create a `.env.local` file in the project root with the following:

```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=cultural_hub
JWT_SECRET=your_super_secret_jwt_key_change_this
PORT=5000
```

**Replace:**
- `your_password` with your MySQL root password
- `your_super_secret_jwt_key_change_this` with a strong secret key

## Step 3: Dependencies Installation

```bash
npm install
```

All required packages:
- express (API server)
- mysql2 (Database connection)
- cors (Cross-origin requests)
- dotenv (Environment variables)
- bcryptjs (Password hashing)
- jsonwebtoken (JWT authentication)
- next (Frontend framework)
- react (UI library)
- tailwindcss (Styling)

## Step 4: Running the Project

### Development Mode (Both Backend + Frontend)
```bash
npm run dev
```

This will start:
- **Backend**: Express server on `http://localhost:5000`
- **Frontend**: Next.js dev server on `http://localhost:3000`

### Running Backend Only
```bash
npm run server
```

### Running Frontend Only (after backend is running)
```bash
next dev
```

## Step 5: Test the Application

### 1. Open browser and navigate to:
```
http://localhost:3000
```

### 2. Create a new account:
- Click "Sign Up"
- Fill in: Name, Email, Password
- Click "Create Account"

### 3. Login with your account:
- Click "Login"
- Enter your email and password
- Click "Login"

### 4. Test features:
- View your profile with all data from database
- Edit your profile (name, bio, interests)
- Navigate to Dashboard
- View settings and toggle themes
- Visit Community, Blog pages

## API Endpoints

### Authentication
- `POST /auth/register` - Create new account
- `POST /auth/login` - Login and get JWT token

### User Profile
- `GET /user/profile` - Get current user profile
- `PUT /user/profile` - Update user profile

### User Settings
- `GET /user/settings` - Get user settings
- `PUT /user/settings` - Update user settings

### User Posts
- `GET /user/posts` - Get all user posts
- `POST /user/posts` - Create new post
- `DELETE /user/posts/:id` - Delete a post

### Health Check
- `GET /api/health` - Check server status

## Database Schema

### tables:
1. **users** - User account information
2. **user_stats** - User statistics (posts, followers, etc.)
3. **user_interests** - User interests/hobbies
4. **user_settings** - User preferences (theme, notifications, privacy)
5. **posts** - User-created posts

## Troubleshooting

### Issue: "Can't connect to database"
- Verify MySQL is running: `mysql -u root -p`
- Check `.env.local` credentials match your MySQL setup
- Ensure database was created: `SHOW DATABASES;`

### Issue: "Port 5000 already in use"
- Check what's using port 5000: `netstat -ano | findstr :5000`
- Kill the process or change PORT in `.env.local`

### Issue: "JWT token invalid"
- Clear browser cookies/localStorage: F12 → Application → Clear All
- Logout and login again
- Check JWT_SECRET in `.env.local`

### Issue: "CORS errors"
- Backend CORS is configured for localhost:3000
- Ensure backend is running before frontend

## Database Demo Data

A demo user is automatically created after first run:
- **Email**: user@example.com
- **Password**: password123

## Project Structure

```
nextjs/
├── app/
│   ├── page.tsx (Home)
│   ├── login/page.tsx
│   ├── signup/page.tsx
│   ├── profile/page.tsx
│   ├── blog/page.tsx
│   ├── community/page.tsx
│   ├── dashboard/
│   │   ├── page.tsx
│   │   ├── posts/page.tsx
│   │   └── settings/page.tsx
│   ├── components/
│   │   └── AuthNav.tsx
│   ├── lib/
│   │   └── api.ts
│   └── globals.css
├── public/
├── server.js (Express backend)
├── database.sql (MySQL schema)
├── .env.local (Configuration)
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

## Features Implemented

✅ User Authentication (Register/Login)
✅ JWT Token-based Authorization
✅ User Profile Management
✅ Settings & Theme Switching (Dark/Light)
✅ Dashboard with multiple sections
✅ Blog & Community pages
✅ Real database persistence with MySQL
✅ Password hashing with bcryptjs
✅ Responsive design with Tailwind CSS
✅ Gold color theme (#d4af37) with dark backgrounds

## Next Steps

After setup is complete, you can:
1. Add more blog posts to the database
2. Implement post creation/editing in dashboard
3. Add community joining functionality
4. Implement follower/following system
5. Add image upload for profile avatars

## Support

For issues or questions:
1. Check the Troubleshooting section
2. Review the browser console (F12) for errors
3. Check the backend server logs
4. Check MySQL error logs

---
**Last Updated**: 2026-01-25
