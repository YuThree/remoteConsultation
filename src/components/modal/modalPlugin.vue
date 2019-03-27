<template>    
        <div>
            <transition name="fade">
                <div @touchmove.prevent v-show="showValue" class="modal-mask" @click="maskClose"></div>           
            </transition>
            <transition name="slideInDown">
                <div v-show="showValue" class="zmodal"> 
                    <!-- alert -->
                    <div v-show="type==='alert'">
                        <div class="al-message">
                            <img src="./alert.png" width="94" height="116" alt=""> 
                            <div class="message-desc">{{message}}</div>   
                        </div>       
                        <div class="al-footer vux-1px-t">
                            <div class="al-btn" @click="alertCancel">取消</div>
                            <div class="al-btn ojbk" @click="alertOK">确认</div>
                        </div>                 
                    </div>
                    <!-- success -->
                    <div v-show="type==='success'">
                        <div class="al-message">
                            <img src="./success.png" width="94" height="116" alt=""> 
                            <div class="message-desc">{{message}}</div>   
                        </div>       
                        <div class="al-footer vux-1px-t">
                            <div class="single-btn ojbk" @click="alertOK">确认</div>
                        </div>                 
                    </div>
                    <!-- error -->
                    <div v-show="type==='error'">
                        <div class="al-message">
                            <img src="./error.png" width="94" height="116" alt=""> 
                            <div class="message-desc">{{message}}</div>   
                        </div>       
                        <div class="al-footer vux-1px-t">
                            <div class="single-btn  ojbk" @click="alertOK">确认</div>
                        </div>                 
                    </div>
                    <!-- 404 -->
                    <div v-show="type==='404'">
                        <div class="al-message errorPrompt">
                            <img src="./404.png" width="235" height="146" alt=""> 
                            <div class="message-desc">{{message}}</div>   
                        </div>       
                        <div class="al-footer vux-1px-t">
                            <div class="single-btn" @click="alertOK">取消</div>
                        </div>                 
                    </div>
                    <!-- 500 -->
                    <div v-show="type==='500'">
                        <div class="al-message errorPrompt">
                            <img src="./500.png" width="235" height="146" alt=""> 
                            <div class="message-desc">{{message}}</div>   
                        </div>       
                        <div class="al-footer vux-1px-t">
                            <div class="single-btn" @click="alertOK">取消</div>
                        </div>                 
                    </div>
                    <!-- serverErr -->
                    <div v-show="type==='serverErr'">
                        <div class="al-message errorPrompt">
                            <img src="./serverErr.png" width="235" height="146" alt=""> 
                            <div class="message-desc">{{message}}</div>   
                        </div>       
                        <div class="al-footer vux-1px-t">
                            <div class="single-btn" @click="alertOK">取消</div>
                        </div>                 
                    </div>
                    <div v-show="type!='404'&&type!='500'&&type!='serverErr'">
                        <img class="modalbg1" width="58" height="83" src="./bg1.png" alt="">
                        <img class="modalbg2" width="70" height="208" src="./bg2.png" alt="">
                    </div>
                    
                </div>                
            </transition>
        </div>           
</template>
<script> 
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
            type:{
                type:String,
                default:''
            },
            message:{
                type:String,
                default:'' 
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
                }
            },
            _onHide () {
                this.showValue = false;
            },
            alertOK(){
                this.showValue = false;
                this.callback && this.callback();
            },
            alertCancel(){
                this.showValue = false;
                this.callback && this.callback('cancel');
            }
        },
        watch: {
            value (val) {
                this.showValue = val
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
        z-index: 998;
        background: rgba(0,0,0,.4);
        opacity: 1;
        transition: all .3s; 
    }
    .zmodal{
        position: fixed;
        width: 358px;
        height: 311px;
        box-shadow: 0 0 10px rgba(0,0,0,.15); 
        border-radius: 8px;
        background: #fff;      
        z-index: 999;
        transition: all .3s;
        top: calc(~'50% - 155px');
        left:calc(~'50% - 179px');
        overflow: hidden;
        .al-message{
            text-align: center;
            color:#999;
            min-height: 47px;
            height: 257px;
            text-align: center;
            padding-top: 50px;
            .message-desc{
                color: #666;
                margin-top: 18px;
            }
        }
        .errorPrompt{
            .message-desc{
                margin-top: -5px;
            }
        }
        .al-footer{
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
                font-size: 2.0rem;
                &.ojbk{
                    color: #fff;
                    background:linear-gradient(90deg,rgba(48,194,250,0.84) 0%,rgba(2,147,253,0.93) 100%);
                }
                &.single-btn{
                    border-bottom-right-radius:8px;
                    border-bottom-left-radius:8px;
                }
                &.al-btn:first-child{
                    border-bottom-left-radius:8px;
                }
                &.al-btn:last-child{
                    border-bottom-right-radius:8px;
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
        //transform: translate3d(0, -30%, 0);
        transform: scale3d(1.3, 1.3, 1.3);
        opacity: 0;
    }
    .slideInDown-leave-active{
        transform: scale3d(.8, .8, .8);
        opacity: 0;
    }
    .fade-enter,.fade-leave-active{              
        opacity: 0;
    }

</style>

