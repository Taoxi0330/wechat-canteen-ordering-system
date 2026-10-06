const app = getApp();
const API_BASE_URL = 'http://192.168.50.250:3000';

Page({
  data: {
    reviews: [],
    averageRating: 0
  },

  onLoad(options) {
    this.loadMyReviews();
  },

  onShow() {
    this.loadMyReviews();
  },

  goBack() {
    wx.navigateBack();
  },

  loadMyReviews() {
    // 首先尝试从 app.globalData 获取，没有则从本地存储获取
    let userId = app.globalData.userId;
    if (!userId) {
      try {
        const userInfo = wx.getStorageSync('userInfo');
        if (userInfo && userInfo.id) {
          userId = userInfo.id;
          app.globalData.userId = userId;
          app.globalData.userInfo = userInfo;
        }
      } catch (error) {
        console.error('获取用户信息失败:', error);
      }
    }
    if (!userId) {
      wx.showToast({
        title: '请先登录',
        icon: 'none'
      });
      return;
    }
    
    console.log('加载评价，用户ID:', userId);
    wx.showLoading({ title: '加载中...' });

    wx.request({
      url: `${API_BASE_URL}/api/reviews/user/${userId}`,
      method: 'GET',
      success: (res) => {
        wx.hideLoading();
        const reviews = res.data || [];
        
        let averageRating = 0;
        if (reviews.length > 0) {
          const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
          averageRating = (totalRating / reviews.length).toFixed(1);
        }

        const formattedReviews = reviews.map(review => {
          let createdAt = review.created_at;
          if (createdAt) {
            const date = new Date(createdAt);
            createdAt = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
          }
          
          let replyAt = null;
          if (review.reply_at) {
            const date = new Date(review.reply_at);
            replyAt = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
          }
          
          return {
            ...review,
            created_at: createdAt,
            reply_at: replyAt
          };
        });

        this.setData({
          reviews: formattedReviews,
          averageRating: averageRating
        });
      },
      fail: (error) => {
        wx.hideLoading();
        console.error('加载评价失败:', error);
        wx.showToast({
          title: '加载失败',
          icon: 'none'
        });
      }
    });
  }
});