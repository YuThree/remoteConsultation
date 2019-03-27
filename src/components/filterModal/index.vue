<template>
    <div>
        <div @touchmove.prevent v-show="value" class="task-wrapper" @click="$emit('input',false)"></div>
        <transition name="slide-right">
            <div v-show="value" class="main-content" :style="{height:'calc(100% - '+top+'px)',top:top+'px'}">
                <div class="select-wrapper filterModal" ref="swScroll">
                    <div style="padding:20px 0;position:relative" @click="select($event)" ref="selects">
                        <div class="line">创建日期</div>
                        <div class="datetime-wr a">
                            <datetime v-model="startTime" ref="sDate" :end-date="formatDate" @on-change="vali" v-validate="startTime==endTime?'date_format:YYYY-MM-DD':'date_format:YYYY-MM-DD|before:eDate'" data-vv-as="开始时间" class="desc-li-date" data-vv-name="开始时间" placeholder="请选择开始时间"
                                :min-year="1900"></datetime>
                            <span class="desc-li-datamid">~</span>
                            <datetime ref="eDate" v-model="endTime" :end-date="formatDate" @on-change="vali" v-validate="startTime==endTime?'date_format:YYYY-MM-DD':'date_format:YYYY-MM-DD|after:sDate'" data-vv-as="结束日期" data-vv-name="结束日期" class="desc-li-date" :min-year="1900"
                                placeholder="请选择结束时间"></datetime>
                            <span class="cdct_error" style="top:50px;right:0">{{verrors.first('开始时间')||verrors.first('结束日期')}}</span>
                        </div>
                        <template v-for="(opt,index) in filterLists">                            
                                <div class="line" :key="opt.title">{{opt.title}}</div>
                                <div class="desc-wr" :data-key="opt.mainKey" :key="opt.mainKey+index">
                                    <div v-for="li in opt.option" class="desc-li" :data-val="li.key" :key="li.item" :class="{active:li.choose}">{{li.item}}</div>
                                </div>
</template>
                    </div>
                </div>
                <div class="bottom-wrapper" @touchmove.prevent>
                    <div class="btn-wr">
                        <div class="btn left"  @click="reset">重置</div>
                    </div>
                    <div class="btn-wr">
                        <div class="btn right" @click="complete">完成</div>                        
                    </div>
                </div>
            </div>
        </transition>
    </div>
</template>

