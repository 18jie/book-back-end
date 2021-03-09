import request from '../utils/request';
import axios from 'axios'

export const fetchData = query => {
  return request({
    url: '/book/listBooks',
    method: 'get',
    params: query
  });
};

export const unUpBook = query => {
  return request({
    url: '/book/unUpBook',
    method: 'post',
    data: query
  });
};

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