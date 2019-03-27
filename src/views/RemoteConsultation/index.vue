<template>
    <div class="Index__outer-wrapper">
        <div class="Index__left-wr">
            <div style="height:200px">
                <div class="Index__username">{{loginInfo.CYSMC}} <span class="Index__username-dots" @click="visitSelectBox=true">•••</span></div>
                <animation enter="fadeInDown faster" leave="fadeOut faster">
                    <div v-show="visitSelectBox" class="visitSelectBox">
                        <div class="s-item" @click="$router.push('/Home')"><img width="17" height="18" src="~@/assets/imgs/remote_index_login_select1.png">&nbsp;&nbsp;回到首页</div>
                        <div class="s-item" @click.stop="$router.push('/ChangePassword')"><img width="17" height="18" src="~@/assets/imgs/remote_index_login_select1.png">&nbsp;&nbsp;修改密码</div>
                        <div class="s-item" @click.stop="$router.push('/PersonalInfo')"><img width="16" height="16" src="~@/assets/imgs/remote_index_login_select2.png">&nbsp;&nbsp;编辑资料</div>
                        <div class="s-item logout" @click="outLogin()"><img width="16" height="16" src="~@/assets/imgs/remote_index_login_select3.png">&nbsp;&nbsp;退出</div>
                    </div>
                </animation>
                <img class="Index__userphoto" width="64" height="64" :src="loginInfo.CZPLJ?loginInfo.CZPLJ:'../../assets/imgs/doc.png'">
                <div class="Index__msg" @click="$router.push({path:'/systemMessage',params:{type:'12',place:1}})">消息 <span class="Index__msg-circle">{{msgCount}}</span></div>
            </div>
            <div style="height:calc(100% - 200px);overflow:auto">
                <menu-tree :BaseData="menuArr" />
            </div>
        </div>
        <div class="Index__right-wr">
            <keep-alive include="includeds">
                <router-view></router-view>
            </keep-alive>
        </div>
    </div>
</template>

