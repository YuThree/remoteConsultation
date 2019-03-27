<template>
	<div :ref="'aaa'+1" class="cdct_container cdct_right">
		<loading ref="loading"></loading>
		<div class="cdct_content cdct_relative">
			<div class="cdct_operation" style="margin-bottom:10px;">
				申请管理(管理端)
				<div class="y_space">
					<div class="y_search cdct_relative">
						<input class="" type="search" placeholder="会诊编号/患者姓名、机构名称" v-model="search" @keyup.enter="pullingDown">
						<span class="y_searchIco" @click="pullingDown"></span>
					</div>
					<div class="y_screening" @click="rsShow=!rsShow">筛选</div>
				</div>
			</div>
			<!-- 筛选 -->
			<filter-modal ref="filterModal" v-model="rsShow" :filterLists="filterLists" :top="52" @complete="complete" :startTime="startTime" :endTime="endTime"></filter-modal>
			<scroll ref="scroll1" :data="data" :selectScroll="true" :useTransition="false" :pullUpLoad="true" @pullingUp="pullingUp" :pullDownRefresh="{stop:'80'}" @pullingDown="pullingDown">
				<div class="cdct_main cdct_relative">
					<!-- y_cardBox 的 class 紧急图标加 emergency   
																																			状态加 class   
																																			 待审核 pendingAudit   
																																			 已拒绝 refuse  
																																			 已取消 cancel
																																			 待会诊	wConsultation
																																			 诊断中	diagnosis
																																			 已结束 over
																																			 ·······等-->
					<div class="y_cardBox " v-for="(i,index) in data" :key="index" :class="{'pendingAudit':i.IZT == 1,'refuse':i.IZT == 2,'cancel':i.IZT == 3,'wConsultation':i.IZT == 4,'diagnosis':i.IZT == 5,'over':i.IZT == 6,'emergency':i.ILX == 1}">
						<div class="y_type">{{types(i.IZT)}}</div>
						<div class="y_chooseBtn">
							<span @click="$refs['mes'+index][0].show()">···</span>
							<message-box :ref="'mes'+index" offsetLeft="-165px" offsetTop="-38px" width="156px" maxHeight="268px">
								<div class="y_ctrlBox">
									<span class="ckzl" @click="$router.push({ name:'ViewInformation',params:{info:i}})">查看资料</span>
									<span class="sqxq" @click="$router.push({name:'ApplicationDetails',params:{info:i}})">申请详情</span>
									<span class="dzbl" @click="$router.push({name:'ViewRecords',params:{info:i}})">电子病历</span>
									<span class="jjhz" @click="$refs['mes'+index][0].show();modle('refuse',index)" v-show="getBtnIn('130004')&&i.IZT == 1">拒绝会诊</span>
									<span class="hzap" @click="$router.push({name:'ConsultationArrange',params:{info:i}})" v-show="getBtnIn('130003')&&i.IZT == 1">会诊安排</span>
								</div>
							</message-box>
						</div>
						<div class="y_emergency"></div>
						<div class="y_img"><img src="~imgs/default_user.png" alt=""></div>
						<div class="y_banner"></div>
						<div class="y_content">
							<div class="y_row">
								<div class="y_title">{{i.CYSXM}}</div>
							</div>
							<div class="y_row">
								<div class="y_hosptalSmall">{{i.CJGMC}}</div>
							</div>
							<div class="y_hr"></div>
							<div class="y_row">
								<div class="y_inforleft">上级医院：</div>
								<div class="y_inforright">{{i.CSJGMC}}</div>
							</div>
							<div class="y_row">
								<div class="y_inforleft">申请时间：</div>
								<div class="y_inforright">{{i.DSQRQ?i.DSQRQ.split('.')[0]:''}}</div>
							</div>
							<div class="y_row">
								<div class="y_inforleft">患者姓名：</div>
								<div class="y_inforright">{{i.CXM}}</div>
							</div>
							<div class="y_row">
								<div class="y_inforleft">性&emsp;&emsp;别：</div>
								<div class="y_inforright">{{i.CXB}}</div>
							</div>
							<div class="y_row">
								<div class="y_inforleft">会诊方式：</div>
								<div class="y_inforright">{{getFS(i.IHZFS)}}</div>
							</div>
						</div>
					</div>
				</div>
			</scroll>
			<modal type="1" v-model="cancelmoadle" title="取消申请" :width="'358px'" :height="'250px'" @on-ok="cancelQY">
				<div class="y_modalBox" style="text-align:center;">
					确定要取消患者 <span style="color:#0096ff">万宝路</span> 的会诊申请吗？
				</div>
			</modal>
			<modal type="1" v-model="refusemoadle" title="拒绝会诊
																								" :width="'358px'" :height="'320px'" @on-ok="refuseQY">
				<div class="y_modalBox">
					<div class="cdct_textarea" style="margin:0">
						<div class="cdct_info"><span>拒绝原因:</span></div>
					</div>
					<x-textarea v-model="refuseText" :max="50" :rows="3" class="spe_textarea" style="border: 1px solid #ccc;border-radius: 5px;" placeholder="请填写拒绝原因"></x-textarea>
				</div>
			</modal>
			<div class="error" v-if="nodata">暂无数据</div>
		</div>
	</div>
