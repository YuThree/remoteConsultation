/**
 * 
 * MessageCase弹框(暂时无动画效果)
 * type:
 *  alert   警告弹框
 *  success 成功弹框
 *  error   失败弹框
 * 调用：
 * this.$MessageCase.show(message,type)
 * .then(()=>{
 *  //点击确认的回调
 * })
 * .catch(err=>{
 *  //点击取消的回调
 * })
 * 
 */
import Vue from 'vue'
import modal from './modalPlugin.vue'

var currentMsg,instance;
var msgQueue;

const defaultCallback = action=>{
    if(action === 'cancel'){
        currentMsg.reject(action);
    }else if(currentMsg.resolve){
        currentMsg.resolve(action);
    }
    
}
const modalPlugin = Vue.extend(modal);
var initInstance = function(){
    instance = new modalPlugin({
        el: document.createElement('div')
    });
    instance.callback = defaultCallback;
}

var showNextMsg = function(){
    if (!instance) {
        initInstance();
    }
    if(!instance.showValue){
        if (msgQueue) {
            currentMsg = msgQueue;
            var options = currentMsg.options;
            for(let prop in options){
                if(options.hasOwnProperty(prop)){
                    instance[prop] = options[prop];
                }
            }
            if (options.callback === undefined) {
                instance.callback = defaultCallback;
            }
            instance.showValue = true;
            document.body.appendChild(instance.$el);
            msgQueue = null;
        }
    }
}
export default {
    install(Vue, options) {        
        Vue.$MessageCase = {
            show(message,type='alert'){
                return new Promise((resolve,reject)=>{
                    msgQueue = {
                        options:{
                            showValue:false,
                            type:type,
                            hideOnBlur:false,
                            message:message
                        },
                        resolve,
                        reject
                    }
                    showNextMsg();
                })
            }
        }
        Vue.prototype.$MessageCase = Vue.$MessageCase;       
    }
}
