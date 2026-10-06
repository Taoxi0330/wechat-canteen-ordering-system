
const mysql = require('mysql2/promise');

const config = {
  host: 'localhost',
  user: 'root',
  password: '1234',
  multipleStatements: true
};

async function fix() {
  console.log('--- Fix MySQL Authentication ---\n');
  
  let conn;
  try {
    conn = await mysql.createConnection(config);
    console.log('Connected to MySQL!\n');
    
    console.log('1. Modifying root user authentication...');
    await conn.execute("ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '1234'");
    console.log('   OK - User authentication changed!');
    
    console.log('\n2. Flushing privileges...');
    await conn.execute('FLUSH PRIVILEGES');
    console.log('   OK - Privileges flushed!');
    
    console.log('\n3. Verifying...');
    const [users] = await conn.execute("SELECT user, host, plugin FROM mysql.user WHERE user = 'root'");
    for (let i = 0; i < users.length; i++) {
      const u = users[i];
      console.log('   User: ' + u.user + '@' + u.host + ' | Plugin: ' + u.plugin);
    }
    
    console.log('\n✅ Done! Now you can use Navicat to connect!');
    console.log('Connection info:');
    console.log('  Host: localhost');
    console.log('  Port: 3306');
    console.log('  User: root');
    console.log('  Password: 1234');
    console.log('  Database: canteen_ordering');
    
  } catch (e) {
    console.log('Error:', e.message);
    if (e.message.includes('Unknown database')) {
      console.log('\nNote: Database might not be selected yet, that is OK!');
    }
  } finally {
    if (conn) {
      await conn.end();
    }
  }
}

fix();
