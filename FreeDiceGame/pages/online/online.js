// pages/online/online.js
var timer;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    img: [{
      index: "/pages/image/1point.jpg"
    },
    {
      index: "/pages/image/2point.jpg"
    },
    {
      index: "/pages/image/3point.jpg"
    },
    {
      index: "/pages/image/4point.jpg"
    },
    {
      index: "/pages/image/5point.jpg"
    },
    {
      index: "/pages/image/6point.jpg"
    },
  ],
    index: 0, //存储下标
    timer: "", //存储计时器
    timers: true, //防止连续点击 类似防抖
    title: "?", //判断文本
    player1_counts: 0, //记录玩家1棋盘上骰子数
    player2_counts: 0, //记录玩家2棋盘上骰子数
    player1_score: 0, //记录玩家1的得分
    player2_score: 0, //记录玩家2的得分
    player1_mark: 0, //记录当前轮次
    player2_mark: 0,
    counts: 0,
    position: "",
    size: 0,
    // 记录双方棋盘各个位置的点数
    player1k1: 0, player1e1: 0, player1x1: 0,
    player1k2: 0, player1e2: 0, player1x2: 0,
    player1k3: 0, player1e3: 0, player1x3: 0,
    
    player2k1: 0, player2e1: 0, player2x1: 0,
    player2k2: 0, player2e2: 0, player2x2: 0,
    player2k3: 0, player2e3: 0, player2x3: 0,
  
    player1_one_counts: 0,
    player1_two_counts: 0,
    player1_three_counts: 0,
    player1_four_counts: 0,
    player1_five_counts: 0,
    player1_six_counts: 0,
  
    player2_one_counts: 0,
    player2_two_counts: 0,
    player2_three_counts: 0,
    player2_four_counts: 0,
    player2_five_counts: 0,
    player2_six_counts: 0,

    player_counts : 0
  },
  li(a) {
    // 获取向下取整随机数
    this.data.index = Math.floor(Math.random() * 6)
    // 更新数据
    this.setData({
      index: this.data.index,
    })
  },
  // 开始按钮
  btnStart() {
    // 防止连续点击
    // clearInterval(this.data.timer)
    // 判断this.data.timers ，
    // this.data.timers 为true执行操作，为false则不执行操作
    if (this.data.timers) {
    this.data.timers = false
      //隔100毫秒换一张图
      // console.log("0"+" ")
      this.data.timer = setInterval(() => {
        this.li()
      }, 100)
   }
  },
  // 停止按钮
  btnEnd() {
    // 延时器
    // 停止计时器
    clearInterval(this.data.timer)
    this.data.timers = true
    // 更新数据 
     this.setData({
      title: this.data.title
    })
  },
player: function() {
  wx.showToast({
    title: '正在匹配',//提示文字
    duration:2000,//显示时长
    mask:true,//是否显示透明蒙层，防止触摸穿透，默认：false  
    icon:'loading', //图标，支持"success"、"loading"  
 })
  this.match()
},
surrender: function() {
  var that = this
  wx.showModal({
    title: '提示',
    //使用\r\n进行消息换行
    content: '是否确定要投降',
    cancelText: '否',
    confirmText: '是', //确认按钮的文字，最多 4 个字符
    success: function (res) {
    if (res.confirm) {
      console.log('玩家选择了投降')
      that.gameover()
    }
  }
})
},
match: function(){
  var that = this
  console.log('开始匹配')
  wx.request({
    url: 'http://47.113.179.4:5000/match',
    method: "POST",
    header: {
      'content-type': 'application/x-www-form-urlencoded',
      'chartset': 'utf-8'
    },
    success: function (res) {
      console.log(res.data);
   },
  })
  timer = setInterval(this.Confirm_number, 1000);
},

Confirm_number() {
  var that = this;
  wx.request({
    url: 'http://47.113.179.4:5000/match_counts',
    method: "POST",
    header: {
      'content-type': 'application/x-www-form-urlencoded',
      'chartset': 'utf-8'
    },
    success: function (res) {
      console.log(res.data);
      that.setData({
        player_counts: res.data,
      })
      if(res.data==1){
        that.setData({
          player1_mark: 1,
          player2_mark: 0,
        })
      }
   },
  })
  console.log("当前匹配人数：" + this.data.player_counts)
  if(this.data.player_counts==2){
    clearInterval(timer)
  if(this.data.player1_mark==1&this.data.player2_mark==0){
    wx.showToast({
      title: '匹配成功',//提示文字
      duration:1000,//显示时长
      mask:true,//是否显示透明蒙层，防止触摸穿透，默认：false  
      icon:'success', //图标，支持"success"、"loading"  
   })
   sleep(1500)
   wx.showModal({
    title: '提示',
    //使用\r\n进行消息换行
    content: '您是玩家一\r\n请先掷骰子',
    showCancel: false, //是否显示取消按钮
    confirmText: '确定', //确认按钮的文字，最多 4 个字符
    success: function (res) {
      console.log("玩家一准备开始游戏")
    }
  })
    timer = setInterval(this.player1, 1000);
  }
  if(this.data.player1_mark==0&this.data.player2_mark==0){
    wx.showToast({
      title: '匹配成功',//提示文字
      duration:1000,//显示时长
      mask:true,//是否显示透明蒙层，防止触摸穿透，默认：false  
      icon:'success', //图标，支持"success"、"loading"  
   })
   sleep(1500)
   wx.showModal({
    title: '提示',
    //使用\r\n进行消息换行
    content: '您是玩家二\r\n请等待对方掷骰子',
    showCancel: false, //是否显示取消按钮
    confirmText: '确定', //确认按钮的文字，最多 4 个字符
    success: function (res) {
      console.log("玩家二准备开始游戏")
    }
  })
    timer = setInterval(this.player2, 1000);
  }

  }
},
Data_change() {
  var that = this;
  wx.request({
    url: 'http://47.113.179.4:5000/match_counts',
    method: "POST",
    header: {
      'content-type': 'application/x-www-form-urlencoded',
      'chartset': 'utf-8'
    },
    success: function (res) {
      console.log(res.data);
      that.setData({
        player_counts: res.data,
      })
   },
  })
  console.log("当前匹配人数：" + this.data.player_counts)
  if(this.data.player_counts==2){
    clearInterval(timer)
  }
},

