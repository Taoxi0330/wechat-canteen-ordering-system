const API_BASE_URL = 'http://192.168.50.250:3000';

Page({
  data: {
    addressId: null,
    name: '',
    phone: '',
    address: '',
    isDefault: false,
    userInfo: null
  },

  onLoad(options) {
    console.log('地址编辑页面加载:', options);
    
    const userInfo = wx.getStorageSync('userInfo');
    this.setData({ userInfo });
    
    if (options.addressId) {
      this.loadAddressDetail(options.addressId);
    }
    
    if (options.fromCheckout) {
      this.setData({ fromCheckout: true });
    }
  },

  // 加载地址详情
  loadAddressDetail(addressId) {
    const userInfo = wx.getStorageSync('userInfo');
    if (!userInfo) return;

    wx.request({
      url: `${API_BASE_URL}/api/addresses/${userInfo.id}`,
      method: 'GET',
      success: (res) => {
        const addresses = res.data || [];
        const address = addresses.find(a => a.id == addressId);
        
        if (address) {
          this.setData({
            addressId: address.id,
            name: address.name,
            phone: address.phone,
            address: address.address,
            isDefault: address.is_default == 1
          });
        }
      },
      fail: (error) => {
        console.error('加载地址详情失败:', error);
      }
    });
  },

  // 返回
  onBack() {
    wx.navigateBack();
  },

  // 收货人输入
  onNameInput(e) {
    this.setData({ name: e.detail.value });
  },

  // 电话输入
  onPhoneInput(e) {
    this.setData({ phone: e.detail.value });
  },

  // 地址输入
  onAddressInput(e) {
    this.setData({ address: e.detail.value });
  },

  // 默认地址切换
  onDefaultChange(e) {
    this.setData({ isDefault: e.detail.value });
  },

  // 保存
  onSave() {
    const { addressId, name, phone, address, isDefault, userInfo } = this.data;

    if (!name) {
      wx.showToast({
        title: '请输入收货人姓名',
        icon: 'none'
      });
      return;
    }

    if (!phone) {
      wx.showToast({
        title: '请输入联系电话',
        icon: 'none'
      });
      return;
    }

    if (!/^1[3-9]\d{9}$/.test(phone)) {
      wx.showToast({
        title: '请输入正确的手机号',
        icon: 'none'
      });
      return;
    }

    if (!address) {
      wx.showToast({
        title: '请输入详细地址',
        icon: 'none'
      });
      return;
    }

    wx.showLoading({ title: '保存中...' });

    const addressData = {
      user_id: userInfo.id,
      name: name,
      phone: phone,
      address: address,
      is_default: isDefault ? 1 : 0
    };

    console.log('保存地址数据:', addressData);

    if (addressId) {
      // 更新地址
      wx.request({
        url: `${API_BASE_URL}/api/addresses/${addressId}`,
        method: 'PUT',
        data: addressData,
        success: (res) => {
          wx.hideLoading();
          if (res.data.success) {
            wx.showToast({
              title: '保存成功',
              icon: 'success'
            });
            setTimeout(() => {
              this.handleBackAfterSave();
            }, 800);
          } else {
            wx.showToast({
              title: res.data.message || '保存失败',
              icon: 'none'
            });
          }
        },
        fail: (error) => {
          wx.hideLoading();
          console.error('更新地址失败:', error);
          wx.showToast({
            title: '保存失败',
            icon: 'none'
          });
        }
      });
    } else {
      // 添加地址
      wx.request({
        url: `${API_BASE_URL}/api/addresses`,
        method: 'POST',
        data: addressData,
        success: (res) => {
          wx.hideLoading();
          if (res.data.success) {
            wx.showToast({
              title: '保存成功',
              icon: 'success'
            });
            setTimeout(() => {
              this.handleBackAfterSave();
            }, 800);
          } else {
            wx.showToast({
              title: res.data.message || '保存失败',
              icon: 'none'
            });
          }
        },
        fail: (error) => {
          wx.hideLoading();
          console.error('添加地址失败:', error);
          wx.showToast({
            title: '保存失败',
            icon: 'none'
          });
        }
      });
    }
  },

  // 保存后处理返回
  handleBackAfterSave() {
    const pages = getCurrentPages();
    const prevPage = pages[pages.length - 2];
    
    if (this.data.fromCheckout && prevPage && prevPage.route === 'pages/checkout/checkout') {
      // 如果是从结算页面来的，通知结算页面刷新
      if (prevPage.refreshAddressList) {
        prevPage.refreshAddressList();
      }
      wx.navigateBack();
    } else {
      wx.navigateBack();
    }
  }
})