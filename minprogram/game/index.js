// game/index.js
const websocket = require('../js/websocket');
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    no: 1001,
    isDisconnect: true,
    host: 1,
    user: wx.getStorageSync('user'),
    img: wx.getStorageSync('img')
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    const that = this;

    var url = app.wss + '/game/' + this.data.no;
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
    that.websocket.onOpen(function() {
      that.websocketListener();
      that.setData({
        isDisconnect: false
      })
      that.login();
    });
    that.websocket.onClose(function() {
      that.setData({
        isDisconnect: true
      })
    })
  },
  websocketListener() {
    const that = this;
    var client = that.websocket;

    // 游戏通知类
    client.admit('syncLeave', that.loadGame);
    client.admit('syncGame', that.loadGame);
    client.admit('syncPoker', that.loadGame);
    client.admit('syncStatus', that.loadGame);
    client.admit('syncSeat', that.loadGame);
    client.admit("GameStart", that.loadGame);
    client.admit("syncHunter", that.loadGame);
    // 游戏中
    client.admit("Doppel", that.loadGame);
    client.admit("Wolf", that.loadGame);
    client.admit("AsMysticWolf", that.loadGame);
    client.admit("MysticWolf", that.loadGame);
    client.admit("AsSeer", that.loadGame);
    client.admit("Seer", that.loadGame);
    client.admit("AsApprenticeSeer", that.loadGame);
    client.admit("ApprenticeSeer", that.loadGame);
    client.admit("AsRobber", that.loadGame);
    client.admit("Robber", that.loadGame); 
    client.admit("AsWitch", that.loadGame);
    client.admit("Witch", that.loadGame);
    client.admit("AsTroubleMarker", that.loadGame);
    client.admit("TroubleMarker", that.loadGame);
    client.admit("AsDrunk", that.loadGame);
    client.admit("Drunk", that.loadGame);
    // 发言环节
    client.admit("Speak", that.loadGame);
    // 最后投票
    client.admit("Vote", that.loadGame);
    // 猎人权力
    client.admit("Hunter", that.loadGame);

    // 上帝视角
    client.admit("God", that.loadGame);
    /*
    client.admit("God", Guide.God);
    client.admit("Result", Guide.Result);
    */
  },
  loadGame(game) {
    var stage = game['stage'];
    if (!stage) {
      stage = null;
    }
    var player = game['allPlayers'][this.data.user];
    var movements = player.movements;
    var viewport = {};
    if (movements.length>0) {
      viewport = movements[movements.length-1].viewport;
    }
    this.mission = player['mission'];
    if (this.mission) {
      if (this.mission.indexOf('As') == 0) {
        this.mission = this.mission.substring(2);
      }
      if(this.tips[this.mission]) {// 当前有任务
        this.tips[this.mission].call(this);
      }
    }
    this.setData({
      game: game,
      stage: stage,
      player: player,
      desktop: game['desktop'],
      movements: movements,
      viewport: viewport
    });
  },
  tips: {
    Doppel() {
      this.setData({
        tips: '化身幽灵行动',
        description: '你要复制谁？',
        targetCount: 1
      })
    },
    Wolf() {
      this.setData({
        tips: '狼人行动',
        description: '你可以查看底牌！',
        targetCount: 1
      })
    },
    MysticWolf() {
      this.setData({
        tips: '狼先知行动',
        description: '你可以查看一个人！',
        targetCount: 1
      })
    },
    Seer() {
      this.setData({
        tips: '预言家行动',
        description: '你看一个人或两张底牌！',
        targetCount: 2
      })
    },
    ApprenticeSeer() {
      this.setData({
        tips: '见习预言家行动',
        description: '你要看哪张底牌？',
        targetCount: 1
      })
    },
    Robber() {
      this.setData({
        tips: '强盗行动',
        description: '告诉我，你要抢谁的牌？',
        targetCount: 1
      })
    },
    Witch() {
      this.setData({
        tips: '女巫行动',
        description: '一张底牌还给一个人，你决定了吗？',
        targetCount: 2
      })
    },
    TroubleMarker() {
      this.setData({
        tips: '捣蛋鬼行动',
        description: '对调两个人的身份，你心中有人选吗？',
        targetCount: 2
      })
    },
    Drunk() {
      this.setData({
        tips: '捣蛋鬼行动',
        description: '稀里糊涂，随便拿张底牌吧',
        targetCount: 2
      })
    },
    Vote() {
      this.setData({
        tips: '开始投票了',
        description: '你想投给谁？',
        targetCount: 1
      })
    }
  },
  spell: {
    Doppel() {
      const seat = this.data.targets[0];
      if (this.data.player.seat && this.data.player.seat != seat ) {
        this.websocket.http({
          action: 'Doppel',
          data: seat,
          success: this.loadGame
        });
        this.setData({
          tips: null,
          description: null
        })
      }
    },
    Wolf() {
      const seat = this.data.targets[0];
      if (this.data.player.seat) {
        this.websocket.http({
          action: 'Wolf',
          data: seat,
          success: this.loadGame
        });
        this.setData({
          tips: null,
          description: null
        })
      }
    },
    MysticWolf() {
      const seat = this.data.targets[0];
      if (this.data.player.seat) {
        this.websocket.http({
          action: 'MysticWolf',
          data: seat,
          success: this.loadGame
        });
        this.setData({
          tips: null,
          description: null
        })
      }
    },
    Seer() {
      const seat = this.data.targets[0];
      if (this.data.player.seat) {
        this.websocket.http({
          action: 'Seer',
          data: seat,
          success: this.loadGame
        });
        this.setData({
          tips: null,
          description: null
        })
      }
    },
    ApprenticeSeer() {
      const seat = this.data.targets[0];
      if (this.data.player.seat) {
        this.websocket.http({
          action: 'ApprenticeSeer',
          data: seat,
          success: this.loadGame
        });
        this.setData({
          tips: null,
          description: null
        })
      }
    },
    Robber() {
      const seat = this.data.targets[0];
      if (this.data.player.seat) {
        this.websocket.http({
          action: 'Robber',
          data: seat,
          success: this.loadGame
        });
        this.setData({
          tips: null,
          description: null
        })
      }
    },
    Witch() {
      const seat = this.data.targets[0];
      if (this.data.player.seat) {
        this.websocket.http({
          action: 'Witch',
          data: seat,
          success: this.loadGame
        });
        this.setData({
          tips: null,
          description: null
        })
      }
    },
    TroubleMarker() {
      const seat = this.data.targets[0];
      if (this.data.player.seat) {
        this.websocket.http({
          action: 'TroubleMarker',
          data: seat,
          success: this.loadGame
        });
        this.setData({
          tips: null,
          description: null
        })
      }
    },
    Drunk() {
      const seat = this.data.targets[0];
      if (this.data.player.seat) {
        this.websocket.http({
          action: 'Drunk',
          data: seat,
          success: this.loadGame
        });
        this.setData({
          tips: null,
          description: null
        })
      }
    },
    Vote() {
      var seat = 0;
      if (this.data.targets && this.data.targets.length>0) {
        var seat = this.data.targets[0];
      }
      
      if (this.data.player.seat) {
        this.websocket.emit({
          action:'Vote',
          data: seat
        });
        this.setData({
          tips: null,
          description: null
        })
      }
    }
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {
    this.onUnload();
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
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
        user: this.data.user,
        img: this.data.img
      },
      success(data) {
        that.joinGame();
      }
    });
  },
  joinGame() {
    const that = this;
    this.websocket.http({
      action: 'joinGame',
      data: this.data.no,
      success(game) {
        if (!game) {
          wx.showToast({
            title: '无效的房间号!',
            icon: 'success',
            duration: 5000
          })
          that.websocket.close();
          wx.redirectTo({
            url: '/hall/index',
          })
          return;
        }
        console.log(game);
        that.loadGame(game);
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
      } catch (e) {

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
  },
  selectTarget(res) {
    var seat = res.detail;
    const that = this;

    var stage = this.data.stage;
    if (!stage) {// 游戏未开始
      this.sitdown(seat);
    } else {
      if (this.data.game.deck[seat] &&
        this.data.cast && 
        this.mission &&
        this.spell[this.mission]) {

        var targets = [];
        var ori = this.data.targets;
        if (ori) {
          for (let i = 0; i < ori.length; i++) {
            if (ori[i] != seat) {
              targets.push(ori[i]);
            }
          }
        }
        targets.push(seat);
        if (targets.length>this.data.targetCount) {
          targets.shift();
        }
        this.setData({
          targets: targets
        })
      }
    }
  },
  cast() {
    var cast = false;
    if (this.mission 
      && this.spell[this.mission]) {
        if (!this.data.cast) {
          cast = true;
        }
    }
    this.setData({
      cast: cast,
      targets: null
    });
  },
  castYes() {
    if (this.data.game.deck[seat] &&
      this.data.cast &&
      this.mission &&
      this.spell[this.mission]) {
      this.spell[this.mission].call(this);
      this.setData({
        cast: false,
        targets: null
      });
    }
  },
  castNo() {
    this.setData({
      targets: null
    })
  },
  voteYes() {
    if (this.data.game.deck[seat] &&
      this.data.cast) {
      this.spell.Vote.call(this);
      this.setData({
        cast: false,
        targets: null
      });
    }
  },
  voteNo() {// 弃权票
    this.setData({
      cast: false,
      targets: null
    });
    this.spell.Vote.call(this);
  },
  sitdown(seat) {
    if (!this.data.player.ready) {
      this.websocket.emit({
        action: 'sitdown',
        data: seat
      });
    }
  },
  cue() {

  },
  leaveGame() {
    if (this.data.stage) {
      // 弹窗确认
      this.back();
    } else {
      this.back();
    }
  },
  back() {
    var that = this;
    if (this.websocket.readyState>1) {
      that.websocket.close();
      // 关闭状态
      wx.redirectTo({
        url: '/hall/index',
      })
    } else {
      this.websocket.http({
        action: 'leaveGame',
        data: null,
        success() {
          that.websocket.close();
          wx.redirectTo({
            url: '/hall/index',
          })
        }
      });
    }
  },
  startGame(){
    const that = this;
    this.websocket.http({
      action: 'ready',
      data: true,
      success() {
        that.websocket.http({
          action: 'startGame',
        });
      }
    });
  },
  ready() {
    this.websocket.emit({
      action: 'ready',
      data: true
    });
  },
  cancel() {
    this.websocket.emit({
      action: 'ready',
      data: false
    });
  }
})