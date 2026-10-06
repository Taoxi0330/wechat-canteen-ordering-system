const fs = require('fs');

const filePath = 'f:\\WeChat Files\\校园食堂订餐系统\\services\\api.js';

const fileContent = fs.readFileSync(filePath, 'utf8');

const oldCode = `    // 直接返回成功，不执行数据库操作
    // 这样可以避免数据库操作导致的服务器崩溃
    console.log('更新商家请求接收成功:', {
      id: merchantId,
      canteen_id,
      name,
      description,
      business_hours,
      image
    });
    return { success: true };`;

const newCode = `    // 执行数据库更新操作
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
    }`;

const index = fileContent.indexOf(oldCode);

if (index !== -1) {
  const newContent = fileContent.substring(0, index) + newCode + fileContent.substring(index + oldCode.length);
  fs.writeFileSync(filePath, newContent, 'utf8');
  console.log('文件修改成功');
} else {
  console.log('未找到旧代码');
}