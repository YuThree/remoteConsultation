<template>
    <div style="position:relative" @click.stop>
        <animation enter="fadeInRight faster" leave="fadeOut faster">
            <div class="messageBox__wrapper" v-show="show_value" :style="{marginTop:offsetTop,marginLeft:offsetLeft}">
                <div style="overflow:hidden" ref="test" :style="{width:width,maxHeight:maxHeight}">
                    <div>
                        <slot class="test"></slot>
                    </div>
                </div>
                <span class="messageBox__arrow"></span>
            </div>
        </animation>
    </div>
</template>

<script>
    import Animation from '@/components/animation'
    import BScroll from 'better-scroll'
    export default {
        props: ['offsetLeft', 'offsetTop', 'maxHeight', 'width'],
        components: {
            Animation
        },
        data() {
            return {
                show_value: false
            }
        },
        mounted() {
            document.body.addEventListener('click', () => {
                if (this.show_value) {
                    this.show_value = false;
                }
            }, false)
            this.$nextTick(() => {
                this.scroll = new BScroll(this.$refs.test, {
                    stopPropagation: true,
                    click: true
                })
            })
        },
        methods: {
            show() {
                setTimeout(() => {
                    this.show_value = !this.show_value;
                }, 0);
                this.$nextTick(() => {
                    this.show_value && this.scroll.refresh()
                })
            }
        },
    }
</script>

<style lang="less" scoped>
    .messageBox__wrapper {
        position: absolute;
        background: #657da0;
        border-radius: 2px;
        z-index: 99;
    }
    .messageBox__arrow {
        content: '';
        position: absolute;
        z-index: 99;
        border: 5px solid transparent;
        border-left: 5px solid #657da0;
        right: -10px;
        top: 10px;
    }
</style>