player1: function() {
  var that = this;
  wx.request({
    url: 'http://47.113.179.4:5000/data_get_player1',
    method: "POST",
    header: {
      'content-type': 'application/x-www-form-urlencoded',
      'chartset': 'utf-8'
    },
    success: function (res) {
      console.log(res.data);
      var position = Object.values(res.data)[0]
      var size = Object.values(res.data)[1]
      if(size!=0){
        that.setData({
          position: position,
          size: size,
        })
        if(that.data.position=="player2k1"){
          that.setData({
            player2k1: that.data.size,
            player2_counts: that.data.player2_counts+1,
          })
          if(that.data.player2k1==that.data.player1k1)
            that.setData({
            player1k1: 0,
            player1_counts: that.data.player1_counts-1
          })
          if(that.data.player2k1==that.data.player1k2)
              that.setData({
              player1k2: 0,
              player1_counts: that.data.player1_counts-1
            })
          if(that.data.player2k1==that.data.player1k3)
            that.setData({
              player1k3: 0,
              player1_counts: that.data.player1_counts-1
            })
          console.log("玩家1的骰子数为："+that.data.player1_counts)
          console.log("玩家2的骰子数为："+that.data.player2_counts)
        }
        if(that.data.position=="player2k2"){
          that.setData({
            player2k2: that.data.size,
            player2_counts: that.data.player2_counts+1,
          })
          if(that.data.player2k2==that.data.player1k1)
            that.setData({
            player1k1: 0,
            player1_counts: that.data.player1_counts-1
          })
          if(that.data.player2k2==that.data.player1k2)
              that.setData({
              player1k2: 0,
              player1_counts: that.data.player1_counts-1
            })
          if(that.data.player2k2==that.data.player1k3)
            that.setData({
              player1k3: 0,
              player1_counts: that.data.player1_counts-1
            })
          console.log("玩家1的骰子数为："+that.data.player1_counts)
          console.log("玩家2的骰子数为："+that.data.player2_counts)
        }
        if(that.data.position=="player2k3"){
          that.setData({
            player2k3: that.data.size,
            player2_counts: that.data.player2_counts+1,
          })
          if(that.data.player2k3==that.data.player1k1)
            that.setData({
            player1k1: 0,
            player1_counts: that.data.player1_counts-1
          })
          if(that.data.player2k3==that.data.player1k2)
              that.setData({
              player1k2: 0,
              player1_counts: that.data.player1_counts-1
            })
          if(that.data.player2k3==that.data.player1k3)
            that.setData({
              player1k3: 0,
              player1_counts: that.data.player1_counts-1
            })
          console.log("玩家1的骰子数为："+that.data.player1_counts)
          console.log("玩家2的骰子数为："+that.data.player2_counts)
        }
        if(that.data.position=="player2e1"){
          that.setData({
            player2e1: that.data.size,
            player2_counts: that.data.player2_counts+1,
          })
          if(that.data.player2e1==that.data.player1e1)
            that.setData({
            player1e1: 0,
            player1_counts: that.data.player1_counts-1
          })
          if(that.data.player2e1==that.data.player1e2)
              that.setData({
              player1e2: 0,
              player1_counts: that.data.player1_counts-1
            })
          if(that.data.player2e1==that.data.player1e3)
            that.setData({
              player1e3: 0,
              player1_counts: that.data.player1_counts-1
            })
          console.log("玩家1的骰子数为："+that.data.player1_counts)
          console.log("玩家2的骰子数为："+that.data.player2_counts)
        }
        if(that.data.position=="player2e2"){
          that.setData({
            player2e2: that.data.size,
            player2_counts: that.data.player2_counts+1,
          })
          if(that.data.player2e2==that.data.player1e1)
            that.setData({
            player1e1: 0,
            player1_counts: that.data.player1_counts-1
          })
          if(that.data.player2e2==that.data.player1e2)
              that.setData({
              player1e2: 0,
              player1_counts: that.data.player1_counts-1
            })
          if(that.data.player2e2==that.data.player1e3)
            that.setData({
              player1e3: 0,
              player1_counts: that.data.player1_counts-1
            })
          console.log("玩家1的骰子数为："+that.data.player1_counts)
          console.log("玩家2的骰子数为："+that.data.player2_counts)
        }
        if(that.data.position=="player2e3"){
          that.setData({
            player2e3: that.data.size,
            player2_counts: that.data.player2_counts+1,
          })
          if(that.data.player2e3==that.data.player1e1)
            that.setData({
            player1e1: 0,
            player1_counts: that.data.player1_counts-1
          })
          if(that.data.player2e3==that.data.player1e2)
              that.setData({
              player1e2: 0,
              player1_counts: that.data.player1_counts-1
            })
          if(that.data.player2e3==that.data.player1e3)
            that.setData({
              player1e3: 0,
              player1_counts: that.data.player1_counts-1
            })
          console.log("玩家1的骰子数为："+that.data.player1_counts)
          console.log("玩家2的骰子数为："+that.data.player2_counts)
        }
        if(that.data.position=="player2x1"){
          that.setData({
            player2x1: that.data.size,
            player2_counts: that.data.player2_counts+1,
          })
          if(that.data.player2x1==that.data.player1x1)
            that.setData({
            player1x1: 0,
            player1_counts: that.data.player1_counts-1
          })
          if(that.data.player2x1==that.data.player1x2)
              that.setData({
              player1x2: 0,
              player1_counts: that.data.player1_counts-1
            })
          if(that.data.player2x1==that.data.player1x3)
            that.setData({
              player1x3: 0,
              player1_counts: that.data.player1_counts-1
            })
          console.log("玩家1的骰子数为："+that.data.player1_counts)
          console.log("玩家2的骰子数为："+that.data.player2_counts)
        }
        if(that.data.position=="player2x2"){
          that.setData({
            player2x2: that.data.size,
            player2_counts: that.data.player2_counts+1,
          })
          if(that.data.player2x2==that.data.player1x1)
            that.setData({
            player1x1: 0,
            player1_counts: that.data.player1_counts-1
          })
          if(that.data.player2x2==that.data.player1x2)
              that.setData({
              player1x2: 0,
              player1_counts: that.data.player1_counts-1
            })
          if(that.data.player2x2==that.data.player1x3)
            that.setData({
              player1x3: 0,
              player1_counts: that.data.player1_counts-1
            })
          console.log("玩家1的骰子数为："+that.data.player1_counts)
          console.log("玩家2的骰子数为："+that.data.player2_counts)
        }
        if(that.data.position=="player2x3"){
          that.setData({
            player2x3: that.data.size,
            player2_counts: that.data.player2_counts+1,
          })
          if(that.data.player2x3==that.data.player1x1)
            that.setData({
            player1x1: 0,
            player1_counts: that.data.player1_counts-1
          })
          if(that.data.player2x3==that.data.player1x2)
              that.setData({
              player1x2: 0,
              player1_counts: that.data.player1_counts-1
            })
          if(that.data.player2x3==that.data.player1x3)
            that.setData({
              player1x3: 0,
              player1_counts: that.data.player1_counts-1
            })
          console.log("玩家1的骰子数为："+that.data.player1_counts)
          console.log("玩家2的骰子数为："+that.data.player2_counts)
        }
        if(that.data.player2_counts==9){
          that.gameover()
        }
        that.setData({
          player1_mark: 1,
        })
      }
   },
  })
},

