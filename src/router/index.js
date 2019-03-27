import Vue from 'vue'
import Router from 'vue-router'
import store from '../store'
Vue.use(Router)

const Test = () => import('@/views/test.vue').then(m => m.default)
const TestAjax = () => import('@/views/TestAjax.vue').then(m => m.default)
// DG
const Home = () => import('@/views/index').then(m => m.default)
const PersonalInfo = () => import('@/views/PersonalInfo').then(m => m.default);
const PatientDetails = () => import('@/views/PatientDetails').then(m => m.default);
const Login = () => import('@/views/Login').then(m => m.default);
const ChangePassword = () => import('@/views/ChangePassword').then(m => m.default);
const MedicalRecords = () => import('@/views/MedicalRecords').then(m => m.default);

// YBC
const selectDoc = () => import('@/views/selectDoc').then(m => m.default);
const uploadTheCases = () => import('@/views/uploadTheCases').then(m => m.default);
const prescriptionReport = () => import('@/views/prescriptionReport').then(m => m.default)

// ZR
const FillDiagnosis = () => import('@/views/FillDiagnosis').then(m => m.default);
const ServiceEvaluation = () => import('@/views/ServiceEvaluation').then(m => m.default);
const ViewInformation = () => import('@/views/ViewInformation').then(m => m.default);
const FollowUpList = () => import('@/views/FollowUpList').then(m => m.default);
const systemMessage = () => import('@/views/systemMessage').then(m => m.default)
const ViewRecords = () => import('@/views/ViewRecords').then(m => m.default)


import RemoteConsultation from '@/router/RemoteConsultation'; // 远程会诊
import RemoteImage from '@/router/RemoteImage'; // 远程影像
import RemoteECG from '@/router/RemoteECG'; // 远程心电


const router =  new Router({
  routes: [
    {
        path:'/Home',
        component:Home,
        name:'Home'
    },
    {
      path: '/test',
      name: 'name',
      component: Test
    },
    {
      path: '/TestAjax',
      name: 'TestAjax',
      component: TestAjax
    },
    { // 登录
      path: '/',
      name: 'Login',
      component: Login
    },
    { // 修改密码
      path: '/ChangePassword',
      name: 'ChangePassword',
      component: ChangePassword
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
    {  // 选择医生
        path:'/selectDoc',
        name:'selectDoc',
        component:selectDoc
    },
    {  // 上传病历
        path:'/uploadTheCases',
        name:'uploadTheCases',
        component:uploadTheCases
    },
    {  // 病历中心
        path:'/MedicalRecords',
        name:'MedicalRecords',
        component:MedicalRecords
    },
    {  // 填写报告单
        path:'/FillDiagnosis',
        name:'FillDiagnosis',
        component:FillDiagnosis
    },
    {  // 服务与评价
        path:'/ServiceEvaluation',
        name:'ServiceEvaluation',
        component:ServiceEvaluation
    },
    {  // 查看资料
        path:'/ViewInformation',
        name:'ViewInformation',
        component:ViewInformation
    },
    {  // 患者随访单
        path:'/FollowUpList',
        name:'FollowUpList',
        component:FollowUpList
    },
    {  // 系统消息
        path:'/systemMessage',
        name:'systemMessage',
        component:systemMessage
    },
    { // 查看病历
      path: '/ViewRecords',
      name: 'ViewRecords',
      component: ViewRecords
    },
    {  // 处方报告
        path:'/prescriptionReport',
        name:'prescriptionReport',
        component:prescriptionReport
    },


    ...RemoteConsultation,  // 远程会诊
    ...RemoteImage,  // 远程影像
    ...RemoteECG,  // 远程心电
  ],
  scrollBehavior (to, from, savedPosition) {
    return { x: 0, y: 0 }
  }
})

router.beforeEach((to, from, next) => {
  store.commit('updateLoadingStatus', {
    // isLoading: true
  });
  next();
})
router.afterEach((to) => {
  setTimeout(() => {
    store.commit('updateLoadingStatus', {
      // isLoading: false
    });
  }, 500)
})

export default router