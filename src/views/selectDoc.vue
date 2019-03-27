<template>
	<div class="cdct_container cdct_right">
		<XHeader :left-options="{backText: '',}">选择医生</XHeader>
		<div class="cdct_content cdct_relative">
			<loading ref="loading"></loading>
			<div class="cdct_operation" style="margin-bottom:10px;">
				<div class="y_ctrlBtnBox">
					<div class="y_btn" @click="lastWeek" :class="{'is-disabled':this.week <= 0}">上一周</div>
					<div class="y_dateBox">{{daterange}}</div>
					<div class="y_btn" @click="nextWeek">
						<i class="weui-loading" v-show="loading"></i> 下一周
					</div>
				</div>
			</div>
			<div class="cdct_main cdct_relative" style="height:51px;overflow:hidden;margin-bottom:0;">
				<div class="alltodo-wrapper titleBanner">
					<div class="tabel-box">
						<div class="tabel-time">
							<div class="rightTop">
								<div class="doctbox">
									医生
								</div>
								<div class="override">
									<span class="lb">时间段</span>
									<span class="out">日期</span>
								</div>
							</div>
						</div>
						<div class="tabel-date">
							<time-transition class="tableBg" :week="week" :numbers="num" :data="data"  @date-click="dateQryFn">
							</time-transition>
						</div>
					</div>
				</div>
			</div>
			<scroll :selectScroll="true" :useTransition="false" style="height: calc(100% - 123px);" class="scrollClass " >
				<div class="cdct_main cdct_relative" style="margin-bottom:0;">
					<div class="alltodo-wrapper">
						<div class="tabel-box">
							<div class="tabel-time">
								<div class="rightTop">
									<div class="doctbox">
										医生
									</div>
									<div class="override">
										<span class="lb">时间段</span>
										<span class="out">日期</span>
									</div>
								</div>
								<div class="time-tree">
									<div class="tree-row" v-for="(obj,index) in doc" :key="index">
										<div class="tree-slot">
											{{obj}}
										</div>
										<div class="tree-date">
											<div class="time-column" v-for="(item,index) in timerangearry" :key="index+'timearry'">
												<div class="cell"><span class="timeType">{{item.TYPE==1?'上午':'下午'}}</span> <br>{{item.DKSSJ}}<br><span class="pozhe">—</span> <br>{{item.DJSSJ}}<br></div>
											</div>
										</div>
									</div>
								</div>
							</div>
							<div class="tabel-date">
								<time-transition class="tableBg" @headCallBack="changeDate" :week="week" :numbers="num" :data="data"  @date-click="dateQryFn">
								</time-transition>
							</div>
						</div>
					</div>
				</div>
			</scroll>
			<div class="error" v-if="nodata">暂无数据</div>
		</div>
	</div>
</template>

