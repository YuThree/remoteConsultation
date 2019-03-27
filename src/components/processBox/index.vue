<template>
    <animateion enter="fadeIn faster" leave="fadeOut faster">
        <div class="procsss__wrapper" v-show="value">
            <slot></slot>
        </div>
    </animateion>
</template>

<script>
    import Animateion from '@/components/animation'
    export default {
        props:['value'],
        components:{Animateion},
        mounted() {
            document.body.addEventListener('click',()=>{
              this.value && this.$emit('input',false);
            },false)
        },
    }
</script>

<style lang="less" scoped>
    .procsss__wrapper{
        display: flex;
        flex-direction: row;
        justify-content: space-around;
        flex-wrap: nowrap;
        height:108px;
        background:#fff;
        box-shadow:0px 4px 8px 0px rgba(206,215,227,1);
        border-radius:8px;
        position: relative;
        &::after{
            content:'';
            display: inline-block;
            position: absolute;
            width: 0;
            height: 0;
            border: 10px solid transparent;
            border-left-color: #fff;
            right: -19px;
            top:15px;
            
        }
    }
</style>