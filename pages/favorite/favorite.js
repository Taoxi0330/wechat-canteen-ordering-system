// 我的收藏页面逻辑
const app = getApp();
const API_BASE_URL = 'http://192.168.50.250:3000';

Page({
  // 页面数据
  data: {
    favoriteList: []
  },
  
  // 页面加载
  onLoad() {
    this.loadFavoriteList();
  },
  
  // 页面显示
  onShow() {
    this.loadFavoriteList();
  },
  
  // 加载收藏列表
  loadFavoriteList() {
    const userInfo = wx.getStorageSync('userInfo');
    if (!userInfo) {
      wx.showToast({
        title: '请先登录',
        icon: 'none'
      });
      return;
    }
    
    const userId = userInfo.id;
    const favoriteKey = `favoriteList_${userId}`;
    
    // 优先从本地存储读取
    let localFavorites = wx.getStorageSync(favoriteKey) || [];
    if (localFavorites.length > 0) {
      this.setData({
        favoriteList: localFavorites
      });
    }
    
    // 同时尝试从服务器获取最新数据
    wx.request({
      url: `${API_BASE_URL}/api/favorites/${userId}`,
      method: 'GET',
      success: (res) => {
        if (res.data.success) {
          // 更新本地存储
          wx.setStorageSync(favoriteKey, res.data.data);
          this.setData({
            favoriteList: res.data.data
          });
        } else {
          console.log('服务器获取失败，使用本地数据');
        }
      },
      fail: (error) => {
        console.error('获取收藏列表失败:', error);
        console.log('使用本地存储数据');
      }
    });
  },
  
  // 点击商家
  onMerchantTap(e) {
    const merchant = e.currentTarget.dataset.merchant;
    if (merchant) {
      // 跳转到商家详情页面
      wx.navigateTo({
        url: `/pages/merchant/detail/detail?merchant=${encodeURIComponent(JSON.stringify(merchant))}`
      });
    }
  }
});