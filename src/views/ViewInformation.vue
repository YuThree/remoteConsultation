<template>
	<div class="cdct_container">
		<XHeader :left-options="{backText: ''}">查看资料
		</XHeader>

		<div class="tab">
			<p class="tabBtn" @click="tabChange('1')" :class="tabIndex == '1' ? 'chose':'notChose'">病历资料</p>
			<p class="tabBtn" @click="tabChange('2')" :class="tabIndex == '2' ? 'chose':'notChose'">影像资料</p>
			<p class="tabBtn" @click="tabChange('3')" :class="tabIndex == '3' ? 'chose':'notChose'">心电资料</p>
			<span class="border" ref="tabBorder"></span>
		</div>
		<loading ref="loading"></loading>
		<div style="width:100%;height:700px;padding:12px;" v-show="tabIndex == 1">

		<div class="error" v-if="nodataA">暂无数据</div>

			<div class="table-wr">
				<dl class="header" slot="header">
					<dt class="head-tr" style="flex:1;">病历类型</dt>
					<dt class="head-tr" style="flex:2;">目录</dt>
					<dt class="head-tr" style="flex:2;">文件名称</dt>
					<dt class="head-tr" style="flex:1;">上传姓名</dt>
					<dt class="head-tr" style="flex:1;">文件大小</dt>
					<dt class="head-tr" style="flex:2;">上传时间</dt>
					<dt class="head-tr">操作</dt>
				</dl>
				<div style="height:calc(100% - 60px);position:relative;">
					<Scroll :data="listA" ref="scroll0" :pullUpLoad="true" style="height:calc(100% - 25px);width:100%;" :pullDownRefresh="{stop:80}" @pullingDown="pullingDownA">
						<div class="content">
							<div class="tbody" slot="body">
								<dl class="tb-tr" v-for="(i,index) in listA" :key="index+'a'">
									<dd class="tb-td" style="flex:1;">{{i.BLLX}}</dd>
									<dd class="tb-td" style="flex:2;">{{i.CURL}}</dd>
									<dd class="tb-td" style="flex:2;">{{i.CMC}}</dd>
									<dd class="tb-td" style="flex:1;">{{i.CYSMC}}</dd>
									<dd class="tb-td" style="flex:1;">{{i.CSIZE?i.CSIZE+'MB':''}}</dd>
									<dd class="tb-td" style="flex:2;">{{i.DSCRQ?i.DSCRQ.split('.')[0]:''}}</dd>
									<dd class="tb-td cbtn"><i class="iconView"></i><span class="btnView" @click="showOrdown(i.CURL)">查看</span></dd>
								</dl>
							</div>
						</div>
					</scroll>
				</div>
			</div>
		</div>
		<div style="width:100%;height:700px;padding:12px;" v-show="tabIndex == 2">
			<div class="table-wr">
				<dl class="header" slot="header">
					<dt class="head-tr" style="flex:1;">检查时间</dt>
					<dt class="head-tr" style="flex:1;">检查医院</dt>
					<dt class="head-tr" style="flex:1;">检查项目</dt>
					<dt class="head-tr">操作</dt>
				</dl>
				<div style="height:calc(100% - 60px);position:relative;">
					<Scroll :data="listA" ref="scroll0" :pullUpLoad="true" style="height:calc(100% - 25px);width:100%;" :pullDownRefresh="{stop:80}" @pullingDown="pullingDownA">
						<div class="content">
							<div class="tbody" slot="body">
								<dl class="tb-tr" v-for="(n) in 15" :key="n">
									<dd class="tb-td" style="flex:1;"><span>2018-12-14 10:34</span></dd>
									<dd class="tb-td" style="flex:1;"><span>市二医院</span></dd>
									<dd class="tb-td" style="flex:1;"><span>CT</span></dd>
									<dd class="tb-td"><i class="iconView"></i><span class="btnView" @click.stop="showOrdown">查看</span></dd>
								</dl>
							</div>
						</div>
					</scroll>
				</div>
			</div>
		</div>
		<div style="width:100%;height:700px;padding:12px;" v-show="tabIndex == 3">
			<div class="table-wr">
				<dl class="header" slot="header">
					<dt class="head-tr" style="flex:1;">检查时间</dt>
					<dt class="head-tr" style="flex:1;">检查医院</dt>
					<dt class="head-tr" style="flex:1;">检查类型</dt>
					<dt class="head-tr" style="flex:1;">有无异常</dt>
					<dt class="head-tr" style="flex:2;">临床诊断</dt>
					<dt class="head-tr">操作</dt>
				</dl>
				<div style="height:calc(100% - 60px);position:relative;">
					<Scroll :data="listA" ref="scroll0" :pullUpLoad="true" style="height:calc(100% - 25px);width:100%;" :pullDownRefresh="{stop:80}" @pullingDown="pullingDownA">
						<div class="content">
							<div class="tbody" slot="body">
								<dl class="tb-tr" v-for="(n) in 15" :key="n">
									<dd class="tb-td" style="flex:1;"><span>住院</span></dd>
									<dd class="tb-td" style="flex:1;"><span>0001</span></dd>
									<dd class="tb-td" style="flex:1;"><span>心电图照片</span></dd>
									<dd class="tb-td" style="flex:1;"><span>秦仲海</span></dd>
									<dd class="tb-td" style="flex:2;"><span>2018-12-14 10:34</span></dd>
									<dd class="tb-td"><i class="iconView"></i><span class="btnView">查看</span></dd>
								</dl>
							</div>
						</div>
					</scroll>
				</div>
			</div>
		</div>
		<div v-transfer-dom>
			<previewer :list="imgarry" ref="previewer"></previewer>
		</div>
	</div>
