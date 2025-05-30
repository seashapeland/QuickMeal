Page({
  data: {
    tableNumber: 1,
    activeCategoryIndex: 0,
    totalPrice: 256.8,
    cartCount: 5,
    showCartPanel: false,
    categories: [
      {
        name: "推荐",
        dishes: [
          {
            name: "招牌红烧肉套餐",
            img: "https://example.com/images/braised_pork.jpg",
            price: 32,
            originalPrice: 38,
            description: "秘制红烧肉+时蔬+米饭",
            count: 1,
          },
          {
            name: "香辣鸡腿堡套餐",
            img: "https://example.com/images/chicken_burger.jpg",
            price: 28,
            originalPrice: 32,
            description: "汉堡+薯条+可乐"
          }
        ]
      },
      {
        name: "饮品",
        dishes: [
          {
            name: "冰镇柠檬红茶",
            img: "https://example.com/images/ice_tea.jpg",
            price: 12,
            description: "500ml/杯"
          },
          {
            name: "鲜榨西瓜汁",
            img: "https://example.com/images/watermelon_juice.jpg",
            price: 15,
            description: "450ml/杯"
          },
          {
            name: "经典珍珠奶茶",
            img: "https://example.com/images/bubble_tea.jpg",
            price: 16,
            originalPrice: 18,
            description: "大杯/可选甜度"
          }
        ]
      },
      {
        name: "小吃",
        dishes: [
          {
            name: "黄金鸡米花",
            img: "https://example.com/images/chicken_popcorn.jpg",
            price: 10,
            description: "外酥里嫩"
          },
          {
            name: "薯条（大份）",
            img: "https://example.com/images/french_fries.jpg",
            price: 12,
            description: "配番茄酱"
          },
          {
            name: "香脆洋葱圈",
            img: "https://example.com/images/onion_rings.jpg",
            price: 14,
            originalPrice: 16,
            description: "现炸现做"
          }
        ]
      },
      {
        name: "主食",
        dishes: [
          {
            name: "黑椒牛柳意面",
            img: "https://example.com/images/beef_pasta.jpg",
            price: 26,
            description: "配西兰花"
          },
          {
            name: "香菇滑鸡饭",
            img: "https://example.com/images/chicken_rice.jpg",
            price: 22,
            description: "套餐含例汤"
          },
          {
            name: "番茄牛肉面",
            img: "https://example.com/images/beef_noodle.jpg",
            price: 24,
            originalPrice: 28,
            description: "手工拉面"
          }
        ]
      }
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