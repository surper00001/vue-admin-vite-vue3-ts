//商品分类全局组件的小仓库
import { reqC1, reqC2, reqC3 } from '@/api/product/attr'
import { defineStore } from 'pinia'
import type { CategoryResponseData } from '@/api/product/attr/type'
import { CategoryState } from './types/types'

let useCategoryStore = defineStore('Category', {
  state: (): CategoryState => {
    return {
        //存储一级分类的ID
      c1Id: '',
        //收集二级分类的ID
      c2Id: '',
                //存储三级分类的ID
      c3Id: '',
      //存储一级分类的数据
      c1Arr: [],
         //存储对应一级分类下二级分类的数据
      c2Arr: [],
          //存储对应一级分类下二级分类的数据
      c3Arr: [],
    }
  },
  actions: {
      //获取一级分类的方法
    async getC1() {
           //发请求获取一级分类的数据
      let res: CategoryResponseData = await reqC1()
      if (res.code === 200) {
        this.c1Arr = res.data
      }
    },
     //获取二级分类的数据
    async getC2() {
      let res: CategoryResponseData = await reqC2(this.c1Id)
      if (res.code === 200) {
        this.c2Arr = res.data
      }
    },
       //获取三级分类的数据
    async getC3() {
      let res: CategoryResponseData = await reqC3(this.c2Id)
      if (res.code === 200) {
        this.c3Arr = res.data
      }
    },
  },
  getters: {},
})

export default useCategoryStore
