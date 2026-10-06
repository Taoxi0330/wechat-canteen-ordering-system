// 创建地址表
const mysql = require('mysql2/promise');

async function createAddressTable() {
  let connection;
  
  try {
    connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '1234',
      database: 'canteen_ordering'
    });
    console.log('连接数据库成功');

    // 创建地址表
    await connection.query(`
      CREATE TABLE IF NOT EXISTS addresses (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        name VARCHAR(50) NOT NULL,
        phone VARCHAR(20) NOT NULL,
        address TEXT NOT NULL,
        is_default TINYINT(1) DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);
    console.log('创建地址表成功');

    // 插入示例地址数据
    await connection.query(`
      INSERT INTO addresses (user_id, name, phone, address, is_default) VALUES
      (1, '张三', '13800138000', '第一食堂门口', 1),
      (1, '李四', '13900139000', '图书馆三楼', 0),
      (2, '王五', '13700137000', '学生宿舍1号楼', 1)
    `);
    console.log('插入示例地址数据成功');

    console.log('地址表创建完成！');

  } catch (error) {
    console.error('创建地址表失败:', error.message);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

createAddressTable();