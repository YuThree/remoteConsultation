<template>
  <div class="el-box">
    <div class="el-select">
      <div class="el-input el-input--suffix" @click="handleClick">
        <!-- 多选 -->
        <div
          v-if="multiple"
          class="el-select__tags el-input__inner"
          ref="reference"
          :class="{'is-disabled':form_disabled}"
        >
          <div v-if="selected.length === 0" v-html="this.placeholderSpan()"></div>
          <span v-else>
            <!-- 多选时是否将选中值按文字的形式展示 -->
            <span v-if="collapseTags">
              <span class="el-tag el-tag--info el-tag--small">
                <span class="el-select__tags-text">{{selected[0]}}</span>
              </span>
              <span v-if="selected.length > 1" class="el-tag el-tag--info el-tag--small">
                <span class="el-select__tags-text">+ {{ selected.length - 1 }}</span>
              </span>
            </span>
            <span
              v-else
              class="el-tag el-tag--info el-tag--small"
              v-for="(item,index) in selected"
              :key="index"
            >
              <span class="el-select__tags-text">{{item}}</span>
            </span>
          </span>
        </div>
        <!-- 单选 -->
        <div
          v-else
          class="el-input__inner el-input__single"
          ref="reference"
          v-html="query"
          :class="{'is-disabled':form_disabled}"
        ></div>
        <!-- 图标 -->
        <span class="el-input__suffix" :class="[suffixClass]">
          <span class="el-input__suffix-inner">
            <!-- 清空图标 -->
            <i
              v-if="!criteria && !multiple && clearable"
              class="el-select__caret el-input__icon is-show-close"
              @click.stop="emptyValue"
            ></i>
            <!-- 下拉显示图标 -->
            <i v-else :class="['el-select__caret', 'el-input__icon', iconClass]"></i>
          </span>
        </span>
      </div>
    </div>
    <!-- 下拉框 -->
    <transition v-bind:name="transitionName" v-on:after-enter="afterEnter">
      <div
        v-show="visible"
        class="el-select-dropdown el-popper"
        ref="popper"
        x-placement="bottom-start"
        :class="[{ 'is-multiple': this.multiple }]"
      >
        <div class="el-scrollbar">
          <!-- 搜索 -->
          <input v-if="filterable" class="el-select-input" placeholder="搜索" v-model="search">
          <!-- 提示 -->
          <p v-if="remote" class="el-select-dropdown__empty">{{empty}}</p>
          <!-- 内容 -->
          <div class="el-select-dropdown__wrap el-scrollbar__wrap" ref="scrollbar">
            <ul v-if="!remote" class="el-scrollbar__view el-select-dropdown__list">
              <slot></slot>
            </ul>
          </div>
        </div>
        <div class="popper__arrow" ref="arrow"></div>
      </div>
    </transition>
  </div>
</template>

