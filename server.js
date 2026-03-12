const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

console.log('Loaded env DB_HOST=', process.env.DB_HOST, 'DB_PORT=', process.env.DB_PORT);

// Middleware
app.use(cors());
app.use(express.json());

// MySQL Connection Pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'cultural_hub',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});
// Adapter variables
let useSqlite = false;
let sqliteDb = null;

// Helper: returns a connection-like object with `execute(sql, params)` and `release()`
async function getDBConnection() {
  if (!useSqlite) {
    return await pool.getConnection();
  }

  return {
    execute: (sql, params = []) => {
      return new Promise((resolve, reject) => {
        const s = sql.trim().toUpperCase();
        if (s.startsWith('SELECT')) {
          sqliteDb.all(sql, params, (err, rows) => {
            if (err) return reject(err);
            resolve([rows]);
          });
        } else {
          sqliteDb.run(sql, params, function (err) {
            if (err) return reject(err);
            resolve([{ insertId: this.lastID, affectedRows: this.changes }]);
          });
        }
      });
    },
    release: () => {},
  };
}

// Validate DB connection at startup and fallback to SQLite if MySQL is unavailable
(async () => {
  try {
    const conn = await pool.getConnection();
    const [rows] = await conn.execute('SELECT 1 AS ok');
    console.log('DB startup check passed:', rows);
    conn.release();
  } catch (err) {
    console.error('DB startup check failed, falling back to SQLite:', err && err.message ? err.message : err);

    // Initialize SQLite fallback
    try {
      const sqlite3 = require('sqlite3').verbose();
      const path = require('path');
      const dbFile = process.env.SQLITE_FILE || path.join(process.cwd(), 'fallback.db');
      sqliteDb = new sqlite3.Database(dbFile);
      useSqlite = true;

      // Create minimal tables compatible with the app
      const stmts = [
        `CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          email TEXT NOT NULL UNIQUE,
          password TEXT NOT NULL,
          bio TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );`,
        `CREATE TABLE IF NOT EXISTS user_stats (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id INTEGER NOT NULL,
          posts INTEGER DEFAULT 0,
          followers INTEGER DEFAULT 0,
          following INTEGER DEFAULT 0,
          communities INTEGER DEFAULT 0,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );`,
        `CREATE TABLE IF NOT EXISTS user_interests (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id INTEGER NOT NULL,
          interest TEXT NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );`,
        `CREATE TABLE IF NOT EXISTS user_settings (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id INTEGER NOT NULL UNIQUE,
          theme TEXT DEFAULT 'dark',
          email_notifications INTEGER DEFAULT 1,
          comment_notifications INTEGER DEFAULT 1,
          public_profile INTEGER DEFAULT 1,
          show_posts INTEGER DEFAULT 1,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );`,
        `CREATE TABLE IF NOT EXISTS posts (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id INTEGER NOT NULL,
          title TEXT NOT NULL,
          content TEXT,
          category TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );`,
      ];

      for (const s of stmts) {
        await new Promise((res, rej) => sqliteDb.run(s, (err) => (err ? rej(err) : res())));
      }

      console.log('SQLite fallback initialized at', dbFile);
    } catch (sqliteErr) {
      console.error('Failed to initialize SQLite fallback:', sqliteErr && sqliteErr.message ? sqliteErr.message : sqliteErr);
    }
  }
})();

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Debug endpoint to check DB connectivity
app.get('/api/debug/db', async (req, res) => {
  try {
    const connection = await getDBConnection();
    const [rows] = await connection.execute('SELECT 1 AS ok');
    connection.release();
    res.json({ ok: true, result: rows });
  } catch (error) {
    console.error('DB debug error:', error);
    res.status(500).json({ ok: false, error: error.message });
  }
});

// ============= Auth Routes =============

// REGISTER
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    const connection = await getDBConnection();

    // Check if user exists
    const [existingUser] = await connection.execute(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );

    if (existingUser.length > 0) {
      connection.release();
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const [result] = await connection.execute(
      'INSERT INTO users (name, email, password, bio) VALUES (?, ?, ?, ?)',
      [name, email, hashedPassword, 'Cultural Enthusiast & Content Creator']
    );

    const userId = result.insertId;

    // Create user stats
    await connection.execute(
      'INSERT INTO user_stats (user_id, posts, followers, following, communities) VALUES (?, 0, 0, 0, 0)',
      [userId]
    );

    // Create user interests
    const defaultInterests = ['Dance', 'Music', 'Food', 'Art', 'Literature', 'Festivals'];
    for (const interest of defaultInterests) {
      await connection.execute(
        'INSERT INTO user_interests (user_id, interest) VALUES (?, ?)',
        [userId, interest]
      );
    }

    // Create user settings
    await connection.execute(
      'INSERT INTO user_settings (user_id, theme, email_notifications, comment_notifications, public_profile, show_posts) VALUES (?, ?, ?, ?, ?, ?)',
      [userId, 'dark', true, true, true, true]
    );

    connection.release();

    // Generate token
    const token = jwt.sign({ userId, email }, JWT_SECRET, { expiresIn: '7d' });

    res.json({ 
      success: true, 
      token, 
      user: { id: userId, name, email }
    });
  } catch (error) {
    console.error('Register error:', error);
    // Return details for debugging (development only)
    res.status(500).json({ error: 'Registration failed', details: error.message });
  }
});

