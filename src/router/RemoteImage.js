const RemoteImage = () => import('@/views/RemoteImage/index.vue').then(m => m.default)
const Workstation = () => import('@/views/RemoteImage/Workstation').then(m => m.default)
const NewApplication = () => import('@/views/RemoteImage/NewApplication').then(m => m.default)
const applicationManagement1 = () => import('@/views/RemoteImage/applicationManagement1').then(m => m.default)
const applicationManagement2 = () => import('@/views/RemoteImage/applicationManagement2').then(m => m.default)
const ConsultationManagemen1 = () => import('@/views/RemoteImage/ConsultationManagemen1').then(m => m.default)
const ConsultationManagemen2 = () => import('@/views/RemoteImage/ConsultationManagemen2').then(m => m.default)
// DG
const ConsultationArrange = () => import('@/views/RemoteImage/ConsultationArrange').then(m => m.default);
const ApplicationDetails = () => import('@/views/RemoteImage/ApplicationDetails').then(m => m.default);
const EditApplication = () => import('@/views/RemoteImage/EditApplication').then(m => m.default);




export default [
    {
        path: '/RemoteImage',
        component: RemoteImage,
        children:[
        {
          path: '',
          redirect: '/RemoteImage/Workstation'
        },
        {
          path:'Workstation',
          name:'Workstation1',
          component:Workstation
        },
        //新建申请
        {
          path:'NewApplication',
          name:'NewApplication1',
          component:NewApplication
        },
        //申请管理(申请端)
        {
          path:'applicationManagement1',
          name:'RIAM1',
          component:applicationManagement1
        },
        //申请管理(管理端)
        {
          path:'applicationManagement2',
          name:'RIAM2',
          component:applicationManagement2
        },
        { // 会诊管理(申请端)
          path:'ConsultationManagemen1',
          name:'RICM1',
          component:ConsultationManagemen1
        },
        { // 会诊管理(管理端)
          path:'ConsultationManagemen2',
          name:'RICM2',
          component:ConsultationManagemen2
        },
        
      ]
    },
    {  // 会诊安排
        path:'/RI/ConsultationArrange',
        name:'ConsultationArrange1',
        component:ConsultationArrange
    },
    {  // 申请详情
        path:'/RI/ApplicationDetails',
        name:'ApplicationDetails1',
        component:ApplicationDetails
    },
    {  // 编辑申请详情
        path:'/RI/EditApplication',
        name:'EditApplication1',
        component:EditApplication
    },

]