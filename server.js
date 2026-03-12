const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// cookie parser to read refresh token cookie
app.use(cookieParser());

// Security: set secure HTTP headers and rate limit requests to mitigate brute-force/XSS/header attacks
app.use(helmet());
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

console.log('Loaded env DB_HOST=', process.env.DB_HOST, 'DB_PORT=', process.env.DB_PORT);

// Middleware
app.use(cors());
app.use(express.json());

// Database connection handling
// Support Postgres via DATABASE_URL (Supabase / Neon / Render) or fallback to MySQL pool if provided
let dbType = 'mysql';
let mysqlPool = null;
let pgPool = null;

if (process.env.DATABASE_URL) {
  dbType = 'pg';
  pgPool = new PgPool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });
  console.log('Using Postgres via DATABASE_URL');
} else {
  mysqlPool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'cultural_hub',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  });
  console.log('Using MySQL pool (DB_HOST/DB_PORT)');
}

// Helper: returns a connection-like object with `execute(sql, params)` and `release()`
async function getDBConnection() {
  if (dbType === 'pg') {
    return {
      execute: async (sql, params = []) => {
        // convert ? placeholders to $1, $2 for pg
        let idx = 0;
        const converted = sql.replace(/\?/g, () => { idx += 1; return '$' + idx; });
        let q = converted;
        // For INSERTs, append RETURNING id if not present so callers can get insertId
        if (/^\s*INSERT/i.test(sql) && !/RETURNING\s+/i.test(converted)) {
          q = converted + ' RETURNING id';
        }
        const res = await pgPool.query(q, params);
        if (/^\s*SELECT/i.test(sql)) return [res.rows];
        return [{ insertId: res.rows[0]?.id, affectedRows: res.rowCount }];
      },
      release: () => {}
    };
  }
  return await mysqlPool.getConnection();
}

// Validate DB connection at startup
(async () => {
  try {
    const conn = await getDBConnection();
    const [rows] = await conn.execute('SELECT 1 AS ok');
    console.log('DB startup check passed:', rows);
    conn.release();
  } catch (err) {
    console.error('DB startup check failed:', err && err.message ? err.message : err);
  }
})();

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET || 'your-refresh-secret-change';

function generateAccessToken(user) {
  return jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: '15m' });
}

function generateRefreshToken(user) {
  return jwt.sign({ userId: user.id }, JWT_REFRESH_SECRET, { expiresIn: '7d' });
}

