const ConsultationArrange = () => import('@/views/RemoteConsultation/ConsultationArrange').then(m => m.default);
const ApplicationDetails = () => import('@/views/RemoteConsultation/ApplicationDetails').then(m => m.default);
const MedicalRecords = () => import('@/views/RemoteConsultation/MedicalRecords').then(m => m.default);
const PersonalInfo = () => import('@/views/RemoteConsultation/PersonalInfo').then(m => m.default);
const PatientDetails = () => import('@/views/RemoteConsultation/PatientDetails').then(m => m.default);
const EditApplication = () => import('@/views/RemoteConsultation/EditApplication').then(m => m.default);



export default [
	{  // 会诊安排
	    path:'/ConsultationArrange',
	    name:'ConsultationArrange',
	    component:ConsultationArrange
	},
	{  // 申请详情
	    path:'/ApplicationDetails',
	    name:'ApplicationDetails',
	    component:ApplicationDetails
	},
	{  // 病历中心
	    path:'/MedicalRecords',
	    name:'MedicalRecords',
	    component:MedicalRecords
	},
	{  // 个人基本资料
	    path:'/PersonalInfo',
	    name:'PersonalInfo',
	    component:PersonalInfo
	},
	{  // 患者详情
	    path:'/PatientDetails',
	    name:'PatientDetails',
	    component:PatientDetails
	},
	{  // 编辑申请详情
	    path:'/EditApplication',
	    name:'EditApplication',
	    component:EditApplication
	},


]