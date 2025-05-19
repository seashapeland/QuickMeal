Page({
  data: {
    username: '',
    password: '',
    showPassword: false,
    isAgreed: true
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
  onWechatLogin: function() {
    wx.showToast({
      title: '微信登录功能开发中',
      icon: 'none'
    });
  },

  // 用户协议
  onUserAgreement: function() {
    wx.navigateTo({
      url: '/pages/agreement/agreement'
    });
  },

  // 隐私政策
  onPrivacyPolicy: function() {
    wx.navigateTo({
      url: '/pages/privacy/privacy'
    });
  },

  // 勾选协议变化
  onAgreeChange: function(e) {
    // 确保正确获取勾选状态
    this.setData({
      isAgreed: e.detail.value.length > 0 && e.detail.value[0] === 'true'
    });
  },

  // 登录功能
  onLogin: function() {
    //if (!this.data.isAgreed) {
      //wx.showToast({
        //title: '请先同意用户协议和隐私政策',
        //icon: 'none'
      //});
      //return;
    //}
    
    if (!this.data.username || !this.data.password) {
      wx.showToast({
        title: '请输入用户名和密码',
        icon: 'none'
      });
      return;
    }
    
    wx.showLoading({
      title: '登录中...',
    });
    
    setTimeout(() => {
      wx.hideLoading();
      wx.showToast({
        title: '登录成功',
        icon: 'success',
        duration: 1500
      });
      
      setTimeout(() => {
        wx.reLaunch({
          url: '/pages/index/index'  // 修改为跳转到index页面
        });
      }, 1500);
    }, 1500);
  },

  // 跳转到首页
  goToHome: function() {
    wx.reLaunch({
      url: '/pages/index/index'
    });
  }
});