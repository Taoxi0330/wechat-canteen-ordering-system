// 后端服务器
const express = require('express');
const path = require('path');
const cors = require('cors');
const fs = require('fs');
const multer = require('multer');
const api = require('./services/api');
const db = require('./services/db');

// 捕获未处理的错误
process.on('uncaughtException', (error) => {
  console.error('未捕获的异常:', error);
  console.error('错误堆栈:', error.stack);
});

// 捕获未处理的Promise拒绝
process.on('unhandledRejection', (reason, promise) => {
  console.error('未处理的Promise拒绝:', reason);
});

const app = express();
const port = 3000;

// 中间件
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 配置文件上传
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, 'images');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, `img-${uniqueSuffix}${ext}`);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp|bmp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);
  
  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error('只允许上传图片文件'));
  }
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }
});

// 测试路由
app.get('/api/test', (req, res) => {
  res.json({ success: true, message: '测试成功' });
});

// 获取食堂列表
app.get('/api/canteens', async (req, res) => {
  try {
    const canteens = await api.getCanteens();
    res.json(canteens);
  } catch (error) {
    console.error('获取食堂列表失败:', error);
    res.status(500).json({ error: '获取食堂列表失败' });
  }
});

// 获取单个食堂
app.get('/api/canteens/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const canteen = await api.getCanteenById(id);
    if (canteen) {
      res.json(canteen);
    } else {
      res.status(404).json({ success: false, message: '食堂不存在' });
    }
  } catch (error) {
    console.error('获取食堂信息失败:', error);
    res.status(500).json({ error: '获取食堂信息失败' });
  }
});

// 获取商家列表
app.get('/api/merchants', async (req, res) => {
  try {
    const { canteen } = req.query;
    const merchants = await api.getMerchants(canteen);
    res.json(merchants);
  } catch (error) {
    console.error('获取商家列表失败:', error);
    res.status(500).json({ error: '获取商家列表失败' });
  }
});

// 获取单个商家
app.get('/api/merchants/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const merchant = await api.getMerchantById(id);
    if (merchant) {
      res.json(merchant);
    } else {
      res.status(404).json({ success: false, message: '商家不存在' });
    }
  } catch (error) {
    console.error('获取商家信息失败:', error);
    res.status(500).json({ error: '获取商家信息失败' });
  }
});

app.post('/api/merchants', upload.single('image'), async (req, res) => {
  try {
    const merchantData = req.body;
    if (req.file) {
      merchantData.image = `/images/${req.file.filename}`;
    }
    const result = await api.addMerchant(merchantData);
    res.json(result);
  } catch (error) {
    console.error('添加商家失败:', error);
    res.status(500).json({ success: false, message: '添加商家失败: ' + error.message });
  }
});

app.put('/api/merchants/:id', upload.single('image'), async (req, res) => {
  try {
    const { id } = req.params;
    const merchantData = req.body;
    if (req.file) {
      merchantData.image = `/images/${req.file.filename}`;
    }
    const result = await api.updateMerchant(id, merchantData);
    res.json(result);
  } catch (error) {
    console.error('更新商家失败:', error);
    res.status(500).json({ success: false, message: '更新商家失败: ' + error.message });
  }
});

app.delete('/api/merchants/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await api.deleteMerchant(id);
    res.json(result);
  } catch (error) {
    console.error('删除商家失败:', error);
    res.status(500).json({ success: false, message: '删除商家失败: ' + error.message });
  }
});

// 获取菜品列表
app.get('/api/dishes/:merchantId', async (req, res) => {
  try {
    const { merchantId } = req.params;
    const dishes = await api.getDishes(merchantId);
    res.json(dishes);
  } catch (error) {
    console.error('获取菜品列表失败:', error);
    res.status(500).json({ error: '获取菜品列表失败' });
  }
});

// 获取单个菜品
app.get('/api/dishes/detail/:id', async (req, res) => {
  try {
    const { id } = req.params;
    // 从数据库中查找
    const [rows] = await db.pool.execute('SELECT * FROM dishes WHERE id = ?', [id]);
    if (rows.length > 0) {
      const dish = rows[0];
      // 解析spec_prices和nutrition
      if (dish.spec_prices) {
        try {
          if (typeof dish.spec_prices === 'string') {
            dish.spec_prices = JSON.parse(dish.spec_prices);
          }
        } catch (e) {
          console.error('解析spec_prices失败:', e);
          dish.spec_prices = [];
        }
      }
      if (dish.nutrition) {
        try {
          if (typeof dish.nutrition === 'string') {
            dish.nutrition = JSON.parse(dish.nutrition);
          }
        } catch (e) {
          console.error('解析nutrition失败:', e);
          dish.nutrition = {};
        }
      }
      res.json(dish);
    } else {
      res.status(404).json({ message: '菜品不存在' });
    }
  } catch (error) {
    console.error('获取菜品详情失败:', error);
    res.status(500).json({ error: '获取菜品详情失败' });
  }
});

