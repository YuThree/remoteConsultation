<template>
	<div class="cdct_container">
		<XHeader :left-options="{backText: ''}">个人基本资料
			<span slot="right" @click="saveBtn">保存</span>
		</XHeader>
		<div class="cdct_content cdct_relative">
			<loading ref="loading"></loading>
			<scroll :selectScroll="true" :useTransition="false" >
				<div class="cdct_main">
					<div class="cdct_title">个人基本信息</div>
					<div class="cdct_inputBox" style="width: 100%; margin-right: 0;">
						<div class="cdct_info"><span>我的头像</span></div>
						<img v-if="resObj.CZPLJ.length > 0" :src="resObj.CZPLJ" class="avatar">
                    	<img v-else src="~@/assets/imgs/avatar.png" class="avatar">
						<div class="cdct_choose choose2" @click="uploadImg">上传头像</div>
					</div>
					<div class="cdct_inputBox">
						<div class="cdct_info"><span>专家姓名</span></div>
						<input class="cdct_input" v-model="resObj.CYSMC" disabled>
					</div>
					<div class="cdct_inputBox">
						<div class="cdct_info"><span>身份证号</span></div>
						<input class="cdct_input" v-model="resObj.CSFZH" disabled>
					</div>
					<div class="cdct_inputBox">
						<div class="cdct_info"><span>出生日期</span></div>
						<input class="cdct_input" v-model="resObj.DCSNY" disabled>
					</div>
					<div class="cdct_checkBox" style="width: 270px;">
						<div class="cdct_info" ><span>专家性别</span></div>
						<div class="chk_content" style="flex: none;">
							<div class="cdct_radio cdct_radio_suc" v-for="(item,index) in genter" :key='index' disabled>
								<input :id="'tz'+index" type="radio"  :value="item.key" name="专家性别" v-model="resObj.IXB" disabled>
								<label :for="'tz'+index">{{item.val}}</label>
							</div>
							
						</div>
						
					</div>
					<div class="cdct_inputBox">
						<div class="cdct_info"><span>手机号</span></div>
						<input class="cdct_input" v-model="resObj.CLXDH">
					</div>
					<div class="cdct_inputBox">
						<div class="cdct_info"><span>年&emsp;&emsp;龄</span></div>
						<input class="cdct_input" v-model="resObj.YNL" disabled>
					</div>
					<div class="cdct_inputBox">
						<div class="cdct_info"><span>电子邮箱</span></div>
						<input class="cdct_input" v-model="resObj.CDZYX">
					</div>
				</div>
				<div class="cdct_main">
					<div class="cdct_title">专家职称资质</div>
					<div class="cdct_inputBox">
						<div class="cdct_info"><span>医院名称</span></div>
						<input class="cdct_input" v-model="resObj.CJGMC" disabled>
					</div>
					<div class="cdct_inputBox">
						<div class="cdct_info"><span>科室名称</span></div>
						<input class="cdct_input" v-model="resObj.CKSMC" disabled>
					</div>
					<div class="cdct_inputBox">
						<div class="cdct_info"><span>专家学历</span></div>
						<input class="cdct_input" v-model="resObj.CXL" disabled>
					</div>
				</div>
			</scroll>
		</div>
	</div>
</template>

<script>
export default {
	name: 'PersonalInfo',
	mounted() {
		if(window.localStorage.token){
			this.token = window.localStorage.token;
			var loginInfo = JSON.parse(window.localStorage.loginInfo);
			this.CBH = loginInfo.CYSBM;  // 医生编码
			this.init();
		}
	},
	data () {
		return {
			genter: [
				{key: '1', val: '男'},
				{key: '2', val: '女'},
			],
			CBH: '',
			token: '',
			resObj:{CZPLJ: ''},
		}
	},
	watch: {
		"$root.headImage"(newValue) {
			this.resObj.CZPLJ = this.$root.hostImage + newValue;
		}
  	},
	methods: {
		uploadImg() {
			var json = "{type:'2',data:{}}";
			if (this.$root.phoneType == "ios") {
				window.webkit.messageHandlers.mutual.postMessage({type: "2"});
			} else {
				android: AndroidFun.mutual(json);
			}
		},
		init() {
			this.$refs.loading.show('加载中...');
			this.$ajax.post('',{
			    "MSH.1": "YWZJGL",
				"MSH.2": "findByCBH",
				"CBH": this.CBH,
				"token":this.token,
				"FORMAT":1

			}).then(res => {
				this.$refs.loading.hide();
			    if(res.code == '100'){
					this.resObj = res.data;
			    }
			}).catch(error => {
			    console.log(error)
			});
		},
		saveBtn(){
			if (!this.resObj) {
				return;
			}
			this.$refs.loading.show('保存中...');
			this.$ajax.post('',{
			    "MSH.1": "YWZJGL",
				"MSH.2": "updaGRXX",
				"CBH": this.resObj.CYSBM, // 医生编码
				"CXB": this.resObj.CXB,
				"IXB": this.resObj.IXB,
				"CPYM": this.resObj.CPYM,
				"ITYPE": this.resObj.ITYPE,
				"CYSMC": this.resObj.CYSMC,
				"CSFZH": this.resObj.CSFZH,
				"DCSNY": this.resObj.DCSNY,
				"CLXDH": this.resObj.CLXDH,
				"CZPLJ": this.resObj.CZPLJ,
				"YNL": this.resObj.YNL,
				"CDZYX": this.resObj.CDZYX,
				"CJGMC": this.resObj.CJGMC,
				"CKSMC": this.resObj.CKSMC,
				"CXL": this.resObj.CXL,
				"token": this.token,
				"FORMAT": 1
			}).then(res => {
				this.$refs.loading.hide();
			    if(res.code == '100'){
					this.$MessageCase.show(res.msg,'success').then(()=>{
						this.$router.go(-1);
					})
			    }
			}).catch(error => {
			    console.log(error)
			});
		}
	}

}
</script>

<style lang="less" scoped>
	.cdct_container{
		.cdct_main{
			.avatar{
				width: 100px;
				height: 100px;
				background: url("~@/assets/imgs/process.png") no-repeat;
			}
			.choose2.cdct_choose{
				margin-top: 60px;
				margin-left: 20px;
				&:before{
					width: 13px;
					height: 14px;
					background-image: url("~@/assets/imgs/choose2.png");
				}
			}
		}
	}
</style>