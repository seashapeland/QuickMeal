const config = require('../../utils/config.js');
Page({
  data: {
    username: '',
    password: '',
    showPassword: false,
  },

  // 输入用户名
  onInputUsername: function(e) {
    this.setData({
      username: e.detail.value
    });
  },

  // 输入密码
  onInputPassword: function(e) {
    this.setData({
      password: e.detail.value
    });
  },

  // 切换密码显示状态
  togglePassword: function() {
    this.setData({
      showPassword: !this.data.showPassword
    });
  },

  // 忘记密码功能
  onForgotPassword: function() {
    wx.navigateTo({
      url: '/pages/forgot/forgot'
    });
  },

  // 立即注册功能
  onRegister: function() {
    wx.navigateTo({
      url: '/pages/register/register'
    });
  },

  // 微信登录功能
  onWechatLogin: function(e) {
    wx.login({
      success: (res) => {
        if (res.code) {
          wx.getUserProfile({
            desc: '用于完善用户资料',
            success: (info) => {
              console.log(info.userInfo)
              wx.request({
                url: config.USER_LOGIN_API,
                method: 'POST',
                header: { 'content-type': 'application/json' },
                data: {
                  type: 'wechat',
                  openid: res.code,  // 这里的code应在后端换openid
                  nickname: info.userInfo.nickName,
                  avatar: info.userInfo.avatarUrl
                },
                success: (res) => {
                  if (res.statusCode === 200) {
                    const { token, user_id, username, avatar } = res.data;

                    wx.setStorageSync('token', token);
                    wx.setStorageSync('user_id', user_id);
                    wx.setStorageSync('username', username);
                    wx.setStorageSync('avatar', avatar);

                    wx.showToast({ title: '微信登录成功', icon: 'success', duration: 1500 });

                    setTimeout(() => {
                      wx.reLaunch({ url: '/pages/index/index' });
                    }, 1500);
                  } else {
                    wx.showToast({ title: res.data.message || '登录失败', icon: 'none' });
                  }
                },
                fail: () => {
                  wx.showToast({ title: '请求失败，请检查网络', icon: 'none' });
                }
              });
            },
            fail: () => {
              wx.showToast({ title: '获取用户信息失败', icon: 'none' });
            }
          });
        } else {
          wx.showToast({ title: '微信登录失败', icon: 'none' });
        }
      }
    });
  },

  // 登录功能
  onLogin: function() {
    const { username, password } = this.data;

    if (!username || !password) {
      wx.showToast({ title: '请输入用户名和密码', icon: 'none' });
      return;
    }

    wx.showLoading({ title: '登录中...' });

    wx.request({
      url: config.USER_LOGIN_API,
      method: 'POST',
      header: { 'content-type': 'application/json' },
      data: {
        type: 'password',
        username,
        password
      },
      success: (res) => {
        wx.hideLoading();

        if (res.statusCode === 200) {
          const { token, user_id, username, avatar } = res.data;

          wx.setStorageSync('token', token);
          wx.setStorageSync('user_id', user_id);
          wx.setStorageSync('username', username);
          wx.setStorageSync('avatar', avatar);

          wx.showToast({ title: '登录成功', icon: 'success', duration: 1500 });

          setTimeout(() => {
            wx.reLaunch({ url: '/pages/index/index' });
          }, 1500);
        } else {
          wx.showToast({ title: res.data.message || '登录失败', icon: 'none' });
        }
      },
      fail: () => {
        wx.hideLoading();
        wx.showToast({ title: '请求失败，请检查网络', icon: 'none' });
      }
    });
  },

  // 跳转到首页
  goToHome: function() {
    wx.reLaunch({
      url: '/pages/index/index'
    });
  }
});