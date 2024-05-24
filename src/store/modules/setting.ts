/*
 * @Description: Stay hungry，Stay foolish
 * @Author: Huccct
 * @Date: 2023-05-20 21:42:14
 * @LastEditors: Huccct
 * @LastEditTime: 2023-05-21 20:54:48
 */
import { defineStore } from 'pinia'

let useLayOutSettingStore = defineStore('SettingStore', {
  state: () => {
    return {
      isCollapse: false,//用户控制菜单折叠还是收起控制
      refsh: false,//仓库这个属性用于控制刷新效果
    }
  },
})

export default useLayOutSettingStore
