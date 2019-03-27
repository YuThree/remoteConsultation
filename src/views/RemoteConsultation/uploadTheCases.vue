<template>
	<div class="cdct_container">
		<XHeader :left-options="{backText: ''}">上传病例
			<span slot="right">完成</span>
		</XHeader>
		<div class="cdct_content cdct_relative">
			<scroll :selectScroll="true" :useTransition="false">
				<div class="cdct_main cdct_normalinforBox">
					<div class="cdct_title cdct_userIco">患者基本信息</div>
					<div class="cdct_inputBox">
						<div class="cdct_info"><span>姓&emsp;&emsp;名</span></div>
						<div class="cdct_showText"><span>张学友</span></div>
					</div>
					<div class="cdct_inputBox">
						<div class="cdct_info"><span>性&emsp;&emsp;别</span></div>
						<div class="cdct_showText"><span>男</span></div>
					</div>
					<div class="cdct_inputBox">
						<div class="cdct_info"><span>年&emsp;&emsp;龄</span></div>
						<div class="cdct_showText"><span>22</span></div>
					</div>
					<div class="cdct_inputBox">
						<div class="cdct_info"><span>婚&emsp;&emsp;姻</span></div>
						<div class="cdct_showText"><span>未婚</span></div>
					</div>
					<div class="cdct_inputBox cdct_longerInput">
						<div class="cdct_info"><span>门诊/住院号</span></div>
						<div class="cdct_showText"><span>45268791234</span></div>
					</div>
				</div>
				<div class="cdct_main">
					<div class="cdct_title cdct_uplaodIco">病例文件上传</div>
					<div class="cdct_inputBox">
						<div class="cdct_info"><span>资料类型</span></div>
						<el-select v-model="TEST" clearable>
							<el-option v-for="(item,index) in 3" :key="index" :label="item" :value="item"></el-option>
						</el-select>
					</div>
					<div class="cdct_inputBox" style="margin-right:10px;">
						<div class="cdct_info"><span>资料目录</span></div>
						<el-select v-model="DirectoryNow" clearable>
							<el-option v-for="(item,index) in Directory" :key="index" :label="item.val" :value="item.key"></el-option>
						</el-select>
					</div>
					<div class="cdct_inputBox">
						<div class="cdct_choose" @click="modalshow=true">新增目录</div>
					</div>
					<modal type="1" v-model="modalshow" title="新增目录" :width="'438px'" :height="'310px'" @on-ok="mkdirsure">
						<div class="y_modalBox">
							<div class="cdct_inputBox ">
								<div class="cdct_info"><span>上级目录</span></div>
								<div class="cdct_showText"><span>门诊</span></div>
							</div>
							<div class="cdct_inputBox">
								<div class="cdct_info"><span>目录名称</span></div>
								<input class="cdct_input" v-model="Directorytext" style="width:240px;">
							</div>
						</div>
					</modal>
					<div class="y_tableBox">
						<div class="y_th">
							<div class="y_td">病例类型</div>
							<div class="y_td">目录</div>
							<div class="y_td">文件名</div>
							<div class="y_td">上传人</div>
							<div class="y_td">大小（MB）</div>
							<div class="y_td">上传日期</div>
							<div class="y_td y_w170">操作</div>
						</div>
						<div class="y_tr">
							<div class="y_td">门诊</div>
							<div class="y_td">xx</div>
							<div class="y_td">屏幕截图</div>
							<div class="y_td">程咬金</div>
							<div class="y_td">0.11</div>
							<div class="y_td">2018-12-12</div>
							<div class="y_td y_w170"><span class="y_Preview">预览</span><span class="y_del">删除</span> </div>
						</div>
						<div class="y_tr">
							<div class="y_td">门诊</div>
							<div class="y_td">xx</div>
							<div class="y_td">屏幕截图</div>
							<div class="y_td">程咬金</div>
							<div class="y_td">0.11</div>
							<div class="y_td">2018-12-12</div>
							<div class="y_td y_w170"><span class="y_Preview" @click.stop="show(0)">预览</span><span class="y_del">删除</span> </div>
						</div>
					</div>
					<div v-transfer-dom>
						<previewer :list="imgarry" ref="previewer" @on-index-change="logIndexChange"></previewer>
					</div>
					<div class="y_uploadBox cdct_relative">
						<div class="y_choosePng" @click="addFile">
							<span>选择文件</span>
						</div>
					</div>
				</div>
			</scroll>
		</div>
	</div>
</template>

