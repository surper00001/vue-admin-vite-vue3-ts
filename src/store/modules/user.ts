// 创建小仓库
import { defineStore } from 'pinia'
import router from '@/router'
import { reqLogin, reqUserInfo, reqLogOut } from '@/api/user'
import type {
  LoginFormData,
  LoginResponseData,
  userInfoResponseData,
} from '@/api/user/type'
import type { UserState } from './types/types'
//引入操作本地存储的工具方法
import { SET_TOKEN, GET_TOKEN, REMOVE_TOKEN } from '@/utils/token'
//引入路由(常量路由)
import { constantRoute, asyncRoute, anyRoute } from '@/router/routes'
//引入深拷贝方法
// @ts-ignore
import cloneDeep from 'lodash/cloneDeep'

let dynamicRoutes: any[] = []
//用于过滤当前用户需要展示的异步路由
function filterAsyncRoute(asyncRoute: any, routes: any) {
  return asyncRoute.filter((item: any) => {
    if (routes.includes(item.name)) {
      if (item.children && item.children.length > 0) {
        item.children = filterAsyncRoute(item.children, routes)
      }
      return true
    }
  })
}
//创建用户小仓库
let useUserStore = defineStore('User', {
  // 小仓库存储数据的地方
  state: (): UserState => {
    return {
      token: GET_TOKEN()!,
      menuRoutes: constantRoute,
      username: '',
      avatar: '',
      buttons: [],
    }
  },
  // 异步|逻辑的地方
  actions: {
    //用户登录方法
    async userLogin(data: LoginFormData) {
      let res: LoginResponseData = await reqLogin(data)
      // success=>token
      // error=>error.message
      if (res.code === 200) {
        //pinia仓库存储一下token
        //由于pinia|vuex存储数据其实利用js对象
        this.token = res.data as string
        // 持久化
        SET_TOKEN(res.data as string)
         //能保证当前async函数返回一个成功的promise
        return 'ok'
      } else {
        return Promise.reject(new Error(res.data as string))
      }
    },
      //获取用户信息方法
    async userInfo() {
      let res: userInfoResponseData = await reqUserInfo()

      if (res.code === 200) {
         //获取用户信息进行存储仓库当中[用户头像、名字]
        this.username = res.data.name as string
           //如果获取用户信息成功，存储一下用户信息
        this.avatar = res.data.avatar as string
 //计算当前用户需要展示的异步路由
        let userAsyncRoute = filterAsyncRoute(
          cloneDeep(asyncRoute),
          res.data.routes,
        )
                //菜单需要的数据整理完毕
        this.menuRoutes = [...constantRoute, ...userAsyncRoute, anyRoute]
        
        dynamicRoutes = [...userAsyncRoute, anyRoute] // 记录动态添加的路由
        
        dynamicRoutes.forEach((route) => {
          router.addRoute(route) // 动态添加路由
        })
        return 'ok'
      } else {
        return Promise.reject(new Error(res.message))
      }
    },
        //退出登录
    async userLogout() {
      let res = await reqLogOut()
      if (res.code === 200) {
         //目前没有mock接口:退出登录接口(通知服务器本地用户唯一标识失效)
        this.token = ''
        this.username = ''
        this.avatar = ''
        REMOVE_TOKEN()
        dynamicRoutes.forEach((route) => {
          router.removeRoute(route.name)
        })
      } else {
        return Promise.reject(new Error(res.message))
      }
    },
  },
  getters: {},
})
//对外暴露获取小仓库方法
export default useUserStore
