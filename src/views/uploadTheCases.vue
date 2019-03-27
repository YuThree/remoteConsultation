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
						<div class="cdct_showText"><span>{{resObj.CXM}}</span></div>
					</div>
					<div class="cdct_inputBox">
						<div class="cdct_info"><span>性&emsp;&emsp;别</span></div>
						<div class="cdct_showText"><span>{{resObj.CXB}}</span></div>
					</div>
					<div class="cdct_inputBox">
						<div class="cdct_info"><span>年&emsp;&emsp;龄</span></div>
						<div class="cdct_showText"><span>{{resObj.INL}}</span></div>
					</div>
					<div class="cdct_inputBox">
						<div class="cdct_info"><span>婚&emsp;&emsp;姻</span></div>
						<div class="cdct_showText"><span>{{resObj.CHY}}</span></div>
					</div>
					<div class="cdct_inputBox cdct_longerInput">
						<div class="cdct_info"><span>门诊/住院号</span></div>
						<div class="cdct_showText"><span>{{resObj.CJZH}}</span></div>
					</div>
				</div>
				<div class="cdct_main">
					<div class="cdct_title cdct_uplaodIco">病例文件上传</div>
					<div class="cdct_inputBox">
						<div class="cdct_info"><span>资料类型</span></div>
						<el-select @change="getCatalog()" v-model="nowType" clearable>
							<el-option v-for="(item,index) in type" :key="index + 'type'" :label="item.CMC" :value="item"></el-option>
						</el-select>
					</div>
					<div class="cdct_inputBox" style="margin-right:10px;">
						<div class="cdct_info"><span>资料目录</span></div>
						<el-select v-model="DirectoryNow" clearable>
							<el-option v-for="(item,index) in Directory" :key="index" :label="item.CMC" :value="item"></el-option>
						</el-select>
					</div>
					<div class="cdct_inputBox">
						<div class="cdct_choose" @click="isNoUp()">新增目录</div>
					</div>
					<modal type="1" v-model="modalshow" title="新增目录" :width="'438px'" :height="'310px'" @on-ok="mkdirsure">
						<div class="y_modalBox">
							<div class="cdct_inputBox ">
								<div class="cdct_info"><span>上级目录</span></div>
								<div class="cdct_showText"><span>{{nowType.CMC}}</span></div>
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
						<div class="y_tr" v-for="(item,index) in list" :key="index+'bl'">
							<div class="y_td">{{item.CLXMC}}</div>
							<div class="y_td">{{item.MLMC}}</div>
							<div class="y_td">{{item.CWJM}}</div>
							<div class="y_td">{{item.CYSMC}}</div>
							<div class="y_td">{{item.CSIZE}}M</div>
							<div class="y_td">{{item.DSCRQ}}</div>
							<div class="y_td y_w170"><span class="y_Preview" @click.stop="show(index)">预览</span><span class="y_del" @click="deleteCase	(item.CBH)">删除</span> </div>
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
import { join } from 'path';
	export default {
		name: 'uploadTheCases',
		created(){
			this.resObj = this.$route.params.resObj;
			if(this.resObj.CBH){
				this.resObj.AddCBH = this.resObj.CBH;
			} else {
				this.resObj.CBH = this.resObj.AddCBH;
			}
			if(this.resObj.CQYID){
				this.resObj.CBRID = this.resObj.CQYID;
			} else {
				this.resObj.CQYID = this.resObj.CBRID;
			}
			this.getType();
			this.initProcess()
			this.nowTime = this.times(new Date().getTime(), "$YY-$MM-$DD");
		},
		components: {
			Modal,
			Previewer
		},
		directives: {
			TransferDom
		},
		data() {
			return {
				nowType:{
					CMC:''
				},
				DirectoryNow: {},
				TEST: 1,
				resObj:{},
				modalshow: false,
				imgarry: [
					//查看图片
					{src:"http://192.168.104.212:8081/FilePath/2019031902461675762.jpg"},
					{src:"http://192.168.104.212:8081/FilePath/2019031902461675762.jpg"},
					{src:"http://192.168.104.212:8081/FilePath/2019031902461675762.jpg"},
				],
				list:[{ 
						CBH: "1903180316074",
						CLXMC: "病历资料",
						CSIZE: "0.02",
						CURL: "2019031902461675762.jpg",
						CWJM: "0e65e43547339b8071de8fe7d4c0f9d2",
						CYSMC: "成申请",
						DSCRQ: "2019-03-19 14:46:16.0",
						MLMC: "ddd",
					},{ 
						CBH: "1903180316074",
						CLXMC: "病历资料",
						CSIZE: "0.02",
						CURL: "2019031902461675762.jpg",
						CWJM: "0e65e43547339b8071de8fe7d4c0f9d2",
						CYSMC: "成申请",
						DSCRQ: "2019-03-19 14:46:16.0",
						MLMC: "ddd",
					},{ 
						CBH: "1903180316074",
						CLXMC: "病历资料",
						CSIZE: "0.02",
						CURL: "2019031902461675762.jpg",
						CWJM: "0e65e43547339b8071de8fe7d4c0f9d2",
						CYSMC: "成申请",
						DSCRQ: "2019-03-19 14:46:16.0",
						MLMC: "ddd",
					}
				],
				type:[],
				Directory: [],
				Directorytext: '',
				showtext: '',
				nowTime:""
			}
		},
		watch: {
			"$root.emrFile"(newValue) {
				if (newValue == true) {
					this.initProcess();	
				}
				this.$root.emrFile = false;
			}
		},
		methods: {
			times(date, moment, zero) {
				var myDate = date ? new Date(date) : new Date(),
					zero = zero ? zero : true,
					timeString = moment ? moment : '$YY:$MM:$DD $HH:$FF:$SS';
				function is(i) { return i < 10 ? "0" + i : i };
				var d = {
					'YY': myDate.getFullYear(),
					'MM': myDate.getMonth() + 1,
					'DD': myDate.getDate(),
					'HH': myDate.getHours(),
					'FF': myDate.getMinutes(),
					'SS': myDate.getSeconds()
				}

				return timeString.replace(/\$(\w+)/g, function (txt, key) {
					if (d.hasOwnProperty(key)) {
						return zero ? is(d[key]) : d[key];
					}
					return txt;
				})
			},
			isNoUp(){
				//是否有上级权限
				if(this.nowType.CMC){
					this.modalshow = true;
				}else{
					this.$MessageCase.show('请先选择资料类型', 'error')
						.then(() => {
						})
						.catch((err) => {
							console.log(err);
						})
				}
			},
			getType(){
				//获取资料目录类型
				this.$ajax.post('',{
					"MSH.1": "EMRJCCX",
					"MSH.2": "selEMRlx",
					"CBH": this.resObj.AddCBH,
					"token":localStorage.token,
					"FORMAT":2
				}).then(res => {
					if(res.code == '100'){
						if(res.data.rows.length != 0){
							res.data.rows.forEach(e => {
								if(!e.CSJBM){
									this.type.push(e);
								}
							})
						}
					}
				}).catch(error => {
					console.log(error)
				});
			},
			getCatalog(){
				//获取目录
				this.$ajax.post('',{
						"MSH.1": "EMRGL",
						"MSH.2": "selBlml",
						"CBH": this.resObj.AddCBH,
						"TYPE": this.nowType.CBH,
						"BRID": this.resObj.CBRID,
						"name":"",
						"token":localStorage.token,
						"FORMAT":2
					}).then(res => {
					if(res.code == '100'){
						this.Directory = [];
						this.DirectoryNow = "";
						if(res.data.rows.length != 0){
							res.data.rows.forEach(e => {
								this.Directory.push({CBH:e.CBH,CMC:e.CMC});
							});
						}
					}
				}).catch(error => {
					console.log(error)
				});
			},
			addCatalog(){
				//新增目录
				console.log(this.resObj)
				this.$ajax.post('',{
					"MSH.1": "EMRGL",
					"MSH.2": "addBlml",
					"SQDBH":  this.resObj.AddCBH,
					"TYPE": this.nowType.CBH,
					"BRID": this.resObj.CBRID,
					"NAME": this.Directorytext,
					"LBBH": "1",//1-远程会诊 2-远程影像 3-远程心电
					"DCJRQ": this.nowTime,
					"token":localStorage.token,
					"FORMAT":2
				}).then(res => {
					if(res.code == '100'){
						this.$MessageCase.show('新增目录成功', 'success')
						.then(() => {
						})
						.catch((err) => {
							console.log(err);
						})
						this.Directory.push({CBH:res.data.key,CMC:res.data.name});
					}
				}).catch(error => {
					console.log(error)
				});
			},
			initProcess(){
				//获取已有病历列表
				this.$ajax.post('',{
					"MSH.1": "EMRGL",
					"MSH.2": "selEMRByBHLS",
					"CBH": this.resObj.AddCBH,
					"CBRID":this.resObj.CQYID,
					"token":localStorage.token,
					"FORMAT":2
				}).then(res => {
					if(res.code == '100'){
						this.list = res.data.rows;
						this.list.forEach(e => {
							this.imgarry.push({"src":this.$root.hostImage + '/FilePath/' + e.CURL});
						});
					}
				}).catch(error => {
					console.log(error)
				});
			},
			deleteCase(CBH){
				//删除病历
				this.$MessageCase.show('确定要删除文件吗?', 'alert')
					.then(() => {
						this.$ajax.post('',{
							"MSH.1": "EMRGL",
							"MSH.2": "delfile",
							"CBH": CBH,
							"token":localStorage.token,
							"FORMAT":2
						}).then(res => {
							if(res.code == '100'){
								let arr = this.list.filter(e =>{
									return e.CBH != CBH;
								})
								this.list = arr;
								this.list.forEach(e => {
									this.imgarry.push({"src":this.$root.hostImage + '/FilePath/' + e.CURL});
								});
								this.$MessageCase.show('删除成功', 'success')
									.then(() => {
									})
									.catch((err) => {
										console.log(err);
									})		
							}
						}).catch(error => {
							console.log(error)
						});
					})
					.catch((err) => {
						console.log(err);
					})
			},
			show(index) {
				this.$refs.previewer.show(index)
			},
			logIndexChange(arg) {
				console.log(arg)
			},
			//添加文件  
			addFile: function() {
				console.log(this.nowType ,this.DirectoryNow)
				if(!this.nowType.CBH ){
					this.$MessageCase.show('请先选择资料类型', 'error')
						.then(() => {
						})
						.catch((err) => {
							console.log(err);
						})
					return;
				}else if(!this.DirectoryNow.CBH){
					this.$MessageCase.show('请先选择资料目录', 'error')
						.then(() => {
						})
						.catch((err) => {
							console.log(err);
						})
					return;
				}

				//原生方法------start
				let CSQDLBBM = this.$route.params.systemType;
				let CSQDLBMC;
				switch (CSQDLBBM) {
					case '1':
						CSQDLBMC = '远程会诊系统';
						break;
					case '2':
						CSQDLBMC = '远程影像系统';
						break;
					case '3':
						CSQDLBMC = '远程心电系统';
						break;
				}
				let BH = this.nowType.CBH + '=' + this.DirectoryNow.CBH;

				let json = {
					CSQDH:this.resObj.AddCBH ? this.resObj.AddCBH : this.resObj.CBH,//申请单号
					CBRID:this.resObj.CBRID ? this.resObj.CBRID : this.resObj.CQYID,//病人编号
					CSQDLBBM:CSQDLBBM + '',//申请类型编码  1-远程会诊系统 2-远程影像系统 3-远程心电系统
					CSQDLBMC:CSQDLBMC + '',//申请类型名称  
					BH:BH + '',//目录编号
					token:window.localStorage.token,
				}

				console.log(json)

				if (this.$root.phoneType == "ios") {
					window.webkit.messageHandlers.mutual.postMessage({type: "3",data:json});
				} else {
					json = JSON.stringify({type:"3",data:json});
					console.log(json)
					android: AndroidFun.mutual(json);
				}
				//原生方法------end
			},
			//添加目录
			mkdirsure: function() {
				this.addCatalog();
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
						background-image: url("~@/assets/imgs/icon2.png");
					}
				}
				.cdct_title.cdct_uplaodIco {
					&:before {
						content: '';
						width: 25px;
						background-image: url("~@/assets/imgs/iconUpload.png");
					}
				}
				.y_uploadBox {
					width: calc(~"100% - 16px");
					min-height: 108px;
					padding: 0;
					.y_choosePng {
						width: 108px;
						height: 108px;
						display: inline-block;
						position: relative;
						background: rgba(249, 249, 249, 1);
						border-radius: 4px;
						border: 1px solid rgba(206, 215, 227, 1);
						background-image: url("~@/assets/imgs/iconUploadBtn.png");
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
							overflow: hidden;
							text-overflow:ellipsis;
							white-space: nowrap;
							.y_del {
								color: @color1;
								&:before {
									content: '';
									display: inline-block;
									width: 15px;
									height: 18px;
									background: url("~@/assets/imgs/del.png") no-repeat;
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
									background: url("~@/assets/imgs/iconPreview.png") no-repeat;
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