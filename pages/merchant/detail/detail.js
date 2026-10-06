const API_BASE_URL = 'http://192.168.50.250:3000';
const app = getApp();

// 商家详情页面逻辑
Page({
  // 页面数据
  data: {
    activeTab: 'order', // order: 点餐, comment: 评价
    activeCategory: '1', // 当前选中的分类
    merchant: {},
    currentTimestamp: new Date().getTime(), // 当前时间戳，用于避免图片缓存
    categories: [],
    dishes: [],
    isFavorite: false, // 是否收藏该商家
    reviews: [], // 评价列表
    averageRating: '0.0', // 平均评分
    // 弹窗相关
    showDishModal: false,
    selectedDish: null,
    selectedQuantity: 1,
    selectedSpiciness: '',
    selectedSpecification: '',
    totalPrice: '0.00',
    specificationsList: [],
    specPricesList: [],
    currentPrice: 0,
    currentPriceFormatted: '0.00',
    // 营养信息相关
    hasNutrition: false,
    hasNutritionChart: false,
    nutritionData: {},
    showNutritionModal: false,
    canvasWidth: 600, // canvas宽度，单位rpx
    canvasRatio: 0, // 屏幕像素比
    // 购物车相关
    showCart: false
  },
  
  // 页面加载
  onLoad(options) {
    console.log('商家详情页面加载', options);
    let merchantId;
    
    if (options.merchant) {
      const merchant = JSON.parse(decodeURIComponent(options.merchant));
      merchantId = merchant.id;
    } else if (options.id) {
      merchantId = options.id;
    }
    
    if (merchantId) {
      // 无论从哪里跳转，都重新从API获取最新的商家信息和菜品数据
      this.getMerchantInfo(merchantId);
      this.getDishes(merchantId);
      this.checkFavoriteStatus(merchantId);
    }
    
    // 获取系统信息，计算屏幕像素比
    const systemInfo = wx.getSystemInfoSync();
    const ratio = systemInfo.pixelRatio || 2;
    this.setData({
      canvasRatio: ratio
    });
  },

  // 获取商家信息
  getMerchantInfo(merchantId) {
    wx.request({
      url: `${API_BASE_URL}/api/merchants/${merchantId}`,
      method: 'GET',
      header: {
        'Cache-Control': 'no-cache'
      },
      success: (res) => {
        console.log('获取商家信息成功:', res.data);
        if (res.data) {
          const merchant = {
            ...res.data,
            image: res.data.image ? (API_BASE_URL + res.data.image) : ''
          };
          this.setData({
            merchant: merchant
          });
        }
      },
      fail: (error) => {
        console.error('获取商家信息失败:', error);
      }
    });
  },

  // 页面显示时刷新数据
  onShow() {
    console.log('商家详情页面显示');
    // 更新时间戳，避免图片缓存
    this.setData({
      currentTimestamp: new Date().getTime()
    });
    if (this.data.merchant && this.data.merchant.id) {
      // 强制刷新菜品列表
      this.getDishes(this.data.merchant.id);
    }
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
    console.log('=== syncCartFromGlobal ===');
    console.log('app.globalData:', app.globalData);
    
    const cart = app.globalData.cart || [];
    const cartTotalPrice = app.globalData.cartTotalPrice || 0;
    const cartTotalPriceFormatted = app.globalData.cartTotalPriceFormatted || '0.00';
    const cartTotalQuantity = app.globalData.cartTotalQuantity || 0;
    
    console.log('准备设置的数据:', {
      cart,
      cartTotalPrice,
      cartTotalPriceFormatted,
      cartTotalQuantity
    });
    
    this.setData({
      cart: cart,
      cartTotalPrice: cartTotalPrice,
      cartTotalPriceFormatted: cartTotalPriceFormatted,
      cartTotalQuantity: cartTotalQuantity
    });
  },

  // 获取菜品列表
  getDishes(merchantId) {
    wx.request({
      url: `${API_BASE_URL}/api/dishes/${merchantId}`,
      method: 'GET',
      timeout: 10000,
      header: {
        'Cache-Control': 'no-cache'
      },
      success: (res) => {
        console.log('获取菜品列表成功:', res.data);
        
        if (!res.data || res.data.length === 0) {
          console.log('商家暂无菜品');
          this.setData({
            categories: [
              { id: '1', name: '招牌菜品' },
              { id: '2', name: '推荐菜品' }
            ],
            dishes: []
          });
          return;
        }
        
        // 提取所有分类
        const categoriesSet = new Set();
        res.data.forEach(dish => {
          if (dish.category) {
            categoriesSet.add(dish.category);
          }
        });
        
        const categories = Array.from(categoriesSet).map((category, index) => ({
          id: (index + 1).toString(),
          name: category
        }));
        
        // 转换菜品数据格式
        const formattedDishes = res.data.map(dish => ({
          id: dish.id.toString(),
          name: dish.name,
          price: parseFloat(dish.price),
          priceFormatted: parseFloat(dish.price).toFixed(2),
          image: dish.image ? (API_BASE_URL + dish.image) : '', // 添加API_BASE_URL前缀
          category: dish.category,
          description: dish.description,
          spiciness: dish.spiciness,
          spec_prices: dish.spec_prices,
          nutrition: dish.nutrition
        }));
        
        console.log('处理后的分类:', categories);
        console.log('处理后的菜品:', formattedDishes);
        
        this.setData({
          categories: categories,
          dishes: formattedDishes
        });
      },
      fail: (error) => {
        console.error('获取菜品列表失败:', error);
      }
    });
  },

  // 获取评价列表
  loadReviews() {
    const merchantId = this.data.merchant.id;
    if (!merchantId) return;
    
    wx.request({
      url: `${API_BASE_URL}/api/reviews/merchant/${merchantId}`,
      method: 'GET',
      success: (res) => {
        const reviews = res.data || [];
        
        // 计算平均评分
        let averageRating = 0;
        if (reviews.length > 0) {
          const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
          averageRating = (totalRating / reviews.length).toFixed(1);
        }
        
        // 格式化时间和用户头像
        const formattedReviews = reviews.map(review => {
          let createdAt = review.created_at;
          if (createdAt) {
            const date = new Date(createdAt);
            createdAt = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
          }
          
          let replyAt = null;
          if (review.reply_at) {
            const date = new Date(review.reply_at);
            replyAt = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
          }
          
          let userAvatar = 'U';
          if (review.username && review.username.length > 0) {
            userAvatar = review.username.charAt(0);
          }
          
          return {
            ...review,
            created_at: createdAt,
            reply_at: replyAt,
            userAvatar: userAvatar
          };
        });
        
        this.setData({
          reviews: formattedReviews,
          averageRating: averageRating
        });
      },
      fail: (error) => {
        console.error('获取评价失败:', error);
      }
    });
  },

  // Tab切换
  onTabChange(e) {
    const tab = e.currentTarget.dataset.tab;
    this.setData({
      activeTab: tab
    });
    
    if (tab === 'comment') {
      this.loadReviews();
    }
  },

  // 分类切换
  onCategoryChange(e) {
    const categoryId = e.currentTarget.dataset.id;
    this.setData({
      activeCategory: categoryId
    });
  },

  // 检查收藏状态
  checkFavoriteStatus(merchantId) {
    // 获取当前用户信息
    const userInfo = wx.getStorageSync('userInfo');
    if (!userInfo) {
      this.setData({
        isFavorite: false
      });
      return;
    }
    
    const userId = userInfo.id;
    const favoriteKey = `favoriteList_${userId}`;
    
    // 优先从本地存储检查
    const favoriteList = wx.getStorageSync(favoriteKey) || [];
    const isLocalFavorite = favoriteList.some(item => item.id == merchantId);
    this.setData({
      isFavorite: isLocalFavorite
    });
    
    // 同时尝试从服务器检查最新状态
    wx.request({
      url: `${API_BASE_URL}/api/favorites/${userId}/${merchantId}`,
      method: 'GET',
      success: (res) => {
        if (res.data.success) {
          this.setData({
            isFavorite: res.data.isFavorite
          });
        }
      },
      fail: (error) => {
        console.error('检查收藏状态失败:', error);
        console.log('使用本地存储状态');
      }
    });
  },

  // 收藏按钮点击
  onFavoriteTap() {
    // 获取当前用户信息
    const userInfo = wx.getStorageSync('userInfo');
    if (!userInfo) {
      wx.showToast({
        title: '请先登录',
        icon: 'none'
      });
      return;
    }
    
    // 检查商家数据是否存在
    if (!this.data.merchant || !this.data.merchant.id) {
      wx.showToast({
        title: '商家信息加载中，请稍后重试',
        icon: 'none'
      });
      return;
    }
    
    const isFavorite = !this.data.isFavorite;
    const userId = userInfo.id;
    const merchantId = this.data.merchant.id;
    const merchant = this.data.merchant;
    
    console.log('收藏操作:', { userId, merchantId, isFavorite });
    
    // 先更新本地数据
    this.updateLocalFavorite(isFavorite, userId, merchant);
    
    if (isFavorite) {
      // 添加收藏 - 先尝试服务器，失败则使用本地
      this.addFavoriteServer(userId, merchantId, merchant);
    } else {
      // 取消收藏 - 先尝试服务器，失败则使用本地
      this.removeFavoriteServer(userId, merchantId);
    }
  },

  // 更新本地收藏
  updateLocalFavorite(isFavorite, userId, merchant) {
    this.setData({
      isFavorite: isFavorite
    });
    
    const favoriteKey = `favoriteList_${userId}`;
    let favoriteList = wx.getStorageSync(favoriteKey) || [];
    
    if (isFavorite) {
      // 添加收藏到本地
      const exists = favoriteList.some(item => item.id === merchant.id);
      if (!exists) {
        favoriteList.push(merchant);
      }
    } else {
      // 从本地移除收藏
      favoriteList = favoriteList.filter(item => item.id !== merchant.id);
    }
    
    wx.setStorageSync(favoriteKey, favoriteList);
    
    wx.showToast({
      title: isFavorite ? '收藏成功' : '取消收藏',
      icon: 'success',
      duration: 2000
    });
  },

  // 添加收藏到服务器
  addFavoriteServer(userId, merchantId, merchant) {
    wx.request({
      url: `${API_BASE_URL}/api/favorites`,
      method: 'POST',
      data: {
        userId: userId,
        merchantId: merchantId
      },
      success: (res) => {
        console.log('添加收藏响应:', res.data);
        if (!res.data.success) {
          console.log('服务器收藏失败，使用本地存储');
        }
      },
      fail: (error) => {
        console.error('添加收藏失败:', error);
        console.log('使用本地存储作为备用');
      }
    });
  },

  // 从服务器取消收藏
  removeFavoriteServer(userId, merchantId) {
    wx.request({
      url: `${API_BASE_URL}/api/favorites/${userId}/${merchantId}`,
      method: 'DELETE',
      success: (res) => {
        console.log('取消收藏响应:', res.data);
        if (!res.data.success) {
          console.log('服务器取消收藏失败，使用本地存储');
        }
      },
      fail: (error) => {
        console.error('取消收藏失败:', error);
        console.log('使用本地存储作为备用');
      }
    });
  },

  // 获取当前选中规格的价格
  getCurrentPrice() {
    const dish = this.data.selectedDish;
    const spec = this.data.selectedSpecification;
    
    if (!dish) return 0;
    
    // 如果有规格价格列表，查找对应规格的价格
    if (this.data.specPricesList && this.data.specPricesList.length > 0 && spec) {
      const found = this.data.specPricesList.find(item => item.spec === spec);
      if (found && found.price) {
        return found.price;
      }
    }
    
    // 否则使用默认价格
    return dish.price;
  },

  // 计算总价
  calculateTotalPrice() {
    const price = this.getCurrentPrice();
    const total = price * this.data.selectedQuantity;
    return total.toFixed(2);
  },

  // 更新总价
  updateTotalPrice() {
    const currentPrice = this.getCurrentPrice();
    const total = this.calculateTotalPrice();
    this.setData({
      currentPrice: currentPrice,
      currentPriceFormatted: currentPrice.toFixed(2),
      totalPrice: total
    });
  },

  // 点击菜品
  onDishClick(e) {
    const dish = e.currentTarget.dataset.dish;
    let specificationsList = [];
    let specPricesList = [];
    
    // 解析规格价格
    if (dish.spec_prices) {
      try {
        specPricesList = typeof dish.spec_prices === 'string' 
          ? JSON.parse(dish.spec_prices) 
          : dish.spec_prices;
        
        // 处理对象格式的规格价格
        if (typeof specPricesList === 'object' && !Array.isArray(specPricesList)) {
          specificationsList = Object.keys(specPricesList);
          specPricesList = Object.entries(specPricesList).map(([spec, price]) => ({ spec, price }));
        } else if (Array.isArray(specPricesList)) {
          specificationsList = specPricesList.map(item => item.spec);
        }
      } catch (e) {
        console.error('解析规格价格失败:', e);
      }
    }
    
    // 解析营养信息
    let nutritionData = {};
    let hasNutrition = false;
    let hasNutritionChart = false;
    
    if (dish.nutrition) {
      try {
        nutritionData = typeof dish.nutrition === 'string' 
          ? JSON.parse(dish.nutrition) 
          : dish.nutrition;
        hasNutrition = Object.keys(nutritionData).length > 0;
        // 检查是否有主要营养成分用于图表
        hasNutritionChart = !!(nutritionData.protein || nutritionData.carbs || nutritionData.fat);
      } catch (e) {
        console.error('解析营养信息失败:', e);
      }
    }
    
    this.setData({
      showDishModal: true,
      selectedDish: dish,
      selectedQuantity: 1,
      selectedSpiciness: dish.spiciness || '不辣',
      selectedSpecification: specificationsList.length > 0 ? specificationsList[0] : '',
      specificationsList: specificationsList,
      specPricesList: specPricesList,
      nutritionData: nutritionData,
      hasNutrition: hasNutrition,
      hasNutritionChart: hasNutritionChart
    });
    
    this.updateTotalPrice();
  },
  
  // 打开营养信息弹窗
  openNutritionModal() {
    this.setData({
      showNutritionModal: true
    });
    
    // 获取系统信息，计算实际的canvas尺寸
    const systemInfo = wx.getSystemInfoSync();
    const windowWidth = systemInfo.windowWidth;
    const modalWidth = windowWidth * 0.88; // 弹窗宽度是屏幕宽度的88%
    const canvasPadding = 64; // 左右padding共64rpx，换算成px
    const canvasWidthRpx = modalWidth - (canvasPadding / 750 * windowWidth); // rpx转px
    
    this.setData({
      canvasWidth: canvasWidthRpx * (750 / windowWidth) // 转回rpx用于wxml
    });
    
    // 延迟渲染饼图
    setTimeout(() => {
      this.renderNutritionPieChart(this.data.nutritionData, canvasWidthRpx);
    }, 300);
  },
  
  // 关闭营养信息弹窗
  closeNutritionModal() {
    this.setData({
      showNutritionModal: false
    });
  },
  
  // 渲染营养分析饼图
  renderNutritionPieChart(nutritionData, actualCanvasWidth) {
    const ctx = wx.createCanvasContext('nutritionPieChart');
    const ratio = this.data.canvasRatio || 2;
    
    // 准备饼图数据
    const chartData = [];
    const chartLabels = [];
    const colors = [
      'rgba(54, 162, 235, 1)',      // 蛋白质 - 蓝色
      'rgba(255, 206, 86, 1)',      // 碳水 - 黄色
      'rgba(75, 192, 192, 1)',      // 脂肪 - 青色
      'rgba(153, 102, 255, 1)',     // 膳食纤维 - 紫色
      'rgba(255, 159, 64, 1)',      // 维生素 - 橙色
      'rgba(201, 203, 207, 1)'      // 矿物质 - 灰色
    ];
    
    if (nutritionData.protein) {
      chartData.push(nutritionData.protein);
      chartLabels.push('蛋白质');
    }
    if (nutritionData.carbs) {
      chartData.push(nutritionData.carbs);
      chartLabels.push('碳水');
    }
    if (nutritionData.fat) {
      chartData.push(nutritionData.fat);
      chartLabels.push('脂肪');
    }
    if (nutritionData.fiber) {
      chartData.push(nutritionData.fiber);
      chartLabels.push('膳食纤维');
    }
    
    if (chartData.length === 0) return;
    
    // 动态计算canvas尺寸
    const canvasWidth = actualCanvasWidth || 300;
    const canvasHeight = canvasWidth * 0.6; // 宽高比约为1.67:1
    const centerX = canvasWidth / 2;
    const centerY = canvasHeight * 0.4;
    const radius = Math.min(canvasWidth, canvasHeight) * 0.3;
    const innerRadius = radius * 0.6; // 环形图内半径
    
    // 清空画布
    const gradient = ctx.createLinearGradient(0, 0, 0, canvasHeight);
    gradient.addColorStop(0, '#ffffff');
    gradient.addColorStop(1, '#fafbff');
    ctx.setFillStyle(gradient);
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    
    // 计算总值
    const total = chartData.reduce((sum, value) => sum + value, 0);
    
    // 绘制饼图
    let startAngle = -Math.PI / 2; // 从12点钟方向开始
    
    // 先绘制阴影效果
    chartData.forEach((value, index) => {
      const sliceAngle = (value / total) * 2 * Math.PI;
      const endAngle = startAngle + sliceAngle;
      
      ctx.beginPath();
      ctx.moveTo(centerX, centerY + 3);
      ctx.arc(centerX, centerY + 3, radius, startAngle, endAngle);
      ctx.closePath();
      ctx.setFillStyle('rgba(0, 0, 0, 0.08)');
      ctx.fill();
      
      startAngle = endAngle;
    });
    
    // 重新设置起始角度
    startAngle = -Math.PI / 2;
    
    // 绘制主要的饼图
    chartData.forEach((value, index) => {
      const sliceAngle = (value / total) * 2 * Math.PI;
      const endAngle = startAngle + sliceAngle;
      
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, startAngle, endAngle);
      ctx.closePath();
      ctx.setFillStyle(colors[index % colors.length]);
      ctx.fill();
      
      // 绘制内圆形成环形
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, innerRadius, startAngle, endAngle);
      ctx.closePath();
      ctx.setFillStyle('#ffffff');
      ctx.fill();
      
      startAngle = endAngle;
    });
    
    // 绘制中心文字
    ctx.setFillStyle('#667eea');
    ctx.setFontSize(Math.max(12, canvasWidth * 0.04));
    ctx.setTextAlign('center');
    ctx.setTextBaseline('bottom');
    ctx.fillText('总营养', centerX, centerY);
    
    ctx.setFillStyle('#333');
    ctx.setFontSize(Math.max(16, canvasWidth * 0.055));
    ctx.setTextBaseline('top');
    ctx.fillText(`${total}g`, centerX, centerY + 4);
    
    // 绘制图例
    const legendStartY = canvasHeight * 0.72;
    const fontSize = Math.max(11, canvasWidth * 0.03);
    chartData.forEach((value, index) => {
      const x = canvasWidth * 0.08 + (index % 2) * (canvasWidth / 2);
      const y = legendStartY + Math.floor(index / 2) * (fontSize * 1.8);
      
      // 绘制图例方块
      ctx.setFillStyle(colors[index % colors.length]);
      ctx.beginPath();
      ctx.arc(x + fontSize * 0.4, y + fontSize * 0.4, fontSize * 0.35, 0, 2 * Math.PI);
      ctx.fill();
      
      // 绘制标签
      ctx.setFillStyle('#333');
      ctx.setFontSize(fontSize);
      ctx.setTextAlign('left');
      ctx.setTextBaseline('middle');
      const percentage = ((value / total) * 100).toFixed(1);
      ctx.fillText(chartLabels[index] + ': ' + value + 'g (' + percentage + '%)', x + fontSize, y + fontSize * 0.4);
    });
    
    ctx.draw();
  },

  // 关闭弹窗
  closeDishModal() {
    this.setData({
      showDishModal: false,
      selectedDish: null
    });
  },

  // 增加数量
  increaseQuantity() {
    const newQuantity = this.data.selectedQuantity + 1;
    this.setData({
      selectedQuantity: newQuantity
    });
    this.updateTotalPrice();
  },

  // 减少数量
  decreaseQuantity() {
    if (this.data.selectedQuantity > 1) {
      const newQuantity = this.data.selectedQuantity - 1;
      this.setData({
        selectedQuantity: newQuantity
      });
      this.updateTotalPrice();
    }
  },

  // 选择辣度
  onSpicinessChange(e) {
    const spiciness = e.currentTarget.dataset.value;
    this.setData({
      selectedSpiciness: spiciness
    });
  },

  // 选择规格
  onSpecificationChange(e) {
    const specification = e.currentTarget.dataset.value;
    this.setData({
      selectedSpecification: specification
    });
    this.updateTotalPrice();
  },

  // 添加到购物车（使用全局购物车）
  addToCart() {
    const dish = this.data.selectedDish;
    if (!dish) {
      return;
    }
    
    const specification = this.data.selectedSpecification;
    const spiciness = this.data.selectedSpiciness;
    const quantity = this.data.selectedQuantity;
    const price = this.getCurrentPrice();
    
    const cartItemId = app.generateCartItemId(dish.id, specification, spiciness);
    
    const cartItem = {
      id: cartItemId,
      dishId: dish.id,
      merchantId: this.data.merchant.id,
      merchantName: this.data.merchant.name,
      name: dish.name,
      image: dish.image,
      price: price,
      priceFormatted: price.toFixed(2),
      quantity: quantity,
      specification: specification,
      spiciness: spiciness
    };
    
    app.addToCart(cartItem);
    this.syncCartFromGlobal();
    
    wx.showToast({
      title: '已加入购物车',
      icon: 'success'
    });
    this.closeDishModal();
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
})
