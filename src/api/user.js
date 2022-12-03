import request from '@/utils/request'


// 登录
export function login(data) {
    return request({
      url: '/api/authority/webLogin',
      method: 'POST',
      data
    })
}

// 获取用户列表的方法
export function getUserList(data){
    return request({
        method: "POST",
        url: '/api/authority/users/page',
        data
    })
}

// 菜单，按钮，列表
export function getMenuList(data) {
    return request({
        method: "GET",
        url: '/api/authority/menu/findAll',
        params: data
    })
}

// 角色列表----分页
export function getRoleList(data) {
    return request({
        method: "POST",
        url: '/api/authority/roles/page',
        data 
    })
}
// 角色列表----全部数据
export function getRoleListAll(data) {
    return request({
        method: "GET",
        url: '/api/authority/roles/all',
        params: data
    })
}

// 删除角色
export function RoleInfoDELETE(data){
    return request({
        method: "DELETE",
        url: '/api/authority/roles/delete/' + data.id
    })
}
// 新增/修改-角色
export function saveOrUpdate(data){
    return request({
        method: "POST",
        url: '/api/authority/roles/saveOrUpdate',
        data
    })
}
// 新增/修改-菜单
export function sysCustMenuSaveOrUpdate(data){
    return request({
        method: "POST",
        url: '/api/authority/menu/saveOrUpdate',
        data
    })
}
// 删除-菜单
export function sysCustMenuDelete(data){
    return request({
        method: "DELETE",
        url: '/api/authority/menu/delete/' + data.id,
        data
    })
}
// 修改当前用户信息
export function usersUPdate(data){
    return request({
        method: "POST",
        url: '/api/authority/users/update',
        data
    })
}
// 新增或修改用户信息
export function saveOrUpdateUsers(data){
    return request({
        method: "POST",
        url: '/api/authority/users/saveOrUpdate',
        data
    })
}
/* 查询当前用户菜单*/
export function userMenu(data) {
    return request({
        method: "GET",
        url: '/api/authority/menu/current',
        params: data
    })
}
/* 查询所有菜单*/
export function findAllUserMenu(data) {
    return request({
        method: "GET",
        url: '/api/authority/menu/findAll',
        params: data
    })
}
/* 权限分配---角色分配菜单*/
export function granted(data) {
    return request({
        method: "POST",
        url: '/api/authority/menu/granted',
        data
    })
}
/* 根据roleId获取当前角色拥有的权限*/
export function custMenusRoleId(data) {
    return request({
        method: "GET",
        url: '/api/authority/menu/roleId/' + data.roleId
    })
}
/* 查询当前用户按钮权限集值*/
export function userPermissionValue(data) {
    return request({
        method: "GET",
        url: '/api/authority/menu/permissionValue',
        params: data
    })
}
