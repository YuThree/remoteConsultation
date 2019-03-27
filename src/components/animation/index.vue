<template>
    <div>

        <transition     
            :enter-active-class="'animated '+ enter"
            :leave-active-class="'animated '+ leave"            
        >
            <slot></slot> 
        </transition>
    </div>
</template>

<script>
    export default {
      props:['enter','leave']  
    }
</script>

<style scoped>
    @import 'animate.css';
    .animation__wrapper{
        display: inline-block;
    }
</style>