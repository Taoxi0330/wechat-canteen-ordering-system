const db = require('./db');

// 模拟数据
const mockCanteens = [
  { id: 1, name: '第一食堂', description: '位于校园东区，提供各类中式快餐' },
  { id: 2, name: '第二食堂', description: '位于校园西区，特色是面食和小吃' },
  { id: 3, name: '第三食堂', description: '位于校园南区，提供西式简餐' }
];

const mockMerchants = {
  1: [
    { id: 1, name: '川味轩', description: '正宗川菜，麻辣鲜香', business_hours: '10:00-22:00', image: '/images/merchant1.jpg' },
    { id: 2, name: '粤式茶餐厅', description: '地道粤菜，清淡可口', business_hours: '09:00-21:00', image: '/images/merchant2.jpg' }
  ],
  2: [
    { id: 3, name: '兰州拉面', description: '手工拉面，汤鲜味美', business_hours: '08:00-20:00', image: '/images/merchant3.jpg' },
    { id: 4, name: '沙县小吃', description: '特色小吃，经济实惠', business_hours: '07:00-22:00', image: '/images/merchant4.jpg' }
  ],
  3: [
    { id: 5, name: '麦当劳', description: '西式快餐，方便快捷', business_hours: '07:00-23:00', image: '/images/merchant5.jpg' },
    { id: 6, name: '肯德基', description: '炸鸡汉堡，美味可口', business_hours: '08:00-22:00', image: '/images/merchant6.jpg' }
  ]
};

const mockDishes = {
  1: [
    { id: 1, name: '宫保鸡丁', description: '鸡肉丁配花生米，麻辣鲜香', price: 28, image: '/images/dish1.jpg' },
    { id: 2, name: '麻婆豆腐', description: '嫩豆腐配肉末，麻辣可口', price: 18, image: '/images/dish2.jpg' },
    { id: 3, name: '水煮鱼', description: '新鲜鱼片，麻辣鲜香', price: 48, image: '/images/dish3.jpg' }
  ],
  2: [
    { id: 4, name: '白切鸡', description: '鲜嫩鸡肉，清淡可口', price: 38, image: '/images/dish4.jpg' },
    { id: 5, name: '蒸蛋羹', description: '嫩滑蛋羹，营养丰富', price: 12, image: '/images/dish5.jpg' }
  ],
  3: [
    { id: 6, name: '牛肉拉面', description: '手工拉面配牛肉，汤鲜味美', price: 22, image: '/images/dish6.jpg' },
    { id: 7, name: '凉拌面', description: '清爽凉拌面，夏日首选', price: 15, image: '/images/dish7.jpg' }
  ],
  4: [
    { id: 8, name: '蒸饺', description: '皮薄馅大，鲜美多汁', price: 10, image: '/images/dish8.jpg' },
    { id: 9, name: '拌面', description: '花生酱拌面，香浓可口', price: 8, image: '/images/dish9.jpg' }
  ],
  5: [
    { id: 10, name: '巨无霸套餐', description: '经典汉堡套餐', price: 35, image: '/images/dish10.jpg' },
    { id: 11, name: '麦辣鸡翅', description: '香辣鸡翅，外酥里嫩', price: 12, image: '/images/dish11.jpg' }
  ],
  6: [
    { id: 12, name: '吮指原味鸡', description: '经典炸鸡，香脆可口', price: 15, image: '/images/dish12.jpg' },
    { id: 13, name: '香辣鸡腿堡', description: '香辣鸡腿配汉堡', price: 22, image: '/images/dish13.jpg' }
  ]
};

// 获取食堂列表
async function getCanteens() {
  try {
    const [rows] = await db.pool.execute('SELECT * FROM canteens ORDER BY id ASC');
    return rows;
  } catch (error) {
    console.error('获取食堂列表失败:', error.message);
    return [];
  }
}

// 获取商家列表
async function getMerchants(canteenId) {
  try {
    let query = 'SELECT * FROM merchants';
    let params = [];
    if (canteenId) {
      query += ' WHERE canteen_id = ?';
      params = [canteenId];
    }
    const [rows] = await db.pool.execute(query, params);
    return rows;
  } catch (error) {
    console.error('获取商家列表失败:', error.message);
    return [];
  }
}

