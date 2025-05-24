Page({
  data: {
    username: '',
    phone: ''
  },

  onLoad() {
    wx.request({
      url: 'https://94a4-2001-250-209-2000-cc5a-81eb-2e1d-5c54.ngrok-free.app/user/info/',  // ✅ 注意是 /user/info/
      method: 'GET',
      success: (res) => {
        console.log('接口返回数据：', res.data);
        this.setData({
          username: res.data.username,
          phone: res.data.phone
        });
      },
      fail: (err) => {
        console.error('请求失败：', err);
      }
    });
  },



  // 点击头像跳转账号管理
  navigateToAccount: function() {
    wx.navigateTo({
      url: '/pages/account/account'
    });
  }
});