const config = require('../../utils/config.js');
Page({
  data: {
    isRefreshing: false,
    activeCategoryIndex: 0,
    // 分类名称数组（用于 tabs）
    tabs: [],
    dishMap: {}
  },
  onShow() {
    this.loadCategory()
      .then(() => {
        this.loadDishes(); // ✅ 分类加载完再请求菜品
      })
      .catch(() => {
        console.warn('分类加载失败，未执行菜品加载');
      });
  },

  goToSearch() {
    wx.navigateTo({
      url: '/pages/search/search', // 你的搜索页面路径
    })
  },
  onScan() {
    // 1. 检查是否有本地 token
    const token = wx.getStorageSync('token');
    if (!token) {
      wx.showToast({
        title: '请先登录',
        icon: 'none'
      });
      return; // 阻止扫码
    }
    wx.scanCode({
      success: res => {
        console.log('扫码结果:', res.result); // 如: pages/food/food?table_id=1
  
        if (res.result.startsWith('pages/')) {
          // 提取 table_id
          const tableIdMatch = res.result.match(/table_id=(\d+)/);
          const table_id = tableIdMatch ? tableIdMatch[1] : null;
  
          if (table_id) {
            // ✅ 发送请求修改餐桌状态为 “点餐中”
            wx.request({
              url: config.UPDATE_TABLE_STATUS_API,  // 如 https://your.api/table/update_status/
              method: 'POST',
              header: { 'content-type': 'application/json' },
              data: {
                table_id: table_id,
                status: '点菜中'
              },
              success: () => {
                // ✅ 修改成功后跳转页面
                wx.navigateTo({
                  url: '/' + res.result
                });
              },
              fail: () => {
                wx.showToast({ title: '修改桌子状态失败', icon: 'none' });
              }
            });
          } else {
            wx.showToast({ title: '二维码缺少桌号', icon: 'none' });
          }
        } else {
          wx.showToast({ title: '二维码无效', icon: 'none' });
        }
      },
      fail: err => {
        console.error('扫码失败:', err);
        wx.showToast({ title: '扫码失败', icon: 'none' });
      }
    });
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
  loadCategory() {
    return new Promise((resolve, reject) => {
      wx.request({
        url: config.DISH_CATEGORY_API,
        method: 'GET',
        success: (res) => {
          if (res.statusCode === 200 && res.data.data) {
            const categories = res.data.data;
            const categoryNames = ['推荐', '套餐', ...categories.map(cat => cat.category_name)];
  
            this.setData({
              tabs: categoryNames
            });
  
            console.log('✅ 获取菜品分类成功：', categoryNames);
            resolve(); // ✅ 通知完成
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
        dishMap['推荐'] = []; // 推荐后面统一处理
      } else if (name === '套餐') {
        const req = new Promise((resolve, reject) => {
          wx.request({
            url: config.PACKAGE_LIST_API,
            method: 'GET',
            data: {
              status: 'on-shelf',
              sort: 'default',
              keyword: ''
            },
            success: res => {
              if (res.statusCode === 200 && res.data.data) {
                const rawPkgs = res.data.data;
                const pkgs = rawPkgs.map(pkg => {
                  // ✅ 处理图片路径
                  const items = pkg.items.map(i => ({
                    ...i,
                    image: i.image ? `${hostPrefix}${i.image}` : ''
                  }));
      
                  // ✅ originalPrice = 所有菜品单价 × 数量之和
                  const originalPrice = items.reduce((sum, item) => {
                    return sum + item.price * item.quantity;
                  }, 0);
      
                  return {
                    ...pkg,
                    image: pkg.image ? `${hostPrefix}${pkg.image}` : '',
                    items,
                    originalPrice: originalPrice.toFixed(2)  // 保留两位小数
                  };
                });
      
                dishMap['套餐'] = pkgs;
                resolve();
              } else {
                dishMap['套餐'] = [];
                console.warn('❗套餐加载失败');
                resolve();
              }
            },
            fail: err => {
              console.error('❌ 套餐加载异常', err);
              dishMap['套餐'] = [];
              resolve();
            }
          });
        });
      
        requests.push(req);
      } else {
        // 普通分类
        const req = new Promise((resolve, reject) => {
          wx.request({
            url: config.DISH_LIST_API,
            method: 'GET',
            data: {
              category: name,
              status: 'on-shelf',
              sort: 'default',
              keyword: ''
            },
            success: res => {
              if (res.statusCode === 200 && res.data.data) {
                const rawDishes = res.data.data;
                const dishes = rawDishes.map(d => ({
                  ...d,
                  image: `${hostPrefix}${d.image}`
                }));
                dishMap[name] = dishes;
                resolve();
              } else {
                dishMap[name] = [];
                resolve();
              }
            },
            fail: err => {
              console.error(`❌ 分类 ${name} 加载异常`, err);
              dishMap[name] = [];
              resolve();
            }
          });
        });
  
        requests.push(req);
      }
    });
  
    // 推荐挑选
    Promise.all(requests).then(() => {
      const allDishes = Object.entries(dishMap)
        .filter(([key]) => key !== '推荐' && key !== '套餐')
        .flatMap(([_, val]) => val);
  
      dishMap['推荐'] = allDishes.slice(0, 6);
      this.setData({ dishMap });
      console.log('✅ 所有分类菜品加载完毕：', dishMap);
    });
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
  
});