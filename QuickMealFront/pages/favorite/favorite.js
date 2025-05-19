Page({
  data: {
    itemHeight: 180,
    favorites: [
      {
        id: 1,
        name: "红烧肉",
        image: "/images/food1.jpg",
        time: "2023-05-10",
        x: 0
      },
      {
        id: 2,
        name: "清蒸鱼",
        image: "/images/food2.jpg",
        time: "2023-05-12",
        x: 0
      },
      {
        id: 3,
        name: "宫保鸡丁",
        image: "/images/food3.jpg",
        time: "2023-05-15",
        x: 0
      }
    ]
  },

  onLoad() {
    // 可以在这里加载真实的收藏数据
    // this.loadFavorites();
  },

  navigateBack() {
    wx.navigateBack();
  },

  // 滑动事件处理
  onChange(e) {
    const { x } = e.detail;
    const index = e.currentTarget.dataset.index;
    const { favorites } = this.data;
    
    if (x < -100) {
      favorites[index].x = -120;
    } else {
      favorites[index].x = x;
    }
    
    this.setData({ favorites });
  },

  // 确认删除
  confirmDelete(e) {
    const id = e.currentTarget.dataset.id;
    wx.showModal({
      title: '提示',
      content: '确定要删除该收藏吗？',
      success: (res) => {
        if (res.confirm) {
          this.deleteItem(id);
        } else {
          // 取消时恢复位置
          const index = this.data.favorites.findIndex(item => item.id === id);
          if (index !== -1) {
            const key = `favorites[${index}].x`;
            this.setData({
              [key]: 0
            });
          }
        }
      }
    });
  },

  // 执行删除
  deleteItem(id) {
    this.setData({
      favorites: this.data.favorites.filter(item => item.id !== id)
    });
    wx.showToast({
      title: '删除成功',
      icon: 'success',
      duration: 1500
    });
  },

  // 从服务器加载收藏数据
  loadFavorites() {
    wx.showLoading({
      title: '加载中...',
    });
    
    // 实际项目中替换为真实的API调用
    wx.request({
      url: 'https://your-api.com/favorites',
      method: 'GET',
      success: (res) => {
        const favorites = res.data.map(item => ({ ...item, x: 0 }));
        this.setData({ favorites });
      },
      complete: () => {
        wx.hideLoading();
      }
    });
  }
});