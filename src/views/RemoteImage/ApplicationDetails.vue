<template>
	<div class="cdct_container">
		<XHeader :left-options="{backText: ''}">待审核
			<span slot="right" class="operation" :class="{active: selectionShow}" @click="selectionShow = !selectionShow">操作</span>
			<animation enter="fadeInDown faster" leave="fadeOut">
				<div v-show="selectionShow" class="selection">		            
				    <div class="vux-1px-b"v-for="(item,index) in 5" :key="'cz'+index">{{item}}</div>			            
				</div>
			</animation>
			
		</XHeader>
		<div class="cdct_content cdct_relative">
			<scroll :selectScroll="true" :useTransition="false" >
				
				<div class="cdct_main cdct_relative">
					<div class="cdct_title title2">患者基本信息</div>
					<div class="process" @click="processShow = !processShow"></div>
					<!-- 进程条 -->
					<div class="process_wrap">
					    <process-box v-model="processShow">
					        <process-item step="1" current>建立申请单</process-item>
					        <process-item step="2" >病例资料</process-item>
					        <process-item step="3">会诊安排</process-item>
					        <process-item step="4">视屏会诊</process-item>
					        <process-item step="5">专家报告</process-item>
					        <process-item step="6">会诊结束</process-item>
					    </process-box>
					</div>
					<div class="cdct_inputBox cdct_asterisk">
						<div class="cdct_info"><span>患者姓名</span></div>
						<input class="cdct_input" disabled>
					</div>
					<div class="cdct_inputBox">
						<div class="cdct_info"><span>性&emsp;&emsp;别</span></div>
						<input class="cdct_input" disabled>
					</div>
					<div class="cdct_inputBox">
						<div class="cdct_info"><span>出生年月</span></div>
						<input class="cdct_input" disabled>
					</div>
					<div class="cdct_inputBox">
						<div class="cdct_info"><span>年&emsp;&emsp;龄</span></div>
						<input class="cdct_input" style="width: 123px; margin-right: 10px;" disabled>
						<span class="cdct_error">{{verrors.first('年龄')}}</span>
						<input class="cdct_input" disabled style="width: 71px;">
					</div>
					<div class="cdct_inputBox">
						<div class="cdct_info"><span>婚姻状况</span></div>
						<input class="cdct_input" disabled>
					</div>
					<div class="cdct_inputBox">
						<div class="cdct_info"><span>证件类型</span></div>
						<input class="cdct_input" disabled>
					</div>
					<div class="cdct_inputBox">
						<div class="cdct_info"><span>证&ensp;件&ensp;号</span></div>
						<input class="cdct_input" disabled>
					</div>
					<div class="cdct_inputBox">
						<div class="cdct_info"><span>国&emsp;&emsp;籍</span></div>
						<input class="cdct_input" disabled>
					</div>
					<div class="cdct_inputBox">
						<div class="cdct_info"><span>民&emsp;&emsp;族</span></div>
						<input class="cdct_input" disabled>
					</div>
					<div class="cdct_inputBox">
						<div class="cdct_info"><span>职&emsp;&emsp;业</span></div>
						<input class="cdct_input" disabled>
					</div>
					<div class="cdct_inputBox">
						<div class="cdct_info"><span>患者性质</span></div>
						<input class="cdct_input" disabled>
					</div>
					<div class="cdct_inputBox">
						<div class="cdct_info"><span>就&ensp;诊&ensp;号</span></div>
						<input class="cdct_input" disabled>
					</div>
					<div class="cdct_inputBox">
						<div class="cdct_info"><span>付费方式</span></div>
						<input class="cdct_input" disabled>
					</div>
					<div class="cdct_inputBox">
						<div class="cdct_info"><span>检查单号</span></div>
						<input class="cdct_input" disabled>
					</div>
				</div>
				<div class="cdct_main">
					<div class="cdct_title title3">病例摘要</div>
					<div class="cdct_inputBox" style="display: flex; width: 100%; margin-right: 25px;">
						<div class="cdct_info"><span>患者主述</span></div>
						<input class="cdct_input" disabled style="flex: 1;">
					</div>
					<div class="cdct_inputBox" style="display: flex; width: 100%; margin-right: 25px;">
						<div class="cdct_info"><span>病&emsp;&emsp;史</span></div>
						<input class="cdct_input" disabled style="flex: 1; height: 110px;">
					</div>
				</div>
				<div class="cdct_main">
					<div class="cdct_title title4">初步诊断</div>
					<div class="cdct_inputBox">
						<div class="cdct_info"><span>诊断时间</span></div>
						<input class="cdct_input" disabled>
					</div>
					<div class="cdct_inputBox" style="display: flex; width: 100%; margin-right: 25px;">
						<div class="cdct_info"><span>初步诊断</span></div>
						<input class="cdct_input" disabled style="flex: 1;">
					</div>
					<div class="cdct_inputBox" style="width: 100%;">
						<div class="cdct_info"><span>疾病编码</span></div>
						<div class="cdct_table spe_table" style="margin-left: 0; margin-right: 0;">
							<div class="cdct_thead">
								<div class="cdct_td">疾病编码</div>
								<div class="cdct_td">疾病名称</div>
							</div>
							<div class="cdct_tr">
								<div class="cdct_td">C53.851</div>
								<div class="cdct_td">宫颈交错跨越的恶性肿瘤</div>
							</div>
							<div class="cdct_tr">
								<div class="cdct_td">C53.851</div>
								<div class="cdct_td">宫颈交错跨越的恶性肿瘤</div>
							</div>
						</div>
					</div>
					
					<div class="cdct_inputBox">
						<div class="cdct_info"><span>病例资料</span></div>
						<div class="cdct_choose spe">病历中心</div>
					</div>

				</div>
				<div class="cdct_main">
					<div class="cdct_title title5">申请信息</div>
					<div class="cdct_inputBox">
						<div class="cdct_info"><span>检查项目</span></div>
						<input class="cdct_input" disabled>
					</div>
					<div class="cdct_inputBox">
						<div class="cdct_info"><span>诊断日期</span></div>
						<input class="cdct_input" disabled>
					</div>
					<div class="cdct_checkBox">
						<div class="cdct_info" ><span>申请类型</span></div>
						<div class="chk_content">
							<div class="cdct_chk cdct_chk_suc" v-for="(item,index) in QQLX" :key="'QQLX'+index">
								<input :id="'QQLX'+index" type="checkbox" :value="item.key" v-model="TEST1" disabled>
								<label :for="'QQLX'+index">{{item.val}}</label>
							</div>

						</div>
					</div>
					<div class="cdct_inputBox" style="width: 100%;">
						<div class="cdct_info"><span>会诊医院</span></div>
						<div class="cdct_table spe_table" style="margin-left: 0; margin-right: 0;">
							<div class="cdct_thead">
								<div class="cdct_td">上级会诊医院</div>
								<div class="cdct_td">会诊科室</div>
								<div class="cdct_td">会诊医生</div>
							</div>
							<div class="cdct_tr">
								<div class="cdct_td"></div>
								<div class="cdct_td"></div>
								<div class="cdct_td"></div>
							</div>
							<div class="cdct_tr">
								<div class="cdct_td"></div>
								<div class="cdct_td"></div>
								<div class="cdct_td"></div>
							</div>
						</div>
					</div>
					
					<div class="cdct_inputBox cdct_unit unit1">
						<div class="cdct_info"><span>预估费用</span></div>
						<input class="cdct_input" disabled>
					</div>
				</div>
				<div class="cdct_main">
					<div class="cdct_inputBox" style="display: flex; width: 100%; margin-right: 25px; margin-bottom: 0;">
						<div class="cdct_info"><span>拒绝原因</span></div>
						<input class="cdct_input" disabled style="flex: 1;">
					</div>
				</div>
				<div class="cdct_main">
					<div class="cdct_title title6">申请人信息</div>
					<div class="cdct_inputBox">
						<div class="cdct_info"><span>申请医院</span></div>
						<input class="cdct_input" disabled value="测试">
					</div>
					<div class="cdct_inputBox">
						<div class="cdct_info"><span>申请科室</span></div>
						<input class="cdct_input" disabled>
					</div>
					<div class="cdct_inputBox">
						<div class="cdct_info"><span>申请医生</span></div>
						<input class="cdct_input" disabled>
					</div>

				</div>
				
			</scroll>
		</div>
		
	</div>
