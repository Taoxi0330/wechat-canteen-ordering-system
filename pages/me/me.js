// 我的页面逻辑
Page({
  // 页面数据
  data: {
    userInfo: null
  },
  
  // 页面加载
  onLoad() {
    this.checkLoginStatus();
  },
  
  // 页面显示
  onShow() {
    this.checkLoginStatus();
  },
  
  // 检查登录状态
  checkLoginStatus() {
    const userInfo = wx.getStorageSync('userInfo');
    if (userInfo) {
      this.setData({ userInfo });
    } else {
      this.setData({ userInfo: null });
    }
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

  // 我的收藏
  onFavoriteTap() {
    if (!this.data.userInfo) {
      wx.showToast({
        title: '请先登录',
        icon: 'none'
      });
      return;
    }
    
    wx.navigateTo({
      url: '/pages/favorite/favorite'
    });
  },

  // 我的订单
  onOrderTap() {
    // 调试：打印点击事件
    console.log('我的订单按钮被点击');
    
    // 使用 switchTab 跳转到 tabBar 页面
    wx.switchTab({
      url: '/pages/history/history'
    });
  },

  // 我的评价
  onMyReviewsTap() {
    if (!this.data.userInfo) {
      wx.showToast({
        title: '请先登录',
        icon: 'none'
      });
      return;
    }
    
    wx.navigateTo({
      url: '/pages/my-reviews/my-reviews'
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
  
  // 登录处理
  onLogin() {
    wx.navigateTo({
      url: '/pages/login/login'
    });
  },
  
  // 退出登录
  onLogout() {
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

  // 点击我的地址
  onAddressTap() {
    const userInfo = wx.getStorageSync('userInfo');
    
    if (!userInfo) {
      wx.showToast({
        title: '请先登录',
        icon: 'none'
      });
      return;
    }
    
    wx.navigateTo({
      url: '/pages/address-list/address-list'
    });
  },

  // 点击个人信息与账号安全
  onPersonalInfoTap() {
    const userInfo = wx.getStorageSync('userInfo');
    
    if (!userInfo) {
      wx.showToast({
        title: '请先登录',
        icon: 'none'
      });
      return;
    }
    
    wx.navigateTo({
      url: '/pages/personal-info/personal-info'
    });
  }
})