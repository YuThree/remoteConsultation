<template>
  <div id="app">
    <!-- 状态栏预留 -->
    <div class="status-top">状态栏预留</div>
    <div class="app__router-wrapper">
      <keep-alive :include="parensCash">
        <router-view></router-view>
      </keep-alive>
      <!-- <router-view v-if="!$route.meta.keepAlive" :key="$route.fullPath"></router-view> -->
    </div>
    <!-- 路由Loading -->
    <div class="isload-mask" v-show="isLoading" @touchmove.prevent>
      <spinner class="isload-mask-loading" size="35px" type="ios"></spinner>
    </div>
    <div v-transfer-dom>
      <popup v-model="$root.showTips" position="top">
        <div class="position-vertical-demo">
          验证不通过,请根据规则完成相关信息
        </div>
      </popup>
    </div>
  </div>
</template>

<script>
  import {
    Spinner
  } from "vux"
  import {
    mapState
  } from "vuex"
  import {
    Popup,
    TransferDom
  } from "vux"
  export default {
    name: 'app',
    computed: {
      ...mapState(['isLoading']),
      parensCash() {
        return this.$store.state.parensCash
      }
    },
    directives: {
      TransferDom
    },
    components: {
      Spinner,
      Popup
    },
    methods: {
      justView() {
        let allInput = [...document.getElementsByTagName('input')];
        allInput.forEach(el => {
          el.setAttribute('disabled', true);
        })
      }
    },
    watch: {
      '$root.showTips' (val) {
        if (val) {
          setTimeout(() => {
            this.$root.showTips = false
          }, 2500)
        }
      },
    }
  }
</script>

<style lang="less">
  @import '~vux/src/styles/reset.less';
  body,
  html {
    width: 100%;
    height: 100%;
    overflow: hidden;
  }
  #app {
    width: 100%;
    height: 100%;
    .app__router-wrapper {
      width: 100%;
      height: calc(~'100% - 20px');
      overflow: hidden;
    }
  }
  .isload-mask {
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0; //background: rgba(255, 255, 255, 0.405);
    text-align: center;
    z-index: 100;
  }
  .isload-mask .isload-mask-loading {
    position: relative;
    top: 45%;
  }
  .status-top {
    width: 100%;
    height: 20px;
    color: rgba(0, 0, 0, 0.5);
    font-size: 10px;
    text-align: center;
    position: relative;
    z-index: 100;
    line-height: 20px;
  }
  .position-vertical-demo {
    background-color: #ffe26d;
    color: #000;
    text-align: center;
    line-height: 64px;
  }
</style>
