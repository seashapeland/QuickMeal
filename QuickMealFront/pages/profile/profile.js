// pages/profile/profile.js
Page({
  data: {
    user: {
      name: '曲辰',
      phone: '138****5678',
      avatarUrl: '/images/avatar.jpg'
    },
    functions: [
      { icon: '/images/order.png', name: '我的订单' },
      { icon: '/images/favorite.png', name: '我的收藏' },
      { icon: '/images/coupon.png', name: '优惠券' },
      { icon: '/images/feedback.png', name: '投诉与建议' }
    ],
    services: [
      { icon: '/images/account.png', name: '账号管理' },
      { icon: '/images/question.png', name: '常见问题' },
      { icon: '/images/privacy.png', name: '隐私政策' }
    ]
  },

  onLoad: function () {
    // 这里可以添加一些初始化数据
  },

  // 跳转到“我的订单”
  goToOrder: function () {
    console.log("跳转到我的订单页面");
    wx.switchTab({
      url: '/pages/order/order',
    });
  },

  // 跳转到“我的收藏”
  goToFavorite: function () {
    wx.navigateTo({
      url: '/pages/favorite/favorite',  // 确保路径正确
    });
  },

  // 跳转到“优惠券”
  goToCoupon: function () {
    wx.navigateTo({
      url: '/pages/coupon/coupon',  // 确保路径正确
    });
  },

  // 跳转到“投诉与建议”
  goToFeedback: function () {
    wx.navigateTo({
      url: '/pages/feedback/feedback',  // 确保路径正确
    });
  },

  // 跳转到“账号管理”
  goToAccount: function () {
    wx.navigateTo({
      url: '/pages/account/account',  // 确保路径正确
    });
  },

  // 跳转到“常见问题”
  goToQuestion: function () {
    wx.navigateTo({
      url: '/pages/question/question',  // 确保路径正确
    });
  },

  // 跳转到“隐私政策”
  goToPrivacy: function () {
    wx.navigateTo({
      url: '/pages/privacy/privacy',  // 确保路径正确
    });
  }
});
