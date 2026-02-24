const dns = require('dns');
const mysql = require('mysql2/promise');
require('dotenv').config();

async function testConnection() {
  console.log('=== Testing Database Connection ===\n');
  
  const host = process.env.DB_HOST;
  const port = process.env.DB_PORT;
  
  console.log('1. Testing DNS Resolution...');
  console.log(`   Hostname: ${host}`);
  
  try {
    const addresses = await dns.promises.resolve4(host);
    console.log(`   ✅ DNS resolved successfully!`);
    console.log(`   IP Address(es): ${addresses.join(', ')}\n`);
  } catch (err) {
    console.log(`   ❌ DNS resolution failed: ${err.message}\n`);
    console.log('   This means your computer cannot resolve the hostname.');
    console.log('   Possible causes:');
    console.log('   - Internet connection issue');
    console.log('   - Incorrect hostname');
    console.log('   - DNS server issue\n');
    return;
  }
  
  console.log('2. Testing MySQL Connection...');
  console.log(`   Host: ${host}`);
  console.log(`   Port: ${port}`);
  console.log(`   Database: ${process.env.DB_NAME}`);
  console.log(`   User: ${process.env.DB_USER}`);
  console.log(`   SSL: ${process.env.DB_SSL}\n`);
  
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: parseInt(process.env.DB_PORT),
      ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
      connectTimeout: 10000
    });
    
    console.log('   ✅ MySQL connection successful!\n');
    
    // Test a simple query
    const [rows] = await connection.execute('SELECT 1 as test');
    console.log('   ✅ Query test successful:', rows);
    
    // Check if tables exist
    const [tables] = await connection.execute(
      "SELECT TABLE_NAME FROM information_schema.TABLES WHERE TABLE_SCHEMA = ?",
      [process.env.DB_NAME]
    );
    
    console.log('\n3. Checking database tables...');
    if (tables.length > 0) {
      console.log(`   ✅ Found ${tables.length} table(s):`);
      tables.forEach(table => {
        console.log(`      - ${table.TABLE_NAME}`);
      });
    } else {
      console.log('   ⚠️  No tables found. Run: npm run init-db');
    }
    
    await connection.end();
    console.log('\n✅ All tests passed! Database is ready to use.');
    
  } catch (err) {
    console.log(`   ❌ MySQL connection failed!\n`);
    console.log('   Error Details:');
    console.log(`   Code: ${err.code}`);
    console.log(`   Message: ${err.message}\n`);
    
    if (err.code === 'ENOTFOUND') {
      console.log('   💡 DNS resolution issue detected.');
      console.log('   Try:');
      console.log('   1. Check your internet connection');
      console.log('   2. Verify the hostname in Aiven console');
      console.log('   3. Try accessing Aiven console to verify service status');
    } else if (err.code === 'ECONNREFUSED') {
      console.log('   💡 Connection refused.');
      console.log('   Try:');
      console.log('   1. Verify the port number is correct');
      console.log('   2. Check if Aiven service is running');
    } else if (err.code === 'ER_ACCESS_DENIED_ERROR') {
      console.log('   💡 Authentication failed.');
      console.log('   Try:');
      console.log('   1. Verify username and password');
      console.log('   2. Check database name');
    } else if (err.code === 'ETIMEDOUT') {
      console.log('   💡 Connection timeout.');
      console.log('   Try:');
      console.log('   1. Check firewall settings');
      console.log('   2. Verify network connectivity');
      console.log('   3. Check if IP needs whitelisting in Aiven');
    }
  }
}

testConnection().catch(console.error);
