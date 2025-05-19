Page({
  data: {
    tableNumber: 1,
    activeCategoryIndex: 0,
    totalPrice: 256.8,
    cartCount: 5,
    showCartPanel: false,
    categories: [
      { name: "推荐", dishes: [] },
      { name: "饮品", dishes: [] },
      { name: "小吃", dishes: [] },
      { name: "主食", dishes: [] }
    ],
    highlightId: null
  },

  onLoad(options) {
    const eventChannel = this.getOpenerEventChannel();
    
    eventChannel && eventChannel.on('sendRecommendData', (data) => {
      this.processRecommendData(data);
    });
  },

  processRecommendData(data) {
    // 1. 合并推荐数据到对应分类
    const updatedCategories = this.data.categories.map(category => {
      const dishes = data.recommendList.filter(
        dish => dish.category === category.name
      );
      return { ...category, dishes };
    });

    // 2. 定位到对应分类和菜品
    let targetCategoryIndex = 0;
    if (data.dish) {
      targetCategoryIndex = updatedCategories.findIndex(
        cat => cat.name === data.dish.category
      );
      
      this.setData({ highlightId: data.dish.id });
      setTimeout(() => this.setData({ highlightId: null }), 1000);
    }

    this.setData({
      categories: updatedCategories,
      activeCategoryIndex: targetCategoryIndex
    });
  },

  // 保持原有方法不变
  goBack() {
    wx.navigateBack({ delta: 1 });
  },
  
  onCategoryTap(e) {
    this.setData({ activeCategoryIndex: e.currentTarget.dataset.index });
  },
  
  toggleCartPanel() {
    this.setData({ showCartPanel: !this.data.showCartPanel });
  },
  
  goCheckout() {
    wx.navigateTo({ url: '/pages/checkout/checkout' });
  }
})