// LOGIN
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const connection = await getDBConnection();

    // Find user
    const [users] = await connection.execute(
      'SELECT id, name, email, password FROM users WHERE email = ?',
      [email]
    );

    if (users.length === 0) {
      connection.release();
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const user = users[0];

    // Verify password
    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      connection.release();
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    connection.release();

    // Generate token
    const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });

    res.json({ 
      success: true, 
      token, 
      user: { id: user.id, name: user.name, email: user.email }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Middleware to verify token
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// ============= User Routes =============

// GET USER PROFILE
app.get('/api/user/profile', verifyToken, async (req, res) => {
  try {
    const connection = await getDBConnection();

    // Get user data
    const [users] = await connection.execute(
      'SELECT id, name, email, bio FROM users WHERE id = ?',
      [req.userId]
    );

    if (users.length === 0) {
      connection.release();
      return res.status(404).json({ error: 'User not found' });
    }

    const user = users[0];

    // Get user stats
    const [stats] = await connection.execute(
      'SELECT posts, followers, following, communities FROM user_stats WHERE user_id = ?',
      [req.userId]
    );

    // Get user interests
    const [interests] = await connection.execute(
      'SELECT interest FROM user_interests WHERE user_id = ?',
      [req.userId]
    );

    connection.release();

    res.json({
      ...user,
      ...stats[0],
      interests: interests.map(i => i.interest)
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Failed to get profile' });
  }
});

// UPDATE USER PROFILE
app.put('/api/user/profile', verifyToken, async (req, res) => {
  try {
    const { name, email, bio, interests } = req.body;
    const connection = await getDBConnection();

    // Update user info
    await connection.execute(
      'UPDATE users SET name = ?, email = ?, bio = ? WHERE id = ?',
      [name, email, bio, req.userId]
    );

    // Update interests
    if (interests && Array.isArray(interests)) {
      // Delete old interests
      await connection.execute(
        'DELETE FROM user_interests WHERE user_id = ?',
        [req.userId]
      );

      // Add new interests
      for (const interest of interests) {
        await connection.execute(
          'INSERT INTO user_interests (user_id, interest) VALUES (?, ?)',
          [req.userId, interest]
        );
      }
    }

    connection.release();

    res.json({ success: true, message: 'Profile updated successfully' });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// ============= Settings Routes =============

// GET USER SETTINGS
app.get('/api/user/settings', verifyToken, async (req, res) => {
  try {
    const connection = await getDBConnection();

    const [settings] = await connection.execute(
      'SELECT theme, email_notifications, comment_notifications, public_profile, show_posts FROM user_settings WHERE user_id = ?',
      [req.userId]
    );

    connection.release();

    if (settings.length === 0) {
      return res.json({
        theme: 'dark',
        email_notifications: true,
        comment_notifications: true,
        public_profile: true,
        show_posts: true
      });
    }

    res.json(settings[0]);
  } catch (error) {
    console.error('Get settings error:', error);
    res.status(500).json({ error: 'Failed to get settings' });
  }
});

// UPDATE USER SETTINGS
app.put('/api/user/settings', verifyToken, async (req, res) => {
  try {
    const { theme, email_notifications, comment_notifications, public_profile, show_posts } = req.body;
    const connection = await getDBConnection();

    await connection.execute(
      `UPDATE user_settings 
       SET theme = ?, email_notifications = ?, comment_notifications = ?, public_profile = ?, show_posts = ? 
       WHERE user_id = ?`,
      [theme, email_notifications, comment_notifications, public_profile, show_posts, req.userId]
    );

    connection.release();

    res.json({ success: true, message: 'Settings updated successfully' });
  } catch (error) {
    console.error('Update settings error:', error);
    res.status(500).json({ error: 'Failed to update settings' });
  }
});

// ============= Posts Routes =============

// GET USER POSTS
app.get('/api/user/posts', verifyToken, async (req, res) => {
  try {
    const connection = await getDBConnection();

    const [posts] = await connection.execute(
      'SELECT id, title, content, category, created_at FROM posts WHERE user_id = ? ORDER BY created_at DESC',
      [req.userId]
    );

    connection.release();

    res.json(posts);
  } catch (error) {
    console.error('Get posts error:', error);
    res.status(500).json({ error: 'Failed to get posts' });
  }
});

// CREATE POST
app.post('/api/user/posts', verifyToken, async (req, res) => {
  try {
    const { title, content, category } = req.body;

    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }

    const connection = await getDBConnection();

    const [result] = await connection.execute(
      'INSERT INTO posts (user_id, title, content, category) VALUES (?, ?, ?, ?)',
      [req.userId, title, content || '', category || 'General']
    );

    connection.release();

    res.json({ success: true, postId: result.insertId });
  } catch (error) {
    console.error('Create post error:', error);
    res.status(500).json({ error: 'Failed to create post' });
  }
});

// DELETE POST
app.delete('/api/user/posts/:postId', verifyToken, async (req, res) => {
  try {
    const { postId } = req.params;
    const connection = await getDBConnection();

    // Verify ownership
    const [posts] = await connection.execute(
      'SELECT id FROM posts WHERE id = ? AND user_id = ?',
      [postId, req.userId]
    );

    if (posts.length === 0) {
      connection.release();
      return res.status(403).json({ error: 'Unauthorized' });
    }

    await connection.execute('DELETE FROM posts WHERE id = ?', [postId]);
    connection.release();

    res.json({ success: true, message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Delete post error:', error);
    res.status(500).json({ error: 'Failed to delete post' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Backend is running' });
});

// Root route
app.get('/', (req, res) => {
  res.json({
    status: 'Backend API running',
    message: 'Use /api endpoints'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});
