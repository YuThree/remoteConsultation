// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import FastClick from 'fastclick'
import router from './router' 
import store from './store'
import App from './App'
import './veevalidate.js'//veevalidate 表单验证插件及配置
import './assets/css/reset.less'//样式重置
import Scroll from './components/scroll/scroll.vue'//滚动条
import Select from './components/select';//下拉
import axios from './axios'
import modalPlugin from './components/modal/modalPlugin.js'
import Loading from './components/loading/loading'
import directive from './directive'
import dictionary from '@/assets/js/dictionary'   // 字典表
Vue.prototype.dictionary = dictionary

import VueTouch from 'vue-touch'
Vue.use(VueTouch, {name: 'v-touch'})


//vux相关插件引入，使用请查看文档
import {DatetimePlugin,ConfirmPlugin,ToastPlugin,LoadingPlugin,XHeader,Datetime } from 'vux'
Vue.use(DatetimePlugin) //日期插件
Vue.use(ConfirmPlugin) //confirm弹框
Vue.use(ToastPlugin) //toast弹框
Vue.use(LoadingPlugin) //Loading
Vue.use(Select) //下拉
Vue.use(modalPlugin) //alert弹框
//
Vue.use(directive)

//全局注册的vux组件
Vue.component('Scroll', Scroll)
Vue.component('XHeader', XHeader)
Vue.component('Datetime', Datetime)
Vue.component('Loading', Loading)




FastClick.attach(document.body)

Vue.config.productionTip = false

/* eslint-disable no-new */
Vue.mixin({
  mounted() {
    if(store.state.formDisabled && this.$parent.$el.id == 'app'){
      setTimeout(()=>{
        this.$parent.justView && this.$parent.justView();
      },1000)
    }
  },
  methods:{
    //手指触摸时
    addLinkBg(e){
        if(this._currentElement)return;//已经有手指触发则离开
        this.BgTouchY = e.targetTouches[0].pageY;
        let bgColor = '#e5e5e5';
        const path = e.path || (e.composedPath && e.composedPath());
        path.forEach(el => {
          if(el.className && el.className.includes && el.className.includes('cdct_addLinkitem')){
            el.style.transition = 'background-color .2s';
            el.style.backgroundColor = bgColor;
            this._currentElement = el;
            return;
          }
        });
    },
    //手指移动时
    moveLinkBg(e){
      if(!this._currentElement)return;
      let moveY = e.targetTouches[0].pageY;
      if(Math.abs(moveY-this.BgTouchY)>1){
        this._currentElement.style.transition = 'background-color 0 ease 0';
        this._currentElement.style.backgroundColor = '#fff';       
      }
    },
    //手指松开时
    removeLinkBg(e){
      if(!this._currentElement)return;
      this._currentElement.style.transition = 'background-color 0 ease 0';
      this._currentElement.style.backgroundColor = '#fff';
      this._currentElement = null;//释放
    }
  }
})

window._VUE = new Vue({
  data(){
    return {     
      showTips: false,
      institution:[],//机构
      doctors:[],//医生
      userInfo:{},//登录的用户信息
      phoneType: "",
      loginUrl: "http://192.168.104.212:8081/consulation/loginCheck", // 登录地址
      logoutUrl:'http://192.168.104.212:8081/consulation/exitLogin',  // 退出登录
      hostImage: 'http://192.168.104.212:8081',
      headImage: "", // 头像路径 /consulation/fileDowload?isNeedShow=1&FBH=01b9428053
      emrFile: false, // 一旦有病历上传成功了，置为true，调用之后必须置为false
    }
  },
  mounted() {
    //检测手机操作系统
    var u = navigator.userAgent;
    var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
    var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
    if (isAndroid) {
      this.phoneType = 'android';
    }
    if (isiOS) {
      this.phoneType = 'ios';
    }
  },
  methods: {
    getImageInfo(json) {
      var image = JSON.parse(json);
      this.headImage = image.photoUrl;
    },
    getEmrFile() {
      this.emrFile = true;
    },
  },
  router,
  store,
  render: h => h(App)
}).$mount('#app-box')
