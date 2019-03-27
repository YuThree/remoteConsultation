<template>
    <div class="cdct_container cdct_right">
        <loading ref="loading"></loading>
        <div class="cdct_content cdct_relative">
            <div class="cdct_operation" style="margin-bottom:10px;">患者列表
                <div class="y_space">
                    <div class="y_search cdct_relative">
                        <input class type="search" placeholder="身份证号/患者姓名/机构名称" v-model="search" @keyup.enter="select">
                        <span class="y_searchIco" @click="select"></span>
                    </div>
                </div>
            </div>
            <scroll :selectScroll="true" ref="scroll" :useTransition="false" style="height:calc(100% - 54px);" :data="list" :pullUpLoad="true" @pullingUp="pullingUp" :pullDownRefresh="{stop:'80'}" @pullingDown="pullingDown">
                <div class="cdct_main cdct_relative">
                    <div class="y_list" v-for="(item,index) in list" :key="index+'ls'" @click="starActivity(item.CBRID)">
                        <div class="y_left">
                            <div class="y_imgbox">
                                <img src="http://img.bimg.126.net/photo/ZZ5EGyuUCp9hBPk6_s4Ehg==/5727171351132208489.jpg" alt>
                                <span class="y_sex" :class="{man:(item.CBRXBBM!=1),woman:(item.CBRXBBM==1),}"></span>
                            </div>
                        </div>
                        <div class="y_right">
                            <div class="y_top">
                                <span class="y_name">{{item.CBRXM}}</span>
                                <span class="y_age">{{item.RN}} 岁</span>
                                <span class="y_showdetail">患者详情</span>
                            </div>
                            <div class="y_bottom">
                                <span class="y_marry">{{item.CHYMC}}</span>
                                <span class="y_phone">{{item.CHZDH}}</span>
                                <span class="y_ID">{{item.ZJHM}}</span>
                                <span>{{item.CMZMC}}</span>
                                <span>{{item.CDZS+item.CDZDQ+item.CDZQX+item.CDZXZ+item.CDZC}}</span>
                                <span class="y_date">{{item.DJDRQ}}}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </scroll>
            <div class="error" v-if="nodata">暂无数据</div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "NewApplication",
        components: {},
        data() {
            return {
                list: [],
                search: "",
                nodata: false,
                pageSize: 18,
                pageIndex: 1,
                allpage: 1, //总页数
            };
        },
        mounted() {
            this.$refs.loading.show('加载中...');
            this.initData(false);
        },
        methods: {
            select() {
                this.initData(true);
            },
            starActivity(prams) {
                this.$router.push({
                    name: "PatientDetails",
                    params: {
                        CBRID: prams
                    }
                });
            },
            //下拉 刷新  搜索可以直接用
            pullingDown() {
                this.list = [];
                this.pageIndex = 1;
                this.initData();
            },
            //上拉加载 下一页
            pullingUp() {
                if (this.allpage <= this.pageIndex) { //是否最后一页
                    this.$refs.scroll.finishPullUp(true);
                    return false;
                }
                this.pageIndex++;
                this.initData();
            },
            initData(isSearch) {
                this.$ajax
                    .post("", {
                        "MSH.1": "UtilCommon",
                        "MSH.2": "selhz",
                        token: localStorage.token,
                        FORMAT: "2",
                        GJZ: this.search,
                        ZJHM: "",
                        SCSNY: "",
                        ECSNY: "",
                        nowPage: this.pageIndex,
                        showNum: this.pageSize
                    })
                    .then(res => {
                        this.$refs.loading.hide();
                        if (typeof res.data != "undefined" && res.data.rows.length > 0) {
                            this.nodata = false;
                            if (this.pageIndex == 1) { //如果第一页
                                this.list = res.data.rows;
                                this.allpage = res.data.allPage;
                            } else {
                                this.list = this.list.concat(res.data.rows)
                            }
                            //设置总页数   if pageindex=1
                            this.$refs.scroll.finishPullUp();
                            this.$refs.scroll.finishPullDown();
                        } else {
                            this.list = [];
                            this.nodata = true;
                        }
                    })
                    .catch(error => {
                        this.$refs.loading.hide();
                        this.list = [];
                        this.nodata = true;
                        this.$refs.loading.hide();
                        console.log(error);
                    });
            }
        }
    };
