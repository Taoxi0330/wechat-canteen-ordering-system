const db = require('./services/db');

async function addReplyField() {
  try {
    console.log('开始添加reply字段...');
    
    // 添加reply和reply_at字段
    await db.pool.execute(`
      ALTER TABLE reviews 
      ADD COLUMN reply TEXT COMMENT '商家回复内容',
      ADD COLUMN reply_at TIMESTAMP NULL COMMENT '回复时间'
    `);
    
    console.log('✅ reply字段添加成功！');
    
    // 查看表结构
    const [rows] = await db.pool.execute('DESCRIBE reviews');
    console.log('📋 reviews表结构：');
    rows.forEach(row => {
      console.log(`  - ${row.Field}: ${row.Type}`);
    });
    
    process.exit(0);
  } catch (error) {
    if (error.message.includes('Duplicate column name')) {
      console.log('ℹ️ reply字段已存在，无需添加');
      process.exit(0);
    } else {
      console.error('❌ 添加reply字段失败:', error.message);
      process.exit(1);
    }
  }
}

addReplyField();