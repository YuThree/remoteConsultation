<template>
	<div class="cdct_container">
		<XHeader :left-options="{backText: ''}">服务与评价<span slot="right" @click="saveEvaluation" v-show="edit">完成</span>
		</XHeader>
		<div class="cdct_content cdct_relative">
			<loading ref="loading"></loading>
			<scroll :selectScroll="true" :useTransition="false">
				<div class="cdct_main">
					<div class="cdct_title title2">医疗机构质量监控及评价</div>
					<div class="charts">
						<div class="chartsBox">
							<div class="chartsBorder">
								<div class="chart">
									<x-circle :percent="percent[0]" :stroke-width="5" stroke-color="#0096FF" anticlockwise>
										<span>{{ percent[0] }}%</span>
									</x-circle>
								</div>
							</div>
							<p class="chartsTitle">医生报告填写率</p>
						</div>
						<div class="chartsBox">
							<div class="chartsBorder">
								<div class="chart">
									<x-circle :percent="percent[1]" :stroke-width="5" stroke-color="#0096FF" anticlockwise>
										<span>{{ percent[1] }}%</span>
									</x-circle>
								</div>
							</div>
							<p class="chartsTitle">会诊通过率</p>
						</div>
						<div class="chartsBox">
							<div class="chartsBorder">
								<div class="chart">
									<x-circle :percent="percent[2]" :stroke-width="5" stroke-color="#0096FF" anticlockwise>
										<span>{{ percent[2] }}%</span>
									</x-circle>
								</div>
							</div>
							<p class="chartsTitle">会诊拒绝率</p>
						</div>
						<div class="chartsBox">
							<div class="chartsBorder">
								<div class="chart">
									<x-circle :percent="percent[3]" :stroke-width="5" stroke-color="#0096FF" anticlockwise>
										<span>{{ percent[3] }}%</span>
									</x-circle>
								</div>
							</div>
							<p class="chartsTitle">患者满意达标率</p>
						</div>
					</div>
					<p class="isMy">您对医疗机构质量监控满意吗？</p>
					<div class="myBox">
						<div class="inner" @click="chooseF(1)" :class="{ selection: chose == 1 ? true:false }">
							<i class="img my1" :class="{ my2: chose == 1 ? true:false }"></i>
							<span class="texts" :class="{ choseText: chose == 1 ? true:false }">满意</span>
						</div>
						<div class="inner" @click="chooseF(2)" :class="{ selection: chose == 2 ? true:false }">
							<i class="img bmy1" :class="{ bmy2: chose == 2 ? true:false }"></i>
							<span class="texts" :class="{ choseText: chose == 2 ? true:false }">不满意</span>
						</div>
					</div>
					<div class="cdct_title title2">医生服务评价</div>
					<div class="y_contentBox">
						<div class="y_textBox">
							<span class="y_name">专家：</span>
							<span class="y_value">{{zjname}}</span>
							<span class="y_colorText" v-show="zjname!=''">主治医师</span>
						</div>
						<div class="y_textBox">
							<span class="y_name">时间：</span>
							<span class="y_value">{{time}}</span>
						</div>
						<div class="y_textBox">
							<span class="y_name">机构：</span>
							<span class="y_value">{{jgname}}</span>
						</div>
					</div>
					<p class="starTitle">您对医生服务评价？</p>
					<div class="starBox">
						<div class="star" @click="starF(1)">
							<i class="stars" :class="{ starsChose: star >= 1 ? true:false}"></i>
							<span class="name">差</span>
						</div>
						<div class="star" @click="starF(2)">
							<i class="stars" :class="{ starsChose: star >= 2 ? true:false}"></i>
							<span class="name">一般</span>
						</div>
						<div class="star" @click="starF(3)">
							<i class="stars" :class="{ starsChose: star >= 3 ? true:false}"></i>
							<span class="name">专业</span>
						</div>
						<div class="star" @click="starF(4)">
							<i class="stars" :class="{ starsChose: star >= 4 ? true:false}"></i>
							<span class="name">很专业</span>
						</div>
						<div class="star" @click="starF(5)">
							<i class="stars" :class="{ starsChose: star >= 5 ? true:false}"></i>
							<span class="name">非常专业</span>
						</div>
					</div>
					<div class="cdct_title title2">温馨提示</div>
					<div class="textBox">
						<span class="texts texts1">您的建议，我们会更加努力，如有更加专业见解</span>
						<span class="texts">电话：002145620</span>
					</div>
				</div>
			</scroll>
		</div>
	</div>
</template>

