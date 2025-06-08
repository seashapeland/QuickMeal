// pages/order/order.js
const config = require('../../utils/config.js');
Page({
  data: {
    currentTab: 0,
    tabs: ['全部', '进行中', '已完成', '退款'],
    orders: [],
    filteredOrders: [],
    isRefreshing: false
  },

  onLoad() {
    this.fetchOrders();
  },

  onShow() {
    const token = wx.getStorageSync('token');
    if (!token) {
      wx.showToast({
        title: '请先登录',
        icon: 'none',
        duration: 1500
      });
  
      
      return; // 阻止后续执行
    }
  
    // 如果已登录，则继续正常流程
    this.setData({
      currentTab: 0
    });
    this.fetchOrders();
  },

  switchTab(e) {
    const index = e.currentTarget.dataset.index;
    this.setData({
      currentTab: index
    }, () => {
      this.updateFilteredOrders();
    });
  },

  fetchOrders() {
    const token = wx.getStorageSync('token');
    if (!token) {
      wx.showToast({ title: '请先登录', icon: 'none' });
      return;
    }

    wx.request({
      url: config.USER_ORDER_LIST_API,
      method: 'GET',
      header: {
        'Authorization': `Bearer ${token}`
      },
      success: res => {
        const orders = res.data.map(o => ({
          id: o.order_id,
          time: o.created_at,
          table: o.table_id,
          status: o.status,
          total: o.total_price
        }));
        this.setData({ orders }, () => {
          this.updateFilteredOrders();
        });
      },
      fail: () => {
        wx.showToast({ title: '订单获取失败', icon: 'none' });
      }
    });
  },

  updateFilteredOrders() {
    const tab = this.data.tabs[this.data.currentTab];
    let filtered = [];
    if (tab === '全部') {
      filtered = this.data.orders;
    } else if (tab === '进行中') {
      filtered = this.data.orders.filter(o => ['待餐中', '待支付'].includes(o.status));
    } else if (tab === '已完成') {
      filtered = this.data.orders.filter(o => ['已完成', '已取消'].includes(o.status));
    } else if (tab === '退款') {
      filtered = this.data.orders.filter(o => ['申请中', '已退款'].includes(o.status));
    }
    this.setData({ filteredOrders: filtered });
  },

  onRefresh() {
    this.setData({ isRefreshing: true });
    this.fetchOrders();
    setTimeout(() => {
      this.setData({ isRefreshing: false });
    }, 100);
  },

  onPulling(e) {},
  onAbort() {
    this.setData({ isRefreshing: false });
  },
  onRestore() {},

  goToDetail(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({ url: `/pages/orderDetail/orderDetail?id=${id}` });
  }
});

