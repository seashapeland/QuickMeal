Page({
  data: {
    dish: {},
    isFavorite: false, // 默认未收藏
    priceInfo: '满38减1; 满58减2; 满78减3; 满98减5; 满128减8',
    recommendedDishes: [
      // 示例推荐菜品数据
      { id: 1, name: '推荐菜品1', img: '/images/recommended1.png', price: 28 },
      { id: 2, name: '推荐菜品2', img: '/images/recommended2.png', price: 38 },
      { id: 3, name: '推荐菜品3', img: '/images/recommended3.png', price: 48 }
    ]
  },
  onLoad: function(options) {
    const dishStr = options.dish;
    const dish = JSON.parse(decodeURIComponent(dishStr));
    this.setData({ dish });
    // 假设从本地存储中读取收藏状态
    const favorites = wx.getStorageSync('favorites') || [];
    this.setData({
      isFavorite: favorites.includes(dish.id)
    });
  },
  goBack: function() {
    wx.navigateBack();
  },
  toggleFavorite: function() {
    const { dish, isFavorite } = this.data;
    const favorites = wx.getStorageSync('favorites') || [];
    if (isFavorite) {
      // 如果已收藏，取消收藏
      const newFavorites = favorites.filter(id => id !== dish.id);
      wx.setStorageSync('favorites', newFavorites);
      this.setData({ isFavorite: false });
    } else {
      // 如果未收藏，添加到收藏
      const newFavorites = [...favorites, dish.id];
      wx.setStorageSync('favorites', newFavorites);
      this.setData({ isFavorite: true });
    }
  },
  goToDishDetail: function(event) {
    const dish = event.currentTarget.dataset.dish;
    const dishStr = encodeURIComponent(JSON.stringify(dish));
    wx.navigateTo({
      url: `/pages/dishDetail/dishDetail?dish=${dishStr}`
    });
  }
});