<script>
	import {
		XCircle
	} from 'vux'
	import {
		setTimeout
	} from 'timers';
	export default {
		components: {
			XCircle,
		},
		data() {
			return {
				percent: [0, 0, 0, 0],
				chose: 1,
				star: 3,
				info: {},
				edit: false,
				zjname: '', //专家名字
				time: '', //时间
				jgname: '', //机构
			}
		},
		mounted() {
			this.$refs.loading.show('加载中...');
			this.getlastpageInfo();
		},
		methods: {
			//保存评价
			saveEvaluation() {
				this.$refs.loading.show('保存中...');
				console.log('保存');
				if (this.chose && this.star) {}
				this.$ajax.post('', {
					'MSH.1': 'fwpj',
					'MSH.2': 'comment',
					'ITYPE': this.getType(), //业务类型：1--远程会诊 2--远程影像  3--远程心电
					'DYWKSSJ': this.info.DBSJ, //业务开始时间
					'DYWJSSJ': this.info.DESJ, //业务结束时间
					'CYSBM': this.info.CYSBM, //医生编码
					'CYSMC': this.info.CYSXM, //评价医生名称
					'CJGBM': this.info.CJGBM, //评价机构编码
					'CJGMC': this.info.CJGMC, //评价机构名称
					'CKSMC': this.info.KSXX, //评价科室名称
					'IGRADE': this.star, //评价级别
					'CYWCBH': this.info.CBH, //业务表主键
					'SATISFY': this.chose, //是否满意
					'DSQRQ': this.info.DJLSJ, //申请日期
					'FORMAT': 2,
					'token': localStorage.token,
				}).then(re => {
					this.$refs.loading.hide();
					console.log(re);
					if (re.code == 100) {
						this.$MessageCase.show('保存成功', 'success');
					} else {
						console.log('保存失败');
					}
				}).catch(error => {
					this.$refs.loading.hide();
					console.log('保存失败' + error);
				})
			},
			//满意否
			chooseF(num) {
				if (this.edit) {
					this.chose = num;
				}
			},
			//星数选择
			starF(num) {
				if (this.edit) {
					this.star = num;
				}
			},
			getNumber() { //获取评价数量
				this.$ajax.post('', {
					'MSH.1': 'fwpj',
					'MSH.2': 'getCount',
					'TYPE': this.getType(), //业务类型：1--远程会诊 2--远程影像  3--远程心电
					'JGBM': this.info.JGBM, //机构编码
					'CYWCBH': this.info.CBH, //业务编码
					'DSQRQ': this.info.DJLSJ, //申请日期
					'FORMAT': 2,
					'token': localStorage.token,
				}).then(re => {
					this.$refs.loading.hide();
					console.log(re);
					if (re.code == 100 && re.data.rows.length > 0) {
						let itme = re.data.rows[0];
						this.getPercent(0, itme.yt, itme.wt);
						this.getPercent(1, itme.tg, itme.btg);
						this.getPercent(2, itme.btg, itme.tg);
						this.getPercent(3, itme.my, itme.bmy);
					} else {
						console.log('获取评价Number请求失败');
					}
				}).catch(error => {
					this.$refs.loading.hide();
					console.log('获取评价Number请求失败' + error);
				})
			},
			getEvaluation() { //获取已有评价
				this.$ajax.post('', {
					'MSH.1': 'fwpj',
					'MSH.2': 'serverCommentDetail',
					'TYPE': this.getType(), //业务类型：1--远程会诊 2--远程影像  3--远程心电
					'CYWCBH': this.info.CBH, //业务编码
					'DSQRQ': this.info.DJLSJ, //申请日期
					'FORMAT': 2,
					'token': localStorage.token,
				}).then(re => {
					this.$refs.loading.hide();
					console.log(re);
					if (re.code == 100 && re.data.rows && re.data.rows.length > 0) {
						this.chose = re.data.rows[0].SATISFY;
						this.star = re.data.rows[0].IGRADE;
						this.zjname = re.data.rows[0].CZJNAME;
						this.time = re.data.rows[0].DCREATEDATA? re.data.rows[0].DCREATEDATA.split('.0')[0]:'';
						this.jgname = re.data.rows[0].CZJJG;
					} else {
						console.log('获取评价数据请求失败');
					}
				}).catch(error => {
					this.$refs.loading.hide();
					console.log('获取评价数据请求失败' + error);
				})
			},
			getlastpageInfo() {
				//判断状态 判断是否获取已有 评价
				if (this.$route.params.info) {
					this.info = this.$route.params.info;
					this.getNumber();
					if (this.info.IZT == '6' && this.info.PJSL == '') { //填写
						this.edit = true;
						this.zjname = this.info.CYSXM;
						this.time = this.info.DBSJ;
						this.jgname = this.info.CSJGMC;
					} else {
						//查看评价
						this.getEvaluation();
					}
				}
			},
			getPercent(index, x, y) { //获取百分比
				if (x != '0' && y != '0') {
					let percentN = (parseInt(x) / (parseInt(x) + parseInt(y))).toFixed(2) * 100
					this.$set(this.percent, index, percentN)
				}
			},
			getType() { //获取type参数值
				let i = localStorage.IGHZL;
				switch (i) { //1--远程会诊 2--远程影像  3--远程心电
					case '12': //远程会诊
						return '1'
						break;
					case '14': //远程影像
						return '2'
						break;
					case '15': //远程心电
						return '3'
						break;
					default:
						return ''
						break;
				}
			}
		},
	}
