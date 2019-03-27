<template>
    <div>
        <animation enter="fadeIn faster" leave="fadeOut faster">
            <div class="ICD-select__mask" v-show="value" @click="$emit('input',false)"></div>
        </animation>
        <animation enter="modalInDown faster" leave="fadeOut faster">
            <div class="ICD-select__wrapper" v-show="value">
                <div class="ICD-select__title">ICD-10列表</div>
                <div class="ICD-select__content">
                    <div class="__wrapper">
                        <div class="ICD-select__content-left">
                            <form action="javascript:void(0)" class="ICD-select__search">
                                <span class="ICD-select__search-icon"><img width="18" height="18" src="./search.png"></span>
                                <input class="ICD-select__inp" type="search" v-model="keyword" placeholder="请输入ICD-19编码、ICD-10编码或拼音码" @keyup.enter="qryICD">
                            </form>
                            <div class="ICD-select__list-wrapper">
                                <div class="ICD-select__list-header">
                                    <div class="col-h ICD_bm">ICD_10编码</div>
                                    <div class="col-h ICD_name">ICD_10名称</div>
                                    <div class="col-h ICD_py">拼音码</div>
                                    <div class="col-h ICD_act">操作</div>
                                </div>
                                <scroll ref="selectListScroll" style="height:calc(100% - 50px)">
                                    <div>
                                        <div class="ICD-select__list-item" v-for="(item,index) in lists_Arr" :key="'icd'+ index">
                                            <div class="col-i ICD_bm">{{item.JBBM}}</div>
                                            <div class="col-i ICD_name">{{item.JBMC}}</div>
                                            <div class="col-i ICD_py">{{item.JBPYM}}</div>
                                            <div class="col-i ICD_act" @click="addIcd(item)"><img src="./add.png" width="23" height="23" style="vertical-align:middle"></div>
                                        </div>
                                    </div>                              
                                    <div class="noData" v-show="lists_Arr.length == 0">暂无数据</div>
                                </scroll>
                            </div>
                        </div>
                        <div class="ICD-select__content-right">
                            <div class="header">
                                <div class="left">已选择的ICD_10 <span class="count">({{selected_Arr.length}})</span></div>
                                <div class="right" @click="selected_Arr = []"><img width="13" height="15" class="icon" src="./clear.png"> 清空</div>
                            </div>
                            <div class="content">
                                <scroll ref="selectdScroll" style="height:100%">
                                    <div class="item" v-for="(item,index) in selected_Arr_Ready" :key="item.JBBM">
                                        <span>{{item.JBMC}}</span> 
                                        <div @click="deleteItem(index)" class="icon">
                                            <img src="./x.png" width="14" height="14">
                                        </div>
                                    </div>
                                </scroll>
                                <div class="info">点击左侧添加按钮，进行ICD-10添加</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="ICD-select__footer">
                    <div class="cancel" @click="$emit('input',false)">取消</div>
                    <div class="ok" @click="ok">确认</div>
                </div>
            </div>
        </animation>
    </div>
</template>

<script>
    import Animation from '@/components/animation'
    import Scroll from '@/components/scroll/scroll.vue'
    export default {
        props:{
            value:{
                type:Boolean,
                default:false
            }
        },
        components:{
            Animation,Scroll
        },
        mounted(){
            if(window.localStorage.token){
                this.token = window.localStorage.token;
                this.init();
            }
            
        },
        data() {
            return {
                token: '',
                keyword: '',
                selected_Arr:[],
                lists_Arr:[],
                pageNum: 1, // 页码
                pageSize: 20,    // 每页显示条数
                allPage: 0, // 总页数
            }
        },
        methods: {
            init(keyword){
                this.$ajax.post('',{
                    "MSH.1": "ycyx4",
                    "MSH.2": "qryBZ",
                    "Condition": keyword,
                    "pageNum":this.pageNum,
                    "pageSize": this.pageSize,
                    "token":this.token,
                    "FORMAT":2
                }).then(res => {
                    if(res.code == '100' && typeof res.data.rows != 'undefined' && res.data.rows.length > 0){
                        this.lists_Arr = this.lists_Arr.concat(res.data.rows);
                        this.allPage = res.data.allPage;
                    }else{

                    }
                }).catch(error => {
                    console.log(error)
                });
            },
            qryICD(){
                this.lists_Arr = [];
                this.pageNum = 1;
                this.init(this.keyword)
            },
            addIcd(item){
                this.selected_Arr.push(item);
            },
            deleteItem(index){
                this.selected_Arr.splice(index,1);
            },
            ok(){
                this.$emit('input',false);
                this.$emit('on-ok',this.selected_Arr);
            }
        },
        watch: {
            value(v){
                this.$nextTick(()=>{
                    v && this.$refs.selectListScroll.refresh();
                })
            }
        },
        computed: {
            //去重          
            selected_Arr_Ready(){
                this.selected_Arr = [...new Set(this.selected_Arr)];
                return this.selected_Arr;
            }
        },
    }
</script>

