
Page({
  /**
   * 页面的初始数据
   * 
   * function(event)
   * var app = getApp(),
   * 
   * 
   * on1:function(){
    wx.navigateTo({
      url: '../../pages/zixun/'
    })
  },
  
   */
  
  

  data: {
    navbar: ['高考头条', '数据快报', '升学路径','政策速递'],
    currentTab: 0,
    dataList1: [
      {
        goods_id:1,
        goods_title:'提高录取率！高考志愿这样填',
        goods_img:'../../images/timg (2).jpg',
        id:'../../pages/zixun/on1',
        goods_price:'2020.10.26'
      },{
        goods_id:2,
        goods_title:'[山东]2020年高考批次线已出',
        goods_img:'../../images/timg (3).jpg',
        id:'../../pages/zixun/on2',
        goods_price:'2020.9.18'
      }
      
    ],
    dataList2:[
      {
        goods_id:1,
        goods_title:'【山东】数据更新说明',
        goods_img:'../../images/timg (1).jpg',
        id:'../../pages/zixun/on2',
        goods_price:'2020.10.26'
      }
    ],
    /*dataList3:[
      {
        goods_id:1,
        goods_title:'0元出国服务费',
        goods_img:'../../images/timg (2).jpg',
        goods_price:'2020.10.26'
      },{
        goods_id:2,
        goods_title:'最新公告！！',
        goods_img:'../../images/timg (3).jpg',
       
        goods_price:'2020.9.18'
      }
    ]*/
    dataList4:[
      {
        goods_id:1,
        goods_title:'山东省2020年普通高等学校招生录取工作意见',
        goods_img:'../../images/timg.jpg',
        id:'../../pages/zixun/on3',
        goods_price:'2020.10.26'
      },{
        goods_id:2,
        goods_title:'【志愿填报】2019年自主招生批及本科普通批志愿填报注意事项',
        goods_img:'../../images/u=3428065315,22494120&fm=26&gp=0.png',
        id:'../../pages/zixun/on2',
        goods_price:'2020.9.18'
      }
    ]
  },
  navbarTap: function(e){
    this.setData({
      currentTab: e.currentTarget.dataset.idx
    })
  },

  search: function () {
    wx.navigateTo({
      url: '../find/find'
    })
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  
  methods: {
   
    switchTap(e){ //更换资讯大类
 
      let screenWidth = wx.getSystemInfoSync().windowWidth;
 
      let itemWidth = screenWidth/5;
 
      let { index,type } = e.currentTarget.dataset;
 
      const { nav_list } = this.data;
      
      let scrollX = itemWidth * index - itemWidth*2;
 
      let maxScrollX = (nav_list.length+1) * itemWidth;
      
      if(scrollX<0){
        scrollX = 0;
      } else if (scrollX >= maxScrollX){
        scrollX = maxScrollX;
      }
 
      this.setData({
        x: scrollX
      })
 
      this.triggerEvent("switchTap", type); //点击了导航,通知父组件重新渲染列表数据
 
    }
  }
  

  
})