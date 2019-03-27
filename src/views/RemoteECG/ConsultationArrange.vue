<template>
	<div class="cdct_container">
		<XHeader :left-options="{backText: ''}">会诊安排
			<span slot="right">保存</span>
		</XHeader>
		<div class="cdct_content cdct_relative">
			<scroll :selectScroll="true" :useTransition="false" >
				<div class="cdct_main">
					<div class="cdct_title">患者基本信息</div>
					<div class="cdct_inputBox">
						<div class="cdct_info"><span>患者姓名</span></div>
						<input class="cdct_input" disabled v-model="TEST">
					</div>
					<div class="cdct_inputBox">
						<div class="cdct_info"><span>性&emsp;&emsp;別</span></div>
						<input class="cdct_input" disabled v-model="TEST">
					</div>
					<div class="cdct_inputBox">
						<div class="cdct_info"><span>出生年月</span></div>
						<input class="cdct_input" disabled v-model="TEST">
					</div>
					<div class="cdct_inputBox">
						<div class="cdct_info"><span>年&emsp;&emsp;龄</span></div>
						<input class="cdct_input" style="width: 123px; margin-right: 6px;" disabled v-model="TEST">
						<input class="cdct_input" disabled v-model="TEST" style="width: 71px;">
					</div>
					<div class="cdct_inputBox">
						<div class="cdct_info"><span>婚姻状况</span></div>
						<input class="cdct_input" disabled v-model="TEST">
					</div>
					<div class="cdct_inputBox">
						<div class="cdct_info"><span>证件类型</span></div>
						<input class="cdct_input" disabled v-model="TEST">
					</div>
					<div class="cdct_inputBox">
						<div class="cdct_info"><span>证&ensp;件&ensp;号</span></div>
						<input class="cdct_input" disabled v-model="TEST">
					</div>
					<div class="cdct_inputBox">
						<div class="cdct_info"><span>国&emsp;&emsp;籍</span></div>
						<input class="cdct_input" disabled v-model="TEST">
					</div>
					<div class="cdct_inputBox">
						<div class="cdct_info"><span>民&emsp;&emsp;族</span></div>
						<input class="cdct_input" disabled v-model="TEST">
					</div>
					<div class="cdct_inputBox">
						<div class="cdct_info"><span>职&emsp;&emsp;业</span></div>
						<input class="cdct_input" disabled v-model="TEST">
					</div>
					<div class="cdct_inputBox">
						<div class="cdct_info"><span>患者性质</span></div>
						<input class="cdct_input" disabled v-model="TEST">
					</div>
					<div class="cdct_inputBox">
						<div class="cdct_info"><span>就&ensp;诊&ensp;号</span></div>
						<input class="cdct_input" disabled v-model="TEST">
					</div>
					<div class="cdct_inputBox">
						<div class="cdct_info"><span>付费方式</span></div>
						<input class="cdct_input" disabled v-model="TEST">
					</div>
				</div>
				<div class="cdct_main">
					<div class="cdct_title">心电诊断申请详情</div>
					<div class="cdct_inputBox">
						<div class="cdct_info"><span>诊断时间</span></div>
						<input class="cdct_input" disabled v-model="TEST">
					</div>
					<div class="cdct_inputBox">
						<div class="cdct_info"><span>检查类型</span></div>
						<input class="cdct_input" disabled v-model="TEST">
					</div>
					<div class="cdct_inputBox" style="display: flex; width: 100%; margin-right: 25px;">
						<div class="cdct_info"><span>诊断目的</span></div>
						<input class="cdct_input" disabled style="flex: 1;">
					</div>
					<div class="cdct_inputBox cdct_unit unit1">
						<div class="cdct_info"><span>预估费用</span></div>
						<input class="cdct_input" disabled v-model="TEST">
					</div>
					<div class="cdct_inputBox cdct_unit unit1">
						<div class="cdct_info"><span>实际费用</span></div>
						<input class="cdct_input">
					</div>
				</div>
				<div class="cdct_main">
					<div class="cdct_title">诊断安排</div>
					<div class="cdct_inputBox" style="width: 100%;">
						<div class="cdct_info"><span>会诊信息</span></div>
						<div class="cdct_choose" @click="addHospital">添加信息</div>
					</div>
					<div class="cdct_table" style="margin-left: 71px;">
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
								<el-select v-model="TEST" clearable>
								    <el-option v-for="(item,index) in 3" :key="index" :label="item.val" :value="item.key"></el-option>
								</el-select>
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
								<el-select v-model="item.doctor" clearable>
								    <el-option v-for="(item,index) in testArr" :key="index" :label="item.val" :value="item.key"></el-option>
								</el-select>
							</div>
							<div class="cdct_td cdct_del" @click="delHospital(index)">删除</div>
						</div>
					</div>
					
					<div class="cdct_inputBox">
						<div class="cdct_info"><span>诊断安排时间</span></div>
						<datetime class="cdct_time" :min-year="1900" :start-date="getNowFormatDate()" v-model="TEST" ></datetime>
					</div>
					<div class="cdct_inputBox">
						<div class="cdct_info"><span>安&ensp;排&ensp;人</span></div>
						<input class="cdct_input">
					</div>
				</div>

			</scroll>
		</div>
	</div>
</template>

<script>
	export default {
		name: 'ConsultationArrange',
		data() {
			return {
				TEST: '',
				hospitalArr:[],
				testArr: [
					{key:'1', val:'测试1'},
					{key:'2', val:'测试2'},
				],
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
		}
	}
</script>
<style lang='less' scoped>
	
</style>