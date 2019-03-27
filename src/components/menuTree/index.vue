<template>
    <div class="tree-menu__main-wrapper">           
        <tree-menu ref="menuItems" :treeLv="treeLv" :active="active" v-for="(item,index) in BaseData" :key="index" :menu="item" />
    </div>
</template>

<script>
    import TreeMenu from './treeMenu'
    import Vue from 'vue'
import { debug } from 'util';
    const Bus = new Vue()
    export default {
        props:{
            BaseData:{
                type:Array,
                default:()=>[
                        {
                            title:'工作台',
                            children:[
                                {
                                    title:'数据1',
                                    children:[
                                        {
                                            title:'数据1-1',
                                            children:[
                                                {
                                                    title:'数据1-1-1',
                                                    path:''
                                                },
                                                {
                                                    title:'数据1-1-2',
                                                },
                                            ]
                                        },
                                        {
                                            title:'数据1-2',
                                            path:''
                                        },
                                        {
                                            title:'数据1-3',
                                            path:''
                                        },
                                        {
                                            title:'数据1-4',
                                            path:''
                                        },
                                    ]
                                },
                                {
                                    title:'数据2',
                                    path:''
                                },
                                {
                                    title:'数据3',
                                    children:[
                                        {
                                            title:'数据3-1',
                                            path:''
                                        },
                                        {
                                            title:'数据3-2',
                                            path:''
                                        },
                                    ]
                                }
                            ]
                        },
                        {
                            title:'远程会诊管理',
                            path:''
                        },
                        {
                            title:'患者信息',
                            path:''
                        },
                        {
                            title:'排班信息',
                            path:''
                        }
                    ]
                    
                
            }
        },
        data() {
            return {
                active: '',
                showActive:false,
                treeLv:0
            }
        },
        components:{
            TreeMenu
        },
        created() {
            this.$root.treeMenuBus = Bus;
            //设置选中状态
            Bus.$on('setActive',(msg) =>{
                this.active = msg;
            })
            //默认选中第一个
            if(this.BaseData.length > 0){
                this.active = this.BaseData[0].title;
            }
        },
        
      
    }
</script>

<style lang="less" scoped>
    .tree-menu__main-wrapper{
        position: relative;
        width: 100%;
        .tree-menu__active{
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            background:linear-gradient(90deg,rgba(48,194,250,0.84) 0%,rgba(2,147,253,0.93) 100%);
        }
    }
</style>