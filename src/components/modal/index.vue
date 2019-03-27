<template>    
        <div>
            <transition name="fade">
                <div @touchmove.prevent v-show="showValue" class="modal-mask" @click="maskClose"></div>           
            </transition>
            <transition name="zoomInDown">
                <div v-show="showValue" class="z-modal-wrapper">
                    <!-- 内容自定义 -->
                    <div class="zmodal" :style="{height,width}"> 
                        <div class="title" v-if="title">{{title}}</div>  
                        <img v-if="nofooter" @click="maskClose" class="closeImg" width="14" height="14" src="./close.png" alt="">
                        <div class="contant" :class="{notitle:title=='',nofooter:nofooter}">
                            <slot></slot>
                        </div>
                        <div class="footer vux-1px-t" v-if="!nofooter">
                            <div class="al-btn cancel" @click="cancel">取消</div>
                            <div class="al-btn ook" @click="ok">{{okBtnText}}</div>
                        </div>          
                        <img class="modalbg1" width="49" height="83" src="./bg1.png" alt="">
                        <img class="modalbg2" width="69" height="208" src="./bg2.png" alt="">
                    </div>                 
                </div>
                
            </transition>
        </div>
        
    
</template>
<script> 
    /**
     * 属性          类型                 描述
     * value        Boolean     控制显示/隐藏 通过v-model绑定
     * hideOnBlur   Boolean     点击遮罩关闭
     * title        String      标题
     * height       String      高度默认70%
     * width       String       宽度默认80%
     * 
     * 事件          参数                 描述
     * @on-ok                           点击确认
     * @on-cancel                       点击取消
     */
    export default {
        
        props:{
            value:{ 
                type:Boolean,
                default:false
            },
            hideOnBlur:{
                type:Boolean,
                default:true 
            },           
            title:{
                type:String,
                default:''
            },

            height:{
                type:String,
                default:'400px'
            },
            width:{
                type:String,
                default:'500px'
            },
            okBtnText:{
                type:String,
                default:'确认'
            },
            nofooter:{
                type:Boolean,
                default:false
            }

        },
        created() {
            if(this.value){
                this.showValue = this.value
            }
        },
        data(){
            return{
               showValue:false
            }
        },
        methods:{

            maskClose(){
                if(this.hideOnBlur){
                    this._onHide();
                    this.$emit('cancel');
                }
            },
            ok(){
                this._onHide();
                this.$emit('on-ok');             
            },
            cancel(){
                this.$emit('on-cancel');
                this._onHide();
            },
            _onHide () {
                this.showValue = false;
            }
        },
        watch: {
            value (val) {
                this.showValue = val
            },
            showValue (val) {
                this.$emit('input', val)
            }
        }
        
    }
</script>
<style lang="less" scoped>
    .type4{
        position:relative;
        z-index:105;
    }
    .modal-mask{
        position: fixed;
        top: 0;
        left: 0;
        height: 100%;
        width: 100%;
        z-index: 102;
        background: rgba(0,0,0,.4);
        opacity: 1;
        transition: all .3s; 
    }
    .z-modal-wrapper{
        position:fixed;
        z-index: 103;
        top: 50%;
        left: 50%;
        transition: all .5s; 
        opacity: 1; 
        transform: translate3d(-50%,-50%,0);
    }
    .zmodal{
        position: relative;
        box-shadow: 0 0 10px rgba(0,0,0,.15); 
        border-radius: 4px;
        background: #fff;  
        .closeImg{
            position: absolute;
            top:20px;
            right: 20px;
        }
        .title{
            width: 100%;
            text-align: center;
            font-size: 2rem;
            color: #303336;
            font-weight:600;
            padding: 34px 0;
        }       
        .contant{
            width: 100%;
            height: calc(~'100% - 154px');
            padding:0 30px;
            overflow: hidden;
            &.notitle{
                height: calc(~'100% - 54px');
            }
            &.notitle.nofooter{
                height: 100%;
            }
        }
        .footer{
            display:flex;
            flex-direction: wrap;
            flex-wrap: nowrap;
            position: absolute;
            bottom:0;
            height: 54px;
            width:100%;           
            div{
                flex: 5;
                line-height: 54px;
                text-align: center;
                color:rgba(0, 150, 255, 1);
                &.ook{
                    color: #fff;
                    background:linear-gradient(90deg,rgba(48,194,250,0.84) 0%,rgba(2,147,253,0.93) 100%);
                }
                &.al-btn:first-child{
                    border-bottom-left-radius:4px;
                }
                &.al-btn:last-child{
                    border-bottom-right-radius:4px;
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
            right: 0;
        }
        
    }
    .zoomInDown-enter{                   
        transform:translate3d(-50%,-100%,0);
        opacity: 0;
    }
    .zoomInDown-leave-active{
        transform:translate3d(-50%,-50%,0);
        opacity: 0;
    }
    .fade-enter,.fade-leave-active{              
        opacity: 0;
    }


</style>
