<template>
	<div class="cdct_container">
		<XHeader :left-options="{backText: ''}">{{edit?'填写':'查看'}}报告单<span v-if="edit" slot="right" @click="save">完成</span>
		</XHeader>
		<div class="cdct_content cdct_relative" :class="{nodata:nodata}">
			<loading ref="loading"></loading>
			<scroll :selectScroll="true" :useTransition="false">
				<!-- <div class="cdct_main">
																<span class="title">远程心电诊断书</span>
																<div class="msgBox">
																	<div class="msg">
																		<span class="name">会诊编号</span>
																		<span class="inner">HZ1234515478925</span>
																	</div>
																	<div class="msg">
																		<span class="name">患者姓名</span>
																		<span class="inner">王大锤</span>
																	</div>
																	<div class="msg">
																		<span class="name">性&emsp;&emsp;别</span>
																		<span class="inner">男</span>
																	</div>
																	<div class="msg">
																		<span class="name">出生年月</span>
																		<span class="inner">1998-12-01</span>
																	</div>
																	<div class="msg">
																		<span class="name">申请医院</span>
																		<span class="inner">成都第一人民医院</span>
																	</div>
																	<div class="msg">
																		<span class="name">科&emsp;&emsp;室</span>
																		<span class="inner">内科</span>
																	</div>
																	<div class="msg">
																		<span class="name">申请医生</span>
																		<span class="inner">王小锤</span>
																	</div>
																</div>
																<div class="cdct_textarea">
																	<div class="cdct_info"><span class="name">病历摘要</span></div>
																	<x-textarea :max="300"></x-textarea>
																</div>
																<div class="cdct_textarea">
																	<div class="cdct_info"><span class="name">初步诊断</span></div>
																	<x-textarea :max="300"></x-textarea>
																</div>
																<div class="cdct_textarea">
																	<div class="cdct_info"><span class="name">会诊意见</span></div>
																	<x-textarea :max="300"></x-textarea>
																</div>
																<div class="msgBox rd">
																	<div class="msg">
																		<span class="name">会诊医院</span>
																		<span class="inner">HZ1234515478925</span>
																	</div>
																	<div class="msg">
																		<span class="name">会诊科室</span>
																		<span class="inner">儿科</span>
																	</div>
																	<div class="msg">
																		<span class="name">会诊医生</span>
																		<span class="inner">刘嘉俊</span>
																	</div>
																</div>
															</div> -->
				<div class="cdct_main" v-html="html" ref="html"></div>
			</scroll>
			<div class="error" v-if="nodata">暂无数据</div>
		</div>
	</div>
</template>

