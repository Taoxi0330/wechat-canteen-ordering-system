// 使用http模块创建服务器
const http = require('http');

const port = 3000;

// 创建服务器
const server = http.createServer((req, res) => {
  // 设置响应头
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // 处理OPTIONS请求
  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    res.end();
    return;
  }
  
  // 处理GET请求
  if (req.method === 'GET' && req.url === '/') {
    res.statusCode = 200;
    res.end(JSON.stringify({ message: 'Hello World!' }));
    return;
  }
  
  // 处理PUT请求
  if (req.method === 'PUT' && req.url.startsWith('/api/merchants/')) {
    // 提取ID
    const id = req.url.split('/')[3];
    
    // 读取请求体
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    
    req.on('end', () => {
      try {
        const merchantData = JSON.parse(body);
        console.log('更新商家请求接收成功:', {
          id,
          ...merchantData
        });
        res.statusCode = 200;
        res.end(JSON.stringify({ success: true }));
      } catch (error) {
        console.error('解析请求体失败:', error.message);
        res.statusCode = 400;
        res.end(JSON.stringify({ success: false, message: '解析请求体失败' }));
      }
    });
    
    return;
  }
  
  // 处理其他请求
  res.statusCode = 404;
  res.end(JSON.stringify({ message: 'Not Found' }));
});

// 启动服务器
server.listen(port, () => {
  console.log(`服务器运行在 http://localhost:${port}`);
});