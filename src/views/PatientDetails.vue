<template>
	<div class="cdct_container">
		<XHeader :left-options="{backText: ''}">患者详情</XHeader>
		<div class="cdct_content cdct_relative">
			<scroll :selectScroll="true" :useTransition="false" >
				
				<div class="cdct_main">
					<div class="cdct_title title2">患者基本信息</div>
					<div class="cdct_inputBox">
						<div class="cdct_info"><span>医疗机构</span></div>
						<input class="cdct_input" disabled v-model="objData.CJGMC">
					</div>
					<div class="cdct_inputBox">
						<div class="cdct_info"><span>患者姓名</span></div>
						<input class="cdct_input" disabled v-model="objData.CBRXM">
					</div>
					<div class="cdct_inputBox">
						<div class="cdct_info"><span>身份证</span></div>
						<input class="cdct_input" disabled v-model="objData.CZJHM">
					</div>
					<div class="cdct_inputBox">
						<div class="cdct_info"><span>出生年月</span></div>
						<input class="cdct_input" disabled v-model="objData.DCSNY">
					</div>
					<div class="cdct_inputBox">
						<div class="cdct_info"><span>性&emsp;&emsp;别</span></div>
						<input class="cdct_input" disabled v-model="objData.CBRXBMC">
					</div>
					<div class="cdct_inputBox">
						<div class="cdct_info"><span>血&emsp;&emsp;型</span></div>
						<input class="cdct_input" disabled v-model="objData.CXXMC">
					</div>
					<div class="cdct_inputBox">
						<div class="cdct_info"><span>国&emsp;&emsp;籍</span></div>
						<input class="cdct_input" disabled v-model="objData.CGJMC">
					</div>
					<div class="cdct_inputBox">
						<div class="cdct_info"><span>民&emsp;&emsp;族</span></div>
						<input class="cdct_input" disabled v-model="objData.CGJMC">
					</div>
					<div class="cdct_inputBox">
						<div class="cdct_info"><span>婚姻状况</span></div>
						<input class="cdct_input" disabled v-model="objData.CHYMC">
					</div>
					<div class="cdct_inputBox">
						<div class="cdct_info"><span>职业类别</span></div>
						<input class="cdct_input" disabled v-model="objData.CZYMC">
					</div>
					<div class="cdct_inputBox">
						<div class="cdct_info"><span>联系电话</span></div>
						<input class="cdct_input" disabled v-model="objData.CHZDH">
					</div>
					<div class="cdct_inputBox">
						<div class="cdct_info"><span>工作单位</span></div>
						<input class="cdct_input" disabled v-model="objData.CGZDW">
					</div>
					<div class="cdct_inputBox">
						<div class="cdct_info"><span>单位电话</span></div>
						<input class="cdct_input" disabled v-model="objData.CGZDWDH">
					</div>
					<div class="cdct_inputBox">
						<div class="cdct_info"><span>档案编号</span></div>
						<input class="cdct_input" disabled v-model="objData.CGRDAID">
					</div>
					<div class="cdct_inputBox">
						<div class="cdct_info"><span>邮政编码</span></div>
						<input class="cdct_input" disabled v-model="objData.CYZBM">
					</div>
					<div class="cdct_inputBox">
						<div class="cdct_info"><span>患者性质</span></div>
						<input class="cdct_input" disabled v-model="objData.IBRXZ">
					</div>
					<div class="cdct_inputBox" style="display: flex; width: 100%; margin-right: 25px;">
						<div class="cdct_info"><span>居住地址</span></div>
						<input class="cdct_input" disabled v-model="address" style="flex: 1;">
					</div>

				</div>
				<div class="cdct_main">
					<div class="cdct_title title2">会诊病历</div>
					<div class="cdct_textarea" style="display: flex; width: 100%; margin-right: 25px;">
						<div class="cdct_info"><span>既&ensp;往&ensp;史</span></div>
						<x-textarea :max="500" style="flex:1;" v-model="objData.CJWS" readonly></x-textarea>
					</div>
					<div class="cdct_textarea" style="display: flex; width: 100%; margin-right: 25px;">
						<div class="cdct_info"><span>过&ensp;敏&ensp;史</span></div>
						<x-textarea :max="500" style="flex:1;" v-model="objData.CGMS" readonly></x-textarea>
					</div>
					<div class="cdct_textarea" style="display: flex; width: 100%; margin-right: 25px;">
						<div class="cdct_info"><span>现&ensp;病&ensp;史</span></div>
						<x-textarea :max="500" style="flex:1;" v-model="objData.CXBS" readonly></x-textarea>
					</div>
				</div>
			</scroll>
		</div>
	</div>
</template>

<script>
import { XTextarea } from 'vux'
export default {
  	name: 'PatientDetails',
  	components:{
		XTextarea
	},
	data () {
		return {
			TEST: 'xzxx',
			CBRID:'',
			address:'--',
			objData:{},
		}
	},
	mounted(){

		this.CBRID = this.$route.params.CBRID;
		this.initData();	

	},
	methods:{

		initData(){
                this.$ajax.post('',{
                    "MSH.1": "UtilCommon",
                    "MSH.2": "queryByCBRID",
					"token": localStorage.token,
					"FORMAT":"1",
					"CBRID":this.CBRID			
                }).then(res => {
					if( typeof res!='undefined'){						
						this.objData=res.data;				
						this.address = res.data.CDZS+res.data.CDZDQ+res.data.CDZQX+res.data.CDZXZ+res.data.CDZC;
						this.objData.DCSNY = this.objData.DCSNY ? this.objData.DCSNY.split(' ')[0] : '';
					}
                }).catch(error => {
                    console.log(error)
                });
            },

	},
}
</script>

<style lang="less" scoped>
</style>