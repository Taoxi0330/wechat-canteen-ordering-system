// 数据库迁移脚本 v2 - 添加规格价格支持
const mysql = require('mysql2/promise');

async function updateDatabase() {
  try {
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '1234',
      database: 'canteen_ordering'
    });

    console.log('连接到数据库成功');

    // 检查并添加规格价格字段（JSON格式）
    try {
      await connection.query('ALTER TABLE dishes ADD COLUMN spec_prices JSON');
      console.log('添加规格价格字段成功');
    } catch (error) {
      if (error.code === 'DUPLICATE_COLUMN') {
        console.log('规格价格字段已存在');
      } else {
        throw error;
      }
    }

    await connection.end();
    console.log('数据库更新完成');
  } catch (error) {
    console.error('数据库更新失败:', error.message);
  }
}

updateDatabase();
