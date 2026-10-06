
const mysql = require('mysql2/promise');

const config = {
  host: 'localhost',
  user: 'root',
  password: '1234',
  database: 'canteen_ordering'
};

async function check() {
  console.log('--- Check Database ---');
  
  let conn;
  try {
    conn = await mysql.createConnection(config);
    console.log('Connected!');
    
    const [tables] = await conn.execute('SHOW TABLES');
    console.log('\nTables:');
    const names = [];
    for (let i = 0; i < tables.length; i++) {
      const n = Object.values(tables[i])[0];
      names.push(n);
      console.log('- ' + n);
    }
    
    for (let i = 0; i < names.length; i++) {
      const t = names[i];
      console.log('\n--- ' + t + ' ---');
      const [data] = await conn.execute('SELECT * FROM ' + t + ' LIMIT 5');
      console.log('Count: ' + data.length);
      if (data.length > 0) {
        const cols = Object.keys(data[0]);
        for (let j = 0; j < data.length; j++) {
          const row = data[j];
          const vals = [];
          for (let k = 0; k < cols.length; k++) {
            let v = row[cols[k]];
            if (v !== null && typeof v === 'string' && v.length > 30) {
              v = v.substring(0, 30) + '...';
            }
            vals.push(cols[k] + '=' + v);
          }
          console.log('Row ' + (j+1) + ': ' + vals.join(', '));
        }
      }
    }
    
  } catch (e) {
    console.log('Error: ' + e.message);
  } finally {
    if (conn) {
      await conn.end();
    }
  }
}

check();
