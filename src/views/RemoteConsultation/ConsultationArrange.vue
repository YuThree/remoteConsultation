<template>
	<div class="cdct_container">
		<XHeader :left-options="{backText: '',preventGoBack: true}" @on-click-back="$router.push({name: 'RCAM2'})">会诊安排
			<span slot="right" @click="saveBtn">提交</span>
		</XHeader>
		<div class="cdct_content cdct_relative">
			<loading ref="loading"></loading>
			<scroll :selectScroll="true" :useTransition="false">
				<div class="cdct_main">
					<div class="process" @click="processShow = !processShow"></div>
					<!-- 进程条 -->
					<div class="process_wrap">
						<process-box v-model="processShow">
							<process-item step="1" :done="processInfo.DJLSJ != ''">建立申请单<span slot="time">{{processInfo.DJLSJ}}</span></process-item>
							<process-item step="2" :done="processInfo.BLSJ != ''">病例资料<span slot="time">{{processInfo.BLSJ}}</span></process-item>
							<process-item step="3" :done="info.IZT >= 4 && processInfo.DAPSJ != ''">会诊安排<span slot="time">{{processInfo.DAPSJ}}</span></process-item>
							<process-item step="4" :done="info.IZT >= 5 && processInfo.DBSJ != ''">视频会诊<span slot="time">{{info.IZT >= 5 ? processInfo.DBSJ : ''}}</span></process-item>
							<process-item step="5" :done="info.IZT >= 5 && processInfo.DBGRQ != ''">专家报告<span slot="time">{{processInfo.DBGRQ}}</span></process-item>
							<process-item step="6" :done="info.IZT == 6 && processInfo.ENDDATE != ''">会诊结束<span slot="time">{{processInfo.ENDDATE}}</span></process-item>
						</process-box>
					</div>
					<div class="cdct_title">患者基本信息</div>
					<div class="cdct_inputBox">
						<div class="cdct_info"><span>患者姓名</span></div>
						<input class="cdct_input" disabled v-model="resObj.CXM">
					</div>
					<div class="cdct_inputBox">
						<div class="cdct_info"><span>性&emsp;&emsp;別</span></div>
						<input class="cdct_input" disabled v-model="resObj.CXB">
					</div>
					<div class="cdct_inputBox">
						<div class="cdct_info"><span>出生年月</span></div>
						<input class="cdct_input" disabled v-model="resObj.DCSNY">
					</div>
					<div class="cdct_inputBox">
						<div class="cdct_info"><span>年&emsp;&emsp;龄</span></div>
						<input class="cdct_input" style="width: 123px; margin-right: 6px;" disabled v-model="resObj.INL">
						<input class="cdct_input" disabled :value="getVal(dictionary.unit,resObj.INLDW)" style="width: 71px;">
					</div>
					<div class="cdct_inputBox">
						<div class="cdct_info"><span>婚姻状况</span></div>
						<input class="cdct_input" disabled v-model="resObj.CHY">
					</div>
					<div class="cdct_inputBox">
						<div class="cdct_info"><span>证件类型</span></div>
						<input class="cdct_input" disabled :value="getVal(dictionary.cardType,resObj.IZJLX)">
					</div>
					<div class="cdct_inputBox">
						<div class="cdct_info"><span>证&ensp;件&ensp;号</span></div>
						<input class="cdct_input" disabled v-model="resObj.CSFZ">
					</div>
					<div class="cdct_inputBox">
						<div class="cdct_info"><span>国&emsp;&emsp;籍</span></div>
						<input class="cdct_input" disabled v-model="resObj.CGJ">
					</div>
					<div class="cdct_inputBox">
						<div class="cdct_info"><span>民&emsp;&emsp;族</span></div>
						<input class="cdct_input" disabled v-model="resObj.CMZ">
					</div>
					<div class="cdct_inputBox">
						<div class="cdct_info"><span>职&emsp;&emsp;业</span></div>
						<input class="cdct_input" disabled v-model="resObj.CZY">
					</div>
					<div class="cdct_inputBox">
						<div class="cdct_info"><span>患者性质</span></div>
						<input class="cdct_input" disabled :value="getVal(dictionary.PatientType,resObj.IBRXZ)">
					</div>
					<div class="cdct_inputBox">
						<div class="cdct_info"><span>就&ensp;诊&ensp;号</span></div>
						<input class="cdct_input" disabled v-model="resObj.CJZH">
					</div>
					<div class="cdct_inputBox">
						<div class="cdct_info"><span>付费方式</span></div>
						<input class="cdct_input" disabled :value="getVal(dictionary.payType,resObj.IFFFS)">
					</div>
				</div>
				<div class="cdct_main">
					<div class="cdct_title">会诊诊断申请详情</div>
					<div class="cdct_inputBox">
						<div class="cdct_info"><span>申请会诊时间</span></div>
						<input class="cdct_input" disabled v-model="resObj.DSQRQ">
					</div>
					<div class="cdct_inputBox">
						<div class="cdct_info"><span>会诊类型</span></div>
						<input class="cdct_input" disabled :value="getVal(HZLX,resObj.ILX)">
					</div>
					<div class="cdct_inputBox">
						<div class="cdct_info"><span>会诊方式</span></div>
						<input class="cdct_input" disabled :value="getVal(HZFS,resObj.IHZFS)">
					</div>
					<div class="cdct_inputBox cdct_unit unit1">
						<div class="cdct_info"><span>预估费用</span></div>
						<input class="cdct_input" disabled v-model="resObj.NYGFY">
					</div>
					<div class="cdct_inputBox cdct_unit unit1">
						<div class="cdct_info"><span>实际费用</span></div>
						<input class="cdct_input" v-model="resObj.NSJFY" name="实际费用" v-validate="'numeric'">
						<span class="cdct_error">{{verrors.first('实际费用')}}</span>
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
						<div class="cdct_tr" v-for="(item,index) in hospitalArr" :key="'hzyy'+index">
							<div class="cdct_td cdct_relative">
								<el-select v-model="item.hospital" @change="changeHospital" v-validate="'required'" :data-vv-name="'上级会诊医院'+index" @visible-close="$validator.validate('上级会诊医院'+index)">
									<el-option v-for="(item,index) in SJJG" :key="index" :label="item.CMC" :value="item.CBH"></el-option>
								</el-select>
								<span class="cdct_error" style="left:17px; top: 27px;">{{verrors.first('上级会诊医院'+index)}}</span>
							</div>
							<div class="cdct_td cdct_relative">
								<el-select v-model="item.department" :disabled="!item.hospital" @change="changeKS(index,arguments)" v-validate="'required'" :data-vv-name="'会诊科室'+index" @visible-close="$validator.validate('会诊科室'+index)">
									<el-option v-for="(item,index) in HZKS" :key="index" :label="item.CKSMC" :value="item.CKSBH"></el-option>
								</el-select>
								<span class="cdct_error" style="left:17px; top: 27px;">{{verrors.first('会诊科室'+index)}}</span>
							</div>
							<div class="cdct_td">
								<div class="info_check">
									<p>{{item.doctor.CYSXM}}</p>
									<span @click="item.department != '' && selectDoc(item.department,index)"></span>
								</div>
							</div>
							<div class="cdct_td" v-if="index == 0"></div>
							<div v-else class="cdct_td cdct_del" @click="delHospital(index)">删除</div>
						</div>
					</div>
					<div class="cdct_inputBox">
						<div class="cdct_info"><span>会诊安排时间</span></div>
						<datetime class="cdct_time" :min-year="1900" format="YYYY-MM-DD HH:mm" :start-date="getNowFormatDate()" v-model="resObj.DAPSJ"></datetime>
					</div>
					<div class="cdct_inputBox">
						<div class="cdct_info"><span>安&ensp;排&ensp;人</span></div>
						<input class="cdct_input" v-model="loginInfo.CYSMC" disabled>
					</div>
				</div>
			</scroll>
		</div>
	</div>
