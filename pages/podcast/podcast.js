// podcast.js
var app = getApp();
var titleLoadingId
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


    wx.showToast({
      title: '开始播放',
     
      duration: 2000
    })
  },

  showNavBarLoading:function(){
    clearTimeout(titleLoadingId)
    titleLoadingId = setTimeout(() => wx.showNavigationBarLoading(), 100);
  },

  hideNavBarLoading:function(){
    clearTimeout(titleLoadingId);
    wx.hideNavigationBarLoading();
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);

    this.setData({author:options.title});
    this.setData({cover:options.cover});
    
    var thisCtx = this;
    var feedStr;
    
    wx.setNavigationBarTitle({
      title: decodeURI(options.title)
    })
    
    thisCtx.showNavBarLoading();
   


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
        thisCtx.hideNavBarLoading();


      },
      fail: function (err) {
        console.log(err)
        thisCtx.hideNavBarLoading();
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