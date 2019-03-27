<template>
  <div class="cdct_container">
    <XHeader :left-options="{backText: ''}">系统消息</XHeader>
    <div class="y_nav">
      <span class="y_item" :class="{activeOne:!leftClass}" @click="initApproveList()">审批消息</span>
      <span class="y_item" :class="{activeOne:leftClass}" @click="initPublicList()">公告消息</span>
      <div class="border" ref="tabBorder"></div>
    </div>
    <loading ref="loading"></loading>
    <div class="cdct_content cdct_relative" :class="{activeOne:leftClass}" @touchstart='touchStart' @touchend='touchEnd'>
      <scroll :selectScroll="true" :useTransition="false" style="height:calc(100% - 55px)">
        <div class="y_list" v-for="(item,index) in approveList" :key="index">
          <div class="y_timeBox">
            <span>10月23日 18:50</span>
          </div>
          <div class="y_content">
            <div class="y_line y_bordeB">
              <span class="y_left">审批消息</span>
              <span class="y_right">审批时间：{{item.DSPRQ}}</span>
            </div>
            <div class="y_line y_infor">
              <span class="y_infor">{{item.CNR}}</span>
              <div class="y_btn" @click="doApproveShow(item)">{{isOk}}</div>
            </div>
          </div>
        </div>
      </scroll>
      <scroll :selectScroll="true" :useTransition="false" style="height:calc(100% - 55px);left:100%;">
        <div class="y_leftListx" v-for="(item,index) in publicList" :key="index+'left'">
          <div class="y_timeBox">
            <span>10月23日 18:50</span>
          </div>
          <div class="y_content">
            <div class="y_title">{{item.CBT}}</div>
            <div class="y_fbtime">发布时间：{{item.DCJRQ}}</div>
            <div class="y_text" :class="{showless:!item.open}" v-html="item.text"></div>
            <div class="y_imgbox" :class="{showless:!item.open}">
              <img src="~@/assets/imgs/erroimg.png" alt>
              <!-- <img src="http://img.bimg.126.net/photo/ZZ5EGyuUCp9hBPk6_s4Ehg==/5727171351132208489.jpg" alt=""> -->
            </div>
          </div>
          <div class="y_bottom" :class="{opend:!item.open}" @click="changeOpen(index)">
            <span class="y_arrow">{{!item.open?'展开':'收起'}}</span>
          </div>
        </div>
      </scroll>
      <div class="error" v-if="nodata" :style="{left:'0'}">暂无数据</div>
      <div class="error" v-if="nodata" :style="{left:'100%'}">暂无数据</div>
    </div>
  </div>
</template>

