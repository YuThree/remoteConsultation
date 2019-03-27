<template>
	<div class="cdct_container">
		<XHeader :left-options="{backText: ''}">患者随访单<span slot="right" @click="save">完成</span>
		</XHeader>
		<div class="content">
			<loading ref="loading"></loading>
			<div class="msgBox">
				<div class="topBox">
					<img class="leftImg" src="~@/assets/imgs/Polygon.png" alt="">
					<span class="midText">患者随访单</span>
					<img class="rightImg" src="~@/assets/imgs/man.png" alt="">
				</div>
				<div class="innerBox">
					<div class="cdct_inputBox  cdct_asterisk">
						<div class="cdct_info"><span>随访方式</span></div>
						<el-select v-model="sflx" v-validate="'required'" data-vv-name="随访方式" @visible-close="$validator.validate('随访方式')">
							<el-option v-for="(item,index) in sflxop" :key="index" :label="item.val" :value="item.key"></el-option>
						</el-select>
						<span class="cdct_error">{{verrors.first('随访方式')}}</span>
					</div>
					<div class="cdct_inputBox  cdct_asterisk">
						<div class="cdct_info"><span>随访时间</span></div>
						<datetime class="cdct_time" :min-year="1900" v-model="time" v-validate="'required'" data-vv-name="随访时间" @on-hide="$validator.validate('随访时间')" @on-confirm="$validator.validate('随访时间')"></datetime>
						<span class="cdct_error">{{verrors.first('随访时间')}}</span>
					</div>
					<div class="cdct_inputBox  cdct_asterisk">
						<div class="cdct_info"><span>所属机构</span></div>
						<el-select v-model="sfjgbm" v-validate="'required'" data-vv-name="所属机构" @visible-close="$validator.validate('所属机构')">
							<el-option v-for="(item,index) in sfjgbmop" :key="index" :label="item.val" :value="item.key"></el-option>
						</el-select>
						<span class="cdct_error">{{verrors.first('所属机构')}}</span>
					</div>
					<div class="cdct_inputBox  cdct_asterisk">
						<div class="cdct_info"><span>随访患者</span></div>
						<el-select v-model="brid" v-validate="'required'" data-vv-name="随访患者" @visible-close="$validator.validate('随访患者')">
							<el-option v-for="(item,index) in bridop" :key="index" :label="item.val" :value="item.key"></el-option>
						</el-select>
						<span class="cdct_error">{{verrors.first('随访患者')}}</span>
					</div>
					<div class="cdct_inputBox  cdct_asterisk">
						<div class="cdct_info"><span>随访科室</span></div>
						<el-select v-model="ksbm" @change="changeKS" v-validate="'required'" data-vv-name="随访科室" @visible-close="$validator.validate('随访科室')">
							<el-option v-for="(item,index) in ksbmop" :key="index" :label="item.CKSMC" :value="item.CKSBH"></el-option>
						</el-select>
						<span class="cdct_error">{{verrors.first('随访科室')}}</span>
					</div>
					<div class="cdct_inputBox cdct_asterisk">
						<div class="cdct_info"><span>随访医生</span></div>
						<el-select v-model="ysbm" @change="changeYs" v-validate="'required'" data-vv-name="随访医生" @visible-close="$validator.validate('随访医生')">
							<el-option v-for="(item,index) in ysbmop" :key="index" :label="item.CYSMC" :value="item.CYSBM"></el-option>
						</el-select>
						<span class="cdct_error">{{verrors.first('随访医生')}}</span>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import {
		Datetime
	} from 'vux'
	export default {
		components: {
			Datetime
		},
		data() {
			return {
				time: '',
				sflxop: [{
					key: '101',
					val: '个人随访'
				}, {
					key: '102',
					val: '科室随访'
				}, {
					key: '103',
					val: '机构随访'
				}, ],
				sflx: '', //随访类型
				sfjgbmop: [],
				sfjgbm: '', //所属机构
				bridop: [],
				brid: '', //随访患者
				ksbmop: [],
				ksbm: '', //随访科室编码
				ksmc: '', //随访科室名称
				ysbmop: [],
				ysbm: '', //随访医生编码
				ysmc: '', //随访医生名称
			}
		},
		mounted() {
			this.$refs.loading.show('加载中...');
			this.getParams();
		},
		methods: {
			//获取上页传递参数 并设置
			getParams() {
				console.log(this.$route.params.info);
				let _this = this;
				this.brid = this.$route.params.info.CQYID; //病人id
				this.brxm = this.$route.params.info.CXM; //病人姓名
				this.bridop.push({
					key: _this.brid,
					val: _this.brxm
				})
				this.sfjgmc = this.$route.params.info.CSJGMC; //随访机构名称
				this.sfjgbm = this.$route.params.info.CSJGBM; //随访机构编码
				this.getHZKS(_this.sfjgbm); //获取医院科室
				this.sfjgbmop.push({
					key: _this.sfjgbm,
					val: _this.sfjgmc
				})
			},
			save() { //完成
				this.$validator.validate().then(result => {
					if (result) {
						this.$refs.loading.show('保存中...');
						this.$ajax.post('', {
							'MSH.1': 'follow',
							'MSH.2': 'addFollow',
							'sflx': this.sflx, //随访类型
							'brid': this.brid,
							'brxm': this.brxm,
							'sfjgbm': this.sfjgbm,
							'sfjgmc': this.sfjgmc,
							'ksbm': this.ksbm,
							'ksmc': this.ksmc,
							'ysbm': this.ysbm,
							'ysmc': this.ysmc,
							'type': '2',
							'time': this.time + ' 00:00:00',
							'FORMAT': 2,
							'token': localStorage.token,
						}).then(re => {
							this.$refs.loading.hide();
							console.log(re);
							if (re.code == 100) {
								this.$MessageCase.show('操作成功', 'success');
							} else {
								this.$MessageCase.show('操作失败', 'error');
								console.log('获取页面数据请求失败');
							}
						}).catch(error => {
							this.$refs.loading.hide();
							this.$MessageCase.show('操作失败', 'error');
							console.log('获取页面数据请求失败' + error);
						})
					} else {
						this.$root.showTips = true;
					}
				})
			},
			getHZKS(str) { // 获取会诊科室
				this.$ajax.post('', {
					"MSH.1": "consultantCommon",
					"MSH.2": "applyArrangeKs",
					"CBH": str,
					"ksBM": "",
					"token": localStorage.token,
					"FORMAT": 2
				}).then(res => {
					this.$refs.loading.hide();
					console.log(res);
					if (res.code == '100') {
						this.ksbmop = res.data.rows;
					}
				}).catch(error => {
					this.$refs.loading.hide();
					console.log(error)
				});
			},
			changeKS(label, val) { // 选择科室后 获取医生列表
				// 获取医生列表
				this.ysbm = '';
				this.ysmc = '';
				this.ksmc = label; //赋值科室名称
				this.getAllDoc(val);
			},
			getAllDoc(val) { // 获取所有医生
				this.$ajax.post('', {
					"MSH.1": "ychz2",
					"MSH.2": "applyArrangeYs",
					"CKSBH": val,
					"token": localStorage.token,
					"FORMAT": 2
				}).then(res => {
					console.log(res);
					this.ysbmop = [];
					if (res.code == '100' && res.data.rows && res.data.rows.length > 0) {
						this.ysbmop = res.data.rows;
					} else {
						this.$MessageCase.show('该科室没有医生！', 'error');
					}
				}).catch(error => {
					this.$MessageCase.show('获取当前科室医生失败！', 'error');
					console.log(error)
				});
			},
			changeYs(label, val) { // 选择医生后
				this.ysmc = label; //赋值医生名称
			},
		},
	}
</script>
<style lang='less' scoped>
	.content {
		display: flex;
		height: calc(~"100% - 60px");
		justify-content: center;
		align-items: center;
		.msgBox {
			width: 618px;
			border-radius: 4px;
			background: #FFFFFF;
			box-shadow: 0 0 8px 0 rgba(0, 64, 98, 0.09);
			.topBox {
				display: flex;
				align-items: center;
				justify-content: space-between;
				margin-top: 8px;
				.leftImg {
					width: 59px;
					height: 83px;
				}
				.midText {
					color: #19293F;
					font-size: 20px;
				}
				.rightImg {
					width: 62px;
					height: 63px;
					margin-right: 32px;
				}
			}
			.innerBox {
				display: flex;
				flex-wrap: wrap;
				justify-content: space-between;
				padding: 14px 25px 30px 29px;
				.cdct_inputBox {
					margin-right: 0;
				}
			}
		}
	}
</style>