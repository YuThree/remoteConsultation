<template>
	<div class="cdct_container">
		<XHeader :left-options="{backText: '',preventGoBack: true}" @on-click-back="$router.push({name: 'RCAM1'})">编辑详情
			<span slot="right" @click="saveBtn">保存</span>
		</XHeader>
		<div class="cdct_content cdct_relative">
			<loading ref="loading"></loading>
			<scroll :selectScroll="true" :useTransition="false" ref="scroll">
				<div class="cdct_main cdct_relative">
					<div class="cdct_title title2">患者基本信息</div>
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
					<div class="cdct_inputBox">
						<div class="cdct_info"><span>患者姓名</span></div>
						<input class="cdct_input" disabled v-model="resObj.CXM">
					</div>
					<div class="cdct_inputBox">
						<div class="cdct_info"><span>性&emsp;&emsp;别</span></div>
						<el-select v-model="resObj.IXB">
							<el-option v-for="(item,index) in gender" :key="index" :label="item.val" :value="item.key"></el-option>
						</el-select>
					</div>
					<div class="cdct_inputBox">
						<div class="cdct_info"><span>出生年月</span></div>
						<datetime class="cdct_time" :min-year="1900" v-model="resObj.DCSNY"></datetime>
					</div>
					<div class="cdct_inputBox">
						<div class="cdct_info"><span>年&emsp;&emsp;龄</span></div>
						<input class="cdct_input" style="width: 98px; margin-right: 10px;" name="年龄" v-validate="'numeric'" v-model="resObj.INL">
						<span class="cdct_error">{{verrors.first('年龄')}}</span>
						<el-select v-model="resObj.INLDW" clearable style="width: 60px;">
							<el-option v-for="(item,index) in unit" :key="index" :label="item.val" :value="item.key"></el-option>
						</el-select>
					</div>
					<div class="cdct_inputBox">
						<div class="cdct_info"><span>国&emsp;&emsp;籍</span></div>
						<el-select v-model="resObj.IGJ" clearable filterable>
							<el-option v-for="(item,index) in nationality" :key="index" :label="item.val" :value="item.key"></el-option>
						</el-select>
					</div>
					<div class="cdct_inputBox">
						<div class="cdct_info"><span>民&emsp;&emsp;族</span></div>
						<el-select v-model="resObj.IMZ" clearable filterable>
							<el-option v-for="(item,index) in nation" :key="index" :label="item.val" :value="item.key"></el-option>
						</el-select>
					</div>
					<div class="cdct_inputBox">
						<div class="cdct_info"><span>证件类型</span></div>
						<el-select v-model="resObj.ZJLX" clearable>
							<el-option v-for="(item,index) in cardType" :key="index" :label="item.val" :value="item.key"></el-option>
						</el-select>
					</div>
					<div class="cdct_inputBox">
						<div class="cdct_info"><span>证&ensp;件&ensp;号</span></div>
						<input class="cdct_input" v-model="resObj.CZJH">
					</div>
					<div class="cdct_inputBox">
						<div class="cdct_info"><span>婚姻状况</span></div>
						<el-select v-model="resObj.IHY" clearable>
							<el-option v-for="(item,index) in MaritalStatus" :key="index" :label="item.val" :value="item.key"></el-option>
						</el-select>
					</div>
					<div class="cdct_inputBox">
						<div class="cdct_info"><span>职&emsp;&emsp;业</span></div>
						<el-select v-model="resObj.IZYLB" clearable>
							<el-option v-for="(item,index) in occupation" :key="index" :label="item.val" :value="item.key"></el-option>
						</el-select>
					</div>
					<div class="cdct_inputBox">
						<div class="cdct_info"><span>付费方式</span></div>
						<el-select v-model="resObj.IFFFS" clearable>
							<el-option v-for="(item,index) in payType" :key="index" :label="item.val" :value="item.key"></el-option>
						</el-select>
					</div>
					<div class="cdct_inputBox">
						<div class="cdct_info"><span>患者性质</span></div>
						<el-select v-model="resObj.IBRXZ" clearable>
							<el-option v-for="(item,index) in PatientType" :key="index" :label="item.val" :value="item.key"></el-option>
						</el-select>
					</div>
					<div class="cdct_inputBox cdct_asterisk">
						<div class="cdct_info"><span>就&ensp;诊&ensp;号</span></div>
						<input class="cdct_input" name="就诊号" v-validate="'required|numeric'" v-model="resObj.CJZH">
						<span class="cdct_error">{{verrors.first('就诊号')}}</span>
					</div>
					<div class="cdct_inputBox cdct_asterisk db">
						<div class="cdct_info"><span>居住地址</span></div>
						<input class="cdct_input" name="居住地址" v-validate="'required'" v-model="resObj.CMPH">
						<span class="cdct_error">{{verrors.first('居住地址')}}</span>
					</div>
				</div>
				<div class="cdct_main">
					<div class="cdct_title title3">病例摘要</div>
					<div class="cdct_textarea">
						<div class="cdct_info"><span>患者主述</span></div>
						<x-textarea :max="100" :rows="1" class="spe_textarea" v-model="resObj.CHZZS"></x-textarea>
					</div>
					<div class="cdct_textarea cdct_asterisk">
						<div class="cdct_info"><span>病&emsp;&emsp;史</span></div>
						<x-textarea :max="500" v-model="resObj.CXBS" v-validate="'required'" data-vv-name="病史" @on-blur="$validator.validate('病史')"></x-textarea>
						<span class="cdct_error" style="top: 110px;">{{verrors.first('病史')}}</span>
					</div>
				</div>
				<div class="cdct_main">
					<div class="cdct_title title4">初步诊断</div>
					<div class="cdct_inputBox cdct_asterisk">
						<div class="cdct_info"><span>诊断时间</span></div>
						<datetime class="cdct_time" :min-year="1900" format="YYYY-MM-DD HH:mm" :end-date="getNowFormatDate()" v-model="resObj.DZDSJ" v-validate="'required'" data-vv-name="诊断时间" @on-hide="$validator.validate('诊断时间')" @on-confirm="$validator.validate('诊断时间')"></datetime>
						<span class="cdct_error">{{verrors.first('诊断时间')}}</span>
					</div>
					<div class="cdct_textarea">
						<div class="cdct_info"><span>初步诊断</span></div>
						<x-textarea v-model="resObj.CCBZD" :max="100" :rows="1" class="spe_textarea"></x-textarea>
					</div>
					<div class="cdct_inputBox" style="width: 100%;">
						<div class="cdct_info"><span>疾病编码</span></div>
						<div class="cdct_choose choose1" @click="ICD_show = !ICD_show">编辑疾病编码</div>
					</div>
					<div class="cdct_table spe_table" v-if="ICDArr.length > 0">
						<div class="cdct_thead">
							<div class="cdct_td">疾病编码</div>
							<div class="cdct_td">疾病名称</div>
						</div>
						<div class="cdct_tr" v-for="(item,index) in ICDArr" :key="index">
							<div class="cdct_td">{{item.JBBM}}</div>
							<div class="cdct_td">{{item.JBMC}}</div>
						</div>
					</div>
					<div class="cdct_inputBox" style="width: 100%;">
						<div class="cdct_info"><span>病例资料</span></div>
						<div class="cdct_choose choose2" @click="$router.push({name:'uploadTheCases',params:{info:info,resObj:resObj,systemType:'1'}})">上传病例</div>
						<!-- <div class="Upload_Completed"></div> -->
					</div>
				</div>
				<div class="cdct_main">
					<div class="cdct_title title5">申请信息</div>
					<div class="cdct_inputBox">
						<div class="cdct_info"><span>会诊类型</span></div>
						<el-select v-model="resObj.ILX" clearable>
							<el-option v-for="(item,index) in HZLX" :key="index" :label="item.val" :value="item.key"></el-option>
						</el-select>
					</div>
					<div class="cdct_inputBox">
						<div class="cdct_info"><span>会诊方式</span></div>
						<el-select v-model="resObj.IHZFS" clearable>
							<el-option v-for="(item,index) in HZFS" :key="index" :label="item.val" :value="item.key"></el-option>
						</el-select>
					</div>
					<div class="cdct_inputBox cdct_asterisk">
						<div class="cdct_info"><span>会诊时间</span></div>
						<datetime class="cdct_time" format="YYYY-MM-DD HH:mm" :min-year="1900" :start-date="getNowFormatDate()" v-model="resObj.DBSJ" v-validate="'required'" data-vv-name="会诊时间" @on-hide="$validator.validate('会诊时间')" @on-confirm="$validator.validate('会诊时间')"></datetime>
						<span class="cdct_error">{{verrors.first('会诊时间')}}</span>
					</div>
					<div class="cdct_checkBox">
						<div class="cdct_info"><span>申请类型</span></div>
						<div class="chk_content">
							<div class="cdct_chk cdct_chk_suc" v-for="(item,index) in QQLX" :key="'QQLX'+index">
								<input :id="'QQLX'+index" type="checkbox" :value="item.key" v-model="qqlxCheck">
								<label :for="'QQLX'+index">{{item.val}}</label>
							</div>
						</div>
					</div>
					<div class="cdct_textarea">
						<div class="cdct_info"><span>会诊目的</span></div>
						<x-textarea :max="100" :rows="1" class="spe_textarea" v-model="resObj.CHZMD"></x-textarea>
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
						<div class="cdct_tr" v-for="(item,index) in hospitalArr" :key="'hzyy'+index">
							<div class="cdct_td cdct_relative">
								<el-select v-model="item.hospital" @change="changeHospital" v-validate="'required'" :data-vv-name="'上级会诊医院'+index" @visible-close="$validator.validate('上级会诊医院'+index)">
									<el-option v-for="(item,index) in SJJG" :key="index" :label="item.CMC" :value="item.CBH"></el-option>
								</el-select>
								<span class="cdct_error" style="left:17px; top: 27px;">{{verrors.first('上级会诊医院'+index)}}</span>
							</div>
							<div class="cdct_td cdct_relative">
								<el-select v-model="item.department" :disabled="!item.hospital" v-validate="'required'" :data-vv-name="'会诊科室'+index" @visible-close="$validator.validate('会诊科室'+index)">
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
					<div class="cdct_inputBox cdct_unit unit1">
						<div class="cdct_info"><span>预估费用</span></div>
						<input class="cdct_input" v-model="resObj.NYGFY" name="预估费用" v-validate="'numeric'">
						<span class="cdct_error">{{verrors.first('预估费用')}}</span>
					</div>
				</div>
				<div class="cdct_main">
					<div class="cdct_title title6">申请人信息</div>
					<div class="cdct_inputBox">
						<div class="cdct_info"><span>申请医院</span></div>
						<input class="cdct_input" disabled v-model="resObj.CJGMC">
					</div>
					<div class="cdct_inputBox">
						<div class="cdct_info"><span>申请科室</span></div>
						<input class="cdct_input" disabled v-model="resObj.CKSMC">
					</div>
					<div class="cdct_inputBox">
						<div class="cdct_info"><span>申请医生</span></div>
						<input class="cdct_input" disabled v-model="resObj.CYSXM">
					</div>
				</div>
			</scroll>
		</div>
		<select-modal v-model="selectPatient" width="808px" height="459px" @search="submit">
			<dl class="header vux-1px" slot="header">
				<dt class="head-tr">医院名称</dt>
				<dt class="head-tr">患者姓名</dt>
				<dt class="head-tr" style="flex: 0.5;">性别</dt>
				<dt class="head-tr" style="flex: 0.5;">年龄</dt>
				<dt class="head-tr" style="flex: 1.5;">身份证号</dt>
				<dt class="head-tr">联系电话</dt>
				<dt class="head-tr">患者性质</dt>
			</dl>
			<div class="tbody" slot="body">
				<dl class="tb-tr" v-for="(n) in 10" :key="n">
					<dd class="tb-td"><span>成都第一医院</span></dd>
					<dd class="tb-td"><span>小张</span></dd>
					<dd class="tb-td" style="flex: 0.5;"><span>男</span></dd>
					<dd class="tb-td" style="flex: 0.5;"><span>25</span></dd>
					<dd class="tb-td" style="flex: 1.5;"><span>5107031545446494</span></dd>
					<dd class="tb-td"><span>13712747747</span></dd>
					<dd class="tb-td"><span>测的是</span></dd>
				</dl>
			</div>
		</select-modal>
		<icd-select v-model="ICD_show" @on-ok="selectIcd"></icd-select>
	</div>
