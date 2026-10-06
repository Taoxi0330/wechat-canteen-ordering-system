// 数据库迁移脚本 - 添加菜品字段
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

    // 检查并添加辣度字段
    try {
      await connection.query('ALTER TABLE dishes ADD COLUMN spiciness VARCHAR(20) DEFAULT "不辣"');
      console.log('添加辣度字段成功');
    } catch (error) {
      if (error.code === 'DUPLICATE_COLUMN') {
        console.log('辣度字段已存在');
      } else {
        throw error;
      }
    }

    // 检查并添加规格字段
    try {
      await connection.query('ALTER TABLE dishes ADD COLUMN specifications TEXT');
      console.log('添加规格字段成功');
    } catch (error) {
      if (error.code === 'DUPLICATE_COLUMN') {
        console.log('规格字段已存在');
      } else {
        throw error;
      }
    }

    // 更新现有菜品的辣度数据
    await connection.query(`
      UPDATE dishes SET spiciness = CASE
        WHEN category = '热菜' AND name LIKE '%辣%' THEN '中辣'
        WHEN category = '热菜' THEN '微辣'
        ELSE '不辣'
      END
    `);
    console.log('更新菜品辣度数据成功');

    await connection.end();
    console.log('数据库更新完成');
  } catch (error) {
    console.error('数据库更新失败:', error.message);
  }
}

updateDatabase();
