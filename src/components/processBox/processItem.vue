<template>
    <div class="process-item__wrapper" :class="{done,current}">
        <div style="width: 100%;">
            <div class="outer-circle">
                <span class="inner-circle">
                   <img v-if="done" width="11" height="11" src="./done.png" alt="">
                   <template v-else>{{step}}</template>
                </span>
            </div>
            <div class="process-item__text">
                <slot></slot>
                <div class="time">
                    <slot name="time"></slot>
                </div>
            </div>
            
        </div>
    </div>
</template>

<script>
    export default {
        props:{
            done:{
                type:Boolean,
                default:false
            },
            current:{
                type:Boolean,
                default:false
            },
            step:{
                type:String,
                default:''
            }
        }
    }
</script>

<style lang="less" scoped>
    
    .process-item__wrapper{
        display:flex;
        flex-direction: row;
        flex-wrap: nowrap;
        align-items:center;
        justify-content: center;
        text-align: center;
        flex: 1;
        position: relative;
        &::before{
            content: '';
            position: absolute;
            width: 100%;
            height:2px;
            background:#CED7E3;
            top: calc(~'50% - 15px');
            left: -50%;
            z-index: 1;
        }
        &:first-child::before{
            display: none;
        }
        .outer-circle{
            display:inline-block;
            position: relative;
            z-index: 2;
            width: 30px;
            height: 30px;
            border-radius: 50%;
            border:1px solid #CED7E3;           
            margin-bottom: 6px;
            background: #fff;
            .inner-circle{
                display: inline-block;
                width: 22px;
                height: 22px;
                line-height: 22px;
                font-size: 12px;
                color: #fff;
                border-radius: 50%;
                background:#CED7E3;
                margin-top: 3px;
                img{
                    margin-top: 6px;
                }
            }
            
        }
        .process-item__text{
            position: relative;
            width: 100%;
            font-size: 14px;
            color: #AEBFCF;
            .time{
                position:absolute;
                width: 100%;
                top: 20px;
                left: 50%;
                transform: translateX(-50%);
                color: #AEBFCF;
                font-size: 12px;
            }
            @media only screen and (max-device-width :768px){ 
                font-size: 12px;
            } 
            @media only screen and (max-device-width :600px){ 
                font-size: 10px;
            } 
        }
        &.done,&.current{
            .process-item__text .time{
                color:  #19293F;
            }
            .outer-circle{
                border:1px solid rgba(2,147,253,0.93);
                .inner-circle{
                    background:linear-gradient(90deg,rgba(48,194,250,0.84) 0%,rgba(2,147,253,0.93) 100%);
                }
            }
            &::before{
                background:linear-gradient(90deg,rgba(48,194,250,0.84) 0%,rgba(2,147,253,0.93) 100%);
            }
            .process-item__text{
                color: #19293F;
            }
        }
    }
</style>