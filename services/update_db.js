const db = require('./db');

async function updateDatabase() {
  console.log('开始更新数据库...');
  
  try {
    const connection = await db.pool.getConnection();
    
    // 添加 pickup_code 字段
    try {
      await connection.execute(`
        ALTER TABLE orders ADD COLUMN pickup_code VARCHAR(10) AFTER status
      `);
      console.log('✓ 添加 pickup_code 字段成功');
    } catch (error) {
      if (error.code === 'ER_DUP_FIELDNAME') {
        console.log('- pickup_code 字段已存在');
      } else {
        throw error;
      }
    }
    
    // 添加 order_type 字段
    try {
      await connection.execute(`
        ALTER TABLE orders ADD COLUMN order_type VARCHAR(20) DEFAULT 'eatIn' AFTER total_price
      `);
      console.log('✓ 添加 order_type 字段成功');
    } catch (error) {
      if (error.code === 'ER_DUP_FIELDNAME') {
        console.log('- order_type 字段已存在');
      } else {
        throw error;
      }
    }
    
    // 添加 remark 字段
    try {
      await connection.execute(`
        ALTER TABLE orders ADD COLUMN remark TEXT AFTER order_type
      `);
      console.log('✓ 添加 remark 字段成功');
    } catch (error) {
      if (error.code === 'ER_DUP_FIELDNAME') {
        console.log('- remark 字段已存在');
      } else {
        throw error;
      }
    }
    
    // 为 order_items 表添加字段
    try {
      await connection.execute(`
        ALTER TABLE order_items ADD COLUMN name VARCHAR(100) AFTER dish_id
      `);
      console.log('✓ 添加 order_items.name 字段成功');
    } catch (error) {
      if (error.code === 'ER_DUP_FIELDNAME') {
        console.log('- order_items.name 字段已存在');
      } else {
        throw error;
      }
    }
    
    try {
      await connection.execute(`
        ALTER TABLE order_items ADD COLUMN specification VARCHAR(100) AFTER name
      `);
      console.log('✓ 添加 order_items.specification 字段成功');
    } catch (error) {
      if (error.code === 'ER_DUP_FIELDNAME') {
        console.log('- order_items.specification 字段已存在');
      } else {
        throw error;
      }
    }
    
    try {
      await connection.execute(`
        ALTER TABLE order_items ADD COLUMN spiciness VARCHAR(50) AFTER specification
      `);
      console.log('✓ 添加 order_items.spiciness 字段成功');
    } catch (error) {
      if (error.code === 'ER_DUP_FIELDNAME') {
        console.log('- order_items.spiciness 字段已存在');
      } else {
        throw error;
      }
    }
    
    connection.release();
    console.log('\n🎉 数据库更新完成！');
    
  } catch (error) {
    console.error('\n❌ 数据库更新失败:', error.message);
    process.exit(1);
  }
}

updateDatabase();
