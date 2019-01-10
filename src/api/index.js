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
  return axios.post('/register', data)
};

// 用户退出
export let Logout =(data) =>{
  return axios.post('/logout', data)
};

// 上传头像
export let uploadLogo =(data) =>{
  return axios.post('/uploadLogo', data)
};

// 修改用户信息
export let updateUser =(data) =>{
  return axios.put('/user', data)
};

// 群组添加好友
export let groupAdd =(data)=>{
  return axios.put('/group_add', data)
}