player2: function() {
  var that = this;
  wx.request({
    url: 'http://47.113.179.4:5000/data_get_player2',
    method: "POST",
    header: {
      'content-type': 'application/x-www-form-urlencoded',
      'chartset': 'utf-8'
    },
    success: function (res) {
      console.log(res.data);
      var position = Object.values(res.data)[0]
      var size = Object.values(res.data)[1]
      if(size!=0){
        that.setData({
          position: position,
          size: size,
        })
        console.log(that.data.position)
        console.log(that.data.size)
        if(that.data.position=="player1k1"){
          that.setData({
            player1k1: that.data.size,
            player1_counts: that.data.player1_counts+1,
          })
          if(that.data.player1k1==that.data.player2k1)
            that.setData({
            player2k1: 0,
            player2_counts: that.data.player2_counts-1
          })
          if(that.data.player1k1==that.data.player2k2)
              that.setData({
              player2k2: 0,
              player2_counts: that.data.player2_counts-1
            })
          if(that.data.player1k1==that.data.player2k3)
            that.setData({
              player2k3: 0,
              player2_counts: that.data.player2_counts-1
            })
          console.log("玩家1的骰子数为："+that.data.player1_counts)
          console.log("玩家2的骰子数为："+that.data.player2_counts)
        }
        if(that.data.position=="player1k2"){
          that.setData({
            player1k2: that.data.size,
            player1_counts: that.data.player1_counts+1,
          })
          if(that.data.player1k2==that.data.player2k1)
            that.setData({
            player2k1: 0,
            player2_counts: that.data.player2_counts-1
          })
          if(that.data.player1k2==that.data.player2k2)
              that.setData({
              player2k2: 0,
              player2_counts: that.data.player2_counts-1
            })
          if(that.data.player1k2==that.data.player2k3)
            that.setData({
              player2k3: 0,
              player2_counts: that.data.player2_counts-1
            })
          console.log("玩家1的骰子数为："+that.data.player1_counts)
          console.log("玩家2的骰子数为："+that.data.player2_counts)
        }
        if(that.data.position=="player1k3"){
          that.setData({
            player1k3: that.data.size,
            player1_counts: that.data.player1_counts+1,
          })
          if(that.data.player1k3==that.data.player2k1)
            that.setData({
            player2k1: 0,
            player2_counts: that.data.player2_counts-1
          })
          if(that.data.player1k3==that.data.player2k2)
              that.setData({
              player2k2: 0,
              player2_counts: that.data.player2_counts-1
            })
          if(that.data.player1k3==that.data.player2k3)
            that.setData({
              player2k3: 0,
              player2_counts: that.data.player2_counts-1
            })
          console.log("玩家1的骰子数为："+that.data.player1_counts)
          console.log("玩家2的骰子数为："+that.data.player2_counts)
        }
        if(that.data.position=="player1e1"){
          that.setData({
            player1e1: that.data.size,
            player1_counts: that.data.player1_counts+1,
          })
          if(that.data.player1e1==that.data.player2e1)
            that.setData({
            player2e1: 0,
            player2_counts: that.data.player2_counts-1
          })
          if(that.data.player1e1==that.data.player2e2)
              that.setData({
              player2e2: 0,
              player2_counts: that.data.player2_counts-1
            })
          if(that.data.player1e1==that.data.player2e3)
            that.setData({
              player2e3: 0,
              player2_counts: that.data.player2_counts-1
            })
          console.log("玩家1的骰子数为："+that.data.player1_counts)
          console.log("玩家2的骰子数为："+that.data.player2_counts)
        }
        if(that.data.position=="player1e2"){
          that.setData({
            player1e2: that.data.size,
            player1_counts: that.data.player1_counts+1,
          })
          if(that.data.player1e2==that.data.player2e1)
            that.setData({
            player2e1: 0,
            player2_counts: that.data.player2_counts-1
          })
          if(that.data.player1e2==that.data.player2e2)
              that.setData({
              player2e2: 0,
              player2_counts: that.data.player2_counts-1
            })
          if(that.data.player1e2==that.data.player2e3)
            that.setData({
              player2e3: 0,
              player2_counts: that.data.player2_counts-1
            })
          console.log("玩家1的骰子数为："+that.data.player1_counts)
          console.log("玩家2的骰子数为："+that.data.player2_counts)
        }
        if(that.data.position=="player1e3"){
          that.setData({
            player1e3: that.data.size,
            player1_counts: that.data.player1_counts+1,
          })
          if(that.data.player1e3==that.data.player2e1)
            that.setData({
            player2e1: 0,
            player2_counts: that.data.player2_counts-1
          })
          if(that.data.player1e3==that.data.player2e2)
              that.setData({
              player2e2: 0,
              player2_counts: that.data.player2_counts-1
            })
          if(that.data.player1e3==that.data.player2e3)
            that.setData({
              player2e3: 0,
              player2_counts: that.data.player2_counts-1
            })
          console.log("玩家1的骰子数为："+that.data.player1_counts)
          console.log("玩家2的骰子数为："+that.data.player2_counts)
        }
        if(that.data.position=="player1x1"){
          that.setData({
            player1x1: that.data.size,
            player1_counts: that.data.player1_counts+1,
          })
          if(that.data.player1x1==that.data.player2x1)
            that.setData({
            player2x1: 0,
            player2_counts: that.data.player2_counts-1
          })
          if(that.data.player1x1==that.data.player2x2)
              that.setData({
              player2x2: 0,
              player2_counts: that.data.player2_counts-1
            })
          if(that.data.player1x1==that.data.player2x3)
            that.setData({
              player2x3: 0,
              player2_counts: that.data.player2_counts-1
            })
          console.log("玩家1的骰子数为："+that.data.player1_counts)
          console.log("玩家2的骰子数为："+that.data.player2_counts)
        }
        if(that.data.position=="player1x2"){
          that.setData({
            player1x2: that.data.size,
            player1_counts: that.data.player1_counts+1,
          })
          if(that.data.player1x2==that.data.player2x1)
            that.setData({
            player2x1: 0,
            player2_counts: that.data.player2_counts-1
          })
          if(that.data.player1x2==that.data.player2x2)
              that.setData({
              player2x2: 0,
              player2_counts: that.data.player2_counts-1
            })
          if(that.data.player1x2==that.data.player2x3)
            that.setData({
              player2x3: 0,
              player2_counts: that.data.player2_counts-1
            })
          console.log("玩家1的骰子数为："+that.data.player1_counts)
          console.log("玩家2的骰子数为："+that.data.player2_counts)
        }
        if(that.data.position=="player1x3"){
          that.setData({
            player1x3: that.data.size,
            player1_counts: that.data.player1_counts+1,
          })
          if(that.data.player1x3==that.data.player2x1)
            that.setData({
            player2x1: 0,
            player2_counts: that.data.player2_counts-1
          })
          if(that.data.player1x3==that.data.player2x2)
              that.setData({
              player2x2: 0,
              player2_counts: that.data.player2_counts-1
            })
          if(that.data.player1x3==that.data.player2x3)
            that.setData({
              player2x3: 0,
              player2_counts: that.data.player2_counts-1
            })
          console.log("玩家1的骰子数为："+that.data.player1_counts)
          console.log("玩家2的骰子数为："+that.data.player2_counts)
        }
        if(that.data.player1_counts==9){
          that.gameover()
        }
        that.setData({
          player2_mark: 1,
        })
      }
   },
  })
},

player1k1: function() {
  if(this.data.player1_mark==1){
    this.setData({
      position: "player1k1",
    })
    if(this.data.player1_mark==1&this.data.player1k1==0){
      console.log("设置的点数为"+(this.data.index+1)),
    this.setData({
      index: this.data.index,
      player1k1: this.data.index+1,
      player1_counts: this.data.player1_counts+1
    })
    if(this.data.player1k1==this.data.player2k1)
      this.setData({
        player2k1: 0,
        player2_counts: this.data.player2_counts-1
      })
    if(this.data.player1k1==this.data.player2k2)
      this.setData({
        player2k2: 0,
        player2_counts: this.data.player2_counts-1
      })
    if(this.data.player1k1==this.data.player2k3)
      this.setData({
        player2k3: 0,
        player2_counts: this.data.player2_counts-1
      })
      console.log("玩家1的骰子数为："+this.data.player1_counts)
      console.log("玩家2的骰子数为："+this.data.player2_counts)
  }
  var that = this;
  wx.request({
    url: 'http://47.113.179.4:5000/data_send',
    data:{
      position: JSON.stringify(that.data.position),
      size: JSON.stringify(that.data.player1k1),
    },
    method: "POST",
    header: {
      'content-type': 'application/x-www-form-urlencoded',
      'chartset': 'utf-8'
    },
    success: function (res) {
      console.log(res.data);
      that.setData({
        player1_mark: 0,
      })
   },
  })
  if(this.data.player1_counts==9) {
    sleep(2000)
    this.gameover()
  }
  }
},

player1k2: function() {
  if(this.data.player1_mark==1){
    this.setData({
      position: "player1k2",
    })
    if(this.data.player1_mark==1&this.data.player1k2==0){
      console.log("设置的点数为"+(this.data.index+1)),
    this.setData({
      index: this.data.index,
      player1k2: this.data.index+1,
      player1_counts: this.data.player1_counts+1
    })
    if(this.data.player1k2==this.data.player2k1)
      this.setData({
        player2k1: 0,
        player2_counts: this.data.player2_counts-1
      })
    if(this.data.player1k2==this.data.player2k2)
      this.setData({
        player2k2: 0,
        player2_counts: this.data.player2_counts-1
      })
    if(this.data.player1k2==this.data.player2k3)
      this.setData({
        player2k3: 0,
        player2_counts: this.data.player2_counts-1
      })
      console.log("玩家1的骰子数为："+this.data.player1_counts)
      console.log("玩家2的骰子数为："+this.data.player2_counts)
  }
  var that = this;
  wx.request({
    url: 'http://47.113.179.4:5000/data_send',
    data:{
      position: JSON.stringify(that.data.position),
      size: JSON.stringify(that.data.player1k2),
    },
    method: "POST",
    header: {
      'content-type': 'application/x-www-form-urlencoded',
      'chartset': 'utf-8'
    },
    success: function (res) {
      console.log(res.data);
      that.setData({
        player1_mark: 0,
      })
   },
  })
  if(this.data.player1_counts==9) {
    sleep(2000)
    this.gameover()
  }
  }
},

player1k3: function() {
  if(this.data.player1_mark==1){
    this.setData({
      position: "player1k3",
    })
    if(this.data.player1_mark==1&this.data.player1k3==0){
      console.log("设置的点数为"+(this.data.index+1)),
    this.setData({
      index: this.data.index,
      player1k3: this.data.index+1,
      player1_counts: this.data.player1_counts+1
    })
    if(this.data.player1k3==this.data.player2k1)
      this.setData({
        player2k1: 0,
        player2_counts: this.data.player2_counts-1
      })
    if(this.data.player1k3==this.data.player2k2)
      this.setData({
        player2k2: 0,
        player2_counts: this.data.player2_counts-1
      })
    if(this.data.player1k3==this.data.player2k3)
      this.setData({
        player2k3: 0,
        player2_counts: this.data.player2_counts-1
      })
      console.log("玩家1的骰子数为："+this.data.player1_counts)
      console.log("玩家2的骰子数为："+this.data.player2_counts)
  }
  var that = this;
  wx.request({
    url: 'http://47.113.179.4:5000/data_send',
    data:{
      position: JSON.stringify(that.data.position),
      size: JSON.stringify(that.data.player1k3),
    },
    method: "POST",
    header: {
      'content-type': 'application/x-www-form-urlencoded',
      'chartset': 'utf-8'
    },
    success: function (res) {
      console.log(res.data);
      that.setData({
        player1_mark: 0,
      })
   },
  })
  if(this.data.player1_counts==9) {
    sleep(2000)
    this.gameover()
  }
  }
},

