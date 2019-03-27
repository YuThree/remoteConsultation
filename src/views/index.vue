<template>
    <v-touch v-on:swiperight="swiperright" class="wrapper cdct_relative">
        <div class="main">
            <div class="mask" v-show="showMenu" @click="showMenu = false"></div>
            <div class="mianIndex-wrapper">
                <div class="header">
                    <div class="menu_button" @click="showMenu = !showMenu">
                        <span>{{msgNumber}}</span>
                    </div>
                    <p class="info">你好,管理员</p>
                    <div class="operation" @click.stop="toggleDropdownMenu = !toggleDropdownMenu">
                        <img src="~@/assets/imgs/user.png" alt="" width="46" height="46">
                    </div>
                    <animation enter="fadeInDown faster" leave="fadeOutUp faster">
                        <div class="dropdown_menu" v-show="toggleDropdownMenu">
                            <p class="i i1" @click.stop="$router.push('PersonalInfo')">编辑资料</p>
                            <p class="i i2" @click.stop="$router.push('ChangePassword')">修改密码</p>
                            <p class="i i3" @click.stop="logout">退出登录</p>
                        </div>
                    </animation>
                </div>
                <h1 class="title">沙湾县远程医疗信息平台</h1>
                <swiper :options="swiperOption">
                    <swiper-slide>
                        <div @click="activeIndex == 0 && isJump('12') && $router.push('RemoteConsultation')">
                            <div class="icon ic1"></div>
                            <h3>远程会诊系统</h3>
                            <p class="info">交流无时间空间限制</p>
                            <p class="info">呈现最精准诊疗场景</p>
                        </div>
                    </swiper-slide>
                    <swiper-slide>
                        <div @click="activeIndex == 1 && isJump('14') && $router.push('RemoteImage')">
                            <div class="icon ic2"></div>
                            <h3>远程影像诊断系统</h3>
                            <p class="info">精准效率会诊，全像素控制</p>
                            <p class="info">数据智能储存</p>
                        </div>
                    </swiper-slide>
                    <swiper-slide>
                        <div @click="activeIndex == 2 && isJump('15') && $router.push('RemoteECG')">
                            <div class="icon ic3"></div>
                            <h3>远程心电诊断系统</h3>
                            <p class="info">数学式实时监护</p>
                            <p class="info">远程诊疗呵护心脏</p>
                        </div>
                    </swiper-slide>
                </swiper>
            </div>
        </div>
        <animation enter="slideInRight faster" leave="slideOutRight faster">
            <scroll class="menuBox" v-show="showMenu">
                <h2>系统消息</h2>
                <!-- <div class="clear" @click="clearMsg">清空</div> -->
                <div class="news" v-for="(item,index) in newsList" :key="'news' + index">
                    <div class="title t1">{{item.CLXMC}}</div>
                    <div class="content">
                        <div class="bars" @click="gotoMsg(item,1)">
                            <div class="number">{{item.COUNT}}</div>
                            <div class="info">公告消息</div>
                        </div>
                        <div class="bars" @click="gotoMsg(item,2)">
                            <div class="number">{{item.NUMBER}}</div>
                            <div class="info">审批消息</div>
                        </div>
                    </div>
                </div>
            </scroll>
            
        </animation>
        
    </v-touch>
    
</template>

