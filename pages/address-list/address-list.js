const API_BASE_URL = 'http://192.168.50.250:3000';

Page({
  data: {
    addresses: [],
    selectedAddressId: null,
    isSelectMode: false,
    userInfo: null
  },

  onLoad(options) {
    console.log('地址列表页面加载:', options);
    
    const userInfo = wx.getStorageSync('userInfo');
    this.setData({ userInfo });
    
    if (options.selectMode === 'true') {
      this.setData({ isSelectMode: true });
      wx.setNavigationBarTitle({ title: '选择地址' });
    }
  },

  onShow() {
    this.loadAddresses();
  },

  // 加载地址列表
  loadAddresses() {
    const { userInfo } = this.data;
    if (!userInfo) return;

    wx.showLoading({ title: '加载中...' });

    wx.request({
      url: `${API_BASE_URL}/api/addresses/${userInfo.id}`,
      method: 'GET',
      success: (res) => {
        wx.hideLoading();
        const addresses = res.data || [];
        this.setData({ addresses });
        
        // 如果是选择模式且有默认地址，自动选中
        if (this.data.isSelectMode && addresses.length > 0) {
          const defaultAddress = addresses.find(a => a.is_default == 1);
          if (defaultAddress) {
            this.setData({ selectedAddressId: defaultAddress.id });
          }
        }
      },
      fail: (error) => {
        wx.hideLoading();
        console.error('加载地址列表失败:', error);
      }
    });
  },

  // 返回
  onBack() {
    wx.navigateBack();
  },

  // 选择地址
  onSelectAddress(e) {
    const address = e.currentTarget.dataset.address;
    
    if (this.data.isSelectMode) {
      // 如果是选择模式，返回选中的地址
      const pages = getCurrentPages();
      const prevPage = pages[pages.length - 2];
      
      if (prevPage && prevPage.setSelectedAddress) {
        prevPage.setSelectedAddress(address);
      }
      
      wx.navigateBack();
    }
  },

  // 新增地址
  onAddAddress() {
    const url = this.data.isSelectMode 
      ? '/pages/address-edit/address-edit?fromCheckout=true'
      : '/pages/address-edit/address-edit';
    wx.navigateTo({ url: url });
  },

  // 编辑地址
  onEditAddress(e) {
    const id = e.currentTarget.dataset.id;
    const url = this.data.isSelectMode 
      ? `/pages/address-edit/address-edit?addressId=${id}&fromCheckout=true`
      : `/pages/address-edit/address-edit?addressId=${id}`;
    wx.navigateTo({ url: url });
  },

  // 删除地址
  onDeleteAddress(e) {
    const id = e.currentTarget.dataset.id;
    
    wx.showModal({
      title: '提示',
      content: '确定要删除这个地址吗？',
      success: (res) => {
        if (res.confirm) {
          this.doDeleteAddress(id);
        }
      }
    });
  },

  // 执行删除
  doDeleteAddress(id) {
    wx.showLoading({ title: '删除中...' });

    wx.request({
      url: `${API_BASE_URL}/api/addresses/${id}`,
      method: 'DELETE',
      success: (res) => {
        wx.hideLoading();
        if (res.data.success) {
          wx.showToast({
            title: '删除成功',
            icon: 'success'
          });
          this.loadAddresses();
        } else {
          wx.showToast({
            title: res.data.message || '删除失败',
            icon: 'none'
          });
        }
      },
      fail: (error) => {
        wx.hideLoading();
        console.error('删除地址失败:', error);
        wx.showToast({
          title: '删除失败',
          icon: 'none'
        });
      }
    });
  },

  // 阻止事件冒泡
  stopPropagation() {
    // 空方法，用于阻止事件冒泡
  }
})