player1e1: function() {
  if(this.data.player1_mark==1){
    this.setData({
      position: "player1e1",
    })
    if(this.data.player1_mark==1&this.data.player1e1==0){
      console.log("设置的点数为"+(this.data.index+1)),
    this.setData({
      index: this.data.index,
      player1e1: this.data.index+1,
      player1_counts: this.data.player1_counts+1
    })
    if(this.data.player1e1==this.data.player2e1)
      this.setData({
        player2e1: 0,
        player2_counts: this.data.player2_counts-1
      })
    if(this.data.player1e1==this.data.player2e2)
      this.setData({
        player2e2: 0,
        player2_counts: this.data.player2_counts-1
      })
    if(this.data.player1e1==this.data.player2e3)
      this.setData({
        player2e3: 0,
        player2_counts: this.data.player2_counts-1
      })
      console.log("玩家1的骰子数为："+this.data.player1_counts)
      console.log("玩家2的骰子数为："+this.data.player2_counts)
  }
  var that = this;
  wx.request({
    url: 'http://47.113.179.4:5000/data_send',
    data:{
      position: JSON.stringify(that.data.position),
      size: JSON.stringify(that.data.player1e1),
    },
    method: "POST",
    header: {
      'content-type': 'application/x-www-form-urlencoded',
      'chartset': 'utf-8'
    },
    success: function (res) {
      console.log(res.data);
      that.setData({
        player1_mark: 0,
      })
   },
  })
  if(this.data.player1_counts==9) {
    sleep(2000)
    this.gameover()
  }
  }
},

player1e2: function() {
  if(this.data.player1_mark==1){
    this.setData({
      position: "player1e2",
    })
    if(this.data.player1_mark==1&this.data.player1e2==0){
      console.log("设置的点数为"+(this.data.index+1)),
    this.setData({
      index: this.data.index,
      player1e2: this.data.index+1,
      player1_counts: this.data.player1_counts+1
    })
    if(this.data.player1e2==this.data.player2e1)
      this.setData({
        player2e1: 0,
        player2_counts: this.data.player2_counts-1
      })
    if(this.data.player1e2==this.data.player2e2)
      this.setData({
        player2e2: 0,
        player2_counts: this.data.player2_counts-1
      })
    if(this.data.player1e2==this.data.player2e3)
      this.setData({
        player2e3: 0,
        player2_counts: this.data.player2_counts-1
      })
      console.log("玩家1的骰子数为："+this.data.player1_counts)
      console.log("玩家2的骰子数为："+this.data.player2_counts)
  }
  var that = this;
  wx.request({
    url: 'http://47.113.179.4:5000/data_send',
    data:{
      position: JSON.stringify(that.data.position),
      size: JSON.stringify(that.data.player1e2),
    },
    method: "POST",
    header: {
      'content-type': 'application/x-www-form-urlencoded',
      'chartset': 'utf-8'
    },
    success: function (res) {
      console.log(res.data);
      that.setData({
        player1_mark: 0,
      })
   },
  })
  if(this.data.player1_counts==9) {
    sleep(2000)
    this.gameover()
  }
  }
},

player1e3: function() {
  if(this.data.player1_mark==1){
    this.setData({
      position: "player1e3",
    })
    if(this.data.player1_mark==1&this.data.player1e3==0){
      console.log("设置的点数为"+(this.data.index+1)),
    this.setData({
      index: this.data.index,
      player1e3: this.data.index+1,
      player1_counts: this.data.player1_counts+1
    })
    if(this.data.player1e3==this.data.player2e1)
      this.setData({
        player2e1: 0,
        player2_counts: this.data.player2_counts-1
      })
    if(this.data.player1e3==this.data.player2e2)
      this.setData({
        player2e2: 0,
        player2_counts: this.data.player2_counts-1
      })
    if(this.data.player1e3==this.data.player2e3)
      this.setData({
        player2e3: 0,
        player2_counts: this.data.player2_counts-1
      })
      console.log("玩家1的骰子数为："+this.data.player1_counts)
      console.log("玩家2的骰子数为："+this.data.player2_counts)
  }
  var that = this;
  wx.request({
    url: 'http://47.113.179.4:5000/data_send',
    data:{
      position: JSON.stringify(that.data.position),
      size: JSON.stringify(that.data.player1e3),
    },
    method: "POST",
    header: {
      'content-type': 'application/x-www-form-urlencoded',
      'chartset': 'utf-8'
    },
    success: function (res) {
      console.log(res.data);
      that.setData({
        player1_mark: 0,
      })
   },
  })
  if(this.data.player1_counts==9) {
    sleep(2000)
    this.gameover()
  }
  }
},

player1x1: function() {
  if(this.data.player1_mark==1){
    this.setData({
      position: "player1x1",
    })
    if(this.data.player1_mark==1&this.data.player1x1==0){
      console.log("设置的点数为"+(this.data.index+1)),
    this.setData({
      index: this.data.index,
      player1x1: this.data.index+1,
      player1_counts: this.data.player1_counts+1
    })
    if(this.data.player1x1==this.data.player2x1)
      this.setData({
        player2x1: 0,
        player2_counts: this.data.player2_counts-1
      })
    if(this.data.player1x1==this.data.player2x2)
      this.setData({
        player2x2: 0,
        player2_counts: this.data.player2_counts-1
      })
    if(this.data.player1x1==this.data.player2x3)
      this.setData({
        player2x3: 0,
        player2_counts: this.data.player2_counts-1
      })
      console.log("玩家1的骰子数为："+this.data.player1_counts)
      console.log("玩家2的骰子数为："+this.data.player2_counts)
  }
  var that = this;
  wx.request({
    url: 'http://47.113.179.4:5000/data_send',
    data:{
      position: JSON.stringify(that.data.position),
      size: JSON.stringify(that.data.player1x1),
    },
    method: "POST",
    header: {
      'content-type': 'application/x-www-form-urlencoded',
      'chartset': 'utf-8'
    },
    success: function (res) {
      console.log(res.data);
      that.setData({
        player1_mark: 0,
      })
   },
  })
  if(this.data.player1_counts==9) {
    sleep(2000)
    this.gameover()
  }
  }
},

player1x2: function() {
  if(this.data.player1_mark==1){
    this.setData({
      position: "player1x2",
    })
    if(this.data.player1_mark==1&this.data.player1x2==0){
      console.log("设置的点数为"+(this.data.index+1)),
    this.setData({
      index: this.data.index,
      player1x2: this.data.index+1,
      player1_counts: this.data.player1_counts+1
    })
    if(this.data.player1x2==this.data.player2x1)
      this.setData({
        player2x1: 0,
        player2_counts: this.data.player2_counts-1
      })
    if(this.data.player1x2==this.data.player2x2)
      this.setData({
        player2x2: 0,
        player2_counts: this.data.player2_counts-1
      })
    if(this.data.player1x2==this.data.player2x3)
      this.setData({
        player2x3: 0,
        player2_counts: this.data.player2_counts-1
      })
      console.log("玩家1的骰子数为："+this.data.player1_counts)
      console.log("玩家2的骰子数为："+this.data.player2_counts)
  }
  var that = this;
  wx.request({
    url: 'http://47.113.179.4:5000/data_send',
    data:{
      position: JSON.stringify(that.data.position),
      size: JSON.stringify(that.data.player1x2),
    },
    method: "POST",
    header: {
      'content-type': 'application/x-www-form-urlencoded',
      'chartset': 'utf-8'
    },
    success: function (res) {
      console.log(res.data);
      that.setData({
        player1_mark: 0,
      })
   },
  })
  if(this.data.player1_counts==9) {
    sleep(2000)
    this.gameover()
  }
  }
},