app.post('/api/dishes', upload.single('image'), async (req, res) => {
  try {
    const dishData = req.body;
    // 如果有文件上传，添加image字段
    if (req.file) {
      dishData.image = `/images/${req.file.filename}`;
    }
    const result = await api.addDish(dishData);
    res.json(result);
  } catch (error) {
    console.error('添加菜品失败:', error);
    res.status(500).json({ success: false, message: '添加菜品失败: ' + error.message });
  }
});

app.put('/api/dishes/:id', upload.single('image'), async (req, res) => {
  try {
    const { id } = req.params;
    const dishData = req.body;
    // 如果有文件上传，添加image字段
    if (req.file) {
      dishData.image = `/images/${req.file.filename}`;
    }
    const result = await api.updateDish(id, dishData);
    res.json(result);
  } catch (error) {
    console.error('更新菜品失败:', error);
    res.status(500).json({ success: false, message: '更新菜品失败: ' + error.message });
  }
});

app.delete('/api/dishes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await api.deleteDish(id);
    res.json(result);
  } catch (error) {
    console.error('删除菜品失败:', error);
    res.status(500).json({ success: false, message: '删除菜品失败: ' + error.message });
  }
});

// 订单管理路由
app.get('/api/orders', async (req, res) => {
  try {
    const { merchantId, status, page = 1, limit = 10 } = req.query;
    const orders = await api.getOrders(merchantId, status, parseInt(page), parseInt(limit));
    res.json(orders);
  } catch (error) {
    console.error('获取订单列表失败:', error);
    res.status(500).json({ error: '获取订单列表失败' });
  }
});

app.get('/api/orders/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const order = await api.getOrderById(id);
    if (order) {
      res.json(order);
    } else {
      res.status(404).json({ message: '订单不存在' });
    }
  } catch (error) {
    console.error('获取订单详情失败:', error);
    res.status(500).json({ error: '获取订单详情失败' });
  }
});

app.get('/api/orders/all', async (req, res) => {
  try {
    const orders = await api.getAllOrders();
    res.json(orders);
  } catch (error) {
    console.error('获取所有订单失败:', error);
    res.status(500).json({ error: '获取所有订单失败' });
  }
});

app.put('/api/orders/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const result = await api.updateOrderStatus(id, status);
    res.json(result);
  } catch (error) {
    console.error('更新订单状态失败:', error);
    res.status(500).json({ success: false, message: '更新订单状态失败: ' + error.message });
  }
});

app.put('/api/orders/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const orderData = req.body;
    const result = await api.updateOrder(id, orderData);
    res.json(result);
  } catch (error) {
    console.error('更新订单失败:', error);
    res.status(500).json({ success: false, message: '更新订单失败: ' + error.message });
  }
});

// 订单创建和取消路由
app.post('/api/orders', async (req, res) => {
  try {
    const orderData = req.body;
    const result = await api.createOrder(orderData);
    res.json(result);
  } catch (error) {
    console.error('创建订单失败:', error.message);
    res.status(500).json({ success: false, message: '创建订单失败: ' + error.message });
  }
});

app.get('/api/orders/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const orders = await api.getOrdersByUser(userId);
    res.json(orders);
  } catch (error) {
    console.error('获取用户订单失败:', error.message);
    res.status(500).json({ error: '获取用户订单失败' });
  }
});

app.post('/api/orders/:id/cancel', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await api.cancelOrder(id);
    res.json(result);
  } catch (error) {
    console.error('取消订单失败:', error.message);
    res.status(500).json({ success: false, message: '取消订单失败: ' + error.message });
  }
});

// 上传图片
app.post('/api/upload', upload.single('image'), (req, res) => {
  if (req.file) {
    res.json({ success: true, image: `/images/${req.file.filename}` });
  } else {
    res.status(400).json({ success: false, message: '请选择要上传的图片' });
  }
});

// 用户登录
app.post('/api/login', async (req, res) => {
  try {
    const { phone, username, password } = req.body;
    const identifier = phone || username;
    const result = await api.loginUser(identifier, password);
    res.json(result);
  } catch (error) {
    console.error('登录失败:', error);
    res.status(500).json({ success: false, message: '登录失败: ' + error.message });
  }
});

// 用户注册
app.post('/api/register', async (req, res) => {
  try {
    const userData = req.body;
    const result = await api.registerUser(userData);
    res.json(result);
  } catch (error) {
    console.error('注册失败:', error);
    res.status(500).json({ success: false, message: '注册失败: ' + error.message });
  }
});

