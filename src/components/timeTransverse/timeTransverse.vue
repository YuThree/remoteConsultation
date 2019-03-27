<template>
    <div class="time-roll" ref="tab">
        <div class="time-tab">
            <div class="time-tab-li">
                <div class="time-tab-item" v-for='(obj,index) in timeDate' :key="index">
                    <div class="week" :class='{"is-pitch":index === today}'>星期{{obj.obj.ww}}</div>
                    <div class="date">{{obj.time}}</div>
                </div>
            </div>
            
            <div class="time-ink time-ink-transition-backward" ref="ink"></div>
        </div>
    </div>
</template>

<script>
export default {
  name: "timeTransverse",

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
    timeFormat: {
      //时间格式
      //@yyyy-@MM-@dd @hh:@mm:@ss
      type: String,
      default: "@yyyy-@MM-@dd"
    }
  },
  data() {
    return {
      liIndex: 0,
      timeDate: [],
      today:-1
    };
  },
  mounted() {
    this.timeDate = this.getWeekDay(this.numbers, this.types);
    this.$nextTick(() => {
       this.setTabWidth();
    });
  },
  methods: {
    getWeekDay(day, type = "day") {
      
      let i = 0,
        time = [];

      this.liIndex = 0;

      this.today = -1;

      this.$refs.ink.style.display = "none";

      if (type === "day") {
        for (i; i < day; i++) {
          time.push(this.getDay(i));
        }
      } else if (type === "week") {
        day = this.getWeek(7 * day);

        for (i; i < day.length; i++) {
          let num = day[i];

          time.push(this.getDay(num));

          if (num === 0) {//今天
            this.today = i;
            this.$refs.ink.style.left = i * 8.7 + "rem";
            this.$refs.ink.style.display = "block";
          }
        }
      }

      return time;
    },
    getWeek(day) {
      let week = [];
      let today = new Date();
      let tWeek = today.getDay();

      tWeek = tWeek === 0 ? 7 : tWeek;

      for (let i = 1; i <= day; i++) {
        week.push(i - tWeek + this.week * day);
      }

      return week;
    },
    getDay(day) {
      let today = new Date();

      let targetday_milliseconds = today.getTime() + 1000 * 60 * 60 * 24 * day;

      today.setTime(targetday_milliseconds);

      let dateObj = this.dateFormat(today);

      let time = this.formatDateTime(this.timeFormat, dateObj);

      return {
        time: time,
        date: today,
        obj: dateObj
      };
    },
    dateFormat(date) {
      return {
        yyyy: date.getFullYear(), //年
        MM: this.doHandleMonth(date.getMonth() + 1), //月
        dd: this.doHandleMonth(date.getDate()), //日
        hh: this.doHandleMonth(date.getHours()), //小时
        mm: this.doHandleMonth(date.getMinutes()), //分钟
        ss: this.doHandleMonth(date.getSeconds()), //秒
        ww: this.hanZiWeek(date.getDay()), //星期
        M: date.getMonth() + 1,
        d: date.getDate(),
        h: date.getHours(),
        m: date.getMinutes(),
        s: date.getSeconds(),
        w: date.getDay()
      };
    },
    formatDateTime(format, values) {
      if (!values) return format;

      return format.replace(
        /\@(\w+)/g,
        function(txt, key) {
          if (values.hasOwnProperty(key)) {
            return values[key];
          }

          return txt;
        }.bind(this)
      );
    },

    hanZiWeek(z) {
      let w = {
        1: "一",
        2: "二",
        3: "三",
        4: "四",
        5: "五",
        6: "六",
        0: "日"
      };

      return w[z] || "";
    },
    doHandleMonth(month) {
      let m = month;
      if (month.toString().length == 1) {
        m = "0" + month;
      }
      return m;
    },
    getOffsetRect(element) {
      let elementRect = {
        width: element.offsetWidth,
        height: element.offsetHeight,
        left: element.offsetLeft,
        top: element.offsetTop
      };

      elementRect.right = elementRect.left + elementRect.width;
      elementRect.bottom = elementRect.top + elementRect.height;
      return elementRect;
    },
    setTabWidth() {
      let div = this.$refs.tab.querySelectorAll(".time-tab-item");
      let width = div[0].offsetWidth;
      let len = div.length;

      this.$refs.tab.style.width = width * len + "px";
       let dateToTop=this.timeDate ;
      this.$emit('frombottom', dateToTop); 
    }
  },
  watch: {
    week(num) {
      this.timeDate = this.getWeekDay(this.numbers, this.type);
      this.$emit('frombottom', timearey); 
    }
  }
};
</script>

<style scoped>
.time-roll {
  width: 100%;
  height: 51px;
}

.time-tab {
  height: 100%;
  position: relative;
}

.time-tab-li {
  height: 100%;
  display: -webkit-box;
  display: -webkit-flex;
  display: flex;
}

.time-tab-item {
  flex: 1;
  height: 100%;
  box-sizing: border-box;
  overflow: hidden;
  border-right: 1px solid #D8D8D8;
}

.date {
  color: white;
  font-size: 1.3rem;
  text-align: center;
  line-height: 1.6rem;
}

.week {
  color: white;
  font-size: 1.4rem;
  margin-top: .6rem;
  text-align: center;
  line-height: 1.8rem;
}

.time-ink {
  width: 6px;
  height: 6px;
  /* background: #29c2b3; */
  position: absolute;
  bottom: 0.6rem;
  left: 0;
  border-radius: 100%;
  margin-left: 4.3rem;
}

.is-pitch.week {
  /* color: #333333; */
}
</style>
