<template>
	<div class="cdct_container">
		<XHeader :left-options="{backText: ''}">修改密码
			<span slot="right" @click="saveBtn">保存</span>
		</XHeader>
		<div class="cdct_content">
			<loading ref="loading"></loading>
			<div class="cdct_main">
				<h1>修改密码</h1>
				<div class="cdct_inputBox">
					<div class="cdct_info"><span>旧&ensp;密&ensp;码</span></div>
					<input class="cdct_input" type="password" v-model="PWD" name="旧密码" v-validate="'required'">
					<span class="cdct_error">{{verrors.first('旧密码')}}</span>
				</div>
				<div class="cdct_inputBox">
					<div class="cdct_info"><span>新&ensp;密&ensp;码</span></div>
					<input class="cdct_input" type="password" v-model="FPWD" name="新密码" v-validate="'required'" ref="新密码">
					<span class="cdct_error">{{verrors.first('新密码')}}</span>
				</div>
				<div class="cdct_inputBox">
					<div class="cdct_info"><span>确认密码</span></div>
					<input class="cdct_input" type="password" v-model="SFPWD" name="确认密码" v-validate="'required|confirmed:新密码'" data-vv-as="新密码">
					<span class="cdct_error">{{verrors.first('确认密码')}}</span>
				</div>
			</div>
			
		</div>
	</div>
</template>

<script>
export default {

	name: 'ChangePassword',

	data () {
		return {
			PWD: '',
			FPWD: '',
			SFPWD: '',
			token: '',
		}
	},
	mounted() {
		if(window.localStorage.token){
		    this.token = window.localStorage.token;
		}
		
	},
	methods: {
		saveBtn() {
			this.$validator.validate().then(result => {
				if (result) {
					this.$refs.loading.show('保存中...');
					this.$ajax.post('',{
					    "MSH.1": "YWZJGL",
						"MSH.2": "updateZjPwd",
						"type": "0",
						"PWD": this.PWD,
						"FPWD": this.FPWD,
						"SFPWD": this.SFPWD,
						"token":this.token,
						"FORMAT":1

					}).then(res => {
						this.$refs.loading.hide();
					    if(res.code == '100'){
					    	this.$MessageCase.show('密码修改成功','success').then(() => {
					    		this.$router.go(-1);
					    	})
					    	
					    }
					    
					}).catch(error => {
					    console.log(error)
					});
				}else{
					this.$root.showTips = true;
				}
			});
			
		}
	}
}
</script>

<style lang="less" scoped>
	.cdct_container{
		.cdct_error{ left: 70px; }
		.cdct_content{
			display: flex;
			justify-content: center;
			align-items: center;
			.cdct_main{
				width: 500px;
				height: 300px;
				background-color: #fff;
				position: relative;
				padding: 0;
				&::after,&::before{
					content: ' ';
					position: absolute;
					background-size: contain;
					background-repeat: no-repeat;
					background-position: top center;
				}
				&::after{
					width: 59px;
					height: 83px;
					background-image: url('~@/assets/imgs/Polygon.png');
					top: 10px;
				}
				&::before{
					width: 62px;
					height: 63px;
					background-image: url('~@/assets/imgs/man.png');
					right: 47px;
					top: 14px;
				}
				h1{
					width: 100%;
					font-size: 20px;
					text-align: center;
					margin: 28px 0 34px;
				}
				.cdct_inputBox{
					margin-left: 49px;
					width: 100%;
					position: relative;
					&::after{
						position: absolute;
						content: ' ';
						width: 18px;
						height: 18px;
						left: 83px;
						top: 11px;
						background-image: url('~@/assets/imgs/lock.png');
						background-repeat: no-repeat;
						background-size: cover;
					}
					&::before{
						position: absolute;
						content: ' ';
						width: 1px;
						height: 40px;
						left: 112px;
						top: 0;
						background: #CED7E3;

					}
					.cdct_input{
						width: 330px;
						padding-left: 50px;
					}
				}
			}

		}
	}
</style>