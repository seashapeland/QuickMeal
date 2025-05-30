const config = require('../../utils/config');

Page({
  data: {
    feedbackText: ''
  },

  handleInput(e) {
    this.setData({
      feedbackText: e.detail.value
    });
  },

  submitFeedback() {
    const { feedbackText } = this.data;
    const token = wx.getStorageSync('token');
    const user_id = wx.getStorageSync('user_id');

    if (!token || !user_id) {
      wx.showToast({
        title: '请先登录',
        icon: 'none'
      });
      return;
    }

    if (!feedbackText.trim()) {
      wx.showToast({
        title: '请输入内容',
        icon: 'none'
      });
      return;
    }

    wx.showLoading({ title: '提交中...' });

    wx.request({
      url: config.REVIEW_STORE_API,  // ✅ 配置项中定义
      method: 'POST',
      header: {
        'content-type': 'application/json'
      },
      data: {
        user_id,
        content: feedbackText.trim()
      },
      success: (res) => {
        wx.hideLoading();
        if (res.statusCode === 201 || res.statusCode === 200) {
          wx.showToast({
            title: '提交成功',
            icon: 'success'
          });
          this.setData({ feedbackText: '' });
          setTimeout(() => {
            wx.navigateBack();
          }, 100);
        } else {
          wx.showToast({
            title: res.data.message || '提交失败',
            icon: 'none'
          });
        }
      },
      fail: () => {
        wx.hideLoading();
        wx.showToast({
          title: '网络错误',
          icon: 'none'
        });
      }
    });
  },


  goBack() {
    wx.navigateBack();
  }
});
