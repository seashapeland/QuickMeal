Page({
  data: {
    filterOptions: [
      { label: '全部', value: 'all' },
      { label: '可用', value: 'valid' },
      { label: '已过期', value: 'expired' }
    ],
    selectedFilter: 'all',
    coupons: [],
    filteredCoupons: [],
    orderTotal: 0  // 新增：从订单页面传递过来的总金额
  },

  onLoad(options) {
    const now = Date.now();
    // 新增：从订单页面接收总金额
    const orderTotal = parseFloat(options.total) || 0;
    
    const rawCoupons = [
      {
        id: 'c1',
        name: '满50减10元',
        discount: 10,
        description: '单笔消费满50元使用',
        condition: 50,
        expiry: '2025-06-30'
      },
      {
        id: 'c2',
        name: '新用户立减5元',
        discount: 5,
        description: '注册后7天内可用',
        condition: 0,
        expiry: '2024-12-31'
      },
      {
        id: 'c3',
        name: '周末8元优惠',
        discount: 8,
        description: '每周六日可使用',
        condition: 100,
        expiry: '2025-05-01'
      }
    ];

    const coupons = rawCoupons.map(c => ({
      ...c,
      expired: new Date(c.expiry).getTime() < now,
      // 新增：是否满足使用条件
      conditionMet: orderTotal >= c.condition
    }));

    this.setData({
      coupons,
      filteredCoupons: coupons,
      orderTotal
    });
  },

  goBack() {
    wx.navigateBack();
  },

  // 修改：使用优惠券并返回订单页面
  useCoupon(e) {
    const id = e.currentTarget.dataset.id;
    const coupon = this.data.coupons.find(c => c.id === id);
    
    if (!coupon || coupon.expired || !coupon.conditionMet) return;

    // 获取当前页面栈
    const pages = getCurrentPages();
    // 获取上一个页面（订单详情页）
    const prevPage = pages[pages.length - 2];
    
    if (prevPage) {
      // 调用订单页面的方法设置优惠券
      prevPage.setSelectedCoupon(coupon);
    }
    
    // 返回订单页面
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

  claimCoupon(e) {
    const id = e.currentTarget.dataset.id;
    wx.showToast({
      title: `领取成功（ID: ${id}）`,
      icon: 'success'
    });
  },

  changeFilter(e) {
    const value = e.currentTarget.dataset.value;
    const { coupons } = this.data;
    let filtered = [];

    if (value === 'valid') {
      filtered = coupons.filter(c => !c.expired && c.conditionMet);
    } else if (value === 'expired') {
      filtered = coupons.filter(c => c.expired);
    } else {
      filtered = coupons;
    }

    this.setData({
      selectedFilter: value,
      filteredCoupons: filtered
    });
  }
});