</template>

<script>
	import filterModal from '@/components/filterModal'
	import messageBox from '@/components/messageBox'
	import Modal from '@/components/modal'
	import {
		XTextarea
	} from 'vux'
	import {
		setTimeout
	} from 'timers';
	export default {
		name: 'NewApplication',
		components: {
			XTextarea,
			filterModal,
			messageBox,
			Modal
		},
		created() {
			this.setTime();
		},
		data() {
			return {
				filterLists: [{
					title: '处理状态',
					mainKey: 'CLZTTP',
					option: [{
						item: '待审核',
						key: '1',
						// choose:true,  //默认选中
					}, {
						item: '已拒绝',
						key: '2'
					}, {
						item: '已取消',
						key: '3'
					}],
				}], //筛选列表
				rsShow: false, //控制展示筛选 
				cancelmoadle: false, //取消申请弹框
				refusemoadle: false, //拒绝会诊弹框
				ctrlIndex: 0, //取消/拒绝  操作对象的数组下标
				startTime: '',
				endTime: '',
				pageSize: 18,
				pageIndex: 1,
				nodata: false,
				search: '', //查询框
				IZT: '-1', //处理状态code  
				data: [], //卡片数据数组
				allpage: 1, //总页数
				refuseText: '', //拒绝原因文字
			}
		},
		mounted() {
			this.$refs.loading.show('加载中...');
			this.getParams();
		},
		methods: {
			getParams() { //判断是否来自首页  改变默认筛选条件
				if (this.$route.params && this.$route.params.workstation == 'true') {
					this.filterLists[0].option[0].choose = true;
					this.$nextTick(() => {
						this.$refs.filterModal.complete();
					})
				} else {
					this.initData();
				}
			},
			//按钮权限判断
			getBtnIn(x) {
				let btnArry = localStorage.btnArry.split(',');
				return btnArry.includes(x)
			},
			//加载数据
			initData: function() {
				this.$ajax.post('', {
					'MSH.1': 'ychz2',
					'MSH.2': 'applyManageQryData',
					'pageNum': this.pageIndex,
					'pageSize': this.pageSize,
					'CBH': '',
					'CXM': this.search, //查询关键词
					'IZT': this.IZT, //处理状态code
					'qryStartTime': this.startTime,
					'qryEndTime': this.endTime,
					'flag': 'ychzgly',
					'FORMAT': 2,
					'token': localStorage.token,
				}).then(re => {
					this.$refs.loading.hide();
					console.log(re);
					if (re.data.rows && re.data.rows.length > 0) {
						this.nodata = false;
						let sjarry = ['DBSJ', 'DAPSJ', 'DJLSJ', 'DSQRQ', 'DCSNY', 'DESJ'];
						re.data.rows.forEach(element => { //清除所有时间格式.0
							sjarry.forEach(name => {
								element[name] = element[name] ? element[name].split('.0')[0] : '';
							});
						});
						if (this.pageIndex == 1) { //如果第一页
							this.data = re.data.rows;
							this.allpage = re.data.allPage;
						} else {
							this.data = this.data.concat(re.data.rows)
						}
					} else {
						this.data = [];
						this.nodata = true;
					}
					//设置总页数   if pageindex=1
					this.$refs.scroll1.finishPullUp();
					this.$refs.scroll1.finishPullDown();
				}).catch(error => {
					this.$refs.loading.hide();
					this.data = [];
					this.nodata = true;
					this.$refs.loading.hide();
					console.log(error);
				});
			},
			//下拉 刷新  搜索可以直接用
			pullingDown() {
				this.data = [];
				this.pageIndex = 1;
				this.initData();
			},
			//上拉加载 下一页
			pullingUp() {
				if (this.allpage <= this.pageIndex) { //是否最后一页
					this.$refs.scroll1.finishPullUp(true);
					return false;
				}
				this.pageIndex++;
				this.initData();
			},
			types(i) {
				//待审核 pendingAudit   已拒绝 refuse   已取消 cancel  待会诊	wConsultation  诊断中	diagnosis  已结束 over
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
						return '诊断中';
					case '6':
						return '已结束';
				}
			},
			getFS(i) {
				switch (i) {
					case '2':
						return '离线方式';
					case '1':
						return '交互方式';
						break;
					default:
						break;
				}
			},
			//按钮弹框
			modle: function(type, index) {
				let _this = this;
				_this.ctrlIndex = index; //操纵项下标
				switch (type) {
					case 'cancel': //取消申请弹框
						_this.cancelmoadle = !_this.cancelmoadle;
						break;
					case 'refuse': //拒绝会诊弹框
						_this.refusemoadle = !_this.refusemoadle;
						break;
					default:
						break;
				}
			},
			cancelQY: function() {
				console.log('取消申请');
				//取消申请
			},
			refuseQY: function() {
				this.$ajax.post('', {
					'MSH.1': 'ychz2',
					'MSH.2': 'refuseSave',
					'CBH': this.data[this.ctrlIndex].CBH, //拒绝申请单编号
					'JJYY': this.refuseText, //拒绝原因
					'JLSJ': this.data[this.ctrlIndex].DJLSJ, //创建时间
					'FORMAT': 2,
					'token': localStorage.token,
				}).then(re => {
					console.log(re);
					if (re.code == 100) {
						this.$MessageCase.show('操作成功', 'success');
						this.pullingDown(); //刷新
					} else {
						console.log('拒绝请求失败');
					}
				}).catch(error => {
					console.log(error);
				})
				console.log('拒绝');
				//拒绝
			},
			//筛选完成 
			complete: function(re) {
				console.log(re);
				if (re.CLZTTP) {
					this.IZT = re.CLZTTP;
				} else {
					this.IZT = -1;
				}
				this.startTime = re.startTime ? re.startTime : '';
				this.endTime = re.endTime ? re.endTime : '';
				this.pullingDown();
				console.log('筛选完成');
			},
			//设置筛选默认时间段
			setTime: function() {
				let date = new Date();
				var m = (date.getMonth() + 1 + '').padStart(2, 0);
				var d = (date.getDate() + '').padStart(2, 0);
				this.endTime = date.getFullYear() + '-' + m + '-' + d;
				let startDate = new Date(date.getTime() - 1000 * 60 * 60 * 24 * 365);
				this.startTime = startDate.getFullYear() + '-' + (startDate.getMonth() + 1 + '').padStart(2, 0) + '-' + (startDate.getDate() + '').padStart(2, 0);
				this.$nextTick(() => {
					this.$refs.filterModal.startTime = this.startTime;
					this.$refs.filterModal.endTime = this.endTime;
				})
			}
		}
	}
