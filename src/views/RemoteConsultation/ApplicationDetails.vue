<template>
	<div class="cdct_container">
		<XHeader :left-options="{backText: ''}">{{getIZT(info.IZT)}}
			<!-- <span slot="right" class="operation" :class="{active: selectionShow}" @click.stop="selectionShow = !selectionShow">操作</span> -->
			<!-- <animation enter="fadeInDown faster" leave="fadeOut">
						<div v-show="selectionShow" class="selection">
							<div class="vux-1px-b" @click="$router.push({ name:'ViewInformation',params:{'info':info}})">查看资料</div>
							<div class="vux-1px-b" @click="$router.push({name:'ApplicationDetails',params:{'info':info}})">申请详情</div>
							<div class="vux-1px-b" @click="$router.push({name:'ViewRecords',params:{'info':info}})">电子病历</div>
							<template v-if="menuType == '1' || menuType == '3'">
							    	<div class="vux-1px-b" v-show="getBtnIn('110002') && info.IZT == '1'" @click="$router.push({name:'EditApplication',params:{'info':info}})">编辑会诊详情</div>
							    	<div class="vux-1px-b" v-show="getBtnIn('110003') && info.IZT == '1'" @click="cancelmoadle = true">取消会诊详情</div>
							    	<div class="vux-1px-b" v-show="getBtnIn('120004') && info.IZT == '6' && info.BGDSL != ''">查看诊断报告</div>
							    	<div class="vux-1px-b" v-show="getBtnIn('120005') && info.IZT == '6' && info.PJSL != ''">填写会诊评价</div>
							    	<div class="vux-1px-b" v-show="getBtnIn('120006') && info.IZT == '6' && info.PJSL != ''">查看会诊评价</div>
</template>
<template v-if="menuType == '2' || menuType == '4'">
	<div class="vux-1px-b" v-show="getBtnIn('130003') && info.IZT == '1'">
		会诊安排</div>
	<div class="vux-1px-b" v-show="getBtnIn('130004') && info.IZT == '1'">拒绝会诊</div>
	<div class="vux-1px-b" v-show="getBtnIn('140013') && info.IZT == '4' && info.IHZFS == '1'">开始会诊</div>
	<div class="vux-1px-b" v-show="getBtnIn('140004') && (info.IZT == '1' || info.IZT == '4')">编辑会诊申请</div>
	<div class="vux-1px-b" v-show="getBtnIn('140028') && (info.IZT == '5' || info.IZT == '4') && info.ISMANAGER =='1'">邀请医生</div>
	<div class="vux-1px-b" v-show="getBtnIn('140013') && info.IZT == '5' && info.IHZFS == '1'">进入会诊室</div>
	<div class="vux-1px-b" v-show="getBtnIn('140007') && info.IZT == '5' && info.BGDSL == '0'">填写自定义报告</div>
	<div class="vux-1px-b" v-show="getBtnIn('140008') && info.IZT == '5' && info.BGDSL != '0'">编辑自定义报告</div>
	<div class="vux-1px-b" v-show="getBtnIn('140012') && info.IZT == '5'">结束会诊</div>
	<div class="vux-1px-b" v-show="getBtnIn('140010') && info.IZT == '6' && info.PJSL != '0'">查看会诊评价</div>
	<div class="vux-1px-b" v-show="getBtnIn('140011') && info.IZT == '6'">患者随访</div>
