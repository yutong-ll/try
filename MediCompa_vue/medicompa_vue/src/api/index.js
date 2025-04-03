import request from '../utils/request'

//发送验证码
export const getCode = (data) => {

    return request.post('/get/code', data)

}

//用户注册
export const userAuthentication = (data) => {

    return request.post('/user/authentication', data)
}
//用户登录
export const login = (data) => {

    return request.post('/login', data)
}
//权限管理
export const authAdmin = (params) => {

    return request.get('/auth/admin', { params })
}
//菜单权限数据
export const userGetMenu = () => {

    return request.get('/user/getmenu')
}
//菜单权限修改
export const userSetMenu = (data) => {
    return request.post('/user/setmenu', data)
}
//菜单权限列表
export const menuList = (params) => {
    return request.get('/menu/list', { params })
}

//权限下拉列表
export const menuSelectList = () => {
    return request.get('/menu/selectlist')
}
//用户数据修改
export const upDataUser = (data) => {
    return request.post('/update/user', data)
}

//用户菜单权限
export const menuPermission = () => {
    return request.get('/menu/permissions')
}

//陪护师头像列表
export const photoList = () => {
    return request.get('/photo/list')
}

//陪护师创建
export const companion = (data) => {
    return request.post('/companion', data)
}

//陪护师列表
export const companionList = (params) => {
    return request.get('/companion/list', { params })
}
export const companionDelete = (data) => {
    return request.post('/delete/companion', data)
}