player1x3: function() {
  if(this.data.player1_mark==1){
    this.setData({
      position: "player1x3",
    })
    if(this.data.player1_mark==1&this.data.player1x3==0){
      console.log("设置的点数为"+(this.data.index+1)),
    this.setData({
      index: this.data.index,
      player1x3: this.data.index+1,
      player1_counts: this.data.player1_counts+1
    })
    if(this.data.player1x3==this.data.player2x1)
      this.setData({
        player2x1: 0,
        player2_counts: this.data.player2_counts-1
      })
    if(this.data.player1x3==this.data.player2x2)
      this.setData({
        player2x2: 0,
        player2_counts: this.data.player2_counts-1
      })
    if(this.data.player1x3==this.data.player2x3)
      this.setData({
        player2x3: 0,
        player2_counts: this.data.player2_counts-1
      })
      console.log("玩家1的骰子数为："+this.data.player1_counts)
      console.log("玩家2的骰子数为："+this.data.player2_counts)
  }
  var that = this;
  wx.request({
    url: 'http://47.113.179.4:5000/data_send',
    data:{
      position: JSON.stringify(that.data.position),
      size: JSON.stringify(that.data.player1x3),
    },
    method: "POST",
    header: {
      'content-type': 'application/x-www-form-urlencoded',
      'chartset': 'utf-8'
    },
    success: function (res) {
      console.log(res.data);
      that.setData({
        player1_mark: 0,
      })
   },
  })
  if(this.data.player1_counts==9) {
    sleep(2000)
    this.gameover()
  }
  }
},


player2k1: function() {
  if(this.data.player2_mark==1){
    this.setData({
      position: "player2k1",
    })
    if(this.data.player2_mark==1&this.data.player2k1==0){
      console.log("设置的点数为"+(this.data.index+1)),
    this.setData({
      index: this.data.index,
      player2k1: this.data.index+1,
      player2_counts: this.data.player2_counts+1
    })
    if(this.data.player2k1==this.data.player1k1)
      this.setData({
        player1k1: 0,
        player1_counts: this.data.player1_counts-1
      })
    if(this.data.player2k1==this.data.player1k2)
      this.setData({
        player1k2: 0,
        player1_counts: this.data.player1_counts-1
      })
    if(this.data.player2k1==this.data.player1k3)
      this.setData({
        player1k3: 0,
        player1_counts: this.data.player1_counts-1
      })
      console.log("玩家1的骰子数为："+this.data.player1_counts)
      console.log("玩家2的骰子数为："+this.data.player2_counts)
  }
  var that = this;
  wx.request({
    url: 'http://47.113.179.4:5000/data_send',
    data:{
      position: JSON.stringify(that.data.position),
      size: JSON.stringify(that.data.player2k1),
    },
    method: "POST",
    header: {
      'content-type': 'application/x-www-form-urlencoded',
      'chartset': 'utf-8'
    },
    success: function (res) {
      console.log(res.data);
      that.setData({
        player2_mark: 0,
      })
   },
  })
  if(this.data.player2_counts==9) {
    sleep(2000)
    this.gameover()
  }
  }
},

player2k2: function() {
  if(this.data.player2_mark==1){
    this.setData({
      position: "player2k2",
    })
    if(this.data.player2_mark==1&this.data.player2k2==0){
      console.log("设置的点数为"+(this.data.index+1)),
    this.setData({
      index: this.data.index,
      player2k2: this.data.index+1,
      player2_counts: this.data.player2_counts+1
    })
    if(this.data.player2k2==this.data.player1k1)
      this.setData({
        player1k1: 0,
        player1_counts: this.data.player1_counts-1
      })
    if(this.data.player2k2==this.data.player1k2)
      this.setData({
        player1k2: 0,
        player1_counts: this.data.player1_counts-1
      })
    if(this.data.player2k2==this.data.player1k3)
      this.setData({
        player1k3: 0,
        player1_counts: this.data.player1_counts-1
      })
      console.log("玩家1的骰子数为："+this.data.player1_counts)
      console.log("玩家2的骰子数为："+this.data.player2_counts)
  }
  var that = this;
  wx.request({
    url: 'http://47.113.179.4:5000/data_send',
    data:{
      position: JSON.stringify(that.data.position),
      size: JSON.stringify(that.data.player2k2),
    },
    method: "POST",
    header: {
      'content-type': 'application/x-www-form-urlencoded',
      'chartset': 'utf-8'
    },
    success: function (res) {
      console.log(res.data);
      that.setData({
        player2_mark: 0,
      })
   },
  })
  if(this.data.player2_counts==9) {
    sleep(2000)
    this.gameover()
  }
  }
},

player2k3: function() {
  if(this.data.player2_mark==1){
    this.setData({
      position: "player2k3",
    })
    if(this.data.player2_mark==1&this.data.player2k3==0){
      console.log("设置的点数为"+(this.data.index+1)),
    this.setData({
      index: this.data.index,
      player2k3: this.data.index+1,
      player2_counts: this.data.player2_counts+1
    })
    if(this.data.player2k3==this.data.player1k1)
      this.setData({
        player1k1: 0,
        player1_counts: this.data.player1_counts-1
      })
    if(this.data.player2k3==this.data.player1k2)
      this.setData({
        player1k2: 0,
        player1_counts: this.data.player1_counts-1
      })
    if(this.data.player2k3==this.data.player1k3)
      this.setData({
        player1k3: 0,
        player1_counts: this.data.player1_counts-1
      })
      console.log("玩家1的骰子数为："+this.data.player1_counts)
      console.log("玩家2的骰子数为："+this.data.player2_counts)
  }
  var that = this;
  wx.request({
    url: 'http://47.113.179.4:5000/data_send',
    data:{
      position: JSON.stringify(that.data.position),
      size: JSON.stringify(that.data.player2k3),
    },
    method: "POST",
    header: {
      'content-type': 'application/x-www-form-urlencoded',
      'chartset': 'utf-8'
    },
    success: function (res) {
      console.log(res.data);
      that.setData({
        player2_mark: 0,
      })
   },
  })
  if(this.data.player2_counts==9) {
    sleep(2000)
    this.gameover()
  }
  }
},

player2e1: function() {
  if(this.data.player2_mark==1){
    this.setData({
      position: "player2e1",
    })
    if(this.data.player2_mark==1&this.data.player2e1==0){
      console.log("设置的点数为"+(this.data.index+1)),
    this.setData({
      index: this.data.index,
      player2e1: this.data.index+1,
      player2_counts: this.data.player2_counts+1
    })
    if(this.data.player2e1==this.data.player1e1)
      this.setData({
        player1e1: 0,
        player1_counts: this.data.player1_counts-1
      })
    if(this.data.player2e1==this.data.player1e2)
      this.setData({
        player1e2: 0,
        player1_counts: this.data.player1_counts-1
      })
    if(this.data.player2e1==this.data.player1e3)
      this.setData({
        player1e3: 0,
        player1_counts: this.data.player1_counts-1
      })
      console.log("玩家1的骰子数为："+this.data.player1_counts)
      console.log("玩家2的骰子数为："+this.data.player2_counts)
  }
  var that = this;
  wx.request({
    url: 'http://47.113.179.4:5000/data_send',
    data:{
      position: JSON.stringify(that.data.position),
      size: JSON.stringify(that.data.player2e1),
    },
    method: "POST",
    header: {
      'content-type': 'application/x-www-form-urlencoded',
      'chartset': 'utf-8'
    },
    success: function (res) {
      console.log(res.data);
      that.setData({
        player2_mark: 0,
      })
   },
  })
  if(this.data.player2_counts==9) {
    sleep(2000)
    this.gameover()
  }
  }
},

player2e2: function() {
  if(this.data.player2_mark==1){
    this.setData({
      position: "player2e2",
    })
    if(this.data.player2_mark==1&this.data.player2e2==0){
      console.log("设置的点数为"+(this.data.index+1)),
    this.setData({
      index: this.data.index,
      player2e2: this.data.index+1,
      player2_counts: this.data.player2_counts+1
    })
    if(this.data.player2e2==this.data.player1e1)
      this.setData({
        player1e1: 0,
        player1_counts: this.data.player1_counts-1
      })
    if(this.data.player2e2==this.data.player1e2)
      this.setData({
        player1e2: 0,
        player1_counts: this.data.player1_counts-1
      })
    if(this.data.player2e2==this.data.player1e3)
      this.setData({
        player1e3: 0,
        player1_counts: this.data.player1_counts-1
      })
      console.log("玩家1的骰子数为："+this.data.player1_counts)
      console.log("玩家2的骰子数为："+this.data.player2_counts)
  }
  var that = this;
  wx.request({
    url: 'http://47.113.179.4:5000/data_send',
    data:{
      position: JSON.stringify(that.data.position),
      size: JSON.stringify(that.data.player2e2),
    },
    method: "POST",
    header: {
      'content-type': 'application/x-www-form-urlencoded',
      'chartset': 'utf-8'
    },
    success: function (res) {
      console.log(res.data);
      that.setData({
        player2_mark: 0,
      })
   },
  })
  if(this.data.player2_counts==9) {
    sleep(2000)
    this.gameover()
  }
  }
},

