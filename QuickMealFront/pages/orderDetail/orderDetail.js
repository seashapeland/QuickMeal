// pages/orderDetail/orderDetail.js
Page({
  data: {
    order: {
      id: '001',
      time: '2024-04-16 14:22',
      table: '1号桌',
      status: '已完成',
      total: 56.00,
      paymentMethod: '微信支付',
      remark: '不要放香菜',
      dishes: [
        { name: '红烧肉', price: 38.00, quantity: 1, total: 38.00 },
        { name: '清炒时蔬', price: 18.00, quantity: 1, total: 18.00 }
      ]
    }
  },

  onLoad(options) {
    // 实际开发中这里应该根据options.id获取订单详情
    console.log('订单ID:', options.id);
    // 模拟根据ID加载不同订单数据
    if (options.id === '002') {
      this.setData({
        order: {
          id: '002',
          time: '2024-04-17 10:12',
          table: '3号桌',
          status: '待支付',
          total: 88.00,
          paymentMethod: '未支付',
          remark: '',
          dishes: [
            { name: '水煮鱼', price: 68.00, quantity: 1, total: 68.00 },
            { name: '米饭', price: 2.00, quantity: 2, total: 4.00 },
            { name: '酸辣汤', price: 16.00, quantity: 1, total: 16.00 }
          ]
        }
      });
    }
  },

  // 支付订单
  payOrder() {
    wx.showLoading({ title: '支付中...' });
    setTimeout(() => {
      wx.hideLoading();
      wx.showToast({
        title: '支付成功',
        icon: 'success'
      });
      // 更新订单状态
      this.setData({
        'order.status': '已完成',
        'order.paymentMethod': '微信支付'
      });
    }, 1500);
  },

  // 联系服务员
  contactWaiter() {
    wx.makePhoneCall({
      phoneNumber: '13800138000'
    });
  },

  // 返回订单列表
  backToList() {
    wx.navigateBack();
  }
});