import axios from 'axios';
axios.defaults.baseURL = 'http://127.0.0.1:8000';

// 拦截器，返回对象的data
axios.interceptors.response.use((res)=>{
  return res.data;
});

// 用户登录
export let Login = (data) =>{
  return axios.post('/login', data);
};

// 用户注册
export let Register =(data) =>{
  return axios.post('/user', data)
};

// 用户退出
export let Logout =(data) =>{
  return axios.post('/logout', data)
};

// 上传头像
export let uploadLogo =(data) =>{
  return axios.post('/uploadLogo', data)
};

// 获取用户信息
export let getUserInfo =()=>{
  return axios.get('/user_info')
};

// 根据用户名或ID查找用户
export let getUser =(data) =>{
  return axios.get('/user', data)
};

// 修改用户信息
export let updateUser =(data) =>{
  return axios.put('/user', data)
};

// 删除用户，只有超级管理员拥有权限
export let deleteUser =(data) =>{
  return axios.delete('/user', data)
};

/*---------  好友管理接口 ---------*/
// 获取好友列表
export let getFriend = () =>{
  return axios.get('/friend')
};

// 添加好友
export let addFriend = (data) =>{
  return axios.post('/friend', data)
};

// 修改好友备注名称
export let updateFriend = (data) =>{
  return axios.put('/friend', data)
};

// 删除好友
export let delFriend =(data) =>{
  return axios.delete('/friend', data)
};

/*-------------  群组管理接口  ------------*/
// 获取群组信息
export let getGroup = () =>{
  return axios.get('/group')
};

// 创建群组
export let addGroup =(data) =>{
  return axios.post('/group', data)
};

// 修改群组信息
export let updateGroup =(data)=>{
  return axios.put('/group', data)
};

// 删除群组
export let deleteGroup =(data) =>{
  return axios.delete('/group', data)
};

/*-----------------  群组成员管理接口 ------------------*/
// 获取群成员列表
export let getGroupUser =(data) =>{
  return axios.get('/group_user', data)
};

// 群组添加成员
export let addGroupUser =(data) =>{
  return axios.post('/group_user', data)
};

// 群组修改成员
export let updateGroupUser =(data) =>{
  return axios.put('/group_user', data)
};

// 群组删除成员
export let deleteGroupUser =(data) =>{
  return axios.delete('/group_user', data)
};

/*-------------  聊天管理接口 ------------*/

// 获取聊天列表
export let getChat =()=>{
  return axios.get('/chat')
};

// 删除聊天列表
export let deleteChat =(data)=>{
  return axios.delete('/chat')
};

/*------------------  好友消息管理接口 ----------------*/

// 获取好友消息
export let getChatMessage =(data) =>{
  return axios.get('/chat_message')
};