</script>

<style lang="less">
	@import '~@/assets/css/managementIcon.less';
</style>
<style lang="less" scoped>
	@imagesin: "../../assets/imgs";
	@color1: #19293F;
	.cdct_container {
		.cdct_content {
			height: 100%;
			padding: 0;
			.cdct_operation {
				color: #3F4B5D;
				.y_space {
					width: 374px;
					float: right;
					display: flex;
					align-items: center;
					.y_search {
						margin-right: 16px;
						width: 310px;
						height: 30px;
						border-radius: 15px;
						vertical-align: middle;
						padding: 0 15px;
						overflow: hidden;
						border: 1px solid #CED7E3;
						input {
							width: calc(~"100% - 25px");
							float: left;
							height: 100%;
							border: none;
							outline: none;
							line-height: 30px;
							font-size: 13px;
							font-weight: normal;
						}
						.y_searchIco {
							height: 27px;
							position: absolute;
							top: 0;
							right: 0;
							width: 38px;
							background: url("~imgs/search.png") no-repeat 50% 50%;
							background-size: 18px 18px;
						}
					}
					.y_screening {
						color: @color1;
						&:after {
							content: '';
							display: inline-block;
							width: 15px;
							height: 18px;
							background: url("~imgs/iconScreening.png") no-repeat;
							background-size: cover;
							vertical-align: middle;
							margin-left: 2px;
						}
					}
				}
			}
		}
		.cdct_main {
			background: transparent;
			padding: 0; 
			width: 100%;
			display: flex;
			flex-wrap: wrap; 
			.y_cardBox {
				width: calc(~"(100% - 20px)/3"); 
				height: 305px;
				background: rgba(255, 255, 255, 1);
				margin: 0 10px 10px 0;
				position: relative;
				overflow: hidden;
				&:nth-of-type(3n) {
					margin-right: 0;
				}
				.y_type {
					font-size: 12px;
					line-height: 16px;
					height: 18px;
					width: 76px;
					transform: rotate(-45deg);
					position: absolute;
					top: 10px;
					left: -19px;
					text-align: center;
					color: white;
				}
				.y_chooseBtn {
					position: absolute;
					top: 0;
					right: 14px;
					color: white;
					font-size: 30px;
					line-height: 50px;
				}
				.y_banner {
					height: 51px;
					width: 100%;
					background: url("~imgs/iconCardBg.png") no-repeat;
					background-size: cover;
				}
				.y_img {
					position: absolute;
					top: 18px;
					left: 50%;
					margin-left: -33px;
					width: 66px;
					height: 66px;
					border-radius: 50%;
					overflow: hidden;
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
				.y_emergency {
					display: none;
					position: absolute;
					top: 47px;
					right: 16px;
					width: 71px;
					height: 64px;
					background: url("~imgs/emergencyicon.png") no-repeat center center;
					background-size: 63px 50px;
				}
				.y_content {
					padding: 38px 26px 0 21px;
					.y_row {
						line-height: 26px;
						text-align: center;
						width: 100%;
						overflow: hidden;
						white-space: nowrap;
						text-overflow: ellipsis;
						.y_title {
							color: #19293F;
							font-size: 15px;
							font-weight: 600;
						}
						.y_hosptalSmall {
							color: #9BA8C2;
							font-size: 12px;
						}
						.y_inforleft {
							color: #9BA8C2;
							font-size: 13px;
							width: 87px;
							text-align: right;
							float: left;
						}
						.y_inforright {
							color: #5F7397;
							float: left;
							width: calc(~"100% - 87px");
							font-size: 13px;
							text-align: left;
							overflow: hidden;
							white-space: nowrap;
							text-overflow: ellipsis;
						}
					}
					.y_hr {
						border-bottom: dashed 1px #AFBED4;
						height: 10px;
						margin-bottom: 10px;
					}
				}
			}
			.y_cardBox.emergency {
				.y_emergency {
					display: inline-block;
				}
			}
			.y_cardBox.pendingAudit {
				//待审核
				.y_type {
					background: #866ae2;
				}
			}
			.y_cardBox.refuse {
				//已拒绝
				.y_type {
					background: #e86453;
				}
			}
			.y_cardBox.cancel {
				//已取消
				.y_type {
					background: #ed9d05;
				}
			}
			.y_cardBox.wConsultation {
				//待会诊
				.y_type {
					background: #ff7800;
				}
			}
			.y_cardBox.diagnosis {
				//诊断中
				.y_type {
					background: #00bc44;
				}
			}
			.y_cardBox.over {
				//已结束
				.y_type {
					background: #797979;
				}
			}
		}
		.wrapper {
			height: calc(~"100% - 70px");
		}
		.y_ctrlBox {
			padding: 0 20px;
			overflow: auto;
			span {
				color: #ffffff;
				float: left;
				list-style: none;
				width: 100%;
				text-indent: 31px;
				line-height: 44px;
				border-bottom: 1px solid rgba(255, 255, 255, 0.24);
				position: relative;
				&:last-child {
					border-bottom: none;
				}
				&:before {
					content: '';
					position: absolute;
					left: 0;
					top: 0;
					height: 44px;
					width: 21px;
					display: inline-block;
				}
			}
			span.sqxq {
				//申请详情
				&:before {
					background: url("~imgs/icon_sqxq.png") center center no-repeat;
					background-size: 19px auto;
				}
			}
			span.bjxq {
				//编辑详情
				&:before {
					background: url("~imgs/icon_bjxq.png") center center no-repeat;
					background-size: 16px auto;
				}
			}
			span.dzbl {
				//电子病历
				&:before {
					background: url("~imgs/icon_dzbl.png") center center no-repeat;
					background-size: 19px auto;
				}
			}
			span.qxsq {
				//取消申请
				&:before {
					background: url("~imgs/icon_qxsq.png") center center no-repeat;
					background-size: contain;
				}
			}
		}
		.error {
			background: url("~imgs/nodataNow.png") center center no-repeat;
		}
	}
</style>
