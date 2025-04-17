// pages/order/order.js
Page({
  data: {
    currentTab: 0,
    tabs: ['全部', '待支付', '已完成', '退款'],
    orders: [
      { id: '001', time: '2024-04-16 14:22', table: '1号桌', status: '已完成', total: 56.00 },
      { id: '002', time: '2024-04-17 10:12', table: '3号桌', status: '待支付', total: 88.00 },
      { id: '003', time: '2024-04-18 18:09', table: '2号桌', status: '已完成', total: 42.00 },
      { id: '004', time: '2024-04-18 18:09', table: '2号桌', status: '已完成', total: 42.00 },
      { id: '005', time: '2024-04-18 18:09', table: '2号桌', status: '已完成', total: 42.00 },
      { id: '006', time: '2024-04-18 18:09', table: '2号桌', status: '已完成', total: 42.00 },
      { id: '007', time: '2024-04-18 18:09', table: '2号桌', status: '已完成', total: 42.00 },
      { id: '008', time: '2024-04-18 18:09', table: '2号桌', status: '已完成', total: 42.00 },
    ],
    filteredOrders: [], // 显示的订单列表
    isRefreshing: false
  },

  onLoad() {
    this.updateFilteredOrders(); // 页面加载时初始化
  },

  onShow() {
    this.setData({
      currentTab: 0
    });
    console.log("Tab" + this.data.currentTab);
    this.updateFilteredOrders();
  },

  switchTab(e) {
    const index = e.currentTarget.dataset.index;
    this.setData({
      currentTab: index
    }, () => {
      this.updateFilteredOrders(); // 切换 tab 后更新列表
    });
  },

  updateFilteredOrders() {
    const statusMap = ['全部', '待支付', '已完成', '退款'];
    const current = statusMap[this.data.currentTab];

    if (current === '全部') {
      this.setData({
        filteredOrders: this.data.orders
      });
    } else {
      const filtered = this.data.orders.filter(o => o.status === current);
      this.setData({
        filteredOrders: filtered
      });
    }
  },

  // ✅ 下拉刷新触发时
  onRefresh() {
    console.log("触发下拉刷新");

    this.setData({ isRefreshing: true });

    // 模拟请求
    setTimeout(() => {
      this.updateFilteredOrders(); // 刷新数据
      this.setData({ isRefreshing: false }); // 停止刷新
    }, 1000);
  },

  onPulling(e) {
    // 可选：下拉过程中触发
    // console.log('下拉中：', e.detail);
  },

  onAbort() {
    // 用户中断下拉
    this.setData({ isRefreshing: false });
  },

  onRestore() {
    // 可选：恢复原状
  },


  goToDetail(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/orderDetail/orderDetail?id=${id}`
    });
  }
});
