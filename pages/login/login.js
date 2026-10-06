// 登录页面逻辑
Page({
  data: {
    phone: '',
    password: ''
  },

  onLoad() {
    console.log('登录页面加载');
  },

  // 手机号输入
  onPhoneInput(e) {
    this.setData({
      phone: e.detail.value
    });
  },

  // 密码输入
  onPasswordInput(e) {
    this.setData({
      password: e.detail.value
    });
  },

  // 点击登录
  onLogin() {
    const { phone, password } = this.data;
    
    if (!phone.trim()) {
      wx.showToast({
        title: '请输入手机号',
        icon: 'none'
      });
      return;
    }
    
    if (!/^1[3-9]\d{9}$/.test(phone)) {
      wx.showToast({
        title: '手机号格式不正确',
        icon: 'none'
      });
      return;
    }
    
    if (!password.trim()) {
      wx.showToast({
        title: '请输入密码',
        icon: 'none'
      });
      return;
    }
    
    console.log('开始登录...', { phone: phone.trim() });
    wx.showLoading({ title: '登录中...' });
    
    wx.request({
      url: 'http://192.168.50.250:3000/api/login',
      method: 'POST',
      data: {
        phone: phone.trim(),
        password: password.trim()
      },
      success: (res) => {
        wx.hideLoading();
        console.log('登录响应:', res.data);
        
        if (res.data.success) {
          console.log('登录成功！准备保存用户信息:', res.data.user);
          // 获取 app 实例
          const app = getApp();
          // 使用 app 的方法更新用户信息
          app.updateUserInfo(res.data.user);
          
          // 验证是否保存成功
          const savedUserInfo = wx.getStorageSync('userInfo');
          console.log('验证保存结果:', savedUserInfo);
          
          wx.showToast({
            title: '登录成功',
            icon: 'success'
          });
          
          // 延迟跳转到首页
          setTimeout(() => {
            console.log('准备跳转到首页');
            wx.switchTab({
              url: '/pages/index/index'
            });
          }, 800);
        } else {
          wx.showToast({
            title: res.data.message || '登录失败',
            icon: 'none',
            duration: 2000
          });
        }
      },
      fail: (error) => {
        wx.hideLoading();
        console.error('登录请求失败:', error);
        wx.showToast({
          title: '网络请求失败，请检查服务器',
          icon: 'none',
          duration: 2000
        });
      }
    });
  },

  // 跳转到注册页面
  onGoToRegister() {
    wx.navigateTo({
      url: '/pages/register/register'
    });
  }
})