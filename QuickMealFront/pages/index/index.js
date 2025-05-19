Page({
  data: {
    isRefreshing: false,
    activeCategoryIndex: 0,
    categories: [
      {
        name: "推荐",
        dishes: [
          { id: 1, name: "宫保鸡丁", price: 29, img: "/images/gongbao.png", restriction: "含有坚果，过敏者慎食" },
          { id: 2, name: "宫保鸡丁", price: 29, img: "/images/gongbao.png", restriction: "含有坚果，过敏者慎食" },
          { id: 3, name: "宫保鸡丁", price: 29, img: "/images/gongbao.png", restriction: "含有坚果，过敏者慎食" },
          { id: 4, name: "宫保鸡丁", price: 29, img: "/images/gongbao.png", restriction: "含有坚果，过敏者慎食" },
          { id: 5, name: "宫保鸡丁", price: 29, img: "/images/gongbao.png", restriction: "含有坚果，过敏者慎食" },
          { id: 6, name: "宫保鸡丁", price: 29, img: "/images/gongbao.png", restriction: "含有坚果，过敏者慎食" },
          { id: 7, name: "宫保鸡丁", price: 29, img: "/images/gongbao.png", restriction: "含有坚果，过敏者慎食" },
          { id: 8, name: "宫保鸡丁", price: 29, img: "/images/gongbao.png", restriction: "含有坚果，过敏者慎食" },
          { id: 9, name: "红烧肉", price: 30, originalPrice: 38, img: "/images/hongshaorou.png", restriction: "高脂肪，减肥者慎食" }
        ]
      },
      {
        name: "饮品",
        dishes: [
          { id: 10, name: "柠檬水", price: 8, img: "/images/ningmengshui.png", restriction: "含糖，糖尿病患者慎食" },
          { id: 11, name: "百香果茶", price: 10, img: "/images/baxiangguocha.png", restriction: "含糖，糖尿病患者慎食" }
        ]
      },
      {
        name: "小吃",
        dishes: [
          { id: 12, name: "凉拌黄瓜", price: 12, img: "/images/liangbanhuanggua.png", restriction: "含蒜，过敏者慎食" },
          { id: 13, name: "炸酱面", price: 18, img: "/images/zhajiangmian.png", restriction: "高盐，高血压患者慎食" }
        ]
      },
      {
        name: "主食",
        dishes: [
          { id: 14, name: "辣椒炒肉", price: 22, img: "/images/lajiaochaorou.png", restriction: "辣味，不吃辣者慎食" },
          { id: 15, name: "蛋炒饭", price: 15, img: "/images/danchaofan.png", restriction: "高胆固醇，高血脂患者慎食" }
        ]
      }
    ]
  },
  onLoad() {
    this.loadDishes();
  },
  goToSearch() {
    wx.navigateTo({
      url: '/pages/search/search', // 你的搜索页面路径
    })
  },
  onScan() {
    wx.navigateTo({ url: '/pages/food/food'});
  },
  onTabChange(e) {
    this.setData({
      activeCategoryIndex: e.currentTarget.dataset.index
    });
  },
  onPulling(e) {
    // 可选处理拖动状态
  },
  onRefresh() {
    this.setData({ isRefreshing: true });
    setTimeout(() => {
      this.loadDishes(); // 加载数据逻辑
      this.setData({ isRefreshing: false });
    }, 1500);
  },
  onRestore() {
    // console.log('恢复状态');
  },
  onAbort() {
    // console.log('用户中止刷新');
  },
  loadDishes() {
    // 假设你重新加载菜品分类数据
  },
  goToDishDetail(e) {
    const index = e.currentTarget.dataset.index;
    const dish = this.data.categories[this.data.activeCategoryIndex].dishes[index];
    const dishStr = encodeURIComponent(JSON.stringify(dish));
    console.log('发送菜品信息：', dish);
    wx.navigateTo({
      url: `/pages/dishDetail/dishDetail?dish=${dishStr}`
    });
  }
});