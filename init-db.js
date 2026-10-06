// 初始化数据库脚本
const mysql = require('mysql2/promise');

async function initDatabase() {
  try {
    // 首先连接到MySQL服务器
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '1234',
      multipleStatements: true
    });

    console.log('连接到MySQL服务器成功');

    // 创建数据库
    await connection.query('CREATE DATABASE IF NOT EXISTS canteen_ordering CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci');
    console.log('创建数据库成功');

    // 选择数据库
    await connection.query('USE canteen_ordering');
    console.log('选择数据库成功');

    // 创建食堂表
    await connection.query(`
      CREATE TABLE IF NOT EXISTS canteens (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        description TEXT,
        image VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    console.log('创建食堂表成功');

    // 创建用户表
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(50) NOT NULL,
        password VARCHAR(100) NOT NULL,
        avatar VARCHAR(255),
        phone VARCHAR(20),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    console.log('创建用户表成功');

    // 创建商家表
    await connection.query(`
      CREATE TABLE IF NOT EXISTS merchants (
        id INT AUTO_INCREMENT PRIMARY KEY,
        canteen_id INT,
        name VARCHAR(100) NOT NULL,
        description TEXT,
        image VARCHAR(255),
        hours VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (canteen_id) REFERENCES canteens(id) ON DELETE SET NULL
      )
    `);
    console.log('创建商家表成功');

    // 创建菜品表
    await connection.query(`
      CREATE TABLE IF NOT EXISTS dishes (
        id INT AUTO_INCREMENT PRIMARY KEY,
        merchant_id INT NOT NULL,
        name VARCHAR(100) NOT NULL,
        description TEXT,
        price DECIMAL(10, 2) NOT NULL,
        image VARCHAR(255),
        category VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (merchant_id) REFERENCES merchants(id) ON DELETE CASCADE
      )
    `);
    console.log('创建菜品表成功');

    // 创建订单表
    await connection.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        merchant_id INT NOT NULL,
        total_price DECIMAL(10, 2) NOT NULL,
        status ENUM('pending', 'processing', 'completed', 'cancelled') DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (merchant_id) REFERENCES merchants(id) ON DELETE CASCADE
      )
    `);
    console.log('创建订单表成功');

    // 创建订单明细表
    await connection.query(`
      CREATE TABLE IF NOT EXISTS order_items (
        id INT AUTO_INCREMENT PRIMARY KEY,
        order_id INT NOT NULL,
        dish_id INT NOT NULL,
        quantity INT NOT NULL,
        price DECIMAL(10, 2) NOT NULL,
        FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
        FOREIGN KEY (dish_id) REFERENCES dishes(id) ON DELETE CASCADE
      )
    `);
    console.log('创建订单明细表成功');

    // 插入示例数据
    // 插入食堂数据
    await connection.query(`
      INSERT INTO canteens (name, description, image) VALUES
      ('一食堂', '第一食堂，品种丰富', '/images/banner1.png'),
      ('二食堂', '第二食堂，环境优美', '/images/banner2.png'),
      ('三食堂', '第三食堂，性价比高', '/images/banner1.png')
    `);
    console.log('插入食堂数据成功');

    // 插入商家数据
    await connection.query(`
      INSERT INTO merchants (canteen_id, name, description, image, hours) VALUES
      (1, '川菜馆', '正宗川菜，口味麻辣鲜香', '/images/banner1.png', '09:00-22:00'),
      (1, '面食窗口', '各种面食，口感丰富', '/images/banner2.png', '07:00-19:00'),
      (2, '粤菜餐厅', '精致粤菜，口味清淡鲜美', '/images/banner1.png', '10:00-21:30'),
      (2, '快餐窗口', '快捷方便，营养均衡', '/images/banner2.png', '10:00-20:00'),
      (3, '西北风味', '地道西北菜，分量足', '/images/banner1.png', '09:30-22:30'),
      (3, '饮品窗口', '各种饮品，清凉解渴', '/images/banner2.png', '08:00-21:00')
    `);
    console.log('插入商家数据成功');

    // 插入菜品数据
    await connection.query(`
      INSERT INTO dishes (merchant_id, name, description, price, image, category) VALUES
      (1, '宫保鸡丁', '经典川菜，鸡肉嫩滑，花生香脆', 28.00, '/images/宫保鸡丁.png', '热菜'),
      (1, '香辣鱿鱼须', '麻辣鲜香，口感爽脆', 38.00, '/images/香辣鱿鱼须.png', '热菜'),
      (1, '新疆大盘鸡', '分量足，味道浓郁', 68.00, '/images/新疆大盘鸡.png', '热菜'),
      (1, '玉米排骨汤', '营养丰富，汤清味鲜', 22.00, '/images/玉米排骨汤.png', '汤品'),
      (2, '兰州拉面', '手工拉面，汤头浓郁', 18.00, '/images/宫保鸡丁.png', '主食'),
      (2, '刀削面', '手工刀削，口感劲道', 12.00, '/images/香辣鱿鱼须.png', '主食'),
      (3, '白切鸡', '皮爽肉滑，蘸料提味', 48.00, '/images/新疆大盘鸡.png', '热菜'),
      (3, '清蒸鲈鱼', '鲜嫩多汁，清淡爽口', 58.00, '/images/玉米排骨汤.png', '热菜'),
      (4, '套餐A', '营养均衡，快捷方便', 15.00, '/images/宫保鸡丁.png', '套餐'),
      (4, '套餐B', '品种丰富，美味可口', 18.00, '/images/香辣鱿鱼须.png', '套餐'),
      (5, '肉夹馍', '外酥里嫩，肉质鲜美', 12.00, '/images/新疆大盘鸡.png', '主食'),
      (5, '凉皮', '清凉爽口，开胃消暑', 10.00, '/images/玉米排骨汤.png', '小吃'),
      (6, '奶茶', '香醇浓郁，口感丝滑', 12.00, '/images/宫保鸡丁.png', '饮品'),
      (6, '果汁', '新鲜水果，健康美味', 10.00, '/images/香辣鱿鱼须.png', '饮品')
    `);
    console.log('插入菜品数据成功');

    // 插入用户数据
    await connection.query(`
      INSERT INTO users (username, password, avatar, phone) VALUES
      ('admin', '123456', '/images/avatar1.jpg', '13800138000'),
      ('user1', '123456', '/images/avatar2.jpg', '13900139000')
    `);
    console.log('插入用户数据成功');

    // 插入订单数据
    await connection.query(`
      INSERT INTO orders (user_id, merchant_id, total_price, status) VALUES
      (1, 1, 98.00, 'completed'),
      (1, 2, 58.00, 'pending'),
      (2, 3, 30.00, 'completed'),
      (2, 4, 25.00, 'processing')
    `);
    console.log('插入订单数据成功');

    // 插入订单明细数据
    await connection.query(`
      INSERT INTO order_items (order_id, dish_id, quantity, price) VALUES
      (1, 1, 1, 28.00),
      (1, 2, 1, 38.00),
      (1, 4, 1, 22.00),
      (2, 5, 1, 48.00),
      (3, 7, 1, 18.00),
      (3, 8, 1, 12.00),
      (4, 9, 1, 25.00)
    `);
    console.log('插入订单明细数据成功');

    // 关闭连接
    await connection.end();
    console.log('数据库初始化完成');

  } catch (error) {
    console.error('数据库初始化失败:', error.message);
  }
}

// 运行初始化
initDatabase();