// 获取单个商家
async function getMerchantById(id) {
  try {
    const [rows] = await db.pool.execute(
      'SELECT * FROM merchants WHERE id = ?',
      [id]
    );
    if (rows.length > 0) {
      return rows[0];
    }
    return null;
  } catch (error) {
    console.error('获取商家信息失败:', error.message);
    return null;
  }
}

// 获取菜品列表
async function getDishes(merchantId) {
  try {
    const [rows] = await db.pool.execute(
      'SELECT * FROM dishes WHERE merchant_id = ? ORDER BY id ASC',
      [merchantId]
    );
    return rows;
  } catch (error) {
    console.error('获取菜品列表失败:', error.message);
    return [];
  }
}

// 获取单个菜品
async function getDishById(id) {
  try {
    const [rows] = await db.pool.execute(
      'SELECT * FROM dishes WHERE id = ?',
      [id]
    );
    if (rows.length > 0) {
      return rows[0];
    }
    return null;
  } catch (error) {
    console.error('获取菜品信息失败:', error.message);
    return null;
  }
}

// 添加商家
async function addMerchant(merchantData) {
  try {
    const { canteen_id, name, description, business_hours, image } = merchantData;
    
    if (!canteen_id || !name) {
      return { success: false, message: '缺少必要字段' };
    }
    
    const [result] = await db.pool.execute(
      'INSERT INTO merchants (canteen_id, name, description, hours, image) VALUES (?, ?, ?, ?, ?)',
      [canteen_id, name, description || null, business_hours || null, image || null]
    );
    
    return { success: true, id: result.insertId };
  } catch (error) {
    console.error('添加商家失败:', error.message);
    return { success: false, message: '添加商家失败: ' + error.message };
  }
}

// 更新商家
async function updateMerchant(id, merchantData) {
  try {
    // 检查必要参数
    if (!id || !merchantData) {
      return { success: false, message: '缺少必要参数' };
    }
    
    // 将id转换为数字类型
    const merchantId = parseInt(id, 10);
    if (isNaN(merchantId)) {
      return { success: false, message: '无效的商家ID' };
    }
    
    const { canteen_id, name, description, business_hours, image } = merchantData;
    
    // 检查必要字段
    if (!canteen_id || !name) {
      return { success: false, message: '缺少必要字段' };
    }
    
    // 执行数据库更新操作
    const [result] = await db.pool.execute(
      'UPDATE merchants SET canteen_id = ?, name = ?, description = ?, hours = ?, image = ? WHERE id = ?',
      [canteen_id, name, description, business_hours || null, image || null, merchantId]
    );
    
    if (result.affectedRows > 0) {
      console.log('更新商家成功:', {
        id: merchantId,
        canteen_id,
        name,
        description,
        business_hours,
        image
      });
      return { success: true };
    } else {
      return { success: false, message: '商家不存在' };
    }
  } catch (error) {
    console.error('更新商家失败:', error.message);
    return { success: false, message: '更新商家失败: ' + error.message };
  }
}

// 删除商家
async function deleteMerchant(id) {
  try {
    await db.pool.execute('DELETE FROM merchants WHERE id = ?', [id]);
    return { success: true };
  } catch (error) {
    console.error('删除商家失败:', error.message);
    return { success: false, message: '删除商家失败: ' + error.message };
  }
}

// 添加菜品
async function addDish(dishData) {
  try {
    const { merchant_id, name, description, price, image } = dishData;
    
    if (!merchant_id || !name || !price) {
      return { success: false, message: '缺少必要字段' };
    }
    
    const [result] = await db.pool.execute(
      'INSERT INTO dishes (merchant_id, name, description, price, image) VALUES (?, ?, ?, ?, ?)',
      [merchant_id, name, description || null, price, image || null]
    );
    
    return { success: true, id: result.insertId };
  } catch (error) {
    console.error('添加菜品失败:', error.message);
    return { success: false, message: '添加菜品失败: ' + error.message };
  }
}