<script>
  // import Modal from '@/components/modal'
  export default {
    name: "systemMessage",
    components: {
      // Modal,
    },
    data() {
      return {
        nodata: false, //无数据
        leftClass: false,
        isOk: "确认",
        approveList: [],
        publicList: [],
      };
    },
    mounted() {
      if (this.$route.params.type && this.$route.params.place) {
        this.type = this.$route.params.type;
        console.log(typeof(this.type))
        switch (this.type) {
          case '12':
            this.spType = '1';
            break;
          case '14':
            this.spType = '2';
            break;
          case '15':
            this.spType = '3';
            break;
        }
        if (this.$route.params.place == 2) {
          this.leftClass = true;
        }
      }
      this.initApproveList();
    },
    methods: {
      changeOpen: function(index) {
        this.publicList[index].open = !this.publicList[index].open;
        if (this.publicList[index].open && this.publicList[index].text == undefined) {
          this.$refs.loading.show('加载中...');
          this.$ajax
            .post("", {
              "MSH.1": "UtilCommon",
              "MSH.2": "selText",
              'token': localStorage.token,
              'FORMAT': "1",
              'CBH': this.publicList[index].CBH
            })
            .then(res => {
              this.$refs.loading.hide();
              if (res.code == 100) {
                let newObj = Object.assign({}, this.publicList[index], {
                  text: res.data.TEXT
                }); //这样写才能出发vue数据刷新
                this.$set(this.publicList, index, newObj);
              }
            })
            .catch(error => {
              this.$refs.loading.hide();
            });
        }
      },
      //审批消息弹窗
      doApproveShow(item) {
        this.$MessageCase
          .show("请您确认已知晓消息内容，确认后此条消息将会自动清除。", "alert")
          .then(() => {
            //点击确认的回调
            this.doApprove(item);
          })
          .catch(err => {
            //点击取消的回调，只有alert框有取消回调
          });
      },
      //审批消息
      doApprove(item) {
        this.$ajax
          .post("", {
            "MSH.1": "UtilCommon",
            "MSH.2": "updateSPXX",
            token: localStorage.token,
            FORMAT: "1",
            CBH: item.CBH
          })
          .then(res => {
            console.log(res);
            if (res.code == 100) {
              this.initApproveList();
            } else {}
          })
          .catch(error => {});
      },
      //审批消息列表
      initApproveList() {
        this.nodata = false;
        this.$refs.loading.show('加载中...');
        this.leftClass = false;
        this.$ajax
          .post("", {
            "MSH.1": "UtilCommon",
            "MSH.2": "selSPXX",
            token: localStorage.token,
            FORMAT: "2",
            type: this.spType,
            name: "",
            nowPage: 1,
            showNum: 10
          })
          .then(res => {
            this.$refs.loading.hide();
            if (typeof res.data != "undefined" && res.data.rows.length > 0) {
              res.data.rows.forEach(element => {
                element.open = false;
                element.isOk = "确认";
              });
              this.approveList = res.data.rows;
              this.nodata = false;
            } else {
              this.nodata = true;
            }
          })
          .catch(error => {
            this.$refs.loading.hide();
            this.nodata = true;
          });
      },
      //公告消息列表
      initPublicList(isSearch) {
        this.nodata = false;
        this.$refs.loading.show('加载中...');
        this.leftClass = true;
        this.$ajax
          .post("", {
            "MSH.1": "UtilCommon",
            "MSH.2": "selXTGG",
            token: localStorage.token,
            type: this.type,
            NameNic: "",
            type: localStorage.IGHZL,
            FORMAT: "2",
            nowPage: 1,
            showNum: 10
          })
          .then(res => {
            this.$refs.loading.hide();
            if (typeof res.data != "undefined" && res.data.rows.length > 0) {
              res.data.rows.forEach(element => {
                element.open = false;
              });
              this.publicList = res.data.rows;
              this.nodata = false;
            } else {
              this.nodata = true;
            }
          })
          .catch(error => {
            this.$refs.loading.hide();
            this.nodata = true;
          });
      },
      showMessage(msg, type) {
        this.$MessageCase
          .show(msg, type)
          .then(() => {
            //点击确认的回调
          })
          .catch(err => {
            //点击取消的回调，只有alert框有取消回调
          });
      },
      touchStart: function(ev) {
        ev = ev || event;
        ev.preventDefault();
        if (ev.touches.length == 1) { //tounches类数组，等于1时表示此时有只有一只手指在触摸屏幕
          this.startX = ev.touches[0].clientX; // 记录开始位置
          // console.log(this.startX);
        }
      },
      touchEnd: function(ev) {
        ev = ev || event;
        ev.preventDefault();
        if (ev.changedTouches.length == 1) {
          let endX = ev.changedTouches[0].clientX;
          // console.log(endX-this.startX);
          if (endX - this.startX > 100) { //滑动距离大于100触发滑动
            this.initApproveList();
          } else if (endX - this.startX < -100) {
            this.initPublicList()
          }
        }
      }
    },
    watch: {
      leftClass: function(newNum, oldNum) {
        if (oldNum) {
          this.$refs.tabBorder.style.left = "34px";
        } else {
          this.$refs.tabBorder.style.left = "146px";
        }
      },
    }
  };
