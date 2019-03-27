import Select from './src/select';
import Option from './src/option';

Select.install = function(Vue) {
  Vue.component(Select.name, Select);
  Vue.component(Option.name, Option);
};

export default Select;