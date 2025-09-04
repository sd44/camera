https://developers.weixin.qq.com/miniprogram/dev/component/camera.html


保存到相册
https://segmentfault.com/q/1010000044619960
```
wx.downloadFile({
  url: 'https://example.com/yourfile', // 文件的URL地址
  success: function (res) {
    if (res.statusCode === 200) {
      // 下载成功，调用保存方法
      wx.saveImageToPhotosAlbum({
        filePath: res.tempFilePath, // 文件路径
        success: function (res) {
          console.log('图片保存成功');
        },
        fail: function (err) {
          console.error('图片保存失败', err);
        }
      });
    } else {
      console.error('下载失败', res.statusCode);
    }
  },
  fail: function (err) {
    console.error('下载失败', err);
  }
});
```

https://developers.weixin.qq.com/miniprogram/dev/api/open-api/authorize/wx.authorize.html
```
// 可以通过 wx.getSetting 先查询一下用户是否授权了 "scope.record" 这个 scope
wx.getSetting({
  success(res) {
    if (!res.authSetting['scope.record']) {
      wx.authorize({
        scope: 'scope.record',
        success () {
          // 用户已经同意小程序使用录音功能，后续调用 wx.startRecord 接口不会弹窗询问
          wx.startRecord()
        }
      })
    }
  }
})
```
```
