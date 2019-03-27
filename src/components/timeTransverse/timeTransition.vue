<template>
    <div class="time-week" ref="roll">
        <div ref="company">
            <transition
                :name="name">
                <div v-if="show" key="last" style="height:100%;position: relative;">
                    <time-transverse
                        class="fade"
                        @time-click="handleClick"
                        timeFormat="@M月@d日"
                        :types="types"
                        :numbers="numbers"
                        :week="week" @frombottom="changeDate">
                    </time-transverse>
                    <time-schedule 
                        class="schedule"
                        ref="day"
                        :types="types"
                        :numbers="numbers"
                        :week="week"
                        :data="data"
                        @date-click="handeleDateClick"
                        >
                    </time-schedule>
                </div>
                
                <div v-else key="next" style="height:100%;position: relative;">
                    <time-transverse
                        class="fade"
                        @time-click="handleClick"
                        timeFormat="@M月@d日"
                        :types="types"
                        :numbers="numbers"
                        :week="week" @frombottom="changeDate">
                    </time-transverse>
                    <time-schedule 
                        class="schedule"
                        ref="day"
                        :types="types"
                        :numbers="numbers"
                        :week="week"
                        :data="data"
                        @date-click="handeleDateClick"
                        >
                    </time-schedule>
                </div>
            </transition>
        </div>
    </div>
</template>

<script>
import BScroll from "better-scroll";
import timeTransverse from "./timeTransverse";
import timeSchedule from "./timeSchedule";
export default {
  name: "timeTransition",

  components: {
    timeTransverse,
    timeSchedule
  },
  props: {
    //第几周
    //默认为当前周
    //上一周:-1，下一周:1。已次类推
    week: {
      type: Number,
      default: 0
    },
    //每一次显示多少天数或者周数
    numbers: {
      type: Number,
      default: 1
    },
    //以周为单位，还是天
    types: {
      type: String,
      default: "week"
    },
    data: {
      required: true
    }
  },
  data() {
    return {
      name: "time-fade-right",
      show: true
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.$refs.company.style.width = this.$refs.day.$el.clientWidth + "px";
      this.slide = new BScroll(this.$refs.roll, {
        scrollX: true,
        scrollY: false,
        click: true
      });
    });
  },
  methods: {
    handleClick(obj, index) {
      this.$emit("time-click", obj, this.liIndex);
    },
    handeleDateClick(obj) {
      this.$emit("date-click", obj);
    },
    changeDate(obj){
      this.$emit("headCallBack", obj);//调用父页面 headCallBack事件
    }
  },
  watch: {
    week(newNum, oldNum) {
      if (newNum < oldNum) {
        this.name = "time-fade-right";
      } else {
        this.name = "time-fade-left";
      }

      this.slide.refresh();

      this.show = !this.show;

    }
  }
};
</script>
<style scoped>
.time-week {
  width: 100%;
  height: 100%;
}
.fade {
  position: absolute;
  height: 51px;
}
.schedule {
  position: absolute;
  top: 51px;
  left: 0;
  background-color: white;
}
.time-fade-left-enter-active,
.time-fade-left-leave-active {
  transition: transform 600ms cubic-bezier(0.23, 1, 0.32, 1);
}
.time-fade-left-enter {
  transform: translateX(100%);
}
.time-fade-left-leave-active {
  transform: translateX(-100%);
}

.time-fade-right-enter-active,
.time-fade-right-leave-active {
  transition: transform 600ms cubic-bezier(0.23, 1, 0.32, 1);
}
.time-fade-right-enter {
  transform: translateX(-100%);
}
.time-fade-right-leave-active {
  transform: translateX(100%);
}
</style>