</template>
				</div>
			</animation> -->
			
		</XHeader>
		<div class="cdct_content cdct_relative">
			<loading ref="loading"></loading>
			<scroll :selectScroll="true" :useTransition="false" ref="scroll">
				<div class="cdct_main cdct_relative">
					<div class="cdct_title title2">患者基本信息</div>
					<div class="process" @click="processShow = !processShow"></div>
					<!-- 进程条 -->
					<div class="process_wrap" v-if="info.IZT != 2 && info.IZT != 3">
					    <process-box v-model="processShow">
					        <process-item step="1" :done="processInfo.DJLSJ != ''">建立申请单<span slot="time">{{processInfo.DJLSJ}}</span></process-item>
					        <process-item step="2" :done="processInfo.BLSJ != ''">病例资料<span slot="time">{{processInfo.BLSJ}}</span></process-item>
					        <process-item step="3" :done="info.IZT >= 4 && processInfo.DAPSJ != ''">会诊安排<span slot="time">{{processInfo.DAPSJ}}</span></process-item>
					        <process-item step="4" :done="info.IZT >= 5 && processInfo.DBSJ != ''">视频会诊<span slot="time">{{info.IZT >= 5 ? processInfo.DBSJ : ''}}</span></process-item>
					        <process-item step="5" :done="info.IZT >= 5 && processInfo.DBGRQ != ''">专家报告<span slot="time">{{processInfo.DBGRQ}}</span></process-item>
					        <process-item step="6" :done="info.IZT == 6 && processInfo.ENDDATE != ''">会诊结束<span slot="time">{{processInfo.ENDDATE}}</span></process-item>
					    </process-box>
					</div>
					<div class="process_wrap" v-else="">
					    <process-box v-model="processShow">
					        <process-item step="1" :done="processInfo.DJLSJ != ''">建立申请单<span slot="time">{{processInfo.DJLSJ}}</span></process-item>
					        <process-item step="2" :done="processInfo.BLSJ != ''">病例资料<span slot="time">{{processInfo.BLSJ}}</span></process-item>
					        <process-item step="3" v-show="info.IZT == 2" :done="info.IZT == 2">已拒绝<span slot="time">{{processInfo.DAPSJ}}</span></process-item>
					        <process-item step="3" v-show="info.IZT == 3" :done="info.IZT == 3">已取消<span slot="time">{{processInfo.DAPSJ}}</span></process-item>
					    </process-box>
					</div>
					<div class="cdct_inputBox cdct_asterisk">
						<div class="cdct_info"><span>患者姓名</span></div>
						<input class="cdct_input" disabled v-model="resObj.CXM">
					</div>
					<div class="cdct_inputBox">
						<div class="cdct_info"><span>性&emsp;&emsp;别</span></div>
						<input class="cdct_input" disabled v-model="resObj.CXB">
					</div>
					<div class="cdct_inputBox">
						<div class="cdct_info"><span>出生年月</span></div>
						<input class="cdct_input" disabled v-model="resObj.DCSNY">
					</div>
					<div class="cdct_inputBox">
						<div class="cdct_info"><span>年&emsp;&emsp;龄</span></div>
						<input class="cdct_input" style="width: 123px; margin-right: 10px;" disabled v-model="resObj.INL">
						<input class="cdct_input" disabled style="width: 71px;" :value="getVal(dictionary.unit,resObj.INLDW)">
					</div>
					<div class="cdct_inputBox">
						<div class="cdct_info"><span>婚姻状况</span></div>
						<input class="cdct_input" disabled v-model="resObj.CHY">
					</div>
					<div class="cdct_inputBox">
						<div class="cdct_info"><span>证件类型</span></div>
						<input class="cdct_input" disabled :value="getVal(dictionary.cardType,resObj.IZJLX)">
						<!-- getVal -->
					</div>
					<div class="cdct_inputBox">
						<div class="cdct_info"><span>证&ensp;件&ensp;号</span></div>
						<input class="cdct_input" disabled v-model="resObj.CZJH">
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
					<div class="cdct_title title3">病例摘要</div>
					<div class="cdct_inputBox" style="display: flex; width: 100%; margin-right: 25px;">
						<div class="cdct_info"><span>患者主述</span></div>
						<input class="cdct_input" >
					</div>
					<div class="cdct_textarea">
						<div class="cdct_info"><span>病&emsp;&emsp;史</span></div>
						<x-textarea :max="500" readonly v-model="resObj.CXBS"></x-textarea>
					</div>
				</div>
				<div class="cdct_main">
					<div class="cdct_title title4">初步诊断</div>
					<div class="cdct_inputBox">
						<div class="cdct_info"><span>诊断时间</span></div>
						<input class="cdct_input" disabled v-model="resObj.DZDSJ">
					</div>
					<div class="cdct_inputBox" style="display: flex; width: 100%; margin-right: 25px;">
						<div class="cdct_info"><span>初步诊断</span></div>
						<input class="cdct_input" disabled v-model="resObj.CCBZD" style="flex: 1;">
					</div>
					<div class="cdct_inputBox" style="width: 100%;"  v-if="ICDArr.length > 0">
						<div class="cdct_info"><span>疾病编码</span></div>
						<div class="cdct_table spe_table" style="margin-left: 0; margin-right: 0;">
							<div class="cdct_thead">
								<div class="cdct_td">疾病编码</div>
								<div class="cdct_td">疾病名称</div>
							</div>
							<div class="cdct_tr" v-for="(item,index) in ICDArr" :key="'icd' + index">
								<div class="cdct_td">{{item.JBBM}}</div>
								<div class="cdct_td">{{item.JBMC}}</div>
							</div>
						</div>
					</div>
					
					<div class="cdct_inputBox">
						<div class="cdct_info"><span>病例资料</span></div>
						<div class="cdct_choose spe" @click="$router.push({name:'MedicalRecords',params:{info:info,resObj:resObj}})">病历中心</div>
					</div>

				</div>
				<div class="cdct_main">
					<div class="cdct_title title5">申请信息</div>
					<div class="cdct_inputBox">
						<div class="cdct_info"><span>会诊类型</span></div>
						<input class="cdct_input" disabled :value="getVal(HZLX,resObj.ILX)">
					</div>
					<div class="cdct_inputBox">
						<div class="cdct_info"><span>会诊方式</span></div>
						<input class="cdct_input" disabled :value="getVal(HZFS,resObj.IHZFS)">
					</div>
					<div class="cdct_inputBox">
						<div class="cdct_info"><span>会诊时间</span></div>
						<input class="cdct_input" disabled v-model="resObj.DBSJ">
					</div>
					<div class="cdct_checkBox">
						<div class="cdct_info" ><span>申请类型</span></div>
						<div class="chk_content">
							<div class="cdct_chk cdct_chk_suc" v-for="(item,index) in QQLX" :key="'QQLX'+index">
								<input :id="'QQLX'+index" type="checkbox" :value="item.key" v-model="qqlxCheck" disabled>
								<label :for="'QQLX'+index">{{item.val}}</label>
							</div>
						</div>
					</div>
					<div class="cdct_inputBox" style="display: flex; width: 100%; margin-right: 25px;">
						<div class="cdct_info"><span>会诊目的</span></div>
						<input class="cdct_input" disabled style="flex: 1;" v-model="resObj.CHZMD">
					</div>
					<div class="cdct_inputBox" style="width: 100%;" v-if="hospitalArr.length > 0">
						<div class="cdct_info"><span>会诊医院</span></div>
						<div class="cdct_table spe_table" style="margin-left: 0; margin-right: 0;">
							<div class="cdct_thead">
								<div class="cdct_td">上级会诊医院</div>
								<div class="cdct_td">会诊科室</div>
								<div class="cdct_td">会诊医生</div>
							</div>
							<div class="cdct_tr" v-for="(item,index) in hospitalArr" :key="'hzyy'+index">
								<div class="cdct_td">{{item.hospital}}</div>
								<div class="cdct_td">{{item.department}}</div>
								<div class="cdct_td">{{item.doctor}}</div>
							</div>
						</div>
					</div>
					
					<div class="cdct_inputBox cdct_unit unit1">
						<div class="cdct_info"><span>预估费用</span></div>
						<input class="cdct_input" disabled v-model="resObj.NYGFY">
					</div>
				</div>
				<div class="cdct_main" v-if="info.IZT == '2'">
					<div class="cdct_inputBox" style="display: flex; width: 100%; margin-right: 25px; margin-bottom: 0;">
						<div class="cdct_info"><span>拒绝原因</span></div>
						<input class="cdct_input" disabled style="flex: 1;" v-model="resObj.CYY">
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

		<modal type="1" v-model="cancelmoadle" title="取消申请" :width="'358px'" :height="'250px'" @on-ok="cancelQY">
			<div class="y_modalBox" style="text-align:center;">
				确定要取消患者 <span style="color:#0096ff">{{resObj.CXM}}</span> 的会诊申请吗？
			</div>
		</modal>
		
	</div>
