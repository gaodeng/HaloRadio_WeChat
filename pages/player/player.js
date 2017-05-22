// player.js
var playerStateUpdateId=0;
var app=getApp();
var lastTouchPos;
var thumbTouchStart=false;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentPosition:40,
    duration:120,
    downloadPercent:60,
    status:2,
    title:'',
    playPauseImg: '../../images/music_selected.png',
    cover:'../../images/album.png',
    thumbLeft:0,
    author:''
  },
  formatTimeLabel:function(sec){
    var date = new Date(null);
    date.setSeconds(sec); // specify value for SECONDS here
    return date.toISOString().substr(11, 8);
    
  },
  updatePlayerState:function(){
    var thisCtx=this;
    wx.getBackgroundAudioPlayerState({
      success: function (res) {
        console.log(res);
        var status = res.status
        var dataUrl = res.dataUrl
        var currentPosition = res.currentPosition
        var duration = res.duration
        var downloadPercent = res.downloadPercent
        console.log(res);
        if(status==0){
          thisCtx.setData({ playPauseImg: '../../images/play.png' });
        }else if(status==1){
          thisCtx.setData({ playPauseImg: '../../images/pause.png' });
        }else{
          thisCtx.setData({ playPauseImg: '../../images/music_selected.png' });
        }

        var p=duration==0?0:currentPosition/duration;
        if(!thumbTouchStart)
        thisCtx.setData({ thumbLeft: (p*100) });

        thisCtx.setData({ status: status});
        thisCtx.setData({ dataUrl: dataUrl });
        thisCtx.setData({ currentPosition: currentPosition });
        thisCtx.setData({ duration: duration });
        thisCtx.setData({ downloadPercent: downloadPercent });
        thisCtx.setData({ currentPositionLabel: thisCtx.formatTimeLabel(currentPosition)});
        thisCtx.setData({ durationLabel: thisCtx.formatTimeLabel(duration) });
        clearTimeout(playerStateUpdateId);
        playerStateUpdateId = setTimeout(thisCtx.updatePlayerState,1000);
      }
    })
    //console.log("get statussssss");

  },

  playPauseTapHandler:function(){
    var thisCtx=this;
    const backgroundAudioManager = wx.getBackgroundAudioManager();
    console.log(this.data.status)
    if(this.data.status==0){
      thisCtx.setData({ playPauseImg: '../../images/play.png' });
      setTimeout(() => backgroundAudioManager.play(),10);
      
      
    }else if(this.data.status==1){
      thisCtx.setData({ playPauseImg: '../../images/pause.png' });
      setTimeout(() => backgroundAudioManager.pause(), 10);
    }
    this.updatePlayerState();
  },

  thumbTouchStart:function(e){
    //console.log("touch start")
    thumbTouchStart = true;
    lastTouchPos = [e.touches[0].clientX, e.touches[0].clientY];
  },
  thumbTouchMove: function (e) {
    //console.log("touch move")
    if(!lastTouchPos){
      return ;
    }
    var diffX=e.touches[0].clientX-lastTouchPos[0];
    var p=100*diffX/app.globalData.systemInfo.windowWidth;
    var l = p + this.data.thumbLeft;
    l=Math.min(l,100);
    l=Math.max(l,0);
    //console.log("touch left",l)
    
    this.setData({thumbLeft:l});
    lastTouchPos = [e.touches[0].clientX, e.touches[0].clientY];

    

  },
  thumbTouchEnd: function (e) {

    lastTouchPos=null;
    thumbTouchStart=false;
    const backgroundAudioManager = wx.getBackgroundAudioManager();
    backgroundAudioManager.seek(this.data.duration * this.data.thumbLeft/100.0);
  },
  thumbTouchCancel: function (e) {
    lastTouchPos = null;
    thumbTouchStart = false;
    const backgroundAudioManager = wx.getBackgroundAudioManager();
    backgroundAudioManager.seek(this.data.duration * this.data.thumbLeft / 100.0);
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    this.updatePlayerState();
    if (!app.globalData.currentTrack)
      return ;
    this.setData({ cover: app.globalData.currentTrack.cover});
    this.setData({ author: app.globalData.currentTrack.author});
    this.setData({ title: app.globalData.currentTrack.title});

    wx.setNavigationBarTitle({
      title: app.globalData.currentTrack.author ? app.globalData.currentTrack.author:'HaloRadio'
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
    clearTimeout(playerStateUpdateId);
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
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
  
  }
})