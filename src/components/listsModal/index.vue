<template>
    <div>
        <!-- <div @touchmove.prevent v-show="value" class="task-wrapper" @click="$emit('input',false)"></div> -->
        <transition name="slide-right">       
            <div v-show="value" class="main-content" :style="{height:'calc(100% - '+top+'px)',top:top+'px'}" @click.stop>
                <div class="dateFilterBox">
                    <datetime v-model="startDate" ref="stDate" v-validate="startDate==endDate?'date_format:YYYY-MM-DD':'date_format:YYYY-MM-DD|before:endDate'" data-vv-as="开始时间" @on-change="vali"   class="desc-li-date"  data-vv-name="开始时间"  placeholder="选择开始时间" :min-year="1900"></datetime>
                    <span class="desc-li-datamid">~</span>
                    <datetime ref="endDate" v-model="endDate" v-validate="startDate==endDate?'date_format:YYYY-MM-DD':'date_format:YYYY-MM-DD|after:stDate'" @on-change="vali"  data-vv-as="结束日期" data-vv-name="结束日期" class="desc-li-date" :min-year="1900" placeholder="选择结束时间"></datetime>
                    <span class="btn" @click="search">搜索</span>
                    <span class="cdct_error" style="top:48px;right:0;font-size:1rem;">{{verrors.first('结束日期')||verrors.first('开始时间')}}</span>                           
                </div>
                <div class="select-wrapper" :class="{'hasdata':lists.length>0}">
                    <div class="lis-content">
                        <scroll 
                        :pullDownRefresh="true"
                        :pullUpLoad="true"
                        @pullingDown="scrollPullDown" 
                        @pullingUp="scollPullingUp"
                        :data="lists" 
                        style="overflow:inherit;width:100%" 
                        ref="scoller" 
                        :padTop="false">
                            <div class="li-item" v-for="(n,index) in lists" :class="{active:active===index}" @click.stop="itemClick(n,index)" :key="'ls'+index">
                                <div class="date">{{n.date}}</div>
                                <div>备注<span class="gray">{{n.bz}}</span></div>
                            </div>
                        </scroll>
                    </div>
                    <!-- 第一次加载的Loading -->
                    <div class="sloading" v-show="lists.length==0 && showLoading">
                        <spinner type="android"></spinner>
                    </div>
                    <!-- 暂无数据 -->
                    <div class="nodata" v-show="lists.length==0 && !showLoading">
                        <img width="163" height="101" :src="require('./nodata.png')" alt="">
                        <p>暂无数据</p>
                    </div>
                </div>
                <div class="btn1" @click.stop="$emit('input',false)">
                    <span>{{btnText}}</span>
                </div>
            </div>
        </transition>
        <transition name="slide-right">       
            <div v-show="!value" class="btn2" @click.stop="$emit('input',true)">
                <span>{{btnText}}</span>
            </div>
        </transition>
    </div>
</template>

<script>
    /**
     * 
     * 属性          类型                 描述
     * value        Boolean     控制显示/隐藏 通过v-model绑定
     * top          Number      距离顶部高度
     * lists        Array       列表
     * lsActive     Number      设置列表选中
     * showLoading  Boolean     显示Loading
     * 
     * 事件          参数                 描述
     * @li-click    data,index        点击列表的回调，data为筛选结果对象，index下标
     * @pullingDown             下拉回调
     * @pullingUp               上拉回调
     * @on-search    date       搜索
     * 
     * 方法
     * finishPullDown           下拉完成
     * finishPullUp             上拉完成
     * 
     * 数据格式(暂定)
     * [
     *      {
     *          date:'',
     *          bz:''
     *      }
     * ]
     * 
     * demo test.vue
     */
    import {Spinner } from 'vux';
    export default {
        props:{
            value:{
                type:Boolean,
                default:false
            },
            top:{
                type:Number,
                default:0
            },
            lists:{
                type:Array,
                default(){
                    return []
                }
            },
            lsActive:{
                type:[Number,String],
                default:''
            },
            showLoading:{
                type:Boolean,
                default:false
            },
            btnText:{
                type:String,
                default:'随访记录'
            }

        },
        data(){
            return {
                active:'',
                startDate:new Date().getFullYear()+'-01-01',
                endDate:''
            }
        },
        created() {
            let date = new Date();
            var m = (date.getMonth() + 1+'').padStart(2,0);  
            var d = (date.getDate()+'').padStart(2,0);  
            this.formatDate = date.getFullYear()+'-'+m+'-'+d;
            this.endDate = this.formatDate;
            this.active = this.lsActive;
        },
        mounted() {
            //3s后关闭loading
            setTimeout(()=>{
                this.sloading = false;
            },3000)      
        },
        methods:{
            vali(){
                this.$nextTick(()=>{
                    this.$validator.validate();
                })
            },
            search(){
                this.$validator.validate().then(res => {
                    if(res){
                        let date = {
                            startDate:this.startDate,
                            endDate:this.endDate
                        }
                       this.$emit('on-search',date); 
                    }
                })
            },
            itemClick(n,index){
                this.active = index;
                this.$emit('li-click',n,index);
            },
            scrollPullDown(){
                this.$emit('pullingDown');
            },
            scollPullingUp(){
                this.$emit('pullingUp');
            },
            finishPullDown(){
                this.$refs.scoller.finishPullDown();
            },
            finishPullUp(b){
                this.$refs.scoller.finishPullUp(b);
            }
        },
        watch:{
            value(val){
                if(val){
                    setTimeout(()=>{
                        this.$refs.scoller.refresh();
                    },20)
                }
            },
            lsActive(val){
                this.active = val;
            }
        },
        components:{
            Spinner
        }
    }