player2e3: function() {
  if(this.data.player2_mark==1){
    this.setData({
      position: "player2e3",
    })
    if(this.data.player2_mark==1&this.data.player2e3==0){
      console.log("设置的点数为"+(this.data.index+1)),
    this.setData({
      index: this.data.index,
      player2e3: this.data.index+1,
      player2_counts: this.data.player2_counts+1
    })
    if(this.data.player2e3==this.data.player1e1)
      this.setData({
        player1e1: 0,
        player1_counts: this.data.player1_counts-1
      })
    if(this.data.player2e3==this.data.player1e2)
      this.setData({
        player1e2: 0,
        player1_counts: this.data.player1_counts-1
      })
    if(this.data.player2e3==this.data.player1e3)
      this.setData({
        player1e3: 0,
        player1_counts: this.data.player1_counts-1
      })
      console.log("玩家1的骰子数为："+this.data.player1_counts)
      console.log("玩家2的骰子数为："+this.data.player2_counts)
  }
  var that = this;
  wx.request({
    url: 'http://47.113.179.4:5000/data_send',
    data:{
      position: JSON.stringify(that.data.position),
      size: JSON.stringify(that.data.player2e3),
    },
    method: "POST",
    header: {
      'content-type': 'application/x-www-form-urlencoded',
      'chartset': 'utf-8'
    },
    success: function (res) {
      console.log(res.data);
      that.setData({
        player2_mark: 0,
      })
   },
  })
  if(this.data.player2_counts==9) {
    sleep(2000)
    this.gameover()
  }
  }
},

player2x1: function() {
  if(this.data.player2_mark==1){
    this.setData({
      position: "player2x1",
    })
    if(this.data.player2_mark==1&this.data.player2x1==0){
      console.log("设置的点数为"+(this.data.index+1)),
    this.setData({
      index: this.data.index,
      player2x1: this.data.index+1,
      player2_counts: this.data.player2_counts+1
    })
    if(this.data.player2x1==this.data.player1x1)
      this.setData({
        player1x1: 0,
        player1_counts: this.data.player1_counts-1
      })
    if(this.data.player2x1==this.data.player1x2)
      this.setData({
        player1x2: 0,
        player1_counts: this.data.player1_counts-1
      })
    if(this.data.player2x1==this.data.player1x3)
      this.setData({
        player1x3: 0,
        player1_counts: this.data.player1_counts-1
      })
      console.log("玩家1的骰子数为："+this.data.player1_counts)
      console.log("玩家2的骰子数为："+this.data.player2_counts)
  }
  var that = this;
  wx.request({
    url: 'http://47.113.179.4:5000/data_send',
    data:{
      position: JSON.stringify(that.data.position),
      size: JSON.stringify(that.data.player2x1),
    },
    method: "POST",
    header: {
      'content-type': 'application/x-www-form-urlencoded',
      'chartset': 'utf-8'
    },
    success: function (res) {
      console.log(res.data);
      that.setData({
        player2_mark: 0,
      })
   },
  })
  if(this.data.player2_counts==9) {
    sleep(2000)
    this.gameover()
  }
  }
},

player2x2: function() {
  if(this.data.player2_mark==1){
    this.setData({
      position: "player2x2",
    })
    if(this.data.player2_mark==1&this.data.player2x2==0){
      console.log("设置的点数为"+(this.data.index+1)),
    this.setData({
      index: this.data.index,
      player2x2: this.data.index+1,
      player2_counts: this.data.player2_counts+1
    })
    if(this.data.player2x2==this.data.player1x1)
      this.setData({
        player1x1: 0,
        player1_counts: this.data.player1_counts-1
      })
    if(this.data.player2x2==this.data.player1x2)
      this.setData({
        player1x2: 0,
        player1_counts: this.data.player1_counts-1
      })
    if(this.data.player2x2==this.data.player1x3)
      this.setData({
        player1x3: 0,
        player1_counts: this.data.player1_counts-1
      })
      console.log("玩家1的骰子数为："+this.data.player1_counts)
      console.log("玩家2的骰子数为："+this.data.player2_counts)
  }
  var that = this;
  wx.request({
    url: 'http://47.113.179.4:5000/data_send',
    data:{
      position: JSON.stringify(that.data.position),
      size: JSON.stringify(that.data.player2x2),
    },
    method: "POST",
    header: {
      'content-type': 'application/x-www-form-urlencoded',
      'chartset': 'utf-8'
    },
    success: function (res) {
      console.log(res.data);
      that.setData({
        player2_mark: 0,
      })
   },
  })
  if(this.data.player2_counts==9) {
    sleep(2000)
    this.gameover()
  }
  }
},

player2x3: function() {
  if(this.data.player2_mark==1){
    this.setData({
      position: "player2x3",
    })
    if(this.data.player2_mark==1&this.data.player2x3==0){
      console.log("设置的点数为"+(this.data.index+1)),
    this.setData({
      index: this.data.index,
      player2x3: this.data.index+1,
      player2_counts: this.data.player2_counts+1
    })
    if(this.data.player2x3==this.data.player1x1)
      this.setData({
        player1x1: 0,
        player1_counts: this.data.player1_counts-1
      })
    if(this.data.player2x3==this.data.player1x2)
      this.setData({
        player1x2: 0,
        player1_counts: this.data.player1_counts-1
      })
    if(this.data.player2x3==this.data.player1x3)
      this.setData({
        player1x3: 0,
        player1_counts: this.data.player1_counts-1
      })
      console.log("玩家1的骰子数为："+this.data.player1_counts)
      console.log("玩家2的骰子数为："+this.data.player2_counts)
  }
  var that = this;
  wx.request({
    url: 'http://47.113.179.4:5000/data_send',
    data:{
      position: JSON.stringify(that.data.position),
      size: JSON.stringify(that.data.player2x3),
    },
    method: "POST",
    header: {
      'content-type': 'application/x-www-form-urlencoded',
      'chartset': 'utf-8'
    },
    success: function (res) {
      console.log(res.data);
      that.setData({
        player2_mark: 0,
      })
   },
  })
  if(this.data.player2_counts==9) {
    sleep(2000)
    this.gameover()
  }
  }
},