// 更新菜品
async function updateDish(id, dishData) {
  try {
    const { merchant_id, name, description, price, image } = dishData;
    
    if (!merchant_id || !name || !price) {
      return { success: false, message: '缺少必要字段' };
    }
    
    await db.pool.execute(
      'UPDATE dishes SET merchant_id = ?, name = ?, description = ?, price = ?, image = ? WHERE id = ?',
      [merchant_id, name, description || null, price, image || null, id]
    );
    
    return { success: true };
  } catch (error) {
    console.error('更新菜品失败:', error.message);
    return { success: false, message: '更新菜品失败: ' + error.message };
  }
}

// 删除菜品
async function deleteDish(id) {
  try {
    await db.pool.execute('DELETE FROM dishes WHERE id = ?', [id]);
    return { success: true };
  } catch (error) {
    console.error('删除菜品失败:', error.message);
    return { success: false, message: '删除菜品失败: ' + error.message };
  }
}

// 用户管理相关函数
async function getUsers() {
  try {
    const [users] = await db.pool.execute('SELECT * FROM users ORDER BY id ASC');
    return users;
  } catch (error) {
    console.error('获取用户列表失败:', error.message);
    return [];
  }
}

async function searchUsers(keyword) {
  try {
    const [users] = await db.pool.execute(
      'SELECT * FROM users WHERE username LIKE ? OR phone LIKE ? ORDER BY id ASC',
      [`%${keyword}%`, `%${keyword}%`]
    );
    return users;
  } catch (error) {
    console.error('搜索用户失败:', error.message);
    return [];
  }
}

async function createUser(userData) {
  try {
    const { username, password, phone, avatar } = userData;
    
    if (!username || !password) {
      return { success: false, message: '缺少必要字段' };
    }
    
    const [result] = await db.pool.execute(
      'INSERT INTO users (username, password, phone, avatar) VALUES (?, ?, ?, ?)',
      [username, password, phone || null, avatar || null]
    );
    
    return { success: true, id: result.insertId };
  } catch (error) {
    console.error('创建用户失败:', error.message);
    return { success: false, message: '创建用户失败: ' + error.message };
  }
}

async function updateUser(id, userData) {
  try {
    const { username, password, phone, avatar } = userData;
    
    if (!username) {
      return { success: false, message: '缺少必要字段' };
    }
    
    await db.pool.execute(
      'UPDATE users SET username = ?, password = ?, phone = ?, avatar = ? WHERE id = ?',
      [username, password, phone || null, avatar || null, id]
    );
    
    return { success: true };
  } catch (error) {
    console.error('更新用户失败:', error.message);
    return { success: false, message: '更新用户失败: ' + error.message };
  }
}

async function deleteUser(id) {
  try {
    await db.pool.execute('DELETE FROM users WHERE id = ?', [id]);
    return { success: true };
  } catch (error) {
    console.error('删除用户失败:', error.message);
    return { success: false, message: '删除用户失败: ' + error.message };
  }
}

// 订单管理相关函数
async function getOrders() {
  try {
    const [orders] = await db.pool.execute('SELECT * FROM orders ORDER BY created_at DESC');
    return orders;
  } catch (error) {
    console.error('获取订单列表失败:', error.message);
    return [];
  }
}

async function getOrderById(id) {
  try {
    const [orders] = await db.pool.execute('SELECT * FROM orders WHERE id = ?', [id]);
    if (orders.length > 0) {
      return orders[0];
    }
    return null;
  } catch (error) {
    console.error('获取订单详情失败:', error.message);
    return null;
  }
}

async function updateOrderStatus(id, status) {
  try {
    await db.pool.execute('UPDATE orders SET status = ? WHERE id = ?', [status, id]);
    return { success: true };
  } catch (error) {
    console.error('更新订单状态失败:', error.message);
    return { success: false, message: '更新订单状态失败: ' + error.message };
  }
}

