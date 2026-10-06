const fs = require('fs');

const filePath = 'f:\\WeChat Files\\校园食堂订餐系统\\services\\api.js';

const lines = fs.readFileSync(filePath, 'utf8').split('\n');

let foundUpdateMerchant = false;
let foundReturnSuccess = false;
let insertIndex = -1;

for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('async function updateMerchant')) {
    foundUpdateMerchant = true;
  }
  
  if (foundUpdateMerchant && lines[i].includes('return { success: true };')) {
    foundReturnSuccess = true;
    insertIndex = i;
    break;
  }
}

if (foundReturnSuccess) {
  console.log('找到更新商家函数，准备修改...');
  
  const newLines = [
    '    // 执行数据库更新操作',
    '    const [result] = await db.pool.execute(',
    "      'UPDATE merchants SET canteen_id = ?, name = ?, description = ?, hours = ?, image = ? WHERE id = ?',",
    '      [canteen_id, name, description, business_hours || null, image || null, merchantId]',
    '    );',
    '    ',
    '    if (result.affectedRows > 0) {',
    '      console.log(\'更新商家成功:\', {',
    '        id: merchantId,',
    '        canteen_id,',
    '        name,',
    '        description,',
    '        business_hours,',
    '        image',
    '      });',
    '      return { success: true };',
    '    } else {',
    '      return { success: false, message: \'商家不存在\' };',
    '    }'
  ];
  
  const beforeLines = lines.slice(0, insertIndex - 8);
  const afterLines = lines.slice(insertIndex + 1);
  
  const newContent = beforeLines.concat(newLines).concat(afterLines).join('\n');
  
  fs.writeFileSync(filePath, newContent, 'utf8');
  console.log('文件修改成功');
} else {
  console.log('未找到更新商家函数');
}