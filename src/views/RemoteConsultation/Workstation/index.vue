<!-- 基层管理员 -->
<template>
    <div>
        <div class="work__topCard-wr">
            <div class="work__topCard1">
                <div style="width:50px;height:50px;margin-right:30px"></div>
                <div class="card-text">
                    <div class="card-text1">{{DAPNUM}}<span style="font-size:14px">单</span></div>
                    <div class="card-text2">申请审批单</div>
                </div>
                <span class="card-look-btn" @click="gotoRCAM">查看</span>              
            </div>
            <div class="work__topCard2">
                <div style="width:50px;height:50px;margin-right:30px"></div>
                <div class="card-text">
                    <div class="card-text1">{{DHZNUM}}<span style="font-size:14px">单</span></div>
                    <div class="card-text2">会诊审批单</div>
                </div>
                <span class="card-look-btn" @click="gotoRCCM">查看</span>   
            </div>
        </div>
        <div class="work__statistic-wrapper">
            <div class="work__statistic statistic1">
                <div class="work__st-title">本院统计</div>
                <!-- 管理端 -->
                <div class="work__btn-group" v-if="loginInfo.ISHZYY == '1'">
                    <span class="work__s1-btn" :class="conditionClass(1)" @click="conditionSelected(1)">会诊诊断数量</span>
                    <span class="work__s1-btn" :class="conditionClass(2)" @click="conditionSelected(2)">审批拒绝数量</span>
                    <span class="work__s1-btn" :class="conditionClass(3)" @click="conditionSelected(3)">会诊结束数量</span>
                    <span class="work__s1-btn" :class="conditionClass(4)" @click="conditionSelected(4)">会诊收入金额</span>
                </div>
                <!-- 申请端 -->
                <div class="work__btn-group" v-else>
                    <span class="work__s1-btn" :class="conditionClass(1)" @click="conditionSelected(1)">申请数量</span>
                    <span class="work__s1-btn" :class="conditionClass(2)" @click="conditionSelected(2)">申请通过次数</span>
                    <span class="work__s1-btn" :class="conditionClass(3)" @click="conditionSelected(3)">待诊断数量</span>
                    <span class="work__s1-btn" :class="conditionClass(4)" @click="conditionSelected(4)">待诊支出金额</span>
                </div>
                <div class="work__statistic-wr1" ref="statisticCard1"></div>            
            </div>
            <div class="work__statistic statistic2">
                <div class="work__st-title">本院实际情况对比分析</div>
                <div class="work__statistic-wr2" ref="statisticCard2"></div>
            </div>
        </div>
    </div>
</template>

