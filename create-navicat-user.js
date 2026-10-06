
const mysql = require('mysql2/promise');

const config = {
  host: 'localhost',
  user: 'root',
  password: '1234',
  multipleStatements: true
};

async function createUser() {
  console.log('--- Create Navicat User ---\n');
  
  let conn;
  try {
    conn = await mysql.createConnection(config);
    console.log('Connected to MySQL!\n');
    
    const username = 'navicat';
    const password = 'navicat123';
    
    console.log('1. Creating user "' + username + '"...');
    try {
      await conn.execute("CREATE USER IF NOT EXISTS '" + username + "'@'localhost' IDENTIFIED BY '" + password + "'");
      console.log('   OK - User created!');
    } catch (e) {
      console.log('   Note: User might already exist, continuing...');
    }
    
    console.log('\n2. Granting privileges...');
    await conn.execute("GRANT ALL PRIVILEGES ON canteen_ordering.* TO '" + username + "'@'localhost'");
    console.log('   OK - Privileges granted!');
    
    console.log('\n3. Flushing privileges...');
    await conn.execute('FLUSH PRIVILEGES');
    console.log('   OK - Privileges flushed!');
    
    console.log('\n✅ Done! Now use these credentials in Navicat:');
    console.log('Connection info:');
    console.log('  Host: localhost');
    console.log('  Port: 3306');
    console.log('  User: ' + username);
    console.log('  Password: ' + password);
    console.log('  Database: canteen_ordering');
    console.log('\nAfter connecting, double-click "canteen_ordering" to open the database!');
    
  } catch (e) {
    console.log('Error:', e.message);
  } finally {
    if (conn) {
      await conn.end();
    }
  }
}

createUser();
