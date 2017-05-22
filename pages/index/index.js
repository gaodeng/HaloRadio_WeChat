//index.js
//获取应用实例
var app = getApp();
var touchStartPos = [];
Page({
  data: {
    motto: 'Hello World 测试',
    userInfo: {},
    podcastList: [],
    hideSearchCancel: true,
    hideSearchClear: true,
    searchInputValue: '',
    searchInputFocus: false
  },
  //事件处理函数

  waveTouchStart: function (e) {
    console.log(e);
    touchStartPos = [e.touches[0].clientX - e.currentTarget.offsetLeft, e.touches[0].clientY - e.currentTarget.offsetTop];
  },
  waveTouchCancel: function (e) {

  },
  waveTouchEnd: function (e) {

  },
  waveTouchMove: function (e) {
    var xPos = e.touches[0].clientX - touchStartPos[0];
    var yPos = e.touches[0].clientY - touchStartPos[1];
    var waveWidth=50
    var padding=10;
    xPos = Math.min(app.globalData.systemInfo.windowWidth - waveWidth - 10,xPos);
    yPos = Math.min(app.globalData.systemInfo.windowHeight - waveWidth-48 - 10,yPos);
    xPos = Math.max(padding, xPos);
    yPos = Math.max(padding, yPos);
   // console.log(app.globalData.systemInfo);
    this.setData({ wavePos: [xPos, yPos] })

  },

  bindViewTap: function () {

  },
  catchSearchBoxTap: function () {

    this.setData({ searchInputFocus: true });
  },
  catchHideKeybord: function () {
    wx.hideKeyboard();
    this.setData({ searchInputValue: '' });
    this.updateSearchInputClearState();
  },
  updateSearchInputClearState: function () {
    if (this.data.searchInputValue.length > 0) {
      this.setData({ hideSearchClear: false })
    } else {
      this.setData({ hideSearchClear: true })
    }
  },
  catchSearchInputClear: function () {
    this.setData({ searchInputValue: '' });
    this.updateSearchInputClearState();
    this.setData({ searchInputFocus: true });
  },
  bindSearchInput: function (e) {
    this.setData({ searchInputValue: e.detail.value });
    this.updateSearchInputClearState();
    //return this.data.searchInputValue;
  },
  bindSearchInputFocus: function () {
    this.setData({ hideSearchCancel: false })
    this.updateSearchInputClearState();
  },
  bindSearchInputBlur: function () {
    this.setData({ hideSearchCancel: true })
    this.updateSearchInputClearState();
  },
  startSearch: function (e) {
    var value = e.detail.value
    var thisCtx = this;
    wx.request({
      url: "https://www.moon.fm/api/oneradio/v4/search/podcast?page=1&pagesize=10&search_k=" + value,
      data: {},
      header: {
        // "Content-Type":"application/json"
      },
      success: function (res) {
        console.log(res.data)
        thisCtx.setData({ podcastList: res.data.data });
      },
      fail: function (err) {
        console.log(err)
      }

    })
  },
  podcastTap: function (e) {
    console.log(e);
    var id = e.currentTarget.dataset.id;
    this.data.podcastList.forEach(value => {

      if (value.id == id) {
        console.log(value)
        wx.navigateTo({
          url: '../podcast/podcast?feed_url=' + value.feedURL + '&title=' + value.title + '&cover=' + value.img,
          data: e
        })

      }

    });

  },
  onLoad: function () {
    console.log('onLoad')
    var that = this;
    var padding=10;
    var waveSize=50;
    this.setData({ wavePos: [app.globalData.systemInfo.windowWidth - padding - waveSize, app.globalData.systemInfo.windowHeight - padding - waveSize-48]})

    this.onPullDownRefresh();
  },
  onPullDownRefresh: function () {

    var thisCtx = this;
    queryRequest({});
    function queryRequest(data) {
      wx.request({
        url: "https://www.moon.fm/api/oneradio/v3/hot",
        data: data,
        header: {
          // "Content-Type":"application/json"
        },
        success: function (res) {
          console.log(res.data)
          thisCtx.setData({ podcastList: res.data.data });
          wx.stopPullDownRefresh();
        },
        fail: function (err) {
          console.log(err)
          wx.stopPullDownRefresh();
        }

      })

    }

  },
})