</template>

<script>
	import {
		Previewer,
		TransferDom
	} from 'vux'
	export default {
		components: {
			Previewer
		},
		directives: {
			TransferDom
		},
		data() {
			return {
				TEST: '',
				tabIndex: '1',
				listA: [], //病历资料
				nodataA: false, //病历资料有无数据
				CQYID: '', //患者ID
				CSQDBH: '', //申请单编号
				imgarry: [],
			}
		},
		mounted() {
			this.getParams();
			this.initA();
		},
		methods: {
			//获取上页传递参数 并设置
			getParams() {
				console.log(this.$route.params.info);
				if (this.$route.params.info) {
					this.CQYID = this.$route.params.info.CQYID || this.$MessageCase.show('患者ID：CQYID没得', 'error'); //患者ID
					this.CSQDBH = this.$route.params.info.CBH || this.$MessageCase.show('申请单编号：CBH没得', 'error'); //申请单编号
				} else {
					this.$MessageCase.show('info没有 打开方式不对', 'error');
				}
			},
			//页签改变
			tabChange(i) {
				this.tabIndex = i;
			},
			pullingDownA() {
				this.initA();
			},
			initA() { //病历资料
				if (this.CQYID && this.CSQDBH) {
					this.$refs.loading.show('加载中...');
					this.$ajax.post('', {
						'MSH.1': 'doctoradvice',
						'MSH.2': 'queryBLMX',
						'CQYID': this.CQYID, //患者ID
						'CSQDBH': this.CSQDBH, //申请单编号
						'FORMAT': 2,
						'token': localStorage.token,
					}).then(re => {
						console.log(re);
						this.$refs.loading.hide();
						if (re.code == 100 && re.data.rows && re.data.rows.length > 0) {
							this.nodataA = false;
							this.listA = re.data.rows;
						} else {
							this.nodataA = true;
							console.log('获取页面数据请求失败');
						}
					}).catch(error => {
						this.$refs.loading.hide();
						this.nodataA = true;
						console.log('获取页面数据请求失败' + error);
					})
				}
			},
			showOrdown(url) { //预览图片 或者下载文件
				console.log(url);
				let arry = url.split('.');
				// if (arry.length > 0) {
				// 	let hz = arry[arry.length - 1].toLowerCase();
				// 	//如果是图片
				// 	if (hz == "jpg" || hz == "png" || hz == "jpeg" || hz == "gif" || hz == "bmp") {
				// 		this.imgarry = [];
				// 		let _this = this;
				// 		this.$set(_this.imgarry, 0, {
				// 			src: 'http://192.168.104.212:8081/FilePath/2019031902461675762.jpg',
				// 		})
				// 		this.$nextTick(xx => {
				// 			this.$refs.previewer.show(0)
				// 		})
				// 	} else if (hz == "doc" || hz == "docx" || hz == "xls" || hz == "xlsx" || hz == "ppt" || hz == "pptx" || hz == "txt") {
				// 		let myFrame = document.createElement('iframe');
				// 		myFrame.src = 'http://192.168.104.212:8081/FilePath/2017091301332863654.xlsx';
				// 		myFrame.style.display = 'none';
				// 		document.body.appendChild(myFrame);
				// 	}
				// }
				let myFrame = document.createElement('iframe');
				myFrame.src = 'http://192.168.104.212:8081/FilePath/2017091301332863654.xlsx';
				myFrame.style.display = 'none';
				document.body.appendChild(myFrame);
			},
			logIndexChange() { //切换图片后触发
				console.log(arguments);
			},
		},
		watch: {
			tabIndex: function(newNum, oldNum) {
				if (newNum == 1) {
					this.$refs.tabBorder.style.left = "34px";
				} else if (newNum == 2) {
					this.$refs.tabBorder.style.left = "146px";
				} else if (newNum == 3) {
					this.$refs.tabBorder.style.left = "257px";
				}
			},
		}
	}
