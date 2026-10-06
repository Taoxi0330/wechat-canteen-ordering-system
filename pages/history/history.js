Page({
  data: {
    currentTab: 0,
    allOrders: [],
    displayOrders: []
  },
  
  onLoad() {
    this.getOrders();
    // 启动订单实时更新轮询（每30秒更新一次）
    this.startOrderUpdatePolling();
  },

  onShow() {
    // 每次页面显示时重新获取订单，确保显示的是当前登录用户的订单
    this.getOrders();
  },

  onUnload() {
    // 页面卸载时停止轮询
    this.stopOrderUpdatePolling();
  },

  startOrderUpdatePolling() {
    // 每30秒更新一次订单
    this.orderUpdateInterval = setInterval(() => {
      console.log('正在更新订单...');
      this.getOrders();
    }, 30000); // 30秒
  },

  stopOrderUpdatePolling() {
    if (this.orderUpdateInterval) {
      clearInterval(this.orderUpdateInterval);
      this.orderUpdateInterval = null;
    }
  },

  switchTab(e) {
    const index = parseInt(e.currentTarget.dataset.index);
    this.setData({ currentTab: index });
    this.filterOrders();
  },

  filterOrders() {
    const { currentTab, allOrders } = this.data;
    let displayOrders = [];
    
    if (currentTab === 1) {
      displayOrders = allOrders.filter(order => order.status === 'completed');
    } else {
      displayOrders = allOrders;
    }
    
    this.setData({ displayOrders });
  },

  getOrders() {
    const userInfo = wx.getStorageSync('userInfo');
    
    // 如果没有用户信息，提示登录
    if (!userInfo) {
      wx.showToast({
        title: '请先登录',
        icon: 'none'
      });
      // 跳转到登录页面
      setTimeout(() => {
        wx.navigateTo({
          url: '/pages/login/login'
        });
      }, 1000);
      return;
    }
    
    const userId = userInfo.id;
    
    wx.request({
      url: `http://192.168.50.250:3000/api/orders/user/${userId}`,
      method: 'GET',
      success: (res) => {
        console.log('获取订单列表成功:', res.data);
        try {
          // 尝试将数据转换为数组
          const orders = Array.isArray(res.data) ? res.data : [];
          const allOrders = orders.map(order => {
            let statusText = '待处理';
            let status = order.status;
            if (order.status === 'completed') {
              statusText = '待评价';
            } else if (order.status === 'pending') {
              statusText = '待处理';
            } else if (order.status === 'processing') {
              statusText = '处理中';
            } else if (order.status === 'cancelled') {
              statusText = '已取消';
            }
            
            const merchant = order.merchant || { name: '未知商家' };
            const items = order.items || [];
            
            return {
              id: order.id.toString(),
              created_at: order.created_at,
              status: status,
              statusText: statusText,
              order_type: order.order_type || 'eatIn',
              totalPrice: parseFloat(order.total_price).toFixed(2),
              merchant: merchant,
              items: items
            };
          });
          
          // 只有当订单数据发生变化时才更新页面
          if (JSON.stringify(allOrders) !== JSON.stringify(this.data.allOrders)) {
            this.setData({ allOrders });
            this.filterOrders();
            // 提示用户订单已更新
            wx.showToast({
              title: '订单已更新',
              icon: 'success',
              duration: 1500
            });
          }
        } catch (error) {
          console.error('处理订单数据失败:', error);
          // 使用模拟数据作为 fallback
          const mockOrders = [
            {
              id: '1',
              created_at: '2024-02-09 12:30',
              status: 'completed',
              statusText: '待评价',
              order_type: 'eatIn',
              totalPrice: '66.00',
              merchant: { name: '川菜馆' },
              items: [
                { id: 1, name: '宫保鸡丁', quantity: 2, image: '/images/宫保鸡丁.jpg' },
                { id: 2, name: '玉米排骨汤', quantity: 1, image: '/images/玉米排骨汤.jpg' }
              ]
            },
            {
              id: '2',
              created_at: '2024-02-08 18:45',
              status: 'processing',
              statusText: '处理中',
              order_type: 'takeaway',
              totalPrice: '58.00',
              merchant: { name: '粤菜餐厅' },
              items: [
                { id: 3, name: '白切鸡', quantity: 1, image: '/images/dish5.jpg' }
              ]
            },
            {
              id: '3',
              created_at: '2024-02-08 18:45',
              status: 'completed',
              statusText: '待评价',
              order_type: 'eatIn',
              totalPrice: '42.00',
              merchant: { name: '湘菜馆' },
              items: [
                { id: 4, name: '剁椒鱼头', quantity: 1, image: '/images/dish6.jpg' }
              ]
            }
          ];
          this.setData({ allOrders: mockOrders });
          this.filterOrders();
        }
      },
      fail: (error) => {
        console.error('获取订单列表失败:', error);
        // 使用模拟数据作为 fallback
        const mockOrders = [
          {
            id: '1',
            created_at: '2024-02-09 12:30',
            status: 'completed',
            statusText: '待评价',
            order_type: 'eatIn',
            totalPrice: '66.00',
            merchant: { name: '川菜馆' },
            items: [
              { id: 1, name: '宫保鸡丁', quantity: 2, image: '/images/宫保鸡丁.jpg' },
              { id: 2, name: '玉米排骨汤', quantity: 1, image: '/images/玉米排骨汤.jpg' }
            ]
          },
          {
            id: '2',
            created_at: '2024-02-08 18:45',
            status: 'processing',
            statusText: '处理中',
            order_type: 'takeaway',
            totalPrice: '58.00',
            merchant: { name: '粤菜餐厅' },
            items: [
              { id: 3, name: '白切鸡', quantity: 1, image: '/images/dish5.jpg' }
              ]
            },
            {
              id: '3',
              created_at: '2024-02-08 18:45',
              status: 'completed',
              statusText: '待评价',
              order_type: 'eatIn',
              totalPrice: '42.00',
              merchant: { name: '湘菜馆' },
              items: [
                { id: 4, name: '剁椒鱼头', quantity: 1, image: '/images/dish6.jpg' }
              ]
            }
          ];
          this.setData({ allOrders: mockOrders });
          this.filterOrders();
        },
        complete: () => {
          // wx.hideLoading(); // 隐藏加载提示，避免频繁显示
        }
      });
  },

  goToEvaluate(e) {
    const orderId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/evaluate/evaluate?orderId=${orderId}`
    });
  },

  goToOrderDetail(e) {
    const orderId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/order-detail/order-detail?id=${orderId}`
    });
  },

  // 取消订单
  cancelOrder(e) {
    const orderId = e.currentTarget.dataset.id;
    const order = this.data.allOrders.find(o => o.id === orderId);
    
    if (!order) {
      wx.showToast({
        title: '订单不存在',
        icon: 'none'
      });
      return;
    }
    
    // 只有待处理的订单可以取消
    if (order.status !== 'pending') {
      wx.showToast({
        title: '只有待处理的订单可以取消',
        icon: 'none'
      });
      return;
    }
    
    wx.showModal({
      title: '取消订单',
      content: '确定要取消该订单吗？',
      success: (res) => {
        if (res.confirm) {
          wx.showLoading({ title: '取消订单中...' });
          
          wx.request({
            url: `http://192.168.50.250:3000/api/orders/${orderId}`,
            method: 'PUT',
            data: { status: 'cancelled' },
            success: (res) => {
              wx.hideLoading();
              if (res.data.success) {
                wx.showToast({
                  title: '订单已取消',
                  icon: 'success'
                });
                // 重新获取订单列表
                this.getOrders();
              } else {
                wx.showToast({
                  title: '取消订单失败',
                  icon: 'none'
                });
              }
            },
            fail: (error) => {
              wx.hideLoading();
              console.error('取消订单失败:', error);
              wx.showToast({
                title: '网络错误，取消失败',
                icon: 'none'
              });
            }
          });
        }
      }
    });
  }
})