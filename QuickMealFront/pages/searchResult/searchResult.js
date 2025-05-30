// pages/searchResult/searchResult.js
const config = require('../../utils/config');
Page({
  data: {
    keyword: '',
    searchResults: [],
  },

  updateHistory(keyword) {
    const userId = wx.getStorageSync('user_id') || 'guest';
    const key = `history_${userId}`;
  
    // 读取历史
    let history = wx.getStorageSync(key) || [];
  
    const index = history.indexOf(keyword);
    if (index !== -1) {
      history.splice(index, 1); // 已存在，先移除
    }
    history.unshift(keyword); // 添加到最前
  
    if (history.length > 10) {
      history = history.slice(0, 10);
    }
  
    wx.setStorageSync(key, history); // 保存到本地
  },
  
  onLoad(options) {
    const keyword = decodeURIComponent(options.keyword || '');
    console.log('搜索关键词：', keyword);
    this.setData({
      keyword
    });
    this.search(keyword);
  },

  // 实时更新输入
  onInput(e) {
    this.setData({
      keyword: e.detail.value
    });
  },

  onSearchConfirm() {
    const keyword = this.data.keyword.trim();
    if (!keyword) {
      wx.showToast({
        title: '请输入关键词',
        icon: 'none'
      });
      return;
    }

    // 重新发起搜索
    this.search(keyword);
    this.updateHistory(keyword);
  },

  search(keyword) {
    const host = config.BASE_URL;
    const dishUrl = config.DISH_LIST_API;
    const pkgUrl = config.PACKAGE_LIST_API;

    const dishReq = new Promise((resolve, reject) => {
      wx.request({
        url: dishUrl,
        method: 'GET',
        data: {
          category: 'all',
          status: 'on-shelf',
          sort: 'default',
          keyword
        },
        success: res => {
          if (res.statusCode === 200 && res.data.data) {
            const dishes = res.data.data.map(d => ({
              ...d,
              image: `${host}${d.image}`,
              type: 'dish'
            }));
            resolve(dishes);
          } else {
            resolve([]);
          }
        },
        fail: () => resolve([])
      });
    });

    const pkgReq = new Promise((resolve, reject) => {
      wx.request({
        url: pkgUrl,
        method: 'GET',
        data: {
          status: 'on-shelf',
          sort: 'default',
          keyword
        },
        success: res => {
          if (res.statusCode === 200 && res.data.data) {
            const pkgs = res.data.data.map(pkg => ({
              ...pkg,
              image: `${host}${pkg.image}`,
              items: pkg.items.map(i => ({
                ...i,
                image: `${host}${i.image}`  // ✅ 处理套餐子项图片路径
              })),
              originalPrice: pkg.items.reduce((sum, i) => sum + i.price * i.quantity, 0),
              type: 'package'
            }));
            resolve(pkgs);
          } else {
            resolve([]);
          }
        },
        fail: () => resolve([])
      });
    });

    Promise.all([pkgReq, dishReq]).then(([pkgs, dishes]) => {
      this.setData({ searchResults: [...pkgs, ...dishes] });
    });
  },

  goBack() {
    wx.navigateBack({ delta: 1 });
  },

  // 点击卡片进入详情页
  goToDetail(e) {
    const item = e.currentTarget.dataset.item;
    console.log(item)
    const encoded = encodeURIComponent(JSON.stringify(item));
  
    const isPackage = Array.isArray(item.items) && item.items.length > 0;
  
    const url = isPackage
      ? `/pages/packageDetail/packageDetail?dish=${encoded}`
      : `/pages/dishDetail/dishDetail?dish=${encoded}`;
  
    wx.navigateTo({ url });
  },

  
})