<script>
	import Modal from '@/components/modal'
	import {
		Previewer,
		TransferDom
	} from 'vux'
	export default {
		name: 'uploadTheCases',
		components: {
			Modal,
			Previewer
		},
		directives: {
			TransferDom
		},
		data() {
			return {
				DirectoryNow: '',
				TEST: 1,
				modalshow: false,
				imgarry: [{
					"src": 'http://img.bimg.126.net/photo/ZZ5EGyuUCp9hBPk6_s4Ehg==/5727171351132208489.jpg',
				}, {
					"src": 'http://img.bimg.126.net/photo/ZZ5EGyuUCp9hBPk6_s4Ehg==/5727171351132208489.jpg',
				}],
				Directory: [{
						key: '目录1',
						val: '目录1'
					},
					{
						key: '目录2',
						val: '目录2'
					},
					{
						key: '目录3',
						val: '目录3'
					},
				],
				Directorytext: '',
				showtext: '',
			}
		},
		methods: {
			//添加文件  
			addFile: function() {
				//原生方法------start
				//原生方法------end
			},
			//添加目录
			mkdirsure: function() {
				let _this = this;
				let item = {
					key: _this.Directorytext,
					val: _this.Directorytext
				};
				let noInclude = true;
				if (_this.Directorytext != '') {
					_this.Directory.forEach(element => {
						if (element.key == _this.Directorytext) {
							noInclude = false;
						}
					});
					if (noInclude) {
						_this.Directory.push(item);
						_this.$nextTick(function() {
							_this.DirectoryNow = _this.showtext = _this.Directorytext;
						})
					} else {
						_this.$MessageCase.show('已有该目录', 'error')
							.then(() => {
								_this.modalshow = true;
							})
							.catch((err) => {
								console.log(err);
							})
					}
				} else {
					console.log('空');
				}
			},
			show(index) {
				this.$refs.previewer.show(index)
			},
			logIndexChange(arg) {
				console.log(arg)
			},
		}
	}
</script>
<style lang='less' scoped>
	@imagesin: "../../assets/imgs";
	@fontsizeNormal: 1.4rem;
	@fontsizeBigger: 1.6rem;
	@borderColor: #CED7E3;
	@color1: #0096FF;
	.cdct_container {
		.cdct_content {
			.cdct_main {
				padding-left: 16px;
				border-radius: 4px;
				.cdct_title {
					&:before {
						vertical-align: top;
					}
				}
				.cdct_title.cdct_userIco {
					&:before {
						content: '';
						background-image: url("~imgs/icon2.png");
					}
				}
				.cdct_title.cdct_uplaodIco {
					&:before {
						content: '';
						width: 25px;
						background-image: url("~imgs/iconUpload.png");
					}
				}
				.y_uploadBox {
					width: calc(~"100% - 16px");
					min-height: 108px;
					padding: 0;
					.y_choosePng {
						width: 108px;
						height: 108px;
						position: relative;
						background: rgba(249, 249, 249, 1);
						border-radius: 4px;
						border: 1px solid rgba(206, 215, 227, 1);
						background-image: url("~imgs/iconUploadBtn.png");
						background-repeat: no-repeat;
						background-position: center 40%;
						background-size: 36px 36px;
						color: #5F7397;
						text-align: center;
						padding-top: 70px;
						float: left;
					}
				}
				.y_tableBox {
					width: calc(~"100% - 16px");
					border: 1px solid @borderColor;
					border-radius: 4px;
					margin: 0 0 20px 0;
					overflow: hidden;
					.y_tr {
						display: flex;
						width: 100%;
						.y_td {
							flex: 1;
							color: #5F7397;
							height: 60px;
							line-height: 60px;
							text-align: center;
							border-bottom: solid 1px @borderColor;
							.y_del {
								color: @color1;
								&:before {
									content: '';
									display: inline-block;
									width: 15px;
									height: 18px;
									background: url("~imgs/del.png") no-repeat;
									background-size: cover;
									vertical-align: middle;
									margin-right: 4px;
								}
							}
							.y_Preview {
								color: @color1;
								margin-right: 24px;
								&:before {
									content: '';
									display: inline-block;
									width: 18px;
									height: 18px;
									background: url("~imgs/iconPreview.png") no-repeat;
									background-size: cover;
									vertical-align: middle;
									margin-right: 4px;
								}
							}
						}
						.y_w170 {
							min-width: 170px;
						}
					}
					.y_th {
						display: flex;
						width: 100%;
						background: rgba(250, 251, 252, 1);
						.y_td {
							flex: 1;
							color: #19293F;
							height: 50px;
							line-height: 50px;
							text-align: center;
							border-bottom: solid 1px @borderColor;
						}
						.y_w170 {
							min-width: 170px;
						}
					}
					.y_tr:last-of-type {
						.y_td {
							border-bottom: none;
						}
					}
				}
			}
			.cdct_normalinforBox {
				padding-bottom: 0;
				.cdct_inputBox {
					width: 180px;
					margin-right: 10px;
					.cdct_showText {
						width: calc(~"100% - 70px");
						display: inline-block;
						position: relative;
						span {
							position: absolute;
							width: 100%;
							top: 50%;
							left: 0;
							-webkit-transform: translateY(-50%);
							transform: translateY(-50%);
							color: #19293F;
							text-overflow: ellipsis;
							overflow: hidden;
							white-space: nowrap;
							font-size: 14px;
							line-height: 18px;
						}
					}
				}
				.cdct_inputBox.cdct_longerInput {
					width: 210px;
					.cdct_info {
						width: 80px;
					}
					.cdct_showText {
						width: calc(~"100% - 100px");
						display: inline-block;
						position: relative;
					}
				}
			}
			.y_modalBox {
				padding: 0px 0 0 30px;
				.cdct_inputBox {
					width: 100%;
					.cdct_showText {
						width: calc(~"100% - 70px");
						display: inline-block;
						position: relative;
						span {
							position: absolute;
							width: 100%;
							top: 50%;
							left: 0;
							-webkit-transform: translateY(-50%);
							transform: translateY(-50%);
							color: #19293F;
							text-overflow: ellipsis;
							overflow: hidden;
							white-space: nowrap;
							font-size: 14px;
							line-height: 18px;
						}
					}
				}
			}
		}
	}
</style>