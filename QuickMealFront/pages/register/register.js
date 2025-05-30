// pages/register/register.js
const config = require('../../utils/config');
Page({
  data: {
    username: '',
    password: '',
    confirmPassword: '',
    showPassword: false
  },

  onInputUsername(e) {
    this.setData({ username: e.detail.value });
    console.log(this.data.username)
  },

  onInputPassword(e) {
    this.setData({ password: e.detail.value });
  },

  onInputConfirmPassword(e) {
    this.setData({ confirmPassword: e.detail.value });
  },

  togglePassword() {
    this.setData({ showPassword: !this.data.showPassword });
  },

  onRegister() {
    const { username, password, confirmPassword } = this.data;

    if (!username || !password || !confirmPassword) {
      wx.showToast({ title: '请填写完整信息', icon: 'none' });
      return;
    }

    if (password !== confirmPassword) {
      wx.showToast({ title: '两次密码不一致', icon: 'none' });
      return;
    }

    wx.showLoading({ title: '注册中...' });

    wx.request({
      url: config.USER_REGISTER_API,  // ✅ 注意结尾要有 `/`
      method: 'POST',
      header: { 'content-type': 'application/json' },
      data: {
        username,
        password
      },
      success: (res) => {
        wx.hideLoading();
        if (res.statusCode === 201) {
          wx.showToast({ title: '注册成功', icon: 'success' });
          setTimeout(() => {
            wx.navigateBack(); // 返回登录页
          }, 1500);
        } else {
          wx.showToast({ title: res.data.message || '注册失败', icon: 'none' });
        }
      },
      fail: () => {
        wx.hideLoading();
        wx.showToast({ title: '网络错误', icon: 'none' });
      }
    });
  },

  goToLogin() {
    wx.navigateBack(); // 返回上一页
  },
  
});
