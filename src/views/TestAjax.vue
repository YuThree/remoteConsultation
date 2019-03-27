<template>
	<div class="cdct_container" style=" background: #fff;">
		<div class="cdct_content cdct_relative">
			<div class="cdct_inputBox">
				<div class="cdct_info"><span>URL</span></div>
				<input class="cdct_input" v-model="URL">
			</div>
			<div class="cdct_textarea">
				<div class="cdct_info"><span>输入对象</span></div>
				<x-textarea :max="1000" :rows="5" v-model="objStr"></x-textarea>
			</div>
			<div class="cdct_btn" style="margin-top: 20px; float: right;" @click="sendAjax">测试</div>
			<div class="cdct_btn" style="margin-top: 20px; float: right;" @click="reset">重置</div>
		</div>
	</div>
</template>

<script>
import { XTextarea } from 'vux'
export default {
  name: 'TestAjax',
  components:{
  	XTextarea
  },
  mounted(){
    this.token = window.localStorage.token;
  	console.log(this.token)
  },
  data () {
    return {
    	token:'',
    	objStr:'',
    	Obj: {},
    	URL:'',
    }
  },
  methods: {
  	reset(){
  		this.objStr = '';
  	},
  	sendAjax(){
  		this.Obj = JSON.parse(this.objStr);
  		console.log(this.Obj);
  		this.$ajax.post(this.URL,this.Obj).then(res => {
  			
  		}).catch(error => {
  			console.log(error)
  		});
  	}
  }
}
</script>

<style lang="css" scoped>
</style>