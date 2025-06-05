const config = require('../../utils/config.js');
Page({
  data: {
    tableId: null,       // 当前桌号
    tableNumber: 20,     // 最大桌号（用于校验或显示）
    isRefreshing: false,
    activeCategoryIndex: 0,
    tabs: [],           // 分类标签名数组
    dishMap: {},         // 分类名 -> 菜品数组
    cartCount: 0,
    totalPrice: 0,
    showCartPanel: false,
    cartItems: [],
    countMap: {} // key: `${type}_${id}`, value: count
  },

  onShow() {
    this.loadCategory().then(() => {
      this.loadDishes();
    });
  },

  onLoad(options) {
    const tableId = options.table_id;

    if (tableId && !isNaN(tableId)) {
      this.setData({ tableId: parseInt(tableId) });
      wx.setStorageSync('table_id', parseInt(tableId));  // 可全局使用
      console.log(`当前桌号：${tableId}`);
    } else {
      wx.showToast({
        title: '桌号无效',
        icon: 'none'
      });
    }
  },

  goBack() {
    wx.showModal({
      title: '提示',
      content: '你确定要取消点餐吗？',
      confirmText: '是',
      cancelText: '否',
      success: (res) => {
        if (res.confirm) {
          // 设置为空闲
          wx.request({
            url: config.UPDATE_TABLE_STATUS_API,
            method: 'POST',
            header: { 'content-type': 'application/json' },
            data: {
              table_id: this.data.tableId,
              status: '空闲'
            },
            success: () => {
              console.log('桌子状态已设为空闲');
            },
            fail: () => {
              console.warn('状态恢复失败');
            }
          });
  
          this.clearCart?.(); // ✅ 若有定义
          wx.navigateBack(); // ✅ 确认后再返回
        }
      }
    });
  },
  
  onCategoryTap(e) {
    this.setData({ activeCategoryIndex: e.currentTarget.dataset.index });
  },
  
  toggleCartPanel() {
    // 只有当购物车有商品时才显示面板
    if(this.data.cartItems.length > 0) {
      this.setData({ 
        showCartPanel: !this.data.showCartPanel 
      });
    }
  },
  
  goCheckout() {
    if (this.data.totalPrice > 0) {
      wx.showModal({
        title: '确认下单',
        content: '你确定要下单吗？下单后取消订单需要联系服务员',
        confirmText: '确定',
        cancelText: '取消',
        success: (res) => {
          if (res.confirm) {
            wx.navigateTo({
              url: '/pages/checkout/checkout'
            });
          }
        }
      });
    } else {
      wx.showToast({
        title: '请先选择商品',
        icon: 'none',
        duration: 2000
      });
    }
  },
  

  loadCategory() {
    return new Promise((resolve, reject) => {
      wx.request({
        url: config.DISH_CATEGORY_API,
        method: 'GET',
        success: (res) => {
          if (res.statusCode === 200 && res.data.data) {
            const categories = res.data.data;
            const categoryNames = ['推荐', '套餐', ...categories.map(cat => cat.category_name)];
            this.setData({ tabs: categoryNames });
            console.log('✅ 获取菜品分类成功：', categoryNames);
            resolve();
          } else {
            wx.showToast({ title: '加载分类失败', icon: 'none' });
            reject();
          }
        },
        fail: (err) => {
          console.error('❌ 分类请求失败：', err);
          wx.showToast({ title: '网络错误', icon: 'none' });
          reject();
        }
      });
    });
  },

  loadDishes() {
    const tabs = this.data.tabs;
    const dishMap = {};
    const requests = [];
    const hostPrefix = config.BASE_URL;
  
    tabs.forEach(name => {
      if (name === '推荐') {
        dishMap['推荐'] = [];
      } else if (name === '套餐') {
        const req = new Promise(resolve => {
          wx.request({
            url: config.PACKAGE_LIST_API,
            method: 'GET',
            data: { status: 'on-shelf', sort: 'default' },
            success: res => {
              if (res.statusCode === 200 && res.data.data) {
                const pkgs = res.data.data.map(pkg => {
                  const type = 'package';
                  const countKey = `${type}_${pkg.id}`;
                  const items = pkg.items.map(i => ({
                    ...i,
                    image: i.image ? `${hostPrefix}${i.image}` : ''
                  }));
                  const originalPrice = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  
                  return {
                    ...pkg,
                    image: pkg.image ? `${hostPrefix}${pkg.image}` : '',
                    items,
                    originalPrice: originalPrice.toFixed(2),
                    count: this.countMap?.[countKey] || 0
                  };
                });
                dishMap['套餐'] = pkgs;
              } else {
                dishMap['套餐'] = [];
              }
              resolve();
            },
            fail: () => {
              dishMap['套餐'] = [];
              resolve();
            }
          });
        });
        requests.push(req);
      } else {
        // 普通分类
        const req = new Promise(resolve => {
          wx.request({
            url: config.DISH_LIST_API,
            method: 'GET',
            data: { category: name, status: 'on-shelf', sort: 'default' },
            success: res => {
              if (res.statusCode === 200 && res.data.data) {
                const dishes = res.data.data.map(d => {
                  const type = 'dish';
                  const countKey = `${type}_${d.id}`;
                  return {
                    ...d,
                    image: `${hostPrefix}${d.image}`,
                    count: this.countMap?.[countKey] || 0
                  };
                });
                dishMap[name] = dishes;
              } else {
                dishMap[name] = [];
              }
              resolve();
            },
            fail: () => {
              dishMap[name] = [];
              resolve();
            }
          });
        });
        requests.push(req);
      }
    });
  
    Promise.all(requests).then(() => {
      const allDishes = Object.entries(dishMap)
        .filter(([key]) => key !== '推荐' && key !== '套餐')
        .flatMap(([_, val]) => val);
      dishMap['推荐'] = allDishes.slice(0, 6);
  
      this.setData({ dishMap }, () => {
        this.updateCartItems();
        this.calculateCart();
      });
    });
  },
  


  handlePlus(e) {
    const index = e.currentTarget.dataset.index;
    const tab = this.data.tabs[this.data.activeCategoryIndex];
    const dishMap = this.data.dishMap;
    const dish = dishMap[tab][index];
  
    dish.count = (dish.count || 0) + 1;
    this.updateCartItems(); // ✅ 更新购物车数组
  
    this.setData({ dishMap }, this.calculateCart);
  },
  
  handleMinus(e) {
    const index = e.currentTarget.dataset.index;
    const tab = this.data.tabs[this.data.activeCategoryIndex];
    const dishMap = this.data.dishMap;
    const dish = dishMap[tab][index];
  
    dish.count = Math.max((dish.count || 0) - 1, 0);
    this.updateCartItems(); // ✅ 更新购物车数组
  
    this.setData({ dishMap }, this.calculateCart);
  },

  updateCartItems() {
    const cart = [];
    this.countMap = {}; // 清空旧的
  
    Object.entries(this.data.dishMap).forEach(([key, list]) => {
      if (key === '推荐') return;
  
      list.forEach(d => {
        if (d.count && d.count > 0) {
          const type = d.items ? 'package' : 'dish';
          cart.push({
            id: d.id,
            name: d.name,
            price: d.price,
            count: d.count,
            type,
            image: d.image,
            originalPrice: d.originalPrice
          });
  
          // 同步到 countMap
          this.countMap[`${type}_${d.id}`] = d.count;
        }
      });
    });
  
    this.setData({ cartItems: cart });
  },
  
  calculateCart() {
    let totalPrice = 0;
    let cartCount = 0;
  
    // ✅ 遍历时跳过“推荐”分类
    Object.entries(this.data.dishMap).forEach(([key, list]) => {
      if (key === '推荐') return;
  
      list.forEach(d => {
        if (d.count) {
          cartCount += d.count;
          totalPrice += d.count * d.price;
        }
      });
    });
  
    this.setData({
      totalPrice: totalPrice.toFixed(2),
      cartCount
    });
  },

  clearCart() {
    const dishMap = this.data.dishMap;
  
    for (const tab in dishMap) {
      if (tab === '推荐') continue; // 推荐分类不参与清空
      dishMap[tab].forEach(d => d.count = 0);
    }
  
    // 清空 countMap
    this.countMap = {};
  
    this.setData({
      dishMap,
      cartCount: 0,
      totalPrice: '0.00',
      cartItems: [],
      showCartPanel: false // ✅ 建议直接 false，不用 toggle
    });
  },

  handleCartPlus(e) {
    const index = e.currentTarget.dataset.index;
    const { id, type } = this.data.cartItems[index];
    const dishMap = this.data.dishMap;
  
    Object.entries(dishMap).forEach(([category, list]) => {
      if (category === '推荐') return; // ✅ 跳过推荐
  
      list.forEach(d => {
        const isPackage = d.items !== undefined;
        const itemType = isPackage ? 'package' : 'dish';
        if (d.id === id && itemType === type) {
          d.count += 1;
        }
      });
    });
  
    this.setData({ dishMap }, () => {
      this.updateCartItems();
      this.calculateCart();
    });
  },
  
  handleCartMinus(e) {
    const index = e.currentTarget.dataset.index;
    const { id, type } = this.data.cartItems[index];
    const dishMap = this.data.dishMap;
  
    Object.entries(dishMap).forEach(([category, list]) => {
      if (category === '推荐') return; // ✅ 跳过推荐
  
      list.forEach(d => {
        const isPackage = d.items !== undefined;
        const itemType = isPackage ? 'package' : 'dish';
        if (d.id === id && itemType === type && d.count > 0) {
          d.count -= 1;
        }
      });
    });
  
    this.setData({ dishMap }, () => {
      this.updateCartItems();         // 更新购物车列表
      this.calculateCart();           // 重新计算价格
      // ✅ 延迟执行判断逻辑
      setTimeout(() => {
        if (this.data.cartItems.length === 0) {
          this.setData({ showCartPanel: false });
        }
      }, 50); // 小延迟让数据更新同步完成
    });
  },
  
  onPulling(e) {
    // 可选处理拖动状态
  },
  onRefresh() {
    this.setData({ isRefreshing: true });
  
    // 先加载分类，再加载菜品
    this.loadCategory().then(() => {
      return this.loadDishes();
    }).then(() => {
      this.setData({ isRefreshing: false });
    }).catch(() => {
      // 发生错误也关闭刷新状态
      this.setData({ isRefreshing: false });
    });
  },
  onRestore() {
    console.log('恢复状态');
  },
  onAbort() {
    console.log('用户中止刷新');
  },
  
  goToDishDetail(e) {
    const index = e.currentTarget.dataset.index;
    const categoryName = this.data.tabs[this.data.activeCategoryIndex]; // 当前分类名
    const dish = this.data.dishMap[categoryName][index]; // 当前类的第 index 个菜品或套餐
    const dishStr = encodeURIComponent(JSON.stringify(dish));
  
    console.log('发送菜品信息：', dish);
  
    // 判断是套餐还是普通菜品
    const detailPage = categoryName === '套餐' 
      ? '/pages/packageDetail/packageDetail' 
      : '/pages/dishDetail/dishDetail';
  
    wx.navigateTo({
      url: `${detailPage}?dish=${dishStr}`
    });
  }
})