</script>

<style lang="less" scoped>
    .task-wrapper {
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        height: 100%;
        z-index: 98;
    }
    .main-content{
        position: absolute;
        width: 359px;
        height: 100%;
        background: #f5f5f5;
        top:0;
        right: 0;
        z-index: 99;
        transition: transform .3s;
        border-left:1px solid #e1e1e1;
        .dateFilterBox{
            width: 100%;
            height:64px;
            background: #fff;
            position: relative;
            padding: 17px 14px;
            .desc-li-date{
                display: inline-block;
                position: relative;
                width:118px;
                height:30px;
                background:rgba(249,249,249,1);
                border-radius:4px;
                border:1px solid rgba(225,225,225,1);
                color: #666666 !important;
                font-size: 1.4rem !important;
                padding: 0 9px;
                line-height: 30px;
                .weui-cell__ft{
                    font-size: left !important;
                }
                &::after{
                    content: ' ';
                    display: inline-block;
                    position: absolute;
                    width: 0;
                    height: 0;
                    right: 10px;
                    top:12px;
                    border-top: 4px solid #646E83;
                    border-left: 3px solid transparent;
                    border-right: 3px solid transparent;
                    border-bottom: 5px solid transparent;
                }
            }
            .desc-li-datamid{
                width: 42px;
                height: 30px;
                line-height: 30px;
                color: #666;
                text-align: center;
            }  
            .btn{
                padding:4px 11px;
                background:rgba(240,253,251,1);
                border-radius:4px;
                border:1px solid #E5F4F2;
                font-size:1.5rem;
                color:#29C2B3;
                margin-left:10px;
            }
        }
        .select-wrapper{
            height: calc(~'100% - 64px');
            width: 100%;
            overflow: hidden;
            padding: 20px;
            position: relative;
            &.hasdata::before{
                content:'';
                position: absolute;
                border-left: 1px solid #e1e1e1;
                left: 25px;
                top: 0;
                height: 100%;
                z-index: -1;
            }
            .lis-content{
                width: 100%;
                height: 100%;
                padding-left: 29px;
                .li-item{
                    width: 290px;
                    padding:10px 20px;
                    background:#fff;
                    border-radius: 4px;
                    word-break: break-all;
                    position: relative;
                    margin-bottom: 10px;
                    .gray{
                        font-size: 1.4rem;
                        color: #999;
                        margin-left: 10px;
                    }
                    &::before{
                        content: '';
                        position: absolute;
                        border: 7px solid transparent;
                        border-right-color:#fff;
                        left: -14px; 
                        top: 17px;
                    }
                    &::after{
                        content: '';
                        display: inline-block;
                        width:9px;
                        height:9px;
                        position: absolute;
                        left:-28px;
                        top:18px;
                        background: #e1e1e1;
                        border-radius: 50px;
                    }
                    &.active{
                        .date{
                            color:#29C2B3;
                        }
                        &::after{
                            background: #29C2B3;
                        }
                    }
                }
            }
        }
        .btn1{
            position: absolute;
            width:40px;
            height: 100px;
            top:calc(~'50% - 50px');
            left: 0;
            background-image: url('./btn1.png');
            background-size: 100%;
            text-align: center;
            span{
                display: inline-block;
                position: relative;
                width: 14px;
                color: #29C2B3;
                font-size: 1.4rem;
                word-wrap: break-word; 
                line-height: 18px;
                top:14px;
            }
        }
    }
    .btn2{
        position: absolute;
        width:40px;
        height: 100px;
        top:calc(~'50% - 50px');
        right: 0;
        background-image: url('./btn.png');
        background-size: 100%;
        text-align: center;
        transition:all .3s;
        transition-delay: .1s;
        span{
            display: inline-block;
            position: relative;
            width: 14px;
            color: #fff;
            font-size: 1.4rem;
            word-wrap: break-word; 
            line-height: 18px;
            top:14px;
        }
    }
    .sloading{
        position: absolute;
        top: 30%;
        text-align: center;
        width: 100%;
        padding-right: 20px;
    }
    .nodata{
        position: absolute;
        top: 20%;
        text-align: center;
        width: 100%;
        padding-right: 20px;
        p{
            color:#999;
            font-size: 12px;
            margin-top: -5px;
        }
    }
    .slide-right-enter-active,.slide-right-leave-to{
        transform: translate3d(0, 0, 0);
    }
    .slide-right-enter,.slide-right-leave-active{              
        transform: translate3d(100%, 0, 0);
    }

</style>
<style>
    .dateFilterBox .weui-cell__ft{
        text-align: left !important;
    }
</style>