<script>
    // 引入 ECharts 主模块
    import echarts from "echarts/lib/echarts"
    // 引入曲线图
    import 'echarts/lib/chart/line'
    // 引入柱状图
    import 'echarts/lib/chart/bar'
    // 引入其他组件
    //import 'echarts/lib/component/dataset'
    import 'echarts/lib/component/title'
    import 'echarts/lib/component/dataZoom'
    import 'echarts/lib/component/tooltip';
    import 'zrender/lib/svg/svg'
    export default {
        data() {
            return {
                loginInfo: {},
                DAPNUM: 0, // 申请审批单
                DHZNUM: 0, // 会诊审批单
                currentCondition: 1, // 本院统计类型
                currentWeek: [], // 当前周的日期
                zxDatas: [], // 折线图的数据
                lastWeekDatas: [], // 上周的数据
                thisWeekDatas: [], // 本周的数据

                zxChart: null, // 折线图
                zzChart: null, // 柱状图
            }
        },
        mounted() {
            this.loginInfo = JSON.parse(window.localStorage.loginInfo);
            this.zxChart = echarts.init(this.$refs.statisticCard1,null,{renderer:"svg"});    
            this.zzChart = echarts.init(this.$refs.statisticCard2,null,{renderer:"svg"});    
            // 工作台数量统计
            this.qryMsgNum();
            // 获取当前周的日期
            this.getCurrentWeekDate();
            // 工作台折线图统计
            this.qryZXNum();
            // 实际情况对比分析 1:上周 2:本周
            this.qryData(1);
            this.qryData(2); 
        },
        methods: {
            // 跳转到申请管理
            gotoRCAM() {
                if (this.loginInfo.ISHZYY == '1') {
                    // 管理端
                    this.$router.push({name : 'RCAM2', params : {'workstation' : 'true'}});
                } else {
                    // 申请端
                    this.$router.push({name : 'RCAM1', params : {'workstation' : 'true'}});
                }
            },
            // 跳转到会诊管理
            gotoRCCM() {
                if (this.loginInfo.ISHZYY == '1') {
                    // 管理端
                    this.$router.push({name : 'RCCM2', params : {'workstation' : 'true'}});
                } else {
                    // 申请端
                    this.$router.push({name : 'RCCM1', params : {'workstation' : 'true'}});
                }
            },
            // 工作台数量统计
            qryMsgNum() {
                this.$ajax.post('',{
                    "MSH.1" : "myStage",
                    "MSH.2" : "qryMsgNum",
                    "systemID" : "12", // 远程会诊
                    "tableName": "TBYCHZSQD",
                    "token" : window.localStorage.token,
                    "FORMAT" : 2
                }).then(res => {
                    if (!res.data.rows) {
                        return;
                    }
                    var array = res.data.rows;
                    for (let index = 0; index < array.length; index++) {
                        const element = array[index];
                        if (element.hasOwnProperty("DHZNUM")) {
                            this.DHZNUM = element.DHZNUM;
                        }
                        if (element.hasOwnProperty("DAPNUM")) {
                            this.DAPNUM = element.DAPNUM;
                        }
                    }
                }).catch(error => {
                    console.log(error)
                });
            },
            // 格式化时间
            formatDate(date) {
                var year = date.getFullYear();
                var month = date.getMonth() + 1;
                var day = date.getDate();
                if (month >= 1 && month <= 9) {
                    month = "0" + month;
                }
                if (day >=1 && day <= 9) {
                    day = "0" + day;
                }
                return (year + '-' + month + '-' + day);
            },
            // 获取当前周的日期
            getCurrentWeekDate() {
                var currentDate = new Date();
                var timeStamp = currentDate.getTime();
                var currentDay = currentDate.getDay();
                var datas = [];
                for (var i = 0; i < 7; i++) {
                    var date = new Date(timeStamp + 24 * 60 * 60 * 1000 * (i - (currentDay + 6) % 7));
                    datas.push(this.formatDate(date));
                }
                this.currentWeek = datas;
            },
            // 工作台折线图统计
            qryZXNum() {
                this.$ajax.post('',{
                    "MSH.1" : "myStage",
                    "MSH.2" : "qryZXNum",
                    "condition" : this.currentCondition,
                    "qryStartTime": this.currentWeek[0] + " 00:00:00",
                    "qryEndTime": this.currentWeek[6] + " 23:59:59",
                    "tableName": "TBYCHZSQD",
                    "token" : window.localStorage.token,
                    "FORMAT" : 2
                }).then(res => {
                    if (!res.data.rows) {
                        return;
                    }
                    var array = res.data.rows;
                    var datas = ['0', '0', '0', '0', '0', '0', '0'];
                    for (let index = 0; index < array.length; index++) {
                        const element = array[index];
                        var indexNum = this.currentWeek.indexOf(element.QRYSJ); 
                        datas[indexNum] = element.NUM;
                    }
                    this.zxDatas = datas;
                    this.refreshZXChart();
                }).catch(error => {
                    console.log(error)
                });
            },
            // 本院统计选择分类样式变化
            conditionClass(obj) {
                if (this.currentCondition == obj) {
                    return "active";
                } else {
                    return "";
                }
            },
            // 本院统计选择分类请求
            conditionSelected(obj) {
                this.currentCondition = obj;
                this.qryZXNum();
            },
            // 实际情况对比分析 1:上周 2:本周
            qryData(week) {
                var weekday = new Date().getDay();
                this.$ajax.post('',{
                    "MSH.1" : "myStage",
                    "MSH.2" : "qryData",
                    "tableName" : "TBYCHZSQD",
                    "flag": week, 
                    "weekday": weekday,
                    "token" : window.localStorage.token,
                    "FORMAT" : 2
                }).then(res => {
                    if (!res.data.rows) {
                        return;
                    }
                    if (week == 1) {
                        var array = res.data.rows;
                        var datas = ['0', '0', '0', '0', '0', '0', '0'];
                        for (let index = 0; index < array.length; index++) {
                            const element = array[index];
                            datas[index] = element.COUNT;
                        }
                        this.lastWeekDatas = datas;
                    } else if (week == 2) {
                        var array = res.data.rows;
                        var datas = ['0', '0', '0', '0', '0', '0', '0'];
                        for (let index = 0; index < array.length; index++) {
                            const element = array[index];
                            datas[index] = element.COUNT;
                        }
                        this.thisWeekDatas = datas;
                    }
                    this.refreshZZChart();  
                }).catch(error => {
                    console.log(error)
                });
            },
            // 刷新折线图
            refreshZXChart() {
                this.zxChart.setOption({
                    tooltip:{
                        show:true,
                        formatter:'日期：{b} <br /> 数量：{c}'
                    },
                    xAxis:{
                        type:'category',
                        data:this.currentWeek,
                        axisLine:{
                            lineStyle:{
                                color:'#ccc'
                            }                        
                        },
                        axisLabel:{
                            color:'#333'
                        },
                        boundaryGap: false,
                        axisTick:{
                            show:false
                        },
                        splitLine:{
                            show:true,
                            lineStyle:{
                                color:'rgba(104, 133, 176, 0.5)',
                                type:'dotted'
                            }
                        }
                    },
                    yAxis:{
                        type:'value',
                        splitNumber:5,
                        axisLine:{
                            lineStyle:{
                                color:'#ccc'
                            }                        
                        },
                        axisLabel:{
                            color:'#333'
                        },
                        axisTick:{
                            show:false
                        },
                        splitLine:{
                            lineStyle:{
                                color:'rgba(104, 133, 176, 0.5)',
                                type:'dotted'
                            }
                        },
                    },
                    grid:{
                        top:10,
                        left:60,
                        right:60,
                        height:160
                    },
                    series:[{
                        data: this.zxDatas,
                        type: 'line',
                        smooth: true,
                        symbol:'circle',
                        symbolSize:10,
                        itemStyle:{
                            color:'#2FA2F4',
                            borderColor:'#fff',
                            borderWidth:1
                        },
                        lineStyle:{
                            color:'#00C8FF',
                            width:3
                        }
                    }],
                    dataZoom: [
                        {   // 这个dataZoom组件，默认控制x轴。
                            type: 'inside', // 这个 dataZoom 组件是 slider 型 dataZoom 组件
                            start: 0,      // 左边在 10% 的位置。
                            end: 60         // 右边在 60% 的位置。
                        }
                    ]
                })
            },
            // 刷新柱状图
            refreshZZChart() {
                this.zzChart.setOption({
                    tooltip:{
                        show:true,
                        formatter:'星期：{b} <br /> 数量：{c}'
                    },
                    xAxis:{
                        type:'category',
                        data:['星期日','星期一','星期二','星期三','星期四','星期五','星期六'],
                        axisLine:{
                            lineStyle:{
                                color:'#ccc'
                            }                        
                        },
                        axisLabel:{
                            color:'#333'
                        },
                        axisTick:{
                            show:false
                        },
                        splitLine:{
                            show:true,
                            lineStyle:{
                                color:'rgba(104, 133, 176, 0.5)',
                                type:'dotted'
                            }
                        }
                    },
                    yAxis:{
                        type:'value',
                        splitNumber:5,
                        axisLine:{
                            lineStyle:{
                                color:'#ccc'
                            }                        
                        },
                        axisLabel:{
                            color:'#333'
                        },
                        axisTick:{
                            show:false
                        },
                        splitLine:{
                            lineStyle:{
                                color:'rgba(104, 133, 176, 0.5)',
                                type:'dotted'
                            }
                        },
                    },
                    grid:{
                        top:30,
                        left:60,
                        right:58,
                        height:160
                    },
                    series:[
                        {
                            data: this.lastWeekDatas,
                            type: 'bar',
                            barWidth:12,
                            itemStyle:{
                                color:'#FF8339'
                            }
                        },
                        {
                            data: this.thisWeekDatas,
                            type: 'bar',
                            barWidth:12,
                            itemStyle:{
                                color:'#2FA2F4'
                            }
                        }]
                })
            },
        },
    }