async function getOrdersByUser(userId) {
  try {
    const [orders] = await db.pool.execute('SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC', [userId]);
    return orders;
  } catch (error) {
    console.error('获取用户订单失败:', error.message);
    return [];
  }
}

async function getOrdersByMerchant(merchantId) {
  try {
    const [orders] = await db.pool.execute('SELECT * FROM orders WHERE merchant_id = ? ORDER BY created_at DESC', [merchantId]);
    return orders;
  } catch (error) {
    console.error('获取商家订单失败:', error.message);
    return [];
  }
}

async function createOrder(orderData) {
  try {
    const { user_id, merchant_id, total_amount, items, status } = orderData;
    
    if (!user_id || !merchant_id || !total_amount || !items) {
      return { success: false, message: '缺少必要字段' };
    }
    
    const [result] = await db.pool.execute(
      'INSERT INTO orders (user_id, merchant_id, total_amount, items, status) VALUES (?, ?, ?, ?, ?)',
      [user_id, merchant_id, total_amount, JSON.stringify(items), status || 'pending']
    );
    
    return { success: true, id: result.insertId };
  } catch (error) {
    console.error('创建订单失败:', error.message);
    return { success: false, message: '创建订单失败: ' + error.message };
  }
}

// 统计相关函数
async function getStatistics() {
  try {
    const [userCount] = await db.pool.execute('SELECT COUNT(*) as count FROM users');
    const [merchantCount] = await db.pool.execute('SELECT COUNT(*) as count FROM merchants');
    const [orderCount] = await db.pool.execute('SELECT COUNT(*) as count FROM orders');
    const [dishCount] = await db.pool.execute('SELECT COUNT(*) as count FROM dishes');
    
    return {
      userCount: userCount[0].count,
      merchantCount: merchantCount[0].count,
      orderCount: orderCount[0].count,
      dishCount: dishCount[0].count
    };
  } catch (error) {
    console.error('获取统计数据失败:', error.message);
    return {
      userCount: 0,
      merchantCount: 0,
      orderCount: 0,
      dishCount: 0
    };
  }
}

async function getMerchantStatistics(merchantId) {
  try {
    const [orderCount] = await db.pool.execute(
      'SELECT COUNT(*) as count FROM orders WHERE merchant_id = ?',
      [merchantId]
    );
    const [totalRevenue] = await db.pool.execute(
      'SELECT SUM(total_amount) as total FROM orders WHERE merchant_id = ?',
      [merchantId]
    );
    
    return {
      orderCount: orderCount[0].count,
      totalRevenue: totalRevenue[0].total || 0
    };
  } catch (error) {
    console.error('获取商家统计数据失败:', error.message);
    return {
      orderCount: 0,
      totalRevenue: 0
    };
  }
}

async function getOrderStatistics() {
  try {
    const [dailyOrders] = await db.pool.execute(`
      SELECT DATE(created_at) as date, COUNT(*) as count
      FROM orders
      WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
      GROUP BY DATE(created_at)
      ORDER BY date ASC
    `);
    
    const [merchantOrders] = await db.pool.execute(`
      SELECT m.name, COUNT(o.id) as count
      FROM merchants m
      LEFT JOIN orders o ON m.id = o.merchant_id
      GROUP BY m.id, m.name
      ORDER BY count DESC
      LIMIT 10
    `);
    
    return {
      dailyOrders,
      merchantOrders
    };
  } catch (error) {
    console.error('获取订单统计数据失败:', error.message);
    return {
      dailyOrders: [],
      merchantOrders: []
    };
  }
}

module.exports = {
  getCanteens,
  getMerchants,
  getMerchantById,
  getDishes,
  getDishById,
  addMerchant,
  updateMerchant,
  deleteMerchant,
  addDish,
  updateDish,
  deleteDish,
  getUsers,
  searchUsers,
  createUser,
  updateUser,
  deleteUser,
  getOrders,
  getOrderById,
  updateOrderStatus,
  getOrdersByUser,
  getOrdersByMerchant,
  createOrder,
  getStatistics,
  getMerchantStatistics,
  getOrderStatistics
};