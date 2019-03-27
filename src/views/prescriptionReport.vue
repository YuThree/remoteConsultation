<template>
	<div class="cdct_container">
		<XHeader :left-options="{backText: ''}">查看病历
		</XHeader>
		<div class="cdct_content cdct_relative">
			<loading ref="loading"></loading>
			<div class="y_left">
				<scroll :selectScroll="true" :useTransition="false">
					<div class="cdct_main" v-for="(tmp, index) in list" :key="index">
						<div class="cdct_title title3">{{tmp.CMC}}</div>
						<div class="innerBox" v-for="(detailTmp, detailIndex) in detailObj[index]" :key="detailIndex">
							<div class="inners" @click="previewFile(detailTmp)">
								<img class="img" src="../assets/imgs/files.png" alt="">
								<p class="ps">{{detailTmp.CWJM}}}</p>
							</div>
						</div>
					</div>
				</scroll>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		name: 'prescriptionReport',
		data() {
			return {
				list: this.$route.params.list, // 三级目录
				detailObj: {}, // 详情列表
			}
		},
		mounted() {
			// 查询所有三级目录下的文件列表
			this.qryAll();
		},
		methods: {
			// 查询所有三级目录下的文件列表
			qryAll() {
				// console.log(this.$route.params.list);
				// console.log(this.list);
				for (let index = 0; index < this.list.length; index++) {
					const element = this.list[index];
					this.qryFileList(element, index);
				}
			},
			// 详情列表查询
			qryFileList(obj, index) {
				this.$refs.loading.show('加载中...');
                this.$ajax.post('',{
					"MSH.1": "BLTREE",
					"MSH.2": "selBRblzlInfo",
					"CID": obj.CHZBH,
					"name": obj.CMC,
					"token":window.localStorage.token,
					"FORMAT":2
                }).then(res => {
					this.$refs.loading.hide();
					if (!res.data.rows) {
						return;
					}
					var array = res.data.rows;
					console.log(res);
					this.detailObj[index] = array;
                }).catch(error => {
                    console.log(error)
                });
			},
			previewFile(obj) {
				alert('预览文件');
			},
		}
	}
</script>
<style lang='less' scoped>
	@imagesin: "../../assets/imgs";
	@color1: #0096FF;
	@TriangleColor: rgba(48, 194, 250, 0.84); //三角背景色 选中
	@TriangleColorNorm: rgba(251, 251, 251, 1); //三角背景色 非选中
	@TriangleWidth: 8px; //外三角高度
	@TriangleWidthIn: 7px; //内三角高度
	// @TriangleBorderColor:rgba(230,234,240,1);//  外三角背景  也是边框颜色
	@TriangleBorderColor: #e6eaf0; //  外三角背景  也是边框颜色
	.cdct_title{
		border-bottom: 1px solid #CED7E3;
		padding-bottom: 15px;
	}
	.innerBox{
		display: flex;
		margin-right: 26px;
		margin-bottom: 15px;
	}
	.innerBox:nth-child(5n+1) {
		margin-right: 0;
	}
	.innerBox .inners{
		width: 170px;
		box-sizing: border-box;
		background: #FAFAFA;
		height: 85px;
		border:1px #E1E1E1 solid;
	}
	.innerBox .inners .img{
		width: 27px;
		height: 33px;
		margin: auto;
		margin-top: 14px;
		margin-bottom: 6px;
		display: block;
	}
	.innerBox .inners .ps{
		color: #19293F;
		font-size: 14px;
		text-align: center;
		overflow: hidden;
		text-overflow:ellipsis;
		white-space: nowrap;
	}
	.cdct_main{
		padding-right: 25px!important;
	}
	.cdct_container {
		.cdct_content {
			display: flex;
			.y_left {
				width: 100%;
				overflow: hidden;
				border-radius: 2px;
				.y_row {
					height: 70px;
					width: 100%;
					display: flex;
					.y_leftin {
						width: 36px;
						height: 100%;
						.y_top {
							float: left;
							width: 50%;
							border-right: 1px solid #E1E1E1;
							height: 29px;
						}
						.y_center {
							float: left;
							width: 100%;
							height: 23px;
							position: relative;
							.y_circle {
								position: absolute;
								top: 50%;
								left: 50%;
								transform: translate(-50%, -50%);
								width: 8px;
								height: 8px;
								border-radius: 50%;
								background: #9BA8C2;
							}
						}
						.y_bottom {
							float: left;
							width: 50%;
							border-right: 1px solid #E1E1E1;
							height: 18px;
						}
					}
					.y_rightin {
						flex: 1;
						display: flex;
						padding-top: 10px;
						.y_rightinleftbox {
							width: @TriangleWidthIn;
						}
						.y_rightinrightbox {
							flex: 1;
							border: 1px solid @TriangleBorderColor;
							margin-left: -1px;
							padding: 5px 0px 5px 10px;
							overflow: hidden;
						}
					}
					&:last-of-type {
						.y_leftin {
							.y_bottom {
								display: none;
							}
						}
					}
				}
			}
			.y_right {
				flex: 1;
				overflow: hidden;
				background: white;
				border-radius: 2px;
				.scrollContent {
					min-height: 100%;
				}
				.y_imgbox {
					background: white;
					border-radius: 2px;
					width: 100%;
					min-height: 684px;
					position: relative;
					padding: .5rem;
					.nowimg {
						position: absolute;
						top: 50%;
						left: 50%;
						transform: translate(-50%, -50%);
						width: 100%;
						height: auto;
					}
					.errorimg {
						position: absolute;
						top: 50%;
						left: 50%;
						transform: translate(-50%, -50%);
						width: auto;
						height: auto;
						max-width: 100%;
						max-height: 100%;
					}
				}
			}
		}
	}
	.y_rightinrightbox {
		background: @TriangleColorNorm;
		width: 100%;
		.y_time {
			font-size: 1.2rem;
			color: #9BA8C2;
			width: 141px;
			text-overflow: ellipsis;
			overflow: hidden;
			white-space: nowrap;
		}
		.y_title {
			font-size: 1.6rem;
			color: #56A3F5;
			width: 143px;
			text-overflow: ellipsis;
			overflow: hidden;
			white-space: nowrap;
		}
	}
	.border-left-empty {
		width: 0;
		height: 0;
		border-bottom: @TriangleWidth solid transparent;
		border-right: @TriangleWidth solid @TriangleBorderColor;
		border-top: @TriangleWidth solid transparent;
		position: relative;
		margin: 23px auto 0;
	}
	.border-left-empty span {
		display: block;
		width: 0;
		height: 0;
		border-bottom: @TriangleWidthIn solid transparent;
		border-right: @TriangleWidthIn solid rgba(251, 251, 251, 1);
		border-top: @TriangleWidthIn solid transparent;
		position: absolute;
		left: 1px;
		top: -@TriangleWidthIn;
	}
	.activeOne {
		.border-left-empty span {
			border-right-color: @TriangleColor;
		}
		.y_rightinrightbox {
			background: linear-gradient(90deg, rgba(48, 194, 250, 0.84) 0%, rgba(2, 147, 253, 0.93) 100%);
			.y_time {
				color: white;
			}
			.y_title {
				color: white;
			}
		}
	}
</style>