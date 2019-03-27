<template>
	<div class="cdct_container">
		<XHeader :left-options="{backText: ''}">查看病历
			<div class="cdct_btn" style="position: absolute;right: 0;top: 6px;" @click="gotoDZBL" v-show="dzbl">查看</div>
		</XHeader>
		<div class="topBox">
			<loading ref="loading"></loading>
			<div class="imgBox">
				<img class="img" src="~@/assets/imgs/doc.png" alt="">
			</div>
			<div class="msgBox">
				<div class="msg">
					<span class="name">姓&emsp;&emsp;名</span>
					<span class="inner">{{patientInfo.CXM}}</span>
				</div>
				<div class="msg">
					<span class="name">性&emsp;&emsp;别</span>
					<span class="inner">{{patientInfo.CXB}}</span>
				</div>
				<div class="msg">
					<span class="name">年&emsp;&emsp;龄</span>
					<span class="inner">{{patientInfo.INL}}</span>
				</div>
				<div class="msg">
					<span class="name">出生日期</span>
					<span class="inner">{{patientInfo.DCSNY}}</span>
				</div>
				<div class="msg">
					<span class="name">家庭地址</span>
					<span class="inner">{{patientInfo.CMPH}}</span>
				</div>
			</div>
		</div>
		<div class="cdct_content cdct_relative" style="height:calc(100% - 160px);">
			<scroll :selectScroll="true" :useTransition="false" >
				<div class="cdct_main" v-for="(item01, index01) in level01" :key="index01">
					<div class="img" :class="{img1:index01%3 == 1,img2:index01%3 == 2,img3:index01%3 == 0}">
						<span class="imgp">{{item01.CMC}}</span>
					</div>
					<div class="inner" v-for="(item02, index02) in level02[item01.CBM]" :key="index02">
						<span class="name" @click="gotoDetail(item02)">{{item02.CMC}}</span>
					</div>
				</div>
			</scroll>
		</div>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				patientInfo: this.$route.params.info || JSON.parse(localStorage.viewRecordsInfo), // 病人信息
				level01: [], // 一级列表
				level02: {}, // 与一级列表关联的二级列表
				dzbl: {}, // 电子病历
			}
		},
		mounted() {
			this.qryAll();
			if(this.$route.params.info) {
				localStorage.viewRecordsInfo = JSON.stringify(this.$route.params.info);
			}
		},
		methods: {
			background(){
				//设置背景图

			},
			// 查询结构化电子病历资料列表
			qryAll() {
				this.$refs.loading.show('加载中...');
                this.$ajax.post('',{
                    "MSH.1":"BLTREE",
					"MSH.2":"selAll",
					"TYPE":"2", // 患者类型，固定为2
					"BRID":this.patientInfo.CQYID, // 病人ID
					"sqbh":this.patientInfo.CBH, // 申请单号
					"HZSJ":this.patientInfo.DAPSJ, // 会诊时间
					"XTBM":"1", // 远程会诊--1 远程影像--2  远程心电--3
					"CJZH":this.patientInfo.CJZH, // 就诊号
					"IBRXZ":this.patientInfo.IBRXZ, // 病人性质
					"CJGBM":this.patientInfo.CJGBM, // 机构编号，申请机构编码
					"SFZID":this.patientInfo.CSFZ, // 身份证号
					"token":window.localStorage.token,
					"FORMAT":2
                }).then(res => {
					this.$refs.loading.hide();
					if (!res.data.rows) {
						return;
					}
					var array = res.data.rows;
					// 遍历所有的数组：获取一级列表
					var tmpArray = [];
                    for (let index = 0; index < array.length; index++) {
						const element = array[index];
						if (element.USERLEVEL == '1') {
							this.level01.push(element);
							this.level02[element.CBM] = [];
						} else if (element.USERLEVEL == '2') {
							tmpArray.push(element);
						} else if (element.USERLEVEL == '3') {
							this.dzbl = element;
						}
					}
					// 遍历剩余的数组：获取二级列表
					for (let index = 0; index < tmpArray.length; index++) {
						const element = tmpArray[index];
						var detailArray = this.level02[element.CSJBM];
						detailArray.push(element);
						this.level02[element.CSJBM] = detailArray;
					}
					// 筛选：二级列表的个数为0的时候不显示一级列表
					tmpArray = [];
					for (let index = 0; index < this.level01.length; index++) {
						const element = this.level01[index];
						var detailArray = this.level02[element.CBM];
						if (detailArray.length > 0) {
							tmpArray.push(element);
						}
					}
					this.level01 = tmpArray;
                }).catch(error => {
                    console.log(error)
                });
			},
			// 点击二级列表
			gotoDetail(obj) {
				this.$refs.loading.show('加载中...');
                this.$ajax.post('',{
                    "MSH.1":"BLTREE",
    				"MSH.2":"queryML",
					"CSQDBH":this.patientInfo.CBH, // 申请单编号
    				"CLX":obj.CBM, // 二级目录类型编码
					"token":window.localStorage.token,
					"FORMAT":2
                }).then(res => {
					this.$refs.loading.hide();
					if (!res.data.rows) {
						return;
					}
					var array = res.data.rows;
					if (array.length > 0) {
						this.$router.push({name : 'prescriptionReport', params : {list: array}});
					} else {
						this.$MessageCase.show('没有更多数据', 'error')
					}
                }).catch(error => {
                    console.log(error)
                });
			},
			// 进入电子病历
			gotoDZBL() {
				var json = {type : '5', data : {title: this.dzbl.CMC, url: this.dzbl.URL}};
				if (this.$root.phoneType == "ios") {
					window.webkit.messageHandlers.mutual.postMessage(json);
				} else {
					android: AndroidFun.mutual(JSON.stringify(json));
				}
			},
		},
	}
</script>
<style lang='less' scoped>
	.topBox{
		margin: 10px 10px 0 10px;
		background: #FFFFFF;
		border-radius: 2px;
		display: flex;
		align-items: center;
		.imgBox{
			margin: 22px 51px 22px 33px;
			height: 63px;
			.img{
				width: 63px;
				height: 63px;
			}
		}
		.msgBox{
			display: flex;
			height: 63px;
			align-items: center;
			flex-wrap: wrap;
			.msg{
				display: flex;
				margin-right: 75px;
				.name{
					color: #5F7397;
					font-size: 16px;
					margin-right: 11px;
				}
				.inner{
					color: #19293F;
					font-size: 16px;
				}
			}
		}
	}
	.cdct_main{
		display: flex;
		padding: 20px 0 20px 110px!important;
		position: relative;
		.img{
			position: absolute;
			left: 12px;
			top: 20px;
			width:100px;
			height: calc(~"100% - 40px");
			background-repeat: no-repeat;
			background-position: center;
			display: flex;
			justify-content: center;
			align-items: center;
			.imgp{
				font-size: 18px;
				color: #FFFFFF;
				text-shadow: 0 1px 1px #4D2200;
			}
		}
		.img1{
			background-image: url('~@/assets/imgs/mz.png');
		}
		.img2{
			background-image: url('~@/assets/imgs/zy.png');
		}
		.img3{
			background-image: url('~@/assets/imgs/yz.png');
		}
		.inner{
			display: flex;
			flex-wrap: wrap;
			.name{
				width: 200px;
				height: 40px;
				color: #19293F;
				font-size: 15px;
				border:1px solid #CED7E3;
				border-radius: 4px;
				background: #F7FCFF;
				text-align: center;
				line-height: 40px;
				margin: 10px 10px;
			}
		}
	}
</style>