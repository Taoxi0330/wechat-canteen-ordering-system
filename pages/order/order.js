// 点餐页面逻辑
const API_BASE_URL = 'http://192.168.50.250:3000';
const app = getApp();

Page({
  // 页面数据
  data: {
    // 加载状态
    loading: true,
    // 错误信息
    error: '',
    // 食堂列表
    canteens: [],
    // 商家数据，按食堂分类
    merchants: {},
    // 当前选中的食堂ID
    currentCanteen: '',
    // 当前显示的商家列表
    currentMerchants: [],
    // 购物车相关
    showCart: false,
    // 当前时间戳，用于避免图片缓存
    currentTimestamp: new Date().getTime()
  },
  
  // 页面加载时初始化
  onLoad() {
    console.log('=== order页面加载 ===');
    this.loadAllData();
  },

  // 页面显示时刷新数据
  onShow() {
    console.log('=== order页面显示 ===');
    // 更新时间戳，避免图片缓存
    this.setData({
      currentTimestamp: new Date().getTime()
    });
    // 每次页面显示都刷新数据
    this.loadAllData();
    this.syncCartFromGlobal();
    
    // 定期同步购物车数据
    this.cartSyncInterval = setInterval(() => {
      this.syncCartFromGlobal();
    }, 300);
  },

  // 页面隐藏时清除定时器
  onHide() {
    if (this.cartSyncInterval) {
      clearInterval(this.cartSyncInterval);
      this.cartSyncInterval = null;
    }
  },

  // 页面卸载时清除定时器
  onUnload() {
    if (this.cartSyncInterval) {
      clearInterval(this.cartSyncInterval);
      this.cartSyncInterval = null;
    }
  },

  // 从全局同步购物车数据
  syncCartFromGlobal() {
    this.setData({
      cart: app.globalData.cart || [],
      cartTotalPrice: app.globalData.cartTotalPrice || 0,
      cartTotalPriceFormatted: app.globalData.cartTotalPriceFormatted || '0.00',
      cartTotalQuantity: app.globalData.cartTotalQuantity || 0
    });
  },

  // 加载所有数据
  async loadAllData() {
    console.log('开始加载数据...');
    this.setData({
      loading: true,
      error: ''
    });
    
    try {
      // 先尝试加载食堂数据
      await this.getCanteens();
      // 再加载商家数据
      await this.getMerchants();
      // 最后加载菜品数据
      this.getDishesForMerchants(this.data.merchants);
      
      this.setData({
        loading: false
      });
      console.log('所有数据加载完成！');
    } catch (error) {
      console.error('数据加载失败:', error);
      this.setData({
        loading: false,
        error: '网络连接失败，请检查服务器是否启动'
      });
      // 使用默认数据
      this.useDefaultData();
    }
  },

  // 获取食堂列表
  getCanteens() {
    return new Promise((resolve, reject) => {
      console.log('请求食堂列表...');
      wx.request({
        url: `${API_BASE_URL}/api/canteens`,
        method: 'GET',
        timeout: 10000,
        success: (res) => {
          console.log('食堂列表响应:', res);
          if (res.statusCode === 200 && res.data) {
            const canteenList = res.data.map(canteen => ({
              id: String(canteen.id),
              name: canteen.name,
              description: canteen.description,
              image: canteen.image
            }));
            
            console.log('处理后的食堂列表:', canteenList);
            
            if (canteenList.length > 0) {
              this.setData({
                canteens: canteenList,
                currentCanteen: canteenList[0].id
              });
              console.log('设置当前食堂为:', canteenList[0].id);
              resolve();
            } else {
              console.warn('没有食堂数据，使用默认数据');
              this.useDefaultData();
              resolve();
            }
          } else {
            reject(new Error('服务器响应异常'));
          }
        },
        fail: (error) => {
          console.error('食堂列表请求失败:', error);
          reject(error);
        }
      });
    });
  },

  // 获取商家列表
  getMerchants() {
    return new Promise((resolve, reject) => {
      console.log('请求商家列表...');
      wx.request({
        url: `${API_BASE_URL}/api/merchants`,
        method: 'GET',
        timeout: 10000,
        success: (res) => {
          console.log('商家列表响应:', res);
          if (res.statusCode === 200 && res.data) {
            console.log('商家数据:', res.data);
            
            // 初始化按食堂分类的商家对象
            const merchantsByCanteen = {};
            this.data.canteens.forEach(canteen => {
              merchantsByCanteen[canteen.id] = [];
            });
            
            // 根据商家的canteen_id分配到对应的食堂
            res.data.forEach(merchant => {
              const canteenId = merchant.canteen_id ? String(merchant.canteen_id) : this.data.canteens[0]?.id || '1';
              console.log(`商家[${merchant.id}:${merchant.name}] -> 食堂[${canteenId}]`);
              
              if (!merchantsByCanteen[canteenId]) {
                merchantsByCanteen[canteenId] = [];
              }
              
              merchantsByCanteen[canteenId].push({
                ...merchant,
                id: String(merchant.id),
                image: merchant.image ? (API_BASE_URL + merchant.image) : '',
                dishes: []
              });
            });
            
            console.log('按食堂分类后的商家:', merchantsByCanteen);
            
            this.setData({
              merchants: merchantsByCanteen
            });
            
            // 更新当前商家列表
            this.updateMerchants();
            resolve();
          } else {
            reject(new Error('商家列表响应异常'));
          }
        },
        fail: (error) => {
          console.error('商家列表请求失败:', error);
          reject(error);
        }
      });
    });
  },

  // 获取每个商家的菜品
  getDishesForMerchants(merchantsByCanteen) {
    console.log('开始加载菜品数据...');
    const allMerchants = [];
    Object.values(merchantsByCanteen).forEach(merchants => {
      allMerchants.push(...merchants);
    });
    
    if (allMerchants.length === 0) {
      console.log('没有商家，跳过菜品加载');
      return;
    }
    
    let completedCount = 0;
    const totalCount = allMerchants.length;
    
    allMerchants.forEach(merchant => {
      wx.request({
        url: `${API_BASE_URL}/api/dishes/${merchant.id}`,
        method: 'GET',
        timeout: 5000,
        success: (res) => {
          if (res.statusCode === 200 && res.data) {
            console.log(`商家${merchant.id}菜品:`, res.data);
            // 更新商家的菜品数据
            const updatedMerchants = { ...this.data.merchants };
            Object.keys(updatedMerchants).forEach(canteenId => {
              updatedMerchants[canteenId] = updatedMerchants[canteenId].map(m => {
                if (m.id === merchant.id) {
                  return {
                    ...m,
                    dishes: res.data.map(dish => ({
                      ...dish,
                      id: String(dish.id),
                      price: parseFloat(dish.price),
                      image: dish.image ? (API_BASE_URL + dish.image) : ''
                    }))
                  };
                }
                return m;
              });
            });
            
            this.setData({
              merchants: updatedMerchants
            });
            
            // 更新当前显示的商家列表
            this.updateMerchants();
          }
        },
        fail: (error) => {
          console.warn(`商家${merchant.id}菜品加载失败:`, error.errMsg);
        },
        complete: () => {
          completedCount++;
          if (completedCount >= totalCount) {
            console.log('所有商家菜品加载完成');
          }
        }
      });
    });
  },

  // 使用默认数据
  useDefaultData() {
    console.log('使用默认数据');
    const defaultCanteens = [
      { id: '1', name: '一食堂' },
      { id: '2', name: '二食堂' },
      { id: '3', name: '三食堂' }
    ];
    
    const defaultMerchants = {
      '1': [
        {
          id: '101',
          name: '川菜窗口',
          description: '正宗川菜，麻辣鲜香',
          hours: '08:00-18:00',
          image: '/images/banner1.png',
          dishes: []
        }
      ],
      '2': [],
      '3': []
    };
    
    this.setData({
      canteens: defaultCanteens,
      merchants: defaultMerchants,
      currentCanteen: '1',
      currentMerchants: defaultMerchants['1']
    });
  },

  // 点击搜索框
  onSearchTap() {
    wx.showToast({
      title: '搜索菜品功能开发中',
      icon: 'none'
    });
  },
  
  // 切换食堂
  onCanteenChange(e) {
    const canteenId = e.currentTarget.dataset.id;
    console.log('切换食堂到:', canteenId);
    this.setData({
      currentCanteen: canteenId
    });
    this.updateMerchants();
  },
  
  // 更新当前商家列表
  updateMerchants() {
    const { merchants, currentCanteen } = this.data;
    const currentMerchants = merchants[currentCanteen] || [];
    console.log('更新商家列表 - 食堂:', currentCanteen, '商家数:', currentMerchants.length);
    this.setData({
      currentMerchants: currentMerchants
    });
  },
  
  // 点击商家
  onMerchantTap(e) {
    const merchant = e.currentTarget.dataset.merchant;
    console.log('点击商家:', merchant);
    
    // 跳转到商家详情页面
    wx.navigateTo({
      url: `/pages/merchant/detail/detail?merchant=${encodeURIComponent(JSON.stringify(merchant))}`
    });
  },

  // 重试加载
  onRetry() {
    console.log('用户点击重试');
    this.loadAllData();
  },

  // 增加购物车商品数量
  increaseCartItemQuantity(e) {
    const itemId = e.currentTarget.dataset.id;
    app.increaseCartItemQuantity(itemId);
    this.syncCartFromGlobal();
  },

  // 减少购物车商品数量
  decreaseCartItemQuantity(e) {
    const itemId = e.currentTarget.dataset.id;
    app.decreaseCartItemQuantity(itemId);
    this.syncCartFromGlobal();
  },

  // 删除购物车商品
  removeCartItem(e) {
    const itemId = e.currentTarget.dataset.id;
    app.removeCartItem(itemId);
    this.syncCartFromGlobal();
  },

  // 切换购物车显示
  toggleCart() {
    if (app.globalData.cart.length === 0) {
      wx.showToast({
        title: '购物车为空',
        icon: 'none'
      });
      return;
    }
    this.setData({
      showCart: !this.data.showCart
    });
  },

  // 清空购物车
  clearCart() {
    wx.showModal({
      title: '提示',
      content: '确定要清空购物车吗？',
      success: (res) => {
        if (res.confirm) {
          app.clearCart();
          this.syncCartFromGlobal();
          this.setData({
            showCart: false
          });
        }
      }
    });
  },

  // 去结算
  onCheckout() {
    console.log('点击去结算');
    
    if (app.globalData.cart.length === 0) {
      wx.showToast({
        title: '购物车为空',
        icon: 'none'
      });
      return;
    }
    
    wx.navigateTo({
      url: '/pages/checkout/checkout'
    });
  }
});
