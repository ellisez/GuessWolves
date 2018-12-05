// game/index.js
const websocket = require('../js/websocket');
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    no: 1001,
    isDisconnect: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    const that = this;

    var url = app.wss + '/hall';
    var success = false;
    var client = websocket.connectSocket({
      url: url,
      success() {
        success = true;
      },
      fail() {
        success = false;
      }
    });
    if (!success) {
      return;
    }
    that.websocket = client;
    that.websocket.onOpen(function () {
      that.setData({
        isDisconnect: false
      })
      that.login();
    });
    that.websocket.onClose(function () {
      that.setData({
        isDisconnect: true
      })
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    this.onUnload();
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    const that = this;
    if (that.websocket) {
      that.websocket.close();
      that.websocket = null;
    }
  },
  login() {
    const that = this;
    this.websocket.http({
      action: 'login',
      data: {
        user: wx.getStorageSync('user'),
        img: wx.getStorageSync('img')
      },
      success(res) {
        that.joinGame();
      }
    });
  },
  joinGame() {
    const that = this;
    this.websocket.http({
      action: 'joinGame',
      data: this.data.no,
      success(res) {
        var game = res.data;
        that.setData({
          game: game
        });
        console.log(game);
      },
      fail() {

      }
    });
  },
  touchstart(res) {
    if (this.data.userbar) {
      this.setData({
        userbar: false
      });
    } else {
      try {
        this.startX = res.changedTouches[0].clientX;
        this.startY = res.changedTouches[0].clientY;
      } catch(e) {

      }
    }
  },
  touchend(res) {
    if (this.startX == null) {
      return;
    }
    try {
      var endX = res.changedTouches[0].clientX;
      var endY = res.changedTouches[0].clientY;

      if (endX < this.startX) {
        this.startX = null;
        this.startY = null;
        return;
      }

      var absX = Math.abs(endX - this.startX);
      var absY = Math.abs(endY - this.startY);

      this.startX = null;
      this.startY = null;

      if (absX > absY && absX > 60) {
        this.setData({
          userbar: true
        });
      }
    } catch (e) {

    }
  }
})