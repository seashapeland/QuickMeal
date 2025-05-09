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
    if (!feedbackText.trim()) {
      wx.showToast({
        title: '请输入内容',
        icon: 'none'
      });
      return;
    }

    // 模拟提交
    wx.showToast({
      title: '提交成功',
      icon: 'success'
    });

    this.setData({ feedbackText: '' });
  },

  goBack() {
    wx.navigateBack();
  }
});