// 地址管理路由
app.get('/api/addresses/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const addresses = await api.getAddresses(userId);
    res.json(addresses);
  } catch (error) {
    console.error('获取地址列表失败:', error);
    res.status(500).json({ error: '获取地址列表失败' });
  }
});

app.post('/api/addresses', async (req, res) => {
  try {
    const addressData = req.body;
    const result = await api.addAddress(addressData);
    res.json(result);
  } catch (error) {
    console.error('添加地址失败:', error);
    res.status(500).json({ success: false, message: '添加地址失败: ' + error.message });
  }
});

app.put('/api/addresses/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const addressData = req.body;
    const result = await api.updateAddress(id, addressData);
    res.json(result);
  } catch (error) {
    console.error('更新地址失败:', error);
    res.status(500).json({ success: false, message: '更新地址失败: ' + error.message });
  }
});

app.delete('/api/addresses/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await api.deleteAddress(id);
    res.json(result);
  } catch (error) {
    console.error('删除地址失败:', error);
    res.status(500).json({ success: false, message: '删除地址失败: ' + error.message });
  }
});

// 收藏管理路由
app.get('/api/favorites/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const favorites = await api.getFavorites(userId);
    res.json(favorites);
  } catch (error) {
    console.error('获取收藏列表失败:', error);
    res.status(500).json({ error: '获取收藏列表失败' });
  }
});

app.post('/api/favorites', async (req, res) => {
  try {
    const favoriteData = req.body;
    const result = await api.addFavorite(favoriteData);
    res.json(result);
  } catch (error) {
    console.error('添加收藏失败:', error);
    res.status(500).json({ success: false, message: '添加收藏失败: ' + error.message });
  }
});

app.delete('/api/favorites/:userId/:merchantId', async (req, res) => {
  try {
    const { userId, merchantId } = req.params;
    const result = await api.removeFavorite(userId, merchantId);
    res.json(result);
  } catch (error) {
    console.error('删除收藏失败:', error);
    res.status(500).json({ success: false, message: '删除收藏失败: ' + error.message });
  }
});

// 评价管理路由
app.get('/api/reviews', async (req, res) => {
  try {
    const reviews = await api.getAllReviews();
    res.json(reviews);
  } catch (error) {
    console.error('获取所有评价列表失败:', error);
    res.status(500).json({ error: '获取所有评价列表失败' });
  }
});

app.get('/api/reviews/merchant/:merchantId', async (req, res) => {
  try {
    const { merchantId } = req.params;
    const reviews = await api.getReviews(merchantId);
    res.json(reviews);
  } catch (error) {
    console.error('获取评价列表失败:', error);
    res.status(500).json({ error: '获取评价列表失败' });
  }
});

app.get('/api/reviews/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const reviews = await api.getUserReviews(userId);
    res.json(reviews);
  } catch (error) {
    console.error('获取用户评价列表失败:', error);
    res.status(500).json({ error: '获取用户评价列表失败' });
  }
});

app.get('/api/reviews/:merchantId', async (req, res) => {
  try {
    const { merchantId } = req.params;
    const reviews = await api.getReviews(merchantId);
    res.json(reviews);
  } catch (error) {
    console.error('获取评价列表失败:', error);
    res.status(500).json({ error: '获取评价列表失败' });
  }
});

app.post('/api/reviews', async (req, res) => {
  try {
    const reviewData = req.body;
    console.log('添加评价数据:', reviewData);
    const result = await api.addReview(reviewData);
    console.log('添加评价结果:', result);
    res.json(result);
  } catch (error) {
    console.error('添加评价失败:', error);
    res.status(500).json({ success: false, message: '添加评价失败: ' + error.message });
  }
});

app.post('/api/reviews/:id/reply', async (req, res) => {
  try {
    const { id } = req.params;
    const { reply } = req.body;
    const result = await api.addReply(id, reply);
    if (result.success) {
      res.json({ success: true, message: '回复成功' });
    } else {
      res.status(500).json({ success: false, message: result.message });
    }
  } catch (error) {
    console.error('回复评价失败:', error);
    res.status(500).json({ success: false, message: '回复评价失败: ' + error.message });
  }
});

app.put('/api/reviews/:id/reply', async (req, res) => {
  try {
    const { id } = req.params;
    const { reply } = req.body;
    const result = await api.addReply(id, reply);
    if (result.success) {
      res.json({ success: true, message: '回复成功' });
    } else {
      res.status(500).json({ success: false, message: result.message });
    }
  } catch (error) {
    console.error('回复评价失败:', error);
    res.status(500).json({ success: false, message: '回复评价失败: ' + error.message });
  }
});

