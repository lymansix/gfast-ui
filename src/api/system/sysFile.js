import request from '@/utils/request'
// 查询系统文件列表
export function listSysFile(query) {
  return request({
    url: '/system/sysFile/list',
    method: 'get',
    params: query
  })
}
// 查询系统文件详细
export function getSysFile(id) {
  return request({
    url: '/system/sysFile/get',
    method: 'get',
    params: {
     id: id.toString()
    }
  })
}
// 新增系统文件
export function addSysFile(data) {
  return request({
    url: '/system/sysFile/add',
    method: 'post',
    data: data
  })
}
// 修改系统文件
export function updateSysFile(data) {
  return request({
    url: '/system/sysFile/edit',
    method: 'put',
    data: data
  })
}
// 删除系统文件
export function delSysFile(ids) {
  return request({
    url: '/system/sysFile/delete',
    method: 'delete',
    data:{
       ids:ids
    }
  })
}
//获取用户信息列表
export function getUserList(uIds){
    return request({
     url: '/system/auth/usersGet',
     method: 'get',
     params: {ids:uIds}
   })
}
