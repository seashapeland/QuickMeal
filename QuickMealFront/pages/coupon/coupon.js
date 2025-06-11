const config = require('../../utils/config.js');

Page({
  data: {
    filterOptions: [
      { label: '全部', value: 'all' },
      { label: '可用', value: 'valid' },
      { label: '已过期', value: 'expired' }
    ],
    selectedFilter: 'all',
    coupons: [], // 原始完整数据
    filteredCoupons: [],
    isRefreshing: false
  },

  onLoad() {
    const userId = wx.getStorageSync('user_id');
    if (userId) {
      this.getUserCoupons(userId);
    } else {
      wx.showToast({
        title: '未登录',
        icon: 'error'
      });
    }
  },

  // 获取优惠券列表
  getUserCoupons(userId) {
    const that = this;
    wx.request({
      url: `${config.BASE_URL}/coupon/user/${userId}/`,
      method: 'GET',
      success(res) {
        if (res.statusCode === 200 && res.data.coupons) {
          const processed = that.processCouponData(res.data.coupons);
          that.setData({
            coupons: processed,
            filteredCoupons: processed
          });
        } else {
          wx.showToast({
            title: '获取失败',
            icon: 'error'
          });
        }
      },
      fail(err) {
        console.error('获取优惠券失败:', err);
        wx.showToast({
          title: '网络错误',
          icon: 'error'
        });
      },
      complete() {
        that.setData({ isRefreshing: false });
      }
    });
  },

  // 处理原始数据，注入额外字段
  processCouponData(rawData) {
    const now = new Date();
    return rawData.map(item => {
      const validToDate = new Date(item.valid_to);
      return {
        ...item,
        expired: validToDate < now,
        weekdaysText: this.formatWeekdays(item.weekdays),
        validRangeText: `${this.formatDate(item.valid_from)} 至 ${this.formatDate(item.valid_to)}`,
        isWeekdayLimited: !!item.weekdays
      };
    });
  },

  // 判断是否过期（供模板使用）
  isExpired(validTo) {
    return new Date(validTo) < new Date();
  },

  // 格式化日期为 "6月10日"
  formatDate(dateStr) {
    const date = new Date(dateStr);
    return `${date.getMonth() + 1}月${date.getDate()}日`;
  },

  // 将 weekday 字符串转换为“周几”列表
  formatWeekdays(weekdays) {
    if (!weekdays) return '不限';
    const daysMap = {
      '1': '周一',
      '2': '周二',
      '3': '周三',
      '4': '周四',
      '5': '周五',
      '6': '周六',
      '7': '周日'
    };
    return weekdays.split(',').map(d => daysMap[d]).join('、');
  },

  // 顶部筛选切换逻辑
  changeFilter(e) {
    const value = e.currentTarget.dataset.value;
    const all = this.data.coupons;
    let filtered = [];

    if (value === 'valid') {
      filtered = all.filter(c => !c.expired && c.status !== 'used');
    } else if (value === 'expired') {
      filtered = all.filter(c => c.expired);
    } else {
      filtered = all;
    }

    this.setData({
      selectedFilter: value,
      filteredCoupons: filtered
    });
  },

  // 下拉刷新逻辑
  onRefresh() {
    this.setData({ isRefreshing: true });
    const userId = wx.getStorageSync('user_id');
    this.getUserCoupons(userId);
  },

  goBack() {
    wx.navigateBack();
  },

  onPulling() {},
  onAbort() {
    this.setData({ isRefreshing: false });
  },
  onRestore() {}
});
