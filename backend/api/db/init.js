const pool = require('./connection');
const fs = require('fs');
const path = require('path');

async function initializeDatabase() {
  try {
    console.log('Initializing database...');
    
    // Read schema file
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    // Split by semicolon and execute each statement
    const statements = schema
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));
    
    for (const statement of statements) {
      if (statement) {
        await pool.execute(statement);
        console.log('Executed:', statement.substring(0, 50) + '...');
      }
    }
    
    console.log('Database initialized successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Database initialization error:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  initializeDatabase();
}

module.exports = initializeDatabase;
