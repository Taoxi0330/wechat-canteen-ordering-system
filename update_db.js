const mysql = require('mysql2/promise');

async function updateDatabase() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '1234',
    database: 'canteen_ordering'
  });

  try {
    console.log('开始更新数据库...');
    
    // 检查 nutrition 字段是否已存在
    const [columns] = await connection.execute(
      "SHOW COLUMNS FROM dishes LIKE 'nutrition'"
    );
    
    if (columns.length > 0) {
      console.log('nutrition 字段已存在');
    } else {
      // 添加 nutrition 字段
      await connection.execute(
        "ALTER TABLE dishes ADD COLUMN nutrition JSON NULL COMMENT '营养信息，包含蛋白质、碳水化合物、脂肪、维生素等'"
      );
      console.log('nutrition 字段添加成功');
    }
    
    console.log('数据库更新完成！');
  } catch (error) {
    console.error('数据库更新失败:', error);
  } finally {
    await connection.end();
  }
}

updateDatabase();
