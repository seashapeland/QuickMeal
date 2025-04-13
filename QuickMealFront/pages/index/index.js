Page({
  data: {
    isRefreshing: false,
    activeCategoryIndex: 0,
    categories: [
      {
        name: "推荐",
        dishes: [
          { name: "宫保鸡丁", price: 29, img: "/images/gongbao.png" },
          { name: "宫保鸡丁", price: 29, img: "/images/gongbao.png" },
          { name: "宫保鸡丁", price: 29, img: "/images/gongbao.png" },
          { name: "宫保鸡丁", price: 29, img: "/images/gongbao.png" },
          { name: "宫保鸡丁", price: 29, img: "/images/gongbao.png" },
          { name: "宫保鸡丁", price: 29, img: "/images/gongbao.png" },
          { name: "宫保鸡丁", price: 29, img: "/images/gongbao.png" },
          { name: "宫保鸡丁", price: 29, img: "/images/gongbao.png" },
          { name: "红烧肉", price: 30, originalPrice: 38, img: "/images/gongbao.png" }
        ]
      },
      {
        name: "饮品",
        dishes: [
          { name: "柠檬水", price: 8, img: "/images/gongbao.png" },
          { name: "百香果茶", price: 10, img: "/images/gongbao.png" }
        ]
      },
      {
        name: "小吃",
        dishes: [
          { name: "凉拌黄瓜", price: 12, img: "/images/gongbao.png" },
          { name: "炸酱面", price: 18, img: "/images/gongbao.png" }
        ]
      },
      {
        name: "主食",
        dishes: [
          { name: "辣椒炒肉", price: 22, img: "/images/gongbao.png" },
          { name: "蛋炒饭", price: 15, img: "/images/gongbao.png" }
        ]
      }
    ]
  },

  onTabChange(e) {
    this.setData({
      activeCategoryIndex: e.currentTarget.dataset.index
    });
  },

  // 正在下拉中
  onPulling(e) {
    // 可选处理拖动状态
    // console.log('下拉中...', e);
  },

  // 正式触发刷新
  onRefresh() {
    this.setData({ isRefreshing: true });

    // 模拟重新加载数据（可替换成你的请求）
    setTimeout(() => {
      this.loadDishes(); // 加载数据逻辑
      this.setData({ isRefreshing: false });
    }, 1500);
  },

  // 用户主动取消刷新 or 刷新后动画收回
  onRestore() {
    // console.log('恢复状态');
  },

  onAbort() {
    // console.log('用户中止刷新');
  },

  loadDishes() {
    // 假设你重新加载菜品分类数据
    // this.setData({ categories: newData })
  }
});
