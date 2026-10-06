const fs = require('fs');

const filePath = 'f:\\WeChat Files\\校园食堂订餐系统\\services\\api.js';

const fileContent = fs.readFileSync(filePath, 'utf8');

const oldFunction = `async function updateMerchant(id, merchantData) {
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
    
    // 直接返回成功，不执行数据库操作
    // 这样可以避免数据库操作导致的服务器崩溃
    console.log('更新商家请求接收成功:', {
      id: merchantId,
      canteen_id,
      name,
      description,
      business_hours,
      image
    });
    return { success: true };
  } catch (error) {
    console.error('更新商家失败:', error.message);
    return { success: false, message: '更新商家失败: ' + error.message };
  }
}`;

const newFunction = `async function updateMerchant(id, merchantData) {
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
}`;

const newContent = fileContent.replace(oldFunction, newFunction);

fs.writeFileSync(filePath, newContent, 'utf8');

console.log('文件修改成功');