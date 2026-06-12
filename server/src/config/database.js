const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

pool.on('connect', () => {
  if (process.env.NODE_ENV === 'development') {
    console.log('✅ Database connected');
  }
});

pool.on('error', (err) => {
  console.error('❌ Unexpected database error:', err.message);
});

/**
 * Execute a query with optional parameters
 * @param {string} text - SQL query
 * @param {Array} params - Query parameters
 */
const query = async (text, params) => {
  const start = Date.now();
  const result = await pool.query(text, params);
  if (process.env.NODE_ENV === 'development') {
    const duration = Date.now() - start;
    if (duration > 100) {
      console.log(`⚠️  Slow query (${duration}ms):`, text.substring(0, 60));
    }
  }
  return result;
};

/**
 * Get a client from the pool for transactions
 */
const getClient = () => pool.connect();

module.exports = { query, getClient, pool };
