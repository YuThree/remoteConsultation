const RemoteConsultation = () => import('@/views/RemoteConsultation/index.vue').then(m => m.default)
const Workstation = () => import('@/views/RemoteConsultation/Workstation').then(m => m.default)
// const Workstation1 = () => import('@/views/RemoteConsultation/Workstation/index1').then(m => m.default)
const NewApplication = () => import('@/views/RemoteConsultation/NewApplication').then(m => m.default)
const applicationManagement1 = () => import('@/views/RemoteConsultation/applicationManagement1').then(m => m.default)
const applicationManagement2 = () => import('@/views/RemoteConsultation/applicationManagement2').then(m => m.default)
const ConsultationManagemen1 = () => import('@/views/RemoteConsultation/ConsultationManagemen1').then(m => m.default)
const ConsultationManagemen2 = () => import('@/views/RemoteConsultation/ConsultationManagemen2').then(m => m.default)
const thePatientList = () => import('@/views/RemoteConsultation/thePatientList').then(m => m.default)
// DG
const ConsultationArrange = () => import('@/views/RemoteConsultation/ConsultationArrange').then(m => m.default);
const ApplicationDetails = () => import('@/views/RemoteConsultation/ApplicationDetails').then(m => m.default);
const EditApplication = () => import('@/views/RemoteConsultation/EditApplication').then(m => m.default);
// YBC
const schedulingInformation = () => import('@/views/RemoteConsultation/schedulingInformation').then(m => m.default)





export default [
    {
        path: '/RemoteConsultation',
        component: RemoteConsultation,
        meta: {
          keepAlive: true
        },
        children:[
        {
          path: '',
          redirect: 'Workstation'
        },
        {
          path:'Workstation',
          name:'Workstation',
          component:Workstation
        },
        // {
        //   path:'Workstation1',
        //   name:'Workstation1',
        //   component:Workstation1
        // },
        //新建申请
        {
          path:'NewApplication',
          name:'NewApplication',
          component:NewApplication,
          meta: {
            keepAlive: true
          }
        },
        //申请管理(申请端)
        {
          path:'applicationManagement1',
          name:'RCAM1',
          component:applicationManagement1
        },
        //申请管理(管理端)
        {
          path:'applicationManagement2',
          name:'RCAM2',
          component:applicationManagement2
        },
        { // 会诊管理(申请端)
          path:'ConsultationManagemen1',
          name:'RCCM1',
          component:ConsultationManagemen1
        },
        { // 会诊管理(管理端)
          path:'ConsultationManagemen2',
          name:'RCCM2',
          component:ConsultationManagemen2
        },

        //  公用的二级路由(三个系统公用)
        //患者列表
        {
          path:'thePatientList',
          name:'thePatientList',
          component:thePatientList
        },
        {  // 排班
            path:'schedulingInformation',
            name:'schedulingInformation',
            component:schedulingInformation
        },
        
      ]
    },
    {  // 会诊安排
        path:'/RC/ConsultationArrange',
        name:'ConsultationArrange',
        component:ConsultationArrange,
        meta: {
          keepAlive: true
        }
    },
    {  // 申请详情
        path:'/RC/ApplicationDetails',
        name:'ApplicationDetails',
        component:ApplicationDetails,
    },
    {  // 编辑申请详情
        path:'/RC/EditApplication',
        name:'EditApplication',
        component:EditApplication,
        meta: {
          keepAlive: true
        }
    },

]