<script>
    import 'swiper/dist/css/swiper.css'
    import { swiper, swiperSlide } from 'vue-awesome-swiper'
    import Animation from '@/components/animation'
    import { Drawer } from 'vux'
    export default {
        name: 'Home',
        components:{
            swiper,swiperSlide,Animation,Drawer
        },
        mounted() {
            document.body.addEventListener('click',()=>{
                this.toggleDropdownMenu = false;
            },false)
            if(window.localStorage.token){
                this.token = window.localStorage.token;
                // 消息列表
                this.getNewsList();
                // 获取权限
                this.getCard();
            }

            
        },
        data() {
            const THIS = this
            return {
                token: '',
                drawerVisibility: false,
                toggleDropdownMenu: false,
                showMenu: false,
                permission: [],
                swiperOption: {
                    effect: 'coverflow',
                    initialSlide: 1,
                    grabCursor: true,
                    centeredSlides: true,
                    slidesPerView: 'auto',
                    nested: true,
                    coverflowEffect: {
                        rotate: 0,
                        stretch: 0,
                        depth: 300,
                        modifier: 1,
                        slideShadows : true
                    },
                    on: {
                        slideChange(){
                            THIS.activeIndex = this.activeIndex;
                        },
                        click(){
                            // if(this.activeIndex == 1){
                            //     THIS.$router.push('RemoteConsultation/NewApplication')
                            // }
                        }
                    }
                },
                activeIndex: 1,
                newsList: [],
            }
        },
        methods: {
            swiperright(){  // 右滑
                if(this.showMenu){
                    this.showMenu = false;
                }
                
            },
            getCard(){
                this.$ajax.post('',{
                    "MSH.1": "role",
                    "MSH.2": "findsys",
                    "token": this.token,
                    "FORMAT":2
                }).then(res => {
                    let arr = JSON.parse(res.data);
                    arr.forEach(item=>{
                        this.permission.push(item.SBH);
                    })
                }).catch(error => {
                    console.log(error)
                });
            },
            isJump(num){
                window.localStorage.IGHZL = num;
                if(this.permission.indexOf(num) != -1){
                    return true;
                }else{
                    this.$MessageCase.show('没有权限','error')
                    return false;
                }
            },
            getNewsList(){
                this.$ajax.post('',{
                    "MSH.1": "UtilCommon",
                    "MSH.2": "selXTXXSL",
                    "token": this.token,
                    "FORMAT": 2
                }).then(res => {
                    if(res.code == '100'){
                        this.newsList = this.newsList.concat(res.data.rows);
                        this.newsList = this.newsList.filter((item)=>{
                            return item.CLX == '12' || item.CLX == '14' || item.CLX == '15'
                        })
                    }
                }).catch(error => {
                    console.log(error)
                });
            },
            clearMsg(){ // 清空消息
                this.newsList.forEach(item => {
                    item.NUMBER = 0;
                    item.COUNT = 0;
                })
            },
            logout() {  // 退出登录
                var params = new URLSearchParams();
                // params.append('FORMAT', '1');       //你要传给后台的参数值 key/value
                params.append('token', this.token);

                this.$ajax({
                    url:this.$root.logoutUrl,
                    method: 'post',
                    data: params
                }).then(res => {
                    if(res.errorCode == '100'){
                        this.$store.commit('setParensCash','');
                        this.$router.push('/');
                    }
                    
                }).catch(error => {
                    console.log(error)
                });
            },
            gotoMsg(i,n){
                console.log(i,n)
                switch (i.CLX) {
                    //远程会诊系统--12  远程影像系统--14   远程心电系统--15
                    case '12':
                        this.$router.push({name:'systemMessage',params:{type:i.CLX,place:n}});
                        break;
                    case '14':
                        this.$router.push({name:'systemMessage',params:{type:i.CLX,place:n}});
                        break;
                    case '15':
                        this.$router.push({name:'systemMessage',params:{type:i.CLX,place:n}});
                        break;
                   
                }
            }
        },
        computed: {
            msgNumber(){
                let number = 0;
                this.newsList.forEach((item)=>{
                    number += ~~item.NUMBER + ~~item.COUNT;
                })
                return number;
            }
        }
    }
</script>