gameover: function () {
  var that = this;
  clearInterval(timer)
  wx.request({
    url: 'http://47.113.179.4:5000/game_over',
    method: "POST",
    header: {
      'content-type': 'application/x-www-form-urlencoded',
      'chartset': 'utf-8'
    },
    success: function (res) {
      console.log(res.data);
   },
  })
  if(this.data.player1k1==1) 
  this.setData({
    player1_one_counts: this.data.player1_one_counts+1
  })
  if(this.data.player1k1==2)
  this.setData({
    player1_two_counts: this.data.player1_two_counts+1
  })
  if(this.data.player1k1==3)
  this.setData({
    player1_three_counts: this.data.player1_three_counts+1
  })
  if(this.data.player1k1==4)
  this.setData({
    player1_four_counts: this.data.player1_four_counts+1
  })
  if(this.data.player1k1==5)
  this.setData({
    player1_five_counts: this.data.player1_five_counts+1
  })
  if(this.data.player1k1==6)
  this.setData({
    player1_six_counts: this.data.player1_six_counts+1
  })
  if(this.data.player1k2==1)
  this.setData({
    player1_one_counts: this.data.player1_one_counts+1
  })
  if(this.data.player1k2==2)
  this.setData({
    player1_two_counts: this.data.player1_two_counts+1
  })
  if(this.data.player1k2==3)
  this.setData({
    player1_three_counts: this.data.player1_three_counts+1
  })
  if(this.data.player1k2==4)
  this.setData({
    player1_four_counts: this.data.player1_four_counts+1
  })
  if(this.data.player1k2==5)
  this.setData({
    player1_five_counts: this.data.player1_five_counts+1
  })
  if(this.data.player1k2==6)
  this.setData({
    player1_six_counts: this.data.player1_six_counts+1
  })
  if(this.data.player1k3==1)
  this.setData({
    player1_one_counts: this.data.player1_one_counts+1
  })
  if(this.data.player1k3==2)
  this.setData({
    player1_two_counts: this.data.player1_two_counts+1
  })
  if(this.data.player1k3==3)
  this.setData({
    player1_three_counts: this.data.player1_three_counts+1
  })
  if(this.data.player1k3==4)
  this.setData({
    player1_four_counts: this.data.player1_four_counts+1
  })
  if(this.data.player1k3==5)
  this.setData({
    player1_five_counts: this.data.player1_five_counts+1
  })
  if(this.data.player1k3==6)
  this.setData({
    player1_six_counts: this.data.player1_six_counts+1
  })
  this.setData({
    player1_score: this.data.player1_score + (
      1 * this.data.player1_one_counts*this.data.player1_one_counts + 
      2 * this.data.player1_two_counts*this.data.player1_two_counts + 
      3 * this.data.player1_three_counts*this.data.player1_three_counts + 
      4 * this.data.player1_four_counts*this.data.player1_four_counts + 
      5 * this.data.player1_five_counts*this.data.player1_five_counts + 
      6 * this.data.player1_six_counts*this.data.player1_six_counts)
  })
  this.setData({
    player1_one_counts: 0,
    player1_two_counts: 0,
    player1_three_counts: 0,
    player1_four_counts: 0,
    player1_five_counts: 0,
    player1_six_counts: 0,
  })
  if(this.data.player1e1==1) 
  this.setData({
    player1_one_counts: this.data.player1_one_counts+1
  })
  if(this.data.player1e1==2)
  this.setData({
    player1_two_counts: this.data.player1_two_counts+1
  })
  if(this.data.player1e1==3)
  this.setData({
    player1_three_counts: this.data.player1_three_counts+1
  })
  if(this.data.player1e1==4)
  this.setData({
    player1_four_counts: this.data.player1_four_counts+1
  })
  if(this.data.player1e1==5)
  this.setData({
    player1_five_counts: this.data.player1_five_counts+1
  })
  if(this.data.player1e1==6)
  this.setData({
    player1_six_counts: this.data.player1_six_counts+1
  })
  if(this.data.player1e2==1)
  this.setData({
    player1_one_counts: this.data.player1_one_counts+1
  })
  if(this.data.player1e2==2)
  this.setData({
    player1_two_counts: this.data.player1_two_counts+1
  })
  if(this.data.player1e2==3)
  this.setData({
    player1_three_counts: this.data.player1_three_counts+1
  })
  if(this.data.player1e2==4)
  this.setData({
    player1_four_counts: this.data.player1_four_counts+1
  })
  if(this.data.player1e2==5)
  this.setData({
    player1_five_counts: this.data.player1_five_counts+1
  })
  if(this.data.player1e2==6)
  this.setData({
    player1_six_counts: this.data.player1_six_counts+1
  })
  if(this.data.player1e3==1)
  this.setData({
    player1_one_counts: this.data.player1_one_counts+1
  })
  if(this.data.player1e3==2)
  this.setData({
    player1_two_counts: this.data.player1_two_counts+1
  })
  if(this.data.player1e3==3)
  this.setData({
    player1_three_counts: this.data.player1_three_counts+1
  })
  if(this.data.player1e3==4)
  this.setData({
    player1_four_counts: this.data.player1_four_counts+1
  })
  if(this.data.player1e3==5)
  this.setData({
    player1_five_counts: this.data.player1_five_counts+1
  })
  if(this.data.player1e3==6)
  this.setData({
    player1_six_counts: this.data.player1_six_counts+1
  })
  this.setData({
    player1_score: this.data.player1_score + (
      1 * this.data.player1_one_counts*this.data.player1_one_counts + 
      2 * this.data.player1_two_counts*this.data.player1_two_counts + 
      3 * this.data.player1_three_counts*this.data.player1_three_counts + 
      4 * this.data.player1_four_counts*this.data.player1_four_counts + 
      5 * this.data.player1_five_counts*this.data.player1_five_counts + 
      6 * this.data.player1_six_counts*this.data.player1_six_counts)
  })
  this.setData({
    player1_one_counts: 0,
    player1_two_counts: 0,
    player1_three_counts: 0,
    player1_four_counts: 0,
    player1_five_counts: 0,
    player1_six_counts: 0,
  })
  if(this.data.player1x1==1) 
  this.setData({
    player1_one_counts: this.data.player1_one_counts+1
  })
  if(this.data.player1x1==2)
  this.setData({
    player1_two_counts: this.data.player1_two_counts+1
  })
  if(this.data.player1x1==3)
  this.setData({
    player1_three_counts: this.data.player1_three_counts+1
  })
  if(this.data.player1x1==4)
  this.setData({
    player1_four_counts: this.data.player1_four_counts+1
  })
  if(this.data.player1x1==5)
  this.setData({
    player1_five_counts: this.data.player1_five_counts+1
  })
  if(this.data.player1x1==6)
  this.setData({
    player1_six_counts: this.data.player1_six_counts+1
  })
  if(this.data.player1x2==1)
  this.setData({
    player1_one_counts: this.data.player1_one_counts+1
  })
  if(this.data.player1x2==2)
  this.setData({
    player1_two_counts: this.data.player1_two_counts+1
  })
  if(this.data.player1x2==3)
  this.setData({
    player1_three_counts: this.data.player1_three_counts+1
  })
  if(this.data.player1x2==4)
  this.setData({
    player1_four_counts: this.data.player1_four_counts+1
  })
  if(this.data.player1x2==5)
  this.setData({
    player1_five_counts: this.data.player1_five_counts+1
  })
  if(this.data.player1x2==6)
  this.setData({
    player1_six_counts: this.data.player1_six_counts+1
  })
  if(this.data.player1x3==1)
  this.setData({
    player1_one_counts: this.data.player1_one_counts+1
  })
  if(this.data.player1x3==2)
  this.setData({
    player1_two_counts: this.data.player1_two_counts+1
  })
  if(this.data.player1x3==3)
  this.setData({
    player1_three_counts: this.data.player1_three_counts+1
  })
  if(this.data.player1x3==4)
  this.setData({
    player1_four_counts: this.data.player1_four_counts+1
  })
  if(this.data.player1x3==5)
  this.setData({
    player1_five_counts: this.data.player1_five_counts+1
  })
  if(this.data.player1x3==6)
  this.setData({
    player1_six_counts: this.data.player1_six_counts+1
  })
  this.setData({
    player1_score: this.data.player1_score + (
      1 * this.data.player1_one_counts*this.data.player1_one_counts + 
      2 * this.data.player1_two_counts*this.data.player1_two_counts + 
      3 * this.data.player1_three_counts*this.data.player1_three_counts + 
      4 * this.data.player1_four_counts*this.data.player1_four_counts + 
      5 * this.data.player1_five_counts*this.data.player1_five_counts + 
      6 * this.data.player1_six_counts*this.data.player1_six_counts)
  })
  this.setData({
    player1_one_counts: 0,
    player1_two_counts: 0,
    player1_three_counts: 0,
    player1_four_counts: 0,
    player1_five_counts: 0,
    player1_six_counts: 0,
  })
  if(this.data.player2k1==1) 
  this.setData({
    player2_one_counts: this.data.player2_one_counts+1
  })
  if(this.data.player2k1==2)
  this.setData({
    player2_two_counts: this.data.player2_two_counts+1
  })
  if(this.data.player2k1==3)
  this.setData({
    player2_three_counts: this.data.player2_three_counts+1
  })
  if(this.data.player2k1==4)
  this.setData({
    player2_four_counts: this.data.player2_four_counts+1
  })
  if(this.data.player2k1==5)
  this.setData({
    player2_five_counts: this.data.player2_five_counts+1
  })
  if(this.data.player2k1==6)
  this.setData({
    player2_six_counts: this.data.player2_six_counts+1
  })
  if(this.data.player2k2==1)
  this.setData({
    player2_one_counts: this.data.player2_one_counts+1
  })
  if(this.data.player2k2==2)
  this.setData({
    player2_two_counts: this.data.player2_two_counts+1
  })
  if(this.data.player2k2==3)
  this.setData({
    player2_three_counts: this.data.player2_three_counts+1
  })
  if(this.data.player2k2==4)
  this.setData({
    player2_four_counts: this.data.player2_four_counts+1
  })
  if(this.data.player2k2==5)
  this.setData({
    player2_five_counts: this.data.player2_five_counts+1
  })
  if(this.data.player2k2==6)
  this.setData({
    player2_six_counts: this.data.player2_six_counts+1
  })
  if(this.data.player2k3==1)
  this.setData({
    player2_one_counts: this.data.player2_one_counts+1
  })
  if(this.data.player2k3==2)
  this.setData({
    player2_two_counts: this.data.player2_two_counts+1
  })
  if(this.data.player2k3==3)
  this.setData({
    player2_three_counts: this.data.player2_three_counts+1
  })
  if(this.data.player2k3==4)
  this.setData({
    player2_four_counts: this.data.player2_four_counts+1
  })
  if(this.data.player2k3==5)
  this.setData({
    player2_five_counts: this.data.player2_five_counts+1
  })
  if(this.data.player2k3==6)
  this.setData({
    player2_six_counts: this.data.player2_six_counts+1
  })
  this.setData({
    player2_score: this.data.player2_score + (
      1 * this.data.player2_one_counts*this.data.player2_one_counts + 
      2 * this.data.player2_two_counts*this.data.player2_two_counts + 
      3 * this.data.player2_three_counts*this.data.player2_three_counts + 
      4 * this.data.player2_four_counts*this.data.player2_four_counts + 
      5 * this.data.player2_five_counts*this.data.player2_five_counts + 
      6 * this.data.player2_six_counts*this.data.player2_six_counts)
  })
  this.setData({
    player2_one_counts: 0,
    player2_two_counts: 0,
    player2_three_counts: 0,
    player2_four_counts: 0,
    player2_five_counts: 0,
    player2_six_counts: 0,
  })
  if(this.data.player2e1==1) 
  this.setData({
    player2_one_counts: this.data.player2_one_counts+1
  })
  if(this.data.player2e1==2)
  this.setData({
    player2_two_counts: this.data.player2_two_counts+1
  })
  if(this.data.player2e1==3)
  this.setData({
    player2_three_counts: this.data.player2_three_counts+1
  })
  if(this.data.player2e1==4)
  this.setData({
    player2_four_counts: this.data.player2_four_counts+1
  })
  if(this.data.player2e1==5)
  this.setData({
    player2_five_counts: this.data.player2_five_counts+1
  })
  if(this.data.player2e1==6)
  this.setData({
    player2_six_counts: this.data.player2_six_counts+1
  })
  if(this.data.player2e2==1)
  this.setData({
    player2_one_counts: this.data.player2_one_counts+1
  })
  if(this.data.player2e2==2)
  this.setData({
    player2_two_counts: this.data.player2_two_counts+1
  })
  if(this.data.player2e2==3)
  this.setData({
    player2_three_counts: this.data.player2_three_counts+1
  })
  if(this.data.player2e2==4)
  this.setData({
    player2_four_counts: this.data.player2_four_counts+1
  })
  if(this.data.player2e2==5)
  this.setData({
    player2_five_counts: this.data.player2_five_counts+1
  })
  if(this.data.player2e2==6)
  this.setData({
    player2_six_counts: this.data.player2_six_counts+1
  })
  if(this.data.player2e3==1)
  this.setData({
    player2_one_counts: this.data.player2_one_counts+1
  })
  if(this.data.player2e3==2)
  this.setData({
    player2_two_counts: this.data.player2_two_counts+1
  })
  if(this.data.player2e3==3)
  this.setData({
    player2_three_counts: this.data.player2_three_counts+1
  })
  if(this.data.player2e3==4)
  this.setData({
    player2_four_counts: this.data.player2_four_counts+1
  })
  if(this.data.player2e3==5)
  this.setData({
    player2_five_counts: this.data.player2_five_counts+1
  })
  if(this.data.player2e3==6)
  this.setData({
    player2_six_counts: this.data.player2_six_counts+1
  })
  this.setData({
    player2_score: this.data.player2_score + (
      1 * this.data.player2_one_counts*this.data.player2_one_counts + 
      2 * this.data.player2_two_counts*this.data.player2_two_counts + 
      3 * this.data.player2_three_counts*this.data.player2_three_counts + 
      4 * this.data.player2_four_counts*this.data.player2_four_counts + 
      5 * this.data.player2_five_counts*this.data.player2_five_counts + 
      6 * this.data.player2_six_counts*this.data.player2_six_counts)
  })
  this.setData({
    player2_one_counts: 0,
    player2_two_counts: 0,
    player2_three_counts: 0,
    player2_four_counts: 0,
    player2_five_counts: 0,
    player2_six_counts: 0,
  })
  if(this.data.player2x1==1) 
  this.setData({
    player2_one_counts: this.data.player2_one_counts+1
  })
  if(this.data.player2x1==2)
  this.setData({
    player2_two_counts: this.data.player2_two_counts+1
  })
  if(this.data.player2x1==3)
  this.setData({
    player2_three_counts: this.data.player2_three_counts+1
  })
  if(this.data.player2x1==4)
  this.setData({
    player2_four_counts: this.data.player2_four_counts+1
  })
  if(this.data.player2x1==5)
  this.setData({
    player2_five_counts: this.data.player2_five_counts+1
  })
  if(this.data.player2x1==6)
  this.setData({
    player2_six_counts: this.data.player2_six_counts+1
  })
  if(this.data.player2x2==1)
  this.setData({
    player2_one_counts: this.data.player2_one_counts+1
  })
  if(this.data.player2x2==2)
  this.setData({
    player2_two_counts: this.data.player2_two_counts+1
  })
  if(this.data.player2x2==3)
  this.setData({
    player2_three_counts: this.data.player2_three_counts+1
  })
  if(this.data.player2x2==4)
  this.setData({
    player2_four_counts: this.data.player2_four_counts+1
  })
  if(this.data.player2x2==5)
  this.setData({
    player2_five_counts: this.data.player2_five_counts+1
  })
  if(this.data.player2x2==6)
  this.setData({
    player2_six_counts: this.data.player2_six_counts+1
  })
  if(this.data.player2x3==1)
  this.setData({
    player2_one_counts: this.data.player2_one_counts+1
  })
  if(this.data.player2x3==2)
  this.setData({
    player2_two_counts: this.data.player2_two_counts+1
  })
  if(this.data.player2x3==3)
  this.setData({
    player2_three_counts: this.data.player2_three_counts+1
  })
  if(this.data.player2x3==4)
  this.setData({
    player2_four_counts: this.data.player2_four_counts+1
  })
  if(this.data.player2x3==5)
  this.setData({
    player2_five_counts: this.data.player2_five_counts+1
  })
  if(this.data.player2x3==6)
  this.setData({
    player2_six_counts: this.data.player2_six_counts+1
  })
  this.setData({
    player2_score: this.data.player2_score + (
      1 * this.data.player2_one_counts*this.data.player2_one_counts + 
      2 * this.data.player2_two_counts*this.data.player2_two_counts + 
      3 * this.data.player2_three_counts*this.data.player2_three_counts + 
      4 * this.data.player2_four_counts*this.data.player2_four_counts + 
      5 * this.data.player2_five_counts*this.data.player2_five_counts + 
      6 * this.data.player2_six_counts*this.data.player2_six_counts)
  })
  this.setData({
    player2_one_counts: 0,
    player2_two_counts: 0,
    player2_three_counts: 0,
    player2_four_counts: 0,
    player2_five_counts: 0,
    player2_six_counts: 0,
  })
  console.log("玩家1得分："+this.data.player1_score)
  console.log("玩家2得分："+this.data.player2_score)
  if(this.data.player1_score>0||this.data.player2_score>0){
    wx.showModal({
      title: '提示',
      //使用\r\n进行消息换行
      content: '游戏结束\r\n玩家一得分:'+that.data.player1_score+'\r\n玩家二得分:'+that.data.player2_score,
      showCancel: false, //是否显示取消按钮
      confirmText: '返回界面', //确认按钮的文字，最多 4 个字符
      success: function (res) {
      if (res.confirm) {
        wx.navigateBack({
          delta: 0,
        })
      }
        console.log('用户返回界面')
    }
  })
  }
  else{
    wx.showModal({
      title: '您选择了投降',
      //使用\r\n进行消息换行
      content: '游戏结束\r\n玩家一得分:'+that.data.player1_score+'\r\n玩家二得分:'+that.data.player2_score,
      showCancel: false, //是否显示取消按钮
      confirmText: '返回界面', //确认按钮的文字，最多 4 个字符
      success: function (res) {
      if (res.confirm) {
        wx.navigateBack({
          delta: 0,
        })
      }
        console.log('用户返回界面')
    }
  })
  }
}
})

function sleep(numberMillis) {
  var now = new Date();
  var exitTime = now.getTime() + numberMillis;
  while (true) {
      now = new Date();
      if (now.getTime() > exitTime)
          return true;
  }
}