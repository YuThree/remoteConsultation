const Workstation = () => import('@/views/RemoteECG/Workstation').then(m => m.default)
const applicationManagement1 = () => import('@/views/RemoteECG/applicationManagement1').then(m => m.default)
const applicationManagement2 = () => import('@/views/RemoteECG/applicationManagement2').then(m => m.default)
const ConsultationManagemen1 = () => import('@/views/RemoteECG/ConsultationManagemen1').then(m => m.default)
const ConsultationManagemen2 = () => import('@/views/RemoteECG/ConsultationManagemen2').then(m => m.default)
// DG
const RemoteECG = () => import('@/views/RemoteECG/index.vue').then(m => m.default)
const NewApplication = () => import('@/views/RemoteECG/NewApplication').then(m => m.default)
const ConsultationArrange = () => import('@/views/RemoteECG/ConsultationArrange').then(m => m.default);
const ApplicationDetails = () => import('@/views/RemoteECG/ApplicationDetails').then(m => m.default);
const EditApplication = () => import('@/views/RemoteECG/EditApplication').then(m => m.default);




export default [
    {
        path: '/RemoteECG',
        component: RemoteECG,
        children:[
        {
          path: '',
          redirect: '/RemoteECG/Workstation'
        },
        {
          path:'Workstation',
          name:'Workstation2',
          component:Workstation
        },
        //新建申请
        {
          path:'NewApplication',
          name:'NewApplication2',
          component:NewApplication
        },
        //申请管理(申请端)
        {
          path:'applicationManagement1',
          name:'RECGAM1',
          component:applicationManagement1
        },
        //申请管理(管理端)
        {
          path:'applicationManagement2',
          name:'RECGAM2',
          component:applicationManagement2
        },
        { // 会诊管理(申请端)
          path:'ConsultationManagemen1',
          name:'RECGCM1',
          component:ConsultationManagemen1
        },
        { // 会诊管理(管理端)
          path:'ConsultationManagemen2',
          name:'RECGCM2',
          component:ConsultationManagemen2
        },
        
      ]
    },
    {  // 会诊安排
        path:'/RECG/ConsultationArrange',
        name:'ConsultationArrange2',
        component:ConsultationArrange
    },
    {  // 申请详情
        path:'/RECG/ApplicationDetails',
        name:'ApplicationDetails2',
        component:ApplicationDetails
    },
    {  // 编辑申请详情
        path:'/RECG/EditApplication',
        name:'EditApplication2',
        component:EditApplication
    },

]