</script>
<style lang='less' scoped>
	@import '~@/assets/css/variable.less';
	.content {
		width: 100%;
		padding-top: 0;
	}
	.tab {
		display: flex;
		width: 125px;
		align-items: baseline;
		position: relative;
		width: 100%;
		background: #FFFFFF;
		margin-bottom: 2px;
		padding-left: 36px;
		height: 44px;
		align-items: center;
		.border {
			position: absolute;
			width: 65px;
			height: 3px;
			left: 34px;
			bottom: 0;
			background: #0096FF;
			transition: left .3s;
		}
		.chose {
			color: #0096FF;
			font-size: 16px;
		}
		.notChose {
			color: #5F7397;
			font-size: 16px;
		}
		.tabBtn {
			margin-right: 47px;
		}
	}
	.table-wr {
		width: 100%;
		height: 100%;
		background: #fff;
		border-radius: 4px;
		.header {
			height: 44px;
			display: flex;
			flex-direction: row;
			flex-wrap: nowrap;
			background: #EAF4FB;
			.head-tr {
				font-size: 1.5rem;
				flex: 1;
				text-align: center;
				line-height: 44px;
				font-weight: 400;
			}
		}
		.tbody {
			width: 100%;
			height: auto;
			overflow: hidden;
			.tb-tr {
				display: flex;
				flex-direction: row;
				flex-wrap: nowrap;
				min-height: 58px;
				width: 100%;
				position: relative;
				&:after {
					.setBottomLine();
				}
				&:first-child::before {
					.setTopLine();
				}
				.tb-td {
					display: flex;
					flex: 1;
					min-height: 58px;
					align-items: center;
					justify-content: center;
					text-overflow: ellipsis;
					display: inline-block;
					overflow: hidden;
					white-space: nowrap;
					line-height: 56px;
					text-align: center;
					span {
						font-size: 1.4rem;
						color: #666;
					}
					font-size: 1.4rem;
					color: #666;
				}
				.tb-td.cbtn {
					display: flex;
				}
			}
			.iconView {
				display: inline-block;
				width: 16px;
				height: 18px;
				background-image: url("~@/assets/imgs/icon1.png");
				background-position: center;
				background-repeat: no-repeat;
				background-size: 100%;
			}
			.btnView {
				color: #0096FF!important;
				font-size: 16px!important;
				margin-left: 3px;
			}
		}
	}
	.error {
		z-index: 0;
		height: ~'calc(100% - 100px)';
		top:100px;
		background: url("~imgs/nodataNow.png") center center no-repeat;
	}
</style>