</template>

<script>
	import { XTextarea } from 'vux'
	import Animation from '@/components/animation'
	import processBox from '@/components/processBox'//外部容器
	import processItem from '@/components/processBox/processItem'//每一项
	export default {
		name: 'ApplicationDetails',
		components:{
			XTextarea,Animation,processBox,processItem
		},
		mounted(){
		},
		data() {
			return {
				TEST: '',
				TEST1: [],
				selectionShow: false,
				QQLX:[
					{key:'1', val:'点名会诊'},
				],
				processShow: false,
			}
		},
		methods: {
			getNowFormatDate() {	// 获取当前时间
				let date = new Date();
				let seperator1 = "-";
				let year = date.getFullYear();
				let month = date.getMonth() + 1;
				let strDate = date.getDate();
				if (month >= 1 && month <= 9) {
					month = "0" + month;
				}
				if (strDate >= 0 && strDate <= 9) {
					strDate = "0" + strDate;
				}
				let currentdate = year + seperator1 + month + seperator1 + strDate;
				return currentdate;
			},

		}
	}
</script>

<style lang="less" scoped>
	.cdct_container{
		.operation{
			display: inline-block;
			width: 100%;
			height: 100%;
			&:after{
				display: inline-block;
				content: '';
				width: 14px;
				height: 7px;
				background: url('~@/assets/imgs/arrow.png') no-repeat;
				background-size: contain;
				margin-left: 5px;
				transition: transform 1s;
			}
		}
		.active.operation{
			&:after{
				transform: rotate(180deg);
			}
		}
		.selection{
		    position: absolute;
		    padding: 0 15px;
		    height: auto;
		    background: #5F7397;
		    border-radius: 3px;
		    top:40px;
		    right:2px;
		    box-shadow: 0 0 8px rgba(0,0,0,.2); 
		    transition: all .2s;
		    z-index: 1;
		    &:after{
		        content: '';
		        position: absolute;
		        width: 0;
		        height: 0;
		        left: 50%;
		        top:-16px;
		        border-top: 8px solid transparent;
		        border-bottom:8px solid #5F7397;
		        border-left: 8px solid transparent;
		        border-right: 8px solid transparent;
		    }
		    div{
		        text-align: center;
		        width: 100px;
		        padding: 5px 0;
		        font-size: 1.4rem;
		        color: #fff;
		    }
		}
		.cdct_content{
			.cdct_main{
				.spe_table.cdct_table{
					.cdct_thead,.cdct_tr{
						.cdct_td:last-child{
							max-width: none;
						}
					}
				} 
			} 
			.title2.cdct_title{
				&:before{
					width: 19px;
					height: 22px;
					background-image: url('~@/assets/imgs/icon2.png');
				}
				
			}
			.title3.cdct_title{
				&:before{
					width: 20px;
					height: 20px;
					background-image: url('~@/assets/imgs/icon3.png');
				}
				
			}
			.title4.cdct_title{
				&:before{
					width: 22px;
					height: 22px;
					background-image: url('~@/assets/imgs/icon4.png');
				}
				
			}
			.title5.cdct_title{
				&:before{
					width: 23px;
					height: 21px;
					background-image: url('~@/assets/imgs/icon5.png');
				}
				
			}
			.title6.cdct_title{
				&:before{
					width: 23px;
					height: 23px;
					background-image: url('~@/assets/imgs/icon6.png');
				}
				
			}

			
			.db.cdct_inputBox{
				width: 492px;
				.cdct_input{
					width: 422px;
				}
			}
			.row.cdct_inputBox{
				width: calc(~'100% - 16px');
				.cdct_input{
					flex: 1;
				}
			}
			.choose1.cdct_choose{
				width: 138px;
				&:before{
					width: 12px;
					height: 13px;
					background-image: url("~@/assets/imgs/choose1.png");
				}
			}
			.spe.cdct_choose{
				&:before{
					width: 0;
					height: 0;
				}
			}
			.process{
				position: absolute;
				top: 0;
				right: 0;
				width: 64px;
				height: 64px;
				background: url("~@/assets/imgs/process.png") no-repeat;
				background-size: cover;
			}
			.process_wrap{
				padding-right:20px; 
				width: calc(~"100% - 75px");
				position: absolute;
				top: 8px;
				z-index: 10;
			}

		}
		
	}
	
</style>