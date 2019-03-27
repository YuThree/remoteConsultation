const uploadTheCases = () => import('@/views/RemoteConsultation/uploadTheCases').then(m => m.default)
const systemMessage = () => import('@/views/RemoteConsultation/systemMessage').then(m => m.default)
const prescriptionReport = () => import('@/views/RemoteConsultation/prescriptionReport').then(m => m.default)



export default [
	{  // 上传病例
	    path:'/uploadTheCases',
	    name:'uploadTheCases',
	    component:uploadTheCases
	},
	{  // 系统消息
	    path:'/systemMessage',
	    name:'systemMessage',
	    component:systemMessage
	},
	{  // 处方报告
	    path:'/prescriptionReport',
	    name:'prescriptionReport',
	    component:prescriptionReport
	},
	
]