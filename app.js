// app.js
App({
  globalData: {
    // 全局购物车数据
    cart: [],
    cartTotalPrice: 0,
    cartTotalPriceFormatted: '0.00',
    cartTotalQuantity: 0,
    // 用户信息
    userId: null,
    userInfo: null
  },

  onLaunch() {
    console.log('小程序启动');
    // 在小程序启动时获取系统信息
    try {
      const res = wx.getSystemInfoSync();
      console.log('系统信息:', res);
      // 可以将屏幕信息保存到全局数据中
      this.globalData.screenHeight = res.screenHeight;
      this.globalData.screenWidth = res.screenWidth;
    } catch (error) {
      console.error('获取系统信息失败:', error);
    }
    // 初始化用户信息
    this.initUserInfo();
  },

  // 初始化用户信息
  initUserInfo() {
    try {
      const userInfo = wx.getStorageSync('userInfo');
      if (userInfo) {
        this.globalData.userInfo = userInfo;
        this.globalData.userId = userInfo.id;
        console.log('初始化用户信息成功:', userInfo);
      }
    } catch (error) {
      console.error('初始化用户信息失败:', error);
    }
  },

  // 更新用户信息
  updateUserInfo(userInfo) {
    if (userInfo) {
      this.globalData.userInfo = userInfo;
      this.globalData.userId = userInfo.id;
      try {
        wx.setStorageSync('userInfo', userInfo);
      } catch (error) {
        console.error('保存用户信息失败:', error);
      }
    }
  },

  // 清除用户信息
  clearUserInfo() {
    this.globalData.userInfo = null;
    this.globalData.userId = null;
    try {
      wx.removeStorageSync('userInfo');
    } catch (error) {
      console.error('清除用户信息失败:', error);
    }
  },

  // 生成购物车项唯一ID
  generateCartItemId(dishId, specification, spiciness) {
    return `${dishId}_${specification || 'default'}_${spiciness || 'default'}`;
  },

  // 更新购物车统计
  updateCartStats() {
    const cart = this.globalData.cart;
    let totalPrice = 0;
    let totalQuantity = 0;

    cart.forEach(item => {
      totalPrice += item.price * item.quantity;
      totalQuantity += item.quantity;
      // 直接在原对象上更新价格格式化
      item.priceFormatted = item.price.toFixed(2);
    });

    this.globalData.cartTotalPrice = totalPrice;
    this.globalData.cartTotalPriceFormatted = totalPrice.toFixed(2);
    this.globalData.cartTotalQuantity = totalQuantity;
  },

  // 添加商品到购物车
  addToCart(cartItem) {
    const existingCart = [...this.globalData.cart];
    const existingIndex = existingCart.findIndex(item => item.id === cartItem.id);

    if (existingIndex !== -1) {
      // 已有，增加数量
      existingCart[existingIndex].quantity += cartItem.quantity;
    } else {
      // 新增
      existingCart.push(cartItem);
    }

    this.globalData.cart = existingCart;
    this.updateCartStats();
  },

  // 增加购物车商品数量
  increaseCartItemQuantity(itemId) {
    const cart = [...this.globalData.cart];
    const index = cart.findIndex(item => item.id === itemId);

    if (index !== -1) {
      cart[index].quantity += 1;
      this.globalData.cart = cart;
      this.updateCartStats();
    }
  },

  // 减少购物车商品数量
  decreaseCartItemQuantity(itemId) {
    const cart = [...this.globalData.cart];
    const index = cart.findIndex(item => item.id === itemId);

    if (index !== -1) {
      if (cart[index].quantity > 1) {
        cart[index].quantity -= 1;
      } else {
        cart.splice(index, 1);
      }
      this.globalData.cart = cart;
      this.updateCartStats();
    }
  },

  // 删除购物车商品
  removeCartItem(itemId) {
    const cart = this.globalData.cart.filter(item => item.id !== itemId);
    this.globalData.cart = cart;
    this.updateCartStats();
  },

  // 清空购物车
  clearCart() {
    this.globalData.cart = [];
    this.updateCartStats();
  }
})
