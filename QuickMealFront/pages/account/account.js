Page({
  data: {
    name: '',
    phone: '',
    avatarUrl: '/images/avatar.jpg'
  },

  onLoad(options) {
    this.setData({
      name: options.name || '',
      phone: options.phone || '',
      avatarUrl: options.avatarUrl || '/images/avatar.jpg'
    });
  },

  // 返回上一页
  onBack() {
    wx.navigateBack({
      delta: 1
    });
  },

  // 更换头像
  onChangeAvatar() {
    wx.chooseMedia({
      count: 1,
      mediaType: ['image'],
      success: (res) => {
        const tempFilePath = res.tempFiles[0].tempFilePath;
        this.setData({ avatarUrl: tempFilePath });
      }
    });
  },

  // 修改昵称
  editName() {
    wx.showModal({
      title: '修改昵称',
      editable: true,
      placeholderText: '输入新昵称',
      success: (res) => {
        if (res.confirm && res.content) {
          this.setData({ name: res.content });
        }
      }
    });
  },

  // 修改手机号
  editPhone() {
    wx.showModal({
      title: '修改手机号',
      editable: true,
      placeholderText: '输入新手机号',
      success: (res) => {
        if (res.confirm && res.content) {
          this.setData({ phone: res.content });
        }
      }
    });
  },

  // 注销账号
  onDeleteAccount() {
    wx.showModal({
      title: "注销账号",
      content: "账号注销后将无法恢复，是否继续？",
      confirmText: "确认注销",
      confirmColor: "#e64340",
      success: (res) => {
        if (res.confirm) {
          wx.clearStorageSync();
          wx.reLaunch({
            url: '/pages/login/login'
          });
        }
      }
    });
  },

  // 返回时同步数据到个人中心
  onUnload() {
    const pages = getCurrentPages();
    const prevPage = pages[pages.length - 2];
    if (prevPage && prevPage.route === "pages/profile") {
      prevPage.setData({
        'user.name': this.data.name,
        'user.phone': this.data.phone,
        'user.avatarUrl': this.data.avatarUrl
      });
    }
  }
});
