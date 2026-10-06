const mysql = require('mysql2/promise');

async function resetDatabase() {
  try {
    const conn = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '1234'
    });
    
    await conn.query('DROP DATABASE IF EXISTS canteen_ordering');
    console.log('旧数据库已删除');
    
    await conn.end();
    console.log('数据库重置完成，请运行 init-db.js 重新初始化');
  } catch (error) {
    console.error('重置数据库失败:', error.message);
  }
}

resetDatabase();
