<template>
  <li
    class="el-select-dropdown__item"
    v-show="visible"
    @click.stop="selectOptionClick"
    :class="{
            'selected': itemSelected,
            'is-disabled': disabled
        }"
  >
    <slot>
      <span>{{ currentLabel }}</span>
    </slot>
  </li>
</template>

<script>
import Emitter from "../../../assets/mixins/emitter.js";
export default {
  mixins: [Emitter],

  name: "ElOption",

  componentName: "ElOption",

  inject: ["select"],

  props: {
    label: [String, Number], //编号
    value: {
      //显示内容，必填
      required: true
    },
    disabled: {
      //是否禁用
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      visible: true
    };
  },
  created() {
    this.select.cachedOptions.push(this);
    this.select.optionsCount++;

    this.$on("queryChange", this.queryChange);
  },
  mounted() {
    this.$nextTick(() => {
      //针对设置下拉默认值，在下拉列表前面
      //所以在下拉渲染完成时手动调用父级setSelected方法
      if (!this.select.multiple) {
        this.select.setSelected();
      }
    });
  },
  methods: {
    selectOptionClick() {
      if (this.disabled !== true) {
        this.dispatch("ElSelect", "handleOptionClick", [this, true]);
      }
    },
    queryChange(query) {
      // query 里如果有正则中的特殊字符，需要先将这些字符转义
      let parsedQuery = String(query).replace(
        /(\^|\(|\)|\[|\]|\$|\*|\+|\.|\?|\\|\{|\}|\|)/g,
        "\\$1"
      );
      this.visible =
        new RegExp(parsedQuery, "i").test(this.currentLabel) || this.created;
    }
  },
  computed: {
    isObject() {
      return (
        Object.prototype.toString.call(this.value).toLowerCase() ===
        "[object object]"
      );
    },
    itemSelected() {
      if (!this.select.multiple) {
        return this.value === this.select.value;
      } else {
        const optionIndex = this.select.getValueIndex(
          this.select.selected,
          this.label
        );
        return optionIndex > -1;
      }
    },
    currentLabel() {
      return this.label || (this.isObject ? "" : this.value);
    }
  },
  beforeDestroy() {
    this.select.onOptionDestroy(this.select.cachedOptions.indexOf(this));
  }
};
</script>

<style>
.el-select-dropdown__item {
  font-size: 1.4rem;
  padding: 0 2rem;
  position: relative;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: #606266;
  height: 3rem;
  line-height: 3rem;
  box-sizing: border-box;
}
.selected {
  color: #409eff;
  font-weight: 700;
}
.el-select-dropdown__item.is-disabled {
  color: #c0c4cc;
  cursor: not-allowed;
}
.el-select-dropdown.is-multiple .el-select-dropdown__item.selected:after {
  position: absolute;
  right: 1.4rem;
  content: "";
  width: 1.4rem;
  height: 100%;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background: url("ios-close-complete.png") no-repeat center/1.4rem 1.4rem;
}
</style>
