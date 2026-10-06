// 配置文件
const config = {
  // API基础地址
  // 注意：在真机上运行时，需要将localhost替换为电脑的局域网IP地址
  // 例如：http://192.168.1.100:3000
  API_BASE_URL: 'http://192.168.50.250:3000',
  
  // 请求超时时间（毫秒）
  TIMEOUT: 10000,
  
  // 是否启用调试模式
  DEBUG: true
};

module.exports = config;
