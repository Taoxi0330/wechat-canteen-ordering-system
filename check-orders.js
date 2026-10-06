const mysql = require('mysql2/promise');

const config = {
  host: 'localhost',
  user: 'root',
  password: '1234',
  database: 'canteen_ordering'
};

async function check() {
  console.log('--- Check Orders ---');
  
  let conn;
  try {
    conn = await mysql.createConnection(config);
    console.log('Connected!');
    
    const [orders] = await conn.execute('SELECT id, reservation_time, created_at, order_type FROM orders ORDER BY id DESC LIMIT 10');
    console.log('\n--- Orders ---');
    orders.forEach(o => {
      console.log(`id=${o.id}`);
      console.log(`  order_type=${o.order_type}`);
      console.log(`  created_at=${o.created_at}`);
      console.log(`  reservation_time=${o.reservation_time}`);
      console.log(`  reservation_time type=${typeof o.reservation_time}`);
      if (o.reservation_time) {
        const d = new Date(o.reservation_time);
        console.log(`  parsed date=${d}`);
        console.log(`  valid date=${!isNaN(d.getTime())}`);
      }
      console.log('---');
    });
    
  } catch (e) {
    console.log('Error: ' + e.message);
    console.error(e);
  } finally {
    if (conn) {
      await conn.end();
    }
  }
}

check();
