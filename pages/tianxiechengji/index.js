// pages/tianxiechengji/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    array: ['普通招生', '不普通招生'],
    objectArray: [
      {
        id: 0,
        name: '普通招生'
      },
      {
        id: 1,
        name: '不普通招生'
      },
    ],
    index:0,
    multiArray:[['物理','政治'],['化学','历史'],['生物','地理']],
    objectMultiArray:[
      [
        {
          id:0,
          name:'物理'
        },
        {
          id:1,
          name:'政治'
        }
      ],[
        {
          id:0,
          name:'化学'
        },
        {
          id:1,
          name:'历史'
        }
      ],[
        {
          id:0,
          name:'生物'
        },
        {
          id:1,
          name:'地理'
        }
      ]
    ],
    multiIndex: [0, 0, 0],

  },
  bindPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    })
  },
  bindMultiPickerChange:function(e){
    console.log('picker发送选择改变，携带值为',e.detail.value)
    this.setData({
      multiIndex:e.detail.value
    })
  },
  bindMultiPickerColumnChange:function(e){
    console.log('修改的列为',e.detail.column,',值为',e.detail.value);
    var data={
      multiArray:this.data.multiArray,
      multiIndex:this.data.multiIndex
    };
    data.multiIndex[e.detail.column]=e.detail.value;
    switch(e.detail.column){
      case 0:
        switch(data.multiIndex[0]){
          case 0:
            data.multiArray[1]=['化学','历史'];
            data.multiArray[2]=['生物','地理'];
            break;
          case 1:
            data.multiArray[1]=['化学','历史'];
            data.multiArray[2]=['生物','地理'];
            break;
        }
        data.multiIndex[1]=0;
        data.multiIndex[2]=0;
        break;
      case 1:
        switch(data.multiIndex[0]){
          case 0:
            switch(data.multiIndex[1]){
              case 0:
                data.multiArray[2]=['化学','历史'];
                break;
              case 1:  
                data.multiArray[2]=['生物','地理'];
                break;
            }
            break;
          case 1:
            switch(data.multiIndex[1]){
              case 0:
                data.multiArray[2]=['化学','历史']
                break;
              case 1:
                data.multiArray[2]=['生物','地理']
                break;
            }
            break;
        }
        data.multiIndex[2]=0;
        console.log(data.multiIndex);
        break;
    }
    this.setData(data);
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