<script>
     import MenuTree from '@/components/menuTree'
     import Animation from '@/components/animation'
     export default {
         name:'RemoteConsultation',
         components: {
             MenuTree,
             Animation
         },
         created() {
             this.init();
             this.loginInfo = JSON.parse(window.localStorage.getItem("loginInfo"));
         },
         mounted() {
             document.body.addEventListener('click', (e) => {
                 // if(!this.visitSelectBox){
                 this.visitSelectBox = false;
                 // }
             }, false)
             document.querySelector('.visitSelectBox').addEventListener("click", (e) => {
                 e = e || window.e;
                 e.stopPropagation();
             });
             document.querySelector('.Index__username-dots').addEventListener("click", (e) => {
                 e = e || window.e;
                 e.stopPropagation();
             });
             this.getMsg();
         },
         data() {
             return {
                 visitSelectBox: false,
                 menuArr: [
                 ],
                 msgCount: 0,
                 loginInfo: {
                     CYSMC: "",
                     CZPLJ: "./default_photo.png"
                 }
             }
         },
         methods: {
             init() {
                 this.$ajax.post('', {
                     "MSH.1": "menu",
                     "sysbh": window.localStorage.IGHZL,
                     "MSH.2": "listLevels",
                     "FORMAT": 2,
                     "token": window.localStorage.token,
                 }).then(res => {
                     if (res.code == '100') {
                         let appList = res.data.rows.filter(e => {
                             return e.CTYPE == '1';
                         })
                         this.setList(appList);
                     }
                 }).catch(error => {
                     console.log(error)
                 });
             },
             getMsg() {
                 //获取消息
                 this.$ajax.post('',{
                    "MSH.1": "UtilCommon",
                    "MSH.2": "selXTXXSL",
                    "token": window.localStorage.token,
                    "FORMAT": 2
                }).then(res => {
                    if(res.code == '100'){
                        console.log(res)
                        let newList = res.data.rows;
                        newList = newList.filter((item)=>{
                            return item.CLX == '12' || item.CLX == '14' || item.CLX == '15'
                        })
                        newList.forEach(e => {
                            this.msgCount += parseInt(e.NUMBER);
                            this.msgCount += parseInt(e.COUNT);
                        })
                    }
                }).catch(error => {
                    console.log(error)
                });
                 
             },
             outLogin() { // 退出登录
                 var params = new URLSearchParams();
                 params.append('FORMAT', '1'); //你要传给后台的参数值 key/value
                 params.append('token', window.localStorage.token);
                 this.$ajax({
                     url: this.$root.logoutUrl,
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
             setList(arr) {
                 //获取侧边列表
                 let level1 = [];
                 let level2 = [];
                 let level3 = [];
                 arr.forEach(e => {
                     if (e.CAPPLEVEL == 1) {
                         level1.push({
                             title: e.CNAME,
                             path: e.CAPPURL,
                             CBH: e.CBH
                         });
                     } else if (e.CAPPLEVEL == 2) {
                         level2.push({
                             title: e.CNAME,
                             path: e.CAPPURL,
                             CBH: e.CBH,
                             parent: e.CPARENTBH
                         });
                     } else if (e.CAPPLEVEL == 3) {
                         level3.push({
                             title: e.CNAME,
                             path: e.CAPPURL,
                             CBH: e.CBH,
                             parent: e.CPARENTBH
                         });
                     }
                 })
                 level2.forEach(e2 => {
                     let child = [];
                     level3.forEach(e3 => {
                         if (e3.parent == e2.CBH) {
                             child.push(e3);
                         }
                     })
                     e2.children = child;
                 })
                 level1.forEach(e => {
                     let child = [];
                     level2.forEach(e2 => {
                         if (e2.parent == e.CBH) {
                             child.push(e2);
                         }
                     })
                     e.children = child;
                 })
                 this.menuArr = level1;
             }
         },
         computed: {
             includeds() {
                 return this.$store.state.includeds
             }
         }
     }
</script>

<style lang='less' scoped>
    .Index__outer-wrapper {
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;
        width: 100%;
        height: 100%;
        padding: 0 10px;
        .Index__left-wr {
            flex: 0 0 186px;
            height: 100%;
            margin-right: 10px;
            background: rgb(255, 255, 255);
            border-radius: 4px;
            position: relative;
            .Index__username {
                font-size: 18px;
                font-weight: 500;
                padding: 19px 16px 10px 16px;
                .Index__username-dots {
                    display: inline-block;
                    transform: rotate(90deg);
                    font-size: 14px;
                    float: right;
                    margin-top: 3px;
                    margin-right: -8px;
                    color: #1C85F0;
                }
            }
            .Index__msg {
                font-size: 16px;
                padding: 0 16px;
                margin-top: 16px;
                .Index__msg-circle {
                    display: inline-block;
                    border-radius: 30px;
                    background: #F7652B;
                    font-size: 12px;
                    color: #fff;
                    height: 18px;
                    min-width: 18px;
                    text-align: center;
                    line-height: 18px;
                    float: right;
                    margin-top: 3px;
                    padding: 0 3px;
                }
            }
            .Index__userphoto {
                margin-left: 16px;
                border-radius: 50%;
            }
            .visitSelectBox {
                position: absolute;
                width: 170px;
                height: 213px;
                left: 138px;
                z-index: 110;
                background: rgba(255, 255, 255, 1);
                box-shadow: 0px 2px 12px 0px rgba(206, 215, 227, 1);
                border-radius: 8px;
                padding: 20px 0;
                &::before {
                    content: '';
                    display: inline-block;
                    position: absolute;
                    width: 0;
                    height: 0;
                    border: 8px solid transparent;
                    border-bottom-color: #fff;
                    left: 22px;
                    top: -15px;
                }
                .s-item {
                    color: #333333;
                    font-size: 16px;
                    margin-bottom: 20px;
                    padding: 0 20px;
                    img {
                        vertical-align: sub;
                    }
                    &.logout {
                        border-top: 1px solid #E7ECF2;
                        margin-bottom: 0;
                        padding: 12px 20px;
                    }
                }
            }
        }
        .Index__right-wr {
            flex: 1;
            height: 100%; //width: calc(~'100% - 176px')
            border-radius: 4px;
        }
    }
</style>