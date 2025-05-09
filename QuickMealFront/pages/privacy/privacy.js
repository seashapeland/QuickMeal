Page({
  data: {
    sections: [
      {
        title: "1. 数据收集说明",
        content: "我们在您使用本系统时可能会收集必要的用户信息，如昵称、头像、手机号等。"
      },
      {
        title: "2. 数据使用说明",
        content: "收集的数据仅用于系统功能实现与服务优化，不会泄露给任何未经授权的第三方。"
      },
      {
        title: "3. 用户权利",
        content: "您有权访问、更正或删除您的个人信息。如需协助，请联系我们的客服支持。"
      },
      {
        title: "4. 安全保障",
        content: "我们使用微信平台提供的安全技术，确保用户数据在传输与存储过程中的安全。"
      },
      {
        title: "5. 联系方式",
        content: "如您对隐私政策有任何疑问，可通过小程序内的客服与我们取得联系。"
      }
    ]
  },

  onLoad() {
    wx.setNavigationBarTitle({
      title: '安全与隐私'
    });
  },

  goBack() {
    wx.navigateBack({
      delta: 1
    });
  }
});