<template>
	<div class="cdct_container">
		<div class="cdct_content">
			<loading ref="loading"></loading>
			<h1 class="title">沙湾县远程医疗信息平台</h1>
			<div class="cdct_inputBox l1">
				<input class="cdct_input" placeholder="请输入账号" v-model="username" name="账号" v-validate="'required'">
				<span class="cdct_error">{{verrors.first('账号')}}</span>
			</div>
			<div class="cdct_inputBox l2">
				<input class="cdct_input" type="password" placeholder="请输入密码" v-model="password" name="密码" v-validate="'required'">
				<span class="cdct_error">{{verrors.first('密码')}}</span>
			</div>
			<div class="cdct_btn" @click="login">登录</div>
		</div>
	</div>
</template>

<script>
	export default {
		name: 'Login',
		data() {
			return {
				username: '',
				password: '',
			}
		},
		methods: {
			login() {
				this.$validator.validate().then(result => {
					if (result) {
						this.$refs.loading.show('登录中...');
						var params = new URLSearchParams();
						params.append('username', this.username); //你要传给后台的参数值 key/value
						params.append('password', this.password);
						this.$ajax({
							url: this.$root.loginUrl,
							method: 'post',
							data: params
						}).then(res => {
							this.$refs.loading.hide();
							if (res.errorCode == '200') {
								window.localStorage.clear();
								window.localStorage.token = res.errorMsg;
								window.localStorage.loginInfo = JSON.stringify(res.data);
								this.getBtndata();
								this.$store.commit('setParensCash','RemoteConsultation');
								this.$router.push('Home');
							} else {
								this.$MessageCase.show(res.errorMsg, 'error')
							}
						}).catch(error => {
							this.$refs.loading.hide();
							console.log(error)
						});
					} else {
						this.$root.showTips = true;
					}
				});
			},
			//按钮权限请求
			getBtndata: function() {
				this.$ajax.post('', {
					'MSH.1': 'role',
					'MSH.2': 'appfinduserfunc',
					'pageNum': this.pageIndex,
					'pageSize': this.pageSize,
					'FORMAT': 2,
					'token': localStorage.token,
				}).then(re => {
					console.log(re);
					if (re.code == '100' && re.data.rows && re.data.rows.length > 0) {
						let stringbtnArry = [];
						let nowArry=new Set(['120001','110001','120002','110004','120003','110002','110003','120004','120005','120006',
						'130003','130004','140013','140004','140028','140013','140007','140008','140012','140010','140011']);
						re.data.rows.forEach(element => {
							stringbtnArry.push(element.FTYPE)
						});
						let stringbtnSet=new Set(stringbtnArry)
						let newstringbtnArry=new Set([...stringbtnArry].filter(x => nowArry.has(x)))//求数组交集
						localStorage.setItem('btnArry', Array.from(newstringbtnArry).join(','))
					}
				}).catch(error => {
					console.log('按钮权限请求失败' + error)
				});
			}
		}
	}
</script>

<style lang="less" scoped>
	.cdct_container {
		background-image: url("~@/assets/imgs/bg.png");
		background-size: cover;
		background-repeat: no-repeat;
		display: flex;
		justify-content: center;
		align-items: center;
		overflow: hidden;
		.cdct_error {
			top: 43px;
			left: 0;
		}
		.cdct_content {
			width: 80.5vw;
			height: 55.3vw;
			background-color: #fff;
			border-radius: 8px;
			background-image: url("~@/assets/imgs/loginBg.png");
			background-size: 33.2vw 29.29vw;
			background-repeat: no-repeat;
			background-position: 5.95vw 17vw;
			.title {
				font-size: 3.2rem;
				color: #333;
				height: 50px;
				line-height: 50px;
				text-align: center;
				margin-top: 5.6vw;
				margin-bottom: 11.3vw;
				&::before {
					content: ' ';
					display: inline-block;
					width: 50px;
					height: 50px;
					margin-right: 5px;
					background: url("~@/assets/imgs/logo.png") no-repeat;
					background-size: cover;
					vertical-align: middle;
				}
			}
			.cdct_inputBox {
				margin-left: 45.5vw;
				width: 28vw;
				&::after {
					position: absolute;
					content: ' ';
					left: 16px;
					top: 50%;
					transform: translateY(-50%);
					background-repeat: no-repeat;
					background-size: cover;
				}
				&.l1 {
					&::after {
						width: 14px;
						height: 19px;
						background-image: url('~@/assets/imgs/login_icon1.png');
					}
				}
				&.l2 {
					&::after {
						width: 13px;
						height: 17px;
						background-image: url('~@/assets/imgs/login_icon2.png');
					}
				}
				.cdct_input {
					width: 100%;
					height: 44px;
					padding-left: 40px;
				}
			}
			.cdct_btn {
				margin-left: 45.5vw;
				width: 28vw;
				line-height: 44px;
				height: 44px;
				border-radius: 4px;
				font-size: 18px;
				margin-top: 30px;
			}
		}
	}
</style>