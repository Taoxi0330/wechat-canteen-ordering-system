// 首页逻辑
Page({
  data: {
    swiperImages: [
      '/images/宫保鸡丁.jpg',
      '/images/香辣鱿鱼须.jpg',
      '/images/新疆大盘鸡.jpg',
      '/images/玉米排骨汤.jpg'
    ],
    merchants: [
      {
        id: 1,
        name: '川菜馆',
        description: '正宗川菜，口味麻辣鲜香',
        image: '/images/merchant1.jpg',
        hours: '09:00-22:00'
      },
      {
        id: 2,
        name: '粤菜餐厅',
        description: '精致粤菜，口味清淡鲜美',
        image: '/images/merchant2.jpg',
        hours: '10:00-21:30'
      },
      {
        id: 3,
        name: '西北风味',
        description: '地道西北菜，分量足',
        image: '/images/merchant3.jpg',
        hours: '09:30-22:30'
      },
      {
        id: 4,
        name: '快餐汉堡',
        description: '快捷方便，适合赶时间',
        image: '/images/merchant4.jpg',
        hours: '08:00-23:00'
      }
    ],
    allDishes: [
      { id: 1, name: '宫保鸡丁', merchantId: 1, merchantName: '川菜馆' },
      { id: 2, name: '麻婆豆腐', merchantId: 1, merchantName: '川菜馆' },
      { id: 3, name: '鱼香肉丝', merchantId: 1, merchantName: '川菜馆' },
      { id: 4, name: '白切鸡', merchantId: 2, merchantName: '粤菜餐厅' },
      { id: 5, name: '蒸蛋羹', merchantId: 2, merchantName: '粤菜餐厅' },
      { id: 6, name: '红烧肉', merchantId: 2, merchantName: '粤菜餐厅' },
      { id: 7, name: '大盘鸡', merchantId: 3, merchantName: '西北风味' },
      { id: 8, name: '羊肉串', merchantId: 3, merchantName: '西北风味' },
      { id: 9, name: '牛肉面', merchantId: 3, merchantName: '西北风味' },
      { id: 10, name: '汉堡包', merchantId: 4, merchantName: '快餐汉堡' },
      { id: 11, name: '薯条', merchantId: 4, merchantName: '快餐汉堡' },
      { id: 12, name: '可乐', merchantId: 4, merchantName: '快餐汉堡' }
    ],
    searchKeyword: '',
    userInfo: null
  },

  onLoad() {
    console.log('首页加载');
    this.getMerchants();
    this.checkLoginStatus();
  },

  onShow() {
    this.checkLoginStatus();
  },

  // 检查登录状态
  checkLoginStatus() {
    console.log('=== 检查登录状态 ===');
    const userInfo = wx.getStorageSync('userInfo');
    console.log('从本地存储读取的userInfo:', userInfo);
    if (userInfo) {
      console.log('设置userInfo存在，更新界面');
      this.setData({ userInfo }, () => {
        console.log('setData完成后，当前data.userInfo:', this.data.userInfo);
      });
    } else {
      console.log('userInfo不存在，清空界面');
      this.setData({ userInfo: null }, () => {
        console.log('setData完成后，当前data.userInfo:', this.data.userInfo);
      });
    }
  },

  // 获取商家列表
  getMerchants() {
    wx.request({
      url: 'http://192.168.50.250:3000/api/merchants',
      method: 'GET',
      success: (res) => {
        console.log('获取商家列表成功:', res.data);
        if (res.data && res.data.length > 0) {
          this.setData({
            merchants: res.data
          });
        }
      },
      fail: (error) => {
        console.error('获取商家列表失败:', error);
      }
    });
  },

  // 搜索输入
  onSearchInput(e) {
    this.setData({
      searchKeyword: e.detail.value
    });
  },

  // 搜索确认
  onSearchConfirm() {
    const keyword = this.data.searchKeyword.trim();
    if (!keyword) {
      wx.showToast({
        title: '请输入搜索内容',
        icon: 'none'
      });
      return;
    }
    
    this.performSearch(keyword);
  },

  // 执行搜索
  performSearch(keyword) {
    wx.showLoading({ title: '搜索中...' });
    
    // 搜索商家
    const matchedMerchants = this.data.merchants.filter(m => 
      m.name.toLowerCase().includes(keyword.toLowerCase())
    );
    
    // 搜索菜品
    const matchedDishes = this.data.allDishes.filter(d => 
      d.name.toLowerCase().includes(keyword.toLowerCase())
    );
    
    wx.hideLoading();
    
    // 优先匹配商家
    if (matchedMerchants.length > 0) {
      const merchant = matchedMerchants[0];
      wx.showToast({
        title: `找到商家: ${merchant.name}`,
        icon: 'success'
      });
      
      setTimeout(() => {
        this.navigateToMerchant(merchant.id);
      }, 800);
      return;
    }
    
    // 其次匹配菜品
    if (matchedDishes.length > 0) {
      const dish = matchedDishes[0];
      wx.showToast({
        title: `找到菜品: ${dish.name}`,
        icon: 'success'
      });
      
      setTimeout(() => {
        this.navigateToMerchant(dish.merchantId);
      }, 800);
      return;
    }
    
    // 没有找到
    wx.showToast({
      title: '未找到相关商家或菜品',
      icon: 'none'
    });
  },

  // 跳转到商家页面
  navigateToMerchant(merchantId) {
    wx.navigateTo({
      url: `/pages/merchant/detail/detail?id=${merchantId}`
    });
  },
  
  // 点击登录按钮
  onLoginTap() {
    wx.navigateTo({
      url: '/pages/login/login'
    });
  },
  
  // 点击注册按钮
  onRegisterTap() {
    wx.navigateTo({
      url: '/pages/register/register'
    });
  },
  
  // 点击退出登录
  onLogoutTap() {
    wx.showModal({
      title: '提示',
      content: '确定要退出登录吗？',
      success: (res) => {
        if (res.confirm) {
          wx.removeStorageSync('userInfo');
          this.setData({ userInfo: null });
          wx.showToast({
            title: '已退出登录',
            icon: 'success'
          });
        }
      }
    });
  },
  
  // 点击头像
  onAvatarTap() {
    if (!this.data.userInfo) {
      wx.showToast({
        title: '请先登录',
        icon: 'none'
      });
      return;
    }
    
    wx.showActionSheet({
      itemList: ['从相册选择', '拍照'],
      success: (res) => {
        const sourceType = res.tapIndex === 0 ? ['album'] : ['camera'];
        this.chooseAvatar(sourceType);
      }
    });
  },
  
  // 选择头像
  chooseAvatar(sourceType) {
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: sourceType,
      success: (res) => {
        const tempFilePath = res.tempFilePaths[0];
        this.uploadAvatar(tempFilePath);
      }
    });
  },
  
  // 上传头像
  uploadAvatar(filePath) {
    wx.showLoading({ title: '上传中...' });
    
    wx.uploadFile({
      url: 'http://192.168.50.250:3000/api/upload',
      filePath: filePath,
      name: 'image',
      success: (res) => {
        wx.hideLoading();
        const data = JSON.parse(res.data);
        if (data.success) {
          console.log('头像上传成功:', data.image);
          this.updateUserAvatar(data.image.url);
        } else {
          wx.showToast({
            title: '上传失败',
            icon: 'none'
          });
        }
      },
      fail: (error) => {
        wx.hideLoading();
        console.error('头像上传失败:', error);
        wx.showToast({
          title: '上传失败',
          icon: 'none'
        });
      }
    });
  },
  
  // 更新用户头像
  updateUserAvatar(avatarUrl) {
    const userInfo = wx.getStorageSync('userInfo');
    if (userInfo) {
      userInfo.avatar = avatarUrl;
      wx.setStorageSync('userInfo', userInfo);
      this.setData({ userInfo });
      
      wx.showToast({
        title: '头像更新成功',
        icon: 'success'
      });
    }
  },
  
  // 点击堂食
  onEatInTap() {
    console.log('点击堂食，跳转到点餐界面');
    wx.switchTab({
      url: '/pages/order/order'
    });
  },
  
  // 点击外卖
  onTakeawayTap() {
    console.log('点击外卖，跳转到点餐界面');
    wx.switchTab({
      url: '/pages/order/order'
    });
  }
})

