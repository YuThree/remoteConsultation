
<template>
    <div class="schedule-arrange">
        <div class="day-arrange" 
            v-for="(inx,index) in this.day" 
            :key="index">

            <div class="time-column" 
                v-for="(obj,len) in data[index]" 
                :key="len"
                @click="handleClick(obj)">
                <div class="engaged" :class="{'is-arrange':obj.tips}" v-if="obj.tips">○&ensp;已排班</div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
  name: "timeSchedule",

  props: {
    numbers: {
      //每一次显示多少天数或者周数
      type: Number,
      default: 14
    },
    types: {
      //以周为单位，还是天
      type: String,
      default: "day"
    },
    //第几周
    //默认为当前周
    //上一周:-1，下一周:1。已次类推
    week: {
      type: Number,
      default: 0
    },
    data: {
        required:true
    },
  },

  data() {
    return {};
  },
  methods:{
      handleClick(obj){
          this.$emit("date-click", obj);
      }
  },
  computed: {
    day() {
      return this.types === "day" ? this.numbers : this.numbers * 7;
    }
  }
};
</script>

<style scoped>
.schedule-arrange {
  display: flex;
  width: 100%;
}
.day-arrange {
  width: 100%;
  flex: 1;
  border-bottom: 1px solid #e1e1e1;
  border-right: 1px solid #e1e1e1;
}
.day-arrange:last-of-type {
  border-right:none;
}
.time-column {
  width: 100%;
  box-sizing: border-box; 
  text-overflow: ellipsis;
  vertical-align: middle;
  position: relative;
  text-align: center;
  border-top: 1px solid #e1e1e1;
  height: 12rem;
  overflow: hidden;
  display: flex;
  align-items:center;
}

.cell {
  font-size: 1.4rem;
  color: #666666;
  position: relative;
  width: 100%;
}
.engaged {
  color: white;
  font-size: 1.4rem;
  position: absolute;
  left: 50%;
  top: 2.2rem;
  transform: translateX(-50%);
  white-space: nowrap;
  border-radius: 2px;
  line-height: 2.8rem;
  width: calc(100% - 12px);
}
.is-arrange {
  background: #0096FF;
}
</style>