app.delete('/api/reviews/:id/reply', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await api.deleteReply(id);
    if (result.success) {
      res.json({ success: true, message: '删除回复成功' });
    } else {
      res.status(500).json({ success: false, message: result.message });
    }
  } catch (error) {
    console.error('删除回复失败:', error);
    res.status(500).json({ success: false, message: '删除回复失败: ' + error.message });
  }
});

app.delete('/api/reviews/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await api.deleteReview(id);
    if (result.success) {
      res.json({ success: true, message: '删除评价成功' });
    } else {
      res.status(500).json({ success: false, message: result.message });
    }
  } catch (error) {
    console.error('删除评价失败:', error);
    res.status(500).json({ success: false, message: '删除评价失败: ' + error.message });
  }
});

// 用户管理路由
app.get('/api/users', async (req, res) => {
  try {
    const users = await api.getUsers();
    res.json(users);
  } catch (error) {
    console.error('获取用户列表失败:', error);
    res.status(500).json({ error: '获取用户列表失败' });
  }
});

app.get('/api/users/search', async (req, res) => {
  try {
    const { keyword } = req.query;
    const users = await api.searchUsers(keyword);
    res.json(users);
  } catch (error) {
    console.error('搜索用户失败:', error);
    res.status(500).json({ error: '搜索用户失败' });
  }
});

app.get('/api/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const user = await api.getUserById(id);
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: '用户不存在' });
    }
  } catch (error) {
    console.error('获取用户信息失败:', error);
    res.status(500).json({ error: '获取用户信息失败' });
  }
});

app.post('/api/users', async (req, res) => {
  try {
    const userData = req.body;
    const result = await api.createUser(userData);
    if (result.success) {
      res.json({ success: true, message: '用户创建成功', user: result.user });
    } else {
      res.status(400).json({ success: false, message: result.message });
    }
  } catch (error) {
    console.error('创建用户失败:', error);
    res.status(500).json({ success: false, message: '创建用户失败: ' + error.message });
  }
});

app.put('/api/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const userData = req.body;
    const result = await api.updateUser(id, userData);
    if (result.success) {
      res.json({ success: true, message: '用户更新成功' });
    } else {
      res.status(400).json({ success: false, message: result.message });
    }
  } catch (error) {
    console.error('更新用户失败:', error);
    res.status(500).json({ success: false, message: '更新用户失败: ' + error.message });
  }
});

app.delete('/api/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await api.deleteUser(id);
    if (result.success) {
      res.json({ success: true, message: '用户删除成功' });
    } else {
      res.status(500).json({ success: false, message: result.message });
    }
  } catch (error) {
    console.error('删除用户失败:', error);
    res.status(500).json({ success: false, message: '删除用户失败: ' + error.message });
  }
});

// 订单分析API
app.get('/api/analytics', async (req, res) => {
  const { timeFilter, merchantId } = req.query;
  
  try {
    const analyticsData = await api.getAnalyticsData(timeFilter, merchantId);
    res.json(analyticsData);
  } catch (error) {
    console.error('获取分析数据失败:', error);
    res.status(500).json({ error: '获取分析数据失败' });
  }
});

// 获取images文件夹中的图片列表
app.get('/api/images', async (req, res) => {
  const imagesDir = path.join(__dirname, 'images');
  
  try {
    const files = fs.readdirSync(imagesDir);
    const imageFiles = files.filter(file => {
      const ext = path.extname(file).toLowerCase();
      return ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp'].includes(ext);
    });
    const images = imageFiles.map(file => ({
      name: file,
      path: `/images/${file}`,
      url: `http://localhost:${port}/images/${file}`
    }));
    res.json(images);
  } catch (error) {
    console.error('读取图片列表失败:', error);
    res.status(500).json({ error: '读取图片列表失败' });
  }
});

// ==================== 静态文件服务 - 放在API路由之后！ ====================
// 只在特定路径下提供静态文件，避免干扰API路由
app.use('/admin', express.static(path.join(__dirname, 'admin')));

// 图片服务中间件 - 简化版本
app.use('/images', express.static(path.join(__dirname, 'images')));

// 根路径重定向到管理界面
app.get('/', (req, res) => {
  res.redirect('/admin/index.html');
});

// 测试数据库连接
async function init() {
  const connected = await db.testConnection();
  if (!connected) {
    console.error('数据库连接失败，服务器无法启动');
    process.exit(1);
  }
  console.log('数据库连接成功，服务器启动中...');
}

// 启动服务器
app.listen(port, async () => {
  await init();
  console.log(`服务器运行在 http://localhost:${port}`);
});