import axios from 'axios';
//axios.defaults.baseURL = 'http://127.0.0.1:5000';
//var url_version = '/api/v1.04';
var url_version = '';

// 拦截器，返回对象的data
axios.interceptors.response.use((res)=>{
  return res.data;
});

// 检查用户是否登录
export let checkLogin =() =>{
  return axios.get(`${url_version}/check_login`)
};

// 用户登录
export let Login = (data) =>{
  return axios.post(`${url_version}/login`, data);
};

// 用户注册
export let Register =(data) =>{
  return axios.post(`${url_version}/user`, data)
};

// 用户退出
export let Logout =(data) =>{
  return axios.post(`${url_version}/logout`, data)
};

// 上传头像
export let uploadLogo =(data) =>{
  return axios.post(`${url_version}/upload_logo`, data)
};

// 上传图片
export let uploadImage =(data) =>{
  return axios.post(`${url_version}/upload_image`, data)
};

// 获取用户信息
export let getUserInfo =(data)=>{
  return axios.get(`${url_version}/user_info`, {'params': data})
};

// 根据用户名或ID查找用户
export let getUser =(data) =>{
  return axios.get(`${url_version}/user`, {'params':data})
};

// 修改用户信息
export let updateUser =(data) =>{
  return axios.put(`${url_version}/user`, data)
};

// 删除用户，只有超级管理员拥有权限
export let deleteUser =(data) =>{
  return axios.delete(`${url_version}/user`, {'params':data})
};

/*---------  好友管理接口 ---------*/
// 获取好友列表
export let getFriend = () =>{
  return axios.get(`${url_version}/friend`)
};

// 添加好友
export let addFriend = (data) =>{
  return axios.post(`${url_version}/friend`, data)
};

// 修改好友备注名称
export let updateFriend = (data) =>{
  return axios.put(`${url_version}/friend`, data)
};

// 删除好友
export let deleteFriend =(data) =>{
  return axios.delete(`${url_version}/friend`, {'params':data})
};

/*-------------  群组管理接口  ------------*/
// 获取群组信息
export let getGroup = (data) =>{
  return axios.get(`${url_version}/group`, {'params':data})
};

// 创建群组
export let addGroup =(data) =>{
  return axios.post(`${url_version}/group`, data)
};

// 修改群组信息
export let updateGroup =(data)=>{
  return axios.put(`${url_version}/group`, data)
};

// 删除群组
export let deleteGroup =(data) =>{
  return axios.delete(`${url_version}/group`, {'params':data})
};

/*-----------------  群组成员管理接口 ------------------*/
// 获取群成员列表
export let getGroupUser =(data) =>{
  return axios.get(`${url_version}/group_user`, {'params':data})
};

// 群组添加成员
export let addGroupUser =(data) =>{
  return axios.post(`${url_version}/group_user`, data)
};

// 群组修改成员
export let updateGroupUser =(data) =>{
  return axios.put(`${url_version}/group_user`, data)
};

// 群组删除成员
export let deleteGroupUser =(data) =>{
  return axios.delete(`${url_version}/group_user`, {'params':data})
};

/*-------------  聊天管理接口 ------------*/
// 添加聊天列表
export let addChat =(data)=>{
  return axios.post(`${url_version}/chat`, data);
};

// 获取聊天列表
export let getChat =(data)=>{
  return axios.get(`${url_version}/chat`, {'params': data})
};

// 删除聊天列表
export let deleteChat =(data)=>{
  return axios.delete(`${url_version}/chat`, {'params':data})
};

/*------------------  好友消息管理接口  ----------------*/

// 获取好友消息
export let getChatMessage =(data) =>{
  return axios.get(`${url_version}/chat_message`, {'params':data})
};
