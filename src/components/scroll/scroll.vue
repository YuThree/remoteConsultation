<template>
	<div ref="wrapper" class="wrapper">
		<div ref="scrollContent" class="scrollContent cdct_clearfix" :class="{scrollHeight:scrollHeight}">
      <div class="refreshbox" v-if="pullDownRefresh.stop==80">
        <img width="100%" height="80" :src="refreshLoading?imgurlA:imgurlB" alt="">
      </div>
      <div class="sloading" v-else-if="pullDownRefresh">
          <inline-loading v-show="simpleRfLoading"></inline-loading><span class="sloadingtxt">{{simpleRfText}}</span>
      </div>
			<slot></slot>
			<div class="loading" v-show="pullUpLoad && ableScroll">
				<inline-loading v-show="isloading" style="position:relative;top:-1px;"></inline-loading> 
        {{isloading?'加载中...':scrollEnd?'没有更多了':'上拉加载'}}
			</div>
		</div>	
	</div>
</template>
<script>
import Emitter from "./emitter.js";
import BScroll from "better-scroll";
import { InlineLoading,LoadMore } from "vux";
import { setTimeout } from 'timers';
export default {
  mixins: [Emitter],

  name: "scroll",

  components: { InlineLoading,LoadMore },
  props: {
    bounce: {
      //当滚动超过边缘的时候会有一小段回弹动画。设置为 true 则开启动画
      type: Boolean,
      default: true
    },
    scrollHeight: {
      //滚动条高度100%
      type: Boolean,
      default: false
    },
    probeType: {
      /**
       * 有时候我们需要知道滚动的位置,默认值：0,可选值：1、2、3
       * 1.会非实时屏幕滑动超过一定时间后）派发scroll 事件
       * 2.会在屏幕滑动的过程中实时的派发 scroll 事件
       * 3.不仅在屏幕滑动的过程中，而且在 momentum 滚动动画运行过程中实时派发 scroll 事件
       */
      type: Number,
      default: 2
    },
    click: {
      //点击列表是否派发click事件
      type: Boolean,
      default: true
    },
    scrollX: {
      //当设置为 true 的时候，可以开启横向滚动,当设置 eventPassthrough 为 'horizontal' 的时候，该配置无效。
      type: Boolean,
      default: false
    },
    listenScroll: {
      //是否派发滚动事件
      type: Boolean,
      default: false
    },
    data: {
      // 类表数据
      type: Array,
      default: null
    },
    pullUpLoad: {
      /**
       * 这个配置用于做上拉加载功能
       * 当设置为 true 或者是一个 Object 的时候，可以开启上拉加载
       * 可以配置离（threshold）来决定开始加载的时机
       * 当上拉加载数据加载完毕后，需要执行 finishPullUp 方法
       */
      type: [Object, Boolean],
      default: false
    },
    pullDownRefresh: {
      // 是否派发顶部下拉的事件，用于下拉刷新
      /**
       * 这个配置用于做下拉刷新功能，默认为 false。
       * 当设置为 true 或者是一个 Object 的时候，可以开启下拉刷新
       * 可以配置顶部下拉的距离（threshold） 来决定刷新时机以及回弹停留的距离（stop）。
       * 当下拉刷新数据加载完毕后，需要执行 finishPullDown 方法
       */
      type: [Boolean, Object],
      default: false
    },
    refreshDelay: {
      type: Number,
      default: 20
    },
    stopPropagation: {
      type: Boolean,
      default: false
    },
    //使用 CSS3 transition 动画。如果设置为 false，则使用 requestAnimationFrame 做动画。
    useTransition: {
      type: Boolean,
      default: true
    },
    selectScroll: Boolean //实时更改下拉位置
  },
  data(){
    return {
      isloading: false, // 上拉加载
      refreshLoading:false,//下拉刷新Loading
      scrollEnd:false,//没有更多数据
      ableScroll:false,//能否滚动
      imgurlA:require('./refresh_gray.gif'),
      imgurlB:require('./refresh_gray.png'),
      simpleRfLoading:false,//普通下拉刷新loading显示
      simpleRfText:'下拉刷新',//普通下拉刷新文本显示
      status:'scroll'//滚动条状态，用于区分 上拉pullingUp、下拉pullingDown、普通滚动
    }
  },
  mounted() {
    // 保证在DOM渲染完毕后初始化better-scroll
    this.$nextTick(() => {
      this._initScroll();
    });
  },
  methods: {

    _initScroll() {
      if (!this.$refs.wrapper) {
        return;
      }
      var u = navigator.userAgent;
      var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
      var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
      let clickType;
      if(isAndroid){
        clickType = true;
      }else{
        clickType = false;
      }
      
      // better-scroll的初始化
      this.scroll = new BScroll(this.$refs.wrapper, {
        probeType: this.probeType,
        click: clickType,
        tap:true,
        scrollX: this.scrollX,
        pullUpLoad: this.pullUpLoad,
        // pullDownRefresh: this.pullDownRefresh?{threshold:90}:false,
        pullDownRefresh: this.pullDownRefresh,
        bounce: this.bounce,
        stopPropagation: this.stopPropagation,
        useTransition: this.useTransition
      });

      // 是否派发滚动事件
      if (this.listenScroll || this.selectScroll) {
        let THIS = this;
        this.scroll.on("scroll", pos => {
          THIS.$emit("scroll", pos);
          if (THIS.selectScroll) {
            //触发下拉插件函数，实时更改下拉位置
            THIS.broadcast("ElSelect", "handleScrollMove", pos);
          }
        });
        this.scroll.on("scrollEnd", pos => {
          THIS.$emit("scrollEnd", pos, this.scroll.maxScrollY);
        });
      }

      // 是否派发滚动到底部事件，用于上拉加载
      if (this.pullUpLoad) {
        this.scroll.on("pullingUp", () => {
          this.isloading = true;
          this.scrollEnd = false;//控制底部文字‘没有更多了’
          this.status = 'pullingUp';
          this.$emit("pullingUp");
        });
      }
      // 是否派发滚动到底部事件，用于下拉刷新
      if (this.pullDownRefresh) {
        this.scroll.on("pullingDown", () => {
          this.$emit("pullingDown");
          //大列表的动画刷新Loading
          this.refreshLoading = true;
          //普通的列表刷新Loading
          this.simpleRfLoading = true;
          this.simpleRfText = '正在刷新...';
           this.status = 'pullingDown';
        });
      }
      //下拉刷新的Loading变化
      this.scroll.on("scroll",({x,y})=>{
        if(y>90 && !this.simpleRfLoading){
          this.simpleRfText = '释放更新';
        }else if(y<1 && !this.simpleRfLoading){
          this.simpleRfText = '下拉刷新';
        }
        //解决用tab键切换光标时页面异常导致滚动不到顶部
        if(this.$refs.wrapper.scrollTop>0){
          this.scrollTo(0,-this.$refs.wrapper.scrollTop,0);
          this.$refs.wrapper.scrollTop=0;
        }
      })
    },
    finishPullUp(end) {
      /**
       * 代理better-scroll的finishPullUp方法
       * 当上拉加载数据加载完毕后，需要调用此方法告诉 better-scroll 数据已加载。
       */
      this.scroll && this.scroll.finishPullUp();
      this.$nextTick(()=>{
        this.isloading = false;
        if(end){
          this.scrollEnd = true;
        }
      })
    },
    finishPullDown() {
      /**
       * 代理better-scroll的finishPullDown方法
       * 当下拉刷新数据加载完毕后，需要调用此方法告诉 better-scroll 数据已加载。
       */
      this.simpleRfText = '成功刷新';
      this.simpleRfLoading = false;
      setTimeout(()=>{
        this.scroll && this.scroll.finishPullDown();
      },500)
      this.$nextTick(()=>{
        this.refreshLoading = false;
      })
    },

    disable() {
      //禁用 better-scroll，DOM 事件（如 touchstart、touchmove、touchend）的回调函数不再响应。
      // 代理better-scroll的disable方法
      this.scroll && this.scroll.disable();
    },
    enable() {
      //启用 better-scroll, 默认 开启。
      // 代理better-scroll的enable方法
      this.scroll && this.scroll.enable();
    },
    refresh() {
      // 代理better-scroll的refresh方法
      this.status = 'scroll';
      this.scroll && this.scroll.refresh();
      //判断是否需要上拉加载loading
      let wrheight = this.$refs.wrapper.offsetHeight;
      let height = this.$refs.scrollContent.offsetHeight;
      if(wrheight>=height){
        this.ableScroll = false
      }else{
        this.ableScroll = true
      }
    },
    goToPage(x, y, time, easing) {
      // 代理better-scroll的next方法
      this.scroll && this.scroll.goToPage(x, y, time, easing);
    },

    scrollTo() {
      /**
       * 代理better-scroll的scrollTo方法 滚动到指定的位置
       * {Number} x 横轴坐标（单位 px）
       * {Number} y 纵轴坐标（单位 px）
       * {Number} time 滚动动画执行的时长（单位 ms）
       * {Object} easing 缓动函数，一般不建议修改，如果想修改，参考源码中的 ease.js 里的写法
       */
      this.scroll && this.scroll.scrollTo.apply(this.scroll, arguments);
    },
    scrollToElement() {
      /**
       * 代理better-scroll的scrollToElement方法 滚动到指定的目标元素。
       * scrollToElement(el, time, offsetX, offsetY, easing)
       * {DOM | String} el 滚动到的目标元素, 如果是字符串，则内部会尝试调用 querySelector 转换成 DOM 对象。
       * {Number} time 滚动动画执行的时长（单位 ms）
       * {Number | Boolean} offsetX 相对于目标元素的横轴偏移量，如果设置为 true，则滚到目标元素的中心位置
       * {Number | Boolean} offsetY 相对于目标元素的纵轴偏移量，如果设置为 true，则滚到目标元素的中心位置
       * {Object} easing 缓动函数，一般不建议修改，如果想修改，参考源码中的 ease.js 里的写法
       *
       */
      this.scroll && this.scroll.scrollToElement.apply(this.scroll, arguments);
    }
  },
  computed:{
    canScroll(){
      this.$nextTick(()=>{
        let height = this.$refs.wrapper.offsetHeight;
      })
      return true;
    }
  },
  watch: {
    // 监听数据的变化，延时refreshDelay时间后调用refresh方法重新计算，保证滚动效果正常
    data() {
      setTimeout(() => {
        this.refresh();
      }, this.status=='pullingDown'?500:20);//下拉刷新状态就500sm后在刷新滚动条
    }
  }
};
</script>
<style lang="less" scoped>
.wrapper {
  height: 100%;
  width: 100%;
  overflow: hidden;

}
.scrollContent {
  width: 100%;
  position: relative;
  .sloading{
      position:absolute;
      top:-50px;
      width:100%;
      text-align:center;
      .sloadingtxt{
          font-size: 1.2rem;
          color:#999;
      }
  }
}
.loading {
  // 滚动条loading
  text-align: center;
  font-size: 1.2rem;
  color:#999;
  width: 100%;
  line-height: 20px;
  height:20px;
}
.tab_content {
  float: left;
}
.scrollHeight {
  height: 100%;
}
.refreshbox{
  width: 100%;
  position: absolute;
  top: -80px;
}
</style>