Page({
  data: {
    username: '',
    password: ''
  },
  onUsernameInput(e) {
    this.setData({ username: e.detail.value });
  },
  onPasswordInput(e) {
    this.setData({ password: e.detail.value });
  },
  onLogin() {
    const { username, password } = this.data;
    if (!username || !password) {
      wx.showToast({ title: '请输入账号和密码', icon: 'none' });
      return;
    }
    wx.showToast({
      title: '登录成功',
      icon: 'success',
      success: () => {
        setTimeout(() => {
          wx.switchTab({ url: '/pages/index/index' });
        }, 1500);
      }
    });
  },
  goToAgreement() {
    wx.navigateTo({
      url: '/pages/agreement/agreement'
    });
  },
  goToPrivacy() {
    wx.navigateTo({
      url: '/pages/privacy/privacy'
    });
  },
  onWechatLogin(e) {
    if (e.detail.userInfo) {
      wx.showToast({ title: '微信登录成功', icon: 'success' });
      wx.switchTab({ url: '/pages/index/index' });
    } else {
      wx.showToast({ title: '需要授权才能登录', icon: 'none' });
    }
  }
});
