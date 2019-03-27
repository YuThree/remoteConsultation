<template>
    <div class="Index__outer-wrapper">
      <div class="Index__left-wr">
          <div style="height:200px">
              <div class="Index__username">梁医生 <span class="Index__username-dots" @click="visitSelectBox=!visitSelectBox">•••</span></div>
              <animation enter="fadeInDown faster" leave="fadeOut faster">
                <div v-show="visitSelectBox" class="visitSelectBox">
                    <div class="s-item" @click="$router.push('/Home')"><img width="17" height="18" src="~@/assets/imgs/remote_index_login_select1.png" >&nbsp;&nbsp;回到首页</div>
                    <div class="s-item"><img width="17" height="18" src="~@/assets/imgs/remote_index_login_select1.png" >&nbsp;&nbsp;修改密码</div>
                    <div class="s-item"><img width="16" height="16" src="~@/assets/imgs/remote_index_login_select2.png" >&nbsp;&nbsp;编辑资料</div>
                    <div class="s-item logout"><img width="16" height="16" src="~@/assets/imgs/remote_index_login_select3.png" >&nbsp;&nbsp;退出</div>
                </div>
              </animation>
              <img class="Index__userphoto" width="64" height="64" src="./default_photo.png">
              <div class="Index__msg">消息 <span class="Index__msg-circle">1</span></div>
          </div>
          <div style="height:calc(100% - 200px);overflow:auto">
            <menu-tree :BaseData="menuArr"/>
          </div>
      </div>
      <div class="Index__right-wr">
          <router-view></router-view>
      </div>
    </div>
</template>

<script> 
    import MenuTree from '@/components/menuTree'
    import Animation from '@/components/animation'
    export default {
        components:{
           MenuTree,Animation
        },
        data() {
            return {
                visitSelectBox:false,
                menuArr:[
                    {
                        title:'工作站',
                        children:[
                            {
                                title:'工作站',
                                path:'/RemoteECG'
                            },
                        ]
                    },
                    {
                        title:'远程心电管理',
                        children:[
                            {
                                title:'上级/下属医院',
                                children:[
                                    {
                                        title:'新建申请',
                                        path:'/RemoteECG/NewApplication'
                                    },
                                    {
                                        title:'申请管理',
                                        path:'/RemoteECG/applicationManagement1'
                                    },

                                    {
                                        title:'待诊断/会诊管理',
                                        path:'/RemoteECG/ConsultationManagemen1'
                                    },

                                ]
                            },
                        ]
                    },
                    {
                        title:'患者中心',
                        children:[
                            {
                                title:'患者列表',
                                path:'/RemoteConsultation/thePatientList'
                            },
                        ]
                    },
                    {
                        title:'排班信息',
                        children:[
                            {
                                title:'排班信息',
                                path:'/RemoteConsultation/schedulingInformation'
                            },
                        ]
                    },
                ]
            }
        },
    }
</script>

<style lang='less' scoped>
    .Index__outer-wrapper{
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;
        width: 100%;
        height: 100%;
        padding: 0 10px;
        .Index__left-wr{
            flex: 0 0 186px;
            height: 100%;
            margin-right: 10px;
            background: rgb(255, 255, 255);
            border-radius: 4px;
            position: relative;
            .Index__username{
                font-size: 18px;
                font-weight:500;
                padding: 19px 16px 10px 16px;
                .Index__username-dots{
                    display: inline-block;
                    transform: rotate(90deg);
                    font-size: 14px;
                    float: right;
                    margin-top: 3px;
                    margin-right: -8px;
                    color: #1C85F0;                    
                }
            }
            .Index__msg{
                font-size: 16px;
                padding:0 16px;
                margin-top: 16px;
                .Index__msg-circle{
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
            .Index__userphoto{
                margin-left: 16px;
            }
            .visitSelectBox{
                position: absolute;
                width: 170px;
                height: 213px;
                left: 138px;
                z-index: 110;
                background:rgba(255,255,255,1);
                box-shadow:0px 2px 12px 0px rgba(206,215,227,1);
                border-radius:8px;
                padding: 20px 0;
                &::before{
                    content:'';
                    display: inline-block;
                    position: absolute;
                    width: 0;
                    height: 0;
                    border: 8px solid transparent;
                    border-bottom-color: #fff;
                    left: 22px;
                    top:-15px;

                }
                .s-item{
                    color: #333333;
                    font-size: 16px;
                    margin-bottom: 20px;
                     padding:0 20px;
                    img{
                        vertical-align: sub;
                    }
                    &.logout{
                        border-top: 1px solid #E7ECF2;
                        margin-bottom: 0;
                        padding: 12px 20px;
                    }
                }
            }
        }
        .Index__right-wr{
            flex: 1;
            height: 100%;
            //width: calc(~'100% - 176px')
            border-radius: 4px;
        }
    }
</style>