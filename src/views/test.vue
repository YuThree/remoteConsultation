<template>
    <div style="height:100%">
        <scroll>
                <button @click="anishow = !anishow">anishow</button>
                <button @click="ICD_show = !ICD_show">ICD-10</button>
                <button @click="modal = !modal">modal</button>
                <button @click="smodal = !smodal">select-modal</button>
                <animation enter="zoomIn faster" leave="zoomOut faster">
                    <div v-show="anishow" style="width:100px;height:100px;background:red"></div>
                </animation>
                <button @click.stop="$refs['messageShow'].show">messageShow</button>      
                <message-box 
                    ref="messageShow" 
                    offsetTop="-20px" 
                    offsetLeft="10px"
                    maxHeight="177px"
                    width="156px"
                >
                    <!-- 内容自定义 -->
                    <div>
                        <ul>
                            <li>1111</li>
                            <li>22222</li>
                            <li>3333</li>
                            <li>4444</li>
                            <li>55555</li>
                            <li>6666</li>
                            <li>7777</li>
                            <li>88888</li>
                            <li>9999</li>
                            <li>10101010s</li>
                            <li>10101010s</li>
                            <li>10101010s</li>
                            <li>10101010s</li>
                        </ul>
                    </div>                     
                </message-box>
                <button @click="processShow = !processShow">processBox</button>
                <div style="padding-right:20px">
                    <process-box v-model="processShow">
                        <process-item step="1" done >建立申请单</process-item>
                        <process-item step="2" current>病例资料</process-item>
                        <process-item step="3">会诊安排</process-item>
                        <process-item step="4">视屏会诊</process-item>
                        <process-item step="5">专家报告</process-item>
                        <process-item step="6">会诊结束</process-item>
                    </process-box>
                </div>
        </scroll>
                <icd-select v-model="ICD_show"></icd-select>
                <modal v-model="modal" :nofooter="true">
                    <div style="width:400px;height:400px"></div>
                </modal>
                <select-modal v-model="smodal"></select-modal>
        
    </div>
</template>

<script>
    import Animation from '@/components/animation'
    import IcdSelect from '@/components/ICD_select'
    import Modal from '@/components/modal'
    import selectModal from '@/components/modal/selectModal.vue'
    import messageBox from '@/components/messageBox'
    import processBox from '@/components/processBox'
    import processItem from '@/components/processBox/processItem'
    export default {
        components:{
            Animation,IcdSelect,Modal,messageBox,selectModal,processBox,processItem
        },
        data() {
            return {
                anishow:false,
                ICD_show:false,
                modal:false,
                smodal:false,
                processShow:false,
            }
        }
    }
</script>

<style scoped>

</style>