<script>
	import {
		XTextarea
	} from 'vux'
	export default {
		components: {
			XTextarea,
		},
		data() {
			return {
				TEST: '',
				html: '',
				CBH: '',
				ags: '', //是否是编辑状态  1：填写  2：编辑
				nodata: false,
				statu: '', //查询类型
				edit: true, //是否编辑
			}
		},
		mounted() {
			this.$refs.loading.show('加载中...');
			this.getParams();
			// this.CBH = 'HZ171115051450030';
			// this.sqdbh = '190318048002';
			// this.ags = '2';
			this.init();
		},
		methods: {
			//获取上页传递参数 并设置
			getParams() {
				console.log(this.$route.params.info.BGDSL);
				if (this.$route.params.info.BGDSL != '') { //是否是编辑状态
					this.CBH = this.$route.params.info.CBH;
					this.ags = '2'; //编辑
					this.statu = '3'; //查询类型
					console.log(this.CBH);
				} else {
					this.CBH = this.$route.params.CBH;
					this.ags = '1'; //新增
					this.statu = '2'; //查询类型
				}
				if (this.$route.params.look) {
					this.edit = false; //禁止编辑
				}
				this.brid = this.$route.params.info.CQYID; //病人id
			},
			init() { //获取html页面
				this.$ajax.post('', {
					'MSH.1': 'Custom',
					'MSH.2': 'selExistModel',
					'cbh': this.CBH,
					'statu': this.statu,
					'FORMAT': 1,
					'token': localStorage.token,
				}).then(re => {
					this.$refs.loading.hide();
					console.log(re);
					if (re.code == 100) {
						this.nodata = false;
						this.html = re.data.CMSNR || re.data.CMXNR;
					} else {
						console.log('获取页面数据请求失败');
						this.nodata = true;
					}
				}).catch(error => {
					this.$refs.loading.hide();
					this.nodata = true;
					console.log('获取页面数据请求失败' + error);
				})
			},
			save() { //刷新所有Attr的value 并保存
				this.$refs.loading.show('保存中...');
				let jsonObj = {};
				this.$refs.html.querySelectorAll('input').forEach(element => {
					element.setAttribute('value', element.value);
					let onkeyVlaue = {};
					onkeyVlaue[element.id] = element.value;
					Object.assign(jsonObj, onkeyVlaue)
				});
				this.$refs.html.querySelectorAll('textarea').forEach(element => {
					element.setAttribute('value', element.value)
					let onkeyVlaue = {};
					onkeyVlaue[element.id] = element.value;
					Object.assign(jsonObj, onkeyVlaue)
				});
				// console.log(JSON.stringify(jsonObj));
				this.$ajax.post('', {
					'MSH.1': 'Custom',
					'MSH.2': 'addReportYWSJ',
					'sqdbh': this.CBH, //申请单编号
					'bgnr': this.$refs.html.innerHTML, //报告内容
					'sqdlx': this.getType(),
					'brid': this.brid, //病人id
					'ags': this.ags, //是否是编辑状态  1：填写  2：编辑
					'jData': JSON.stringify(jsonObj), //json字符串
					'FORMAT': 2,
					'token': localStorage.token,
				}).then(re => {
					this.$refs.loading.hide();
					console.log(re);
					if (re.code == 100) {
						this.$MessageCase.show('操作成功', 'success');
					} else {
						console.log('获取页面数据请求失败');
						this.$MessageCase.show('操作失败', 'error');
					}
				}).catch(error => {
					this.$refs.loading.hide();
					this.$MessageCase.show('操作失败', 'error');
					console.log('获取页面数据请求失败' + error);
				})
			},
			getType() { //获取type参数值
				let i = localStorage.IGHZL;
				switch (i) { // 1-远程会诊报告单 2-远程影像诊断报告单 3-远程心电诊断报告单 4-远程病理诊断报告单 5-远程监护报告单
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
	// .cdct_main {
	// 	padding-right: 25px!important;
	// 	.title {
	// 		color: #19293F;
	// 		font-size: 30px;
	// 		display: block;
	// 		text-align: center;
	// 		margin-bottom: 20px;
	// 	}
	// 	.msgBox {
	// 		display: flex;
	// 		flex-wrap: wrap;
	// 		justify-content: flex-start;
	// 		border-bottom: 2px #19293F solid;
	// 		.msg {
	// 			min-width: 238px;
	// 			margin-bottom: 20px;
	// 			.name {
	// 				color: #19293F;
	// 				font-size: 16px;
	// 				margin-right: 10px;
	// 			}
	// 			.inner {
	// 				color: #5F7397;
	// 				font-size: 16px;
	// 			}
	// 		}
	// 	}
	// 	.rd {
	// 		border-bottom: none;
	// 	}
	// 	.cdct_textarea {
	// 		margin-top: 20px;
	// 		.name {
	// 			color: #19293F;
	// 			font-size: 16px;
	// 			width: 72px;
	// 		}
	// 	}
	// }
</style>
<style lang='less'>
	.cdct_container .cdct_content .cdct_main {
		padding-right: 25px;
	}
	.cdct_main {
		overflow: hidden;
		.h1 {
			text-align: center;
			width: 100%;
			color: #19293F;
			font-size: 30px;
			margin-bottom: 20px;
		}
		.contorType1 {
			position: relative;
			float: left;
			margin-left: 5px;
			margin-top: 30px;
		}
		.collisionEle {
			display: inline-block;
		}
		.label1 {
			color: #19293F;
			font-size: 16px;
			margin-right: 10px;
			display: inline-block;
			vertical-align: middle;
			width: 85px;
			margin-bottom: 0;
			text-align: right;
		}
		.input1 {
			border: none;
			outline: none;
			height: 30px;
			width: 190px;
			background-color: transparent;
			border: none;
			border-bottom: 1px dashed #ced8e7;
			line-height: normal;
		}
		.textarea1 {
			background-color: transparent;
			border: 1px dashed #ced8e7;
			width: 830px;
			height: 118px;
			vertical-align: top;
		}
	}
	.scrollContent {
		min-height: 100%;
	}
	.error {
		background: url('~imgs/nodataNow.png') center center no-repeat;
	}
</style>