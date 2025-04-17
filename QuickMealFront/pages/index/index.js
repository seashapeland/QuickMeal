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
    /*wx.scanCode({
      onlyFromCamera: true, // 仅允许从相机扫码（更真实业务场景）
      success(res) {
        console.log('扫码结果:', res.result);
  
        // 你可以根据扫码结果跳转页面，比如：
        // wx.navigateTo({ url: '/pages/orderPage/orderPage?table=' + res.result });
  
        wx.showToast({
          title: '扫码成功',
          icon: 'success'
        });
      },
      fail(err) {
        console.log('扫码失败', err);

      }
    });*/
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
  },

  goToDishDetail(e) {
    const index = e.currentTarget.dataset.index;
    const dish = this.data.categories[this.data.activeCategoryIndex].dishes[index];
  
    // 推荐使用 encodeURIComponent 将数据转成 JSON 字符串传参
    const dishStr = encodeURIComponent(JSON.stringify(dish));
    console.log('发送菜品信息：', dish);
    wx.navigateTo({
      url: `/pages/dishDetail/dishDetail?dish=${dishStr}`
    });
  }
  

});
