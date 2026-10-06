// 商家模型
const db = require('../db');

class Merchant {
  static async getAll() {
    try {
      const [rows] = await db.pool.execute('SELECT * FROM merchants');
      return rows;
    } catch (error) {
      console.error('获取商家列表失败:', error.message);
      return [];
    }
  }

  static async getById(id) {
    try {
      const [rows] = await db.pool.execute('SELECT * FROM merchants WHERE id = ?', [id]);
      return rows[0] || null;
    } catch (error) {
      console.error('获取商家失败:', error.message);
      return null;
    }
  }
}

module.exports = Merchant;