const config = require('../../utils/config');
Page({
  data: {
    isRefreshing: false,
    dish: {},
    isFavorite: false, // 默认未收藏
    averageScore: 0,
    reviews: []
  },
  onLoad: function(options) {
    const dishStr = options.dish;
    const dish = JSON.parse(decodeURIComponent(dishStr));
    this.setData({ dish });
    this.getReviews();  // 🔁 获取评价
    this.checkFavoriteStatus();
  },

  checkFavoriteStatus() {
    const user_id = wx.getStorageSync('user_id');
    const { dish } = this.data;

    if (!user_id) {
      this.setData({ isFavorite: false });
      return;
    }

    wx.request({
      url: `${config.FAVORITE_STATUS_API}`,
      method: 'GET',
      data: {
        user_id,
        target_id: dish.id,
        target_type: 'package'
      },
      success: (res) => {
        if (res.statusCode === 200) {
          this.setData({ isFavorite: res.data.is_favorited });
        }
      }
    });
  },

  getReviews() {
    const { dish } = this.data;
    const isPackage = Array.isArray(dish.items); // ✅ 判断是否是套餐
    const reviewApi = isPackage
      ? `${config.PACKAGE_REVIEW_LIST_API}${dish.id}/list/`
      : `${config.DISH_REVIEW_LIST_API}${dish.id}/list/`;
  
    wx.request({
      url: reviewApi,
      method: 'GET',
      success: (res) => {
        if (res.statusCode === 200 && res.data.data) {
          const BASE_URL = config.BASE_URL; // 建议放 config.js 中
          const reviews = res.data.data.map(r => ({
            ...r,
            avatar: r.avatar?.startsWith('http') ? r.avatar : `${BASE_URL}${r.avatar}`
          }));

          this.setData({ reviews });
  
          // 平均分（保留一位小数字符串）
          const scores = reviews.map(r => r.rating || 0);
          if (scores.length) {
            const avg = (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1);
            this.setData({ averageScore: avg });
          }
        } else {
          console.warn('获取评价失败');
        }
      },
      fail: () => {
        console.error('评价请求失败');
      }
    });
  },
  
  isLast(index, length) {
    return index === length - 1;
  },
  goBack: function() {
    wx.navigateBack();
  },
  goToRate: function() {
    const dishStr = encodeURIComponent(JSON.stringify(this.data.dish));
    wx.navigateTo({
      url: `/pages/rate/rate?dish=${dishStr}`
    });
  },
  toggleFavorite: function () {
    const user_id = wx.getStorageSync('user_id');
    const { dish, isFavorite } = this.data;

    if (!user_id) {
      wx.showToast({ title: '未登录，无法收藏', icon: 'none' });
      return;
    }

    wx.showLoading({
      title: isFavorite ? '取消收藏中...' : '收藏中...',
      mask: true
    });

    wx.request({
      url: config.FAVORITE_TOGGLE_API,
      method: 'POST',
      header: { 'content-type': 'application/json' },
      data: {
        user_id,
        target_id: dish.id,
        target_type: 'package'
      },
      success: (res) => {
        wx.hideLoading();
        if (res.statusCode === 200 || res.statusCode === 201) {
          const msg = res.data.message || (isFavorite ? '已取消收藏' : '已收藏');
          wx.showToast({ title: msg, icon: 'success' });
          this.setData({ isFavorite: !isFavorite });
        } else {
          wx.showToast({ title: res.data.message || '操作失败', icon: 'none' });
        }
      },
      fail: () => {
        wx.hideLoading();
        wx.showToast({ title: '请求失败', icon: 'none' });
      }
    });
  },
  onPulling(e) {
    // 可选处理拖动状态
  },
  onRefresh() {
    this.setData({ isRefreshing: true });
    Promise.all([
      this.checkFavoriteStatus(),
      this.getReviews(),
      console.log('刷新成功')
    ]).finally(() => {
      this.setData({ isRefreshing: false }); // ⭐️ 必须重置！
    });
  },
  onRestore() {
    console.log('恢复状态');
  },
  onAbort() {
    console.log('用户中止刷新');
  },
  
});