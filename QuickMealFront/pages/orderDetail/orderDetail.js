const config = require('../../utils/config.js');

Page({
  data: {
    orderId: null,
    order: null,
    actualTotal: 0.0,
    selectedCoupon: null
  },

  onLoad(options) {
    const orderId = options.id;
    this.setData({ orderId });

    // 获取 token
    const token = wx.getStorageSync('token');
    if (!token) {
      wx.showToast({ title: '未登录', icon: 'none' });
      return;
    }

    // 调用后端接口获取订单详情
    wx.request({
      url: `${config.ORDER_DETAIL_API}${orderId}/`,
      method: 'GET',
      header: {
        'Authorization': `Bearer ${token}`
      },
      success: res => {
        const data = res.data;

        // 计算每个菜品/套餐的 total 字段
        const dishes = data.items.map(item => {
          const total = parseFloat((item.price * item.quantity).toFixed(2));
          if (item.type === 'package') {
            item.details = item.details.map(sub => ({
              ...sub,
              price: parseFloat(sub.price),
              quantity: parseInt(sub.quantity)
            }));
            return { ...item, total, showDetails: false };
          } else {
            return { ...item, total };
          }
        });

        const order = {
          id: data.order_id,
          status: data.status,
          table: data.table_id,
          time: data.created_at.slice(0, 19).replace('T', ' '),
          total: parseFloat(data.total_price),
          dishes
        };

        this.setData({
          order,
          actualTotal: parseFloat(data.total_price)
        });
      },
      fail: () => {
        wx.showToast({ title: '获取订单失败', icon: 'none' });
      }
    });
  },

  togglePackage(e) {
    const index = e.currentTarget.dataset.index;
    const dishes = this.data.order.dishes;

    if (dishes[index].type === 'package') {
      dishes[index].showDetails = !dishes[index].showDetails;
      this.setData({
        'order.dishes': dishes
      });
    }
  },

  setSelectedCoupon(coupon) {
    if (coupon) {
      this.setData({
        selectedCoupon: coupon,
        actualTotal: this.data.order.total - coupon.discount
      });
    } else {
      this.setData({
        selectedCoupon: null,
        actualTotal: this.data.order.total
      });
    }
  },

  payOrder() {
    const orderId = this.data.order.id;
    const tableId = this.data.order.table;
  
    wx.showLoading({ title: '支付中...' });
  
    // 第一步：修改订单状态为已完成
    wx.request({
      url: config.ORDER_UPDATE_STATUS_API,
      method: 'POST',
      data: {
        order_id: orderId,
        status: '已完成'
      },
      success: () => {
        // 第二步：修改餐桌状态为空闲
        wx.request({
          url: config.UPDATE_TABLE_STATUS_API,
          method: 'POST',
          data: {
            table_id: tableId,
            status: '空闲'
          },
          success: () => {
            // 第三步：解绑订单
            wx.request({
              url: config.UNBIND_ORDER_API,
              method: 'POST',
              data: {
                table_id: tableId
              },
              success: () => {
                wx.hideLoading();
                wx.showToast({ title: '支付成功', icon: 'success' });
                this.setData({
                  'order.status': '已完成'
                });
              },
              fail: () => {
                wx.hideLoading();
                wx.showToast({ title: '解绑失败', icon: 'none' });
              }
            });
          },
          fail: () => {
            wx.hideLoading();
            wx.showToast({ title: '餐桌状态修改失败', icon: 'none' });
          }
        });
      },
      fail: () => {
        wx.hideLoading();
        wx.showToast({ title: '支付失败', icon: 'none' });
      }
    });
  },
  
  requestRefund() {
    const orderId = this.data.order.id;
  
    wx.showLoading({ title: '提交中...' });
  
    wx.request({
      url: config.ORDER_UPDATE_STATUS_API,
      method: 'POST',
      data: {
        order_id: orderId,
        status: '申请中'
      },
      success: () => {
        wx.hideLoading();
        wx.showToast({ title: '退款申请已提交', icon: 'success' });
        this.setData({
          'order.status': '申请中'
        });
      },
      fail: () => {
        wx.hideLoading();
        wx.showToast({ title: '退款申请失败', icon: 'none' });
      }
    });
  },
  

  contactWaiter() {
    wx.makePhoneCall({
      phoneNumber: '13800138000'
    });
  },

  backToList() {
    wx.navigateBack();
  },

  selectCoupon() {
    wx.navigateTo({
      url: `/pages/select coupon/select coupon?total=${this.data.order.total}`
    });
  }
});
