import Vue from 'vue'
import VeeValidate,{Validator} from 'vee-validate'
import zh_CN from 'vee-validate/dist/locale/zh_CN'
import VueI18n from 'vue-i18n'

Vue.use(VueI18n)

const i18n = new VueI18n({
  locale: 'zh_CN'
})
//VeeValidate配置
Vue.use(VeeValidate,{
    errorBagName:'verrors',
    events: 'blur',
    i18n,
    i18nRootKey: 'validation',
    dictionary: {
      zh_CN
    }
})

//VeeValidate自定义验证
Validator.extend('mobile', {
    messages: {
      zh_CN:field => field + '必须是11位手机号码',
    },
    validate: value => {
      // return value.length == 11 && /^((13|14|15|17|18)[0-9]{1}\d{8})$/.test(value)
      return  /^((0\d{2,3}-\d{7,8})|(1[35784]\d{9}))$/.test(value)
    }
});
// 身份证  身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X   /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/
Validator.extend('IdCard', {
    messages: {
      zh_CN:field => field + '必须15位或者18位',
    },
    validate: value => {
      // return /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(value)
      return /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/.test(value)
    }
});
// 姓名验证 
Validator.extend('userName', {
    messages: {
      zh_CN:field => field + '姓名格式不正确',
    },
    validate: value => {
      return /^[a-zA-Z\u4e00-\u9fa5\.\s]{1,10}$/.test(value)
    }
});

//VeeValidate自定义验证提示
const dictionary = {
    zh_CN: {
        messages:{
        email: () => '邮箱格式不正确',
        required:(filed)=>filed+'为必填项',
        is:(filed)=>filed+'输入不一致',
        mobile:field => '手机号或座机号格式不正确',
        IdCard:field =>'身份证格式不正确',
        userName:field =>'姓名格式不正确',
        }
    }
};
Validator.localize(dictionary);

// const validator = new Validator({
//     abc: 'required',
// });
// Vue.prototype.$otherValidator = validator;