</script>

<style lang="less" scoped>
    @imagesin: "../../assets/imgs";
    @color1: #19293f;
    .cdct_container {
        .cdct_content {
            height: 100%;
            padding: 0;
            .cdct_operation {
                color: #3f4b5d;
                display: flex;
                align-items: center;
                justify-content: space-between;
                .y_space {
                    .y_search {
                        margin-right: 4px;
                        width: 310px;
                        height: 30px;
                        border-radius: 15px;
                        vertical-align: middle;
                        padding: 0 15px;
                        overflow: hidden;
                        border: 1px solid #ced7e3;
                        input {
                            width: calc(~"100% - 25px");
                            float: left;
                            height: 100%;
                            border: none;
                            outline: none;
                            line-height: inherit;
                            font-size: 13px;
                            font-weight: normal;
                        }
                        .y_searchIco {
                            height: 27px;
                            position: absolute;
                            top: 0;
                            right: 0;
                            width: 48px;
                            background: url("~imgs/search.png") no-repeat 50% 50%;
                            background-size: 18px 18px;
                        }
                    }
                }
            }
        }
        .cdct_main {
            // background: transparent;
            padding: 0;
            .y_list {
                width: 100%;
                height: 94px;
                border-bottom: 1px solid #e1e1e1;
                display: flex;
                align-items: center;
                .y_left {
                    width: 91px;
                    padding-left: 20px;
                    .y_imgbox {
                        width: 54px;
                        height: 54px;
                        border-radius: 50%;
                        position: relative;
                        img {
                            max-width: 100%;
                            max-height: 100%;
                            width: 100%;
                            height: 100%;
                            position: absolute;
                            top: 50%;
                            border-radius: 50%;
                            left: 50%;
                            transform: translateY(-50%) translateX(-50%);
                        }
                    }
                    .y_sex {
                        position: absolute;
                        display: inline-block;
                        width: 26px;
                        height: 26px;
                        bottom: -8px;
                        right: -6px;
                    }
                    .y_sex.man {
                        background: url("~imgs/icon_man.png") no-repeat;
                        background-size: contain;
                    }
                    .y_sex.woman {
                        background: url("~imgs/icon_woman.png") no-repeat;
                        background-size: contain;
                    }
                }
                .y_right {
                    // background: red;
                    height: 100%;
                    flex: 1;
                    padding-top: 19px;
                    .y_top {
                        width: 100%;
                        height: 25px;
                        line-height: 25px;
                        .y_name {
                            font-size: 18px;
                            color: rgba(63, 75, 93, 1);
                        }
                        .y_age {
                            color: #1c85f0;
                            font-size: 12px;
                            display: inline-block;
                            padding: 0 3px;
                            border-radius: 10px;
                            line-height: 20px;
                            background: rgba(238, 247, 255, 1);
                            margin-left: 9px;
                        }
                        .y_showdetail {
                            display: inline-block;
                            float: right;
                            color: #0096ff;
                            padding-right: 17px;
                            margin-right: 20px;
                            position: relative;
                            &:after {
                                content: "";
                                position: absolute;
                                width: 8px;
                                height: 100%;
                                top: 0;
                                right: 0;
                                background: url("~imgs/icon_right.png") no-repeat 50% 50%;
                                background-size: 8px auto;
                            }
                        }
                    }
                    .y_bottom {
                        width: 100%;
                        height: 50px;
                        line-height: 50px; // padding-right: 90px;
                        // display: flex;
                        // justify-content: space-between;
                        span {
                            display: inline-block;
                            float: left;
                            margin-right: 32px;
                            color: #5f7397;
                            text-overflow: ellipsis;
                            overflow: hidden;
                            white-space: nowrap;
                             :nth-of-type(1) {
                                width: 30px;
                            }
                            &:nth-of-type(2) {
                                width: 100px;
                            }
                            &:nth-of-type(3) {
                                width: 145px;
                            }
                            &:nth-of-type(4) {
                                width: 30px;
                            }
                            &:nth-of-type(5) {
                                max-width: 80px;
                                min-width: 30px;
                            }
                            &:nth-of-type(6) {
                                width: 90px;
                            }
                        }
                    }
                }
            }
        }
    }
    .error {
        background: url("~imgs/nodataNow.png") center center no-repeat;
    }
</style>