</template>

<script>
	import {
		XTextarea
	} from 'vux'
	import Animation from '@/components/animation'
	import processBox from '@/components/processBox' //外部容器
	import processItem from '@/components/processBox/processItem' //每一项
	import Modal from '@/components/modal'
	export default {
		name: 'ApplicationDetails',
		components: {
			XTextarea,
			Animation,
			processBox,
			processItem,
			Modal
		},
		mounted() {
			document.body.addEventListener('click', () => {
				this.selectionShow = false;
			}, false)
			if (this.$route.params.info) {
				this.info = this.$route.params.info;
				window.localStorage.info = JSON.stringify(this.info);
			} else {
				this.info = JSON.parse(window.localStorage.info);
			}
			this.initProcess();
			this.init();
		},
		data() {
			return {
				cancelmoadle: false,
				info: '',
				processInfo: {},
				menuType: '',
				resObj: {},
				ICDArr: [],
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
				TEST: '',
				qqlxCheck: [],
				selectionShow: false,
				QQLX: [{
						key: '1',
						val: '点名会诊'
					},
					{
						key: '2',
						val: '联名会诊'
					},
				],
				processShow: false,
				hospitalArr: [],
			}
		},
		methods: {
			cancelQY: function() { // 取消申请
				this.$ajax.post('', {
					'MSH.1': 'ychz1',
					'MSH.2': 'updateState',
					'CBH': this.info.CBH, //拒绝申请单编号
					'IZT': '3', //修改后状态
					'JLSJ': this.info.DJLSJ, //创建时间
					'FORMAT': 2,
					'token': window.localStorage.token,
				}).then(res => {
					if (res.code == 100) {
						this.$MessageCase.show('取消成功', 'success');
					}
				}).catch(error => {
					console.log(error);
				})
				//取消申请
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
					if (res.code == '100') {
						this.$refs.loading.hide();
						this.resObj = res.data;
						this.resObj.DCSNY = this.resObj.DCSNY ? this.resObj.DCSNY.split(' ')[0] : '';
						this.resObj.DZDSJ = this.resObj.DZDSJ ? this.resObj.DZDSJ.split('.')[0] : '';
						this.resObj.DBSJ = this.resObj.DBSJ ? this.resObj.DBSJ.split('.')[0] : '';
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
							this.qqlxCheck.push('1')
						}
						// 联名会诊
						if (this.resObj.ILHHZ == '1') {
							this.qqlxCheck.push('2')
						}
						// 会诊医院信息
						// {hospital:'',department:'',doctor:''}
						let hospitalArr = this.resObj.ZJXX.split(',');
						hospitalArr.forEach(item => {
							let arr = item.split('|');
							this.hospitalArr.push({
								hospital: arr[0],
								department: arr[1],
								doctor: arr[2]
							});
						})
					}
				}).catch(error => {
					this.$refs.loading.hide();
					console.log(error)
				});
			},
			getBtnIn(x) { //按钮权限判断
				let btnArry = localStorage.btnArry.split(',')
				return btnArry.includes(x)
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
			getVal(arr, key) {
				let str = '';
				arr.forEach(item => {
					if (item.key == key) {
						str = item.val;
					}
				})
				return str;
			},
			getIZT(i) {
				switch (i) {
					case '1':
						return '待审核';
					case '2':
						return '已拒绝';
					case '3':
						return '已取消';
					case '4':
						return '待会诊';
					case '5':
						return '会诊中';
					case '6':
						return '已结束';
				}
			}
		},
	}
</script>

<style lang="less" scoped>
	.cdct_container {
		.operation {
			display: inline-block;
			width: 100%;
			height: 100%;
			&:after {
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
		.active.operation {
			&:after {
				transform: rotate(180deg);
			}
		}
		.selection {
			position: absolute;
			padding: 0 15px;
			height: auto;
			background: #5F7397;
			border-radius: 3px;
			top: 40px;
			right: 2px;
			box-shadow: 0 0 8px rgba(0, 0, 0, .2);
			transition: all .2s;
			z-index: 1;
			&:after {
				content: '';
				position: absolute;
				width: 0;
				height: 0;
				left: 50%;
				top: -16px;
				border-top: 8px solid transparent;
				border-bottom: 8px solid #5F7397;
				border-left: 8px solid transparent;
				border-right: 8px solid transparent;
			}
			div {
				text-align: center;
				width: 100px;
				padding: 2px 0;
				font-size: 1.4rem;
				color: #fff;
			}
		}
		.cdct_content {
			.cdct_main {
				.spe_table.cdct_table {
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
					width: 422px;
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
			.spe.cdct_choose {
				&:before {
					width: 0;
					height: 0;
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
		}
	}
</style>