</template>

<script>
	import {
		XTextarea
	} from 'vux'
	import selectModal from '@/components/modal/selectModal'
	import IcdSelect from '@/components/ICD_select'
	import processBox from '@/components/processBox' //外部容器
	import processItem from '@/components/processBox/processItem' //每一项
	export default {
		name: 'EditApplication',
		components: {
			XTextarea,
			selectModal,
			IcdSelect,
			processBox,
			processItem
		},
		activated() {
			this.$store.commit('setParensCash', 'RemoteConsultation,EditApplication');
		},
		created(){
			this.$store.commit('setParensCash', 'RemoteConsultation,EditApplication');
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
		mounted() {
			document.body.addEventListener('click', () => {
				this.selectionShow = false;
			}, false)
			if (this.$route.params.info) {
				this.info = this.$route.params.info;
			}
			if (window.localStorage.token) {
				this.token = window.localStorage.token;
			}
			if (window.localStorage.loginInfo) {
				this.loginInfo = JSON.parse(window.localStorage.loginInfo);
			}
			this.initProcess();
			this.init();
			this.qryJGinfo(); // 机构信息查询(会诊医院信息查询)
		},
		data() {
			return {
				gender: this.dictionary.gender,
				unit: this.dictionary.unit,
				nationality: this.dictionary.nationality,
				nation: this.dictionary.nation,
				cardType: this.dictionary.cardType,
				MaritalStatus: this.dictionary.MaritalStatus,
				occupation: this.dictionary.occupation,
				payType: this.dictionary.payType,
				PatientType: this.dictionary.PatientType,
				patientArr: [],
				processInfo: {},
				processShow: false,
				hospitalArr: [],
				ICDArr: [],
				info: {},
				loginInfo: {},
				selectPatient: false,
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
				resObj: {},
				SJJG: [], // 上级机构
				HZKS: [], // 会诊科室
				QQLX: [{
						key: 'IDMHZ',
						val: '点名会诊'
					},
					{
						key: 'ILHHZ',
						val: '联合会诊'
					},
				],
				qqlxCheck: [],
				ICD_show: false,
				allDoc: {}, // 所有医生
				allHos: {}, // 所有机构
				allKS: {}, // 所有科室
				nowPage: 1, // 页码
				showNum: 15, // 每页显示条数
				allPage: 0, // 总页数
				ArrangeInfo: [],
			}
		},
		methods: {
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
			initProcess() {
				this.$ajax.post('', {
					"MSH.1": "consultantCommon",
					"MSH.2": "findXdInfo",
					"CBH": this.info.CBH,
					"time": this.info.DJLSJ,
					"ISQLBBM": "1", // 1远程会诊 2远程影像
					"token": window.localStorage.token,
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
					"MSH.2": "applySelectQryData",
					"CBH": this.info.CBH,
					"IZT": this.info.IZT,
					"token": window.localStorage.token,
					"FORMAT": 1
				}).then(res => {
					this.$refs.loading.hide();
					if (res.code == '100') {
						this.resObj = res.data;
						this.resObj.DCSNY = this.resObj.DCSNY ? this.resObj.DCSNY.split(' ')[0] : '';
						this.resObj.DZDSJ = this.resObj.DZDSJ ? this.resObj.DZDSJ.split('.')[0] : '';
						this.resObj.DBSJ = this.resObj.DBSJ ? this.resObj.DBSJ.split('.')[0] : '';
						// 证件类型
						this.resObj.ZJLX = this.resObj.IZJLX;
						// 疾病编码
						let BM = this.resObj.CICDBM ? this.resObj.CICDBM.split('|') : [];
						let MC = this.resObj.CICDMC ? this.resObj.CICDMC.split('|') : [];
						BM.forEach((item, index) => {
							this.ICDArr.push({
								JBBM: item,
								JBMC: MC[index],
							})
						})
						// 点名会诊
						if (this.resObj.IDMHZ == '1') {
							this.qqlxCheck.push('IDMHZ')
						}
						// 联名会诊
						if (this.resObj.ILHHZ == '1') {
							this.qqlxCheck.push('ILHHZ')
						}
						this.isInit = false;
					}
				}).catch(error => {
					this.$refs.loading.hide();
					console.log(error)
				});
			},
			getAge(birthday) {
				let birthDayTime = new Date(birthday).getTime(); 
				//当前时间 毫秒
				let nowTime = new Date().getTime(); 
				//一年毫秒数(365 * 86400000 = 31536000000)
				return Math.ceil((nowTime - birthDayTime) / 31536000000)
			},
			getPatientType(str) {
				let type = '';
				this.PatientType.forEach(item => {
					if (item.key == str) {
						type = item.val
					}
				})
				return type;
			},
			selectBtn() { // 选择患者
				this.selectPatient = true;
				if (this.patientArr.length == 0) {
					// 初始化患者列表
					this.initPatient();
				}
			},
			initPatient(str) {
				this.$ajax.post('', {
					"MSH.1": "UtilCommon",
					"MSH.2": "SelBR",
					"Name": "consulation",
					"CBRXZ": "2",
					"token": this.token,
					"FORMAT": 2,
					"nowPage": this.nowPage,
					"showNum": this.showNum,
					"SearchSynthesis": str,
				}).then(res => {
					this.$refs.patientModal.finishPullUp();
					if (res.code == '100') {
						this.patientArr = this.patientArr.concat(res.data.rows);
						this.allPage = res.data.allPage;
					}
				}).catch(error => {
					console.log(error)
				});
			},
			patientPullingUp() { // 上拉加载
				if (this.nowPage >= this.allPage) {
					this.$refs.patientModal.finishPullUp(true);
				} else {
					this.nowPage++;
					this.initPatient();
				}
			},
			updatePatient(item) {
				this.selectPatient = false;
				// 点击列表 带上基本信息
				this.$set(this.resObj, 'CXM', item.CBRXM); // 患者姓名
				this.$set(this.resObj, 'IXB', item.CBRXBBM); // 性别编码
				let time = item.DCSNY ? item.DCSNY.split(' ')[0] : '';
				this.$set(this.resObj, 'DCSNY', time); // 出生年月
				this.$set(this.resObj, 'INL', this.getAge(item.DCSNY)); // 年龄
				this.$set(this.resObj, 'IGJ', item.CGJBM); // 国籍编码
				this.$set(this.resObj, 'IMZ', item.CMZBM); // 民族
				this.$set(this.resObj, 'CZJH', item.CZJHM); // 证件类号
				this.$set(this.resObj, 'CSFZ', item.CZJHM); // 身份证号
				this.$set(this.resObj, 'IHY', item.CHYBM); // 婚姻状态编码
				this.$set(this.resObj, 'IZYLB', item.CZYBM); // 职业编码
				this.$set(this.resObj, 'IBRXZ', item.IBRXZ); // 患者性质编码
				this.$set(this.resObj, 'CMPH', item.CDZDQ + item.CDZQX + item.CDZXZ + item.CMPH); // 居住地址
			},
			submit(kw) {
				this.patientArr = [];
				this.initPatient(kw.keyWords);
			},
			selectIcd(arr) {
				this.ICDArr = [].concat(arr);
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
			selectDoc(str, index) { // 选择医生
				if (this.resObj.IDMHZ != '1') {
					this.$MessageCase.show('请先勾选点名会诊', 'error');
					return;
				}
				this.$router.push({
					name: 'selectDoc',
					params: {
						CKSBM: str,
						docIndex: index
					}
				})
			},
			addHospital() { // 添加医院
				if (this.resObj.ILHHZ != '1') {
					this.$MessageCase.show('请先勾选联合会诊', 'error');
					return;
				}
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
						if (this.hospitalArr[0].doctor.CYSBM != '' && this.resObj.IDMHZ != '1') {
							this.$MessageCase.show('请勾选点名会诊', 'error');
							return;
						}else if(this.hospitalArr.length > 1 && this.resObj.ILHHZ != '1'){
							this.$MessageCase.show('请先勾选联合会诊', 'error');
							return;
						}
						this.resObj.CBH = this.info.CBH;
						// 会诊医院信息
						let stringDataArr = [];
						this.hospitalArr.forEach(item => {
							if (item.doctor.CYSBM) {
								stringDataArr.push(`${item.hospital}-${this.allHos[item.hospital]},${item.department}-${this.allKS[item.department]},${item.doctor.CYSBM}-${item.doctor.CYSXM}`)
							} else {
								stringDataArr.push(`${item.hospital}-${this.allHos[item.hospital]},${item.department}-${this.allKS[item.department]},0-医生为空`);
							}
						});
						// 身份证号
						this.resObj.CSFZ = this.resObj.CZJH;
						this.resObj.stringData = stringDataArr.join('~');
						let Obj = {
							"MSH.1": "ychz1",
							"MSH.2": "SaveData",
							"token": this.token
						}
						Obj = Object.assign({}, this.resObj, Obj)
						this.$ajax.post('', Obj).then(res => {
							if (res.code == '100') {
								this.$MessageCase.show(res.msg, 'success').then(() => {
									this.$router.push({
										name: 'RCAM1'
									});
								})
							}
						}).catch(error => {
							console.log(error)
						});
					} else {
						this.$root.showTips = true;
					}
				})
			}
		},
		watch: {
			'resObj.IXB' (value) { // 性别名称
				if (value == '') {
					this.resObj.CXB = '';
				}
				this.gender.forEach(item => {
					if (item.key == value) {
						this.resObj.CXB = item.val;
					}
				})
			},
			'resObj.IGJ' (value) { // 国籍名称
				if (value == '') {
					this.resObj.CGJ = '';
				}
				this.nationality.forEach(item => {
					if (item.key == value) {
						this.resObj.CGJ = item.val;
					}
				})
			},
			'resObj.IMZ' (value) { // 民族
				if (value == '') {
					this.resObj.CMZ = '';
				}
				this.nation.forEach(item => {
					if (item.key == value) {
						this.resObj.CMZ = item.val;
					}
				})
			},
			'resObj.IHY' (value) { // 婚姻状况
				if (value == '') {
					this.resObj.CHY = '';
				}
				this.MaritalStatus.forEach(item => {
					if (item.key == value) {
						this.resObj.CHY = item.val;
					}
				})
			},
			'resObj.IZYLB' (value) { // 职业
				if (value == '') {
					this.resObj.CZY = '';
				}
				this.occupation.forEach(item => {
					if (item.key == value) {
						this.resObj.CZY = item.val;
					}
				})
			},
			'qqlxCheck' (val) {
				this.$set(this.resObj, 'IDMHZ', '0');
				this.$set(this.resObj, 'ILHHZ', '0');
				val.forEach(item => {
					this.$set(this.resObj, item, '1');
				})
			},
			ICDArr(val) {
				let CICDBMArr = [];
				let CICDMCArr = [];
				val.forEach(item => {
					CICDBMArr.push(item.JBBM);
					CICDMCArr.push(item.JBMC);
				})
				this.resObj.CICDBM = CICDBMArr.join('|');
				this.resObj.CICDMC = CICDMCArr.join('|');
			},
			allDoc(val) {
				this.hospitalArr.forEach(item => {
					item.doctor.CYSXM = this.allDoc[item.doctor.CYSBM]
				})
			},
		}
	}