</script>
<style lang='less' scoped>
  @imagesin: "../../assets/imgs";
  .cdct_container {
    .y_nav {
      line-height: 44px;
      background: white;
      position: relative;
      .y_item {
        margin: 0 13px 0 38px;
        display: inline-block;
        color: #5f7397;
        transition: all linear 0.3s; // border-bottom: white 3px solid;
      }
      .y_item.activeOne {
        color: #0096ff; // border-bottom: #0096ff 3px solid;
      }
      .border {
        position: absolute;
        width: 65px;
        height: 3px;
        left: 34px;
        bottom: 0;
        background: #0096FF;
        transition: left .3s;
      }
    }
    .cdct_content {
      position: relative;
      padding: 0;
      transition: all linear 0.3s;
      .y_list {
        background: #f4f5f7;
        width: 100%;
        padding: 20px 12px 0 12px;
        .y_timeBox {
          margin-bottom: 15px;
          text-align: center;
          span {
            display: inline-block;
            line-height: 21px;
            background: rgba(194, 210, 225, 1);
            border-radius: 11px;
            height: 21px;
            color: #ffffff;
            font-size: 1.2rem;
            padding: 0 8px;
          }
        }
        .y_content {
          background: rgba(255, 255, 255, 1);
          .y_line {
            display: flex;
            padding: 0 20px 0 15px;
            justify-content: space-between;
            align-items: center;
            .y_infor {
              flex: 1;
              line-height: 30px;
              padding: 15px 15px 15px 0;
              color: #19293f;
              font-size: 1.6rem;
            }
            .y_btn {
              // flex: 1;
              color: white;
              font-size: 1.5rem;
              line-height: 30px;
              height: 30px;
              text-align: center;
              background: linear-gradient( 90deg, rgba(48, 194, 250, 0.84) 0%, rgba(2, 147, 253, 0.93) 100%);
              border-radius: 2px;
              width: 84px;
            }
          }
          .y_bordeB {
            border-bottom: 1px solid #e1e1e1;
            line-height: 36px;
          }
          span {
            color: #5f7397;
          }
          .y_left {
            text-indent: 24px;
            position: relative;
            &:before {
              content: "";
              position: absolute;
              left: 0;
              top: 0;
              width: 18px;
              height: 100%;
              background: url("~imgs/icon1.png") center center no-repeat;
              background-size: contain;
            }
          }
        }
      }
      .y_leftListx {
        background: #f4f5f7;
        padding: 20px 12px 0 12px;
        .y_timeBox {
          margin-bottom: 15px;
          text-align: center;
          span {
            display: inline-block;
            line-height: 21px;
            background: rgba(194, 210, 225, 1);
            border-radius: 11px;
            height: 21px;
            color: #ffffff;
            font-size: 1.2rem;
            padding: 0 8px;
          }
        }
        .y_content {
          background: rgba(255, 255, 255, 1);
          padding: 15px 20px 20px 15px;
          .y_title {
            color: #19293f;
            font-size: 1.8rem;
            font-weight: 600;
            line-height: 3rem;
          }
          .y_fbtime {
            color: #5f7397;
            font-size: 1.3rem;
            margin-bottom: 0.8rem;
          }
          .y_text {
            color: #4b586d;
            font-size: 1.5rem;
            line-height: 2.8rem;
            font-size: 1.3rem;
          }
          .y_text.showless {
            text-overflow: ellipsis;
            display: -webkit-box;
            overflow: hidden;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
          }
          .y_imgbox {
            min-height: 213px;
            background: rgba(194, 210, 225, 0.1426);
            border-radius: 2px;
            width: 100%;
            position: relative;
            padding: 0.5rem;
            img {
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
              width: auto;
              height: auto;
              max-width: 95%;
              max-height: 95%;
            }
          }
          .y_imgbox.showless {
            display: none;
          }
        }
        .y_bottom {
          border-top: 1px solid #e1e1e1;
          height: 40px;
          line-height: 40px;
          text-align: center;
          color: #999999;
          background: white;
          .y_arrow {
            display: inline-block;
            position: relative;
            transition: all linear 0.2s;
            &::before {
              content: "";
              position: absolute;
              z-index: 100;
              border: 7px solid transparent;
              border-left: 7px solid #d8d8d8;
              top: 50%;
              left: -20%;
              transform: translate(-50%, -50%) rotate(-90deg);
              transform-origin: 3.5px 50%;
              transition: all linear 0.2s;
            }
          }
        }
        .y_bottom.opend {
          .y_arrow {
            &::before {
              transform: translate(-50%, -50%) rotate(90deg);
            }
          }
        }
      }
      .wrapper {
        left: 0;
        position: absolute;
        transition: all linear 0.3s;
      }
    }
    .cdct_content.activeOne {
      transform: translateX(-100%);
    }
  }
  .error {
    background: url("~imgs/nodataNow.png") no-repeat center center;
  }
</style>