// pages/search/search.js
Page({
  data: {
    keyword: '',
    historyList: ['麦当劳', '正新鸡排'],
  },

  goBack() {
    wx.navigateBack({
      delta: 1  // 返回上一级页面
    });
  },

  onShow() {
    this.setData({
      keyword: ''
    });
  },

  // 实时记录输入内容
  onInput(e) {
    this.setData({
      keyword: e.detail.value
    });
  },

  // 更新历史记录并保存到本地
  updateHistory(keyword) {
    // 更新历史记录
    let history = this.data.historyList.slice();
    const index = history.indexOf(keyword);
    if (index !== -1) {
      history.splice(index, 1); // 如果已存在则移除
    }
    history.unshift(keyword); // 添加到最前

    // 可限制最大记录数，例如10条
    if (history.length > 10) {
      history = history.slice(0, 10);
    }
    this.setData({ historyList: history });
  },

  // 搜索逻辑：按钮点击 & 回车共用
  onSearchConfirm() {
    const keyword = this.data.keyword.trim();
    if (!keyword) {
      wx.showToast({
        title: '请输入关键词',
        icon: 'none'
      });
      return;
    }
    this.updateHistory(keyword);

    // 跳转到搜索结果页
    wx.navigateTo({
      url: `/pages/searchResult/searchResult?keyword=${encodeURIComponent(keyword)}`
    });
  },
  onTagTap(e) {
    const keyword = e.currentTarget.dataset.keyword;
  
    if (!keyword) return;
  
    // 更新历史记录（置顶）
    this.updateHistory(keyword);
  
    // 跳转到搜索结果页
    wx.navigateTo({
      url: `/pages/searchResult/searchResult?keyword=${encodeURIComponent(keyword)}`
    });
  },
})