<style lang="less" scoped>
    .wrapper{
        height: 100%;
        width: 100%;
        overflow: hidden;
        .main {
            width:100vw;
            height: 100%;
            overflow: hidden;
            .mask{
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,.6);
                z-index: 9;
            }
            .mianIndex-wrapper{
                width: 100%;
                height: 100%;
                background-image: url('~@/assets/imgs/index.png');
                background-size: 100% 100%;
                overflow: hidden;
                .header{
                    display: flex;
                    justify-content: flex-end;
                    margin-top: 3.64vh;
                    overflow: hidden;
                    padding-right: 30px;
                    .menu_button {
                        width: 70px;
                        height: 70px;
                        background: url("~@/assets/imgs/op.png") no-repeat;
                        background-size: cover;
                        background-position: top center;
                        position: relative;
                        span{
                            position: absolute;
                            background: #FF5C5D;
                            width: 20px;
                            height: 20px;
                            border-radius: 50%;
                            text-align: center;
                            line-height: 20px;
                            font-size: 12px;
                            color: #fff;
                            right: 6px;
                            top: 0;
                        }
                    }
                    .info{
                        color: #fff;
                        line-height: 46px;
                        padding: 0 10px;
                    }
                    .operation{
                        height: 46px;
                        img{
                            vertical-align: middle;
                            margin-right: 10px;
                        }
                        &::after{
                            content: ' ';
                            display: inline-block;
                            background: url('~@/assets/imgs/chk.png') no-repeat;
                            width: 11px;
                            height: 6px;
                            background-size: cover;
                        }
                    }
                    .dropdown_menu{
                        width: 170px;
                        height: 138px;
                        background: url("~@/assets/imgs/menuBg.png") no-repeat;
                        background-size: cover;
                        position: absolute;
                        top: 11.45vh;
                        right: 23px;
                        padding-top: 4px;
                        .i{
                            color: #fff;
                            font-size: 1.5rem;
                            line-height: 45px;
                            text-align: center;
                            &::before{
                                content: ' ';
                                display: inline-block;
                                margin-right: 15px;
                                width: 16px;
                                vertical-align: middle;
                                background-size: cover;
                                background-repeat: no-repeat;
                            }
                            &.i1{
                                &::before{
                                    height: 19px;
                                    background-image: url("~@/assets/imgs/i1.png");
                                }
                            }
                            &.i2{
                                background-color: #2A4C90;
                                &::before{
                                    height: 20px;
                                    background-image: url("~@/assets/imgs/i2.png");
                                }
                            }
                            &.i3{
                                &::before{
                                    height: 16px;
                                    background-image: url("~@/assets/imgs/i3.png");
                                }
                            }
                        }
                    }
                }
                .title{
                    font-size: 4rem;
                    color: #fff;
                    height: 10.416vh;
                    line-height: 10.416vh;
                    text-align: center;
                    margin-top: 3vh;
                    margin-bottom: 8vh;
                    &::before{
                        content: ' ';
                        display: inline-block;
                        width: 10.416vh;
                        height: 10.416vh;
                        background: url("~@/assets/imgs/logo.png") no-repeat;
                        background-size: cover;
                        vertical-align: middle;
                    }
                }
            }
            .swiper-inner {
                width: 100%;
                height: 400px;
                padding-top: 50px;
                padding-bottom: 50px;
            }
            .swiper-slide {
                background-position: center;
                background-size: cover;
                background-image: url("~@/assets/imgs/itemBg1.png");
                height: 335px;
                width: 246px;
                color: #fff;
                text-align: center;
                h3{
                    font-weight: 400;
                    font-size: 2.4rem;
                    color: #fff;
                    margin-bottom: 20px;
                }
                .icon{
                    width:80px;
                    height:80px;
                    background:radial-gradient(rgba(93,143,242,1) 5%,rgba(42,61,130,0.69));
                    position: relative;
                    border-radius: 50%;
                    margin: 62px auto 25px;
                    &::after{
                        content: '';
                        position: absolute;
                        top: 50%;
                        left: 50%;
                        transform: translate(-50%,-50%);
                        width: 39px;
                        height: 38px;
                        background-size: cover;
                        background-repeat: no-repeat;
                    }
                    &.ic1{
                        &::after{
                            background-image: url("~@/assets/imgs/item2.png");
                        }
                    }
                    &.ic2{
                        &::after{
                            background-image: url("~@/assets/imgs/item2.png");
                        }
                    }
                    &.ic3{
                        &::after{
                            background-image: url("~@/assets/imgs/item3.png");
                        }
                    }
                }
                
                .info{
                    font-size: 1.4rem;
                    color:rgba(255,255,255,0.6);
                    line-height: 18px;

                }
            }
            .swiper-slide-active.swiper-slide{
                background-image: url("~@/assets/imgs/itemBg.png");
                width: 286px;
                height: 375px;
                padding: 20px;
            } 

        }

        .menuBox {
            position: absolute;
            right: 0;
            top: 0;
            width: 27.7vw;
            height:100%;
            background:linear-gradient(180deg,rgba(37,75,133,1) 0%,rgba(28,37,85,1) 100%);
            color: #fff;
            z-index: 10;
            h2{
                font-size: 22px;
                color: #fff;
                font-weight: 400;
                margin: 33px 0 33px 23px;
            }
            .clear{
                color:rgba(255,255,255,0.6);
                text-align: right;
                padding-right: 20px;
                font-size: 15px;
                margin-bottom: 14px;
                &::before{
                    content: '';
                    display: inline-block;
                    width: 15px;
                    height: 15px;
                    background-image: url("~@/assets/imgs/del1.png");
                    background-size: cover;
                    vertical-align: middle;
                    margin-right: 3px;

                }

            }
            .news{
                margin-bottom: 20px;
                .title{
                    width: 100%;
                    height: 10.15vh;
                    line-height: 10.15vh;
                    background: #2F4E83;
                    border: solid 1px #3A5991;
                    border-right: none;
                    border-left: none;
                    font-size: 18px;
                    color: #fff;
                    padding-left: 23px;
                    &::before{
                        display: inline-block;
                        content: ' ';
                        width: 6.12vh;
                        height: 6.12vh;
                        background-size: cover;
                        vertical-align: middle;
                        margin-right: 15px;
                    }
                    &.t1{
                        &::before{
                            background-image: url("~@/assets/imgs/t1.png");
                        }
                    }
                    &.t2{
                        &::before{
                            background-image: url("~@/assets/imgs/t2.png");
                        }
                    }
                    &.t3{
                        &::before{
                            background-image: url("~@/assets/imgs/t3.png");
                        }
                    }
                }
                .content{
                    display: flex;
                    .bars{
                        flex: 1;
                        text-align: center;
                        padding: 1.95vh 0;
                        border-bottom: solid 1px #3A5991;
                        .number{
                            font-size: 22px;
                            color: #FF8339;
                        }
                        .info{
                            color:rgba(255,255,255,0.6);
                            font-size: 16px;
                        }
                    }
                    .bars:first-child{
                        border-right: solid 1px #3A5991;
                    }
                }
            }
        }
        
        
    }

    

    

</style>
<style>
    .swiper-slide-shadow-left,.swiper-slide-shadow-right,.swiper-container-3d .swiper-slide-shadow-left,.swiper-container-3d .swiper-slide-shadow-right{
        background: rgba(4, 9, 21, 0.3)!important;
    }

</style>