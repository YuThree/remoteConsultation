<template>    
        <div>
            <transition name="fade">
                <div @touchmove.prevent v-show="showValue" class="modal-mask" @click="maskClose"></div>           
            </transition>
            <transition name="slideInDown">
                <div v-show="showValue" class="zmodal" ref="zmodal"> 
                    <div class="select-modal-content-wr">
                        <img width="14" height="14" class="closeimg" @click="_onHide" src="./close.png" alt="">
                        <div class="sm-searchwr" v-if="search">
                            <form action='' @submit.prevent="submit">
                                <div class="serbx">
                                    <input type="search" v-model="keyWords" placeholder="机构名称 门诊/住院号 患者姓名 联系电话">
                                    <img @click="submit" width="18" height="18" src="./sear.png" alt="">
                                    <el-select v-if="filterBox" v-model="searchType" placeholder="请选择" :clearable="false" class="sm-sele" style="width:100px;height:30px">
                                        <el-option :label="item.label" :value="item.value" v-for="(item,index) in filterLists" :key="'fil'+index"></el-option>
                                    </el-select> 
                                </div>
                                
                            </form>
                        </div>  
                        <div :style="{width,height}">                           
                             <div class="table-wr">
                                <slot name="header"></slot>
                                <scroll ref="SelectModal" :pullUpLoad="pullUpLoad" @pullingUp="pullingUp" style="height:calc(100% - 44px);width:100%;"  :padTop="false">
                                    <slot name="body"></slot>
                                </scroll>
                             </div>
                        </div>            
                    </div>
                    <img class="modalbg1" width="49" height="83" src="./bg1.png" alt="">
                    <img class="modalbg2" width="69" height="208" src="./bg2.png" alt="">
                </div>                
            </transition>
        </div>           
</template>
<script> 
    /**
     * 属性          类型                 描述
     * value        Boolean     控制显示/隐藏 通过v-model绑定
     * hideOnBlur   Boolean     点击遮罩关闭
     * search       Boolean     开启搜索框
     * filterBox    Boolean     开启额外选项
     * filterLists  Array       额外选项列表 [{label:'选项1'}]
     * width        String      宽度
     * height       String      高度
     * pullUpLoad   Boolean     开启上拉加载
     * 
     * slot 类容自定义需要设置固定的高宽
     * 
     * 事件                参数              描述
     * @search     输入的值(Object)          搜索
     * @cancel                            关闭模态框
     * @pullingUp                         上拉加载
     * 
     * 方法
     * finishPullUp  上拉加载完成
     */
    export default {        
        props:{
            value:{ 
                type:Boolean,
                default:false
            },          
            width:{ 
                type:String,
                default:''
            }, 
            height:{ 
                type:String,
                default:''
            },
            
            hideOnBlur:{
                type:Boolean,
                default:true 
            },           
            search:{
                type:Boolean,
                default:true
            },
            filterBox:{
                type:Boolean,
                default:false
            },
            filterLists:{
                type:Array,
                default(){
                    return [
                        {
                            label:'选项1',
                            value:1
                        },
                        {
                            label:'选项2',
                            value:2
                        },
                    ]
                }
            },
            pullUpLoad:{
                type:Boolean,
                default:false
            }
        },
        created() {
            if(this.value){
                this.showValue = this.value
            }
        },
        mounted() {

        },
        data(){
            return{
               showValue:false,
               keyWords:'',
               searchType:'',
            }
        },
        methods:{
            submit(){
                let obj = {
                   keyWords:this.keyWords,
                   searchType:this.searchType
                }
                this.$emit('search',obj);
            },
            maskClose(){
                if(this.hideOnBlur){
                    this._onHide();
                }
            },
            _onHide () {
                this.showValue = false;
                this.$emit('input',false)
                this.$emit('cancel');
            },
            pullingUp(){
                if(this.pullUpLoad){
                    this.$emit('pullingUp');
                }
            },
            finishPullUp(bool){
                this.$refs.SelectModal && this.$refs.SelectModal.finishPullUp(bool);
            },
            refresh(){
                this.$refs.SelectModal.refresh();
            }
        },
        watch: {
            value (val) {
                this.showValue = val;
                if(val){
                    setTimeout(()=>{
                        this.$refs.SelectModal.refresh();      
                    },20)  
                }
                
            }
        }
        
    }
</script>
<style lang="less" scoped>
    .modal-mask{
        position: fixed;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        z-index: 102;
        background: rgba(0,0,0,.4);
        opacity: 1;
        transition: all .5s; 
    }
    .zmodal{
        position: fixed;
        width: auto;
        height: auto;
        box-shadow: 0 0 10px rgba(0,0,0,.15); 
        border-radius: 8px;
        background: #fff;      
        z-index: 103;
        transition: transform .5s,opacity .5s;
        top: 50%;
        left:50%;
        transform: translate(-50%,-50%);
        overflow: hidden;
        .select-modal-content-wr{
            padding: 30px;
            padding-top:40px;
            min-width: 500px;
            min-height: 311px;
            position: relative;
            .closeimg{
                position: absolute;
                right: 10px;
                top:10px;
            }
            .sm-searchwr{
                height: 50px;
                width: 100%;
                .serbx{
                    position: relative;
                    input{
                        width: 100%;
                        height: 40px;
                        border-radius: 4px;
                        outline: none;
                        border: 1px #CED7E3 solid;
                        padding-left: 42px;
                        padding-right: 30px;
                    }
                    img{
                        position: absolute;
                        left: 16px;
                        top: 11px;
                    }
                    
                }
            }
        }
        .modalbg1{
            position: absolute;
            top:50px;
            left: 0;
        }
        .modalbg2{
            position: absolute;
            top:50px;
            right: -20px;
        }
    }

    .slideInDown-enter{              
        transform: translate3d(-50%, -100%, 0);
        opacity: 0;
    }
    .slideInDown-leave-active{
         transform: translate3d(-50%, -50%, 0);
        opacity: 0;
    }
    .fade-enter,.fade-leave-active{              
        opacity: 0;
    }
    
</style>
<style lang="less">
    @import '~@/assets/css/variable.less';
    .sm-sele .el-input__inner{
        min-height: 30px !important;
        border-radius: 15px !important;
        line-height: 30px;
    }
    .table-wr{
        width: 100%;
        height: 100%;
        background: #fff;
        border-radius: 4px;
        .header{
            height: 50px;
            display: flex;
            flex-direction: row;
            flex-wrap:nowrap;
            background: #FAFBFC;
            .head-tr{
                font-size: 1.5rem;
                flex:1;
                text-align: center;
                line-height: 44px;
                font-weight:400;
            }
        }
        .tbody{
            width:100%;
            height:auto;
            overflow: hidden;
            &:before {
                .setLeftLine();
            }
            &:after {
                .setRightLine();
            }
            .tb-tr{
                
                display: flex;
                flex-direction: row;
                flex-wrap:nowrap;
                min-height: 49px;
                width:100%; 
                position: relative;
                &:after {
                    .setBottomLine();
                }
                &:first-child::before{
                    .setTopLine();
                }          
                .tb-td{
                   
                    display: flex;
                    flex:1;
                    min-height: 49px;
                    align-items: center;
                    justify-content: center;
                    span{
                        font-size: 1.4rem;
                        color:#5F7397; 
                    }

                }
            }
            .tb-tr:nth-child(even){
                background: #F8FCFE;
            }
        }

    }
</style>