<script>
import Emitter from "../../../assets/mixins/emitter.js";
import BScroll from "better-scroll";
export default {
  mixins: [Emitter],

  name: "ElSelect",

  componentName: "ElSelect",

  provide() {
    return {
      select: this
    };
  },

  props: {
    multiple: Boolean, //是否多选
    disabled: Boolean, //禁用
    clearable: Boolean, //清空功能
    filterable: Boolean, //搜索
    collapseTags: Boolean, //多选时是否将选中值按文字的形式展示
    value: {
      required: true
    },
    placeholder: {
      //提示
      type: String,
      default: "请选择"
    },
    remote: Boolean, //开启点击才加载数据
    remoteMethod: Function //搜索规则
  },
  data() {
    return {
      visible: false, //下拉显示控制
      query: this.placeholderSpan(), //输入框内容显示
      singleValue: "", //单选时，选中的值
      selected: this.multiple ? [] : {}, //多选时，选中的值
      criteria: true, //当前输入框是否有值
      transitionName: "el-zoom-in-top",
      search: "",
      cachedOptions: [],
      optionsCount: 0,
      empty: "加载中", //下拉提示文字
      windowOnscroll: true, //默认开启监听系统滚动条
      form_disabled: this.disabled
    };
  },
  mounted() {
    document.body.appendChild(this.$refs.popper);
    this.initScroll();
	this.setSelected();
	this.$emit("binput","hi")
  },
  created() {
    if (this.$store.state.formDisabled) this.form_disabled = true; //死亡则禁用

    this.$on("handleOptionClick", this.handleOptionSelect);
    this.$on("handleScrollMove", this.handleScroll);
  },
  beforeDestroy() {
    this.destroySelect();
  },
  methods: {
    initScroll() {
      if (!this.remote) {
        this.scroll = new BScroll(this.$refs.scrollbar, {
          click: true
        });
      }
    },
    afterEnter() {
      this.refresh();
    },
    destroySelect() {
      if (this.$refs.popper) {
        document.body.removeChild(this.$refs.popper);
      }
    },
    //清空
    emptyValue() {
      if (!this.criteria) {
        this.$emit("input", "");
      }
    },
    //提示内容
    placeholderSpan() {
      return `<span style="color:#dcdfe6;">${this.placeholder}</span>`;
    },
    getValueByPath(object, prop) {
      prop = prop || "";
      const paths = prop.split(".");
      let current = object;
      let result = null;
      for (let i = 0, j = paths.length; i < j; i++) {
        const path = paths[i];
        if (!current) break;

        if (i === j - 1) {
          result = current[path];
          break;
        }
        current = current[path];
      }
      return result;
    },
    getValueIndex(arr = [], value) {
      const isObject =
        Object.prototype.toString.call(value).toLowerCase() ===
        "[object object]";
      if (!isObject) {
        return arr.indexOf(value);
      } else {
        const valueKey = this.valueKey;
        let index = -1;
        arr.some((item, i) => {
          if (
            this.getValueByPath(item, valueKey) ===
            this.getValueByPath(value, valueKey)
          ) {
            index = i;
            return true;
          }
          return false;
        });
        return index;
      }
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
    getBoundingClientRect(element) {
      var rect = element.getBoundingClientRect();

      // whether the IE version is lower than 11
      var isIE = navigator.userAgent.indexOf("MSIE") != -1;

      // fix ie document bounding top always 0 bug
      var rectTop =
        isIE && element.tagName === "HTML" ? -element.scrollTop : rect.top;

      return {
        left: rect.left,
        top: rectTop,
        right: rect.right,
        bottom: rect.bottom,
        width: rect.right - rect.left,
        height: rect.bottom - rectTop
      };
    },
    getOffsetRectRelativeToCustomParent(element, parent, fixed) {
      var elementRect = this.getBoundingClientRect(element);
      var parentRect = this.getBoundingClientRect(parent);
      if (fixed) {
        var scrollParent = getScrollParent(parent);
        parentRect.top += scrollParent.scrollTop;
        parentRect.bottom += scrollParent.scrollTop;
        parentRect.left += scrollParent.scrollLeft;
        parentRect.right += scrollParent.scrollLeft;
      }

      var rect = {
        top: elementRect.top - parentRect.top,
        left: elementRect.left - parentRect.left,
        bottom: elementRect.top - parentRect.top + elementRect.height,
        right: elementRect.left - parentRect.left + elementRect.width,
        width: elementRect.width,
        height: elementRect.height
      };
      return rect;
    },
    getOuterSizes(element) {
      // NOTE: 1 DOM access here
      var _display = element.style.display,
        _visibility = element.style.visibility;
      element.style.display = "block";
      element.style.visibility = "hidden";
      var calcWidthToForceRepaint = element.offsetWidth;

      // original method
      var styles = window.getComputedStyle(element);
      var x = parseFloat(styles.marginTop) + parseFloat(styles.marginBottom);
      var y = parseFloat(styles.marginLeft) + parseFloat(styles.marginRight);
      var result = {
        width: element.offsetWidth + y,
        height: element.offsetHeight + x
      };

      // reset element styles
      element.style.display = _display;
      element.style.visibility = _visibility;
      return result;
    },
    refresh() {
      this.scroll && this.scroll.refresh();
    },
    scrollTo() {
      /**
       * 代理better-scroll的scrollTo方法 滚动到指定的位置
       * Number} x 横轴坐标（单位 px）
       * {Number} y 纵轴坐标（单位 px）
       * {Number} time 滚动动画执行的时长（单位 ms）
       * {Object} easing 缓动函数，一般不建议修改，如果想修改，参考源码中的 ease.js 里的写法
       */
      this.scroll && this.scroll.scrollTo.apply(this.scroll, arguments);
    },
    //选择框点击事件
    handleClick(e) {
      if (this.form_disabled) {
        return;
      }

      this.visible = !this.visible;

      if (this.visible) {
        this.dropDown();
      }
    },
    //全局点击事件
    windowClick(e) {
      const popper = this.$refs.popper;
      const reference = this.$refs.reference;

      if (
        !reference ||
        reference.contains(e.target) ||
        !popper ||
        popper.contains(e.target)
      ) {
        return;
      }

      if (this.visible) {
        this.visible = false;
      }
    },
    //下拉样式
    dropDown(pos) {
      const reference = this.$refs.reference;
      const popper = this.$refs.popper;
      const refarRect = this.getBoundingClientRect(reference);
      const bodyRect = this.getBoundingClientRect(document.body);
      const selectRect = this.getOuterSizes(popper); //下拉高度

      if (bodyRect.top > 0) {
        //如果滚动条滑动超出了顶部
        return;
      }

      let bodyHeight = bodyRect.height + Math.abs(bodyRect.top); //滚动条当前位置底部坐标
      let selectTop = refarRect.top + refarRect.height + Math.abs(bodyRect.top); //下拉top位置

      if (selectTop + selectRect.height >= bodyHeight) {
        selectTop = refarRect.top + Math.abs(bodyRect.top) - selectRect.height;

        popper.setAttribute("x-placement", "top-start");
        this.transitionName = "el-zoom-in-bottom";
      } else {
        popper.setAttribute("x-placement", "bottom-start");
        this.transitionName = "el-zoom-in-top";
      }

      selectTop = Math.ceil(selectTop);

      popper.style.top = selectTop + "px";
      popper.style.left = refarRect.left + "px";
      popper.style.width = refarRect.width + "px";
      popper.style.position = "absolute";

      this.$refs.arrow.style.left = refarRect.width * 0.2 + "px";
    },
    getOption(value) {
      let option;
      for (let i = this.cachedOptions.length - 1; i >= 0; i--) {
        const cachedOption = this.cachedOptions[i];
        if (cachedOption.value === value) {
          option = cachedOption;
          break;
        }
      }
      return option;
    },
    //单选设置选中内容
    setVal(label, val, empty) {
      if (empty) {
        this.query = this.placeholderSpan();
        this.criteria = true;
        this.singleValue = "";
        this.search = "";
		this.$emit("change", label, val);
		this.$emit("onForm", {label,val});
        this.$emit("input", "");
      } else {
        this.query = label;
        this.criteria = false;
        this.singleValue = val;
		this.$emit("change", label, val);
		this.$emit("onForm", {label,val});
      }
    },
    setSelected() {
      let option = this.getOption(this.value);
      if (option && this.singleValue !== this.value) {
        this.setVal(option.currentLabel, this.value);
      }
    },
    onOptionDestroy(index) {
      if (index > -1) {
        this.optionsCount--;
        this.cachedOptions.splice(index, 1);
      }
    },
    handleOptionSelect(option, byClick) {
      if (this.multiple) {
        const optionIndex = this.getValueIndex(this.selected, option.label);
        if (optionIndex > -1) {
          this.selected.splice(optionIndex, 1);
        } else {
          this.selected.push(option.label);
        }
        this.$emit("input", this.selected);

        this.$nextTick(function() {
          this.dropDown();
        });
      } else {
        this.$emit("input", option.value);
        this.visible = false;
      }
    },
    handleScroll(pos) {
      this.windowOnscroll = false;
      //当前下拉框打开
      if (this.visible) {
        if (!this.func) {
          this.func = this.handleDropDown(this.dropDown, 1);
        }

        this.func(pos);
      }
    },
    handleQueryChange(val) {
      if (typeof this.remoteMethod === "function") {
        this.remoteMethod(val);
      } else {
        this.broadcast("ElOption", "queryChange", val);
      }
    },
    throttle(func, wait, options) {
      let context, args, result;

      let timeout = null;

      let previous = 0;

      const _now =
        Date.now ||
        function() {
          return new Date().getTime();
        };

      if (!options) options = {};

      const later = function() {
        previous = options.leading === false ? 0 : _now();
        timeout = null;

        result = func.apply(context, args);

        if (!timeout) context = args = null;
      };

      return function() {
        let now = _now();

        if (!previous && options.leading === false) previous = now;

        let remaining = wait - (now - previous);
        context = this;
        args = arguments;

        if (remaining <= 0 || remaining > wait) {
          if (timeout) {
            clearTimeout(timeout);

            timeout = null;
          }

          previous = now;

          result = func.apply(context, args);

          if (!timeout) context = args = null;
        } else if (!timeout && options.trailing !== false) {
          timeout = setTimeout(later, remaining);
        }

        return result;
      };
    },
    //重新计算下拉框位置
    //使用函数节流，来避免频繁的调用，导致低版本浏览器可能就会直接假死
    //默认为300
    handleDropDown(fn, time = 30) {
      if (!this.visible) {
        //下拉框没有打开，返回一个空函数
        return function() {};
      }

      return this.throttle(fn, time);
    },

    handleDocumentClick(state) {
      if (state) {
        document.addEventListener("click", this.windowClick, false);
      } else {
        document.removeEventListener("click", this.windowClick, false);
      }
    }
  },
  computed: {
    iconClass() {
      return this.visible ? "is-reverse" : "";
    },
    suffixClass() {
      return !(!this.criteria && !this.multiple && this.clearable)
        ? "is-none"
        : "";
    }
  },
  watch: {
    value(val, old) {
      if (!val && val !== 0) {
        this.setVal("", "", true);
      } else {
        var str = val + "";
        if (str.length) {
          this.setSelected();
        } else {
          this.setVal("", "", true);
        }
      }
    },
    visible(val) {
      if (this.windowOnscroll) {
        if (val) {
          window.onscroll = this.handleDropDown(this.dropDown);
        } else {
          window.onscroll = "";
        }
      }

      this.handleDocumentClick(val);

      this.$emit("visible-change", val);

      if (val) {
        this.$emit("visible-open");
        this.search = "";
      } else {
        this.$emit("visible-close");
      }
    },
    search(val) {
      this.handleQueryChange(val);
      this.$nextTick(() => {
        this.dropDown();
      });
    },
    remote() {
      this.$nextTick(() => {
        this.initScroll();
        this.dropDown();
      });
    },
    disabled(val) {
      this.form_disabled = !!val;
    }
  }
};
</script>

<style scoped>
.el-box {
  position: relative;
  display: inline-block;
  width: 200px;
}
.el-zoom-in-top-enter-active,
.el-zoom-in-top-leave-active {
  opacity: 1;
  transform: scaleY(1);
  transition: transform 300ms cubic-bezier(0.23, 1, 0.32, 1),
    opacity 300ms cubic-bezier(0.23, 1, 0.32, 1);
  transform-origin: center top;
}
.el-zoom-in-top-enter,
.el-zoom-in-top-leave-active {
  opacity: 0;
  transform: scaleY(0);
}

.el-zoom-in-bottom-enter-active,
.el-zoom-in-bottom-leave-active {
  opacity: 1;
  transform: scaleY(1);
  transition: transform 300ms cubic-bezier(0.23, 1, 0.32, 1),
    opacity 300ms cubic-bezier(0.23, 1, 0.32, 1);
  transform-origin: center bottom;
}
.el-zoom-in-bottom-enter,
.el-zoom-in-bottom-leave-active {
  opacity: 0;
  transform: scaleY(0);
}

.el-zoom-in-left-enter-active,
.el-zoom-in-left-leave-active {
  opacity: 1;
  transform: scale(1, 1);
  transition: transform 300ms cubic-bezier(0.23, 1, 0.32, 1),
    opacity 300ms cubic-bezier(0.23, 1, 0.32, 1);
  transform-origin: top left;
}
.el-zoom-in-left-enter,
.el-zoom-in-left-leave-active {
  opacity: 0;
  transform: scale(0.45, 0.45);
}

.vux-x-icon {
  fill: #c0c4cf;
}
.el-select .el-input .el-select__caret.is-reverse {
  transform: rotate(0deg);
}
.el-select {
  display: inline-block;
  position: relative;
  width: 100%;
}
.el-select > .el-input {
  display: block;
}
.el-input {
  position: relative;
  display: inline-block;
  font-size: 1.4rem;
  width: 100%;
}
.el-select .el-input__inner {
  padding-right: 2rem;
}
.el-input__inner {
  -webkit-appearance: none;
  background-color: #fff;
  background-image: none;
  border-radius: 0.4rem;
  border: 1px solid #ced7e3;
  box-sizing: border-box;
  color: #333;
  display: inline-block;
  font-size: inherit;
  min-height: 40px;
  padding: 0 1rem;
  transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
  width: 100%;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
}
.el-input__single {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.el-select__tags > span {
  display: inline-block;
  line-height: 1.6;
  margin: 0.2rem;
}
.el-select__tags-text {
  white-space: nowrap;
  display: inline-block;
}
.el-input__suffix {
  position: absolute;
  height: 100%;
  right: 0.5rem;
  top: 0;
  text-align: center;
  color: #c0c4cc;
}
.el-select .el-input .el-select__caret {
  color: #c0c4cc;
  transition: transform 0.3s;
  transform: rotate(180deg);
}
.el-input__icon {
  line-height: 3.5rem;
  width: 1.4rem;
  height: 100%;
  background: url("ios-arrow-up.png") no-repeat center/.9rem 0.5rem;
  display: inline-block;
}
.is-show-close {
  transition: transform 0s !important;
  background: url("ios-close.png") no-repeat center/1.4rem 1.4rem;
}
.el-input__icon,
.el-input__prefix {
  text-align: center;
  transition: all 0.3s;
}

.el-popper[x-placement^="bottom"] {
  margin-top: 1.2rem;
  z-index: 105;
}

.el-popper[x-placement^="top"] {
  margin-bottom: 1.2rem;
}

.el-select-dropdown {
  position: absolute;
  z-index: 99;
  border: 1px solid #e4e7ed;
  border-radius: 4px;
  background-color: #fff;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
}
.el-scrollbar__wrap {
  overflow: hidden;
  height: 100%;
}
.el-select-dropdown__wrap {
  max-height: 20rem;
}
.el-select-dropdown__list {
  list-style: none;
  padding: 6px 0;
  margin: 0;
  box-sizing: border-box;
}

.el-popper[x-placement^="bottom"] .popper__arrow {
  top: -6px;
  left: 50%;
  margin-right: 3px;
  border-top-width: 0;
  border-bottom-color: #ebeef5;
}
.el-popper[x-placement^="top"] .popper__arrow {
  bottom: -6px;
  left: 50%;
  margin-right: 3px;
  border-top-color: #ebeef5;
  border-bottom-width: 0;
}
.el-popper .popper__arrow {
  border-width: 6px;
  filter: drop-shadow(0 2px 12px rgba(0, 0, 0, 0.03));
}
.el-popper .popper__arrow,
.el-popper .popper__arrow:after {
  position: absolute;
  display: block;
  width: 0;
  height: 0;
  border-color: transparent;
  border-style: solid;
}

.el-popper[x-placement^="bottom"] .popper__arrow:after {
  top: 1px;
  margin-left: -6px;
  border-top-width: 0;
  border-bottom-color: #fff;
}
.el-popper[x-placement^="top"] .popper__arrow:after {
  bottom: 1px;
  margin-left: -6px;
  border-top-color: #fff;
  border-bottom-width: 0;
}
.el-popper .popper__arrow:after {
  content: " ";
  border-width: 6px;
}
.el-popper .popper__arrow,
.el-popper .popper__arrow:after {
  position: absolute;
  display: block;
  width: 0;
  height: 0;
  border-color: transparent;
  border-style: solid;
}

.el-input__inner.is-disabled {
  background-color: #fff;
  border-color: #f4f4f4;
  color: #999;
}

.el-tag {
  box-sizing: border-box;
  border-color: transparent;
  margin: 2px 0 2px 6px;
  background-color: #f0f2f5;
  border-radius: 0.4rem;
}

.el-tag:first-child {
  margin: 2px 0;
}

.el-tag--small {
  display: inline-block;
  padding: 0 8px;
}
.el-tag--info {
  background-color: hsla(220, 4%, 58%, 0.1);
  border-color: hsla(220, 4%, 58%, 0.2);
  color: #909399;
}
.el-select .el-tag__close.el-icon-close {
  right: -7px;
  top: 0.2rem;
  color: #fff;
}
.el-tag--small .el-icon-close {
  transform: scale(0.8);
}
.el-tag--info .el-tag__close {
  color: #909399;
}
.el-tag .el-icon-close {
  border-radius: 50%;
  text-align: center;
  position: relative;
  width: 1.4rem;
  height: 1.4rem;
  background: url("ios-close.png") no-repeat center/1.4rem 1.4rem;
  display: inline-block;
}
.el-select-input {
  outline: none;
  padding: 0 2rem;
  width: 100%;
  border: none;
  -webkit-appearance: none;
  height: 3rem;
  line-height: 3rem;
  color: #606266;
  border-bottom: 1px solid #dcdfe6;
  font-size: 1.4rem;
  border-radius: 0.4rem 0.4rem 0 0;
}
.el-select-dropdown__empty {
  padding: 10px 0;
  margin: 0;
  text-align: center;
  color: #999;
  font-size: 14px;
}
.is-none {
  pointer-events: none;
}
</style>