</script>

<style lang='less' scoped>
    @baseFontSize:14px;
    .work__topCard-wr{
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;
        height: 100px;
        .work__topCard1,.work__topCard2{
            display: flex;
            flex-direction: row;
            flex-wrap: nowrap;
            position: relative;
            width: 50%;
            background: #fff;
            border-radius: 4px;
            padding: 25px 30px;
            .card-text1,.card-text2{
                position: relative;
                top: -8px;
                
            }
            .card-text1{
                font-size: 26px;
                color: #333;
            }
            .card-text2{
                font-size: @baseFontSize;
                color: #999;
            }
            .card-look-btn{
                display: inline-block;
                position: absolute;
                width:84px;
                height: 30px;
                top: 35px;
                right: 30px;
                text-align: center;
                background:linear-gradient(90deg,rgba(48,194,250,0.84) 0%,rgba(2,147,253,0.93) 100%);
                box-shadow: 0px 1px 10px -5px rgba(48,194,250, 0.4),0px 4px 10px 0px rgba(2,147,253, 0.4);
                border-radius:2px;
                color: #fff;
                font-size: 15px;
                line-height: 30px;
            }
        }
        .work__topCard1{
            margin-right: 10px;
        }
    }
    .work__statistic-wrapper{
        .work__statistic{
            background: #fff;
            margin-top: 10px;
            border-radius: 4px;
            &.statistic1{
                height: 323px;
            }
            &.statistic2{
                height: 279px;
            }
            .work__st-title{
                font-size: @baseFontSize;
                padding: 12px 0 11px 16px;
                border-bottom: 1px solid #CED7E3;
            }
            .work__btn-group{
                padding: 8px;
                text-align: center;
                .work__s1-btn{
                    display: inline-block;
                    padding:8px 14px;
                    font-size: @baseFontSize;
                    border-radius: 20px;
                    &.active{
                        color: #2FA2F4;
                        background: #EDF6FF;
                    }
                }
            }
            .work__statistic-wr1{
                height: 220px;
            }
            .work__statistic-wr2{
                height: 230px;
            }
        }
    }
</style>