<script>
	import BScroll from 'better-scroll';
	import {
		XButton
	} from "vux";
	import timeTransition from "@/components/timeTransverse/timeTransition";
	export default {
		name: 'NewApplication',
		components: {
			XButton,
			timeTransition
		},
		beforeRouteEnter(to,from,next){
			next(vm => {
			  	// 通过 `vm` 访问组件实例
			   vm.jumpName = from.name;
			})
		},
		data() {
			return {
				num: 1, //显示周数
				week: 0, //距离现在几周
				CKSBM: '', //科室值 from前页
				doc: [], //医生数组 名字
				data: [], //排班信息数据
				loading: false, //按钮loading
				daterange: 'xxxx-xxxx', //按钮时间段显示值
				timerangearry: [], //当前时间段数组里面是时间 yyyy-mm-dd
				starttime: '',
				endtime: '',
				timearry: [], //时间段每天的数组
				nodata: false, //无数据
				docIndex: 0,
				jumpName:'',
			}
		},
		mounted() {
			if(this.$route.params.CKSBM){
				this.CKSBM = this.$route.params.CKSBM;
				this.docIndex = this.$route.params.docIndex;
			}
			this.initTimerange(); //时间段
		},
		methods: {
			//获取时间段  只用加载一次 每个医院一样
			initTimerange() {
				this.$ajax.post('', {
					'MSH.1': 'sysPb',
					'MSH.2': 'SelSjd',
					'token': localStorage.token,
					'FORMAT': 2,
				}).then(re => {
					if (re.data.rows) {
						this.timerangearry = re.data.rows;
					} else {
						console.log('时间段data:' + re.data)
					}
				}).catch(error => {
					console.log(error);
				});
			},
			//获取时间段 排班信息   在获取到一周时间后触发
			initData() {
				this.$ajax.post('', {
					'MSH.1': 'YSPBGL',
					'MSH.2': 'findKyy',
					'mID': localStorage.IGHZL, //系统编号
					'ksbm': this.CKSBM ? this.CKSBM : '-1', //科室编码
					'token': localStorage.token,
					'FORMAT': 2,
				}).then(re => {
					this.$refs.loading.hide();
					// console.log(re.data.rows)
					this.doc = this.data = []; //置空医生 和表格
					let _this = this;
					let newdoc = [];
					if (re.data.rows&&re.data.rows.length>0) {
						this.nodata = false;
						re.data.rows.forEach(element => {
							newdoc.push(element.CYSXM);
						});
						this.doc = Array.from(new Set(newdoc)) //创建医生数组
						//初始化 表格数据
						this.timearry.forEach(element => {
							let oneDay = [];
							for (let index = 0; index < _this.doc.length * _this.timerangearry.length; index++) {
								oneDay.push({
									obj: {},
									tips: false,
									time: element
								})
							}
							this.data.push(oneDay)
						});
						//写入表格数据
						re.data.rows.forEach(element => {
							let x = _this.timearry.indexOf(element.DPBRQ.split(' ')[0]) //data数组1层
							let y = _this.doc.indexOf(element.CYSXM) * 2 + parseInt(element.ISJD) //data数组2层
							if (new Date(element.DPBRQ).getTime() > new Date().getTime() || (new Date(element.DPBRQ).getTime() + 1000 * 60 * 60 * 12) > new Date().getTime() || (new Date(element.DPBRQ).getTime() + 1000 * 60 * 60 * 24) > new Date().getTime() && element.ISJD == 1) { //判断是否大于当前时间  如现在是下午就不能选今天上午
								_this.data[x][y].tips = true;
								_this.data[x][y].obj = element;
							}
						});
					} else {
						this.nodata = true;
					}
				}).catch(error => {
					this.nodata = true;
					this.$refs.loading.hide();
					console.log(error);
				});
			},
			//上一周
			lastWeek() {
				if (this.week <= 0) {
					return;
				}
				this.week -= 1;
			},
			//下一周
			nextWeek() {
				if (this.loading) {
					return;
				}
				this.loading = true;
				const self = this;
				setTimeout(function() {
					self.loading = false;
					self.week += 1;
				}, 300);
			},
			//排班点击
			dateQryFn(obj) {
				if(obj.tips){
					this.$router.push({name:this.jumpName,params:{docDetails: obj.obj,docIndex: this.docIndex}})
				}
				
			},
			//组件调用函数  触发data改变
			changeDate(obj) {
				this.$refs.loading.show();
				let _this = this;
				_this.timearry = [];
				obj.forEach(element => {
					_this.timearry.push(`${element.obj.yyyy}-${element.obj.MM}-${element.obj.dd}`);
				});
				this.daterange = `${obj[0].obj.yyyy}.${obj[0].obj.MM}.${obj[0].obj.dd} - ${obj[6].obj.yyyy}.${obj[6].obj.MM}.${obj[6].obj.dd}`;
				this.starttime = `${obj[0].obj.yyyy}-${obj[0].obj.MM}-${obj[0].obj.dd}`;
				this.endtime = `${obj[6].obj.yyyy}-${obj[6].obj.MM}-${obj[6].obj.dd}`;
				this.initData();
			}
		}
	}
</script>

