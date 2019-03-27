<template>
	<div class="cdct_container cdct_right">
		<div class="cdct_content cdct_relative">
			<scroll :selectScroll="true" :useTransition="false" >
				<div class="cdct_operation">
					新建申请
					<div class="cdct_btn" @click="saveBtn">提交申请</div>
					<div class="cdct_btn orange">重置</div>
				</div>
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
						<input class="cdct_input" style="width: 98px; margin-right: 10px;" v-model="TEST" name="患者姓名" v-validate="'required'" disabled>
						<span class="cdct_error">{{verrors.first('患者姓名')}}</span>
						<div class="cdct_choose1" style="width: 60px;" @click="selectPatient=!selectPatient">选择</div>
					</div>
					<div class="cdct_inputBox">
						<div class="cdct_info"><span>性&emsp;&emsp;别</span></div>
						<el-select v-model="TEST" clearable>
							<el-option v-for="(item,index) in 3" :key="index" :label="item.val" :value="item.key"></el-option>
						</el-select>
					</div>
					<div class="cdct_inputBox">
						<div class="cdct_info"><span>出生年月</span></div>
						<datetime class="cdct_time" :min-year="1900" v-model="TEST"></datetime>
					</div>
					<div class="cdct_inputBox">
						<div class="cdct_info"><span>年&emsp;&emsp;龄</span></div>
						<input class="cdct_input" style="width: 98px; margin-right: 10px;" name="年龄" v-validate="'numeric'">
						<span class="cdct_error">{{verrors.first('年龄')}}</span>
						<el-select v-model="TEST" clearable style="width: 60px;">
							<el-option v-for="(item,index) in 3" :key="index" :label="item.val" :value="item.key"></el-option>
						</el-select>
					</div>
					<div class="cdct_inputBox">
						<div class="cdct_info"><span>国&emsp;&emsp;籍</span></div>
						<el-select v-model="TEST" clearable>
							<el-option v-for="(item,index) in 3" :key="index" :label="item.val" :value="item.key"></el-option>
						</el-select>
					</div>
					<div class="cdct_inputBox">
						<div class="cdct_info"><span>民&emsp;&emsp;族</span></div>
						<el-select v-model="TEST" clearable>
							<el-option v-for="(item,index) in 3" :key="index" :label="item.val" :value="item.key"></el-option>
						</el-select>
					</div>
					<div class="cdct_inputBox">
						<div class="cdct_info"><span>证件类型</span></div>
						<el-select v-model="TEST" clearable>
							<el-option v-for="(item,index) in 3" :key="index" :label="item.val" :value="item.key"></el-option>
						</el-select>
					</div>
					<div class="cdct_inputBox">
						<div class="cdct_info"><span>证&ensp;件&ensp;号</span></div>
						<input class="cdct_input">
					</div>
					<div class="cdct_inputBox">
						<div class="cdct_info"><span>婚姻状况</span></div>
						<el-select v-model="TEST" clearable>
							<el-option v-for="(item,index) in 3" :key="index" :label="item.val" :value="item.key"></el-option>
						</el-select>
					</div>
					<div class="cdct_inputBox">
						<div class="cdct_info"><span>职&emsp;&emsp;业</span></div>
						<el-select v-model="TEST" clearable>
							<el-option v-for="(item,index) in 3" :key="index" :label="item.val" :value="item.key"></el-option>
						</el-select>
					</div>
					<div class="cdct_inputBox">
						<div class="cdct_info"><span>付费方式</span></div>
						<el-select v-model="TEST" clearable>
							<el-option v-for="(item,index) in 3" :key="index" :label="item.val" :value="item.key"></el-option>
						</el-select>
					</div>
					<div class="cdct_inputBox">
						<div class="cdct_info"><span>患者性质</span></div>
						<el-select v-model="TEST" clearable>
							<el-option v-for="(item,index) in 3" :key="index" :label="item.val" :value="item.key"></el-option>
						</el-select>
					</div>
					<div class="cdct_inputBox cdct_asterisk">
						<div class="cdct_info"><span>就&ensp;诊&ensp;号</span></div>
						<input class="cdct_input" name="就诊号" v-validate="'required|numeric'">
						<span class="cdct_error">{{verrors.first('就诊号')}}</span>
					</div>

				</div>
				<div class="cdct_main">
					<div class="cdct_title title3">病例摘要</div>
					<div class="cdct_textarea">
						<div class="cdct_info"><span>患者主述</span></div>
						<x-textarea :max="100" :rows="1" class="spe_textarea"></x-textarea>
					</div>
					<div class="cdct_textarea cdct_asterisk">
						<div class="cdct_info"><span>病&emsp;&emsp;史</span></div>
						<x-textarea :max="500" v-model="TEST" v-validate="'required'" data-vv-name="病史" @on-blur="$validator.validate('病史')"></x-textarea>
						<span class="cdct_error" style="top: 110px;">{{verrors.first('病史')}}</span>
					</div>
				</div>
				<div class="cdct_main">
					<div class="cdct_title title4">初步诊断</div>
					<div class="cdct_inputBox cdct_asterisk">
						<div class="cdct_info"><span>诊断时间</span></div>
						<datetime class="cdct_time" :min-year="1900" :end-date="getNowFormatDate()" v-model="TEST" v-validate="'required'" data-vv-name="诊断时间" @on-hide="$validator.validate('诊断时间')" @on-confirm="$validator.validate('诊断时间')"></datetime>
						<span class="cdct_error">{{verrors.first('诊断时间')}}</span>
					</div>
					<div class="cdct_checkBox" style="width: 50%;">
						<div class="cdct_info" ><span>异常状态</span></div>
						<div class="chk_content">
							<div class="cdct_radio cdct_radio_suc" v-for="(item,index) in ZDSJ" :key="'ZDSJ'+index">
								<input :id="'ZDSJ'+index" type="radio" :value="item.key" v-model="TEST">
								<label :for="'ZDSJ'+index">{{item.val}}</label>
							</div>
						</div>
					</div>
					<div class="cdct_textarea">
						<div class="cdct_info"><span>初步诊断</span></div>
						<x-textarea :max="100" :rows="1" class="spe_textarea"></x-textarea>
					</div>
					<div class="cdct_inputBox" style="width: 100%;">
						<div class="cdct_info"><span>疾病编码</span></div>
						<div class="cdct_choose choose1" @click="ICD_show = !ICD_show">编辑疾病编码</div>
					</div>
					<div class="cdct_table spe_table">
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
					<div class="cdct_inputBox" style="width: 100%;">
						<div class="cdct_info"><span>病例资料</span></div>
						<div class="cdct_choose choose2">上传病例</div>
						<div class="Upload_Completed"></div>
					</div>
					

				</div>
				<div class="cdct_main">
					<div class="cdct_title title5">申请信息</div>
					<div class="cdct_inputBox">
						<div class="cdct_info"><span>检查类型</span></div>
						<el-select v-model="TEST" clearable>
						    <el-option v-for="(item,index) in 3" :key="index" :label="item.val" :value="item.key"></el-option>
						</el-select>
					</div>
					<div class="cdct_inputBox cdct_asterisk">
						<div class="cdct_info"><span>会诊时间</span></div>
						<datetime class="cdct_time" :min-year="1900" :start-date="getNowFormatDate()" v-model="TEST" v-validate="'required'" data-vv-name="会诊时间" @on-hide="$validator.validate('会诊时间')" ></datetime>
						<span class="cdct_error">{{verrors.first('会诊时间')}}</span>
					</div>
					<div class="cdct_checkBox" style="width: 270px">
						<div class="cdct_info" ><span>申请类型</span></div>
						<div class="chk_content">
							<div class="cdct_chk cdct_chk_suc" v-for="(item,index) in QQLX" :key="'QQLX'+index">
								<input :id="'QQLX'+index" type="checkbox" :value="item.key" v-model="TEST1">
								<label :for="'QQLX'+index">{{item.val}}</label>
							</div>

						</div>
					</div>
					<div class="cdct_textarea">
						<div class="cdct_info"><span>诊断目的</span></div>
						<x-textarea :max="100" :rows="1" class="spe_textarea"></x-textarea>
					</div>
					<div class="cdct_inputBox">
						<div class="cdct_info"><span>会诊医院</span></div>
						<div class="cdct_choose" @click="addHospital">添加信息</div>
					</div>
					<div class="cdct_table">
						<div class="cdct_thead">
							<div class="cdct_td">上级会诊医院</div>
							<div class="cdct_td">会诊科室</div>
							<div class="cdct_td">会诊医生</div>
							<div class="cdct_td">操作</div>
						</div>
						<div class="cdct_tr">
							<div class="cdct_td">
								<el-select v-model="TEST" clearable>
								    <el-option v-for="(item,index) in 3" :key="index" :label="item.val" :value="item.key"></el-option>
								</el-select>
							</div>
							<div class="cdct_td">
								<el-select v-model="TEST" clearable>
								    <el-option v-for="(item,index) in 3" :key="index" :label="item.val" :value="item.key"></el-option>
								</el-select>
							</div>
							<div class="cdct_td">
								<div class="info_check">
									<p>123</p>
									<span></span>
								</div>
							</div>
							<div class="cdct_td"></div>
						</div>
						<div class="cdct_tr" v-for="(item,index) in hospitalArr" :key="'hzyy'+index">
							<div class="cdct_td">
								<el-select v-model="item.hospital" clearable>
								    <el-option v-for="(item,index) in testArr" :key="index" :label="item.val" :value="item.key"></el-option>
								</el-select>
							</div>
							<div class="cdct_td">
								<el-select v-model="item.department" clearable>
								    <el-option v-for="(item,index) in testArr" :key="index" :label="item.val" :value="item.key"></el-option>
								</el-select>
							</div>
							<div class="cdct_td">
								<div class="info_check">
									<p>123</p>
									<span></span>
								</div>
							</div>
							<div class="cdct_td cdct_del" @click="delHospital(index)">删除</div>
						</div>
					</div>
					<div class="cdct_inputBox cdct_unit unit1">
						<div class="cdct_info"><span>预估费用</span></div>
						<input class="cdct_input">
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

		<select-modal v-model="selectPatient" width="808px" height="459px" @search="submit">
		    <dl class="header vux-1px" slot="header">
		        <dt class="head-tr">医院名称</dt>
		        <dt class="head-tr" >患者姓名</dt>
		        <dt class="head-tr" style="flex: 0.5;">性别</dt>
		        <dt class="head-tr" style="flex: 0.5;">年龄</dt>
		        <dt class="head-tr" style="flex: 1.5;">身份证号</dt>
		        <dt class="head-tr">联系电话</dt>
		        <dt class="head-tr">患者性质</dt>
		    </dl>
		    <div class="tbody" slot="body">
		        <dl class="tb-tr"  v-for="(n) in 10" :key="n" >                           
		            <dd class="tb-td"><span>成都第一医院</span></dd>
		            <dd class="tb-td"><span>小张</span></dd>
		            <dd class="tb-td" style="flex: 0.5;"><span>男</span></dd>
		            <dd class="tb-td" style="flex: 0.5;"><span>25</span></dd>
		            <dd class="tb-td" style="flex: 1.5;"><span>5107031545446494</span></dd>  
		            <dd class="tb-td" ><span>13712747747</span></dd>  
		            <dd class="tb-td" ><span>测的是</span></dd>  
		        </dl>
		    </div> 
		</select-modal>
		<icd-select v-model="ICD_show"></icd-select>

		
		
	</div>
