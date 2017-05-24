// podcast.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    feedStr: 'loading',
    showLoading:true,
    items:[],
    cover:'',
    author:''
  },

  bindItemTap:function(e){
    
    var data = e.currentTarget.dataset;
    const backgroundAudioManager = wx.getBackgroundAudioManager()

    backgroundAudioManager.title = data.author
    backgroundAudioManager.epname = data.title
    backgroundAudioManager.singer = data.author
    backgroundAudioManager.coverImgUrl = data.cover;
    backgroundAudioManager.src = data.streamUrl;
    backgroundAudioManager.duration=120;
    app.globalData.currentTrack={author:data.author,title:data.title,cover:data.cover,streamURL:data.streamUrl}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);

    this.setData({author:options.title});
    this.setData({cover:options.cover});
    wx.stopPullDownRefresh()
    var thisCtx = this;
    var feedStr;
    wx.setNavigationBarTitle({
      title: options.title
    })
    //wx.showNavigationBarLoading() 



    wx.request({
      url: "https://www.moon.fm/get_feed.php?feedurl="+options.feed_url,
      data: {},
      header: {
        // "Content-Type":"application/json"
      },
      success: function (res) {
        console.log('feeedddddddddddddddddddd',res.data)
        thisCtx.setData({showLoading:false});
        thisCtx.setData({ feedStr: res.data });
        console.log("parssssssssss");
        
        
       
        var items=res.data.items;
        
        thisCtx.setData({items});
        


      },
      fail: function (err) {
        console.log(err)
      }

    })


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

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  parseRSS:function(str){
   
  }
})