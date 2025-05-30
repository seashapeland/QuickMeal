const config = require('../../utils/config');
Page({
  data: {
    favorites: []
  },

  onLoad() {
    const user_id = wx.getStorageSync('user_id');
    if (!user_id) {
      wx.showToast({ title: '未登录', icon: 'none' });
      return;
    }

    this.loadFavorites(user_id);
  },

  goBack() {
    wx.navigateBack();
  },

 

 // 加载收藏列表
 loadFavorites(user_id) {
  wx.showLoading({ title: '加载中...' });

  wx.request({
    url: `${config.BASE_URL}/user/favorite/list/${user_id}/`,
    method: 'GET',
    success: (res) => {
      if (res.statusCode === 200 && res.data.data) {
        const all = res.data.data;

        // 合成图片绝对路径
        const fullList = all.map(item => ({
          ...item,
          image: item.image ? config.BASE_URL + item.image : '/images/default.png',
          
        }));

        // 套餐优先显示
        const packages = fullList.filter(i => i.type === 'package');
        const dishes = fullList.filter(i => i.type === 'dish');
        this.setData({ favorites: [...packages, ...dishes] });
      } else {
        wx.showToast({ title: '加载失败', icon: 'none' });
      }
    },
    fail: () => {
      wx.showToast({ title: '网络错误', icon: 'none' });
    },
    complete: () => {
      wx.hideLoading();
    }
  });
},

// 确认取消收藏
confirmDelete(e) {
  const id = e.currentTarget.dataset.id;
  const type = e.currentTarget.dataset.type;

  wx.showModal({
    title: '提示',
    content: '确定要取消收藏吗？',
    success: (res) => {
      if (res.confirm) {
        this.deleteItem(id, type);
      }
    }
  });
},

// 执行取消收藏
deleteItem(target_id, target_type) {
  const user_id = wx.getStorageSync('user_id');
  if (!user_id) {
    wx.showToast({ title: '未登录', icon: 'none' });
    return;
  }

  wx.request({
    url: `${config.BASE_URL}/user/favorite/toggle/`,
    method: 'POST',
    header: { 'content-type': 'application/json' },
    data: {
      user_id,
      target_id,
      target_type
    },
    success: (res) => {
      if (res.statusCode === 200 || res.statusCode === 201) {
        wx.showToast({ title: '已取消收藏', icon: 'success' });
        // 刷新收藏列表
        this.loadFavorites(user_id);
      } else {
        wx.showToast({ title: res.data.message || '取消失败', icon: 'none' });
      }
    },
    fail: () => {
      wx.showToast({ title: '请求失败', icon: 'none' });
    }
  });
}
});