function sendRefreshTokenCookie(res, token) {
  const isProd = process.env.NODE_ENV === 'production';
  res.cookie('refreshToken', token, {
    httpOnly: true,
    secure: isProd,
    sameSite: 'lax',
    path: '/api/auth/refresh',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
}

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
      'SELECT id FROM users WHERE email = ? OR username = ?',
      [email, email]
    );

    if (existingUser.length > 0) {
      connection.release();
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Derive a simple username from name if not provided
    const username = name.toLowerCase().replace(/\s+/g, '') || email.split('@')[0];

    // Create user
    const [result] = await connection.execute(
      'INSERT INTO users (name, username, email, password, bio, profile_image, social_links) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [name, username, email, hashedPassword, 'Cultural Enthusiast & Content Creator', null, JSON.stringify([])]
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

    // Generate tokens
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // Set refresh token as HttpOnly secure cookie (used by /api/auth/refresh)
    sendRefreshTokenCookie(res, refreshToken);

    // Return access token (client may store it as they prefer)
    res.json({
      success: true,
      accessToken,
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

// Refresh token endpoint - issues new access token when refresh cookie is valid
app.post('/api/auth/refresh', async (req, res) => {
  try {
    const token = req.cookies.refreshToken;
    if (!token) return res.status(401).json({ error: 'No refresh token' });

    let payload;
    try {
      payload = jwt.verify(token, JWT_REFRESH_SECRET);
    } catch (err) {
      return res.status(401).json({ error: 'Invalid refresh token' });
    }

    const userId = payload.userId;
    // Optionally: verify user still exists
    const connection = await getDBConnection();
    const [users] = await connection.execute('SELECT id, email FROM users WHERE id = ?', [userId]);
    connection.release();

    if (users.length === 0) return res.status(401).json({ error: 'Invalid user' });

    const user = users[0];
    const accessToken = generateAccessToken(user);
    // Optionally rotate refresh token
    const newRefreshToken = generateRefreshToken(user);
    sendRefreshTokenCookie(res, newRefreshToken);

    res.json({ accessToken });
  } catch (error) {
    console.error('Refresh token error:', error);
    res.status(500).json({ error: 'Failed to refresh token' });
  }
});

// Logout - clear refresh token cookie
app.post('/api/auth/logout', (req, res) => {
  res.clearCookie('refreshToken', { path: '/api/auth/refresh' });
  res.json({ success: true });
});

// ============= User Routes =============

// GET USER PROFILE
app.get('/api/user/profile', verifyToken, async (req, res) => {
  try {
    const connection = await getDBConnection();

    // Get user data
    const [users] = await connection.execute(
      'SELECT id, name, username, email, bio, profile_image, social_links FROM users WHERE id = ?',
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
      id: user.id,
      name: user.name,
      username: user.username,
      email: user.email,
      bio: user.bio,
      profileImage: user.profile_image,
      socialLinks: user.social_links ? JSON.parse(user.social_links) : [],
      posts: stats[0]?.posts || 0,
      followers: stats[0]?.followers || 0,
      following: stats[0]?.following || 0,
      communities: stats[0]?.communities || 0,
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
    const { name, username, email, bio, interests, profileImage, socialLinks } = req.body;
    const connection = await getDBConnection();

    // Update user info
    await connection.execute(
      'UPDATE users SET name = ?, username = ?, email = ?, bio = ?, profile_image = ?, social_links = ? WHERE id = ?',
      [name, username || null, email, bio, profileImage || null, socialLinks ? JSON.stringify(socialLinks) : JSON.stringify([]), req.userId]
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

// Public Posts API
// Get recent posts (public)
app.get('/api/posts', async (req, res) => {
  try {
    const connection = await getDBConnection();
    const [posts] = await connection.execute(
      `SELECT p.id, p.title, p.content, p.category, p.created_at, u.id as user_id, u.name as author, u.username as authorUsername
       FROM posts p
       JOIN users u ON p.user_id = u.id
       ORDER BY p.created_at DESC`
    );
    connection.release();
    res.json(posts);
  } catch (error) {
    console.error('Get posts (public) error:', error);
    res.status(500).json({ error: 'Failed to get posts' });
  }
});

// Create a post (authenticated)
app.post('/api/posts', verifyToken, async (req, res) => {
  try {
    const { title, content, category } = req.body;
    if (!title) return res.status(400).json({ error: 'Title is required' });

    const connection = await getDBConnection();
    const [result] = await connection.execute(
      'INSERT INTO posts (user_id, title, content, category) VALUES (?, ?, ?, ?)',
      [req.userId, title, content || '', category || 'General']
    );
    connection.release();
    res.json({ success: true, postId: result.insertId });
  } catch (error) {
    console.error('Create post error (public API):', error);
    res.status(500).json({ error: 'Failed to create post' });
  }
});

// Delete a post (authenticated, owner only)
app.delete('/api/posts/:id', verifyToken, async (req, res) => {
  try {
    const postId = req.params.id;
    const connection = await getDBConnection();
    const [posts] = await connection.execute('SELECT id, user_id FROM posts WHERE id = ?', [postId]);
    if (!posts || posts.length === 0) {
      connection.release();
      return res.status(404).json({ error: 'Post not found' });
    }
    const post = posts[0];
    if (post.user_id !== req.userId) {
      connection.release();
      return res.status(403).json({ error: 'Unauthorized' });
    }
    await connection.execute('DELETE FROM posts WHERE id = ?', [postId]);
    connection.release();
    res.json({ success: true, message: 'Post deleted' });
  } catch (error) {
    console.error('Delete post error:', error);
    res.status(500).json({ error: 'Failed to delete post' });
  }
});

// Edit a post (authenticated, owner only)
app.put('/api/posts/:id', verifyToken, async (req, res) => {
  try {
    const postId = req.params.id;
    const { title, content, category } = req.body;
    const connection = await getDBConnection();

    const [posts] = await connection.execute('SELECT id, user_id FROM posts WHERE id = ?', [postId]);
    if (!posts || posts.length === 0) {
      connection.release();
      return res.status(404).json({ error: 'Post not found' });
    }

    const post = posts[0];
    if (post.user_id !== req.userId) {
      connection.release();
      return res.status(403).json({ error: 'Unauthorized' });
    }

    await connection.execute(
      'UPDATE posts SET title = ?, content = ?, category = ? WHERE id = ?',
      [title, content, category || 'General', postId]
    );

    connection.release();
    res.json({ success: true, message: 'Post updated' });
  } catch (error) {
    console.error('Update post error:', error);
    res.status(500).json({ error: 'Failed to update post' });
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

// Stats: posts per week (last 8 weeks)
app.get('/api/stats/posts-per-week', async (req, res) => {
  try {
    const connection = await getDBConnection();
    const [rows] = await connection.execute('SELECT created_at FROM posts');
    // rows may be array of objects with created_at as Date or string
    const now = new Date();
    const counts = new Array(8).fill(0);
    const labels = [];

    // Build labels: 7 weeks ago -> this week
    for (let i = 7; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i * 7);
      d.setHours(0, 0, 0, 0);
      labels.push(d.toISOString().slice(0, 10));
    }

    for (const r of rows) {
      const created = r.created_at || r.createdAt || r.createdAt;
      const pd = new Date(created);
      if (isNaN(pd.getTime())) continue;
      const diffDays = Math.floor((now - pd) / (1000 * 60 * 60 * 24));
      const weekIndex = Math.floor(diffDays / 7);
      if (weekIndex >= 0 && weekIndex < 8) {
        const idx = 7 - weekIndex;
        counts[idx] += 1;
      }
    }

    connection.release();
    res.json({ labels, values: counts });
  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).json({ error: 'Failed to compute stats' });
  }
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
