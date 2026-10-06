-- 数据库初始化脚本

-- 创建数据库
CREATE DATABASE IF NOT EXISTS canteen_ordering CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE canteen_ordering;

-- 创建用户表
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL,
  password VARCHAR(100) NOT NULL,
  avatar VARCHAR(255),
  phone VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 创建商家表
CREATE TABLE IF NOT EXISTS merchants (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  image VARCHAR(255),
  hours VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 创建菜品表
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
);

-- 创建订单表
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
);

-- 创建订单明细表
CREATE TABLE IF NOT EXISTS order_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT NOT NULL,
  dish_id INT NOT NULL,
  quantity INT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (dish_id) REFERENCES dishes(id) ON DELETE CASCADE
);

-- 插入示例数据
-- 插入商家数据
INSERT INTO merchants (name, description, image, hours) VALUES
('川菜馆', '正宗川菜，口味麻辣鲜香', '/images/merchant1.jpg', '09:00-22:00'),
('粤菜餐厅', '精致粤菜，口味清淡鲜美', '/images/merchant2.jpg', '10:00-21:30'),
('西北风味', '地道西北菜，分量足', '/images/merchant3.jpg', '09:30-22:30'),
('快餐汉堡', '快捷方便，适合赶时间', '/images/merchant4.jpg', '08:00-23:00');

-- 插入菜品数据
INSERT INTO dishes (merchant_id, name, description, price, image, category) VALUES
(1, '宫保鸡丁', '经典川菜，鸡肉嫩滑，花生香脆', 28.00, '/images/宫保鸡丁.jpg', '热菜'),
(1, '香辣鱿鱼须', '麻辣鲜香，口感爽脆', 38.00, '/images/香辣鱿鱼须.jpg', '热菜'),
(1, '新疆大盘鸡', '分量足，味道浓郁', 68.00, '/images/新疆大盘鸡.jpg', '热菜'),
(1, '玉米排骨汤', '营养丰富，汤清味鲜', 22.00, '/images/玉米排骨汤.jpg', '汤品'),
(2, '白切鸡', '皮爽肉滑，蘸料提味', 48.00, '/images/dish5.jpg', '热菜'),
(2, '清蒸鲈鱼', '鲜嫩多汁，清淡爽口', 58.00, '/images/dish6.jpg', '热菜'),
(3, '兰州拉面', '手工拉面，汤头浓郁', 18.00, '/images/dish7.jpg', '主食'),
(3, '肉夹馍', '外酥里嫩，肉质鲜美', 12.00, '/images/dish8.jpg', '主食'),
(4, '牛肉汉堡', '多汁牛肉饼，新鲜蔬菜', 25.00, '/images/dish9.jpg', '主食'),
(4, '炸鸡薯条', '外酥里嫩，搭配番茄酱', 22.00, '/images/dish10.jpg', '小吃');

-- 插入用户数据
INSERT INTO users (username, password, avatar, phone) VALUES
('admin', '123456', '/images/avatar1.jpg', '13800138000'),
('user1', '123456', '/images/avatar2.jpg', '13900139000');

-- 插入订单数据
INSERT INTO orders (user_id, merchant_id, total_price, status) VALUES
(1, 1, 98.00, 'completed'),
(1, 2, 58.00, 'pending'),
(2, 3, 30.00, 'completed'),
(2, 4, 25.00, 'processing');

-- 插入订单明细数据
INSERT INTO order_items (order_id, dish_id, quantity, price) VALUES
(1, 1, 1, 28.00),
(1, 2, 1, 38.00),
(1, 4, 1, 22.00),
(2, 5, 1, 48.00),
(3, 7, 1, 18.00),
(3, 8, 1, 12.00),
(4, 9, 1, 25.00);
