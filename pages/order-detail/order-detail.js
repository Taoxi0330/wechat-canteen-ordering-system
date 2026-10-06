Page({
  data: {
    orderId: null,
    order: null,
    loading: true,
    estimatedDeliveryTime: '',
    formattedOrderTime: '',
    formattedReservationTime: '',
    statusText: {
      'pending': '待处理',
      'processing': '处理中',
      'completed': '已完成',
      'cancelled': '已取消'
    }
  },

  // 格式化日期时间
  formatDateTime(dateStr) {
    if (!dateStr) return '';
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return '';
      
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hour = String(date.getHours()).padStart(2, '0');
      const minute = String(date.getMinutes()).padStart(2, '0');
      
      return `${year}-${month}-${day} ${hour}:${minute}`;
    } catch (e) {
      console.error('日期格式化失败:', e);
      return '';
    }
  },

  onLoad(options) {
    console.log('订单详情页面加载', options);
    if (options.id) {
      this.setData({ orderId: options.id });
      this.fetchOrderDetail(options.id);
    }
  },

  onReady() {
    // 在页面渲染完成后获取屏幕高度
    try {
      const res = wx.getSystemInfoSync();
      console.log('屏幕高度:', res.screenHeight);
      // 可以在这里设置页面高度
    } catch (error) {
      console.error('获取屏幕信息失败:', error);
    }
  },

  fetchOrderDetail(orderId) {
    const that = this;
    wx.request({
      url: 'http://192.168.50.250:3000/api/orders/' + orderId,
      method: 'GET',
      success: function(res) {
        console.log('获取订单详情成功:', res);
        if (res.statusCode === 200 && res.data) {
          // 计算预计送达时间（外卖默认25分钟）
          let estimatedDeliveryTime = '';
          if (res.data.order_type === 'takeaway' && res.data.created_at) {
            const createdAt = new Date(res.data.created_at);
            if (!isNaN(createdAt.getTime())) {
              const deliveryTime = new Date(createdAt.getTime() + 25 * 60 * 1000); // 25分钟
              estimatedDeliveryTime = that.formatDateTime(deliveryTime.toISOString());
            }
          }
          
          // 格式化下单时间
          const formattedOrderTime = that.formatDateTime(res.data.created_at);
          
          // 格式化预约时间
          const formattedReservationTime = that.formatDateTime(res.data.reservation_time);
          
          that.setData({
            order: res.data,
            estimatedDeliveryTime: estimatedDeliveryTime,
            formattedOrderTime: formattedOrderTime,
            formattedReservationTime: formattedReservationTime,
            loading: false
          });
        } else {
          wx.showToast({
            title: '获取订单信息失败',
            icon: 'none'
          });
          that.setData({ loading: false });
        }
      },
      fail: function(error) {
        console.error('获取订单详情失败:', error);
        wx.showToast({
          title: '网络错误',
          icon: 'none'
        });
        that.setData({ loading: false });
      }
    });
  }
})
