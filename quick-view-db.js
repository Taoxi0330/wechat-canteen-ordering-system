
const db = require('./services/db');

async function view() {
  console.log('--- Quick DB View ---\n');
  
  try {
    const conn = await db.testConnection();
    console.log('OK - DB connected!\n');
    
    console.log('1. Getting tables...');
    const [tables] = await db.pool.execute('SHOW TABLES');
    const names = [];
    console.log('Tables found:');
    for (let i = 0; i < tables.length; i++) {
      const n = Object.values(tables[i])[0];
      names.push(n);
      console.log('- ' + n);
    }
    
    console.log('\n2. Showing data...');
    for (let i = 0; i < names.length; i++) {
      const t = names[i];
      console.log('\n=== ' + t + ' ===');
      const [data] = await db.pool.execute('SELECT * FROM ' + t + ' LIMIT 5');
      console.log('Total: ' + data.length);
      if (data.length > 0) {
        const cols = Object.keys(data[0]);
        for (let j = 0; j < data.length; j++) {
          const row = data[j];
          const parts = [];
          for (let k = 0; k < cols.length; k++) {
            let v = row[cols[k]];
            if (v !== null && typeof v === 'string' && v.length > 25) {
              v = v.substring(0, 25) + '...';
            }
            parts.push(cols[k] + '=' + v);
          }
          console.log((j+1) + '. ' + parts.join(' | '));
        }
      }
    }
    
    console.log('\n--- Done ---');
  } catch (e) {
    console.log('Error:', e.message);
  }
}

view();
