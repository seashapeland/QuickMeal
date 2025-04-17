// pages/food/food.js
Page({

  /**
   * 页面的初始数据
   */
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
          { name: "宫保鸡丁", price: 29, img: "/images/gongbao.png" },
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

  goBack() {
    wx.navigateBack({
      delta: 1  // 返回上一级页面
    });
  },

  onCategoryTap(e) {
    this.setData({
      activeCategoryIndex: e.currentTarget.dataset.index
    });
  },

  // 点击购物车图标区域时切换弹窗
  toggleCartPanel() {
    this.setData({
      showCartPanel: !this.data.showCartPanel
    });
  },

  goCheckout() {
    wx.navigateTo({
      url: '/pages/checkout/checkout' // 根据你的页面设置修改路径
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})