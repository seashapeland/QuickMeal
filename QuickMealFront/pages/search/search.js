// pages/search/search.js
Page({
  data: {
    keyword: '',
    historyList: [],
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
    const userId = wx.getStorageSync('user_id') || 'guest';
    const key = `history_${userId}`;
    const history = wx.getStorageSync(key) || [];

    this.setData({
      historyList: history
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
    const userId = wx.getStorageSync('user_id') || 'guest';
    const key = `history_${userId}`;
  
    // 读取历史
    let history = wx.getStorageSync(key) || [];
  
    const index = history.indexOf(keyword);
    if (index !== -1) {
      history.splice(index, 1); // 已存在，先移除
    }
    history.unshift(keyword); // 添加到最前
  
    if (history.length > 10) {
      history = history.slice(0, 10);
    }
  
    wx.setStorageSync(key, history); // 保存到本地
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
    // 跳转到搜索结果页
    wx.navigateTo({
      url: `/pages/searchResult/searchResult?keyword=${encodeURIComponent(keyword)}`
    });
    this.updateHistory(keyword);
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

  clearHistory() {
    const userId = wx.getStorageSync('user_id') || 'guest';
    const key = `history_${userId}`;
    wx.removeStorageSync(key); // 删除本地缓存中的该用户历史记录
    this.setData({ historyList: [] }); // 清空界面数据
  
    wx.showToast({
      title: '已清除历史记录',
      icon: 'success'
    });
  }
})