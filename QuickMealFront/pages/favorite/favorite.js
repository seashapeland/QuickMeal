Page({
  data: {
    favorites: [
      {
        id: 1,
        name: '红烧牛肉面',
        desc: '浓郁汤头，劲道面条',
        image: '/images/food1.jpg',
        offsetX: 0
      },
      {
        id: 2,
        name: '宫保鸡丁',
        desc: '香辣爽口，回味无穷',
        image: '/images/kungpao.jpg',
        offsetX: 0
      }
    ],
    startX: 0
  },

  goBack() {
    wx.navigateBack();
  },

  handleTouchStart(e) {
    this.setData({ startX: e.touches[0].clientX });
  },

  handleTouchMove(e) {
    const moveX = e.touches[0].clientX;
    const deltaX = this.data.startX - moveX;
    const id = e.currentTarget.dataset.id;
    const newFavorites = this.data.favorites.map(item => {
      if (item.id === id) {
        item.offsetX = deltaX > 30 ? -160 : 0;
      }
      return item;
    });
    this.setData({ favorites: newFavorites });
  },

  handleTouchEnd(e) {
    const id = e.currentTarget.dataset.id;
    const item = this.data.favorites.find(f => f.id === id);
    if (item && item.offsetX < -80) {
      item.offsetX = -160;
    } else {
      item.offsetX = 0;
    }
    this.setData({
      favorites: this.data.favorites
    });
  },

  deleteItem(e) {
    const id = e.currentTarget.dataset.id;
    wx.showModal({
      title: '确认删除',
      content: '确定要从收藏中移除该菜品吗？',
      success: (res) => {
        if (res.confirm) {
          const filtered = this.data.favorites.filter(item => item.id !== id);
          this.setData({ favorites: filtered });
        }
      }
    });
  }
});
