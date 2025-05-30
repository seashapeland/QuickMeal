// pages/rate/rate.js
const config = require('../../utils/config');
Page({
  data: {
    dish: {},           // 当前菜品信息
    rating: 5,          // 星级评分（1~5）
    comment: '',        // 文字评价
  },

  onLoad(options) {
    const dishStr = options.dish;
    const dish = JSON.parse(decodeURIComponent(dishStr));
    this.setData({ dish });
    console.log(dish)
  },

  goBack() {
    wx.navigateBack();
  },

  // 点击星星评分
  onRate(e) {
    const index = parseInt(e.currentTarget.dataset.index);
    this.setData({ rating: index + 1 });
  },

  // 输入文字评价
  onInput(e) {
    this.setData({ comment: e.detail.value });
  },

  // 提交评价
  onSubmit() {
    const { rating, comment, dish } = this.data;
    const token = wx.getStorageSync('token');
    const user_id = wx.getStorageSync('user_id');
  
    if (!token || !user_id) {
      wx.showToast({ title: '未登录，无法评价', icon: 'none' });
      return;
    }
  
    if (rating === 0) {
      wx.showToast({ title: '请打分', icon: 'none' });
      return;
    }
  
    wx.showLoading({ title: '提交中...' });
  
    // 判断接口类型
    const isPackage = Array.isArray(dish.items);
    const url = isPackage ? config.REVIEW_PACKAGE_API : config.REVIEW_DISH_API;
    const idField = isPackage ? 'package_id' : 'dish_id';
  
    const postData = {
      user_id,
      rating,
      content: comment,
    };
    postData[idField] = dish.id;
  
    wx.request({
      url,
      method: 'POST',
      header: {
        'content-type': 'application/json',
      },
      data: postData,
      success: (res) => {
        wx.hideLoading();
        if (res.statusCode === 201 || res.statusCode === 200) {
          const eventChannel = this.getOpenerEventChannel(); // ✅ 正确方式
          wx.showToast({ title: '评价成功', icon: 'success' });
          setTimeout(() => {
            eventChannel.emit('refreshReviews'); // ✅ 通知上一页刷新
            wx.navigateBack();
          }, 100);
        } else {
          wx.showToast({ title: res.data.message || '提交失败', icon: 'none' });
        }
      },
      fail: () => {
        wx.hideLoading();
        wx.showToast({ title: '网络错误', icon: 'none' });
      }
    });
  },
 
})