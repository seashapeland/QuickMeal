Page({
  data: {
    filterOptions: [
      { label: '全部', value: 'all' },
      { label: '可用', value: 'valid' },
      { label: '已过期', value: 'expired' }
    ],
    selectedFilter: 'all',
    coupons: [],
    filteredCoupons: []
  },

  onLoad() {
    const now = Date.now();
    const rawCoupons = [
      {
        id: 1,
        title: '满50减10元',
        value: 10,
        description: '单笔消费满50元使用',
        limit: '满50元可用',
        expiry: '2025-06-30'
      },
      {
        id: 2,
        title: '新用户立减5元',
        value: 5,
        description: '注册后7天内可用',
        limit: '仅限新用户',
        expiry: '2024-12-31'
      },
      {
        id: 3,
        title: '周末8元优惠',
        value: 8,
        description: '每周六日可使用',
        limit: '仅限周末',
        expiry: '2025-05-01'
      }
    ];

    const coupons = rawCoupons.map(c => ({
      ...c,
      expired: new Date(c.expiry).getTime() < now
    }));

    this.setData({
      coupons,
      filteredCoupons: coupons
    });
  },

  goBack() {
    wx.navigateBack();
  },

  useCoupon(e) {
    const id = e.currentTarget.dataset.id;
    const coupon = this.data.coupons.find(c => c.id === id);
    if (!coupon || coupon.expired) return;

    wx.showToast({
      title: '优惠券使用成功',
      icon: 'success'
    });
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
      filtered = coupons.filter(c => !c.expired);
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