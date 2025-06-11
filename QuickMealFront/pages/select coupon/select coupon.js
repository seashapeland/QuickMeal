const config = require('../../utils/config.js');

Page({
  data: {
    coupons: [],
    filteredCoupons: [],
    orderTotal: 0,
    isRefreshing: false
  },

  onLoad(options) {
    const orderTotal = parseFloat(options.total) || 0;
    const userId = wx.getStorageSync('user_id');

    if (!userId) {
      wx.showToast({ title: '未登录', icon: 'error' });
      return;
    }

    this.setData({ orderTotal });
    this.getUserCoupons(userId);
  },

  // 获取后端真实优惠券数据
  getUserCoupons(userId) {
    const that = this;
    wx.request({
      url: `${config.BASE_URL}/coupon/user/${userId}/`,
      method: 'GET',
      success(res) {
        if (res.statusCode === 200 && res.data.coupons) {
          const processed = that.processCoupons(res.data.coupons);
          that.setData({
            coupons: processed,
            filteredCoupons: processed
          });
        } else {
          wx.showToast({ title: '获取失败', icon: 'error' });
        }
      },
      fail(err) {
        console.error('获取优惠券失败:', err);
        wx.showToast({ title: '网络错误', icon: 'error' });
      },
      complete() {
        that.setData({ isRefreshing: false });
      }
    });
  },

  // 筛选优惠券逻辑
  processCoupons(rawData) {
    const now = new Date();
    const currentWeekday = now.getDay() || 7; // 周日为 0，转换为 7
  
    return rawData.map(item => {
      const validFrom = new Date(item.valid_from.replace(' ', 'T'));
      const validTo = new Date(item.valid_to.replace(' ', 'T'));
  
      const notStarted = now < validFrom;
      const expired = now > validTo;
  
      // 解析适用星期
      const weekdays = item.weekdays ? item.weekdays.split(',') : [];
      const isWeekdayOk = weekdays.length === 0 || weekdays.includes(currentWeekday.toString());
  
      const conditionMet = this.data.orderTotal >= item.min_amount;
  
      const isUsable =
        !notStarted &&
        !expired &&
        item.status === 'unused' &&
        isWeekdayOk &&
        conditionMet;
  
      return {
        ...item,
        expired,               // ✅ 显示标签用
        notStarted,            // ✅ 也可用于提示“尚未开始”
        conditionMet,
        isUsable,
        weekdaysText: this.formatWeekdays(item.weekdays),
        valid_from: item.valid_from,
        valid_to: item.valid_to
      };
    }).filter(c => c.isUsable); // ✅ 最终只保留“当前可用”的券
  },
  

  // 日期格式兼容 iOS
  formatDate(dateStr) {
    const date = new Date(dateStr.replace(' ', 'T'));
    return `${date.getMonth() + 1}月${date.getDate()}日`;
  },

  formatWeekdays(weekdays) {
    if (!weekdays) return '不限';
    const daysMap = {
      '1': '周一', '2': '周二', '3': '周三', '4': '周四',
      '5': '周五', '6': '周六', '7': '周日'
    };
    return weekdays.split(',').map(d => daysMap[d]).join('、');
  },

  // 使用优惠券并返回上页
  useCoupon(e) {
    const couponId = e.currentTarget.dataset.id;
    const coupon = this.data.filteredCoupons.find(c => c.id === couponId || c.user_coupon_id === couponId);

    if (!coupon || !coupon.isUsable) {
      wx.showToast({ title: '该优惠券不可使用', icon: 'none' });
      return;
    }

    const pages = getCurrentPages();
    const prevPage = pages[pages.length - 2];
    if (prevPage && typeof prevPage.setSelectedCoupon === 'function') {
      prevPage.setSelectedCoupon(coupon);
    }

    wx.navigateBack();
  },

  goBack() {
    wx.navigateBack();
  },
  // 新增：不使用优惠券
  useNoCoupon() {
    const pages = getCurrentPages();
    const prevPage = pages[pages.length - 2];
    
    if (prevPage) {
      prevPage.setSelectedCoupon(null);
    }
    
    wx.navigateBack();
  },

  onRefresh() {
    this.setData({ isRefreshing: true });
    const userId = wx.getStorageSync('user_id');
    this.getUserCoupons(userId);
  },

  onPulling() {},
  onAbort() {
    this.setData({ isRefreshing: false });
  },
  onRestore() {}
});
