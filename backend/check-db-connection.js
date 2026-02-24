require('dotenv').config();
const pool = require('./api/db/connection');

async function checkConnection() {
  console.log('\n=== Database Connection Diagnostic ===\n');
  
  console.log('Configuration:');
  console.log(`  Host: ${process.env.DB_HOST}`);
  console.log(`  Port: ${process.env.DB_PORT}`);
  console.log(`  Database: ${process.env.DB_NAME}`);
  console.log(`  User: ${process.env.DB_USER}`);
  console.log(`  SSL: ${process.env.DB_SSL}\n`);
  
  console.log('Testing connection...\n');
  
  try {
    const connection = await pool.getConnection();
    console.log('✅ Connection pool created successfully');
    
    // Test query
    const [rows] = await connection.query('SELECT 1 as test, DATABASE() as db, USER() as user');
    console.log('✅ Test query successful');
    console.log(`  Current database: ${rows[0].db}`);
    console.log(`  Current user: ${rows[0].user}\n`);
    
    // Check tables
    const [tables] = await connection.query(
      "SELECT TABLE_NAME FROM information_schema.TABLES WHERE TABLE_SCHEMA = ?",
      [process.env.DB_NAME]
    );
    
    if (tables.length > 0) {
      console.log(`✅ Found ${tables.length} table(s):`);
      tables.forEach(table => {
        console.log(`   - ${table.TABLE_NAME}`);
      });
    } else {
      console.log('⚠️  No tables found. Run: npm run init-db');
    }
    
    connection.release();
    console.log('\n✅ Database connection is working correctly!\n');
    process.exit(0);
    
  } catch (error) {
    console.error('\n❌ Connection failed!\n');
    console.error('Error Details:');
    console.error(`  Code: ${error.code}`);
    console.error(`  Message: ${error.message}\n`);
    
    if (error.code === 'ENOTFOUND') {
      console.error('🔍 DNS Resolution Failed');
      console.error('\nThe hostname cannot be resolved. Please:');
      console.error('1. Go to https://console.aiven.io/');
      console.error('2. Select your MySQL service');
      console.error('3. Check "Connection information" or "Overview"');
      console.error('4. Copy the EXACT hostname shown there');
      console.error('5. Update DB_HOST in backend/.env file\n');
      console.error('Common hostname formats:');
      console.error('  - your-service.a.aivencloud.com');
      console.error('  - your-service.d.aivencloud.com');
      console.error('  - your-service.i.aivencloud.com (internal only)\n');
    } else if (error.code === 'ECONNREFUSED') {
      console.error('🔍 Connection Refused');
      console.error('\nThe server refused the connection. Check:');
      console.error('1. Port number is correct');
      console.error('2. Aiven service is running');
      console.error('3. Firewall/network allows connections\n');
    } else if (error.code === 'ETIMEDOUT') {
      console.error('🔍 Connection Timeout');
      console.error('\nConnection timed out. Check:');
      console.error('1. Internet connection');
      console.error('2. Firewall settings');
      console.error('3. IP whitelist in Aiven\n');
    }
    
    process.exit(1);
  }
}

// Wait a bit for connection pool to initialize
setTimeout(() => {
  checkConnection();
}, 1000);
