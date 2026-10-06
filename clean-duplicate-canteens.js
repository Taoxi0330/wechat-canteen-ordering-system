const mysql = require('mysql2/promise');

const config = {
  host: 'localhost',
  user: 'root',
  password: '1234',
  database: 'canteen_ordering'
};

async function clean() {
  console.log('--- Cleaning Duplicate Canteens ---');
  
  let conn;
  try {
    conn = await mysql.createConnection(config);
    console.log('Connected!');
    
    // 查看所有食堂数据
    console.log('\n--- Current Canteens ---');
    const [allCanteens] = await conn.execute('SELECT * FROM canteens ORDER BY id ASC');
    allCanteens.forEach(c => {
      console.log(`id=${c.id}, name=${c.name}`);
    });
    
    // 需要保留的食堂ID
    const keepIds = [1, 2, 3];
    
    console.log('\n--- Checking Merchant Associations ---');
    const [merchants] = await conn.execute('SELECT * FROM merchants WHERE canteen_id NOT IN (?, ?, ?)', keepIds);
    console.log(`Merchants linked to duplicate canteens: ${merchants.length}`);
    
    // 如果有商家关联到重复食堂，更新它们的canteen_id
    if (merchants.length > 0) {
      console.log('\n--- Updating Merchant Canteen IDs ---');
      for (const merchant of merchants) {
        // 把所有商家都归到第一个食堂
        await conn.execute('UPDATE merchants SET canteen_id = ? WHERE id = ?', [1, merchant.id]);
        console.log(`Merchant ${merchant.id}: canteen_id ${merchant.canteen_id} -> 1`);
      }
    }
    
    // 删除重复的食堂
    console.log('\n--- Deleting Duplicate Canteens ---');
    const [result] = await conn.execute('DELETE FROM canteens WHERE id NOT IN (?, ?, ?)', keepIds);
    console.log(`Deleted ${result.affectedRows} duplicate canteens`);
    
    // 验证结果
    console.log('\n--- Final Canteens ---');
    const [finalCanteens] = await conn.execute('SELECT * FROM canteens ORDER BY id ASC');
    finalCanteens.forEach(c => {
      console.log(`id=${c.id}, name=${c.name}`);
    });
    
    console.log('\n✅ Cleanup completed successfully!');
    
  } catch (e) {
    console.log('Error: ' + e.message);
    console.error(e);
  } finally {
    if (conn) {
      await conn.end();
    }
  }
}

clean();
