// 菜品模型
const db = require('../db');

class Dish {
  static async getAllByMerchantId(merchantId) {
    try {
      const [rows] = await db.pool.execute(
        'SELECT * FROM dishes WHERE merchant_id = ?', 
        [merchantId]
      );
      return rows;
    } catch (error) {
      console.error('获取菜品列表失败:', error.message);
      return [];
    }
  }

  static async getById(id) {
    try {
      const [rows] = await db.pool.execute('SELECT * FROM dishes WHERE id = ?', [id]);
      return rows[0] || null;
    } catch (error) {
      console.error('获取菜品失败:', error.message);
      return null;
    }
  }
}

module.exports = Dish;