// 订单模型
const db = require('../db');

class Order {
  static async getAllByUserId(userId) {
    try {
      const [rows] = await db.pool.execute(
        'SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC', 
        [userId]
      );
      return rows;
    } catch (error) {
      console.error('获取订单列表失败:', error.message);
      return [];
    }
  }

  static async create(orderData) {
    try {
      const [result] = await db.pool.execute(
        'INSERT INTO orders (user_id, merchant_id, total_price, status, created_at) VALUES (?, ?, ?, ?, NOW())',
        [orderData.userId, orderData.merchantId, orderData.totalPrice, orderData.status]
      );
      return result.insertId;
    } catch (error) {
      console.error('创建订单失败:', error.message);
      return null;
    }
  }

  static async getById(id) {
    try {
      const [rows] = await db.pool.execute('SELECT * FROM orders WHERE id = ?', [id]);
      return rows[0] || null;
    } catch (error) {
      console.error('获取订单失败:', error.message);
      return null;
    }
  }
}

module.exports = Order;