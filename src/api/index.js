import request from '../utils/request';
import axios from 'axios'

export const fetchData = query => {
  return request({
    url: '/book/listBooks',
    method: 'get',
    params: query
  });
};

// 下架或上架书籍
export const unUpBook = query => {
  return request({
    url: '/book/unUpBook',
    method: 'post',
    data: query
  });
};

// 更新书籍
export const updateBook = query => {
  return request({
    url: '/book/updateBook',
    method: 'post',
    data: query
  });
};

// 删除弹幕
export const deleteBarrages = query => {
  return request({
    url: '/barrage/deleteBarrages',
    method: 'post',
    data: query
  });
};

// 更新弹幕
export const updateBarrage = query => {
  return request({
    url: '/barrage/updateBarrage',
    method: 'post',
    data: query
  });
};

// 获取弹幕列表
export const fetchBarrage = queryBarrage => {
  return request({
    url: '/barrage/barrages',
    method: 'get',
    params: queryBarrage
  });
};

// 获取数据列表
export const fetchBook = queryBook => {
  return request({
    url: '/book/listBooks',
    method: 'get',
    params: queryBook
  })
};

//登录
export const login = loginParam => {
  return request({
    url: '/login/doLogin',
    method: 'POST',
    data: loginParam
  });
}

export const logout = logout => {
  return request({
    url: '/login/logout',
    method: 'post',
    data: logout
  })
}

export const isLogin = query => {
  return request({
    url: '/login/isLogin',
    method: 'get',
    params: query
  })
}

// 获取用户列表
export const fetchUser = query => {
  return request({
    url: '/user/list',
    method: 'get',
    params: query
  })
};

// 更新用户
export const updateUser = query => {
  return request({
    url: '/user/updateUser',
    method: 'post',
    data: query
  })
};

// 获取数据列表
export const deleteUser = query => {
  return request({
    url: '/user/deleteUser',
    method: 'post',
    data: query
  })
};

// 获取当前登录用户书架列表(后台用)
export const userFavorites = query => {
  return request({
    url: '/favorite/userFavorites',
    method: 'get',
    params: query
  })
};

// 删除当前登录用户书架列表(后台用)
export const deleteFavorites = query => {
  return request({
    url: '/favorite/deleteFavorites',
    method: 'post',
    data: query
  })
};

// 获取当前登录用户书架列表(前台用)
export const listFavoriteBookVo = query => {
  return request({
    url: '/favorite/listFavoriteBookVo',
    method: 'get',
    data: query
  })
};