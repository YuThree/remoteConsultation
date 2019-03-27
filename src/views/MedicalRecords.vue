<template>
	<div class="cdct_container">
		<XHeader :left-options="{backText: ''}">病历中心
			<!-- <span slot="right">保存</span> -->
		</XHeader>
		<div class="cdct_content cdct_relative">
			<scroll :selectScroll="true" :useTransition="false" >
				<div class="cdct_main">
					<div class="cdct_title title1">患者基本信息</div>
					<div class="cdct_inputBox speBox">
						<div class="cdct_info"><span>姓&emsp;&emsp;名</span></div>
						<div class="cdct_info showText"><span>{{info.CXM}}</span></div>
					</div>
					<div class="cdct_inputBox speBox">
						<div class="cdct_info"><span>性&emsp;&emsp;别</span></div>
						<div class="cdct_info showText"><span>{{info.CXB}}</span></div>
					</div>
					<div class="cdct_inputBox speBox">
						<div class="cdct_info"><span>年&emsp;&emsp;龄</span></div>
						<div class="cdct_info showText"><span>{{info.INL}}</span></div>
					</div>
					<div class="cdct_inputBox speBox">
						<div class="cdct_info"><span>婚&emsp;&emsp;姻</span></div>
						<div class="cdct_info showText"><span>{{resObj.CHY}}</span></div>
					</div>
					<div class="cdct_inputBox speBox">
						<div class="cdct_info"><span>门诊/住院号</span></div>
						<div class="cdct_info showText"><span>{{info.CBH}}</span></div>
					</div>
				</div>
				<div class="cdct_main">
					<div class="cdct_title">病历资料</div>
					<div class="cdct_table table2">
						<div class="cdct_thead">
							<div class="cdct_td">病历类型</div>
							<div class="cdct_td">目录</div>
							<div class="cdct_td">文件名</div>
							<div class="cdct_td">大小</div>
							<div class="cdct_td">上传时间</div>
							<div class="cdct_td">预览</div>
						</div>
						<div class="cdct_tr" v-for="(item,index) in list" :key="index+'bl'">
							<div class="cdct_td">{{item.CLXMC}}</div>
							<div class="cdct_td">{{item.MLMC}}</div>
							<div class="cdct_td">{{item.CWJM}}</div>
							<div class="cdct_td">{{item.CSIZE}}M</div>
							<div class="cdct_td">{{item.DSCRQ}}</div>
							<div class="cdct_td"><span class="preview" @click.stop="show(index)"></span></div>
						</div>
					</div>
				</div>
				<div class="cdct_main">
					<div class="cdct_title title2">上传机构</div>
					<div class="cdct_inputBox">
						<div class="cdct_info"><span>上传医院</span></div>
						<input class="cdct_input" disabled v-model="resObj.CJGMC">
					</div>
					<div class="cdct_inputBox">
						<div class="cdct_info"><span>上传科室</span></div>
						<input class="cdct_input" disabled v-model="resObj.CKSMC">
					</div>
					<div class="cdct_inputBox">
						<div class="cdct_info"><span>上传人</span></div>
						<input class="cdct_input" disabled v-model="resObj.CYSXM">
					</div>

				</div>
				<div v-transfer-dom>
					<previewer :list="imgarry" ref="previewer" @on-index-change="logIndexChange"></previewer>
				</div>
			</scroll>
		</div>
	</div>
</template>

<script>
import {
	Previewer,
	TransferDom
} from 'vux'
export default {
	name: 'MedicalRecords',
	created(){
		this.info = this.$route.params.info;
		this.resObj = this.$route.params.resObj;
		console.log(this.$root.hostImage)
		this.initProcess();
	},
	components: {
		Previewer
	},
	directives: {
		TransferDom

	},
	methods: {
		initProcess(){
			this.$ajax.post('',{
				"MSH.1": "EMRGL",
				"MSH.2": "selEMRByBHLS",
				"CBH": this.info.CBH,
				"CBRID":this.info.CQYID,
				"token":localStorage.token,
				"FORMAT":2
			}).then(res => {
				if(res.code == '100'){
					this.list = res.data.rows;
					console.log(this.list)
					this.list.forEach(e => {
						this.imgarry.push({"src":this.$root.hostImage + '/FilePath/' + e.CURL});
					});
					console.log(this.imgarry)
				}
			}).catch(error => {
				console.log(error)
			});
		},
		show(index) {
			this.$refs.previewer.show(index)
		},
		logIndexChange(arg) {
			console.log(arg)
		},
	},
	data () {
		return {
			info:{
				CBH:"",
				CQYID:""
			},
			resObj:{

			},
			CHY:"",
			list:[],
			imgarry: [],
		}
	}
}
</script>

<style lang="less" scoped>
	.cdct_container{
		.cdct_content{
			.title1.cdct_title{
				&:before{
					width: 19px;
					height: 22px;
					background-image: url('~@/assets/imgs/icon2.png');
				}
				
			}
			.title2.cdct_title{
				&:before{
					width: 22px;
					height: 21px;
					background-image: url('~@/assets/imgs/iconUpload.png');
				}
				
			}

			.table2.cdct_table{
				margin-left: 0;
				width: calc(~'100% - 20px');
				border-right: solid 1px #CED7E3;
				.cdct_thead{
					background: #FAFBFC;
					.cdct_td{
						border-right: none;
					}
				}
				.cdct_tr{
					background: #fff;
					.cdct_td{
						border-right: none;
						color: #5F7397;
						overflow: hidden;
						text-overflow:ellipsis;
						white-space: nowrap;
					}
					.preview{
						display: inline-block;
						width: 18px;
						height: 18px;
						background: url('~@/assets/imgs/iconPreview.png') no-repeat;
						background-size: cover;
					}
				}
			}
			
			.speBox.cdct_inputBox{
				width: auto;
				.showText.cdct_info{
				    span {
				        color: #19293F;
				    }
				}
			}
			
		}
	}
</style>