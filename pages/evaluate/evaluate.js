const app = getApp();

Page({
  data: {
    orderId: null,
    merchantId: null,
    userId: null,
    orderItems: [],
    itemReviews: {},
    starStatus: {} // 存储每个菜品的星星状态
  },

  onLoad(options) {
    if (options.orderId) {
      this.setData({ orderId: options.orderId });
      this.loadOrderDetail();
    } else {
      wx.showToast({
        title: '订单信息错误',
        icon: 'none'
      });
      setTimeout(() => {
        wx.navigateBack();
      }, 1500);
    }
  },

  loadOrderDetail() {
    wx.showLoading({ title: '加载中...' });
    
    wx.request({
      url: `http://192.168.50.250:3000/api/orders/${this.data.orderId}`,
      method: 'GET',
      success: (res) => {
        wx.hideLoading();
        if (res.data) {
          const order = res.data;
          console.log('订单详情:', order);
          
          let orderItems = order.items || [];
          // 确保 orderItems 是数组
          if (typeof orderItems === 'string') {
            try {
              orderItems = JSON.parse(orderItems);
            } catch (e) {
              orderItems = [];
            }
          }
          
          // 确保每个订单项都有 id 属性
          orderItems = orderItems.map((item, index) => ({
            ...item,
            id: item.id || item.dish_id || index + 1
          }));
          
          console.log('处理后的订单项:', orderItems);
          
          this.setData({
            merchantId: order.merchant_id,
            userId: app.globalData.userId || 1,
            orderItems: orderItems
          });
          
          const itemReviews = {};
          const starStatus = {};
          
          orderItems.forEach(item => {
            itemReviews[item.id] = {
              rating: 0,
              content: ''
            };
            starStatus[item.id] = [false, false, false, false, false];
          });
          
          console.log('初始化后的 itemReviews:', itemReviews);
          console.log('初始化后的 starStatus:', starStatus);
          
          this.setData({ itemReviews, starStatus });
        }
      },
      fail: (error) => {
        wx.hideLoading();
        console.error('加载订单详情失败:', error);
        wx.showToast({
          title: '加载失败',
          icon: 'none'
        });
      }
    });
  },

  setRating(e) {
    const { dishId, rating } = e.currentTarget.dataset;
    console.log('点击星星:', { dishId, rating });
    console.log('当前 starStatus:', this.data.starStatus);
    
    const itemReviews = { ...this.data.itemReviews };
    
    if (!itemReviews[dishId]) {
      itemReviews[dishId] = { rating: 0, content: '' };
    }
    
    itemReviews[dishId].rating = rating;
    
    // 更新星星状态 - 创建新的状态对象
    const newStarStatus = { ...this.data.starStatus };
    const newDishStarStatus = [];
    for (let i = 0; i < 5; i++) {
      newDishStarStatus[i] = i < rating;
    }
    newStarStatus[dishId] = newDishStarStatus;
    
    console.log('设置后的 newStarStatus:', newStarStatus);
    
    this.setData({ 
      itemReviews, 
      starStatus: newStarStatus 
    }, () => {
      console.log('setData 完成后的 starStatus:', this.data.starStatus);
    });
  },

  setContent(e) {
    const { dishId } = e.currentTarget.dataset;
    const content = e.detail.value;
    const itemReviews = { ...this.data.itemReviews };
    
    if (!itemReviews[dishId]) {
      itemReviews[dishId] = { rating: 0, content: '' };
    }
    
    itemReviews[dishId].content = content;
    this.setData({ itemReviews });
  },

  submitReviews() {
    const { itemReviews, orderId, merchantId, userId, orderItems } = this.data;
    
    let hasRating = false;
    for (const dishId in itemReviews) {
      if (itemReviews[dishId].rating > 0) {
        hasRating = true;
        break;
      }
    }
    
    if (!hasRating) {
      wx.showToast({
        title: '请至少给一个菜品评分',
        icon: 'none'
      });
      return;
    }

    wx.showLoading({ title: '提交中...' });
    
    const reviewPromises = [];
    
    for (const dishId in itemReviews) {
      const review = itemReviews[dishId];
      if (review.rating > 0) {
        const dish = orderItems.find(item => item.id == dishId);
        
        const reviewPromise = new Promise((resolve, reject) => {
          wx.request({
            url: 'http://192.168.50.250:3000/api/reviews',
            method: 'POST',
            data: {
              user_id: userId,
              merchant_id: merchantId,
              dish_id: parseInt(dishId),
              order_id: orderId,
              rating: review.rating,
              content: review.content
            },
            success: resolve,
            fail: reject
          });
        });
        
        reviewPromises.push(reviewPromise);
      }
    }
    
    Promise.all(reviewPromises)
      .then(() => {
        wx.hideLoading();
        wx.showToast({
          title: '评价成功',
          icon: 'success'
        });
        
        setTimeout(() => {
          wx.navigateBack();
        }, 1500);
      })
      .catch((error) => {
        wx.hideLoading();
        console.error('提交评价失败:', error);
        wx.showToast({
          title: '评价失败，请重试',
          icon: 'none'
        });
      });
  },

  goBack() {
    wx.navigateBack();
  }
});