</script>

<style lang="less" scoped>
	.cdct_container {
		.cdct_content {
			.cdct_btn {
				float: right;
				margin: 10px 0 0 10px;
			}
			.cdct_main {
				.spe_table.cdct_table {
					margin-left: 70px;
					.cdct_thead,
					.cdct_tr {
						.cdct_td:last-child {
							max-width: none;
						}
					}
				}
			}
			.title2.cdct_title {
				&:before {
					width: 19px;
					height: 22px;
					background-image: url('~@/assets/imgs/icon2.png');
				}
			}
			.title3.cdct_title {
				&:before {
					width: 20px;
					height: 20px;
					background-image: url('~@/assets/imgs/icon3.png');
				}
			}
			.title4.cdct_title {
				&:before {
					width: 22px;
					height: 22px;
					background-image: url('~@/assets/imgs/icon4.png');
				}
			}
			.title5.cdct_title {
				&:before {
					width: 23px;
					height: 21px;
					background-image: url('~@/assets/imgs/icon5.png');
				}
			}
			.title6.cdct_title {
				&:before {
					width: 23px;
					height: 23px;
					background-image: url('~@/assets/imgs/icon6.png');
				}
			}
			.db.cdct_inputBox {
				width: 492px;
				.cdct_input {
					width: 426px;
				}
			}
			.row.cdct_inputBox {
				width: calc(~'100% - 16px');
				.cdct_input {
					flex: 1;
				}
			}
			.choose1.cdct_choose {
				width: 138px;
				&:before {
					width: 12px;
					height: 13px;
					background-image: url("~@/assets/imgs/choose1.png");
				}
			}
			.choose2.cdct_choose {
				&:before {
					width: 13px;
					height: 14px;
					background-image: url("~@/assets/imgs/choose2.png");
				}
			}
			.process_wrap {
				padding-right: 20px;
				width: calc(~"100% - 75px");
				position: absolute;
				top: 8px;
				z-index: 10;
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
			.Upload_Completed {
				width: 64px;
				height: 20px;
				background: url("~@/assets/imgs/completed.png") no-repeat;
				background-size: contain;
				margin-left: 15px;
				margin-top: 10px;
			}
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
		}
		.vux-1px:before {
			box-sizing: border-box;
			border-bottom: none;
		}
	}
</style>