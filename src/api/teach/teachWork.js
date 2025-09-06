import request from '@/utils/request'
// 查询编程作品列表
export function listTeachWork(query) {
  return request({
    url: '/teach/teachWork/list',
    method: 'get',
    params: query
  })
}
// 查询编程作品详细
export function getTeachWork(id) {
  return request({
    url: '/teach/teachWork/get',
    method: 'get',
    params: {
     id: id.toString()
    }
  })
}
// 新增编程作品
export function addTeachWork(data) {
  return request({
    url: '/teach/teachWork/add',
    method: 'post',
    data: data
  })
}
// 修改编程作品
export function updateTeachWork(data) {
  return request({
    url: '/teach/teachWork/edit',
    method: 'put',
    data: data
  })
}
// 删除编程作品
export function delTeachWork(ids) {
  return request({
    url: '/teach/teachWork/delete',
    method: 'delete',
    data:{
       ids:ids
    }
  })
}
// 编程作品作品状态修改
export function changeTeachWorkWorkStatus(id,workStatus) {
  const data = {
    id,
    workStatus
  }
  return request({
    url: '/teach/teachWork/changeWorkStatus',
    method: 'put',
    data:data
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
