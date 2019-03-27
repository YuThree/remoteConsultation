<template>
    <div class="tree-menu__treeMenu-wrapper">
        <div class="treeMenu__title"
        ref="treeMenu__title"
        :style="{paddingLeft:16+treeLv*15+'px'}" 
        :class="{'treeMenu__active-level0':hasChild && treeLv===0,'treeMenu__active':(!hasChild || treeLv===0) && isAct}"        
        @click="openMenu">
            <div ref="treeMenu__titleBg" 
            class="treeMenu__titleBg"
            :class="{'treeMenu__active-level0':hasChild && treeLv===0,'treeMenu__active':(!hasChild || treeLv===0) && isAct}"
            ></div>
            <span style="display:inline-block;width:12px;height:13px;margin-right:10px"></span>
            <span>
                {{menu.title}} 
            </span>
            <span class="treeMenu__arrow" :class="{treeMenu__arrowRotate:realIsOpen}" v-if="hasChild">›</span>
        </div> 
        <div class="treeMenu__subWrapper" ref="treeMenu__subWrapper" v-show="isOpen" v-if="hasChild">
            <tree-menu 
                v-for="(item,index) in menu.children"
                :key="index"
                :menu="item"
                :active="active"
                :treeLv="currentLv"
            />
        </div>


    </div>
</template>

<script>
    import Animation from '@/components/animation'
    export default {
        components:{
            Animation
        },
        name:'treeMenu',
        props:{
            //列表对象
            menu:{
                type:Object
            },
            //当前的选中的对象的active值
            active:{
                type:String
            },
            //树形层级
            treeLv:{
                type:Number
            }
        },
        data() {
            return {
                isOpen:false,//折叠状态
                realIsOpen:false,//真实折叠状态
                activeIsChild:false,//后代元素是否处于选中状态
                finalHeight:'auto'//折叠容器最终的高度
            }
        },
        mounted() {
             

        },
        methods: {
            throttle(func,wait){
                this.previous = this.previous || 0;
                let _this = this;
                return function(){
                    let now = Date.now(),
                        args = arguments;
                    if(now - _this.previous > wait){                        
                        func.apply(_this,args);
                        _this.previous = now;
                    }
                }
            },
            openMenu(e) {             
                //过渡动画                
                this.throttle(this.treeAnimante,350)()  
            },
            //检查是否有后代处于active状态
            checkChild(childArr){
                let res = [];
                let fn = (arr) => {
                    if(Array.isArray(arr)){
                        arr.forEach(el => {
                            res.push(el.title);
                            fn(el.children);
                        });
                    }
                }
                fn(childArr);
                return res.indexOf(this.active) > -1;
            },
            //过渡动画函数 el元素,ms毫秒
            treeAnimante(){ 
                 //开关
                if(this.hasChild){
                    this.isOpen = !this.isOpen;
                    this.realIsOpen = !this.realIsOpen;
                }
                //添加最外层的可折叠按钮的状态，和普通没有后代选项的按钮的状态
                // if((this.hasChild && this.treeLv===0 && !this.activeIsChild) || !this.hasChild){
                //     this.$root.treeMenuBus.$emit('setActive',this.menu.title);             
                // }
                //没有后代的选项点击时加active状态
                if(!this.hasChild){
                    this.$root.treeMenuBus.$emit('setActive',this.menu.title);    
                    this.$router.push(this.menu.path)//跳转页面           
                }  

                if (typeof window.getComputedStyle === "undefined") return;
                if (!this.hasChild) return;
                let timer,//定时器
                    el = this.$refs.treeMenu__subWrapper,
                    ms = 300,
                    isOpen = this.isOpen;//拷贝打开状态                    
                el.style.transition = `all ${ms}ms`;
                //打开前元素处于display:none，拿不到元素高度，所以通过 按钮的高度*children.length获取初始化的高度
                if(this.finalHeight === 'auto'){
                    this.finalHeight = this.$el.clientHeight * this.menu.children.length+'px';                   
                }
                if(isOpen){                                       
                    el.style.height = 0;//高度归零
                }else{
                    //关闭前获取当前容器真实的高度
                    this.finalHeight = window.getComputedStyle(el).height;
                    el.style.height = this.finalHeight;//高度还原
                    this.isOpen = true;//状态设置为打开，阻止直接关闭
                }
                    
                this.$nextTick(() => {
                    let fn;
                    if(isOpen){
                        setTimeout(()=>{
                            el.style.height = this.finalHeight;//设置最终高度
                        },20)
                        fn = () => {el.style.height = 'auto'}//过渡完成后还原高度，保证后代元素打开后高度的扩展
                    }else{
                        setTimeout(()=>{
                            el.style.height = 0;
                        },0)                        
                        fn = () => {el.style.height = 'auto';this.isOpen = false;}//过渡完成后还原高度，状态设置为false
                    }                   
                    clearTimeout(timer);
                    timer = setTimeout(fn,ms)//延时调用
                })
             }
        },
        computed: {
            //是否有后代
            hasChild(){
                return this.menu.children && this.menu.children.length
            },
            //判断是否为active状态
            isAct(){
                if(this.treeLv === 0){
                    this.activeIsChild = this.checkChild(this.menu.children);
                }
                return this.active === this.menu.title || this.activeIsChild;
            },
            //当前层级
            currentLv(){
                return this.treeLv+1;
            }
            
        } 
    }
</script>

<style lang="less" scoped>
    @activeBgTransition : .3s;//背景和箭头的过渡时间
    .tree-menu__treeMenu-wrapper{        
        .treeMenu__title{
            position: relative;
            padding: 12px 16px;
            font-size: 1.3rem;
            position: relative;
            color: rgba(51, 51, 51, 1);
            font-weight:400;
            transition: color .1s;
            .treeMenu__arrow{
                float: right;
                transition:transform @activeBgTransition;
                &.treeMenu__arrowRotate{
                    transform: rotate(90deg)
                }
            }
            &.treeMenu__active{
                color: #fff;
            }
            &.treeMenu__active-level0.treeMenu__active{
                color: rgba(30, 135, 240, 1);
            }
            span{
                position: relative;
                z-index: 2;
            }
            .treeMenu__titleBg{
                position: absolute;
                left: 0;
                top: 0;
                width: 100%;
                height: 44px;
                z-index: 1;
                opacity: 0;
                transition: opacity @activeBgTransition;
                &.treeMenu__active{
                    background:linear-gradient(90deg,rgba(48,194,250,0.84) 0%,rgba(2,147,253,0.93) 100%);
                    color: #fff;
                    opacity: 1;
                }
                &.treeMenu__active-level0.treeMenu__active{
                    color: rgba(30, 135, 240, 1);
                    background: #fff;
                    opacity: 1;
                }
                &.treeMenu__active-level0.treeMenu__active::before{
                    content: '';
                    position: absolute;
                    left: 0;
                    top:0;
                    height: 100%;
                    border-left: 2px solid rgba(30, 135, 240, 1);
                }
            }
        }
        
        .treeMenu__subWrapper{
            background: rgba(250, 250, 250, 1);
            overflow: hidden; 
            transition: all .3s;                    
        }
        
    }

</style>