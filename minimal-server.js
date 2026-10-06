// 最小化服务器
const express = require('express');
const cors = require('cors');

const app = express();
const port = 3000;

// 中间件
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 测试路由
app.get('/api/test', (req, res) => {
  res.json({ success: true, message: '测试成功' });
});

// 商家更新路由
app.put('/api/merchants/:id', (req, res) => {
  try {
    const { id } = req.params;
    const merchantData = req.body;
    console.log('更新商家请求接收成功:', {
      id,
      ...merchantData
    });
    res.json({ success: true });
  } catch (error) {
    console.error('更新商家失败:', error.message);
    res.status(500).json({ success: false, message: '更新商家失败: ' + error.message });
  }
});

// 启动服务器
app.listen(port, () => {
  console.log(`服务器运行在 http://localhost:${port}`);
});