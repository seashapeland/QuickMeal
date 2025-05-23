Page({
  data: {
    
  },



  // 点击头像跳转账号管理
  navigateToAccount: function() {
    wx.navigateTo({
      url: '/pages/account/account'
    });
  }
});