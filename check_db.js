(async ()=>{
  try{
    const mysql = require('mysql2/promise');
    require('dotenv').config();
    const pool = mysql.createPool({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'cultural_hub',
      waitForConnections: true,
      connectionLimit: 5
    });

    const conn = await pool.getConnection();
    const [rows] = await conn.execute('SELECT 1 AS ok');
    console.log('DB OK:', rows);
    conn.release();
    await pool.end();
  }catch(e){
    console.error('DB Test Error:', e.message);
    if (e.stack) console.error(e.stack);
    process.exit(1);
  }
})();