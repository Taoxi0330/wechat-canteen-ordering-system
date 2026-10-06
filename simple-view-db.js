
const mysql = require('mysql2/promise');

const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '1234',
  database: 'canteen_ordering'
};

async function run() {
  console.log('========================================');
  console.log('  Simple DB Viewer');
  console.log('========================================\n');

  let conn;
  try {
    conn = await mysql.createConnection(dbConfig);
    console.log('[OK] Connected!\n');
    
    const [tables] = await conn.execute('SHOW TABLES');
    console.log('Tables in database:');
    const tableNames = [];
    for (let i = 0; i &lt; tables.length; i++) {
      const name = Object.values(tables[i])[0];
      tableNames.push(name);
      console.log('- ' + name);
    }
    
    console.log('\n\n--- DATA ---');
    for (let i = 0; i &lt; tableNames.length; i++) {
      const table = tableNames[i];
      const [rows] = await conn.execute('SELECT * FROM ' + table + ' LIMIT 5');
      console.log('\nTable: ' + table);
      console.log('Rows: ' + rows.length);
      if (rows.length &gt; 0) {
        const cols = Object.keys(rows[0]);
        console.log('Columns: ' + cols.join(', '));
        for (let j = 0; j &lt; rows.length; j++) {
          console.log('Row ' + (j+1) + ':');
          for (let k = 0; k &lt; cols.length; k++) {
            const col = cols[k];
            let val = rows[j][col];
            if (val !== null &amp;&amp; typeof val === 'string' &amp;&amp; val.length &gt; 50) {
              val = val.substring(0, 50) + '...';
            }
            console.log('  ' + col + ': ' + val);
          }
        }
      }
    }
    
    console.log('\n\n--- STRUCTURE ---');
    for (let i = 0; i &lt; tableNames.length; i++) {
      const table = tableNames[i];
      const [cols] = await conn.execute('DESCRIBE ' + table);
      console.log('\nTable: ' + table);
      for (let j = 0; j &lt; cols.length; j++) {
        const col = cols[j];
        console.log('  ' + col.Field + ': ' + col.Type + ' (Null: ' + col.Null + ', Key: ' + col.Key + ')');
      }
    }
    
  } catch (err) {
    console.log('[ERROR] ' + err.message);
    console.log('\nPlease check:');
    console.log('1. MySQL is running');
    console.log('2. Database "canteen_ordering" exists');
    console.log('3. Username/password is correct');
  } finally {
    if (conn) {
      await conn.end();
    }
  }
}

run();