<script>
    /**
     * 属性          类型                 描述
     * value        Boolean     控制显示/隐藏 通过v-model绑定
     * top          Number      距离顶部高度
     * filterLists  Array       筛选列表
     * startTime  string       默认开始时间
     * endTime  string       默认结束时间
     * 
     * 事件          参数                 描述
     * @complete    data        点击完成的回调，data为筛选结果对象
     */
    import BScroll from 'better-scroll'
    export default {
        props: {
            value: {
                type: Boolean,
                default: false
            },
            top: {
                type: Number,
                default: 0
            },
            filterLists: {
                type: Array,
                default () {
                    return []
                }
            },
        },
        data() {
            return {
                startTime:'',
                endTime:''
            }
        },
        created() {
            let date = new Date();
            var m = (date.getMonth() + 1 + '').padStart(2, 0);
            var d = (date.getDate() + '').padStart(2, 0);
            this.formatDate = date.getFullYear() + '-' + m + '-' + d;
        },
        mounted() {
            this.scoller = new BScroll(this.$refs.swScroll, {
                click: true
            });
        },
        methods: {
            select(e) {
                //const path = e.path || (e.composedPath && e.composedPath());
                let classList = e.target.classList;
                classList.toggle('active');
            },
            vali() {
                this.$nextTick(() => {
                    this.$validator.validate();
                })
            },
            //重置
            reset() {
                let selects = this.$refs.selects;
                let li = selects.querySelectorAll('.desc-li.active');
                li.forEach(el => {
                    el.classList.remove('active');
                    el.classList.remove('disabled');
                });
                this.startTime = '';
                this.endTime = '';
            },
            //完成
            complete() {
                this.$validator.validate()
                    .then(res => {
                        if (res) {
                            let obj = {};
                            let selects = this.$refs.selects;
                            let li = selects.querySelectorAll('.desc-li.active');
                            li.forEach(el => {
                                let par = el.parentNode;
                                if (obj[par.dataset.key]) {
                                    obj[par.dataset.key] += '|' + el.dataset.val;
                                } else {
                                    obj[par.dataset.key] = el.dataset.val;
                                }
                            });
                            if (this.startTime && this.endTime) {
                                obj.startTime = this.startTime;
                                obj.endTime = this.endTime;
                            }
                            this.$emit('complete', obj);
                            this.$emit('input', false);
                        }
                    })
            }
        },
        watch: {
            value() {
                setTimeout(() => {
                    this.scoller.refresh()
                }, 20)
            }
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
    .main-content {
        position: absolute;
        width: 371px;
        height: 100%;
        background: #fff;
        top: 0;
        right: 0;
        z-index: 99;
        transition: transform .3s;
        .select-wrapper {
            width: 100%;
            height: calc(~'100% - 83px');
            overflow: hidden;
            padding: 0 18px;
            .line {
                font-size: 1.5rem;
                color: #333;
            }
            .desc-wr {
                display: flex;
                flex-direction: wrap;
                flex-wrap: wrap;
                padding-top: 17px;
                .desc-li-date {
                    display: inline-block;
                    position: relative;
                    width: 144px;
                    height: 30px;
                    background: rgba(249, 249, 249, 1);
                    border-radius: 15px;
                    border: 1px solid rgba(225, 225, 225, 1);
                    color: #666666;
                    font-size: 1.4rem;
                    padding: 0 9px;
                    line-height: 30px;
                    &::after {
                        content: ' ';
                        display: inline-block;
                        position: absolute;
                        width: 0;
                        height: 0;
                        right: 16px;
                        top: 12px;
                        border-top: 4px solid #646E83;
                        border-left: 3px solid transparent;
                        border-right: 3px solid transparent;
                        border-bottom: 5px solid transparent;
                    }
                }
                .desc-li-datamid {
                    width: 42px;
                    height: 30px;
                    line-height: 30px;
                    color: #666;
                    text-align: center;
                }
                .desc-li {
                    width: 104px;
                    height: 30px;
                    background: rgba(249, 249, 249, 1);
                    border-radius: 15px;
                    border: 1px solid rgba(225, 225, 225, 1);
                    text-align: center;
                    line-height: 30px;
                    font-size: 1.4rem;
                    color: #666;
                    margin-bottom: 10px;
                    &:nth-child(2),
                    &:nth-child(5),
                    &:nth-child(8),
                    &:nth-child(11) {
                        margin: 0 10px;
                    } // &:nth-child(5){
                    //     margin:0 10px;
                    // }
                    &:last-child {
                        margin-bottom: 36px;
                    }
                    &.active {
                            background: #bde7f9;
                            border: 1px solid #4bc6fa;
                            color: #179eff;
                    }
                    &.disabled {
                        background: #f9f9f9;
                        border: 1px solid #eeeeee;
                        color: #d0d0d0;
                    }
                }
            }
        }
        .bottom-wrapper {
            display: flex;
            flex-direction: wrap;
            flex-wrap: nowrap;
            position: absolute;
            bottom: 0;
            width: 100%;
            height: 83px;
            box-shadow: 0px -4px 6px 0px rgba(246, 247, 251, 1);
            .btn-wr {
                flex: 5;
                .btn {
                    width: 150px;
                    height: 44px;
                    border-radius: 22px;
                    font-size: 1.6rem;
                    text-align: center;
                    line-height: 44px;
                    margin: 19px auto;
                    &.left {
                        background: rgba(249, 249, 249, 1);
                        border: 1px solid rgba(238, 238, 238, 1);
                        color: #666;
                    }
                    &.right {
                        background: linear-gradient(90deg,  rgba(2, 147, 253, 0.93)0%, rgba(48, 194, 250, 0.84) 100%);
                        color: #fff;
                    }
                }
            }
        }
    }
    .datetime-wr {
        position: relative;
        .desc-li-date {
            display: inline-block;
            position: relative;
            width: 144px;
            height: 30px;
            background: rgba(249, 249, 249, 1);
            border-radius: 15px;
            border: 1px solid rgba(225, 225, 225, 1);
            color: #666666;
            font-size: 1.4rem;
            padding: 0 9px;
            line-height: 30px;
            margin: 17px 0;
            &::after {
                content: ' ';
                display: inline-block;
                position: absolute;
                width: 0;
                height: 0;
                right: 16px;
                top: 12px;
                border-top: 4px solid #646E83;
                border-left: 3px solid transparent;
                border-right: 3px solid transparent;
                border-bottom: 5px solid transparent;
            }
        }
        .desc-li-datamid {
            width: 42px;
            height: 30px;
            line-height: 30px;
            color: #666;
            text-align: center;
        }
    }
    .slide-right-enter-active,
    .slide-right-leave-to {
        transform: translate3d(0, 0, 0);
    }
    .slide-right-enter,
    .slide-right-leave-active {
        transform: translate3d(100%, 0, 0);
    }
</style>
<style>
    .datetime-wr.a .vux-cell-placeholder {
        font-size: 1.4rem !important;
        color: #646E83 !important;
        top: -2px;
        position: relative;
    }
    .filterModal .weui-cell__ft {
        text-align: left !important;
    }
</style>
