const config = require('../../utils/config');
Page({
  data: {
    username: '',
    avatar: '/images/default-avatar.png'
  },

  onShow() {
    const username = wx.getStorageSync('username');
    const avatarPath = wx.getStorageSync('avatar');
    console.log(avatarPath)
    const avatar = avatarPath
    ? config.BASE_URL + avatarPath
    : '/images/default-avatar.png';
    this.setData({
      username: username || '',
      avatar
    });
  },



  // 判断是否已登录并跳转
  handleUserTap: function () {
    if (this.data.username) {
      const name = this.data.username;
      const avatarUrl = this.data.avatar; // 本地默认或后端头像
  
      wx.navigateTo({
        url: `/pages/account/account?name=${encodeURIComponent(name)}&avatarUrl=${encodeURIComponent(avatarUrl)}`
      });
    } else {
      wx.navigateTo({
        url: '/pages/login/login'
      });
    }
  }
});