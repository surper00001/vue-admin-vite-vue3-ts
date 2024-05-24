
<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue'
//引入获取菜单请求API
import {
  reqAllPermission,
  reqAddOrUpdateMenu,
  reqRemoveMenu,
} from '@/api/acl/menu'
//引入ts类型
import type {
  PermissionResponseData,
  PermissionList,
  Permission,
  MenuParams,
} from '@/api/acl/menu/type'
//存储菜单的数据
let PermissionArr = ref<PermissionList>([])
//控制对话框的显示与隐藏
let dialogVisible = ref<boolean>(false)
//携带的参数
let menuData = reactive<MenuParams>({
  code: '',
  level: 0,
  name: '',
  pid: 0,
})
//组件挂载完毕
onMounted(() => {
  getHasPermission()
})
//获取菜单数据的方法
const getHasPermission = async () => {
  let res: PermissionResponseData = await reqAllPermission()
  if (res.code === 200) {
    PermissionArr.value = res.data
  }
}

//添加菜单按钮的回调
const addPermission = (row: Permission) => {
   //清空数据
  Object.assign(menuData, {
    id: 0,
    code: '',
    level: 0,
    name: '',
    pid: 0,
  })
   //对话框显示出来
  dialogVisible.value = true
      //收集新增的菜单的level数值
  menuData.level = row.level + 1
   //给谁新增子菜单
  menuData.pid = row.id as number
}

const updatePermission = (row: Permission) => {
  dialogVisible.value = true
  Object.assign(menuData, row)
}
//编辑已有的菜单
const save = async () => {
  dialogVisible.value = false
  let res: any = await reqAddOrUpdateMenu(menuData)
  if (res.code === 200) {
    dialogVisible.value = false
    ElMessage({
      type: 'success',
      message: menuData.id ? '更新成功' : '添加成功',
    })
    getHasPermission()
  }
}
//删除按钮回调
const removeMenu = async (id: number) => {
  let res = await reqRemoveMenu(id)
  if (res.code === 200) {
    ElMessage({ type: 'success', message: '删除成功' })
  }
}
</script>
<template>
  <el-table
    style="width: 100%; margin-bottom: 20px"
    row-key="id"
    border
    :data="PermissionArr"
  >
    <el-table-column prop="name" label="名称" />
    <el-table-column prop="code" label="权限值" />
    <el-table-column prop="updateTime" label="修改时间" show-overflow-tooltip />
    <el-table-column label="操作" width="260px">
      <template #="{ row, $index }">
        <el-button
          size="small"
          :disabled="row.level === 4 ? true : false"
          @click="addPermission(row)"
        >
          {{ row.level === 3 ? '添加功能' : '添加菜单' }}
        </el-button>
        <el-button
          type="primary"
          size="small"
          :disabled="row.level === 1 ? true : false"
          @click="updatePermission(row)"
        >
          编辑
        </el-button>
        <el-popconfirm
          :title="`你确定要删除${row.name}?`"
          width="260px"
          @confirm="removeMenu(row.id)"
        >
          <template #reference>
            <el-button
              type="danger"
              size="small"
              :disabled="row.level === 1 ? true : false"
            >
              删除
            </el-button>
          </template>
        </el-popconfirm>
      </template>
    </el-table-column>
  </el-table>
   <!-- 对话框组件:添加或者更新已有的菜单的数据结构 -->
  <el-dialog
    v-model="dialogVisible"
    :title="menuData.id ? '更新菜单' : '添加菜单'"
  >
    <el-form>
      <el-form-item label="名称">
        <el-input
          placeholder="请你输入菜单的名称"
          v-model="menuData.name"
        ></el-input>
      </el-form-item>
      <el-form-item label="权限">
        <el-input
          placeholder="请你输入权限数值"
          v-model="menuData.code"
        ></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="save">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>
<style lang="scss" scoped></style>
