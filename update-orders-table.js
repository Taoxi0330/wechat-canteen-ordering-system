const db = require('./services/db');

async function updateOrdersTable() {
  try {
    // 连接数据库
    const connection = await db.pool.getConnection();
    
    console.log('正在修改订单表结构...');
    
    // 添加预约时间字段
    await connection.query(`
      ALTER TABLE orders ADD COLUMN reservation_time DATETIME NULL DEFAULT NULL AFTER status
    `);
    
    console.log('添加预约时间字段成功');
    
    // 添加订单类型字段（如果不存在）
    try {
      await connection.query(`
        ALTER TABLE orders ADD COLUMN order_type ENUM('dine_in', 'takeaway') DEFAULT 'dine_in' AFTER merchant_id
      `);
      console.log('添加订单类型字段成功');
    } catch (error) {
      console.log('订单类型字段可能已存在，跳过添加');
    }
    
    // 添加取餐码字段（如果不存在）
    try {
      await connection.query(`
        ALTER TABLE orders ADD COLUMN pickup_code VARCHAR(20) NULL DEFAULT NULL AFTER order_type
      `);
      console.log('添加取餐码字段成功');
    } catch (error) {
      console.log('取餐码字段可能已存在，跳过添加');
    }
    
    // 添加地址字段（如果不存在）
    try {
      await connection.query(`
        ALTER TABLE orders ADD COLUMN address TEXT NULL DEFAULT NULL AFTER pickup_code
      `);
      console.log('添加地址字段成功');
    } catch (error) {
      console.log('地址字段可能已存在，跳过添加');
    }
    
    // 添加电话字段（如果不存在）
    try {
      await connection.query(`
        ALTER TABLE orders ADD COLUMN phone VARCHAR(20) NULL DEFAULT NULL AFTER address
      `);
      console.log('添加电话字段成功');
    } catch (error) {
      console.log('电话字段可能已存在，跳过添加');
    }
    
    // 添加备注字段（如果不存在）
    try {
      await connection.query(`
        ALTER TABLE orders ADD COLUMN remark TEXT NULL DEFAULT NULL AFTER phone
      `);
      console.log('添加备注字段成功');
    } catch (error) {
      console.log('备注字段可能已存在，跳过添加');
    }
    
    connection.release();
    console.log('订单表结构修改完成');
  } catch (error) {
    console.error('修改订单表结构失败:', error.message);
  }
}

// 执行修改
updateOrdersTable();