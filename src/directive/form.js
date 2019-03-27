export default {
  bind: function (el, binding, vnode) {
    const vm = vnode.componentInstance
    const methodName = binding.expression
    const parent = vnode.context
    vm.$on('onForm', function (msg) {
      parent.$data[methodName] = msg
    })
  }
}
