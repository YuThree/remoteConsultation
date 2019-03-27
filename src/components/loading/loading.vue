<template>
	<div class="questLoading" v-show="showLoading" @touchmove.prevent>
        <div class="loadingbox" v-show="!showReload">
		    <spinner type="lines"></spinner>
            <div class="text">{{ctext}}</div>
        </div>
        <div class="loadingbox" v-show="showReload">
		    <span class="reloadBtb" @click="toReload">重新加载</span>
        </div>
	</div>	
</template>

<script>
import {Spinner} from 'vux'
export default {
    name: 'loading',
    props:{
        text:{
            type:String,
            default:'加载中...'
        }
    },
    data () {
        return {
            showLoading:false,
            showReload:false,
            ctext:this.text
        }
    },
    methods:{
        show(text){
            if(text)this.ctext = text;
            this.showLoading = true;
        },
        hide(){
            this.showLoading = false;
        },
        reload(){
            this.showReload = true;            
        },
        toReload(){
            this.showReload = false;  
            this.$emit('reload');
        }
    },
    components:{
        Spinner
    }
}
</script>

<style lang="less" scoped>
    .questLoading{
        width: 100%;
        height: 100%;
        background: rgba(255,255,255,.7);
        position: absolute;
        left: 0;
        top:0;
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 104;
        .loadingbox{
            text-align: center;
            .text{
                font-size: 1.0rem;
                color: #999;
            }
            .vux-spinner{
                stroke: #0293fd;
            }
            .reloadBtb{
                font-size: 1.2rem;
                color: #666; 
            }
        }
    }
</style>