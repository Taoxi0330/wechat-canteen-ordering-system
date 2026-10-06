// 注册页面逻辑
Page({
  data: {
    username: '',
    phone: '',
    password: '',
    confirmPassword: ''
  },

  onLoad() {
    console.log('注册页面加载');
  },

  // 用户名输入
  onUsernameInput(e) {
    this.setData({
      username: e.detail.value
    });
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

  // 确认密码输入
  onConfirmPasswordInput(e) {
    this.setData({
      confirmPassword: e.detail.value
    });
  },

  // 点击注册
  onRegister() {
    const { username, phone, password, confirmPassword } = this.data;
    
    if (!username.trim()) {
      wx.showToast({
        title: '请输入用户名',
        icon: 'none'
      });
      return;
    }
    
    if (username.length < 3) {
      wx.showToast({
        title: '用户名至少3位',
        icon: 'none'
      });
      return;
    }
    
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
    
    if (password.length < 6) {
      wx.showToast({
        title: '密码至少6位',
        icon: 'none'
      });
      return;
    }
    
    if (password !== confirmPassword) {
      wx.showToast({
        title: '两次密码不一致',
        icon: 'none'
      });
      return;
    }
    
    wx.showLoading({ title: '注册中...' });
    
    wx.request({
      url: 'http://192.168.50.250:3000/api/register',
      method: 'POST',
      data: {
        username: username.trim(),
        password: password.trim(),
        phone: phone.trim()
      },
      success: (res) => {
        wx.hideLoading();
        
        if (res.data.success) {
          wx.showToast({
            title: '注册成功',
            icon: 'success'
          });
          
          // 延迟跳转到登录页面
          setTimeout(() => {
            wx.navigateBack();
          }, 800);
        } else {
          wx.showToast({
            title: res.data.message || '注册失败',
            icon: 'none'
          });
        }
      },
      fail: () => {
        wx.hideLoading();
        wx.showToast({
          title: '网络请求失败',
          icon: 'none'
        });
      }
    });
  },

  // 跳转到登录页面
  onGoToLogin() {
    wx.navigateBack();
  }
})