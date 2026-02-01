# Testing Checklist

## Setup Complete ✅

- [x] Backend dependencies installed (express, mysql2, cors, dotenv, bcryptjs, jsonwebtoken)
- [x] Frontend updated to use API calls
- [x] Authentication system implemented with JWT tokens
- [x] Database schema created (database.sql)
- [x] Environment configuration file (.env.local)
- [x] API wrapper functions created (app/lib/api.ts)

## Pre-Testing Checklist

Before you start testing, make sure:

- [ ] MySQL database is created and running
- [ ] `.env.local` file has correct credentials
- [ ] Backend server can start without errors
- [ ] Frontend can run without build errors

## Backend Testing

### 1. Database Connection
```bash
# In MySQL terminal
SHOW DATABASES;
# Should show: cultural_hub

USE cultural_hub;
SHOW TABLES;
# Should show: users, user_stats, user_interests, user_settings, posts
```

### 2. Server Health Check
```bash
# Start backend
npm run server

# In another terminal, test connection
curl http://localhost:5000/api/health
# Should return: {"status":"ok"}
```

## Frontend Testing Workflow

### Step 1: Registration Testing
- [ ] Click "Sign Up" button
- [ ] Fill in Name: "Test User"
- [ ] Fill in Email: "test@example.com"
- [ ] Fill in Password: "password123"
- [ ] Click "Create Account"
- [ ] Should redirect to profile page
- [ ] Should display your name and email

**Database Check:**
```sql
SELECT * FROM users WHERE email = 'test@example.com';
-- Should show your user record with hashed password
```

### Step 2: Login Testing
- [ ] Logout (if logged in)
- [ ] Click "Login"
- [ ] Enter email: "test@example.com"
- [ ] Enter password: "password123"
- [ ] Click "Login"
- [ ] Should redirect to profile
- [ ] Check browser localStorage → Should have 'token' and 'user'

### Step 3: Profile Page Testing
- [ ] Verify profile displays correct name
- [ ] Verify email is shown
- [ ] Check stats display (posts, followers, following, communities)
- [ ] Verify interests list (if set)

### Step 4: Edit Profile Testing
- [ ] Click "Edit Profile" button
- [ ] Change Name to "Updated Name"
- [ ] Change Bio to "This is my new bio"
- [ ] Change Interests to "Dance, Music, Art"
- [ ] Click "Save Changes"
- [ ] Should show success
- [ ] Page should update with new values

**Database Check:**
```sql
SELECT * FROM users WHERE email = 'test@example.com';
-- Should show updated name and bio
```

### Step 5: Settings Page Testing
- [ ] Click "Dashboard"
- [ ] Click "Settings" card
- [ ] Toggle Dark Mode ON
- [ ] Page should change to dark theme
- [ ] Toggle Dark Mode OFF
- [ ] Page should change to light theme
- [ ] Check other toggles (Notifications, Email Notifications, etc.)

### Step 6: Navigation Testing
- [ ] All navigation links work
  - [ ] Home
  - [ ] Dashboard
  - [ ] Community
  - [ ] Blog
  - [ ] Profile
- [ ] Logo links to Home
- [ ] Logout button appears when logged in
- [ ] Login/Sign Up buttons appear when logged out

### Step 7: Logout Testing
- [ ] Click "Logout" button (in AuthNav)
- [ ] Should redirect to login page
- [ ] localStorage should be cleared
- [ ] Navigation should show Login/Sign Up buttons
- [ ] Try accessing /profile → Should redirect to login

### Step 8: Multi-User Testing
- [ ] Sign up with another email: "user2@example.com"
- [ ] Verify each user has separate profile
- [ ] Edit each user's profile
- [ ] Verify changes only apply to that user

**Database Check:**
```sql
SELECT id, name, email FROM users;
-- Should show both users with separate data
```

## Error Handling Testing

### Test Missing Fields
- [ ] Try signing up with empty name → Should show error
- [ ] Try signing up with empty email → Should show error
- [ ] Try signing up with empty password → Should show error
- [ ] Try logging in with wrong password → Should show error
- [ ] Try logging in with non-existent email → Should show error

### Test Duplicate Email
- [ ] Try signing up with existing email → Should show error

### Test Session Expiry
- [ ] Login successfully
- [ ] Close browser/clear localStorage manually
- [ ] Try accessing /profile → Should redirect to login

## API Testing (Optional - Advanced)

You can test API endpoints directly using curl or Postman:

### Register
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@test.com","password":"pass123"}'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"pass123"}'
```

### Get Profile (with token)
```bash
curl -X GET http://localhost:5000/api/user/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

## Performance Checklist

- [ ] Page loads in < 2 seconds
- [ ] Form submissions are responsive
- [ ] No console errors (F12)
- [ ] No network errors (Network tab)
- [ ] Theme switch is instant
- [ ] Logout is immediate

## Final Sign-Off

When all tests pass:

- [ ] Backend runs without errors
- [ ] Frontend loads correctly
- [ ] Can register new user
- [ ] Can login with credentials
- [ ] Profile data persists in database
- [ ] Can edit profile and save to database
- [ ] Can toggle theme
- [ ] Can logout
- [ ] Navigation works correctly
- [ ] Multi-user support working

## Known Limitations (To Implement Later)

- [ ] Posts creation/editing not fully integrated
- [ ] Community joining functionality pending
- [ ] Avatar upload not implemented
- [ ] Real-time notifications not implemented
- [ ] Blog comments not implemented

---

## Test Results

| Test Case | Status | Notes |
|-----------|--------|-------|
| User Registration | ⏳ Pending | |
| User Login | ⏳ Pending | |
| Profile Display | ⏳ Pending | |
| Profile Edit | ⏳ Pending | |
| Theme Toggle | ⏳ Pending | |
| Navigation | ⏳ Pending | |
| Logout | ⏳ Pending | |
| Multi-User | ⏳ Pending | |
| Error Handling | ⏳ Pending | |

---

**Last Updated**: 2026-01-25

Run through this checklist and mark items complete as you test! ✅
