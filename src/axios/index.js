import axios from 'axios'
import store from '../store'
import Vue from 'vue'
import qs from 'qs'
import Router from '@/router/index'

// axios.defaults.baseURL = 'http://192.168.104.212:8081/consulation/GPoutServlet';
axios.defaults.baseURL = process.env.BASEURL;

axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
axios.defaults.timeout = 15000;

let LoginAjax = false;

// 传参拦截器
axios.interceptors.request.use(config=> {
	store.state.CONTROL_LOADDING = true;
	// 判断为post请求，序列化传来的参数
	if (config.method === 'post' || config.method === 'put' || config.method === 'delete') {
	}
	// 如果是登录接口
	if(config.url.indexOf('loginCheck') != -1 || config.url.indexOf('exitLogin')!= -1){
		LoginAjax = true;
	}else{
		LoginAjax = false;
		// config.data = JSON.stringify(config.data);//连调注释该行 打包放开
	}
	return config;
}, error=> {
	Vue.$MessageCase.show(error,'error');
	return Promise.reject(error);
})

// 响应拦截器
axios.interceptors.response.use(res => {
	// 请求成功时要做的处理
	if(res.status===200) {
		if(res.data.code == '100'){
			return res.data;
		}else{
			if(!LoginAjax){
				if(res.data.code == '200' && res.data.msg == 'token验证失效'){
					Vue.$MessageCase.show(res.data.msg,'serverErr').then(()=>{
						Router.push({
							path: '/',
							redirect:Router.currentRoute.fullPath
						},
							
						)
					})
				}else{
					res.data.msg && Vue.$MessageCase.show(res.data.msg,'error')
				}
				
			}
			return res.data;
		}
		
	}

}, error => {
	console.log(error,'错误提示');
	//  1.判断请求超时
	if (error.code === 'ECONNABORTED' && error.message.indexOf('timeout') !== -1) {
		Vue.$MessageCase.show('请求超时','serverErr');
	}
	if (error && error.response) {
		switch (error.response.status) {
			case 400:
				error.message = '请求错误'
				break

			case 401:
				error.message = '未授权，请登录'
				break

			case 403:
				error.message = '拒绝访问'
				break

			case 404:
				// error.message = `请求地址出错: ${error.response.config.url}`
				error.message = '请求地址出错'
				break

			case 500:
				error.message = '服务器内部错误'
				break

			case 501:
				error.message = '服务未实现'
				break

			case 502:
				error.message = '网关错误'
				break

			case 503:
				error.message = '服务不可用'
				break

			case 504:
				error.message = '网关超时'
				break

			case 505:
				error.message = 'HTTP版本不受支持'
				break

			default:
				
		}
		if(error.response.status>=500){
			Vue.$MessageCase.show(error.message,'500');
		}else if(error.response.status>400 && error.response.status!=404){
			Vue.$MessageCase.show(error.message,'serverErr');
		}
	}else{
		Vue.$MessageCase.show('服务错误','serverErr');
	}
	return Promise.reject(error);
})

Vue.prototype.$ajax = axios


