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
    const { merchant_id, name, description, price, image, category, spiciness, spec_prices, nutrition } = dishData;
    
    if (!merchant_id || !name || !price) {
      return { success: false, message: '缺少必要字段' };
    }
    
    const [result] = await db.pool.execute(
      'INSERT INTO dishes (merchant_id, name, description, price, image, category, spiciness, spec_prices, nutrition) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [
        merchant_id, 
        name, 
        description || null, 
        price, 
        image || null,
        category || null,
        spiciness || null,
        spec_prices ? JSON.stringify(spec_prices) : null,
        nutrition ? JSON.stringify(nutrition) : null
      ]
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
    const { merchant_id, name, description, price, image, category, spiciness, spec_prices, nutrition } = dishData;
    
    if (!merchant_id || !name || !price) {
      return { success: false, message: '缺少必要字段' };
    }
    
    await db.pool.execute(
      'UPDATE dishes SET merchant_id = ?, name = ?, description = ?, price = ?, image = ?, category = ?, spiciness = ?, spec_prices = ?, nutrition = ? WHERE id = ?',
      [
        merchant_id, 
        name, 
        description || null, 
        price, 
        image || null,
        category || null,
        spiciness || null,
        spec_prices ? JSON.stringify(spec_prices) : null,
        nutrition ? JSON.stringify(nutrition) : null,
        id
      ]
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

// 用户登录函数
async function loginUser(identifier, password) {
  try {
    // 支持用手机号或用户名登录
    const [users] = await db.pool.execute(
      'SELECT * FROM users WHERE (phone = ? OR username = ?) AND password = ?',
      [identifier, identifier, password]
    );
    
    if (users.length > 0) {
      const user = users[0];
      // 删除密码字段，不返回给前端
      delete user.password;
      return { success: true, user: user };
    } else {
      return { success: false, message: '手机号/用户名或密码错误' };
    }
  } catch (error) {
    console.error('登录失败:', error.message);
    return { success: false, message: '登录失败: ' + error.message };
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

async function getUserById(id) {
  try {
    const [users] = await db.pool.execute('SELECT * FROM users WHERE id = ?', [id]);
    return users.length > 0 ? users[0] : null;
  } catch (error) {
    console.error('获取用户信息失败:', error.message);
    return null;
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

async function registerUser(userData) {
  try {
    const { username, password, phone } = userData;
    
    if (!username || !password) {
      return { success: false, message: '缺少必要字段' };
    }
    
    // 检查用户名是否已存在
    const [existingUsers] = await db.pool.execute(
      'SELECT * FROM users WHERE username = ?',
      [username]
    );
    
    if (existingUsers.length > 0) {
      return { success: false, message: '用户名已存在' };
    }
    
    // 创建新用户
    const [result] = await db.pool.execute(
      'INSERT INTO users (username, password, phone) VALUES (?, ?, ?)',
      [username, password, phone || null]
    );
    
    // 获取新创建的用户信息（不包含密码）
    const [newUsers] = await db.pool.execute(
      'SELECT id, username, phone, avatar FROM users WHERE id = ?',
      [result.insertId]
    );
    
    return { success: true, user: newUsers[0] };
  } catch (error) {
    console.error('注册失败:', error.message);
    return { success: false, message: '注册失败: ' + error.message };
  }
}

async function updateUser(id, userData) {
  try {
    const { username, password, phone, avatar } = userData;
    
    if (!username) {
      return { success: false, message: '缺少必要字段' };
    }
    
    // 如果提供了密码，就更新密码；否则，只更新其他字段
    if (password) {
      await db.pool.execute(
        'UPDATE users SET username = ?, password = ?, phone = ?, avatar = ? WHERE id = ?',
        [username, password, phone || null, avatar || null, id]
      );
    } else {
      await db.pool.execute(
        'UPDATE users SET username = ?, phone = ?, avatar = ? WHERE id = ?',
        [username, phone || null, avatar || null, id]
      );
    }
    
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
// 格式化订单日期字段
function formatOrderDates(order) {
  const newOrder = { ...order };
  if (newOrder.created_at && newOrder.created_at instanceof Date) {
    newOrder.created_at = newOrder.created_at.toISOString();
  }
  if (newOrder.updated_at && newOrder.updated_at instanceof Date) {
    newOrder.updated_at = newOrder.updated_at.toISOString();
  }
  if (newOrder.reservation_time && newOrder.reservation_time instanceof Date) {
    newOrder.reservation_time = newOrder.reservation_time.toISOString();
  }
  if (newOrder.prated_at && newOrder.prated_at instanceof Date) {
    newOrder.prated_at = newOrder.prated_at.toISOString();
  }
  return newOrder;
}

async function getOrders() {
  try {
    const [orders] = await db.pool.execute('SELECT * FROM orders ORDER BY created_at DESC');
    return orders.map(formatOrderDates);
  } catch (error) {
    console.error('获取订单列表失败:', error.message);
    return [];
  }
}

async function getOrderById(id) {
  try {
    const [orders] = await db.pool.execute('SELECT * FROM orders WHERE id = ?', [id]);
    if (orders.length > 0) {
      let order = orders[0];
      // 解析 items 字段
      if (order.items && typeof order.items === 'string') {
        try {
          let items = JSON.parse(order.items);
          // 确保每个订单项都有 id 属性
          if (Array.isArray(items)) {
            items = items.map((item, index) => ({
              ...item,
              id: item.id || item.dish_id || index + 1
            }));
            order.items = items;
          }
        } catch (e) {
          console.error('解析订单items失败:', e.message);
          order.items = [];
        }
      }
      // 确保日期字段格式正确
      order = formatOrderDates(order);
      return order;
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

async function updateOrder(id, orderData) {
  try {
    const { status, total_price, remark } = orderData;
    let query = 'UPDATE orders SET updated_at = NOW()';
    const params = [];
    
    if (status !== undefined) {
      query += ', status = ?';
      params.push(status);
    }
    if (total_price !== undefined) {
      query += ', total_price = ?';
      params.push(total_price);
    }
    if (remark !== undefined) {
      query += ', remark = ?';
      params.push(remark);
    }
    
    query += ' WHERE id = ?';
    params.push(id);
    
    await db.pool.execute(query, params);
    return { success: true };
  } catch (error) {
    console.error('更新订单失败:', error.message);
    return { success: false, message: '更新订单失败: ' + error.message };
  }
}

async function getOrdersByUser(userId) {
  try {
    const [orders] = await db.pool.execute('SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC', [userId]);
    return orders.map(formatOrderDates);
  } catch (error) {
    console.error('获取用户订单失败:', error.message);
    return [];
  }
}

async function getOrdersByMerchant(merchantId) {
  try {
    const [orders] = await db.pool.execute('SELECT * FROM orders WHERE merchant_id = ? ORDER BY created_at DESC', [merchantId]);
    return orders.map(formatOrderDates);
  } catch (error) {
    console.error('获取商家订单失败:', error.message);
    return [];
  }
}

// 生成4位取餐码
function generatePickupCode() {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

async function createOrder(orderData) {
  try {
    const { user_id, merchant_id, total_price, items, order_type, remark, reservation_time } = orderData;
    
    if (!user_id || !merchant_id || !total_price || !items) {
      return { success: false, message: '缺少必要字段' };
    }
    
    // 生成取餐码
    const pickup_code = generatePickupCode();
    
    const [result] = await db.pool.execute(
      'INSERT INTO orders (user_id, merchant_id, total_price, items, order_type, remark, reservation_time, status, pickup_code) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [
        user_id, 
        merchant_id, 
        total_price, 
        JSON.stringify(items), 
        order_type || 'eatIn', 
        remark || null, 
        reservation_time || null,
        'pending',
        pickup_code
      ]
    );
    
    return { success: true, orderId: result.insertId, pickupCode: pickup_code };
  } catch (error) {
    console.error('创建订单失败:', error.message);
    return { success: false, message: '创建订单失败: ' + error.message };
  }
}

async function cancelOrder(id) {
  try {
    await db.pool.execute('UPDATE orders SET status = ? WHERE id = ?', ['cancelled', id]);
    return { success: true };
  } catch (error) {
    console.error('取消订单失败:', error.message);
    return { success: false, message: '取消订单失败: ' + error.message };
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

// 获取分析数据
async function getAnalyticsData(timeFilter, merchantId) {
  try {
    console.log('获取分析数据, timeFilter:', timeFilter, 'merchantId:', merchantId);
    
    let dateCondition = '';
    const now = new Date();
    
    switch (timeFilter) {
      case 'day':
        dateCondition = 'DATE(created_at) = CURDATE()';
        break;
      case 'week':
        dateCondition = 'created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)';
        break;
      case 'month':
        dateCondition = 'created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)';
        break;
      default:
        dateCondition = '1=1';
    }
    
    const merchantCondition = merchantId ? ` AND merchant_id = ${merchantId}` : '';
    
    console.log('查询条件:', dateCondition + merchantCondition);
    
    // 获取所有符合条件的订单
    let [allOrders] = await db.pool.execute(`
      SELECT * FROM orders
      WHERE ${dateCondition}${merchantCondition}
    `);
    
    console.log('找到订单数量:', allOrders.length);
    
    // 如果时间范围内没有数据，返回所有数据
    if (allOrders.length === 0 && dateCondition !== '1=1') {
      console.log('时间范围内没有数据，返回所有订单');
      [allOrders] = await db.pool.execute(`
        SELECT * FROM orders
        ${merchantCondition ? `WHERE merchant_id = ${merchantId}` : ''}
      `);
      console.log('所有订单数量:', allOrders.length);
    }
    
    // 菜品销量统计 - 使用JavaScript解析items
    const dishSalesMap = {};
    allOrders.forEach(order => {
      if (order.items) {
        try {
          let items = order.items;
          if (typeof items === 'string') {
            items = JSON.parse(items);
          }
          if (Array.isArray(items)) {
            items.forEach(item => {
              const name = item.name || '未知菜品';
              const quantity = parseInt(item.quantity) || 1;
              if (dishSalesMap[name]) {
                dishSalesMap[name] += quantity;
              } else {
                dishSalesMap[name] = quantity;
              }
            });
          }
        } catch (e) {
          console.log('解析items失败:', order.id, e.message);
        }
      }
    });
    
    const dishSalesArray = Object.entries(dishSalesMap)
      .map(([name, data]) => ({ name, data }))
      .sort((a, b) => b.data - a.data)
      .slice(0, 10);
    
    // 订单完成量统计
    let [orderCompletion] = await db.pool.execute(`
      SELECT 
        DATE(created_at) as date,
        COUNT(*) as count
      FROM orders
      WHERE ${dateCondition}${merchantCondition}
        AND status = 'completed'
      GROUP BY DATE(created_at)
      ORDER BY date ASC
      LIMIT 7
    `);
    
    // 如果时间范围内没有数据，返回所有时间的数据
    if (orderCompletion.length === 0 && dateCondition !== '1=1') {
      [orderCompletion] = await db.pool.execute(`
        SELECT 
          DATE(created_at) as date,
          COUNT(*) as count
        FROM orders
        WHERE status = 'completed'${merchantCondition}
        GROUP BY DATE(created_at)
        ORDER BY date ASC
        LIMIT 7
      `);
    }
    
    // 商家订单统计
    const merchantDateCondition = dateCondition.replace(/created_at/g, 'o.created_at');
    let allMerchantDateCondition = merchantDateCondition;
    if (dateCondition !== '1=1') {
      allMerchantDateCondition = 'o.created_at IS NOT NULL';
    }
    const [merchantOrders] = await db.pool.execute(`
      SELECT 
        m.name,
        COUNT(o.id) as count
      FROM merchants m
      LEFT JOIN orders o ON m.id = o.merchant_id AND ${merchantDateCondition}${merchantCondition}
      GROUP BY m.id, m.name
      ORDER BY count DESC
      LIMIT 10
    `);
    
    // 订单类型统计
    let [orderType] = await db.pool.execute(`
      SELECT 
        order_type,
        COUNT(*) as count
      FROM orders
      WHERE ${dateCondition}${merchantCondition}
      GROUP BY order_type
    `);
    
    // 如果时间范围内没有数据，返回所有时间的数据
    if (orderType.length === 0 && dateCondition !== '1=1') {
      [orderType] = await db.pool.execute(`
        SELECT 
          order_type,
          COUNT(*) as count
        FROM orders
        ${merchantCondition ? `WHERE merchant_id = ${merchantId}` : ''}
        GROUP BY order_type
      `);
    }
    
    // 格式化数据
    const result = {
      dishSales: {
        labels: dishSalesArray.length > 0 ? dishSalesArray.map(d => d.name) : [],
        data: dishSalesArray.length > 0 ? dishSalesArray.map(d => d.data) : []
      },
      orderCompletion: {
        labels: orderCompletion.map(o => {
          const date = new Date(o.date);
          return `${date.getMonth() + 1}/${date.getDate()}`;
        }),
        data: orderCompletion.map(o => o.count)
      },
      merchantOrders: {
        labels: merchantOrders.map(m => m.name || '未知商家'),
        data: merchantOrders.map(m => m.count)
      },
      orderType: {
        dineIn: 0,
        takeaway: 0
      }
    };
    
    // 统计订单类型
    orderType.forEach(ot => {
      if (ot.order_type === 'eatIn') {
        result.orderType.dineIn = ot.count;
      } else if (ot.order_type === 'takeaway') {
        result.orderType.takeaway = ot.count;
      }
    });
    
    console.log('返回数据:', JSON.stringify(result, null, 2));
    
    return result;
  } catch (error) {
    console.error('获取分析数据失败:', error);
    // 返回空数据而不是默认数据
    return {
      dishSales: { labels: [], data: [] },
      orderCompletion: { labels: [], data: [] },
      merchantOrders: { labels: [], data: [] },
      orderType: { dineIn: 0, takeaway: 0 }
    };
  }
}

// 评价管理相关函数
async function getReviews(merchantId) {
  try {
    const [rows] = await db.pool.execute(`
      SELECT r.*, u.username 
      FROM reviews r
      LEFT JOIN users u ON r.user_id = u.id
      WHERE r.merchant_id = ?
      ORDER BY r.created_at DESC
    `, [merchantId]);
    return rows;
  } catch (error) {
    console.error('获取评价列表失败:', error.message);
    return [];
  }
}

async function getUserReviews(userId) {
  try {
    const [rows] = await db.pool.execute(`
      SELECT r.*, u.username, m.name as merchant_name, d.name as dish_name
      FROM reviews r
      LEFT JOIN users u ON r.user_id = u.id
      LEFT JOIN merchants m ON r.merchant_id = m.id
      LEFT JOIN dishes d ON r.dish_id = d.id
      WHERE r.user_id = ?
      ORDER BY r.created_at DESC
    `, [userId]);
    return rows;
  } catch (error) {
    console.error('获取用户评价列表失败:', error.message);
    return [];
  }
}

async function getAllReviews() {
  try {
    const [rows] = await db.pool.execute(`
      SELECT r.*, u.username, m.name as merchant_name, d.name as dish_name
      FROM reviews r
      LEFT JOIN users u ON r.user_id = u.id
      LEFT JOIN merchants m ON r.merchant_id = m.id
      LEFT JOIN dishes d ON r.dish_id = d.id
      ORDER BY r.created_at DESC
    `);
    return rows;
  } catch (error) {
    console.error('获取所有评价列表失败:', error.message);
    return [];
  }
}

async function addReview(reviewData) {
  try {
    const { user_id, merchant_id, dish_id, order_id, rating, content } = reviewData;
    
    if (!user_id || !merchant_id || !rating) {
      return { success: false, message: '缺少必要字段' };
    }
    
    const [result] = await db.pool.execute(
      'INSERT INTO reviews (user_id, merchant_id, dish_id, order_id, rating, content) VALUES (?, ?, ?, ?, ?, ?)',
      [user_id, merchant_id, dish_id || null, order_id || null, rating, content || '']
    );
    
    return { success: true, id: result.insertId };
  } catch (error) {
    console.error('添加评价失败:', error.message);
    return { success: false, message: '添加评价失败: ' + error.message };
  }
}

async function addReply(reviewId, reply) {
  try {
    if (!reviewId || !reply) {
      return { success: false, message: '缺少必要字段' };
    }
    
    await db.pool.execute(
      'UPDATE reviews SET reply = ?, reply_at = NOW() WHERE id = ?',
      [reply, reviewId]
    );
    
    return { success: true };
  } catch (error) {
    console.error('添加回复失败:', error.message);
    return { success: false, message: '添加回复失败: ' + error.message };
  }
}

async function deleteReply(reviewId) {
  try {
    if (!reviewId) {
      return { success: false, message: '缺少必要字段' };
    }
    
    await db.pool.execute(
      'UPDATE reviews SET reply = NULL, reply_at = NULL WHERE id = ?',
      [reviewId]
    );
    
    return { success: true };
  } catch (error) {
    console.error('删除回复失败:', error.message);
    return { success: false, message: '删除回复失败: ' + error.message };
  }
}

async function deleteReview(id) {
  try {
    await db.pool.execute('DELETE FROM reviews WHERE id = ?', [id]);
    return { success: true };
  } catch (error) {
    console.error('删除评价失败:', error.message);
    return { success: false, message: '删除评价失败: ' + error.message };
  }
}

// 地址管理相关函数
async function getAddresses(userId) {
  try {
    const [rows] = await db.pool.execute(
      'SELECT * FROM addresses WHERE user_id = ? ORDER BY is_default DESC, created_at DESC',
      [userId]
    );
    return rows;
  } catch (error) {
    console.error('获取地址列表失败:', error.message);
    return [];
  }
}

async function addAddress(addressData) {
  try {
    const { user_id, name, phone, address, is_default } = addressData;
    
    if (!user_id || !name || !phone || !address) {
      return { success: false, message: '缺少必要字段' };
    }
    
    // 如果设置为默认地址，先取消其他地址的默认状态
    if (is_default) {
      await db.pool.execute(
        'UPDATE addresses SET is_default = 0 WHERE user_id = ?',
        [user_id]
      );
    }
    
    const [result] = await db.pool.execute(
      'INSERT INTO addresses (user_id, name, phone, address, is_default) VALUES (?, ?, ?, ?, ?)',
      [user_id, name, phone, address, is_default || 0]
    );
    
    return { success: true, id: result.insertId };
  } catch (error) {
    console.error('添加地址失败:', error.message);
    return { success: false, message: '添加地址失败: ' + error.message };
  }
}

async function updateAddress(id, addressData) {
  try {
    const { user_id, name, phone, address, is_default } = addressData;
    
    if (!name || !phone || !address) {
      return { success: false, message: '缺少必要字段' };
    }
    
    // 如果设置为默认地址，先取消其他地址的默认状态
    if (is_default) {
      await db.pool.execute(
        'UPDATE addresses SET is_default = 0 WHERE user_id = ?',
        [user_id]
      );
    }
    
    await db.pool.execute(
      'UPDATE addresses SET name = ?, phone = ?, address = ?, is_default = ? WHERE id = ?',
      [name, phone, address, is_default || 0, id]
    );
    
    return { success: true };
  } catch (error) {
    console.error('更新地址失败:', error.message);
    return { success: false, message: '更新地址失败: ' + error.message };
  }
}

async function deleteAddress(id) {
  try {
    await db.pool.execute('DELETE FROM addresses WHERE id = ?', [id]);
    return { success: true };
  } catch (error) {
    console.error('删除地址失败:', error.message);
    return { success: false, message: '删除地址失败: ' + error.message };
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
  loginUser,
  getUsers,
  searchUsers,
  getUserById,
  registerUser,
  createUser,
  updateUser,
  deleteUser,
  getOrders,
  getOrderById,
  updateOrderStatus,
  updateOrder,
  getOrdersByUser,
  getOrdersByMerchant,
  createOrder,
  cancelOrder,
  getStatistics,
  getMerchantStatistics,
  getOrderStatistics,
  getAnalyticsData,
  getReviews,
  getUserReviews,
  getAllReviews,
  addReview,
  addReply,
  deleteReply,
  deleteReview,
  getAddresses,
  addAddress,
  updateAddress,
  deleteAddress
};