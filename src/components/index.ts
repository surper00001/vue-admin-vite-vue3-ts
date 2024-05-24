
import type { App } from 'vue'
import * as components from './components'
//引入element-plus提供全部图标组件
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
  //务必叫做install方法
const install = function (app: App) {
     //注册项目全部的全局组件
  Object.entries(components).forEach(([key, value]) => {
     //注册为全局组件
    app.component(key, value)
  })
     //将element-plus提供图标注册为全局组件
  for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
  }
}
//对外暴露插件对象
export default install
export * from './components'
