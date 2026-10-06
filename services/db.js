// 数据库连接配置
const mysql = require('mysql2/promise');

// 创建数据库连接池
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '1234',
  database: 'canteen_ordering',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// 注意：在使用前请确保：
// 1. MySQL服务已启动
// 2. 已创建canteen_ordering数据库
// 3. 已执行init.sql脚本创建表结构和插入示例数据
// 4. 已正确配置MySQL root密码

// 测试数据库连接
async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('数据库连接成功');
    connection.release();
    return true;
  } catch (error) {
    console.error('数据库连接失败:', error);
    console.error('错误代码:', error.code);
    console.error('错误消息:', error.message);
    console.error('错误堆栈:', error.stack);
    return false;
  }
}

module.exports = {
  pool,
  testConnection
};