<style lang="less" scoped>
	@imagesin: "~@/assets/imgs";
	@color1: #19293F;
	.cdct_container {
		.cdct_content {
			height: 100%;
			padding: 0;
			.cdct_operation {
				display: flex;
				justify-content: center;
				color: #3F4B5D;
				.y_ctrlBtnBox {
					display: flex;
					align-items: center;
					// margin-left: 100px;
				}
				.y_btn {
					border-radius: 4px;
					border: 1px solid rgba(206, 215, 227, 1);
					color: #CED7E3;
					line-height: 30px;
					margin-right: 10px;
					padding: 0 15px;
					color: #19293F;
					font-size: 1.3rem;
				}
				.y_dateBox {
					line-height: 52px;
					color: #5F7397;
					font-size: 1.5rem;
					margin-right: 10px;
					font-weight: normal;
				}
				.cdct_info {
					display: inline-block;
				}
				.el-box {
					width: 150px;
				}
				/deep/ .el-input__single {
					min-height: 30px;
					line-height: 30px;
					font-weight: normal;
				}
			}
		}
		.cdct_main {
			padding: 0;
			.alltodo-wrapper {
				// padding: 20px;
				border-radius: 4px;
				background: #fff; // margin-top: 10px;
				width: 100%;
				border-radius: 2px;
				overflow: hidden;
			}
			.titleBanner {
				background: url("~imgs/iconPaibanBg.png") no-repeat;
				background-size: cover;
			}
			.tabel-box {
				width: 100%;
				display: flex;
			}
			.tabel-time {
				width: 194px;
				height: 100%;
			}
			.tabel-date {
				flex: 1;
				overflow: hidden;
			}
			.rightTop {
				display: flex; // background: url("~@/assets/imgs/iconPaibanBg.png") no-repeat;
				width: 100%;
			}
			.doctbox {
				width: 90px;
				display: inline-block;
				height: 51px;
				border-right: 1px solid #e1e1e1;
				text-align: center;
				line-height: 51px;
				color: white;
			}
			.override {
				flex: 1;
				display: inline-block;
				height: 51px;
				position: relative;
				box-sizing: border-box;
				overflow: hidden;
				border-right: 1px solid #e1e1e1;
			}
			.override::after {
				width: 100%;
				height: 1px;
				background: white;
				position: absolute;
				top: 0;
				left: 0;
				content: "";
				transform-origin: top left;
				transform: rotateZ(26deg) scale(1.161);
			}
			.override .lb,
			.override .out {
				font-size: 1.4rem;
				color: white;
			}
			.override .lb {
				bottom: .5rem;
				left: .5rem;
				position: absolute;
			}
			.override .out {
				top: .5rem;
				right: .5rem;
				position: absolute;
			}
			.time-tree {
				width: 194px;
				border-bottom: 1px solid #e1e1e1;
			}
			.tree-row {
				display: flex;
			}
			.tree-slot {
				font-size: 1.5rem;
				color: #19293F;
				width: 90px;
				display: flex;
				align-items: center;
				justify-content: center;
				border-top: 1px solid #e1e1e1;
				border-right: 1px solid #e1e1e1;
				font-weight: bold;
				padding: 0 1rem;
			}
			.tree-date {
				width: 104px;
			}
			.time-column {
				width: 100%;
				box-sizing: border-box;
				text-overflow: ellipsis;
				vertical-align: middle;
				position: relative;
				text-align: center;
				border-top: 1px solid #e1e1e1;
				border-right: 1px solid #e1e1e1;
				height: 12rem;
				overflow: hidden;
				display: flex;
				align-items: center;
			}
			.timeType {
				font-size: 1.5rem;
				color: #19293F;
				font-weight: bold;
			}
			.pozhe {
				transform: rotate(90deg);
				display: inline-block;
			}
			.cell {
				font-size: 1.4rem;
				color: #666666;
				width: 100%;
			}
			.is-disabled {
				color: #c0c4cc;
				cursor: not-allowed;
				background-image: none;
				background-color: #fff;
				border-color: #ebeef5;
			}
		}
	}
</style>
<style lang="less">
	@imagesin: "~@/assets/imgs";
	.cdct_container {
		.scrollClass {
			.cdct_main {
				.rightTop,
				.time-roll {
					display: none;
				}
				.schedule-arrange {
					top: 0;
				}
			}
		}
		.error {
			background: url("~imgs/nodataNow.png") no-repeat center center;
		}
	}
</style>
