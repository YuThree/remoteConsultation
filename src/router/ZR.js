const ViewRecords = () => import('@/views/RemoteConsultation/ViewRecords').then(m => m.default)
const FillDiagnosis = () => import('@/views/RemoteConsultation/FillDiagnosis').then(m => m.default)
const ServiceEvaluation = () => import('@/views/RemoteConsultation/ServiceEvaluation').then(m => m.default)
const ViewInformation = () => import('@/views/RemoteConsultation/ViewInformation').then(m => m.default)
const FollowUpList = () => import('@/views/RemoteConsultation/FollowUpList').then(m => m.default)


export default [{ // 封面
  path: '/ViewRecords',
  name: 'ViewRecords',
  component: ViewRecords
}, { // 封面
  path: '/FillDiagnosis',
  name: 'FillDiagnosis',
  component: FillDiagnosis
}, { // 封面
  path: '/ServiceEvaluation',
  name: 'ServiceEvaluation',
  component: ServiceEvaluation
}, { // 封面
  path: '/ViewInformation',
  name: 'ViewInformation',
  component: ViewInformation
  }, { // 封面
    path: '/FollowUpList',
    name: 'FollowUpList',
    component: FollowUpList
  }, ]