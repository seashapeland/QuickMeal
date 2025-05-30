const config = require('../../utils/config');
Page({
  data: {
    name: '',
    avatarUrl: ''
  },

  onLoad(options) {
    this.setData({
      name: decodeURIComponent(options.name || ''),
      avatarUrl: decodeURIComponent(options.avatarUrl)
    });
  },

  // 返回上一页
  goBack() {
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
        const tempFilePath = res.tempFiles[0].tempFilePath || res.tempFiles[0].path;
        console.log('选中的图片路径:', tempFilePath);
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

  onUpdate() {
    const user_id = wx.getStorageSync('user_id');
    const { name, avatarUrl } = this.data;
  
    if (!user_id || !name || !avatarUrl) {
      wx.showToast({ title: '信息不完整', icon: 'none' });
      return;
    }
  
    wx.showLoading({ title: '更新中...' });
  
    const isTempFile = avatarUrl.includes('/tmp/') || avatarUrl.includes('wxfile://');
    console.log(isTempFile)
    if (isTempFile) {
      
      // 上传头像和昵称
      wx.uploadFile({
        url: config.USER_UPDATE_API,  // ✅ 后端接口
        filePath: avatarUrl,
        name: 'avatar',
        formData: {
          user_id,
          username: name
        },
        success: (res) => {
          wx.hideLoading();
          const data = JSON.parse(res.data || '{}');
  
          if (res.statusCode === 200) {
            wx.setStorageSync('username', data.username);
            wx.setStorageSync('avatar', data.avatar);
            wx.showToast({ title: '更新成功', icon: 'success' });
            wx.switchTab({
              url: '/pages/profile/profile'
            });
          } else {
            wx.showToast({ title: data.message || '更新失败', icon: 'none' });
          }
        },
        fail: () => {
          wx.hideLoading();
          wx.showToast({ title: '上传失败', icon: 'none' });
        }
      });
    } else {
      // 只更新昵称，无需上传头像
      wx.request({
        url: config.USER_UPDATE_API,
        method: 'POST',
        header: { 'content-type': 'application/x-www-form-urlencoded' },
        data: {
          user_id,
          username: name
        },
        success: (res) => {
          wx.hideLoading();
          if (res.statusCode === 200) {
            wx.setStorageSync('username', res.data.username);
            wx.showToast({ title: '更新成功', icon: 'success' });
            wx.switchTab({
              url: '/pages/profile/profile'
            });
          } else {
            wx.showToast({ title: res.data.message || '更新失败', icon: 'none' });
          }
        },
        fail: () => {
          wx.hideLoading();
          wx.showToast({ title: '请求失败', icon: 'none' });
        }
      });
    }
  },

  // 注销账号
  onDeleteAccount() {
    wx.showModal({
      title: "退出登录",
      content: "退出登录后将无法恢复，是否继续？",
      confirmText: "确认退出",
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

  
});
