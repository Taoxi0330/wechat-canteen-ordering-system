// 非常简单的服务器
const express = require('express');

const app = express();
const port = 3000;

// 中间件
app.use(express.json());

// 测试路由
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// 商家更新路由
app.put('/api/merchants/:id', (req, res) => {
  const { id } = req.params;
  const merchantData = req.body;
  console.log('更新商家请求接收成功:', {
    id,
    ...merchantData
  });
  res.json({ success: true });
});

// 启动服务器
app.listen(port, () => {
  console.log(`服务器运行在 http://localhost:${port}`);
});