</script>
<style lang='less' scoped>
	.cdct_main {
		padding-right: 25px!important;
		.charts {
			width: 100%;
			display: flex;
			justify-content: space-around;
			padding: 0 52px;
			margin-top: 20px;
			.chartsBox {
				padding-right: 67px;
				border-right: 1px #CED7E3 solid;
				.chartsBorder {
					.chart {
						width: 100px;
						height: 100px;
						margin: auto;
					}
				}
				.chartsTitle {
					margin-top: 20px;
					color: #5F7397;
					font-size: 16px;
					text-align: center;
				}
			}
		}
		.charts :last-child {
			padding-right: 0;
			border-right: none;
		}
		.isMy {
			color: #FF6F00;
			font-size: 14px;
			margin: 39px 0 22px 11px;
		}
		.myBox {
			display: flex;
			width: 100%;
			justify-content: space-between;
			margin-bottom: 20px;
			.inner {
				width: calc(~"50% - 8px");
				height: 60px;
				background: #FAFAFA;
				border: 1px #CED7E3 solid;
				border-radius: 4px;
				display: flex;
				justify-content: center;
				align-items: center;
				.img {
					width: 30px;
					height: 30px;
					background-size: 100%;
					background-position: center;
					background-repeat: no-repeat;
					margin-right: 10px;
				}
				.my1 {
					background-image: url('~@/assets/imgs/my1.png');
				}
				.bmy1 {
					background-image: url('~@/assets/imgs/bmy1.png');
				}
				.my2 {
					background-image: url('~@/assets/imgs/my2.png');
				}
				.bmy2 {
					background-image: url('~@/assets/imgs/bmy2.png');
				}
				.texts {
					color: #CED7E3;
					font-size: 20px;
				}
				.choseText {
					color: #FFFFFF;
				}
			}
			.selection {
				background: -webkit-linear-gradient(left, #30C2FA, #0293FD);
				background: linear-gradient(to right, #30C2FA, #0293FD);
				border: none;
			}
		}
		.starTitle {
			flex-grow: 1;
			color: #FF6F00;
			font-size: 14px;
			text-align: center;
			margin-top: 10px;
		}
		.starBox {
			width: 100%;
			display: flex;
			justify-content: center;
			.star {
				margin: 20px 25px 0;
				.stars {
					display: block;
					width: 40px;
					height: 40px;
					background-image: url("~@/assets/imgs/star1.png");
					background-position: center;
					background-repeat: no-repeat;
					background-size: 100%;
					margin: auto;
				}
				.name {
					color: #5F7397;
					font-size: 16px;
					display: block;
					text-align: center;
					margin-top: 10px;
				}
				.starsChose {
					background-image: url("~@/assets/imgs/star2.png");
				}
			}
		}
		.textBox {
			margin-top: 10px;
			.texts {
				color: #5F7397;
				font-size: 14px;
			}
			.texts1 {
				margin: 0 34px 0 43px;
			}
		}
		.y_contentBox {
			display: flex; // flex-direction: row;
			padding-left: 17px;
			width: 100%;
			.y_textBox {
				display: flex;
				min-width: 200px;
				align-items: center;
				margin: 0 16px;
				.y_name {
					color: #19293F;
					font-size: 1.6rem;
				}
				.y_value {
					color: #5F7397;
					font-size: 1.6rem;
				}
				.y_colorText {
					padding: 0 5px;
					margin: 0 0 0 5px;
					font-size: 1.2rem;
					color: #FF6F00;
					border-radius: 2px;
					border: 1px solid rgba(255, 111, 0, 1);
				}
			}
		}
	}
</style>