<style lang="less" scoped>
    .noData{
        color: #AEBFCF;
        text-align: center;
        fonts-size: 16px;
    }
    .ICD-select__mask{
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0,.3);
        z-index: 100;
    }
    .ICD-select__wrapper{
        position:fixed;
        top:50%;
        left:50%;
        transform:translate(-50%,-50%);
        margin: auto;
        width: 80%;
        height: 75%;
        border-radius: 5px;
        background: #fff;
        box-shadow:0px 0px 8px 0px rgba(0,0,0,0.3);
        z-index: 101;
        
        opacity: 1;
        -webkit-backface-visibility: hidden;
        .ICD-select__title{
            font-size: 20px;
            color: #303336;
            text-align: center;
            padding:40px 0 28px 0;
            font-weight:600;
        }
        .ICD-select__content{
            width: 100%;
            height: calc(~'100% - 155px');            
            overflow-y: hidden;
            overflow-x: auto;
            .__wrapper{
                display: flex;
                flex-direction: row;
                flex-wrap: nowrap;
                width: 100%;
                height: 100%;
                min-width: 800px;
                padding: 0 30px;
                .ICD-select__content-left{
                    width: 60%;
                    height: 100%;
                    .ICD-select__search{
                        position: relative;
                        width: 100%;
                        height: 40px;
                        background:rgba(250,251,252,1);
                        border-radius:4px;
                        border:1px solid rgba(206,215,227,1);
                        padding-left: 42px;
                        .ICD-select__inp{
                            border: 0;
                            outline: none;
                            width: 100%;
                            height: 100%;
                            background: inherit;
                        }
                        .ICD-select__search-icon{
                            display: inline-block;
                            position: absolute;
                            top: 10px;
                            left: 12px;
                            width:42px;
                            height: 100%;
                        }
                    }
                    .ICD-select__list-wrapper{
                        width: 100%;
                        height: calc(~'100% - 80px');
                        margin-top: 20px;
                        border-radius:4px 4px 0px 0px;
                        border:1px solid rgba(206,215,227,1);
                        overflow: hidden;
                        .ICD-select__list-header{
                            background: #FAFBFC;
                        }
                        .ICD-select__list-item{
                            border-bottom: 1px solid rgba(206,215,227,1);
                            &:last-child {
                                border-bottom:none;
                            }

                        }
                        .ICD-select__list-header,.ICD-select__list-item{
                            display: flex;
                            flex-direction: row;
                            flex-wrap: nowrap;
                            text-align: center;
                            
                            .col-h{
                                height: 50px;
                                line-height: 50px;
                                color: #19293F;
                                font-size: 15px;
                                
                            }
                            .col-i{
                                height: 50px;
                                line-height: 50px;
                                color: #5F7397;
                                font-size: 14px;
                                overflow: hidden;
                                white-space: nowrap;
                                text-overflow: ellipsis;
                            }
                            .ICD_bm{
                                flex:2;
                            }
                            .ICD_name{
                                flex:3;
                            }
                            .ICD_py{
                                flex:2;
                            }
                            .ICD_act{
                                flex:1;
                            }
                        }
                    }
                }
                .ICD-select__content-right{
                    width: 40%;
                    height: calc(~'100% - 20px');
                    border-radius:4px 4px 0px 0px;
                    border:1px solid rgba(206,215,227,1);
                    margin-left: 20px;
                    .header{
                        display: flex;
                        flex-direction: row;
                        flex-wrap: nowrap;
                        width: 100%;
                        height: 40px;
                        background: #FAFBFC;
                        line-height: 40px;
                        padding:0 20px;
                        font-size: 15px;
                        padding-left: 21px;
                        .left{
                            flex: 7;
                            color: #19293F;
                            .count{
                                color: #AEBFCF;
                                font-size: 12px;
                            }
                        }
                        .right{
                            flex: 3;
                            color:#0096FF;
                            text-align: right;
                            .icon{
                                vertical-align:sub;
                            }
                        }
                    }
                    .content{
                        height: calc(~'100% - 40px');
                        padding: 20px 20px 65px 20px;
                        position: relative;
                        .item{
                            position: relative;
                            padding: 10px 30px 10px 10px;
                            color:#5F7397;
                            font-size: 14px;
                            background:rgba(241,247,255,1);
                            border-radius:4px;
                            border:1px solid rgba(206,215,227,1);
                            width: 100%;
                            height: 40px;
                            margin-bottom: 10px;
                            overflow: hidden;
                            white-space: nowrap;
                            text-overflow: ellipsis;
                            .icon{
                                display: inline-block;
                                position: absolute;
                                width: 30px;
                                height: 100%;
                                right: 0px;
                                top: 0px;
                                line-height: 30px;
                                text-align: center;
                                img{
                                    vertical-align: middle;
                                    margin-top:4px;
                                }
                            }
                        }
                        .info{
                            position: absolute;
                            width: 100%;
                            bottom: 20px;
                            text-align: center;
                            padding-right:40px;
                            font-size: 12px;
                            color: #AEBFCF;
                        }
                    }
                }
            }
        }
        .ICD-select__footer{
            display: flex;
            flex-direction: row;
            flex-wrap: nowrap;
            width: 100%;
            height:54px;
            border-top: 1px solid #CED7E3;
            margin-top: 1px;
            .cancel,.ok{
                flex: 5px;
                height: 100%;
                line-height: 54px;
                text-align: center;
                font-size: 20px;
            }
            .cancel{
               margin-right: 1px; 
               color: #0096FF;
            }
            .ok{
               background:linear-gradient(90deg,rgba(48,194,250,0.84) 0%,rgba(2,147,253,0.93) 100%);
               color: #fff;
               border-radius:0px 0px 4px 0px;
            }
        }
    }
    
    @keyframes modalIn {
        from {
            -webkit-transform: translate3d(-50%, -100%, 0);
            transform: translate3d(-50%, -100%, 0);
            visibility: visible;
        }

        to {
            -webkit-transform: translate3d(-50%, -50%, 0);
            transform: translate3d(-50%, -50%, 0);
        }
    }

    .modalInDown{
        animation-name: modalIn;
        animation-duration: .3s;
    }
</style>