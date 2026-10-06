const db = require('./services/db');

async function checkDbStructure() {
  try {
    console.log('检查数据库表结构...');
    
    // 检查orders表结构
    const [ordersFields] = await db.pool.execute('DESCRIBE orders');
    console.log('Orders表字段结构:');
    ordersFields.forEach(field => {
      console.log(`${field.Field}: ${field.Type} ${field.Null} ${field.Default}`);
    });
    
    // 检查order_items表结构
    const [orderItemsFields] = await db.pool.execute('DESCRIBE order_items');
    console.log('\nOrder_items表字段结构:');
    orderItemsFields.forEach(field => {
      console.log(`${field.Field}: ${field.Type} ${field.Null} ${field.Default}`);
    });
    
  } catch (error) {
    console.error('检查数据库结构失败:', error.message);
  } finally {
    db.pool.end();
  }
}

checkDbStructure();