</template>

<script>
	import { XTextarea } from 'vux'
	import selectModal from '@/components/modal/selectModal'
	import IcdSelect from '@/components/ICD_select'
	import processBox from '@/components/processBox'//外部容器
	import processItem from '@/components/processBox/processItem'//每一项
	export default {
		name: 'NewApplication',
		components:{
			XTextarea,selectModal,IcdSelect,processBox,processItem
		},
		mounted() {

		},
		data() {
			return {
				TEST: '',
				TEST1: [],
				selectPatient: false,
				hospitalArr:[],
				processShow: true,
				QQLX:[
					{key:'1', val:'点名会诊'},
				],
				ZDSJ:[
					{key:'1', val:'正常'},
					{key:'2', val:'异常'},
				],

				testArr: [
					{key:'1', val:'测试1'},
					{key:'2', val:'测试2'},
				],
				ICD_show: false,
				saveObj: {},
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
			submit(kw){
				console.log(kw);
			},
			addHospital(){	// 添加医院
				let template = {
					hospital:'',
					department:'',
					doctor:''
				}
				this.hospitalArr.push(template);
			},
			delHospital(index){	// 删除医院
				this.hospitalArr.splice(index,1)
			},
			saveBtn(){
				this.$validator.validate().then(result => {
					if(result){
						this.$ajax.post('',{
							"MSH.1": "ychz1",
							"MSH.2": "SaveData",
							"data":{
								"TYPE":"1"
							}
						}).then(res => {
							console.log(res)
						}).catch(error => {
							console.log(error)
						});
					}else{
						this.$root.showTips = true;
					}
				})
				
			}
		}
	}
</script>

<style lang="less" scoped>
	.cdct_container{
		.cdct_content{
			.cdct_btn{
				float: right;
				margin: 10px 0 0 10px;
			}
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
					width: 426px;
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
			.choose2.cdct_choose{
				&:before{
					width: 13px;
					height: 14px;
					background-image: url("~@/assets/imgs/choose2.png");
				}
			}
			.process_wrap{
				padding-right:20px; 
				width: calc(~"100% - 75px");
				position: absolute;
				top: 8px;
				z-index: 10;
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
			.Upload_Completed{
				width: 64px;
				height: 20px;
				background: url("~@/assets/imgs/completed.png") no-repeat;
				background-size: contain;
				margin-left: 15px;
				margin-top: 10px;
			}
			.info_check{
				display: inline-block;
				width: 160px;
				height: 40px;
				box-sizing: border-box;
				background: #fff;
				border: 1px solid #CED7E3;
				border-radius: 4px;
				vertical-align: middle;
				font-size: 14px;
				color: #19293F;
				position: relative;
				p{
					position: absolute;
					left: 0;
					top: 0;
					width: 100px;
					line-height: 40px;
					text-align: left;
					margin: 0 10px;
					overflow: hidden;
				}
				span{
					position: absolute;
					width: 39px;
					height: 38px;
					top: 0;
					right: 0;
					border-radius: 0 4px 4px 0;
					background: #0096FF url('~@/assets/imgs/add1.png') no-repeat;
					background-size: 12px 12px;
					background-position: center;

				}
			}

		}

		.vux-1px:before{
			box-sizing: border-box;
			border-bottom: none;
		}
		
	}
	
</style>