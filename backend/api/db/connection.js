const mysql = require('mysql2/promise');
require('dotenv').config();

// Validate environment variables
const requiredEnvVars = ['DB_HOST', 'DB_USER', 'DB_PASSWORD', 'DB_NAME', 'DB_PORT'];
const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
  console.error('Missing required environment variables:', missingVars.join(', '));
  console.error('Please check your .env file');
}

// Log connection details (without password)
console.log('Attempting to connect to database:');
console.log(`  Host: ${process.env.DB_HOST}`);
console.log(`  Port: ${process.env.DB_PORT}`);
console.log(`  Database: ${process.env.DB_NAME}`);
console.log(`  User: ${process.env.DB_USER}`);
console.log(`  SSL: ${process.env.DB_SSL}`);

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: parseInt(process.env.DB_PORT) || 3306,
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  connectTimeout: 10000, // 10 seconds timeout
  enableKeepAlive: true
});

// Test connection with better error handling
let connectionTested = false;
let connectionError = null;

pool.getConnection()
  .then(async connection => {
    try {
      // Test with a simple query
      await connection.query('SELECT 1');
      console.log('✅ Database connected successfully!');
      connectionTested = true;
      connection.release();
    } catch (err) {
      connectionError = err;
      connection.release();
      throw err;
    }
  })
  .catch(err => {
    connectionError = err;
    console.error('❌ Database connection error:');
    console.error('   Error code:', err.code);
    console.error('   Error message:', err.message);
    
    if (err.code === 'ENOTFOUND') {
      console.error('\n💡 Troubleshooting tips:');
      console.error('   1. Verify the hostname is correct:', process.env.DB_HOST);
      console.error('   2. Check your internet connection');
      console.error('   3. Verify the Aiven service is running');
      console.error('   4. Check if your IP needs to be whitelisted in Aiven');
      console.error('   5. Try accessing Aiven console to verify the exact hostname');
    } else if (err.code === 'ECONNREFUSED') {
      console.error('\n💡 Troubleshooting tips:');
      console.error('   1. Verify the port is correct:', process.env.DB_PORT);
      console.error('   2. Check if the Aiven service is accessible');
    } else if (err.code === 'ER_ACCESS_DENIED_ERROR') {
      console.error('\n💡 Troubleshooting tips:');
      console.error('   1. Verify username and password are correct');
      console.error('   2. Check database name:', process.env.DB_NAME);
    }
    console.error('\n⚠️  Server will start but database operations will fail until connection is fixed.');
  });

// Helper function to check if database is connected
pool.isConnected = () => connectionTested && !connectionError;
pool.getConnectionError = () => connectionError;

module.exports = pool;
