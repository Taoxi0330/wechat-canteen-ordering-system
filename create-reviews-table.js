const db = require('./services/db');

async function createReviewsTable() {
  try {
    // 创建评价表
    const createTableSQL = `
      CREATE TABLE IF NOT EXISTS reviews (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        merchant_id INT NOT NULL,
        dish_id INT NOT NULL,
        order_id INT NOT NULL,
        rating INT NOT NULL COMMENT '评分：1-5星',
        content TEXT COMMENT '评价内容',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (merchant_id) REFERENCES merchants(id) ON DELETE CASCADE,
        FOREIGN KEY (dish_id) REFERENCES dishes(id) ON DELETE CASCADE,
        FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
        INDEX idx_merchant (merchant_id),
        INDEX idx_dish (dish_id),
        INDEX idx_user (user_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='评价表'
    `;
    
    await db.pool.execute(createTableSQL);
    console.log('✓ 评价表创建成功');
    
    // 添加默认评价数据（测试用）
    const insertSQL = `
      INSERT IGNORE INTO reviews (user_id, merchant_id, dish_id, order_id, rating, content) VALUES
      (1, 2, 5, 1, 5, '味道很好，分量很足！'),
      (2, 2, 6, 2, 4, '还不错，就是有点辣'),
      (1, 2, 40, 29, 5, '襄阳牛肉面超好吃，强烈推荐！')
    `;
    
    await db.pool.execute(insertSQL);
    console.log('✓ 测试评价数据添加成功');
    
    process.exit(0);
  } catch (error) {
    console.error('创建评价表失败:', error);
    process.exit(1);
  }
}

createReviewsTable();
