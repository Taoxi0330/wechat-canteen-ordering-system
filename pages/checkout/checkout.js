const API_BASE_URL = 'http://192.168.50.250:3000';
const app = getApp();

Page({
  data: {
    orderType: 'eatIn',
    cartItems: [],
    totalPrice: 0,
    totalPriceFormatted: '0.00',
    totalQuantity: 0,
    remark: '',
    selectedAddress: null,
    addresses: [],
    userInfo: null,
    pageReady: false,
    reservationTime: '',
    reservationDateTime: null
  },

  onLoad() {
    console.log('结算页面加载');
    this.loadCartData();
    this.loadUserInfo();
    
    // 延迟标记页面准备好，防止底部栏提前弹出
    setTimeout(() => {
      this.setData({ pageReady: true });
    }, 500);
  },

  // 加载用户信息
  loadUserInfo() {
    const userInfo = wx.getStorageSync('userInfo');
    this.setData({ userInfo });
    
    if (userInfo) {
      this.loadAddresses();
    }
  },

  // 加载地址列表
  loadAddresses() {
    const { userInfo } = this.data;
    if (!userInfo) return;

    wx.request({
      url: `${API_BASE_URL}/api/addresses/${userInfo.id}`,
      method: 'GET',
      success: (res) => {
        const addresses = res.data || [];
        this.setData({ addresses });
        
        // 自动选择默认地址
        const defaultAddress = addresses.find(a => a.is_default == 1);
        if (defaultAddress) {
          this.setData({ selectedAddress: defaultAddress });
        }
      },
      fail: (error) => {
        console.error('加载地址列表失败:', error);
      }
    });
  },

  // 刷新地址列表（从地址编辑页面返回时调用）
  refreshAddressList() {
    this.loadAddresses();
  },

  // 设置选中的地址（从地址列表页面返回时调用）
  setSelectedAddress(address) {
    this.setData({ selectedAddress: address });
  },

  // 加载购物车数据
  loadCartData() {
    const cartItems = app.globalData.cart || [];
    let totalPrice = 0;
    let totalQuantity = 0;

    // 为每个购物车项添加subtotalFormatted
    const processedCartItems = cartItems.map(item => {
      const subtotal = item.price * item.quantity;
      totalPrice += subtotal;
      totalQuantity += item.quantity;
      return {
        ...item,
        subtotalFormatted: subtotal.toFixed(2)
      };
    });

    this.setData({
      cartItems: processedCartItems,
      totalPrice: totalPrice,
      totalPriceFormatted: totalPrice.toFixed(2),
      totalQuantity: totalQuantity
    });

    console.log('结算数据:', {
      cartItems: processedCartItems,
      totalPrice,
      totalQuantity
    });
  },

  // 订单类型切换
  onTypeChange(e) {
    const type = e.currentTarget.dataset.type;
    this.setData({
      orderType: type
    });
    console.log('选择订单类型:', type);
  },

  // 选择地址
  onSelectAddress() {
    wx.navigateTo({
      url: '/pages/address-list/address-list?selectMode=true'
    });
  },

  // 备注输入
  onRemarkInput(e) {
    this.setData({
      remark: e.detail.value
    });
  },

  // 选择预约时间
  onSelectReservationTime: function() {
    console.log('触发预约时间选择');
    
    // 获取当前时间
    var now = new Date();
    var currentHour = now.getHours();
    var currentMinute = now.getMinutes();
    
    // 计算下一个10分钟的时间
    var next10Minute = Math.ceil(currentMinute / 10) * 10;
    var startHour = next10Minute >= 60 ? currentHour + 1 : currentHour;
    var startMinute = next10Minute >= 60 ? 0 : next10Minute;
    
    // 生成未来1小时的时间选项（每10分钟一个，最多6个）
    var timeOptions = [];
    for (var i = 0; i < 6; i++) { // 最多6个选项
      var targetHour = startHour + Math.floor((startMinute + i * 10) / 60);
      var targetMinute = (startMinute + i * 10) % 60;
      
      // 检查是否超过营业时间（假设营业到23:00）
      if (targetHour >= 23) {
        break;
      }
      
      var timeStr = (targetHour < 10 ? '0' : '') + targetHour + ':' + (targetMinute < 10 ? '0' : '') + targetMinute;
      timeOptions.push(timeStr);
    }
    
    console.log('时间选项:', timeOptions);
    
    // 如果没有可用的时间选项，提示用户
    if (timeOptions.length === 0) {
      wx.showToast({
        title: '当前时间无法预约',
        icon: 'none'
      });
      return;
    }
    
    var that = this;
    
    // 显示时间选择
    wx.showActionSheet({
      itemList: timeOptions,
      success: function(res) {
        var selectedTime = timeOptions[res.tapIndex];
        var today = new Date();
        var year = today.getFullYear();
        var month = (today.getMonth() + 1 < 10 ? '0' : '') + (today.getMonth() + 1);
        var day = (today.getDate() < 10 ? '0' : '') + today.getDate();
        var formattedTime = year + '-' + month + '-' + day + ' ' + selectedTime;
        
        console.log('选择的时间:', formattedTime);
        
        // 计算选择的时间戳
        var [hour, minute] = selectedTime.split(':').map(Number);
        var selectedDateTime = new Date(year, today.getMonth(), day, hour, minute);
        
        that.setData({
          reservationTime: formattedTime,
          reservationDateTime: selectedDateTime
        });
        
        wx.showToast({
          title: '预约时间已设置',
          icon: 'success'
        });
      },
      fail: function(err) {
        console.log('用户取消选择', err);
      }
    });
  },
  
  // 测试点击事件
  testClick() {
    console.log('测试点击事件触发');
    wx.showToast({
      title: '点击成功',
      icon: 'success'
    });
  },

  // 点击支付
  onPay() {
    const { cartItems, orderType, remark, totalPrice, selectedAddress, reservationDateTime, reservationTime } = this.data;

    if (cartItems.length === 0) {
      wx.showToast({
        title: '购物车为空',
        icon: 'none'
      });
      return;
    }

    // 如果是外卖，检查是否选择了地址
    if (orderType === 'takeaway' && !selectedAddress) {
      wx.showToast({
        title: '请选择配送地址',
        icon: 'none'
      });
      return;
    }

    wx.showLoading({ title: '创建订单中...' });

    // 从本地存储获取用户信息
    const userInfo = wx.getStorageSync('userInfo');
    const userId = userInfo ? userInfo.id : 1;

    // 准备订单数据
    const orderData = {
      user_id: userId,
      merchant_id: cartItems[0]?.merchantId || 1,
      total_price: totalPrice,
      items: cartItems.map(item => ({
        dish_id: item.dishId,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        specification: item.specification,
        spiciness: item.spiciness
      })),
      order_type: orderType,
      remark: remark,
      reservation_time: reservationDateTime ? reservationDateTime.toISOString().slice(0, 19).replace('T', ' ') : null
    };

    // 如果是外卖，添加地址信息到备注
    if (orderType === 'takeaway' && selectedAddress) {
      const addressRemark = `【配送地址】${selectedAddress.name} ${selectedAddress.phone} ${selectedAddress.address}`;
      orderData.remark = remark ? `${addressRemark}; ${remark}` : addressRemark;
    }

    // 添加预约时间到备注
    if (reservationTime) {
      const reservationRemark = `【${orderType === 'eatIn' ? '取餐' : '送达'}时间】${reservationTime}`;
      orderData.remark = orderData.remark ? `${orderData.remark}; ${reservationRemark}` : reservationRemark;
    }

    console.log('准备创建订单:', orderData);

    // 创建订单
    wx.request({
      url: `${API_BASE_URL}/api/orders`,
      method: 'POST',
      data: orderData,
      success: (res) => {
        wx.hideLoading();
        console.log('创建订单响应:', res.data);

        if (res.data.success) {
          // 获取取餐码
          const pickupCode = res.data.pickupCode;
          
          // 构建支付成功提示信息
          let successMessage = '支付成功';
          if (pickupCode) {
            successMessage += '\n取餐码：' + pickupCode;
          }
          if (remark) {
            successMessage += '\n备注：' + remark;
          }
          if (reservationTime) {
            successMessage += '\n' + (orderType === 'eatIn' ? '取餐' : '送达') + '时间：' + reservationTime;
          }
          
          wx.showToast({
            title: successMessage,
            icon: 'success',
            duration: 2000
          });

          // 清空购物车
          app.clearCart();

          // 延迟跳转到订单详情页面
          const orderId = res.data.orderId;
          setTimeout(() => {
            wx.redirectTo({
              url: `/pages/order-detail/order-detail?id=${orderId}`
            });
          }, 2000);
        } else {
          wx.showToast({
            title: res.data.message || '支付失败',
            icon: 'none'
          });
        }
      },
      fail: (error) => {
        wx.hideLoading();
        console.error('创建订单失败:', error);

        // 模拟支付成功（用于演示）
        // 生成模拟取餐码
        const mockPickupCode = Math.floor(1000 + Math.random() * 9000).toString();
        
        // 构建支付成功提示信息
        let successMessage = '支付成功（模拟）';
        successMessage += '\n取餐码：' + mockPickupCode;
        if (remark) {
          successMessage += '\n备注：' + remark;
        }
        if (reservationTime) {
          successMessage += '\n' + (orderType === 'eatIn' ? '取餐' : '送达') + '时间：' + reservationTime;
        }
        
        wx.showToast({
          title: successMessage,
          icon: 'success',
          duration: 2000
        });

        // 清空购物车
        app.clearCart();

        // 延迟跳转到订单详情页面（使用模拟订单ID）
        const mockOrderId = Date.now();
        setTimeout(() => {
          wx.redirectTo({
            url: `/pages/order-detail/order-detail?id=${mockOrderId}`
          });
        }, 2000);
      }
    });
  }
})