</template>

<script>
	import processBox from '@/components/processBox' //外部容器
	import processItem from '@/components/processBox/processItem' //每一项
	export default {
		name: 'ConsultationArrange',
		components: {
			processBox,
			processItem
		},
		created() {
			this.$store.commit('setParensCash', 'RemoteConsultation,ConsultationArrange');
		},
		data() {
			return {
				token: '',
				loginInfo: {},
				info: {},
				resObj: {},
				processShow: false,
				processInfo: {},
				TEST: '',
				hospitalArr: [],
				SJJG: [], // 上级机构
				HZKS: [], // 会诊科室
				HZLX: [{
						key: '1',
						val: '紧急会诊'
					},
					{
						key: '2',
						val: '预约会诊'
					},
				],
				HZFS: [{
						key: '1',
						val: '交互方式'
					},
					{
						key: '2',
						val: '离线方式'
					},
				],
				allDoc: {}, // 所有医生
				allHos: {}, // 所有机构
				allKS: {}, // 所有科室
			}
		},
		mounted() {
			if (window.localStorage.token) {
				this.token = window.localStorage.token;
			}
			if (this.$route.params.info) {
				this.info = this.$route.params.info;
			}
			if (window.localStorage.loginInfo) {
				this.loginInfo = JSON.parse(window.localStorage.loginInfo);
			}
			this.initProcess(); // 获取进度条
			this.init();
			this.qryJGinfo(); // 机构信息查询(会诊医院信息查询)
		},
		beforeRouteEnter(to, from, next) {
			if (to.params.docDetails) {
				let docIndex = to.params.docIndex;
				let docDetails = to.params.docDetails;
				next(vm => {
					// 通过 `vm` 访问组件实例
					vm.$set(vm.hospitalArr[docIndex], 'doctor', docDetails);
					// 页面一加载就刷新
					vm.$refs.scroll.refresh();
				})
			} else {
				next();
			}
		},
		beforeRouteLeave(to, from, next) {
			let addPage = ['selectDoc', 'MedicalRecords', 'uploadTheCases'];
			if (!addPage.includes(to.name)) {
				this.$store.commit('setParensCash','RemoteConsultation');
			}
			next();
		},
		methods: {
			initProcess() {
				this.$ajax.post('', {
					"MSH.1": "consultantCommon",
					"MSH.2": "findXdInfo",
					"CBH": this.info.CBH,
					"time": this.info.DJLSJ,
					"ISQLBBM": "1", // 1远程会诊 2远程影像
					"token": this.token,
					"FORMAT": 1
				}).then(res => {
					if (res.code == '100') {
						this.processInfo = res.data;
					}
				}).catch(error => {
					console.log(error)
				});
			},
			init() {
				this.$refs.loading.show('加载中...');
				this.$ajax.post('', {
					"MSH.1": "ychz2",
					"MSH.2": "applyArrangeSelect",
					"CBH": this.info.CBH,
					"JLSJ": this.info.DJLSJ,
					"token": this.token,
					"FORMAT": 1
				}).then(res => {
					this.$refs.loading.hide();
					if (res.code == '100') {
						this.resObj = res.data;
						this.resObj.DAPSJ = this.resObj.DAPSJ ? this.resObj.DAPSJ.split('.')[0] : '';
						this.resObj.DCSNY = this.resObj.DCSNY ? this.resObj.DCSNY.split(' ')[0] : '';
						this.resObj.DSQRQ = this.resObj.DSQRQ ? this.resObj.DSQRQ.split('.')[0] : '';
					}
				}).catch(error => {
					this.$refs.loading.hide();
					console.log(error)
				});
			},
			getVal(arr, key) {
				let str = '';
				arr.forEach(item => {
					if (item.key == key) {
						str = item.val;
					}
				})
				return str;
			},
			getNowFormatDate() { // 获取当前时间
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
			qryJGinfo() { // 机构信息查询(会诊医院信息查询)
				this.$ajax.post('', {
					"MSH.1": "ychz2",
					"MSH.2": "applyArrangeSelect1",
					"CBH": this.info.CBH,
					"JLSJ": this.info.DJLSJ,
					"token": this.token,
					"FORMAT": 2
				}).then(res => {
					if (res.code == '100') {
						res.data.rows.forEach(item => {
							this.hospitalArr.push({
								hospital: item.CSJGBM,
								department: item.CSKSBM,
								doctor: {
									CYSBM: item.CSYSBM,
									CYSXM: ''
								},
							})
						})
						this.getArrangeInfo(res.data.rows[0].CSJGBM);
					}
				}).catch(error => {
					console.log(error)
				});
			},
			getArrangeInfo(str) { // 获取所有医院
				this.$ajax.post('', {
					"MSH.1": "consultantCommon",
					"MSH.2": "queryJGXX",
					"token": this.token,
					"FORMAT": 2
				}).then(res => {
					if (res.code == '100' && res.data.rows.length > 0) {
						let JGarr = res.data.rows.filter(item => {
							return item.CBH == str; // 筛选申请机构的上级机构
						})
						this.ArrangeInfo = [].concat(JGarr);
						JGarr.forEach(item => {
							if (!this.allHos[item.CBH]) {
								this.$set(this.allHos, [item.CBH], item.CMC)
								this.SJJG.push({
									CBH: item.CBH,
									CMC: item.CMC,
								})
							}
						})
					}
				}).catch(error => {
					console.log(error)
				});
			},
			changeHospital(label, val) { // 选择上级机构后
				// 获取会诊科室;
				if (this.HZKS.length == 0) {
					this.ArrangeInfo.forEach(item => {
						if (!this.allKS[item.CKSBH]) {
							this.HZKS.push({
								CKSBH: item.CKSBH,
								CKSMC: item.CKSMC,
							})
							this.$set(this.allKS, [item.CKSBH], item.CKSMC);
						}
						this.$set(this.allDoc, [item.CYSBM], item.CYSMC)
					})
				}
			},
			changeKS(val) {},
			selectDoc(str, index) { // 选择医生
				this.$router.push({
					name: 'selectDoc',
					params: {
						CKSBM: str,
						docIndex: index
					}
				})
			},
			addHospital() { // 添加医院
				let template = {
					hospital: '',
					department: '',
					doctor: {}
				}
				this.hospitalArr.push(template);
			},
			delHospital(index) { // 删除医院
				this.hospitalArr.splice(index, 1)
			},
			saveBtn() {
				this.$validator.validate().then(result => {
					if (result) {
						// 会诊医院信息
						let stringDataArr = [];
						this.hospitalArr.forEach(item => {
							if (item.doctor.CYSBM) {
								stringDataArr.push(`${item.hospital}-${this.allHos[item.hospital]},${item.department}-${this.allKS[item.department]},${item.doctor.CYSBM}-${item.doctor.CYSXM}`)
							} else {
								stringDataArr.push(`${item.hospital}-${this.allHos[item.hospital]},${item.department}-${this.allKS[item.department]},0-医生为空`);
							}
						});
						this.resObj.stringData = stringDataArr.join('~');
						this.$ajax.post('', {
							"MSH.1": "ychz2",
							"MSH.2": "applyArrangeSave",
							"CBH": this.info.CBH,
							"CAPRBM": this.loginInfo.CYSBM, // 安排人编码
							"sqzID": this.resObj.CYSBM, // 申请人编码
							"sqzName": this.resObj.CYSXM, // 申请人姓名
							"CAPR": this.loginInfo.CYSMC, // 安排人姓名
							"CBZ": "", // 备注
							"ILX": this.resObj.ILX, // 会诊类型编码
							"CBH": this.info.CBH,
							"DAPSJ": this.resObj.DAPSJ, // 安排会诊时间
							"NYGFY": this.resObj.NYGFY, // 预估费用
							"NSJFY": this.resObj.NSJFY, // 实际费用
							"CHYSBBM": "", // 会议设备编码
							"CHYSBMC": "", // 会议设备名称
							"SQDSB": "",
							"yljgNum": "1",
							"stringData": this.resObj.stringData, // 会诊医院信息 待传
							"JLSJ": "",
							"token": this.token,
							"FORMAT": 1
						}).then(res => {
							if (res.code == '100') {
								this.$MessageCase.show(res.msg, 'success').then(() => {
									this.$router.push({
										name: 'RCAM2'
									});
								})
							}
						}).catch(error => {
							console.log(error)
						});
					} else {
						this.$root.showTips = true;
					}
				});
			}
		},
		watch: {
			allDoc(val) {
				this.hospitalArr.forEach(item => {
					item.doctor.CYSXM = this.allDoc[item.doctor.CYSBM]
				})
			}
		}
	}
</script>
<style lang='less' scoped>
	.info_check {
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
		p {
			position: absolute;
			left: 0;
			top: 0;
			width: 100px;
			line-height: 40px;
			text-align: left;
			margin: 0 10px;
			overflow: hidden;
		}
		span {
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
	.process {
		position: absolute;
		top: 0;
		right: 0;
		width: 64px;
		height: 64px;
		background: url("~@/assets/imgs/process.png") no-repeat;
		background-size: cover;
	}
	.process_wrap {
		padding-right: 20px;
		width: calc(~"100% - 75px");
		position: absolute;
		top: 8px;
		z-index: 10;
	}
</style>