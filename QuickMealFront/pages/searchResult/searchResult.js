// pages/searchResult/searchResult.js
Page({
  data: {
    keyword: ''
  },

  
  onLoad(options) {
    const keyword = decodeURIComponent(options.keyword || '');
    console.log('搜索关键词：', keyword);
    this.setData({
      keyword
    });
    this.search(keyword);
  },

  // 实时更新输入
  onInput(e) {
    this.setData({
      keyword: e.detail.value
    });
  },

  onSearchConfirm() {
    const keyword = this.data.keyword.trim();
    if (!keyword) {
      wx.showToast({
        title: '请输入关键词',
        icon: 'none'
      });
      return;
    }

    // 重新发起搜索
    this.search(keyword);
  },

  search(keyword) {
    console.log('执行搜索：', keyword);
    // TODO: 发请求、更新结果列表，更新历史记录等
  },

  goBack() {
    wx.navigateBack({
      delta: 1  // 返回上一级页面
    });
  },

  
})