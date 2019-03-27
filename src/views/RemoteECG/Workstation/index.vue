<template>
    <div>
        <div class="work__topCard-wr">
            <div class="work__topCard1">
                <div style="width:50px;height:50px;margin-right:30px"></div>
                <div class="card-text">
                    <div class="card-text1">123<span style="font-size:14px">单</span></div>
                    <div class="card-text2">申请审批单</div>
                </div>
                <span class="card-look-btn">查看</span>              
            </div>
            <div class="work__topCard2">
                <div style="width:50px;height:50px;margin-right:30px"></div>
                <div class="card-text">
                    <div class="card-text1">123<span style="font-size:14px">单</span></div>
                    <div class="card-text2">会诊审批单</div>
                </div>
                <span class="card-look-btn">查看</span>   
            </div>
        </div>
        <div class="work__statistic-wrapper">
            <div class="work__statistic statistic1">
                <div class="work__st-title">本院统计</div>
                <div class="work__btn-group">
                    <span class="work__s1-btn active">会诊诊断数量</span>
                    <span class="work__s1-btn">审批拒绝数量</span>
                    <span class="work__s1-btn">会诊结束数量</span>
                    <span class="work__s1-btn">会诊收入金额</span>
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
        mounted() {
            let stCard1 = echarts.init(this.$refs.statisticCard1,null,{renderer:"svg"});    
            stCard1.setOption({
                tooltip:{
                    show:true,
                    formatter:'日期：{b} <br /> 数量：{c}'
                },
                xAxis:{
                    type:'category',
                    data:['2019-01-01','2019-01-02','2019-01-03','2019-01-04','2019-01-05','2019-01-06','2019-01-07','2019-01-08','2019-01-09'],
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
                    data: [12,21,13,4,5,9,1],
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
            let stCard2 = echarts.init(this.$refs.statisticCard2,null,{renderer:"svg"});    
            stCard2.setOption({
                tooltip:{
                    show:true,
                    formatter:'日期：{b} <br /> 数量：{c}'
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
                series:[{
                    data: [12,21,13,4,5,9,1],
                    type: 'bar',
                    barWidth:12,
                    itemStyle:{
                        color:'#FF8339'
                    }
                }]
            })  
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