Page({
  data: {
    dishes: [
      { id: 1, name: "红烧肉", image: "/images/food1.jpg" },
      { id: 2, name: "清蒸鱼", image: "/images/food1.jpg" },
      { id: 3, name: "宫保鸡丁", image: "/images/food1.jpg" },
      { id: 4, name: "麻婆豆腐", image: "/images/food1.jpg" },
      { id: 5, name: "糖醋排骨", image: "/images/dishes/dish5.jpg" },
      { id: 6, name: "水煮牛肉", image: "/images/dishes/dish6.jpg" },
      { id: 7, name: "鱼香肉丝", image: "/images/dishes/dish7.jpg" },
      { id: 8, name: "回锅肉", image: "/images/dishes/dish8.jpg" },
      { id: 9, name: "蒜蓉粉丝虾", image: "/images/dishes/dish9.jpg" },
      { id: 10, name: "东坡肉", image: "/images/dishes/dish10.jpg" },
      { id: 11, name: "辣子鸡", image: "/images/dishes/dish11.jpg" },
      { id: 12, name: "番茄炒蛋", image: "/images/dishes/dish12.jpg" }
    ]
  },

  // 滑动到顶部触发
  upper: function(e) {
    console.log("滑动到顶部");
    wx.showToast({
      title: '已到顶部',
      icon: 'none'
    });
  },

  // 滑动到底部触发
  lower: function(e) {
    console.log("滑动到底部");
    wx.showToast({
      title: '已到底部',
      icon: 'none'
    });
  },

  // 点击头像跳转账号管理
  navigateToAccount: function() {
    wx.navigateTo({
      url: '/pages/account/account'
    });
  }
});