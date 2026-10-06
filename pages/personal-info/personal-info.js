// 个人信息与账号安全页面逻辑
const API_BASE_URL = 'http://192.168.50.250:3000';

Page({
  // 页面数据
  data: {
    userInfo: null,
    formattedTime: '',
    // 弹窗状态
    showEditUsernameModal: false,
    showEditPasswordModal: false,
    showEditPhoneModal: false,
    // 表单数据
    newUsername: '',
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
    newPhone: '',
    password: ''
  },
  
  // 页面加载
  onLoad() {
    this.loadUserInfo();
  },
  
  // 加载用户信息
  loadUserInfo() {
    const userInfo = wx.getStorageSync('userInfo');
    if (userInfo) {
      // 格式化注册时间
      const formattedTime = this.formatTime(userInfo.created_at);
      this.setData({
        userInfo,
        formattedTime,
        newUsername: userInfo.username,
        newPhone: userInfo.phone || ''
      });
    } else {
      // 如果没有用户信息，返回上一页
      wx.showToast({
        title: '请先登录',
        icon: 'none'
      });
      setTimeout(() => {
        wx.navigateBack();
      }, 1000);
    }
  },
  
  // 格式化时间
  formatTime(timeString) {
    if (!timeString) return '未知';
    const date = new Date(timeString);
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  },
  
  // 打开修改昵称弹窗
  onEditUsername() {
    this.setData({ showEditUsernameModal: true });
  },
  
  // 关闭修改昵称弹窗
  closeEditUsernameModal() {
    this.setData({ showEditUsernameModal: false });
  },
  
  // 打开修改密码弹窗
  onEditPassword() {
    this.setData({ 
      showEditPasswordModal: true,
      oldPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
  },
  
  // 关闭修改密码弹窗
  closeEditPasswordModal() {
    this.setData({ showEditPasswordModal: false });
  },
  
  // 打开修改手机号弹窗
  onEditPhone() {
    this.setData({ 
      showEditPhoneModal: true,
      newPhone: this.data.userInfo.phone || '',
      password: ''
    });
  },
  
  // 关闭修改手机号弹窗
  closeEditPhoneModal() {
    this.setData({ showEditPhoneModal: false });
  },
  
  // 输入新昵称
  onUsernameInput(e) {
    this.setData({ newUsername: e.detail.value });
  },
  
  // 输入原密码
  onOldPasswordInput(e) {
    this.setData({ oldPassword: e.detail.value });
  },
  
  // 输入新密码
  onNewPasswordInput(e) {
    this.setData({ newPassword: e.detail.value });
  },
  
  // 输入确认密码
  onConfirmPasswordInput(e) {
    this.setData({ confirmPassword: e.detail.value });
  },
  
  // 输入新手机号
  onPhoneInput(e) {
    this.setData({ newPhone: e.detail.value });
  },
  
  // 输入密码
  onPasswordInput(e) {
    this.setData({ password: e.detail.value });
  },
  
  // 保存昵称
  saveUsername() {
    const { newUsername, userInfo } = this.data;
    
    if (!newUsername.trim()) {
      wx.showToast({ title: '昵称不能为空', icon: 'none' });
      return;
    }
    
    if (newUsername.length < 3) {
      wx.showToast({ title: '昵称至少3位', icon: 'none' });
      return;
    }
    
    if (newUsername === userInfo.username) {
      wx.showToast({ title: '昵称未改变', icon: 'none' });
      this.closeEditUsernameModal();
      return;
    }
    
    wx.showLoading({ title: '保存中...' });
    
    wx.request({
      url: `${API_BASE_URL}/api/users/` + userInfo.id,
      method: 'PUT',
      data: { username: newUsername.trim() },
      success: (res) => {
        wx.hideLoading();
        if (res.data.success) {
          // 更新本地存储的用户信息
          const updatedUserInfo = { ...userInfo, username: newUsername.trim() };
          wx.setStorageSync('userInfo', updatedUserInfo);
          this.setData({ userInfo: updatedUserInfo });
          wx.showToast({ title: '昵称修改成功', icon: 'success' });
          this.closeEditUsernameModal();
        } else {
          wx.showToast({ title: res.data.message || '修改失败', icon: 'none' });
        }
      },
      fail: (error) => {
        wx.hideLoading();
        console.error('修改昵称失败:', error);
        wx.showToast({ title: '网络请求失败', icon: 'none' });
      }
    });
  },
  
  // 保存密码
  savePassword() {
    const { oldPassword, newPassword, confirmPassword, userInfo } = this.data;
    
    if (!oldPassword) {
      wx.showToast({ title: '请输入原密码', icon: 'none' });
      return;
    }
    
    if (!newPassword) {
      wx.showToast({ title: '请输入新密码', icon: 'none' });
      return;
    }
    
    if (newPassword.length < 6) {
      wx.showToast({ title: '新密码至少6位', icon: 'none' });
      return;
    }
    
    if (newPassword !== confirmPassword) {
      wx.showToast({ title: '两次密码不一致', icon: 'none' });
      return;
    }
    
    wx.showLoading({ title: '保存中...' });
    
    wx.request({
      url: 'http://192.168.50.250:3000/api/users/' + userInfo.id,
      method: 'PUT',
      data: { 
        password: newPassword,
        oldPassword: oldPassword
      },
      success: (res) => {
        wx.hideLoading();
        if (res.data.success) {
          wx.showToast({ title: '密码修改成功', icon: 'success' });
          this.closeEditPasswordModal();
        } else {
          wx.showToast({ title: res.data.message || '修改失败', icon: 'none' });
        }
      },
      fail: (error) => {
        wx.hideLoading();
        console.error('修改密码失败:', error);
        wx.showToast({ title: '网络请求失败', icon: 'none' });
      }
    });
  },
  
  // 保存手机号
  savePhone() {
    const { newPhone, password, userInfo } = this.data;
    
    if (!newPhone) {
      wx.showToast({ title: '请输入手机号', icon: 'none' });
      return;
    }
    
    if (!/^1[3-9]\d{9}$/.test(newPhone)) {
      wx.showToast({ title: '手机号格式不正确', icon: 'none' });
      return;
    }
    
    if (!password) {
      wx.showToast({ title: '请输入密码验证', icon: 'none' });
      return;
    }
    
    wx.showLoading({ title: '保存中...' });
    
    wx.request({
      url: 'http://192.168.50.250:3000/api/users/' + userInfo.id,
      method: 'PUT',
      data: { 
        phone: newPhone,
        password: password
      },
      success: (res) => {
        wx.hideLoading();
        if (res.data.success) {
          // 更新本地存储的用户信息
          const updatedUserInfo = { ...userInfo, phone: newPhone };
          wx.setStorageSync('userInfo', updatedUserInfo);
          this.setData({ userInfo: updatedUserInfo });
          wx.showToast({ title: '手机号修改成功', icon: 'success' });
          this.closeEditPhoneModal();
        } else {
          wx.showToast({ title: res.data.message || '修改失败', icon: 'none' });
        }
      },
      fail: (error) => {
        wx.hideLoading();
        console.error('修改手机号失败:', error);
        wx.showToast({ title: '网络请求失败', icon: 'none' });
      }
    });
  }
});